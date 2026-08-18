# 🗄️ Database & Seeding Guide

This guide explains the relational schema design, Prisma ORM operations, database migrations, and how to transition from local SQLite to a production PostgreSQL/MySQL database.

---

## 1. Relational Schema Architecture

The database schema is defined in [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) and consists of 16 relational models:

```mermaid
erDiagram
    USER ||--o{ ADDRESS : has
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    USER ||--o{ WISHLIST : saves
    USER ||--o{ PROTEIN_LOG : logs
    USER ||--o| PROTEIN_GOAL : sets
    USER ||--o| CART : owns
    
    CATEGORY ||--o{ PRODUCT : categorizes
    BRAND ||--o{ PRODUCT : manufactures
    PRODUCT ||--o{ PRODUCT_VARIANT : has
    PRODUCT ||--o{ REVIEW : receives
    PRODUCT ||--o{ CART_ITEM : included_in
    PRODUCT ||--o{ ORDER_ITEM : ordered_in
    
    CART ||--o{ CART_ITEM : contains
    ORDER ||--o{ ORDER_ITEM : contains
    COUPON ||--o{ ORDER : applied_to
```

---

## 2. Model Catalog

| Model | Table Name | Purpose |
| :--- | :--- | :--- |
| `User` | `User` | User profile, authentication credentials, role (`USER` / `ADMIN`), fitness metrics |
| `Address` | `Address` | Shipping and delivery addresses for checkout |
| `Category` | `Category` | Supplement categories (Whey, Mass Gainers, Creatine, Pre-Workout, etc.) |
| `Brand` | `Brand` | Supplement manufacturers and brand metadata |
| `Product` | `Product` | Products with rich nutrition JSON, prices, stock, ratings, and 3D configs |
| `ProductVariant`| `ProductVariant` | Flavor and size combinations |
| `Cart` | `Cart` | User and guest active carts |
| `CartItem` | `CartItem` | Line items with selected flavors, sizes, quantities |
| `Wishlist` | `Wishlist` | Saved products for later purchase |
| `Order` | `Order` | Confirmed customer purchases, shipping addresses, payment status |
| `OrderItem` | `OrderItem` | Snapshot of purchased product specifications and prices |
| `Review` | `Review` | Customer star ratings, verified purchase tags, and testimonials |
| `Coupon` | `Coupon` | Promo discount codes and minimum spend rules |
| `ProteinGoal` | `ProteinGoal` | Calculated daily target grams, per-meal breakdown, activity levels |
| `ProteinLog` | `ProteinLog` | Daily logged meal and shake entries with protein amounts |
| `VerificationCode`| `VerificationCode` | 12-digit HPLC batch test certificates and scan tracking |

---

## 3. Prisma Commands Reference

Run these commands inside the `backend/` directory:

### Generate Prisma Client
```bash
npx prisma generate
```

### Push Schema to Database (Zero Migration Friction)
```bash
npx prisma db push
```

### Run Seed Script
```bash
npm run seed
```

### Open Prisma Studio (Web Database GUI)
```bash
npx prisma studio
```
*Opens interactive database management at `http://localhost:5555`.*

---

## 4. Transitioning to Production PostgreSQL

By default, the application is configured with SQLite for zero-setup execution. To switch to **PostgreSQL**:

1. In `backend/prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update your `DATABASE_URL` in `backend/.env` or Kubernetes secrets:
   ```env
   DATABASE_URL="postgresql://pv_admin:SecurePassword123@postgres-host:5432/proteinvilla?schema=public"
   ```

3. Create the database migration:
   ```bash
   npx prisma migrate dev --name init
   ```

4. Populate the production database with seed data:
   ```bash
   npm run seed
   ```
