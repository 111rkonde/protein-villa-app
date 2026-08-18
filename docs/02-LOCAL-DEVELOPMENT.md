# 💻 Local Development & Setup Guide

This step-by-step guide explains how to install dependencies, initialize the database, start the development servers, and test the Protein Villa application locally.

---

## 1. Prerequisites

Ensure you have the following installed on your development machine:
* **Node.js:** v18.0.0 or later (v20+ recommended)
* **npm:** v9.0.0 or later
* **Git:** (optional, for version control)

Verify your environment versions:
```bash
node -v
npm -v
```

---

## 2. Step-by-Step Installation

### **Step 1: Setup the Backend**

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend/` directory (or copy from `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="protein-villa-super-secret-jwt-token-2026-secure"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
   ```

4. Generate Prisma Client and Push Schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. Seed Initial Demo Products, Users, Categories, and Coupons:
   ```bash
   npm run seed
   ```

6. Start the Backend API Server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on **`http://localhost:5000`** with live TypeScript reload via `tsx`.*

---

### **Step 2: Setup the Frontend**

1. In a new terminal window, navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the Frontend Development Server:
   ```bash
   npm run dev
   ```
   *The frontend Vite dev server will start at **`http://localhost:5173`**.*

---

## 3. Verification & Accessing the App

1. Open your web browser and navigate to:
   ```
   http://localhost:5173
   ```
2. Check backend healthcheck status:
   ```
   http://localhost:5000/api/health
   ```

---

## 4. Demo Login Accounts

You can log in directly on `/login` or click the **1-Click Demo Login** buttons:

| Account | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Demo Athlete** | `user@proteinvilla.demo` | `User@12345` | `USER` |
| **Demo Admin / Owner** | `owner@proteinvilla.demo` | `Owner@12345` | `ADMIN` |

---

## 5. Useful NPM Scripts

### Backend Scripts (`backend/`)
* `npm run dev`: Starts the TypeScript development server with hot reloading.
* `npm run build`: Compiles TypeScript files into the `dist/` directory.
* `npm start`: Runs the compiled production JavaScript build.
* `npm test`: Runs automated Vitest test suites.
* `npm run seed`: Populates the database with initial products, coupons, and accounts.

### Frontend Scripts (`frontend/`)
* `npm run dev`: Starts Vite local development server with HMR.
* `npm run build`: Type-checks and creates an optimized production bundle in `dist/`.
* `npm run preview`: Locally previews the production build.
