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

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// Route kiểm tra Backend.
// Route này không cần MongoDB.
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

// Mọi API request phải đợi MongoDB kết nối.
// Nếu MongoDB lỗi, trả JSON thay vì làm function crash.
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
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "production"
          ? undefined
          : error.message
    });
  }
});

// API routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Route không tồn tại
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Global error handler
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

// Chỉ mở port khi chạy local.
// Vercel tự gọi Express app.
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server started on http://localhost:${port}`
    );
  });
}

// Vercel nhận Express app tại đây.
export default app;