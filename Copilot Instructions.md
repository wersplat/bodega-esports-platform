# 📂 Bodega Esports Platform — Visual Studio Code + Copilot Project Outline

---

## 📄 Project Structure

```
/bodega-esports-platform
├── /public
│   └── index.html
├── /src
│   ├── /components
│   │   └── Navbar.jsx
│   ├── /pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── LeagueBrowser.jsx
│   │   └── Admin.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── README.md
```

---

## 📄 File Purpose

| File/Folder | Purpose |
|---|---|
| `/public/index.html` | Hosts the root `<div id="root"></div>` |
| `/src/main.jsx` | Bootstraps and renders the App component |
| `/src/App.jsx` | Contains React Router setup |
| `/src/components/Navbar.jsx` | Top navigation bar |
| `/src/pages/*.jsx` | Individual page components (Login, Register, Dashboard, etc.) |
| `package.json` | Project dependencies and scripts |
| `vite.config.js` | Vite configuration for React support |

---

## 📊 Main Technologies

| Tech | Purpose |
|---|---|
| React.js | Frontend library |
| Vite | Development server and bundler |
| React Router v6 | Page routing |
| TailwindCSS (optional) | Styling framework |
| Supabase (future) | Auth and database |
| Stripe (future) | Payment processing |

---

## 📅 Terminal Commands

| Command | Purpose |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `Ctrl+C` | Stop development server |

---

## 📊 Critical Files

### `/public/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bodega Esports Platform</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### `/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### `/src/App.jsx`
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeagueBrowser from './pages/LeagueBrowser';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leagues" element={<LeagueBrowser />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
```

---

## 🔧 package.json
```json
{
  "name": "bodega-esports-platform",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3"
  },
  "devDependencies": {
    "vite": "^4.4.9",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.15",
    "postcss": "^8.4.24"
  }
}
```

---

## 🛠️ Vite Config
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
});
```

---

# 🚀 Ready for Copilot + VSC!

- Clean structure
- Organized folders
- Consistent casing (src, public, main.jsx)
- Ready for Copilot to autocomplete pages, forms, features next.

---

# 📈 What Next?

| Feature | Status |
|---|---|
| ✅ Platform Scaffolding | Complete |
| ⬆️ Supabase Auth Wiring | Next |
| ⬆️ Stripe Checkout Setup | Next |
| ⬆️ Private Routes + AuthGuard | Future |
| ⬆️ Admin Panel CRUD (Teams, Leagues) | Future |

