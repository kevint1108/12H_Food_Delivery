import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing");
    }

    connectionPromise = mongoose.connect(mongoUri);
  }

  try {
    await connectionPromise;

    console.log("DB Connected");

    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
};