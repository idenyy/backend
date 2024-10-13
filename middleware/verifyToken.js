import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//   const cookies = cookie.parse(
//     req.headers.cookie || req.headers.authorization?.split(" ")[1],
//   );
//
//   const token = cookies.jwt;
//
//   if (!token) {
//     return res.status(401).json({ message: "Authentication required" });
//   }
//
//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = user;
//
//     next();
//   } catch (error) {
//     console.log(`Error in [verifyToken] controller: ${error.message}`);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Розшифровка токена
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
