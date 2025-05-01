// src/components/AdminNavButton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminNavButton({ label, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="form-button flex items-center gap-2"
    >
      <span>{label}</span>
    </button>
  );
}

export default AdminNavButton;
