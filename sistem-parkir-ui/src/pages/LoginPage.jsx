// src/pages/LoginPage.jsx

import React, { useState } from "react";
import axiosClient from "../api/axiosClient"; // <-- MENGGUNAKAN AXIOS CLIENT PINTAR
import { useNavigate } from "react-router-dom"; // <-- IMPORT DI ATAS
import { motion } from "framer-motion";
import { showToast } from "../utils/toast";
import { HandRaisedIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  // --- PENTING: HOOK HARUS DI DALAM FUNGSI ---
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = (event) => {
    event.preventDefault();
    setError(null);

    // Menggunakan axiosClient (URL dasar sudah otomatis http://localhost:8000/api)
    axiosClient
      .post("/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        // Simpan token dan data user ke localStorage
        const { token, user } = response.data;
        localStorage.setItem("APP_TOKEN", token);
        localStorage.setItem("APP_USER", JSON.stringify(user));

        showToast.success(`Welcome back, ${user.nama || user.username}!`);

        // Arahkan ke Dashboard (pastikan rute '/dashboard' sudah ada di router.jsx Anda)
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          // Error validasi dari Laravel
          setError(error.response.data.message);
        } else if (error.response && error.response.status === 500) {
          // Error server
          setError(
            "Server error. Cek log Laravel backend atau pastikan database sudah di-seed."
          );
        } else if (error.response) {
          // Error lain dengan response
          setError(
            error.response.data.message || "Login gagal. Cek kredensial Anda."
          );
        } else if (error.request) {
          // Request dibuat tapi tidak ada response
          setError(
            "Tidak dapat terhubung ke server. Pastikan Laravel backend berjalan di http://localhost:8000"
          );
        } else {
          // Error lain
          setError("Terjadi kesalahan. Coba lagi nanti.");
        }
      });
  };

  // ... (kode handleLogin di atas tetap sama) ...

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100"
      >
        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
              Selamat Datang Kembali!
              <HandRaisedIcon className="h-8 w-8" />
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Silakan login untuk mengakses SITAAT
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Username (NPM/NIP)
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Masukkan username Anda"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Masuk ke Dashboard
            </motion.button>
          </form>
        </div>
        <div className="bg-gray-50 px-8 py-4 text-center text-xs text-gray-500 border-t border-gray-100">
          Sistem Parkir Terpadu Fakultas Teknik UNILA
        </div>
      </motion.div>
    </div>
  );
}
