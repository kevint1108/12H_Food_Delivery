import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 4000;

const __filename = fileURLToPath(
  import.meta.url
);

const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);

// Chỉ phù hợp với ảnh đã có sẵn trong deployment.
// Ảnh mới upload không được lưu bền vững trên Vercel.
app.use(
  "/images",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Route này không cần MongoDB.
// Dùng để kiểm tra Vercel đã chạy Express chưa.
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "12H Food Delivery API Working"
  });
});

app.get("/health", (req, res) => {
  return res.json({
    success: true,
    status: "healthy",
    mongoUriConfigured:
      Boolean(process.env.MONGO_URI),
    stripeConfigured:
      Boolean(
        process.env.STRIPE_SECRET_KEY
      ),
    frontendUrlConfigured:
      Boolean(process.env.FRONTEND_URL)
  });
});

// Mọi /api request phải kết nối DB trước.
// DB lỗi sẽ trả JSON, không để query chờ rồi timeout.
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    return next();
  } catch (error) {
    console.error(
      "DATABASE CONNECTION ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV ===
        "production"
          ? "Database connection failed"
          : error.message
    });
  }
});

app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

app.use((error, req, res, next) => {
  console.error("BACKEND ERROR:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message:
      error.message ||
      "Internal server error"
  });
});

// Chỉ chạy server liên tục trên máy local.
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server started on http://localhost:${port}`
    );
  });
}

// Vercel sử dụng Express app này.
export default app;