// src/layouts/MainLayout.jsx

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function MainLayout() {
  // 1. Cek apakah ada token di localStorage
  const navigate = useNavigate(); // <-- Tambahkan ini
  const token = localStorage.getItem("APP_TOKEN");

  // 2. Jika TIDAK ADA token, lempar (redirect) ke halaman /login
  if (!token) {
    return <Navigate to="/login" replace />;
    // 'replace' berarti user tidak bisa menekan tombol "back"
  }

  const handleLogout = () => {
    // 1. Hapus token & data user
    localStorage.removeItem("APP_TOKEN");
    localStorage.removeItem("APP_USER");

    // 2. Arahkan ke halaman login
    navigate("/login");
  };
  // 3. Jika ADA token, tampilkan halaman yang diminta
  // <Outlet /> adalah "placeholder" untuk halaman anak (misal: DashboardPage)
  return (
    <div>
      {/* Nanti Navbar dan Sidebar kita letakkan di sini */}
      <header className="bg-white shadow">
        {/* --- UBAH DIV INI --- */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {/* Halaman (DashboardPage) akan muncul di sini */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
