
import dotenv from "dotenv"
import mongoose from "mongoose";
import connectDB from "../db/index.js";
import User from "../models/user.model.js";

dotenv.config({ path: './.env' }); // Adjust path if needed, assuming run from backend root or via npm script

const createAdmin = async () => {
    try {
        await connectDB();

        const adminEmail = "admin@careflow.com";
        const existingAdmin = await User.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const newAdmin = new User({
            full_name: "System Admin",
            email: adminEmail,
            password: "jaimin@123", // Will be hashed by pre-save hook
            role: "admin",
            phone: "0000000000",
            gender: "Male", // Required by schema if strict, adding just in case
            dob: new Date("1980-01-01")
        });

        await newAdmin.save();
        console.log("Admin user created successfully !!!");
        console.log("Email: admin@careflow.com");
        console.log("Password: jaimin@123");

    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin();
