import mongoose from "mongoose";

let connectionPromise = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(
      "mongodb+srv://greatstack:King%4012345@cluster0.zihgufg.mongodb.net/12H_Food_Delivery"
    );
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
