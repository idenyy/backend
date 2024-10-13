import jwt from "jsonwebtoken";
import cookie from "cookie";

export const verifyToken = (req, res, next) => {
  const cookies = cookie.parse(req.headers.cookie || "");

  const token = cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    next();
  } catch (error) {
    console.log(`Error in [verifyToken] controller: ${error.message}`);
    return res.status(401).json({ message: "Invalid token" });
  }
};
