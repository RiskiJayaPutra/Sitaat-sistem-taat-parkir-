import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "../components/SkeletonLoader";
import {
  ChartPieIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [bannedUsers, setBannedUsers] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [stats, setStats] = useState({
    total_mahasiswa: 0,
    total_satpam: 0,
    total_banned: 0,
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const formatChartData = (apiData) => {
    const labels = apiData.map((data) => data.nama_prodi);
    const dataPoints = apiData.map((data) => data.total);

    return {
      labels: labels,
      datasets: [
        {
          label: "Total Pelanggaran",
          data: dataPoints,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
          ],
          borderColor: "#fff",
          borderWidth: 2,
        },
      ],
    };
  };

  const fetchData = () => {
    setLoading(true);
    setError(null);

    Promise.all([
      axiosClient.get("/admin/banned-users"),
      axiosClient.get("/report/per-prodi"),
      axiosClient.get("/admin/dashboard-stats"),
      axiosClient.get("/me"),
    ])
      .then(([bannedResponse, prodiResponse, statsResponse, meResponse]) => {
        setBannedUsers(bannedResponse.data);
        setChartData(formatChartData(prodiResponse.data));
        setStats(statsResponse.data);
        setUser(meResponse.data.user);
        setLoading(false);
      })
      .catch((error) => {
        setError("Gagal memuat data dashboard.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUnban = (mahasiswa_id) => {
    setMessage(null);
    axiosClient
      .post(`/admin/unban/${mahasiswa_id}`)
      .then((response) => {
        setMessage({ type: "success", text: response.data.message });
        fetchData();
      })
      .catch((error) => {
        setMessage({ type: "error", text: "Gagal melepas ban. Coba lagi." });
      });
  };

  if (loading) {
    return <DashboardSkeleton />;
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
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="mt-1 text-sm text-gray-600">
            Kelola sistem parkir dan data mahasiswa
            {user?.nama && (
              <span className="font-semibold text-blue-600">
                {" "}
                • {user.nama}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/satpam"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
          >
            <ShieldCheckIcon className="h-5 w-5" />
            Kelola Satpam
          </Link>
          <Link
            to="/admin/mahasiswa"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105"
          >
            <UserGroupIcon className="h-5 w-5" />
            Kelola Mahasiswa
          </Link>
        </div>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100 lg:col-span-2"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ChartPieIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Statistik Pelanggaran
              </h3>
              <p className="text-sm text-gray-600">
                Per Prodi (1 Bulan Terakhir)
              </p>
            </div>
          </div>
          <div className="relative" style={{ height: "350px" }}>
            {chartData && chartData.labels.length > 0 ? (
              <Pie
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        padding: 15,
                        font: {
                          size: 12,
                        },
                      },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">
                  Tidak ada data pelanggaran valid untuk ditampilkan.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="rounded-2xl bg-red-600 p-6 text-white shadow-xl">
            <ShieldCheckIcon className="h-10 w-10 opacity-80" />
            <p className="mt-4 text-sm font-medium opacity-90">
              User Terblokir
            </p>
            <p className="text-4xl font-bold">{stats.total_banned}</p>
          </div>

          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-xl">
            <UserGroupIcon className="h-10 w-10 opacity-80" />
            <p className="mt-4 text-sm font-medium opacity-90">
              Total Mahasiswa
            </p>
            <p className="text-4xl font-bold">{stats.total_mahasiswa}</p>
          </div>

          <div className="rounded-2xl bg-green-600 p-6 text-white shadow-xl">
            <ShieldCheckIcon className="h-10 w-10 opacity-80" />
            <p className="mt-4 text-sm font-medium opacity-90">Total Satpam</p>
            <p className="text-4xl font-bold">{stats.total_satpam}</p>
          </div>
        </motion.div>
      </div>

      {/* Banned Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-red-100 p-2">
            <ShieldCheckIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Daftar Mahasiswa Terblokir
            </h3>
            <p className="text-sm text-gray-600">
              Kelola pengguna yang dibatasi aksesnya
            </p>
          </div>
        </div>

        {bannedUsers.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg border border-gray-100">
            <ShieldCheckIcon className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-500">
              Tidak ada mahasiswa yang terblokir
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Semua mahasiswa dalam status aktif! 🎉
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bannedUsers.map((item, index) => (
              <motion.div
                key={item.mahasiswa_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg border border-gray-100 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900">
                    {item.mahasiswa.nama}
                  </p>
                  <p className="text-sm text-gray-500">
                    NPM: {item.mahasiswa.npm}
                  </p>
                  <div className="mt-2">
                    {item.is_banned_permanently ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800">
                        🔒 PERMANEN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-800">
                        ⏰ Hingga:{" "}
                        {new Date(item.ban_expires_at).toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleUnban(item.mahasiswa_id)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-green-700"
                >
                  <ShieldCheckIcon className="h-5 w-5" />
                  Lepas Ban
                </motion.button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
