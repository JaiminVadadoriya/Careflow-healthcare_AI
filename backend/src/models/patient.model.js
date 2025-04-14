import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    dob: { type: Date, required: true }, // Date of birth (required)
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    contact_info: {
      phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, "Please provide a valid phone number"],
      },
      address: { type: String, required: true },
      email: {
        type: String,
        match: [/\S+@\S+\.\S+/, "Please provide a valid email address"],
      },
    },
    emergency_contact: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      relation: { type: String, required: true },
    },
    admission_date: { type: Date, default: Date.now }, // Default to current date if not provided
    discharge_date: { type: Date },
    current_status: {
      type: String,
      enum: ["admitted", "discharged", "icu", "isolation"],
      default: "admitted",
    },
    assigned_doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Ensure that doctor is required
    medical_history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MedicalRecord",
      },
    ],
    password: { type: String, required: true, minlength: 6 }, // Password field (hashed, required, and minimum length)
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Ensure to hash the password before saving
PatientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare passwords
PatientSchema.methods.isPasswordCorrect = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

PatientSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: "patient",
      full_name: this.full_name,
      email: this.contact_info.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }
  );
};

PatientSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id, role: "patient" },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
};

// Export the Patient model as an ES module
export default mongoose.model("Patient", PatientSchema);
