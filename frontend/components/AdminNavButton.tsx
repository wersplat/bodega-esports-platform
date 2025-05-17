import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminNavButtonProps {
  label: string;
  path: string;
}

function AdminNavButton({ label, path }: AdminNavButtonProps) {
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
