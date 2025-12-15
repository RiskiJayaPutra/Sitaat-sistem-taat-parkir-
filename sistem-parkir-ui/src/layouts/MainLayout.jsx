// src/layouts/MainLayout.jsx

import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import api from "../api/axiosClient";

export default function MainLayout() {
  // 1. Cek apakah ada token di localStorage
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("APP_TOKEN");
  const [userProfile, setUserProfile] = useState(null);

  // 2. Jika TIDAK ADA token, lempar (redirect) ke halaman /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Get page title based on route
  const getPageTitle = () => {
    if (location.pathname === "/profile") return "Profil Saya";
    if (location.pathname.includes("/admin")) return "Admin Panel";
    if (location.pathname.includes("/laporan")) return "Laporan";
    return "Dashboard";
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/profile");
        setUserProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();

    // Listen for profile update event
    const handleProfileUpdate = () => {
      fetchUserProfile();
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    // 1. Hapus token & data user
    localStorage.removeItem("APP_TOKEN");
    localStorage.removeItem("APP_USER");

    showToast.info("You have been logged out");

    // 2. Arahkan ke halaman login
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };
  // 3. Jika ADA token, tampilkan halaman yang diminta
  // <Outlet /> adalah "placeholder" untuk halaman anak (misal: DashboardPage)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nanti Navbar dan Sidebar kita letakkan di sini */}
      <header className="bg-white shadow">
        {/* --- UBAH DIV INI --- */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            {getPageTitle()}
          </h1>
          <div className="flex items-center gap-3">
            {/* Profile Button with Photo and Name */}
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100 transition-colors touch-manipulation"
            >
              {userProfile?.photo ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${userProfile.photo}`}
                  alt={userProfile.nama}
                  className="h-10 w-10 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400"
                />
              ) : (
                <UserCircleIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {userProfile
                  ? userProfile.nama || userProfile.username
                  : "Loading..."}
              </span>
            </button>

            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 touch-manipulation"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {/* Halaman (DashboardPage) akan muncul di sini */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}
