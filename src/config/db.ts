import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
  } catch (error) {
    throw new Error(`failed to connect db ${error}`);
  }
};

export default connectDB;
