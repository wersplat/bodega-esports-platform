# Bodega Esports Platform – Installation Guide

Welcome! This guide will help you set up the Bodega Esports Platform from scratch. No prior experience required.

---

## 1. Prerequisites

Before you begin, install these tools:

- **Git** – Version control ([Download](https://git-scm.com/downloads))
- **Python 3.10+** – Backend ([Download](https://www.python.org/downloads/))
- **Node.js 16+** – Frontend ([Download](https://nodejs.org/en/download/))
- **Discord Account** – For bot integration ([Sign up](https://discord.com/register))
- **Supabase Project** – For database ([Get started](https://supabase.com/))
- **Google Service Account** – For Google APIs ([Guide](https://cloud.google.com/iam/docs/service-accounts-create))

---

## 2. Cloning the Repository

Open your terminal and run:

```sh
git clone https://github.com/your-org/bodega-esports-platform.git
cd bodega-esports-platform
```

---

## 3. Environment Variables

Copy the example environment files:

```sh
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

**Edit these files and fill in:**

- **backend/.env**
  - `DATABASE_URL` – Your Postgres connection string
  - `DISCORD_BOT_TOKEN` – Your Discord bot token
  - `SUPABASE_URL` / `SUPABASE_KEY` – Supabase project credentials
  - `GOOGLE_SERVICE_ACCOUNT_JSON` – Path or JSON for Google Service Account

- **frontend/.env**
  - `NEXT_PUBLIC_API_URL` – Usually `http://localhost:8000`
  - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_KEY` – Supabase frontend credentials

> **Tip:** Each key is explained in the `.env.example` files.

---

## 4. Backend Setup

### a. Create and activate a Python virtual environment

**macOS/Linux:**

```sh
python3 -m venv venv
source venv/bin/activate
```

**Windows:**

```sh
python -m venv venv
venv\Scripts\activate
```

### b. Install dependencies

```sh
pip install -r requirements.txt
```

### c. Run database migrations

```sh
alembic upgrade head
```

### d. Start the FastAPI server

```sh
uvicorn app.main:app --reload
```

### e. Verify

Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.

---

## 5. Frontend Setup

```sh
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 6. Discord Bot Setup

- Make sure `DISCORD_BOT_TOKEN` is set in `backend/.env`.
- In the backend directory, run:

```sh
python -m app.bot.worker
```

**Invite your bot to your server:**

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=8
```

> **Note:** Replace `YOUR_CLIENT_ID` with your bot's client ID.

---

## 7. Optional: Docker for Postgres

Start a local Postgres database:

```sh
docker-compose up -d
```

Update `DATABASE_URL` in `backend/.env` to:

```
postgresql://postgres:postgres@localhost:5432/postgres
```

---

## 8. Testing

- **Backend:**

    ```sh
    pytest
    ```

- **Frontend:**

    ```sh
    npm run lint
    npm run type-check
    ```

---

## 9. Deploying to Render

- **Backend:**
  - **Root:** `/backend`
  - **Build Command:** `pip install -r requirements.txt && alembic upgrade head`
  - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port 10000`
  - **Environment:** Set all keys from `backend/.env`

- **Frontend:**
  - **Root:** `/frontend`
  - **Build Command:** `npm install && npm run build`
  - **Start Command:** `npm start`
  - **Environment:** Set all keys from `frontend/.env`

---

## 10. Troubleshooting Tips

- **Server won’t start?** Check terminal output for errors.
- **Database errors?** Ensure Postgres is running and `DATABASE_URL` is correct.
- **Bot not responding?** Double-check `DISCORD_BOT_TOKEN` and permissions.
- **Frontend not loading?** Check `.env` values and terminal logs.

> **Tip:** Logs are shown in your terminal. For more help, check the project’s README or open an issue.

---

You’re all set! 🎮
