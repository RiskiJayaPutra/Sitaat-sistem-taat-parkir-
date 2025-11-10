// src/pages/SatpamDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function SatpamDashboard() {
  const [laporan, setLaporan] = useState([]);
  const [stats, setStats] = useState({ pending: 0, valid: 0, ditolak: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchLaporan = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      axiosClient.get("/laporan/pending"),
      axiosClient.get("/laporan/satpam-stats"),
      axiosClient.get("/me"),
    ])
      .then(([laporanResponse, statsResponse, meResponse]) => {
        setLaporan(laporanResponse.data);
        setStats(statsResponse.data);
        setUser(meResponse.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data:", error);
        setError("Gagal memuat data laporan.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleValidasi = (id) => {
    setMessage(null);
    axiosClient
      .post(`/laporan/${id}/validasi`)
      .then((response) => {
        setMessage({
          type: "success",
          text: response.data.sanksi || response.data.message,
        });
        fetchLaporan();
      })
      .catch((error) => {
        console.error("Gagal validasi:", error);
        setMessage({
          type: "error",
          text: "Gagal memvalidasi laporan. Coba lagi.",
        });
      });
  };

  const handleTolak = (id) => {
    setMessage(null);
    axiosClient
      .post(`/laporan/${id}/tolak`)
      .then((response) => {
        setMessage({ type: "success", text: response.data.message });
        fetchLaporan();
      })
      .catch((error) => {
        console.error("Gagal menolak:", error);
        setMessage({
          type: "error",
          text: "Gagal menolak laporan. Coba lagi.",
        });
      });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-xl"
      >
        <h2 className="text-3xl font-bold">Dashboard Satpam 🛡️</h2>
        <p className="mt-2 text-blue-100">
          Kelola laporan pelanggaran parkir yang masuk
          {user?.nama && (
            <span className="font-semibold text-white"> • {user.nama}</span>
          )}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Divalidasi</p>
              <p className="text-2xl font-bold text-gray-900">{stats.valid}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.ditolak}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

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

      {/* Laporan List */}
      {!loading && !error && (
        <>
          {laporan.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-white p-12 text-center shadow-lg border border-gray-100"
            >
              <CheckCircleIcon className="mx-auto h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-500">
                Tidak ada laporan pending saat ini
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Semua laporan telah diproses! 🎉
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {laporan.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100 transition-all hover:shadow-xl"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {item.plat_nomor_terlapor}
                          </h3>
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                            <ClockIcon className="h-4 w-4" />
                            {item.status}
                          </span>
                        </div>
                        <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          Dilaporkan:{" "}
                          {new Date(item.created_at).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    {/* Foto Bukti */}
                    <div className="mt-4">
                      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                        <PhotoIcon className="h-5 w-5" />
                        Foto Bukti Pelanggaran:
                      </p>
                      <a
                        href={`http://localhost:8000/storage/${item.url_foto_bukti}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img
                          src={`http://localhost:8000/storage/${item.url_foto_bukti}`}
                          alt={`Bukti ${item.plat_nomor_terlapor}`}
                          className="h-48 w-full rounded-lg border-2 border-gray-200 object-cover transition-transform hover:scale-105"
                        />
                      </a>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleValidasi(item.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700"
                      >
                        <CheckCircleIcon className="h-5 w-5" />
                        Validasi
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTolak(item.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-50"
                      >
                        <XCircleIcon className="h-5 w-5" />
                        Tolak
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
