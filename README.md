# 📚 Quick Start Guide for Bodega Esports Platform

## 🛠 Prerequisites

- Visual Studio Code installed

- Node.js v18+ installed

- GitHub account

- Supabase project created (or ready)

- Stripe developer account created (or ready)

---

## 📥 1. Clone the Repo

In VS Code terminal (or Git Bash, or Terminal):

```bash
git clone https://github.com/your-username/bodega-esports-platform.git
cd bodega-esports-platform
```

---

## 📦 2. Install Project Dependencies

Inside the project folder:

```bash
npm install
```

This installs:

- React

- Vite

- TailwindCSS

- Supabase client

- Stripe client

- React Router

---

## 🔐 3. Set Up Your Environment Variables

Create a `.env` file at the root of the project:

```bash
touch .env
```

Paste this into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLIC_KEY=your-publishable-stripe-key
```

(Fill with your actual Supabase and Stripe keys.)

---

## 🚀 4. Run the App Locally

Start the Vite development server:

```bash
npm run dev
```

Then visit:

```text
http://localhost:5173/
```

You should see the starter platform!

---

## 🛠 Project Structure

```text
/src
  /components
  /pages
  /utils
App.jsx
vite.config.js
.env
package.json
```