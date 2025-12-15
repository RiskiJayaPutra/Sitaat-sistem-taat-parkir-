import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {
  CameraIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

export default function BuatLaporanPage() {
  const [platNomor, setPlatNomor] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [fotos, setFotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Validasi maksimal 5 foto
    if (files.length + fotos.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Maksimal 5 Foto",
        text: "Anda hanya bisa mengunggah maksimal 5 foto per laporan",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    // Validasi ukuran file (max 2MB per file)
    const invalidFiles = files.filter((file) => file.size > 2048000);
    if (invalidFiles.length > 0) {
      Swal.fire({
        icon: "warning",
        title: "File Terlalu Besar",
        text: "Setiap foto maksimal 2MB",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    const newFotos = [...fotos, ...files];
    setFotos(newFotos);

    // Generate preview URLs
    const newPreviews = [...previewUrls];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === newFotos.length) {
          setPreviewUrls(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    const newFotos = fotos.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setFotos(newFotos);
    setPreviewUrls(newPreviews);
  };

  const handleSubmitLaporan = (event) => {
    event.preventDefault();

    if (fotos.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Foto Diperlukan",
        text: "Harap upload minimal 1 foto bukti pelanggaran",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("plat_nomor_terlapor", platNomor);
    formData.append("deskripsi", deskripsi);

    // Append multiple fotos
    fotos.forEach((foto, index) => {
      formData.append(`fotos[${index}]`, foto);
    });

    axiosClient
      .post("/laporan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        setPlatNomor("");
        setDeskripsi("");
        setFotos([]);
        setPreviewUrls([]);
        if (document.getElementById("fotos")) {
          document.getElementById("fotos").value = null;
        }

        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text:
            response.data.message ||
            "Laporan berhasil dikirim dan sedang menunggu validasi.",
          confirmButtonColor: "#2563EB",
          confirmButtonText: "OK",
          timer: 3000,
          timerProgressBar: true,
        }).then(() => {
          navigate("/dashboard");
        });
      })
      .catch((error) => {
        setLoading(false);

        const errorMessage =
          error.response?.data?.message ||
          "Terjadi kesalahan. Gagal mengirim laporan.";

        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: errorMessage,
          confirmButtonColor: "#EF4444",
          confirmButtonText: "Coba Lagi",
        });
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
          <div className="rounded-lg bg-blue-100 p-2">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
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
              className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
              placeholder="BE 1234 AA"
              value={platNomor}
              onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
            />
          </div>

          <div>
            <label
              htmlFor="deskripsi"
              className="mb-2 block text-sm font-bold text-gray-700"
            >
              Deskripsi Pelanggaran
            </label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              rows="4"
              required
              minLength="10"
              className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
              placeholder="Jelaskan pelanggaran yang terjadi (minimal 10 karakter)..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Upload Foto Bukti (1-5 foto)
            </label>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-4"
              >
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="h-32 w-full rounded-xl object-cover border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      Hapus
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      Foto {index + 1}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Upload button - show if less than 5 photos */}
            {fotos.length < 5 && (
              <label className="group relative block cursor-pointer">
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-600 hover:bg-blue-50">
                  <CameraIcon className="h-12 w-12 text-gray-400 transition-colors group-hover:text-blue-600" />
                  <p className="mt-2 text-sm font-medium text-gray-600 group-hover:text-blue-600">
                    {fotos.length === 0
                      ? "Klik untuk upload foto"
                      : "Tambah foto lagi"}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG (Max 2MB) - {fotos.length}/5 foto
                  </p>
                </div>
                <input
                  id="fotos"
                  name="fotos"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}

            <p className="mt-3 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <strong>⚠️ Penting:</strong> Satu laporan hanya untuk 1 kendaraan.
              Upload 1-5 foto bukti pelanggaran kendaraan yang sama.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || fotos.length === 0}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-blue-500/30 focus:outline-none focus:ring-4 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:hover:bg-gray-400"
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Mengirim Laporan...
              </>
            ) : (
              <>
                <DocumentTextIcon className="h-6 w-6" />
                Kirim Laporan ({fotos.length} foto)
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
