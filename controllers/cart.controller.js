import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

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

    const orderItems = user.cart.map((item) => ({
      product: item.product.toObject(),
      quantity: item.quantity,
    }));

    const order = {
      id: new mongoose.Types.ObjectId(),
      items: orderItems,
      totalAmount,
      status: "pending",
      orderDate: new Date(),
    };

    user.orders.push(order);
    user.cart = [];
    await user.save();

    res.json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
