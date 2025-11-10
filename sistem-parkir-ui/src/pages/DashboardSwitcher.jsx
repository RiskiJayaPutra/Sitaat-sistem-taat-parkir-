// src/pages/DashboardSwitcher.jsx
import React from "react";
import AdminDashboard from "./AdminDashboard";
import SatpamDashboard from "./SatpamDashboard";
import MahasiswaDashboard from "./MahasiswaDashboard";

export default function DashboardSwitcher() {
  // 1. Ambil data user dari localStorage
  const userString = localStorage.getItem("APP_USER");

  // Jika karena alasan aneh data user tidak ada, tampilkan dashboard Mahasiswa
  if (!userString) {
    return <MahasiswaDashboard />;
  }

  // 2. Ubah data string JSON menjadi objek
  const user = JSON.parse(userString);
  const role = user.role;

  // 3. Tentukan dashboard berdasarkan role
  if (role === "Admin") {
    return <AdminDashboard />;
  }

  if (role === "Satpam") {
    return <SatpamDashboard />;
  }

  if (role === "Mahasiswa") {
    return <MahasiswaDashboard />;
  }

  // Default jika rolenya tidak dikenal
  return <MahasiswaDashboard />;
}
