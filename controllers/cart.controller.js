import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found." });
    }

    const cartItem = user.cart.find(
      (item) => item.product._id.toString() === productId,
    );

    if (!cartItem) {
      user.cart.push({ product: product, quantity });
    } else {
      cartItem.quantity += quantity;
    }

    await user.save();
    res.json({ message: "Product Added to Cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }

    user.cart = user.cart.filter(
      (item) => item.product._id.toString() !== productId,
    );

    await user.save();
    res.json({ message: "Product removed from cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const user = await User.findById(userId).populate("cart.product");

    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }

    const cartItems = user.cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
    }));

    res.json({ cart: cartItems });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const placeOrder1 = async (req, res) => {
//   try {
//     const { _id: userId } = req.user;
//
//     const user = await User.findById(userId).populate("cart.product");
//     const totalAmount = user.cart.reduce(
//       (sum, item) => sum + item.product.price * item.quantity,
//       0,
//     );
//
//     const orderItems = user.cart.map((item) => ({
//       product: item.product.toObject(),
//       quantity: item.quantity,
//     }));
//
//     const order = {
//       id: new mongoose.Types.ObjectId(),
//       items: orderItems,
//       totalAmount,
//       status: "pending",
//       orderDate: new Date(),
//     };
//
//     user.orders.push(order);
//     user.cart = [];
//     await user.save();
//
//     res.json({ message: "Order placed successfully", order });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const placeOrder = async (req, res) => {
  const { _id: userId } = req.user;
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0)
    return res
      .status(400)
      .json({ error: "Missing required fields or items array is empty" });

  for (let item of items) {
    if (!item.id || !item.name || !item.price || !item.count || !item.image)
      return res.status(400).json({ error: "Missing fields in item" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User Not Found" });

    const newOrder = {
      items: items,
    };

    user.orders.push(newOrder);
    await user.save();

    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error in place order: ", error);
  }
};
