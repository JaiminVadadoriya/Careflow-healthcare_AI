import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true, trim: true },
    dob: { type: Date, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    contact_info: {
      phone: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, "Please provide a valid 10-digit phone number"],
      },
      address: { type: String, required: true },
      email: {
        type: String,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      },
    },

    emergency_contact: {
      name: { type: String, required: true },
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please provide a valid emergency phone number"],
      },
      relation: { type: String, required: true },
    },

    admission_date: {
      type: Date,
      default: Date.now,
    },

    discharge_date: {
      type: Date,
    },

    current_status: {
      type: String,
      enum: ["admitted", "discharged", "icu", "isolation"],
      default: "admitted",
    },

    assigned_doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    medical_history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord",
      },
    ],

    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    assigned_nurse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    refreshToken: { type: String },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.refreshToken;
      },
    },
  }
);

// 🔒 Hash password before save
PatientSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// 🔐 Password compare method
PatientSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 🎫 Access Token
PatientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "patient",
      full_name: this.full_name,
      email: this.contact_info.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || "15m",
    }
  );
};

// 🔁 Refresh Token
PatientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "patient",
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || "7d",
    }
  );
};

// 🔍 Index on phone for faster search
PatientSchema.index({ "contact_info.phone": 1 }, { unique: true });

export default mongoose.model("Patient", PatientSchema);
