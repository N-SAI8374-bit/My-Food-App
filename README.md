# 🍔 FlavorFleet - Full-Stack Gourmet Food Delivery App

A high-performance, modern food ordering and delivery web application built with **React**, **Next.js (App Router)**, **JavaScript**, **CSS3**, **HTML5**, and **Node.js**.

---

## 🚀 Quick Start Guide

### 1. Start Development Server
Run the following command in the project directory:

```bash
npm run dev
```

Open your browser and navigate to:
**[http://localhost:3000](http://localhost:3000)**

### 2. Build for Production
```bash
npm run build
npm start
```

---

## ✨ Features & Capabilities

### 🍕 Interactive Menu & Dynamic Filtering
- **Category Filter**: Filter through Artisan Pizzas, Gourmet Burgers, Dum Biryanis, Asian Ramen & Bowls, Salads, Desserts, and Cool Beverages.
- **Dietary Filter**: Instant toggle for **Pure Veg 🌿**, **Non-Veg 🍗**, or **All Dishes**.
- **Instant Search**: Real-time keyboard search across dish names, descriptions, and categories.
- **Sorting Options**: Sort by Popularity 🔥, Highest Rating ⭐, Price: Low to High ↑, or Price: High to Low ↓.

### 🛠️ Dish Customization Modal
- Choose portion sizes (**Regular**, **Medium**, **Large / Double**) with dynamic real-time price calculation.
- Choose extra gourmet add-ons (Extra Truffle, Double Pepperoni, Fresh Burrata, Garlic Ranch).
- Add special cooking instructions (e.g., *"Extra spicy"*, *"No onions"*).

### 🛒 Slide-Over Cart Drawer
- Real-time quantity increment/decrement and item removal.
- **Free Delivery Tracker**: Dynamic progress bar towards free shipping (unlocked on orders over ₹499).
- **Rider Tip Selector**: Support delivery riders with quick tip buttons (₹20, ₹30, ₹50, ₹100).
- **Coupon Code Engine**:
  - `FEAST20`: 20% OFF up to ₹150
  - `TASTY50`: Flat ₹50 OFF
  - `WELCOME10`: 10% OFF for new users
  - `FREESHIP`: Free delivery unlock
- Transparent bill breakdown (Subtotal, Delivery Fee, 5% GST, Tip, Grand Total).

### 💳 Complete Checkout System
- Customer address details form (Name, Phone, Address, Landmark, Delivery notes).
- Payment method selector:
  - **UPI / QR Code** (GPay, PhonePe, Paytm)
  - **Credit / Debit Cards** (Visa, Mastercard, RuPay)
  - **Cash on Delivery (COD)**

### 🛵 Live Simulated Order Tracker
- Real-time visual progress stepper:
  1. **Order Confirmed**
  2. **In Kitchen / Preparing**
  3. **Rider Assigned & On The Way**
  4. **Delivered!**
- Simulated road map with animated delivery rider moving from restaurant to customer home.
- Delivery rider card with contact info and simulated call button.
- Live countdown ETA timer.
- Interactive step advance button for live testing.

### ❤️ Wishlist & Order History
- Save favorite dishes with persistent state.
- Order history with reorder capabilities.
- Dark & Light mode theme toggle with persistent preferences.

---

## 📁 Project Structure

```
Project 1/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── categories/route.js   # Node.js API: Categories endpoint
│   │   │   ├── coupons/route.js      # Node.js API: Coupon validation & discount
│   │   │   ├── foods/route.js        # Node.js API: Food catalog with filters
│   │   │   └── orders/route.js       # Node.js API: Order creation & live tracking
│   │   ├── globals.css               # Master responsive CSS & theme styles
│   │   ├── layout.js                 # Root Next.js layout & metadata
│   │   └── page.js                   # Main application landing & menu page
│   ├── components/
│   │   ├── CartDrawer.js             # Slide-over cart & bill summary
│   │   ├── CategoryFilter.js         # Horizontal categories & diet filters
│   │   ├── CheckoutModal.js          # Address form & payment options
│   │   ├── FavoritesModal.js         # Wishlist modal
│   │   ├── FoodCard.js               # Interactive food card with quick add
│   │   ├── FoodDetailModal.js        # Portion size & add-on customization
│   │   ├── Footer.js                 # Brand story, customer care & footer
│   │   ├── Hero.js                   # Banner, stats, and coupon tags
│   │   ├── Icons.js                  # Lightweight custom SVG icons
│   │   ├── Navbar.js                 # Header, search, theme & action buttons
│   │   ├── OrderHistoryModal.js      # Past receipts & quick reordering
│   │   ├── OrderTrackerModal.js      # Live animated delivery tracker
│   │   └── Toast.js                  # Toast notifications
│   ├── context/
│   │   └── FoodContext.js            # React Context global state management
│   └── data/
│       └── foodData.js               # Rich menu dataset & coupon definitions
├── jsconfig.json                     # Path alias configuration (@/*)
├── next.config.js                    # Next.js image domain configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # Documentation
```

---

## 🛠️ Tech Stack

- **React 18**: Interactive components, state management (`useState`, `useEffect`, `useMemo`, `useContext`).
- **Next.js 14**: Server-side rendering, App Router, and high-performance client components.
- **Node.js**: Next.js API Routes backend handlers (`/api/foods`, `/api/orders`, `/api/coupons`, `/api/categories`).
- **CSS3**: Custom design system, CSS variables for Dark/Light themes, responsive flexbox & grid, custom animations, zero heavy UI frameworks needed.
- **JavaScript (ES6+)**: Clean, modern, asynchronous JavaScript.
- **HTML5**: Semantic tags, clean structure, accessibility.
