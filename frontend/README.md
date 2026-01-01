# CareFlow Frontend

The frontend for the CareFlow Hospital Management System is a modern **Angular 18** application designed with **Material 3 Expressive** aesthetics and utility-first styling via **Tailwind CSS**. It interacts with the CareFlow Backend API to provide a comprehensive dashboard for hospital staff and patients.

## 🏗 Architecture

The frontend uses strict OOP principles to ensure code reuse and maintainability:

-   **BaseDataService**: Generic abstract class (`src/app/core/base-data.service.ts`) encapsulating common HTTP CRUD operations. All feature services extend this.
-   **DashboardLayoutComponent**: Reusable layout shell (`src/app/shared/layout/dashboard-layout.component.ts`) using Composition (Content Projection) to render Sidebar, Topbar, and Theme toggles uniformly across all dashboards.
-   **Guards**: `RoleGuard` ensures role-based route protection.
-   **Standalone Components**: Fully utilizes Angular's Standalone Component architecture (no NgModules for features).

### Tech Stack
-   **Framework**: Angular 18+
-   **Styling**: SCSS, Angular Material 3, Tailwind CSS
-   **State/Data**: RxJS, Services
-   **Build**: Angular CLI (with customized budgets)

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+ recommended)
-   Angular CLI (`npm install -g @angular/cli`)

### Installation

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Environment Configuration:
    -   Check `src/environments/environment.ts` to ensure `apiUrl` points to your backend (default `http://localhost:8000/api/v1`).

### Running the Application

-   **Development Server**:
    ```bash
    npm start
    # or
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The app automatically reloads on changes.

-   **Production Build**:
    ```bash
    npm run build
    ```
    Artifacts will be stored in `dist/`.

## 📂 Project Structure

```
src/
├── app/
│   ├── core/           # Singleton services, Guards, Interceptors
│   │   ├── auth/       # AuthService, RoleGuard
│   │   └── base-data.service.ts # Base Generic Service
│   ├── features/       # Feature Modules (Pages)
│   │   ├── admin-dashboard/
│   │   ├── doctor-dashboard/
│   │   ├── nurse-dashboard/
│   │   └── receptionist-dashboard/
│   ├── shared/         # Reusable Components (Layout, UI)
│   │   └── layout/     # DashboardLayoutComponent
│   └── app.routes.ts   # Main Routing Config
├── assets/             # Images, Icons
├── styles.css         # Global Styles (Tailwind imports)
└── m3-theme.scss       # Angular Material 3 Theme Definition
```
