// src/pages/AdminManageMahasiswa.jsx

import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UserGroupIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminManageMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchMahasiswa = () => {
    setLoading(true);
    setError(null);
    axiosClient
      .get("/mahasiswa")
      .then((response) => {
        setMahasiswaList(response.data);
        setFilteredList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data mahasiswa:", error);
        setError("Gagal memuat data.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  useEffect(() => {
    const filtered = mahasiswaList.filter(
      (mhs) =>
        mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mhs.npm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mhs.prodi &&
          mhs.prodi.nama_prodi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredList(filtered);
  }, [searchTerm, mahasiswaList]);

  const handleDelete = (id, nama) => {
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus ${nama}? Ini akan menghapus user, status parkir, dan kendaraannya.`
      )
    ) {
      return;
    }

    setMessage(null);
    axiosClient
      .delete(`/mahasiswa/${id}`)
      .then((response) => {
        setMessage({ type: "success", text: response.data.message });
        fetchMahasiswa();
      })
      .catch((error) => {
        console.error("Gagal menghapus:", error);
        setMessage({ type: "error", text: "Gagal menghapus data." });
      });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
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
            <div className="rounded-lg bg-indigo-100 p-2">
              <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Manajemen Mahasiswa
              </h2>
              <p className="text-sm text-gray-600">
                Kelola data mahasiswa dan kendaraan
              </p>
            </div>
          </div>

          <Link
            to="/admin/mahasiswa/tambah"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:bg-indigo-700 hover:scale-105"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Mahasiswa
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
            placeholder="Cari berdasarkan nama, NPM, atau prodi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-200 py-3 pl-10 pr-4 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Menampilkan {filteredList.length} dari {mahasiswaList.length}{" "}
          mahasiswa
        </p>
      </motion.div>

      {/* Mahasiswa List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredList.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-lg border border-gray-100">
            <UserGroupIcon className="mx-auto h-16 w-16 text-gray-300" />
            <p className="mt-4 text-lg font-medium text-gray-500">
              {searchTerm
                ? "Tidak ada mahasiswa yang cocok dengan pencarian"
                : "Belum ada data mahasiswa"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredList.map((mhs, index) => (
              <motion.div
                key={mhs.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                      {mhs.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        {mhs.nama}
                      </p>
                      <p className="text-sm text-gray-500">NPM: {mhs.npm}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                      {mhs.prodi ? mhs.prodi.nama_prodi : "Prodi dihapus"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
                      Angkatan {mhs.angkatan}
                    </span>
                    {mhs.kendaraan.map((kend) => (
                      <span
                        key={kend.id}
                        className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                      >
                        🚗 {kend.plat_nomor}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/admin/mahasiswa/edit/${mhs.id}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    Edit
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(mhs.id, mhs.nama)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-red-700"
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
