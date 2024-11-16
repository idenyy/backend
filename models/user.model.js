import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    min: 1,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone_number: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minLength: 8,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    cart: [cartItemSchema],

    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    orders: [orderSchema],
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
