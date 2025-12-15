// src/pages/AdminManageSatpam.jsx

import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { showToast } from "../utils/toast";
import { ListSkeleton } from "../components/SkeletonLoader";
import {
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminManageSatpam() {
  const [satpam, setSatpam] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSatpam = () => {
    setLoading(true);
    setError(null);
    axiosClient
      .get("/admin/satpam")
      .then(({ data }) => {
        setSatpam(data);
        setFilteredList(data);
        setLoading(false);
        if (data.length > 0) {
          showToast.info(`Loaded ${data.length} satpam accounts`);
        }
      })
      .catch((err) => {
        setError("Gagal memuat data satpam.");
        setLoading(false);
        showToast.error("Gagal memuat data satpam");
      });
  };

  useEffect(() => {
    fetchSatpam();
  }, []);

  useEffect(() => {
    const filtered = satpam.filter(
      (s) =>
        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.nama && s.nama.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredList(filtered);
  }, [searchTerm, satpam]);

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
        axiosClient
          .delete(`/admin/satpam/${id}`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: response.data.message,
              confirmButtonColor: "#2563EB",
              timer: 2000,
              timerProgressBar: true,
            });
            fetchSatpam();
          })
          .catch((err) => {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
        <ListSkeleton count={5} />
      </div>
    );
  }

  if (error)
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-700 border border-red-200">
        {error}
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Manajemen Satpam
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Kelola akun satpam yang terdaftar
              </p>
            </div>
          </div>

          <Link
            to="/admin/satpam/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 sm:px-6 sm:py-3 touch-manipulation"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Satpam
          </Link>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-xl bg-white p-4 shadow-lg border border-gray-100"
      >
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan username atau nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Menampilkan {filteredList.length} dari {satpam.length} satpam
        </p>
      </motion.div>

      {/* Satpam List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredList.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg border border-gray-100">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-500">
              {searchTerm
                ? "Tidak ada satpam yang cocok dengan pencarian"
                : "Belum ada data satpam"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((s, index) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                      {s.nama
                        ? s.nama.charAt(0).toUpperCase()
                        : s.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {s.nama || s.username}
                      </p>
                      <p className="text-sm text-gray-500">@{s.username}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      🛡️ Satpam
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      Terdaftar:{" "}
                      {new Date(s.created_at).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    to={`/admin/satpam/edit/${s.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    Edit
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(s.id, s.nama)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                    Hapus
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
