import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI environment variable is missing"
    );
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUri)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;

  console.log("DB Connected");

  return mongoose.connection;
};