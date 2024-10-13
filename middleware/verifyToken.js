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
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "No access" });
    }
  } else {
    res.status(500).json({ message: "No access" });
  }
};
