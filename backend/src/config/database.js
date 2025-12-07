import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI_CLOUD);
  console.log("MongoDB Connected!");
};

export default connectDB;
