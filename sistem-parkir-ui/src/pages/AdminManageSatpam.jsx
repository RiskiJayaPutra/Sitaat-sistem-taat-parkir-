// src/pages/AdminManageSatpam.jsx

import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function AdminManageSatpam() {
  const [satpam, setSatpam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nama: "",
    password: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  const fetchSatpam = () => {
    setLoading(true);
    setError(null);
    axiosClient
      .get("/admin/satpam")
      .then(({ data }) => {
        setSatpam(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal mengambil data satpam:", err);
        setError("Gagal memuat data satpam.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSatpam();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    axiosClient
      .post("/admin/satpam", formData)
      .then((response) => {
        setMessage({ type: "success", text: response.data.message });
        setFormData({ username: "", nama: "", password: "" });
        setShowForm(false);
        fetchSatpam();
        setFormLoading(false);
      })
      .catch((err) => {
        setFormLoading(false);
        if (err.response && err.response.status === 422) {
          const errors = err.response.data.errors;
          const errorMessages = Object.values(errors).flat().join(", ");
          setMessage({ type: "error", text: errorMessages });
        } else {
          setMessage({
            type: "error",
            text: "Gagal menambahkan satpam. Coba lagi.",
          });
        }
      });
  };

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: "Hapus Satpam?",
      text: `Yakin ingin menghapus satpam ${nama}? Aksi ini tidak dapat dibatalkan!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setMessage(null);
        axiosClient
          .delete(`/admin/satpam/${id}`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: response.data.message,
              confirmButtonColor: "#4F46E5",
              timer: 2000,
              timerProgressBar: true,
            });
            fetchSatpam();
          })
          .catch((err) => {
            console.error("Gagal menghapus satpam:", err);
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal menghapus satpam. Coba lagi.",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Kelola Satpam</h2>
          <p className="mt-1 text-sm text-gray-600">
            Daftar akun satpam yang terdaftar
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition-all hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5" />
          Tambah Satpam
        </button>
      </motion.div>

      {/* Status Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-xl p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-medium">{message.text}</p>
        </motion.div>
      )}

      {/* Form Tambah Satpam */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <h3 className="mb-4 text-xl font-bold text-gray-900">
            Tambah Satpam Baru
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="nama"
                required
                value={formData.nama}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                {formLoading ? "Menyimpan..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 font-medium hover:bg-gray-300"
              >
                Batal
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Satpam List */}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Dibuat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {satpam.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Belum ada satpam terdaftar
                  </td>
                </tr>
              ) : (
                satpam.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <ShieldCheckIcon className="h-5 w-5 text-indigo-600" />
                        <span className="font-medium text-gray-900">
                          {s.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {s.nama || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(s.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(s.id, s.nama || s.username)}
                        className="inline-flex items-center gap-1 rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
