# 🏋️ Protein Villa — Production 3-Tier Web Application

> **Tagline:** *"Fuel Your Goals. Build Your Best Self."*  
> **A complete, production-grade 3-tier e-commerce and fitness technology web application for premium supplements, 3D visualization, nutrition tracking, and authenticity verification.**

---

## 🌟 Application Overview

**Protein Villa** is an enterprise-grade, responsive full-stack fitness and sports nutrition web platform. Built with cutting-edge web technologies, it features an interactive **Three.js 3D supplement jar visualizer**, **ISSN-standard protein goal calculators**, **body metric analysis (BMI/BMR/TDEE)**, a **daily protein tracker with consistency streaks and gamified badges**, a **custom monthly supplement stack builder**, **PV Verify™ HPLC batch purity certification**, and a **secure multi-step checkout workflow with live order tracking**.

---

## 🏗️ 3-Tier Architecture

```mermaid
graph TD
    subgraph Tier 1: Presentation Layer
        A[React 18 + TypeScript + Vite]
        B[Tailwind CSS + Dark/Light Theme]
        C[Three.js / React Three Fiber / Drei 3D Viewer]
        D[Recharts + Canvas Confetti]
    end

    subgraph Tier 2: Application Layer
        E[Node.js + Express.js + TypeScript]
        F[JWT Authentication & RBAC]
        G[Zod Request Validation]
        H[REST APIs: Products, Cart, Orders, Calculators, Tracker, Admin]
    end

    subgraph Tier 3: Database & Persistence Layer
        I[Prisma ORM]
        J[Relational Database: SQLite / PostgreSQL Ready]
        K[16 Relational Models & Foreign Key Constraints]
    end

    Tier 1 -->|Axios REST API / CORS| Tier 2
    Tier 2 -->|Prisma Client Queries| Tier 3
```

### **Tier 1 — Presentation Layer (Frontend)**
* **Framework:** React 18 + TypeScript + Vite
* **Styling:** Tailwind CSS with custom neon accents, glassmorphism, responsive grid systems, and dark/light mode toggle.
* **3D Visualizer:** Three.js, `@react-three/fiber`, and `@react-three/drei` for interactive 360° product rotation, metallic rendering, and wireframe analysis.
* **State Management:** React Context API (`AuthContext`, `CartContext`, `WishlistContext`, `CompareContext`, `ThemeContext`, `ToastContext`).
* **Icons & Visuals:** Lucide React, Canvas Confetti, and Recharts.

### **Tier 2 — Application Layer (Backend)**
* **Runtime & Framework:** Node.js, Express.js, TypeScript.
* **Security & Auth:** JSON Web Tokens (JWT), Bcrypt password hashing, Helmet, CORS, and Express Rate Limiting.
* **Role-Based Access Control (RBAC):** `authenticateUser` and `authorizeRoles('ADMIN')` middleware guards.
* **Validation:** Strict request body validation via Zod schemas.
* **Business Logic Services:** Dedicated service layers for Auth, Products, Categories, Brands, Cart, Orders, Reviews, Coupons, Calculators, Daily Tracker, Product Authenticity, and Admin Telemetry.

### **Tier 3 — Data Layer (Database)**
* **ORM:** Prisma ORM with type-safe schema and client generation.
* **Database Models (16 Tables):** `User`, `Address`, `Category`, `Brand`, `Product`, `ProductVariant`, `Cart`, `CartItem`, `Wishlist`, `Order`, `OrderItem`, `Review`, `Coupon`, `ProteinGoal`, `ProteinLog`, `VerificationCode`, `InventoryLog`, `AdminActivity`, `Notification`.
* **Zero-config Local Execution:** Pre-configured SQLite database at `backend/prisma/dev.db` with full PostgreSQL schema portability.

---

## 🔑 Demo Accounts & 1-Click Login

The application provides dedicated demo credentials with **1-Click Quick Login buttons** on the `/login` page:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Normal Athlete / User** | `user@proteinvilla.demo` | `User@12345` | Shop, Cart, Checkout, Order Tracking, Calculators, Daily Protein Tracker, Wishlist, Profile |
| **Shop Owner / Admin** | `owner@proteinvilla.demo` | `Owner@12345` | Full Admin Console (`/admin`), Product CRUD, 3D Color Config, Inventory Restock, Order Fulfillment, Coupon Creation |

*Alternative alias accounts configured:* `user@proteinvilla.com` (`User@123`) & `owner@proteinvilla.com` (`Owner@123`).

---

## ⚡ Key Features & Innovative Modules

### 1. 🥫 Interactive 3D Supplement Jar Visualizer
* Realistic 3D cylindrical jar rendered with procedural metallic textures, screw-top lid, and embossed brand typography.
* Orbit controls: 360° free rotation, zoom, preset views (Front, Top, Isometric, Back Label), wireframe mode, and 2D photo fallback.

### 2. 🎯 ISSN-Standard Protein Goal Calculator
* Calculates daily protein targets (in grams/day) based on bodyweight, biological sex, age, activity level, and goals (*Muscle Gain, Fat Loss, Aggressive Bulk, Endurance*).
* Computes per-meal distribution (*Breakfast, Lunch, Post-Workout, Dinner, Snacks*).
* Authenticated users can save their calculated target directly to their fitness profile with 1 click.

### 3. 📊 Body & Macro Engine (BMI / BMR / TDEE)
* **BMI Indicator:** Body mass index with color-coded classification and healthy weight guidance.
* **BMR & TDEE:** Basal metabolic rate and total daily maintenance calories via Mifflin-St Jeor equation.
* **Macro Split Breakdown:** Protein, Carbohydrate, and Fat distribution in grams and percentage bars.

### 4. 📈 Daily Protein & Streak Tracker
* Circular radial progress ring tracking today's protein target (*e.g. 95g / 140g, 68%*).
* 1-Click quick presets (*1 Scoop Whey Isolate [+28g], Peanut Butter [+10g], Protein Bar [+20g], 4 Eggs [+24g]*).
* Past 7-day consistency chart and unbroken streak counter.
* Unlocks gamified fitness badges (*First Scoop, Consistency King, 7-Day Iron Streak, Protein Master*).
* Celebratory confetti animation on hitting the daily goal.

### 5. 📦 Custom Supplement Stack Builder
* Select supplements by training goal (*Hypertrophy, Lean Shred, Caloric Surplus, Peak Endurance*).
* Calculates monthly investment and applies an automated **18% bundle discount**.
* Displays daily cost breakdown (*e.g. "Only ₹195/day for your complete protocol"*).
* 1-Click bundle addition to cart.

### 6. 🕒 Smart 24-Hour Nutrient Timing Schedule
* Chronological schedule guiding athletes on morning vitality, pre-workout ignition, intra-workout anti-catabolism, post-workout anabolism, and nocturnal casein recovery.

### 7. 🛡️ PV Verify™ Product Authenticity Check
* Anti-counterfeit verification portal allowing customers to enter their 12-digit jar serial code (*e.g. `PV-ISO-99824`*).
* Displays 3rd-party NABL-accredited **HPLC Protein Purity test results**, batch numbers, manufacturing/expiry dates, heavy metal contamination scans, and WADA anti-doping clearance.

### 8. 🛍️ E-Commerce, Multi-Step Checkout & Logistics
* Faceted catalog filtering (Category, Brand, Goal, Price Slider, Rating, In-Stock).
* Slide-out cart drawer with dynamic free shipping progress bar (*Free shipping threshold: ₹999*).
* Promo code support with instant discount deduction (*e.g. `WELCOME10`, `PROTEIN20`, `VILLA15`, `FITNESS100`*).
* Multi-step checkout wizard (*Address ➔ Delivery ➔ Payment ➔ Review & Confirm*).
* Live order tracking timeline (*Order Placed ➔ Confirmed ➔ Packed ➔ Shipped ➔ Delivered*).

### 9. 👑 Admin Dashboard & Operations Console
* Financial KPIs: Total Revenue, Total Orders, Active Users, Low Stock Alerts.
* Recharts monthly sales graph and fulfillment status distribution.
* Product CRUD management modal with 3D model color hex picker and nutrition inputs.
* Real-time warehouse inventory restock controls (`+10`, `+50` stock adjustments).
* Order fulfillment status updater (`PENDING` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `DELIVERED`).
* Promo coupon generator with discount percentage and minimum spend rules.

---

## 🚀 Quickstart Guide

### Prerequisites
* **Node.js:** v18+ (tested on Node v24.14.0)
* **npm:** v9+ (tested on npm 11.9.0)

### 1. Clone & Install Dependencies

```bash
# Backend Setup
cd backend
npm install

# Initialize database schema & seed demo data
npx prisma db push
npm run seed

# Start Backend Server (Runs on http://localhost:5000)
npm run dev
```

```bash
# In a second terminal: Frontend Setup
cd frontend
npm install

# Start Frontend Dev Server (Runs on http://localhost:5173)
npm run dev
```

Open your browser at **`http://localhost:5173`** to access Protein Villa.

---

## 🧪 Automated Testing

The backend includes test suites verifying authentication guards, RBAC authorization, and nutritional formulas:

```bash
cd backend
npm test
```

**Test Results:**
* `tests/calculator.test.ts` — 100% passing (Harris-Benedict BMR, TDEE, ISSN protein targets)
* `tests/auth.test.ts` — 100% passing (JWT login, admin RBAC guards, 401 unauthenticated, 403 forbidden user tests)

---

## 🐳 Docker & Docker Compose Deployment

Run the complete multi-container stack with a single command:

```bash
docker-compose up --build -d
```

* **Frontend:** Accessible at `http://localhost:3000`
* **Backend API:** Accessible at `http://localhost:5000`

---

## ☸️ Kubernetes & AWS Cloud Deployment

* **Kubernetes Manifests:** All production manifests are located in [`k8s/`](./k8s/) and can be deployed with `kubectl apply -k k8s/`.
* **AWS Cloud Deployment:** Follow the complete step-by-step AWS guide in [`docs/08-AWS-DEPLOYMENT.md`](./docs/08-AWS-DEPLOYMENT.md) for deploying on **Amazon EKS**, **AWS ECS Fargate**, **Amazon RDS PostgreSQL**, **Amazon ECR**, and **Amazon CloudFront CDN**.

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck endpoint | No |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login with email and password | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | User / Admin |
| `PUT` | `/api/auth/profile` | Update user fitness metrics | User / Admin |
| `GET` | `/api/products` | Query products with filters, sorting & pagination | No |
| `GET` | `/api/products/:id` | Get product details by ID or slug | No |
| `GET` | `/api/products/recommendations` | Get goal-based product recommendations | No |
| `GET` | `/api/categories` | List all product categories | No |
| `GET` | `/api/brands` | List all supplement brands | No |
| `GET` | `/api/cart` | Retrieve current cart | Session / User |
| `POST` | `/api/cart/items` | Add product variant to cart | Session / User |
| `PUT` | `/api/cart/items/:id` | Update cart item quantity | Session / User |
| `DELETE`| `/api/cart/items/:id` | Remove item from cart | Session / User |
| `POST` | `/api/cart/coupon` | Apply promo coupon code | Session / User |
| `POST` | `/api/orders` | Create new checkout order | Guest / User |
| `GET` | `/api/orders/my-orders` | Fetch user's order history | User / Admin |
| `GET` | `/api/orders/track/:code`| Track order status & timeline | No |
| `POST` | `/api/calculators/protein`| Calculate daily protein requirement | No |
| `POST` | `/api/calculators/fitness`| Calculate BMI, BMR, TDEE & macro splits | No |
| `GET` | `/api/tracker/daily` | Get today's logged protein & streak | User / Admin |
| `POST` | `/api/tracker/logs` | Log a meal or shake | User / Admin |
| `DELETE`| `/api/tracker/logs/:id`| Delete a logged meal entry | User / Admin |
| `GET` | `/api/verify/:code` | Verify product authenticity code & lab test | No |
| `GET` | `/api/admin/analytics` | Store analytics, revenue & order stats | Admin Only |
| `POST` | `/api/products` | Create supplement (Admin) | Admin Only |
| `PUT` | `/api/products/:id` | Update supplement & 3D config (Admin) | Admin Only |
| `DELETE`| `/api/products/:id` | Delete supplement (Admin) | Admin Only |
| `GET` | `/api/admin/orders` | List customer orders (Admin) | Admin Only |
| `PUT` | `/api/admin/orders/:id/status` | Update order status (Admin) | Admin Only |
| `PUT` | `/api/admin/inventory/:id` | Adjust inventory stock levels (Admin) | Admin Only |
| `GET` | `/api/coupons` | List all promo coupons | Admin Only |
| `POST` | `/api/coupons` | Create promotional discount coupon | Admin Only |

---

## 🔒 Security Architecture

1. **Password Hashing:** Bcrypt with 10 salt rounds.
2. **JWT Authentication:** Signed tokens with strict expiration and authorization checks.
3. **Role-Based Access Control (RBAC):** Granular middleware protecting all `/api/admin/*` routes.
4. **Input Sanitization & Validation:** Zod schema validation on every mutation endpoint.
5. **Rate Limiting:** Protection against brute-force attacks on auth endpoints.
6. **CORS & Headers:** Secure origin restrictions with Helmet HTTP headers.

---

## 📜 License & Acknowledgments

* **Project:** Protein Villa 3-Tier Web Application
* **Designed & Engineered for:** Modern fitness athletes, coaches, and sports nutrition enthusiasts.
* **Currency:** Indian Rupees (`₹` INR).
