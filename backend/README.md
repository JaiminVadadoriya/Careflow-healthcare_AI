# CareFlow Backend API

This is the RESTful API backend for the CareFlow Hospital Management System. Built with Node.js, Express, and MongoDB, it follows Object-Oriented Programming (OOP) principles for scalability and maintainability.

## 🏗 Architecture

The backend code is structured using `Controller`, `Service`, and `Model` layers with a Class-Based approach:

-   **Controllers**: Handle HTTP Requests/Responses. (e.g., `UserController`, `AuthController`).
-   **Services**: Encapsulate business logic. (e.g., `UserService`, `AuthService`).
-   **Models**: Mongoose schemas for MongoDB interaction.
-   **Middleware**: Reusable class-based middleware (e.g., `AuthMiddleware` for JWT authentication and RBAC).

### Key Features
-   **Authentication**: JWT-based auth with Access and Refresh tokens.
-   **RBAC**: Role-Based Access Control (Admin, Doctor, Nurse, Receptionist, Patient).
-   **Data Validation**: Secure input handling.
-   **Secure**: Uses Bcrypt for password hashing.

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18 or higher recommended, tested on v22)
-   MongoDB Atlas URI (or local MongoDB)

### Installation

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    -   Create a `.env` file in the `backend` root.
    -   Add the following variables:
        ```env
        PORT=8000
        MONGODB_URI=your_mongodb_connection_string
        CORS_ORIGIN=*
        ACCESS_TOKEN_SECRET=your_access_secret
        ACCESS_TOKEN_EXPIRY=1d
        REFRESH_TOKEN_SECRET=your_refresh_secret
        REFRESH_TOKEN_EXPIRY=10d
        CLOUDINARY_CLOUD_NAME=...
        CLOUDINARY_API_KEY=...
        CLOUDINARY_API_SECRET=...
        ```

### Running the Server

-   **Development Mode** (with Nodemon):
    ```bash
    npm run dev
    ```

-   **Production Start**:
    ```bash
    npm start
    ```

## 📂 Project Structure

```
src/
├── controllers/    # Class-based Controllers
├── services/       # Business Logic Services
├── models/         # Mongoose Models
├── routes/         # Express Routes
├── middlewares/    # Auth & Error Middleware
├── db/             # Database Connection
├── utils/          # Helper classes (ApiError, ApiResponse)
└── app.js          # Express App Setup
```

## 🔐 API Endpoints Overview

-   **Auth**: `/api/v1/users/login`, `/register`, `/logout`, `/refresh`
-   **Users**: `/api/v1/users/current-user`, `/update-account`
-   **Admin**: `/api/v1/users` (Get all users), `/api/v1/reports/*`
-   **Doctor**: `/api/v1/users/doctor/*`
-   **Nurse**: `/api/v1/users/nurse/*`
-   **Reception**: `/api/v1/users/receptionist/*`
