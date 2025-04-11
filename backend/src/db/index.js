import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js'; // Use `import` for ES Module

const connectDB = async () => {
  try {
    const connectionInstant = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`\nMongoDB connected: ${connectionInstant.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};


export default connectDB;