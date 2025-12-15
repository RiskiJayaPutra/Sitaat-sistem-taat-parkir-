// src/pages/SatpamDashboard.jsx

import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { DashboardSkeleton } from "../components/SkeletonLoader";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhotoIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";

export default function SatpamDashboard() {
  const [laporan, setLaporan] = useState([]);
  const [allLaporan, setAllLaporan] = useState([]); // All laporan for filtering
  const [stats, setStats] = useState({ pending: 0, valid: 0, ditolak: 0 });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // pending, valid, ditolak

  const fetchLaporan = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      axiosClient.get("/my-dashboard"), // Get all laporan from my dashboard
      axiosClient.get("/laporan/satpam-stats"),
      axiosClient.get("/me"),
    ])
      .then(([dashboardResponse, statsResponse, meResponse]) => {
        console.log("Dashboard Response:", dashboardResponse.data);
        console.log("Stats Response:", statsResponse.data);
        console.log("Me Response:", meResponse.data);

        const allData = dashboardResponse.data.laporan || [];
        setAllLaporan(allData);
        setLaporan(allData.filter((l) => l.status === "Pending")); // Default show pending
        setStats(statsResponse.data);
        setUser(meResponse.data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching laporan:", error);
        console.error("Error response:", error.response);
        setError("Gagal memuat data laporan.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  useEffect(() => {
    // Filter laporan based on active tab
    if (activeTab === "pending") {
      setLaporan(allLaporan.filter((l) => l.status === "Pending"));
    } else if (activeTab === "valid") {
      setLaporan(allLaporan.filter((l) => l.status === "Valid"));
    } else if (activeTab === "ditolak") {
      setLaporan(allLaporan.filter((l) => l.status === "Ditolak"));
    }
  }, [activeTab, allLaporan]);

  const handleValidasi = (id) => {
    Swal.fire({
      title: "Validasi Laporan?",
      text: "Laporan ini akan divalidasi dan sanksi akan diberikan ke pelanggar.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Validasi!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .post(`/laporan/${id}/validasi`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil Divalidasi!",
              text: response.data.sanksi || response.data.message,
              confirmButtonColor: "#2563EB",
              timer: 3000,
              timerProgressBar: true,
            });
            fetchLaporan();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal memvalidasi laporan. Coba lagi.",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  const handleTolak = (id) => {
    Swal.fire({
      title: "Tolak Laporan?",
      text: "Laporan ini akan ditolak dan tidak akan diproses lebih lanjut.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Tolak!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .post(`/laporan/${id}/tolak`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil Ditolak!",
              text: response.data.message,
              confirmButtonColor: "#2563EB",
              timer: 2000,
              timerProgressBar: true,
            });
            fetchLaporan();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal menolak laporan. Coba lagi.",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  const handleUnvalidasi = (id) => {
    Swal.fire({
      title: "Batalkan Validasi?",
      text: "Laporan akan dikembalikan ke status Pending jika terjadi kesalahan validasi.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#F59E0B",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Batalkan Validasi!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .post(`/laporan/${id}/unvalidasi`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Validasi Dibatalkan!",
              text:
                response.data.message ||
                "Laporan dikembalikan ke status Pending",
              confirmButtonColor: "#2563EB",
              timer: 2000,
              timerProgressBar: true,
            });
            fetchLaporan();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text:
                error.response?.data?.message ||
                "Gagal membatalkan validasi. Coba lagi.",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-blue-600 p-6 text-white shadow-xl"
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
          className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <ClockIcon className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.pending}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Divalidasi
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.valid}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-3">
            <XCircleIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Ditolak
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.ditolak}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl bg-red-50 p-6 text-center text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "pending"
              ? "border-yellow-500 text-yellow-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />
            Pending ({stats.pending})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("valid")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "valid"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="h-5 w-5" />
            Divalidasi ({stats.valid})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("ditolak")}
          className={`px-6 py-3 font-semibold transition-all border-b-2 ${
            activeTab === "ditolak"
              ? "border-red-500 text-red-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <div className="flex items-center gap-2">
            <XCircleIcon className="h-5 w-5" />
            Ditolak ({stats.ditolak})
          </div>
        </button>
      </div>

      {/* Laporan List */}
      {!error && (
        <>
          {laporan.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl bg-white dark:bg-gray-800 p-12 text-center shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <CheckCircleIcon className="mx-auto h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-500">
                Tidak ada laporan {activeTab} saat ini
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {activeTab === "pending"
                  ? "Semua laporan telah diproses! 🎉"
                  : "Tidak ada data"}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {laporan.map((item, index) => {
                // Parse foto pelanggaran (multiple photos) safely
                let fotoPelanggaran = [];
                try {
                  if (item.foto_pelanggaran) {
                    // Try to parse if it's a JSON string
                    if (typeof item.foto_pelanggaran === "string") {
                      // Check if it starts with '[' or '{' to determine if it's JSON
                      if (
                        item.foto_pelanggaran.startsWith("[") ||
                        item.foto_pelanggaran.startsWith("{")
                      ) {
                        fotoPelanggaran = JSON.parse(item.foto_pelanggaran);
                      } else {
                        // It's a single path string, wrap in array
                        fotoPelanggaran = [item.foto_pelanggaran];
                      }
                    } else if (Array.isArray(item.foto_pelanggaran)) {
                      // Already an array
                      fotoPelanggaran = item.foto_pelanggaran;
                    }
                  }

                  // Fallback to url_foto_bukti if no foto_pelanggaran
                  if (fotoPelanggaran.length === 0 && item.url_foto_bukti) {
                    fotoPelanggaran = [item.url_foto_bukti];
                  }
                } catch (error) {
                  console.error("Error parsing foto_pelanggaran:", error);
                  // Fallback to url_foto_bukti
                  if (item.url_foto_bukti) {
                    fotoPelanggaran = [item.url_foto_bukti];
                  }
                }

                const totalFoto = fotoPelanggaran.length;

                // Determine grid layout based on number of photos
                const getGridClass = () => {
                  if (totalFoto === 1) return "grid-cols-1";
                  if (totalFoto === 2) return "grid-cols-2";
                  if (totalFoto === 3) return "grid-cols-3";
                  if (totalFoto === 4) return "grid-cols-2";
                  if (totalFoto >= 5) return "grid-cols-3";
                  return "grid-cols-1";
                };

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
                  >
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {item.plat_nomor_terlapor}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                                item.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.status === "Valid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              <ClockIcon className="h-4 w-4" />
                              {item.status}
                            </span>
                          </div>

                          {/* Info Pelapor */}
                          {item.pelapor && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                              <span className="font-medium">Pelapor:</span>{" "}
                              {item.pelapor.nama || item.pelapor.username}
                            </p>
                          )}

                          <p className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4" />
                            {new Date(item.created_at).toLocaleString("id-ID", {
                              dateStyle: "long",
                              timeStyle: "short",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Deskripsi Pelanggaran */}
                      {item.deskripsi && (
                        <div className="mb-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            📝 Deskripsi Pelanggaran:
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {item.deskripsi}
                          </p>
                        </div>
                      )}

                      {/* Foto Bukti */}
                      <div className="mb-4">
                        <p className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          <PhotoIcon className="h-5 w-5" />
                          Foto Bukti Pelanggaran ({totalFoto})
                        </p>

                        {totalFoto > 0 ? (
                          <div className={`grid ${getGridClass()} gap-3`}>
                            {fotoPelanggaran.map((foto, idx) => (
                              <a
                                key={idx}
                                href={`http://localhost:8000/storage/${foto}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative block overflow-hidden rounded-lg"
                              >
                                <img
                                  src={`http://localhost:8000/storage/${foto}`}
                                  alt={`Bukti ${idx + 1}`}
                                  className={`w-full object-cover transition-all duration-300 group-hover:scale-110 ${
                                    totalFoto === 1
                                      ? "h-80"
                                      : totalFoto === 2
                                      ? "h-64"
                                      : "h-48"
                                  }`}
                                />
                                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                  {idx + 1}/{totalFoto}
                                </div>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 text-center">
                            <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-500">
                              Tidak ada foto bukti
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3">
                        {item.status === "Pending" && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleValidasi(item.id)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                              Validasi
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleTolak(item.id)}
                              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-lg transition-all hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
                            >
                              <XCircleIcon className="h-5 w-5" />
                              Tolak
                            </motion.button>
                          </>
                        )}
                        {item.status === "Valid" && (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleUnvalidasi(item.id)}
                            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-yellow-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-yellow-700"
                          >
                            <ArrowUturnLeftIcon className="h-5 w-5" />
                            Batalkan Validasi
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
