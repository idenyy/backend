import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";

import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

export const signup = async (req, res) => {
  try {
    const { name, surname, email, phone_number, password, role } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email format" });

    const user = await User.findOne({
      $or: [{ email }, { phone_number }],
    });

    if (user)
      return res.status(400).json({
        error: "Електронна пошта або номер телефону вже використовуєть!",
      });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Пароль має бути не менше 8 символів!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      surname,
      email,
      phone_number,
      password: hashedPassword,
      role,
    });

    if (newUser) {
      const token = generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        token,
        _id: newUser._id,
        name: newUser.name,
        surname: newUser.surname,
        email: newUser.email,
        phone_number: newUser.phone_number,
        role: newUser.role,
      });
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.error(`Error in [signup] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//
//     const user = await User.findOne({ email });
//
//     const isPasswordCorrect = await bcrypt.compare(
//       password,
//       user?.password || "",
//     );
//
//     if (!user || !isPasswordCorrect)
//       return res
//         .status(400)
//         .json({ error: "Неправильна адреса електронної пошти або пароль!" });
//
//     generateToken(user._id, res);
//
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       surname: user.surname,
//       email: user.email,
//       phone_number: user.phone_number,
//       role: user.role,
//     });
//   } catch (error) {
//     console.error(`Error in [login] controller: ${error.message}`);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    const admin = await Admin.findOne({ username });

    const isUserPasswordCorrect = user
      ? await bcrypt.compare(password, user.password)
      : false;
    const isAdminPasswordCorrect = admin
      ? await bcrypt.compare(password, admin.password)
      : false;

    if (user && isUserPasswordCorrect) {
      const token = generateToken(user._id, res);

      return res.status(200).json({
        token,
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone_number: user.phone_number,
        role: user.role,
      });
    }

    if (admin && isAdminPasswordCorrect) {
      const token = generateToken(admin._id, res);

      return res.status(200).json({
        _id: admin._id,
        username: admin.username,
        role: admin.role,
      });
    }

    return res.status(400).json({ error: "Неправильний логін або пароль!" });
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
    const admin = await Admin.findById(req.user._id).select("-password");

    if (admin) {
      const token = generateToken(admin._id, res);
      return res.status(200).json({ token, admin: admin });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = generateToken(user._id, res);
    return res.status(200).json({ token, user });
  } catch (error) {
    console.error(`Error in [authCheck] controller: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
