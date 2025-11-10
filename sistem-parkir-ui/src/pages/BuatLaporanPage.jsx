import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CameraIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function BuatLaporanPage() {
  const [platNomor, setPlatNomor] = useState("");
  const [foto, setFoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState(null);
  const [sukses, setSukses] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitLaporan = (event) => {
    event.preventDefault();
    setError(null);
    setSukses(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("plat_nomor_terlapor", platNomor);
    formData.append("foto", foto);

    axiosClient
      .post("/laporan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        setSukses(response.data.message);
        setPlatNomor("");
        setFoto(null);
        setPreviewUrl(null);
        document.getElementById("foto").value = null;

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan. Gagal mengirim laporan.";
        setError(errorMessage);
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl"
    >
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Kembali ke Dashboard
        </button>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-100 p-2">
            <DocumentTextIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Buat Laporan Pelanggaran
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Laporkan kendaraan yang melanggar peraturan parkir
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
      >
        <form onSubmit={handleSubmitLaporan} className="space-y-6">
          <div>
            <label
              htmlFor="plat_nomor"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Plat Nomor Pelanggar
            </label>
            <input
              id="plat_nomor"
              name="plat_nomor"
              type="text"
              required
              className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
              placeholder="BE 1234 AA"
              value={platNomor}
              onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Upload Foto Bukti
            </label>

            {previewUrl ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative mb-4"
              >
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-64 w-full rounded-xl object-cover border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFoto(null);
                    setPreviewUrl(null);
                    document.getElementById("foto").value = null;
                  }}
                  className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg transition-all hover:bg-red-600"
                >
                  Hapus
                </button>
              </motion.div>
            ) : (
              <label className="group relative block cursor-pointer">
                <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-indigo-500 hover:bg-indigo-50">
                  <CameraIcon className="h-16 w-16 text-gray-400 transition-colors group-hover:text-indigo-600" />
                  <p className="mt-4 text-sm font-medium text-gray-600 group-hover:text-indigo-600">
                    Klik untuk upload foto
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG (Max 2MB)
                  </p>
                </div>
                <input
                  id="foto"
                  name="foto"
                  type="file"
                  required
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 rounded-xl bg-red-50 p-4 border border-red-200"
            >
              <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0 text-red-600" />
              <p className="text-sm font-medium text-red-800">{error}</p>
            </motion.div>
          )}

          {sukses && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-3 rounded-xl bg-green-50 p-4 border border-green-200"
            >
              <CheckCircleIcon className="h-6 w-6 flex-shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-bold text-green-800">{sukses}</p>
                <p className="mt-1 text-xs text-green-700">
                  Mengalihkan ke dashboard...
                </p>
              </div>
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || !foto}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Mengirim Laporan...
              </>
            ) : (
              <>
                <DocumentTextIcon className="h-6 w-6" />
                Kirim Laporan
              </>
            )}
          </motion.button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-200"
      >
        <p className="text-sm text-blue-900">
          <strong>💡 Tips:</strong> Pastikan plat nomor terlihat jelas di foto.
          Laporan akan diverifikasi oleh petugas sebelum diproses.
        </p>
      </motion.div>
    </motion.div>
  );
}
