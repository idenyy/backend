import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "admin",
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
