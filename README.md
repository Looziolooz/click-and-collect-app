# 🐟 Fresco\&Fresco - Click & Collect System

A modern, hybrid e-commerce platform designed for **Pescheria Fresco\&Fresco**. This application allows customers to browse fresh fish products, build a cart, and schedule a precise in-store pickup time without requiring online payment. It includes a comprehensive Admin Dashboard for shop management.

*(Note: Replace with a screenshot of your actual homepage if available)*

## ✨ Key Features

### 🛒 Customer Experience

  * **Visual Product Catalog:** Interactive cards with prices per kg/unit and real-time availability status.
  * **Smart Shopping Cart:** Managed via **Zustand**, allowing quantity adjustments and persistence.
  * **Advanced Scheduling:** Intelligent calendar that automatically excludes closing days (Sun/Mon) and shows real-time available slots.
  * **"No-Pay" Checkout:** Frictionless checkout process requiring only contact details. Payment is settled in-store.
  * **Strict Validation:** Robust form validation for phone numbers, emails, and required fields.
  * **Responsive Design:** Fully mobile-optimized UI with a custom Blue/Gold brand identity.

### 🔧 Admin Dashboard (`/admin`)

  * **Secure Access:** Protected via Next.js Middleware (Basic Auth).
  * **Order Overview:** Real-time list of incoming orders with status badges.
  * **Order Management ("The Scale"):**
      * View detailed order items.
      * **Real-time Adjustments:** Input the *actual weight* and calculate the *final price* after weighing the fish.
      * Status updates (Pending -\> Ready -\> Completed).
  * **Printable View:** Optimized layout for printing order tickets.

## 🛠️ Technology Stack

  * **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
  * **Language:** [TypeScript](https://www.typescriptlang.org/)
  * **Styling:** [Tailwind CSS](https://tailwindcss.com/)
  * **Database:** PostgreSQL (via Vercel Postgres) or SQLite (Local dev)
  * **ORM:** [Prisma](https://www.prisma.io/)
  * **State Management:** [Zustand](https://github.com/pmndrs/zustand)
  * **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 1\. Clone the repository

```bash
git clone https://github.com/your-username/click-and-collect-app.git
cd click-and-collect-app
```

### 2\. Install dependencies

```bash
npm install
```

### 3\. Environment Setup

Create a `.env` file in the root directory.

  * **For Local Development (SQLite):**
    ```env
    DATABASE_URL="file:./dev.db"
    ```
  * **For Production (Vercel/Postgres):**
    ```env
    POSTGRES_PRISMA_URL="postgres://..."
    POSTGRES_URL_NON_POOLING="postgres://..."
    ```

### 4\. Database Setup & Seeding

This project requires specific data (Time Slots, Products) to function correctly.

```bash
# Generate Prisma Client
npx prisma generate

# Create Database Tables
npx prisma migrate dev --name init

# Populate DB with Products and 30 days of Slots
npx prisma db seed
```

### 5\. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser.

## 🔐 Admin Access

To access the administrative dashboard, navigate to:
**[http://localhost:3000/admin/dashboard](https://www.google.com/search?q=http://localhost:3000/admin/dashboard)**

**Default Credentials:**

  * **Username:** `vincenzo`
  * **Password:** `pesce2024`

*(These can be configured in `middleware.ts`)*

## 📁 Project Structure

```
/
├── app/
│   ├── admin/           # Admin dashboard routes
│   ├── api/             # Backend API endpoints (Orders, Slots)
│   ├── cart/            # Checkout flow
│   ├── products/        # Product catalog
│   └── page.tsx         # Homepage
├── components/
│   ├── layout/          # Header, Footer
│   ├── ui/              # Reusable UI components (ProductCard, Hero)
│   └── booking/         # Form logic
├── hooks/               # Custom hooks (useCart, useMobile)
├── lib/                 # Prisma instance
├── prisma/
│   ├── schema.prisma    # Database models
│   └── seed.ts          # Data population script
└── public/              # Static assets (images)
```

## 📦 Deployment

The easiest way to deploy is using **Vercel**.

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add a **Vercel Postgres** database during setup.
4.  Vercel will automatically configure the Environment Variables.
5.  After deployment, run the seed command via Vercel Console or locally pointing to the remote DB:
    ```bash
    npx prisma migrate deploy
    npx prisma db seed
    ```

## 📄 License

This project is proprietary software developed for **Pescheria Fresco\&Fresco**.

-----

Made with ❤️ by [Your Name]