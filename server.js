import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectMongoDB from "./db/connectMongoDB.js";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import productRoute from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://tattoo-shop-801cb78430a8.herokuapp.com",
      "https://k3nxxx.github.io/react-tattoo-shop",
    ],
    credentials: true, // Якщо використовуєте cookie
  }),
);

app.get("/", (req, res) => {
  res.send("Server is working...");
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/admin", adminRoute);
app.use("/products", productRoute);

app.listen(PORT, () => {
  connectMongoDB();
  console.log(`Server is running on port ${PORT}`);
});
