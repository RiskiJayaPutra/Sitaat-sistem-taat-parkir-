// src/api/axiosClient.js

import axios from "axios";

// 1. Buat instance axios baru
const axiosClient = axios.create({
  // Tentukan URL dasar untuk semua request API kita
  baseURL: "http://localhost:8000/api",
});

// 2. Tambahkan "Interceptor" (Pencegat Request)
// Ini adalah fungsi yang akan berjalan SEBELUM setiap request dikirim
axiosClient.interceptors.request.use(
  (config) => {
    // 3. Ambil token dari localStorage
    const token = localStorage.getItem("APP_TOKEN");

    // 4. Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Lakukan sesuatu jika ada error request
    return Promise.reject(error);
  }
);

export default axiosClient;
