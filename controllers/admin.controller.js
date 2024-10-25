import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";
import { generateToken } from "../utils/token.js";

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    return res.status(200).json(admins);
  } catch (error) {
    console.error(`Error in [getAllAdmins] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin)
      return res
        .status(400)
        .json({ message: "Електронна пошта вже використовується" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      role: "admin",
    });

    if (newAdmin) {
      await newAdmin.save();
      generateToken(newAdmin._id, res);
      return res.status(201).json({
        _id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
        message: "Admin created successfully",
      });
    } else {
      return res.status(400).json({ error: "Admin creation failed" });
    }
  } catch (error) {
    console.error(`Error in [createAdmin] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    if (updates.email) {
      if (updates.email === admin.email) {
        return res
          .status(400)
          .json({ error: "New email is the same as the current email" });
      }

      const emailExists = await Admin.findOne({ email: updates.email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error(`Error in [updateAdmin] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;

  try {
    if (adminId !== id) {
      return res
        .status(403)
        .json({ message: "You can only delete your own account." });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(`Error in [deleteAdmin] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
