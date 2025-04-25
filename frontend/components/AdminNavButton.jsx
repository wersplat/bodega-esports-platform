// src/components/AdminNavButton.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminNavButton({ icon: Icon, label, path }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(path)}
      className="form-button flex items-center gap-2"
    >
      <Icon className="h-3.5 w-3.5 min-w-[14px] text-blue-300" />
      <span>{label}</span>
    </button>
  );
}

export default AdminNavButton;
