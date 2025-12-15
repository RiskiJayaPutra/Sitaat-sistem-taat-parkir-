import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CameraIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";
import Swal from "sweetalert2";

export default function EditLaporanModal({
  isOpen,
  onClose,
  laporan,
  onSuccess,
}) {
  const [platNomor, setPlatNomor] = useState(
    laporan?.plat_nomor_terlapor || ""
  );
  const [deskripsi, setDeskripsi] = useState(laporan?.deskripsi || "");
  const [newFotos, setNewFotos] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentPhotoCount = laporan?.foto_pelanggaran?.length || 0;
  const totalPhotos = currentPhotoCount + newFotos.length;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);

    // Validasi total maksimal 5 foto
    if (totalPhotos + files.length > 5) {
      Swal.fire({
        icon: "warning",
        title: "Maksimal 5 Foto",
        text: `Total foto tidak boleh lebih dari 5. Anda sudah memiliki ${currentPhotoCount} foto, dapat menambah ${
          5 - currentPhotoCount
        } foto lagi.`,
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    // Validasi ukuran file
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

    const updatedFotos = [...newFotos, ...files];
    setNewFotos(updatedFotos);

    // Generate previews
    const newPreviews = [...previewUrls];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === updatedFotos.length) {
          setPreviewUrls(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewPhoto = (index) => {
    const updatedFotos = newFotos.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setNewFotos(updatedFotos);
    setPreviewUrls(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("plat_nomor_terlapor", platNomor);
    formData.append("deskripsi", deskripsi);

    // Append new photos
    newFotos.forEach((foto, index) => {
      formData.append(`fotos[${index}]`, foto);
    });

    try {
      const response = await axiosClient.put(
        `/laporan/${laporan.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setLoading(false);

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: response.data.message || "Laporan berhasil diupdate",
        confirmButtonColor: "#2563EB",
        timer: 2000,
        timerProgressBar: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      setLoading(false);
      const errorMessage =
        error.response?.data?.message || "Gagal mengupdate laporan";

      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        >
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <PencilSquareIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Edit Laporan
                </h3>
                <p className="text-sm text-gray-600">
                  Perbaiki data laporan Anda
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Plat Nomor Pelanggar
              </label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
                placeholder="BE 1234 AA"
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Deskripsi Pelanggaran
              </label>
              <textarea
                rows="4"
                required
                minLength="10"
                className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20"
                placeholder="Jelaskan pelanggaran yang terjadi..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-gray-700">
                Foto Bukti Saat Ini
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {laporan?.foto_pelanggaran?.map((foto, index) => (
                  <div key={index} className="relative">
                    <img
                      src={`http://127.0.0.1:8000/storage/${foto}`}
                      alt={`Foto ${index + 1}`}
                      className="h-24 w-full rounded-lg object-cover border-2 border-gray-200"
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                      Foto {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              {/* New photos preview */}
              {previewUrls.length > 0 && (
                <div>
                  <label className="mb-2 block text-sm font-bold text-green-700">
                    Foto Baru ({newFotos.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`New ${index + 1}`}
                          className="h-24 w-full rounded-lg object-cover border-2 border-green-400"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute right-1 top-1 rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          Hapus
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                          Baru {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload button */}
              {totalPhotos < 5 && (
                <label className="group relative block cursor-pointer">
                  <div className="flex h-24 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition-all hover:border-blue-600 hover:bg-blue-50">
                    <CameraIcon className="h-8 w-8 text-gray-400 transition-colors group-hover:text-blue-600" />
                    <p className="mt-1 text-xs font-medium text-gray-600 group-hover:text-blue-600">
                      Tambah foto ({totalPhotos}/5)
                    </p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg,image/png"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-700 transition-all hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition-all hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </span>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
