# 🔔 Implementasi SweetAlert2

## Fitur yang Ditambahkan

SweetAlert2 telah diimplementasikan untuk memberikan notifikasi yang lebih menarik dan user-friendly pada aplikasi Sistem Parkir.

## 📦 Instalasi

```bash
cd sistem-parkir-ui
npm install sweetalert2
```

## ✨ Fitur Notifikasi

### 1. Buat Laporan Pelanggaran (`BuatLaporanPage.jsx`)

**Success Notification:**

- Icon: ✅ Success
- Title: "Berhasil!"
- Message: Pesan dari backend
- Auto-redirect ke dashboard setelah 3 detik
- Progress bar timer

**Error Notification:**

- Icon: ❌ Error
- Title: "Gagal!"
- Message: Pesan error dari backend
- Button: "Coba Lagi"

### 2. Batalkan Laporan (`MahasiswaDashboard.jsx`)

**Confirmation Dialog:**

- Icon: ⚠️ Warning
- Title: "Batalkan Laporan?"
- Message: "Laporan yang dibatalkan tidak dapat dikembalikan!"
- Buttons: "Ya, Batalkan!" / "Batal"

**Success After Delete:**

- Icon: ✅ Success
- Title: "Berhasil!"
- Message: "Laporan berhasil dibatalkan"
- Auto-close setelah 2 detik

**Error Notification:**

- Icon: ❌ Error
- Title: "Gagal!"
- Message: Pesan error dari backend

### 3. Hapus Satpam (`AdminManageSatpam.jsx`)

**Confirmation Dialog:**

- Icon: ⚠️ Warning
- Title: "Hapus Satpam?"
- Message: "Yakin ingin menghapus satpam {nama}?"
- Buttons: "Ya, Hapus!" / "Batal"

**Success After Delete:**

- Icon: ✅ Success
- Title: "Berhasil!"
- Message: Pesan dari backend
- Auto-close setelah 2 detik

**Error Notification:**

- Icon: ❌ Error
- Title: "Gagal!"
- Message: "Gagal menghapus satpam. Coba lagi."

## 🎨 Customization

### Warna Button

- **Confirm (Indigo)**: `#4F46E5`
- **Danger (Red)**: `#EF4444`
- **Cancel (Gray)**: `#6B7280`

### Contoh Penggunaan

```javascript
import Swal from "sweetalert2";

// Success dengan auto-redirect
Swal.fire({
  icon: "success",
  title: "Berhasil!",
  text: "Data berhasil disimpan",
  confirmButtonColor: "#4F46E5",
  timer: 3000,
  timerProgressBar: true,
}).then(() => {
  navigate("/dashboard");
});

// Confirmation dialog
Swal.fire({
  title: "Hapus Data?",
  text: "Data yang dihapus tidak dapat dikembalikan!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#EF4444",
  cancelButtonColor: "#6B7280",
  confirmButtonText: "Ya, Hapus!",
  cancelButtonText: "Batal",
}).then((result) => {
  if (result.isConfirmed) {
    // Execute delete action
  }
});

// Error notification
Swal.fire({
  icon: "error",
  title: "Gagal!",
  text: "Terjadi kesalahan pada server",
  confirmButtonColor: "#EF4444",
});
```

## 🚀 Manfaat

1. **User Experience Lebih Baik** - Modal notification yang modern dan menarik
2. **Confirmation Dialogs** - Menghindari aksi tidak disengaja (delete, cancel)
3. **Auto-redirect** - Smooth transition setelah success action
4. **Progress Timer** - Visual feedback untuk auto-close notification
5. **Responsive** - Tampilan bagus di mobile dan desktop
6. **Customizable** - Mudah disesuaikan dengan brand color

## 📝 File yang Dimodifikasi

1. `src/pages/BuatLaporanPage.jsx`

   - Mengganti error/success message dengan SweetAlert
   - Added success notification dengan timer
   - Added error notification

2. `src/pages/MahasiswaDashboard.jsx`

   - Mengganti `window.confirm()` dengan SweetAlert
   - Added confirmation dialog untuk cancel laporan
   - Added success/error notification

3. `src/pages/AdminManageSatpam.jsx`
   - Mengganti `window.confirm()` dengan SweetAlert
   - Added confirmation dialog untuk delete satpam
   - Added success/error notification

## 🔮 Future Enhancement

Bisa ditambahkan SweetAlert untuk:

- [ ] Validasi laporan oleh satpam
- [ ] Tolak laporan oleh satpam
- [ ] Unban mahasiswa oleh admin
- [ ] Delete mahasiswa oleh admin
- [ ] Update data mahasiswa
- [ ] Logout confirmation
