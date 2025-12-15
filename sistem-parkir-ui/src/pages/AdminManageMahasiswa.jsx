// src/pages/AdminManageMahasiswa.jsx

import React, { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { showToast } from "../utils/toast";
import {
  UserGroupIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  TruckIcon,
  PhotoIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function AdminManageMahasiswa() {
  const [mahasiswaList, setMahasiswaList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProdi, setFilterProdi] = useState("");
  const [filterAngkatan, setFilterAngkatan] = useState("");
  const [prodiOptions, setProdiOptions] = useState([]);
  const [angkatanOptions, setAngkatanOptions] = useState([]);
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

        // Extract unique prodi and angkatan
        const prodis = [
          ...new Set(
            response.data.map((m) => m.prodi?.nama_prodi).filter(Boolean)
          ),
        ];
        const angkatans = [
          ...new Set(response.data.map((m) => m.angkatan).filter(Boolean)),
        ].sort((a, b) => b - a);

        setProdiOptions(prodis);
        setAngkatanOptions(angkatans);
        setLoading(false);

        if (response.data.length > 0) {
          showToast.success(`Loaded ${response.data.length} mahasiswa`);
        }
      })
      .catch((error) => {
        setError("Gagal memuat data.");
        setLoading(false);
        showToast.error("Gagal memuat data mahasiswa");
      });
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  useEffect(() => {
    let filtered = mahasiswaList.filter(
      (mhs) =>
        mhs.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mhs.npm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mhs.prodi &&
          mhs.prodi.nama_prodi.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Apply prodi filter
    if (filterProdi) {
      filtered = filtered.filter(
        (mhs) => mhs.prodi?.nama_prodi === filterProdi
      );
    }

    // Apply angkatan filter
    if (filterAngkatan) {
      filtered = filtered.filter((mhs) => mhs.angkatan === filterAngkatan);
    }

    setFilteredList(filtered);
  }, [searchTerm, filterProdi, filterAngkatan, mahasiswaList]);

  const exportToCSV = () => {
    if (filteredList.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Tidak Ada Data",
        text: "Tidak ada data untuk diekspor",
        confirmButtonColor: "#2563EB",
      });
      return;
    }

    const headers = ["No", "Nama", "NPM", "Prodi", "Angkatan", "Plat Nomor"];
    const csvContent = [
      headers.join(","),
      ...filteredList.map((mhs, index) =>
        [
          index + 1,
          `"${mhs.nama}"`,
          mhs.npm,
          `"${mhs.prodi?.nama_prodi || "-"}"`,
          mhs.angkatan,
          `"${mhs.kendaraan.map((k) => k.plat_nomor).join(", ") || "-"}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `data_mahasiswa_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil diekspor ke CSV",
      confirmButtonColor: "#2563EB",
      timer: 2000,
      timerProgressBar: true,
    });
  };

  const handleDelete = (id, nama) => {
    Swal.fire({
      title: "Hapus Mahasiswa?",
      text: `Apakah Anda yakin ingin menghapus ${nama}? Ini akan menghapus user, status parkir, dan kendaraannya.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosClient
          .delete(`/mahasiswa/${id}`)
          .then((response) => {
            Swal.fire({
              icon: "success",
              title: "Berhasil!",
              text: response.data.message,
              confirmButtonColor: "#2563EB",
              timer: 2000,
              timerProgressBar: true,
            });
            fetchMahasiswa();
          })
          .catch((error) => {
            Swal.fire({
              icon: "error",
              title: "Gagal!",
              text: "Gagal menghapus data.",
              confirmButtonColor: "#EF4444",
            });
          });
      }
    });
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
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
            <div className="rounded-lg bg-blue-100 p-2">
              <UserGroupIcon className="h-6 w-6 text-blue-600 sm:h-8 sm:w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
                Manajemen Mahasiswa
              </h2>
              <p className="text-xs text-gray-600 sm:text-sm dark:text-gray-400">
                Kelola data mahasiswa dan kendaraan
              </p>
            </div>
          </div>

          <Link
            to="/admin/mahasiswa/tambah"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:scale-105 sm:px-6 sm:py-3 touch-manipulation"
          >
            <PlusIcon className="h-5 w-5" />
            Tambah Mahasiswa
          </Link>
        </div>
      </motion.div>

      {/* Filter & Export Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="rounded-xl bg-white p-4 shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700"
      >
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full">
            {/* Search */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama, NPM, atau prodi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-gray-200 py-2 pl-10 pr-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>

            {/* Filter Prodi */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <select
                value={filterProdi}
                onChange={(e) => setFilterProdi(e.target.value)}
                className="w-full sm:w-48 rounded-lg border-2 border-gray-200 py-2 pl-10 pr-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white"
              >
                <option value="">Semua Prodi</option>
                {prodiOptions.map((prodi) => (
                  <option key={prodi} value={prodi}>
                    {prodi}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Angkatan */}
            <select
              value={filterAngkatan}
              onChange={(e) => setFilterAngkatan(e.target.value)}
              className="w-full sm:w-32 rounded-lg border-2 border-gray-200 py-2 px-4 transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 appearance-none bg-white"
            >
              <option value="">Semua Angkatan</option>
              {angkatanOptions.map((angkatan) => (
                <option key={angkatan} value={angkatan}>
                  {angkatan}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-green-700 hover:scale-105 whitespace-nowrap"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
            Export CSV
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-700">
              {filteredList.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-700">
              {mahasiswaList.length}
            </span>{" "}
            mahasiswa
          </p>
          {(filterProdi || filterAngkatan || searchTerm) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterProdi("");
                setFilterAngkatan("");
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset Filter
            </button>
          )}
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
                className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl sm:flex-row sm:items-center sm:justify-between dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                      {mhs.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {mhs.nama}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        NPM: {mhs.npm}
                      </p>
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
                        className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                      >
                        <TruckIcon className="h-3 w-3" />
                        {kend.plat_nomor}
                      </span>
                    ))}
                  </div>

                  {/* Tombol Lihat Dokumen */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mhs.foto_ktm && (
                      <a
                        href={`http://localhost:8000/storage/${mhs.foto_ktm}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-purple-100 px-3 py-1.5 text-xs font-medium text-purple-800 transition-all hover:bg-purple-200 hover:scale-105"
                      >
                        <PhotoIcon className="h-4 w-4" />
                        Lihat KTM
                      </a>
                    )}
                    {mhs.kendaraan.map((kend) =>
                      kend.foto_stnk ? (
                        <a
                          key={`stnk-${kend.id}`}
                          href={`http://localhost:8000/storage/${kend.foto_stnk}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-800 transition-all hover:bg-orange-200 hover:scale-105"
                        >
                          <DocumentTextIcon className="h-4 w-4" />
                          STNK {kend.plat_nomor}
                        </a>
                      ) : null
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    to={`/admin/mahasiswa/edit/${mhs.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-lg transition-all hover:bg-blue-700"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    Edit
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(mhs.id, mhs.nama)}
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
