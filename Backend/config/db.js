import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://greatstack:11082005@cluster0.zihgufg.mongodb.net/12H_Food_Delivery')
    .then(() => console.log("DB Connected"));
};