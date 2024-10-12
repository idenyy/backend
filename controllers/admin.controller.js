import bcrypt from "bcryptjs";
import Admin from "../models/admin.model.js";

export const createAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Only admins can create new admins." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    return res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error(`Error in [createAdmin] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
