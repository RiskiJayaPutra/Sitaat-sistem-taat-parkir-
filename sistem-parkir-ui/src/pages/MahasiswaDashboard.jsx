import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import EditLaporanModal from "../components/EditLaporanModal";
import {
  ExclamationTriangleIcon,
  TrophyIcon,
  DocumentTextIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  HandRaisedIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

export default function MahasiswaDashboard() {
  const [topPelanggar, setTopPelanggar] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [selectedPelanggaran, setSelectedPelanggaran] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [laporanToEdit, setLaporanToEdit] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = () => {
    // Ambil data dashboard mahasiswa dan top pelanggar
    Promise.all([
      axiosClient.get("/my-dashboard"),
      axiosClient.get("/report/top-pelanggar"),
    ])
      .then(([dashboardResponse, topResponse]) => {
        setDashboardData(dashboardResponse.data);
        setTopPelanggar(topResponse.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const handleEditLaporan = (laporan) => {
    setLaporanToEdit(laporan);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    fetchDashboard();
  };

  const handleCancelLaporan = (id) => {
    Swal.fire({
      title: "Batalkan Laporan?",
      text: "Laporan yang dibatalkan tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Batalkan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`/laporan/${id}`)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: "Laporan berhasil dibatalkan",
              confirmButtonColor: "#2563EB",
              timer: 2000,
              timerProgressBar: true,
            });

            axiosClient.get("/my-dashboard").then(({ data }) => {
              setDashboardData(data);
            });
            setSelectedLaporan(null);
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text:
                error.response?.data?.message || "Gagal membatalkan laporan",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Hero Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl bg-blue-600 dark:bg-blue-700 p-6 text-white shadow-xl sm:p-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl flex items-center gap-2">
              Selamat Datang, {dashboardData?.nama || "Mahasiswa"}!
              <HandRaisedIcon className="h-7 w-7" />
            </h1>
            <p className="mt-2 text-sm text-blue-100 dark:text-blue-200 sm:text-base">
              {dashboardData?.npm} - {dashboardData?.prodi}
            </p>
          </div>
          <Link
            to="/lapor"
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-gray-800 px-5 py-2.5 text-sm font-bold text-blue-600 dark:text-blue-400 shadow-lg transition-all hover:scale-105 hover:shadow-xl md:mt-0 sm:px-6 sm:py-3 touch-manipulation"
          >
            <DocumentTextIcon className="h-5 w-5" />
            Buat Laporan Baru
          </Link>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-3">
        <div
          className={`rounded-xl p-6 shadow-lg border ${
            dashboardData?.is_banned
              ? "bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700"
              : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`rounded-full p-3 ${
                dashboardData?.is_banned
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-green-100 dark:bg-green-900/30"
              }`}
            >
              {dashboardData?.is_banned ? (
                <ShieldExclamationIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              ) : (
                <TrophyIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status Parkir
              </p>
              <p
                className={`text-2xl font-bold ${
                  dashboardData?.is_banned
                    ? "text-red-900 dark:text-red-300"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {dashboardData?.status_parkir || "Aktif"}
              </p>
              {dashboardData?.is_banned && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1 font-semibold">
                  {dashboardData?.ban_info === "Permanen"
                    ? "Ban Permanen"
                    : `Hingga: ${dashboardData?.ban_info}`}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pelanggaran
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.pelanggaran_bulan_ini || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Bulan ini
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Laporan Saya
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {dashboardData?.total_laporan_saya || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Total laporan dibuat
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pelanggaran Saya */}
      {dashboardData?.pelanggaran_saya &&
        dashboardData.pelanggaran_saya.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Riwayat Pelanggaran Saya
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pelanggaran yang telah divalidasi
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {dashboardData.pelanggaran_saya.map((pelanggaran) => (
                <div
                  key={pelanggaran.id}
                  onClick={() => setSelectedPelanggaran(pelanggaran)}
                  className="cursor-pointer rounded-xl bg-red-50 dark:bg-red-900/20 p-4 shadow border border-red-200 dark:border-red-800 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-red-900 dark:text-red-300">
                        Plat: {pelanggaran.plat_nomor_terlapor}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Tanggal:{" "}
                        {new Date(pelanggaran.created_at).toLocaleDateString(
                          "id-ID"
                        )}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Validator: {pelanggaran.validator?.nama || "N/A"}
                      </p>
                    </div>
                    <img
                      src={`${API_URL}/storage/${pelanggaran.url_foto_bukti}`}
                      alt="Bukti"
                      className="h-20 w-20 rounded object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      {/* Laporan Saya */}
      {dashboardData?.laporan_saya && dashboardData.laporan_saya.length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Laporan yang Saya Buat
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Klik untuk melihat detail atau mengelola laporan
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {dashboardData.laporan_saya.map((laporan) => (
              <div
                key={laporan.id}
                onClick={() => setSelectedLaporan(laporan)}
                className="cursor-pointer rounded-xl bg-white dark:bg-gray-800 p-4 shadow border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">
                      Plat: {laporan.plat_nomor_terlapor}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tanggal:{" "}
                      {new Date(laporan.created_at).toLocaleDateString("id-ID")}
                    </p>
                    <span
                      className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold ${
                        laporan.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : laporan.status === "Valid"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {laporan.status}
                    </span>
                  </div>
                  {laporan.status === "Pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelLaporan(laporan.id);
                      }}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                    >
                      Batalkan
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Wall of Shame Section */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
            <TrophyIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Wall of Shame 🔥
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Top 10 Pelanggar Bulan Ini - Direset setiap 1 bulan
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700">
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {topPelanggar.length === 0 ? (
              <li className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                🎉 Tidak ada data pelanggaran bulan ini!
              </li>
            ) : (
              topPelanggar.map((pelanggar, index) => (
                <motion.li
                  key={pelanggar.npm}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${
                      index === 0
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                        : index === 1
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        : index === 2
                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {pelanggar.nama}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      NPM: {pelanggar.npm}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 dark:bg-red-900/30 px-4 py-2 text-sm font-bold text-red-800 dark:text-red-300">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                      {pelanggar.total_pelanggaran}
                    </span>
                  </div>
                </motion.li>
              ))
            )}
          </ul>
        </div>
      </motion.div>

      {/* Modal Detail Laporan */}
      {selectedLaporan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedLaporan(null)}
        >
          <div
            className="max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold dark:text-white">
                Detail Laporan
              </h3>
              <button
                onClick={() => setSelectedLaporan(null)}
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6 dark:text-white" />
              </button>
            </div>

            {/* Photo Gallery */}
            <div className="mb-4">
              {selectedLaporan.foto_pelanggaran &&
              selectedLaporan.foto_pelanggaran.length > 0 ? (
                <>
                  <div className="mb-2 text-sm font-medium text-gray-600">
                    Foto Bukti ({selectedLaporan.foto_pelanggaran.length})
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedLaporan.foto_pelanggaran.map((foto, index) => (
                      <a
                        key={index}
                        href={`${API_URL}/storage/${foto}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative group"
                      >
                        <img
                          src={`${API_URL}/storage/${foto}`}
                          alt={`Bukti ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200 transition-transform hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          Foto {index + 1}
                        </div>
                      </a>
                    ))}
                  </div>
                </>
              ) : (
                <img
                  src={`${API_URL}/storage/${selectedLaporan.url_foto_bukti}`}
                  alt="Bukti"
                  className="w-full rounded-lg"
                />
              )}
            </div>

            <p className="mb-2 dark:text-gray-300">
              <strong>Plat Nomor:</strong> {selectedLaporan.plat_nomor_terlapor}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Deskripsi:</strong> {selectedLaporan.deskripsi || "-"}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Status:</strong>{" "}
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  selectedLaporan.status === "Pending"
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                    : selectedLaporan.status === "Valid"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                }`}
              >
                {selectedLaporan.status}
              </span>
            </p>
            <p className="mb-4 dark:text-gray-300">
              <strong>Tanggal:</strong>{" "}
              {new Date(selectedLaporan.created_at).toLocaleString("id-ID")}
            </p>
            {selectedLaporan.status === "Pending" && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedLaporan(null);
                    handleEditLaporan(selectedLaporan);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 transition-colors"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                  Edit
                </button>
                <button
                  onClick={() => handleCancelLaporan(selectedLaporan.id)}
                  className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 transition-colors"
                >
                  Batalkan
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Laporan Modal */}
      {laporanToEdit && (
        <EditLaporanModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setLaporanToEdit(null);
          }}
          laporan={laporanToEdit}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Modal Detail Pelanggaran */}
      {selectedPelanggaran && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedPelanggaran(null)}
        >
          <div
            className="max-w-lg w-full rounded-xl bg-white dark:bg-gray-800 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-red-900 dark:text-red-300">
                Detail Pelanggaran
              </h3>
              <button
                onClick={() => setSelectedPelanggaran(null)}
                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="h-6 w-6 dark:text-white" />
              </button>
            </div>
            <img
              src={`${API_URL}/storage/${selectedPelanggaran.url_foto_bukti}`}
              alt="Bukti"
              className="w-full rounded-lg mb-4"
            />
            <p className="mb-2 dark:text-gray-300">
              <strong>Plat Nomor:</strong>{" "}
              {selectedPelanggaran.plat_nomor_terlapor}
            </p>
            <p className="mb-2 dark:text-gray-300">
              <strong>Validator:</strong>{" "}
              {selectedPelanggaran.validator?.nama || "N/A"}
            </p>
            <p className="mb-4 dark:text-gray-300">
              <strong>Tanggal:</strong>{" "}
              {new Date(selectedPelanggaran.created_at).toLocaleString("id-ID")}
            </p>
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-800 dark:text-red-300">
                ⚠️ Pelanggaran ini telah divalidasi oleh petugas. Jika Anda
                merasa ini kesalahan, hubungi bagian kemahasiswaan.
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
