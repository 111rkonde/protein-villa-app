# 📡 REST API Reference

The backend exposes structured REST endpoints under the `/api` route prefix. All requests and responses use `application/json` format.

---

## 1. Authentication Headers

Protected routes require an Authorization Bearer token header:
```http
Authorization: Bearer <jwt-token>
```

Guest cart actions accept a session identifier:
```http
x-session-id: <guest-session-uuid>
```

---

## 2. API Endpoints Table

### **System & Health**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and server timestamp | None |

### **Authentication (`/api/auth`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | None |
| `POST` | `/api/auth/login` | Authenticate with email & password | None |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | User / Admin |
| `PUT` | `/api/auth/profile` | Update profile body metrics & fitness goals | User / Admin |
| `POST` | `/api/auth/forgot-password` | Request password reset instructions | None |

### **Product Catalog (`/api/products`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Query products with filters, sorting, search, and pagination | None |
| `GET` | `/api/products/:id` | Retrieve product details by ID or slug | None |
| `GET` | `/api/products/recommendations` | Get goal-based product recommendations | None |
| `POST` | `/api/products` | Create supplement product | Admin Only |
| `PUT` | `/api/products/:id` | Update supplement specifications and 3D config | Admin Only |
| `DELETE`| `/api/products/:id` | Delete supplement product | Admin Only |

### **Categories & Brands**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/categories` | List all categories with product counts | None |
| `GET` | `/api/brands` | List all supplement brands | None |

### **Cart (`/api/cart`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Retrieve user/guest active cart | Session / User |
| `POST` | `/api/cart/items` | Add product variant to cart | Session / User |
| `PUT` | `/api/cart/items/:id` | Update item quantity | Session / User |
| `DELETE`| `/api/cart/items/:id` | Remove item from cart | Session / User |
| `DELETE`| `/api/cart/clear` | Clear all items from cart | Session / User |
| `POST` | `/api/cart/coupon` | Apply promotional coupon code | Session / User |

### **Orders (`/api/orders`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Create new checkout order | Guest / User |
| `GET` | `/api/orders/my-orders` | Retrieve authenticated user's order history | User / Admin |
| `GET` | `/api/orders/:id` | Retrieve order details | User / Admin |
| `GET` | `/api/orders/track/:code` | Track live order status & delivery timeline | None |

### **Calculators (`/api/calculators`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/calculators/protein` | Calculate daily protein target in grams & meal splits | None |
| `POST` | `/api/calculators/fitness` | Calculate BMI, BMR, TDEE & macro targets | None |

### **Daily Protein Tracker (`/api/tracker`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tracker/daily` | Get today's protein target, consumed grams & streak | User / Admin |
| `POST` | `/api/tracker/logs` | Log meal or supplement shake | User / Admin |
| `DELETE`| `/api/tracker/logs/:id` | Delete logged meal entry | User / Admin |
| `POST` | `/api/tracker/goal` | Save protein goal targets | User / Admin |

### **Product Verification (`/api/verify`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/verify/:code` | Verify authenticity serial code & HPLC test score | None |

### **Admin Operations (`/api/admin`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/analytics` | Store revenue KPIs and order metrics | Admin Only |
| `GET` | `/api/admin/orders` | List customer orders with status filter | Admin Only |
| `PUT` | `/api/admin/orders/:id/status` | Update order status (`SHIPPED`, `DELIVERED`, etc.) | Admin Only |
| `GET` | `/api/admin/inventory` | List live warehouse inventory balances | Admin Only |
| `PUT` | `/api/admin/inventory/:id` | Quick restock inventory count | Admin Only |
| `GET` | `/api/coupons` | List promo coupons | Admin Only |
| `POST` | `/api/coupons` | Create new promo discount coupon | Admin Only |
| `DELETE`| `/api/coupons/:id` | Delete promotional coupon | Admin Only |

---

## 3. Example Request & Response Payloads

### **Calculate Daily Protein Goal**
`POST /api/calculators/protein`
```json
{
  "age": 26,
  "gender": "male",
  "weight": 75,
  "height": 178,
  "activityLevel": "very_active",
  "goal": "muscle_gain"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "dailyProteinGoal": 165,
    "proteinPerKg": 2.2,
    "minRequirement": 120,
    "maxRecommendedRange": 195,
    "perMealBreakdown": {
      "breakfast": 35,
      "lunch": 40,
      "postWorkout": 45,
      "dinner": 35,
      "snack": 10
    },
    "recommendations": [
      {
        "name": "PV ISO-Gold 100% Whey Isolate",
        "reason": "Rapidly absorbed post-workout protein with 28g protein per scoop."
      }
    ],
    "disclaimer": "Calculated based on ISSN sports nutrition guidelines."
  }
}
```
