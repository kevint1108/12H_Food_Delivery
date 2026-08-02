import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// Giữ phong cách GreatStack
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// Route kiểm tra không cần MongoDB
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "12H Food Delivery API Working"
  });
});

app.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: "healthy"
  });
});

// Mọi API phải chờ MongoDB kết nối.
// Không để API query trước khi database sẵn sàng.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "DATABASE CONNECTION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// 404 phải đặt sau routes
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("BACKEND ERROR:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message:
      error.message || "Internal server error"
  });
});

// Chỉ chạy server thủ công khi phát triển local
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server started on http://localhost:${port}`
    );
  });
}

// Vercel sử dụng Express app này
export default app;