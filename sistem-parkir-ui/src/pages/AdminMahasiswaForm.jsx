// src/pages/AdminMahasiswaForm.jsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function AdminMahasiswaForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL jika ada (untuk mode Edit)
  const isEditMode = !!id; // True jika ada ID, False jika tidak (mode Tambah)

  // State untuk data form
  const [prodiList, setProdiList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    npm: "",
    prodi_id: "",
    angkatan: "",
    plat_nomor: "",
    password: "", // Tambahkan field password
  });
  const [fotoKtm, setFotoKtm] = useState(null);
  const [fotoStnk, setFotoStnk] = useState(null);
  const [existingFotoKtm, setExistingFotoKtm] = useState(null); // URL foto KTM yang sudah ada
  const [existingFotoStnk, setExistingFotoStnk] = useState(null); // URL foto STNK yang sudah ada

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // --- 1. FETCH DATA AWAL (Prodi & Data Mahasiswa jika Edit) ---
  useEffect(() => {
    // Ambil daftar Prodi untuk dropdown
    axiosClient.get("/prodi").then(({ data }) => setProdiList(data));

    // Jika Mode Edit, ambil data mahasiswa yang mau diedit
    if (isEditMode) {
      setLoading(true);
      axiosClient
        .get(`/mahasiswa/${id}`)
        .then(({ data }) => {
          setFormData({
            nama: data.nama,
            npm: data.npm,
            prodi_id: data.prodi_id,
            angkatan: data.angkatan,
            plat_nomor:
              data.kendaraan.length > 0 ? data.kendaraan[0].plat_nomor : "",
            password: "", // Password kosong saat edit (opsional untuk diubah)
          });

          // Simpan URL foto yang sudah ada
          if (data.url_foto_ktm) {
            setExistingFotoKtm(data.url_foto_ktm);
          }
          if (data.kendaraan.length > 0 && data.kendaraan[0].url_foto_stnk) {
            setExistingFotoStnk(data.kendaraan[0].url_foto_stnk);
          }

          setLoading(false);
        })
        .catch(() => {
          alert("Gagal mengambil data mahasiswa");
          navigate("/admin/mahasiswa");
        });
    }
  }, [id, isEditMode, navigate]);

  // --- 2. HANDLE PERUBAHAN INPUT TEKS ---
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. HANDLE SUBMIT FORM ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    // Gunakan FormData karena kita kirim file
    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("npm", formData.npm);
    data.append("prodi_id", formData.prodi_id);
    data.append("angkatan", formData.angkatan);

    // Kirim password jika diisi
    if (formData.password) {
      data.append("password", formData.password);
    }

    // Kirim file hanya jika user memilih file baru
    if (fotoKtm) data.append("foto_ktm", fotoKtm);

    // Data Kendaraan (Sesuai format array yang diminta backend)
    data.append("kendaraan[0][plat_nomor]", formData.plat_nomor);
    if (fotoStnk) data.append("kendaraan[0][foto_stnk]", fotoStnk);

    // Tentukan URL dan Metode berdasarkan mode
    let url = "/mahasiswa";
    if (isEditMode) {
      url = `/mahasiswa/${id}`;
      data.append("_method", "PUT");
    }

    // Kirim Request
    axiosClient
      .post(url, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert(`Mahasiswa berhasil ${isEditMode ? "diupdate" : "ditambahkan"}`);
        navigate("/admin/mahasiswa");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          // Error validasi
          setErrors(err.response.data.errors);
        } else {
          alert("Terjadi kesalahan. Coba lagi.");
        }
      });
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Mahasiswa" : "Tambah Mahasiswa Baru"}
        </h2>
        <Link
          to="/admin/mahasiswa"
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          &larr; Kembali
        </Link>
      </div>

      {/* Tampilkan Error Validasi Umum (jika ada) */}
      {errors && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600">
          <ul className="list-disc pl-5">
            {Object.keys(errors).map((key) => (
              <li key={key}>{errors[key][0]}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAMA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            required
            value={formData.nama}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* NPM & ANGKATAN (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              NPM
            </label>
            <input
              type="text"
              name="npm"
              required
              value={formData.npm}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Angkatan
            </label>
            <input
              type="text"
              name="angkatan"
              required
              value={formData.angkatan}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* PRODI (Dropdown) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Program Studi
          </label>
          <select
            name="prodi_id"
            required
            value={formData.prodi_id}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">-- Pilih Prodi --</option>
            {prodiList.map((prodi) => (
              <option key={prodi.id} value={prodi.id}>
                {prodi.nama_prodi}
              </option>
            ))}
          </select>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password {isEditMode && "(Kosongkan jika tidak ingin mengubah)"}
          </label>
          <input
            type="password"
            name="password"
            required={!isEditMode} // Required hanya saat tambah baru
            value={formData.password}
            onChange={handleChange}
            placeholder={
              isEditMode
                ? "Masukkan password baru (opsional)"
                : "Masukkan password"
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {isEditMode && (
            <p className="mt-1 text-xs text-gray-500">
              Biarkan kosong jika tidak ingin mengubah password
            </p>
          )}
        </div>

        {/* KENDARAAN (Plat Nomor) */}
        <div className="border-t pt-4">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Data Kendaraan
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Plat Nomor
            </label>
            <input
              type="text"
              name="plat_nomor"
              required
              value={formData.plat_nomor}
              onChange={handleChange}
              placeholder="BE 1234 XX"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* UPLOAD FOTO (Grid 2 Kolom) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto KTM (PDF)
            </label>
            {isEditMode && existingFotoKtm && !fotoKtm && (
              <div className="mt-2 mb-2 rounded-md bg-blue-50 p-3 border border-blue-200">
                <p className="text-xs text-blue-800 mb-1">
                  Foto KTM yang sudah ada:
                </p>
                <a
                  href={`http://localhost:8000/storage/${existingFotoKtm}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  📄 Lihat Foto KTM
                </a>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFotoKtm(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {isEditMode && (
              <p className="mt-1 text-xs text-gray-500">
                Biarkan kosong jika tidak ingin mengubah.
              </p>
            )}
            {fotoKtm && (
              <p className="mt-1 text-xs text-green-600">
                ✓ File baru dipilih: {fotoKtm.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto STNK (PDF)
            </label>
            {isEditMode && existingFotoStnk && !fotoStnk && (
              <div className="mt-2 mb-2 rounded-md bg-blue-50 p-3 border border-blue-200">
                <p className="text-xs text-blue-800 mb-1">
                  Foto STNK yang sudah ada:
                </p>
                <a
                  href={`http://localhost:8000/storage/${existingFotoStnk}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  📄 Lihat Foto STNK
                </a>
              </div>
            )}
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFotoStnk(e.target.files[0])}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {isEditMode && (
              <p className="mt-1 text-xs text-gray-500">
                Biarkan kosong jika tidak ingin mengubah.
              </p>
            )}
            {fotoStnk && (
              <p className="mt-1 text-xs text-green-600">
                ✓ File baru dipilih: {fotoStnk.name}
              </p>
            )}
          </div>
        </div>

        {/* TOMBOL SUBMIT */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center items-center gap-2 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed touch-manipulation"
          >
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading
              ? "Memuat..."
              : isEditMode
              ? "Update Mahasiswa"
              : "Simpan Mahasiswa Baru"}
          </button>
        </div>
      </form>
    </div>
  );
}
