# CareFlow Healthcare AI

CareFlow is a comprehensive Hospital Resource Management Platform designed to streamline operations for doctors, nurses, receptionists, and administrators. It features a robust **Node.js/Express Backend** and a modern **Angular 21 Frontend**.

**Project Masterplan**: See [MASTERPLAN.md](./MASTERPLAN.md) for the high-level vision, target audience, and detailed feature list.

## 🏗 Architecture Overview

The entire application has been refactored to strictly follow **Object-Oriented Programming (OOP)** principles.

### Backend (`/backend`)
-   **Class-Based Architecture**: Controllers `(UserController)`, Services `(UserService)`, and Middleware `(AuthMiddleware)` are implemented as classes.
-   **Security**: Role-Based Access Control (RBAC) via JWT.
-   **Database**: MongoDB with Mongoose.

### Frontend (`/frontend`)
-   **Angular 18**: Uses Standalone Components.
-   **OOP Patterns**:
    -   **Inheritance**: Generic `BaseDataService` for all API interactions.
    -   **Composition**: Reusable `DashboardLayoutComponent` for consistent UI.
-   **UI/UX**: Material 3 Design + Tailwind CSS.

## 🚀 Quick Start Guide

To run the full application, you will need two terminal windows.

### 1. Start the Backend
```bash
cd frontend
npm run start:backend
```
*Server runs on `http://localhost:8000`*

### 2. Start the Frontend
```bash
cd frontend
npm install  # First time only
npm start
```
*Application runs on `http://localhost:4200`*


## 📚 Documentation
-   [Backend Documentation](./backend/README.md)
-   [Frontend Documentation](./frontend/README.md)
-   [Project Masterplan](./MASTERPLAN.md)

## 🛠 Tech Stack
-   **Runtime**: Node.js v22
-   **Language**: JavaScript (Backend), TypeScript (Frontend)
-   **Database**: MongoDB
-   **Frontend Framework**: Angular 21
-   **Styling**: SCSS/CSS, Tailwind, Material 3
