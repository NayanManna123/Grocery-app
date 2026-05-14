# 🛒 FreshCart — Premium Grocery Store

A full-stack grocery web application built with **React**, **Node.js/Express**, and **JSON file storage**.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![Express](https://img.shields.io/badge/Express-4-000000?logo=express) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)

---

## ✨ Features

- 🛍️ **Browse Products** — 35+ items across 7 categories
- 🔍 **Search & Filter** — Real-time search with category filtering
- 🛒 **Shopping Cart** — Add, update quantities, remove items
- 📋 **Checkout** — Delivery address & payment method selection
- 📦 **Order History** — Track all past orders
- 👤 **User Authentication** — Register & login with JWT
- 🌓 **Premium Dark UI** — Glassmorphism, animations, responsive

---

## 🏗️ Architecture

```
FreshCart/
├── server/                    # Backend API
│   ├── server.js              # Express app entry
│   ├── config/db.js           # JSON file database engine
│   ├── middleware/auth.js     # JWT authentication
│   ├── models/                # Data models
│   │   ├── Product.js
│   │   ├── User.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/                # API endpoints
│   │   ├── auth.js            # POST /register, /login
│   │   ├── products.js        # GET /products
│   │   ├── cart.js            # CRUD /cart
│   │   └── orders.js          # POST/GET /orders
│   ├── seed/seedData.js       # Sample product data
│   └── data/                  # Auto-generated JSON storage
│
├── client/                    # Frontend React App
│   ├── src/
│   │   ├── App.jsx            # Routes & layout
│   │   ├── index.css          # Design system
│   │   ├── context/           # Auth & Cart providers
│   │   ├── services/api.js    # API client
│   │   ├── components/        # Navbar, ProductCard, etc.
│   │   └── pages/             # Home, Cart, Checkout, etc.
│   └── vite.config.js         # Dev server + API proxy
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** — [Download](https://nodejs.org)
- **Git** — [Download](https://git-scm.com)

### 1. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 2. Seed the database

```bash
cd server
npm run seed
```

### 3. Start the application

Open **two terminals**:

**Terminal 1 — Backend (port 5000):**
```bash
cd server
npm start
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd client
npm run dev
```

### 4. Open in browser

📍 **http://localhost:5173**

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/register` | `{ name, email, password }` | No |
| POST | `/api/auth/login` | `{ email, password }` | No |
| GET | `/api/auth/me` | — | Bearer Token |

### Products
| Method | Endpoint | Query Params | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | `?search=...&category=...` | No |
| GET | `/api/products/categories` | — | No |
| GET | `/api/products/:id` | — | No |

### Cart
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| GET | `/api/cart` | — | Bearer Token |
| POST | `/api/cart` | `{ productId, quantity }` | Bearer Token |
| PUT | `/api/cart/:productId` | `{ quantity }` | Bearer Token |
| DELETE | `/api/cart/:productId` | — | Bearer Token |
| DELETE | `/api/cart` | — (clears all) | Bearer Token |

### Orders
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/orders` | `{ address, paymentMethod }` | Bearer Token |
| GET | `/api/orders` | — | Bearer Token |
| GET | `/api/orders/:id` | — | Bearer Token |

---

## 🧑‍💻 Test Account

Register a new account or use these steps:
1. Click **Login** → **Create one**
2. Fill in name, email, password (6+ chars)
3. Start shopping!

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router v6, Vite
- **Backend:** Node.js, Express 4
- **Auth:** JWT + bcryptjs
- **Database:** JSON file storage (zero-setup, swappable for MongoDB)
- **Design:** Custom CSS, glassmorphism, Inter font, dark mode
