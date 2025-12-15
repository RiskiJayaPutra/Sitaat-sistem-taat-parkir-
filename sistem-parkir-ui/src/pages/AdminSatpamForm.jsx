// src/pages/AdminSatpamForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { ArrowLeftIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function AdminSatpamForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      console.log("Fetching satpam with ID:", id);
      console.log("Token exists:", !!localStorage.getItem("APP_TOKEN"));
      console.log("API URL:", `/admin/satpam/${id}`);

      axiosClient
        .get(`/admin/satpam/${id}`)
        .then(({ data }) => {
          console.log("Satpam data received:", data);
          setFormData({
            username: data.username,
            nama: data.nama || "",
            password: "",
          });
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.error("Full error object:", error);
          console.error("Error response:", error.response);
          console.error("Error status:", error.response?.status);
          console.error("Error data:", error.response?.data);

          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Gagal mengambil data satpam";

          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: errorMessage,
            confirmButtonColor: "#EF4444",
          });
          navigate("/admin/satpam");
        });
    }
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const request = isEditMode
      ? axiosClient.put(`/admin/satpam/${id}`, formData)
      : axiosClient.post("/admin/satpam", formData);

    request
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: response.data.message,
          confirmButtonColor: "#2563EB",
          timer: 2000,
          timerProgressBar: true,
        });
        setTimeout(() => {
          navigate("/admin/satpam");
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal!",
            text: `Gagal ${
              isEditMode ? "memperbarui" : "menambahkan"
            } satpam. Coba lagi.`,
            confirmButtonColor: "#EF4444",
          });
        }
      });
  };

  if (loading && isEditMode) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <div className="rounded-xl bg-white p-8 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="mb-6">
          <Link
            to="/admin/satpam"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali ke Manajemen Satpam
          </Link>

          <div className="flex items-center gap-3 mt-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? "Edit Satpam" : "Tambah Satpam Baru"}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isEditMode
                  ? "Perbarui informasi akun satpam"
                  : "Buat akun satpam baru"}
              </p>
            </div>
          </div>
        </div>

        {errors && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            <ul className="list-disc pl-5">
              {Object.keys(errors).map((key) => (
                <li key={key}>{errors[key][0]}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nama"
              required
              value={formData.nama}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password{" "}
              {isEditMode && (
                <span className="text-gray-500 text-xs">
                  (Kosongkan jika tidak ingin mengubah)
                </span>
              )}
              {!isEditMode && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              required={!isEditMode}
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 shadow-sm transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
              placeholder={
                isEditMode ? "Kosongkan jika tidak diubah" : "Masukkan password"
              }
            />
            {isEditMode && (
              <p className="mt-1 text-xs text-gray-500">
                Password hanya akan diperbarui jika Anda mengisi field ini
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            >
              {loading
                ? "Menyimpan..."
                : isEditMode
                ? "Perbarui Data"
                : "Simpan Data"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate("/admin/satpam")}
              className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 transition-all hover:bg-gray-300 touch-manipulation"
            >
              Batal
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
