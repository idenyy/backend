import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";

export const signup = async (req, res) => {
  try {
    const { name, surname, email, phone_number, password } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const user = await User.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (user)
      return res
        .status(400)
        .json({ error: "Email or phone number already exists" });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      surname,
      email,
      phone_number,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        phone_number: newUser.phone_number,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error(`Error in [signup] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || "",
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone_number: user.phone_number,
    });
  } catch (error) {
    console.error(`Error in [login] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(`Error in [logout] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const authCheck = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    console.error(`Error in [getMe] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
