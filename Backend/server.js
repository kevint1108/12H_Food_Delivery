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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Giống GreatStack: cho phép Frontend và Admin gọi API
app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true
  })
);


app.use(
  "/images",
  express.static(path.join(__dirname, "uploads"))
);


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
// Vercel tự quản lý Express Function.
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(
      `Server started on http://localhost:${port}`
    );
  });
}

// Bắt buộc cho Vercel
export default app;