'use client';

import { useRouter } from 'next/navigation';

interface AdminNavButtonProps {
  label: string;
  path: string;
  className?: string;
}

function AdminNavButton({ label, path, className = '' }: AdminNavButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className={`form-button flex items-center gap-2 ${className}`}
    >
      <span>{label}</span>
    </button>
  );
}

export default AdminNavButton;
