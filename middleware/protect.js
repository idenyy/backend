import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

export const protect = async (req, res, next) => {
  try {
    const token =
      req.cookies.jwt ||
      (req.headers.authorization || "").replace(/Bearer\s?/, "");

    if (!token)
      return res.status(401).json({ error: "Unauthorized: No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded)
      return res.status(401).json({ error: "Unauthorized: Invalid token" });

    let user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      user = await Admin.findById(decoded.userId).select("-password");

      if (!user) return res.status(404).json({ error: "Admin not found" });
    }

    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.error(`Error in [protect] middleware: ${error.message}`);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
