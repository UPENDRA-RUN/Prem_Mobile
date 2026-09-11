# 📱 Prem Mobile — Pinto Park, Gwalior

<div align="center">

> **“Deal Aise Jo Deewana Bana De 🔥”**

[![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.2.1-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment_Gateway-0C2340?style=for-the-badge&logo=razorpay&logoColor=blue)](https://razorpay.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.4.7-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)

**Full-Stack E-Commerce & Retail Management Platform for Prem Mobile (Pinto Park, Gwalior, M.P.)**

[Key Features](#-key-features) • [Tech Stack](#-tech-stack) • [Project Structure](#-project-structure) • [Getting Started](#-getting-started) • [Environment Variables](#-environment-variables) • [API Reference](#-api-reference) • [Deployment](#-deployment) • [Store Details](#-store-location--contact)

</div>

---

## 🌟 Overview

**Prem Mobile** is a modern, high-performance web application and digital storefront tailored for local retail excellence in Gwalior. Built with a responsive mobile-first design, it offers a seamless shopping experience for customers and a full-featured admin management dashboard for store owners.

The platform bridges online shopping with in-store customer engagement through direct WhatsApp ordering, real-time product inventory sync, flash sales, Sunday Super Sale engines, instant PDF invoice generation, and online payments via Razorpay.

---

## 🚀 Key Features

### 🛍️ Customer Storefront
- **Dynamic Hero Banners & Sliders**: Landscape carousel showcasing ongoing promotional deals, trending releases, and seasonal offers.
- **Product Catalog & Categorization**: Smartphones, Earbuds, Smartwatches, Chargers, Audio Systems, and Mobile Accessories.
- **Advanced Search & Filtering**: Fast category search, brand filters, price ranges, and smart autocomplete modal.
- **Side-by-Side Product Comparison**: Compare specs, pricing, and features of multiple products simultaneously.
- **Wishlist & Cart Drawers**: Instant interactive cart drawer and wishlist management with local storage persistence.
- **Sunday Super Sale & Flash Sales**: Live countdowns, auto-calculated discount tiers, limited-time deals, and dynamic discount badges.
- **Combo Deals Hub**: Curated product bundles and special package offers.

### 💳 Checkout & Ordering
- **Flexible Checkout Flow**: Supports both registered customer accounts and fast guest checkout.
- **Multiple Payment Modes**:
  - **Razorpay**: Integrated online payments (Cards, UPI, NetBanking, Wallets).
  - **Cash on Delivery (COD)**: Pay at pickup or doorstep.
  - **WhatsApp Direct Order**: 1-click WhatsApp order generation pre-formatted with order summary and customer address.
- **Automated PDF Invoice Generation**: Instant downloadable tax invoices with GST and store branding (`@react-pdf/renderer` & `jsPDF`).

### ⚡ Real-Time Architecture & PWA
- **Real-Time Synchronization (SSE)**: Server-Sent Events (`/api/events`) keeping storefront stock, flash sales, and order updates in sync without manual refreshing.
- **Progressive Web App (PWA)**: Installable on Android, iOS, and Desktop with offline caching, fast boot times, and responsive bottom navigation.

### 🛡️ Comprehensive Admin Control Suite
- **Analytics & Revenue Dashboard**: Live sales charts, revenue metrics, order velocity, and recent activity logs.
- **Product & Inventory Management**: CRUD operations, multi-variant options, stock tracking, image uploads (Cloudinary/Local).
- **Order Processing Hub**: Order status workflows (`Pending` ➔ `Confirmed` ➔ `Shipped` ➔ `Delivered` ➔ `Cancelled`), tracking IDs, and customer notes.
- **Sunday Sale & Flash Sale Engines**: Configure sale dates, activate automated discounts, manage participating items.
- **Coupons & Promotional Codes**: Set percentage or flat discounts, usage limits, and minimum cart thresholds.
- **Customer Reviews Moderation**: Approve, highlight, or moderate customer ratings and testimonials.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 + Vite 6 | Lightning-fast rendering and modern build tooling |
| **Styling & UI** | Tailwind CSS + Framer Motion + Lucide Icons | Fluid responsiveness, glassmorphism, and micro-animations |
| **Routing** | React Router DOM v7 | Client-side routing with nested layouts |
| **Backend API** | Node.js + Express 5 | RESTful API endpoints and middleware architecture |
| **Database** | SQLite + `@neon/config` | Fast, lightweight embedded transactional database |
| **Realtime Sync** | Server-Sent Events (SSE) | Live inventory and sales event broadcasting |
| **Payments** | Razorpay Node SDK & Checkout | Secure online payment verification |
| **Media Storage** | Cloudinary / Local Uploads | Product photo upload and CDN delivery |
| **Invoicing** | `@react-pdf/renderer` + `jspdf` + `html2canvas` | Dynamic client-side and server invoice rendering |

---

## 📂 Project Structure

```
Prem_Mobile/
├── public/                  # Static assets, icons, manifest.json
│   ├── favicon.ico
│   └── uploads/             # Local upload storage fallback
├── server/                  # Backend Express API & Database
│   ├── data/                # SQLite database storage (prem_mobile.db)
│   ├── routes/              # Modular Express route handlers
│   │   ├── analytics.js     # Admin revenue & dashboard analytics
│   │   ├── auth.js          # Admin & user authentication / JWT
│   │   ├── categories.js    # Category management
│   │   ├── combos.js        # Product bundles & combo deals
│   │   ├── coupons.js       # Coupon verification and management
│   │   ├── orders.js        # Order creation, updates, and tracking
│   │   ├── payment.js       # Razorpay order generation & verification
│   │   ├── products.js      # Product catalog CRUD & filtering
│   │   ├── reviews.js       # Customer ratings & reviews
│   │   ├── sale.js          # Flash sale management
│   │   ├── settings.js      # Global store settings
│   │   ├── sundaySale.js    # Sunday special deal engine
│   │   └── upload.js        # File upload handler
│   ├── auth.js              # Password hashing & JWT middleware
│   ├── db.js                # SQLite connection & schema initialization
│   ├── events.js            # SSE (Server-Sent Events) broadcaster
│   ├── index.js             # Vite development server middleware integration
│   ├── saleLogic.js         # Flash sale business rules
│   ├── seedData.js          # Initial store dataset & demo products
│   ├── server.js            # Standalone Express production server entry point
│   └── sundaySaleLogic.js   # Sunday sale calculation rules
├── src/                     # React 19 Frontend Application
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Modals, drawers (Cart, Compare), PWA prompt
│   │   ├── home/            # Hero sliders, featured sections, category bars
│   │   ├── layout/          # Desktop/Mobile navbars, footers, search modal
│   │   └── product/         # Product cards, review components, badges
│   ├── context/             # Global React contexts (Cart, Compare, Auth)
│   ├── hooks/               # Custom hooks (useRealtimeSync, etc.)
│   ├── pages/               # Application routes and views
│   │   ├── admin/           # Admin portal pages (Dashboard, Products, Orders, etc.)
│   │   ├── Checkout.jsx     # Multi-step checkout with payment gateways
│   │   ├── ProductDetails.jsx # Detailed specifications, reviews, buy options
│   │   ├── Shop.jsx         # Full catalog with filtering & sorting
│   │   └── ...              # About, Contact, Compare, Orders, Wishlist, etc.
│   ├── utils/               # PDF Invoice generator, helper formatters
│   ├── App.jsx              # Main router and route definitions
│   ├── index.css            # Tailwind & custom CSS variables / styling
│   └── main.jsx             # React entry point
├── .env.example             # Sample environment variables
├── DEPLOY.md                # Detailed cloud deployment guide
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind design tokens & theme setup
├── vercel.json              # Vercel proxy and rewrite configuration
└── vite.config.js           # Vite configuration & server proxy
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### 1. Clone the Repository
```bash
git clone https://github.com/UPENDRA-RUN/Prem_Mobile.git
cd Prem_Mobile
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy the `.env.example` template into a new `.env` file:
```bash
cp .env.example .env
```
*(Fill in your custom values if testing Razorpay or Cloudinary features. See [Environment Variables](#-environment-variables).)*

### 4. Run the Development Server
```bash
npm run dev
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Vite runs both the frontend and proxying backend server seamlessly.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Server & Application Settings
PORT=5000
NODE_ENV=development
ADMIN_JWT_SECRET=your_super_secret_jwt_key_min_32_characters
CORS_ORIGIN=http://localhost:5173

# Razorpay Payment Gateway (Test or Live)
RAZORPAY_KEY_ID=rzp_test_yourKeyIdHere
RAZORPAY_KEY_SECRET=yourRazorpayKeySecretHere

# Cloudinary Storage Configuration (Vite Client-side)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=prem_mobile_preset
```

---

## 🔌 API Reference

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Fetch product catalog with filters | Public |
| `GET` | `/api/products/:id` | Fetch single product details | Public |
| `POST` | `/api/products` | Create a new product | Admin |
| `PUT` | `/api/products/:id` | Update product info or stock | Admin |
| `DELETE` | `/api/products/:id` | Delete a product | Admin |
| `POST` | `/api/orders` | Create an order (COD / Online / WhatsApp) | Public |
| `GET` | `/api/orders` | List all orders with filters | Admin / Auth |
| `PUT` | `/api/orders/:id/status` | Update order delivery status | Admin |
| `POST` | `/api/payment/create-order` | Generate Razorpay order token | Public |
| `POST` | `/api/payment/verify` | Verify Razorpay payment signature | Public |
| `GET` | `/api/sale` | Get active flash sale products | Public |
| `GET` | `/api/sunday-sale` | Get Sunday special discount products | Public |
| `POST` | `/api/coupons/validate` | Verify & calculate coupon discount | Public |
| `GET` | `/api/events` | SSE endpoint for real-time app events | Public |
| `GET` | `/api/analytics` | Summary sales & revenue metrics | Admin |

---

## 🌐 Deployment

For complete, step-by-step production deployment instructions, refer to [DEPLOY.md](file:///c:/Desktop/Prem_Mobile/DEPLOY.md).

### Quick Deployment Summary:
- **Frontend (Vercel)**:
  - Framework: `Vite`
  - Build Command: `npm run build`
  - Output Directory: `dist`
  - Vercel rewrites proxy `/api/*` to the Render backend service via [`vercel.json`](file:///c:/Desktop/Prem_Mobile/vercel.json).
- **Backend (Render)**:
  - Build Command: `npm install`
  - Start Command: `node server/server.js`
  - Mount persistent disk at `/opt/render/project/src/server/data` to preserve SQLite database state.

---

## 📍 Store Location & Contact

<div align="center">

### **Prem Mobile**
**Pinto Park, Jaderua Gate Ke Samne, Gwalior (M.P.) — 474006**

📞 **Phone / WhatsApp**: [+91 8770559251](https://wa.me/918770559251)  
🕒 **Working Hours**: Monday – Sunday | 10:00 AM – 9:30 PM

</div>

---

## 📄 License

This project is proprietary and maintained for **Prem Mobile**. All rights reserved.
