import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const getProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findOne({ userId }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error in [getProfile] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  const { name, surname, email, phone_number, currentPassword, newPassword } =
    req.body;
  const userId = req.user._id;

  try {
    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if ((!newPassword && currentPassword) || (!currentPassword && newPassword))
      return res.status(400).json({
        error: "Please provide both [current password] and [new password]!",
      });

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return res.status(400).json({
          error: "Current password is incorrect",
        });

      if (newPassword.length < 8) {
        return res
          .status(400)
          .json({ error: "Password must be at least 8 characters" });
      } else if (newPassword === currentPassword) {
        return res.status(400).json({
          error: "New password cannot be the same as the current password.",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    user.name = name || user.name;
    user.surname = surname || user.surname;
    user.email = email || user.email;
    user.phone_number = phone_number || user.phone_number;

    user = await user.save();

    user.password = null;

    return res.status(200).json(user);
  } catch (error) {
    console.error(`Error in [updateProfile] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteProfile = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ message: "User profile deleted successfully" });
  } catch (error) {
    console.error(`Error in [deleteProfile] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addFavoriteProduct = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return res.status(404).json({ message: "Product not found", productId });
    }

    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    user.favorites.push(productId);
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to favorites", productId });
  } catch (error) {
    console.error(`Error in [addFavoriteProduct] controller: ${error.message}`);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeFavoriteProduct = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User favorites:", user.favorites);
    console.log("Product ID to remove:", productId);

    if (!user.favorites.map((arr) => arr.toString()).includes(productId)) {
      return res
        .status(400)
        .json({ message: "Product not in favorites", productId });
    }

    user.favorites = user.favorites.filter(
      (favProductId) => favProductId.toString() !== productId,
    );

    await user.save();

    return res
      .status(200)
      .json({ message: "Product removed from favorites", productId });
  } catch (error) {
    console.error(
      `Error in [deleteFavoriteProduct] controller: ${error.message}`,
    );
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
