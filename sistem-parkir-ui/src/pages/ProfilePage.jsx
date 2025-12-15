import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosClient";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  UserCircleIcon,
  CameraIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nama: "",
    telepon: "",
    current_password: "",
    password: "",
    password_confirmation: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/profile");
      setProfile(response.data);
      setFormData({
        nama: response.data.nama,
        telepon: response.data.telepon || "",
        current_password: "",
        password: "",
        password_confirmation: "",
        photo: null,
      });
      setPhotoPreview(null);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2048000) {
        toast.error("Ukuran foto maksimal 2MB");
        return;
      }
      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Format foto harus JPEG, PNG, atau JPG");
        return;
      }
      setFormData({ ...formData, photo: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password) {
      if (!formData.current_password) {
        toast.error("Password lama harus diisi");
        return;
      }
      if (formData.password !== formData.password_confirmation) {
        toast.error("Konfirmasi password baru tidak cocok");
        return;
      }
    }

    const data = new FormData();
    data.append("nama", formData.nama);
    data.append("telepon", formData.telepon);
    if (formData.password) {
      data.append("current_password", formData.current_password);
      data.append("password", formData.password);
      data.append("password_confirmation", formData.password_confirmation);
    }
    if (formData.photo) {
      data.append("photo", formData.photo);
    }

    try {
      const response = await api.post("/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profil berhasil diperbarui");
      setEditMode(false);
      fetchProfile();

      // Trigger update di MainLayout dengan delay
      setTimeout(() => {
        window.dispatchEvent(new Event("profileUpdated"));
      }, 500);
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message || "Gagal memperbarui profil";
      toast.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      nama: profile.nama,
      telepon: profile.telepon || "",
      current_password: "",
      password: "",
      password_confirmation: "",
      photo: null,
    });
    setPhotoPreview(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  const photoUrl =
    photoPreview ||
    (profile?.photo ? `http://127.0.0.1:8000/storage/${profile.photo}` : null);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-600 dark:to-blue-800 px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-100 transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Kembali</span>
          </button>
          <h1 className="text-2xl font-bold text-white mb-2">Profil Saya</h1>
          <p className="text-blue-100">Kelola informasi profil Anda</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-32 h-32 text-gray-400 dark:text-gray-600" />
                )}
                {editMode && (
                  <label
                    htmlFor="photo-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer shadow-lg"
                  >
                    <CameraIcon className="w-5 h-5" />
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
              {editMode && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Maksimal 2MB (JPEG, PNG, JPG)
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile.role}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              {/* NPM (Read-only for Mahasiswa) */}
              {profile.role === "Mahasiswa" && profile.npm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    NPM
                  </label>
                  <input
                    type="text"
                    value={profile.npm}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Angkatan (Read-only for Mahasiswa) */}
              {profile.role === "Mahasiswa" && profile.angkatan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Angkatan
                  </label>
                  <input
                    type="text"
                    value={profile.angkatan}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Prodi (Read-only for Mahasiswa) */}
              {profile.role === "Mahasiswa" && profile.prodi && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Program Studi
                  </label>
                  <input
                    type="text"
                    value={profile.prodi}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Jurusan (Read-only for Mahasiswa) */}
              {profile.role === "Mahasiswa" && profile.jurusan && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Jurusan
                  </label>
                  <input
                    type="text"
                    value={profile.jurusan}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Nama (Editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                  disabled={!editMode}
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${
                    editMode
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Telepon (Editable) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  No. Telepon
                </label>
                <input
                  type="text"
                  value={formData.telepon}
                  onChange={(e) =>
                    setFormData({ ...formData, telepon: e.target.value })
                  }
                  disabled={!editMode}
                  placeholder="Contoh: 08123456789"
                  className={`w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg ${
                    editMode
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Password (Only in edit mode) */}
              {editMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      value={formData.current_password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          current_password: e.target.value,
                        })
                      }
                      placeholder="Masukkan password lama"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password Baru (Opsional)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="Kosongkan jika tidak ingin mengubah"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password_confirmation: e.target.value,
                        })
                      }
                      placeholder="Ulangi password baru"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-8">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Profil
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Simpan
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
