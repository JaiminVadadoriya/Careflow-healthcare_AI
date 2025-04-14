import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// Import routes using import
import appointmentRoutes from "./routes/appointment.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes declaration
const apiVersion = "v1";

// Routes
app.use(`/api/${apiVersion}/users`, userRoutes);
app.use(`/api/${apiVersion}/appointments`, appointmentRoutes);
app.use(`/api/${apiVersion}/patients`, patientRoutes);

// app.use(`/api/${apiVersion}/users`, userRouter);

export { app };
