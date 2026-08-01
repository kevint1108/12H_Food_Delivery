import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    // Nếu Vercel đã có kết nối thì tái sử dụng,
    // không tạo thêm kết nối MongoDB.
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(
      "mongodb+srv://greatstack:King%4012345@cluster0.zihgufg.mongodb.net/12H_Food_Delivery"
    );

    console.log("DB Connected");

    return mongoose.connection;
  } catch (error) {
    console.error(
      "DB Connection Error:",
      error.message
    );

    // Không throw ra ngoài vì connectDB()
    // đang được gọi khi server khởi động.
    return null;
  }
};

