import User from "../models/user.model.js";

export const addToCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId, quantity } = req.body;

    const user = await User.findById(userId);

    console.log(userId);
    console.log(user);

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId,
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ message: "Product added to cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { productId } = req.params;

    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId,
    );

    await user.save();
    res.json({ message: "Product removed from cart.", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const placeOrder = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const user = await User.findById(userId).populate("cart.product");
    const totalAmount = user.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );

    console.log(user);

    const order = {
      items: user.cart,
      totalAmount,
      status: "pending",
    };

    user.orders.push(order);
    user.cart = [];
    await user.save();

    res.json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
