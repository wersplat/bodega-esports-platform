import React, { ReactNode } from 'react';

interface SidebarLayoutWrapperProps {
  children: ReactNode;
}

export default function SidebarLayoutWrapper({ children }: SidebarLayoutWrapperProps) {
  return (
    <div className="flex min-h-screen bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-64 p-6 border-r border-[#1e293b]">
        <h2 className="text-2xl font-bold mb-6">Bodega Admin</h2>
        <nav className="space-y-4">
          <a href="/admin/dashboard" className="block text-sm hover:text-[#e11d48]">Dashboard</a>
          <a href="/admin/teams" className="block text-sm hover:text-[#e11d48]">Teams</a>
          <a href="/admin/stats" className="block text-sm hover:text-[#e11d48]">Stats</a>
          <a href="/admin/settings" className="block text-sm hover:text-[#e11d48]">Settings</a>
        </nav>
      </aside>
      {/* Main content from Plasmic */}
      <main className="flex-1 p-8 bg-[#1e293b]">{children}</main>
    </div>
  );
}
