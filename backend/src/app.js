import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

// Import routes using import
import appointmentRoutes from "./routes/appointment.routes.js";
import patientRoutes from "./routes/patient.routes.js";
import userRoutes from "./routes/user.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import bedsRoutes from "./routes/bed.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import receptionistRoutes from "./routes/receptionist.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ["http://localhost:4200", "http://localhost:5173"],
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
app.use(`/api/${apiVersion}/inventory`, inventoryRoutes); // Assuming doctor routes are under userRoutes
app.use(`/api/${apiVersion}/beds`, bedsRoutes); 
app.use(`/api/${apiVersion}/dashboard`, dashboardRoutes);
app.use(`/api/${apiVersion}/receptionist`, receptionistRoutes);
app.use(`/api/${apiVersion}/doctor`, doctorRoutes); // New dedicated route

// app.use(`/api/${apiVersion}/users`, userRouter);

import { errorHandler } from "./middlewares/error.middleware.js";
app.use(errorHandler);

export { app };
