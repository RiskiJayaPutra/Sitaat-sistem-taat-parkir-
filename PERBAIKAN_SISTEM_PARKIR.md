# 📋 DAFTAR PERBAIKAN SISTEM PARKIR

## ✅ PERBAIKAN YANG SUDAH SELESAI

### 1. ✅ Admin dapat menambah akun satpam

**Backend:**

- ✅ Menambahkan kolom `nama` di tabel `users` (migration sudah dibuat dan dijalankan)
- ✅ Update Model User untuk menambahkan `nama` di fillable
- ✅ Menambahkan method di AdminController:
  - `createSatpam()` - Menambah satpam baru
  - `getSatpam()` - Mengambil daftar satpam
  - `deleteSatpam()` - Menghapus satpam
  - `getDashboardStats()` - Mengambil statistik dashboard admin
- ✅ Menambahkan route di api.php

**Frontend:**

- ✅ Membuat halaman `AdminManageSatpam.jsx` dengan fitur:
  - Form tambah satpam (username, nama, password)
  - Tabel daftar satpam
  - Tombol hapus satpam
- ✅ Menambahkan route `/admin/satpam` di router.jsx
- ✅ Menambahkan link "Kelola Satpam" di AdminDashboard

### 2. ✅ Fix total mahasiswa di dashboard admin

**Backend:**

- ✅ Menambahkan endpoint `/admin/dashboard-stats` yang mengembalikan:
  - `total_mahasiswa` - Jumlah total mahasiswa
  - `total_satpam` - Jumlah total satpam
  - `total_banned` - Jumlah total user yang di-ban

**Frontend:**

- ✅ Update AdminDashboard untuk fetch dan menampilkan statistik yang benar
- ✅ Menampilkan 3 card: User Terblokir, Total Mahasiswa, Total Satpam

### 3. ✅ Fix parameter vapid di dashboard satpam

**Backend:**

- ✅ Menambahkan method `getSatpamStats()` di LaporanController untuk mengambil statistik
- ✅ Menambahkan route `/laporan/satpam-stats` di api.php

**Frontend:**

- ✅ Update SatpamDashboard untuk fetch dan menampilkan statistik yang benar
- ✅ Menampilkan jumlah: Pending, Divalidasi, Ditolak

### 4. ✅ Fix password mahasiswa

**Backend:**

- ✅ Update MahasiswaController `store()` untuk menerima password dari form
- ✅ Update MahasiswaController `update()` untuk update password jika diisi

---

## ⏳ PERBAIKAN YANG MASIH PERLU DILAKUKAN

### 5. ⏳ Perbaikan edit mahasiswa

**Frontend yang perlu diperbaiki:**

```jsx
// File: d:\projects\sistem-parkir-ui\src\pages\AdminMahasiswaForm.jsx

// TODO 1: Ubah text "Menyimpan" menjadi "Memuat..." atau "Loading..."
// Line ~195: {formLoading ? "Memuat..." : isEditMode ? "Simpan Perubahan" : "Simpan"}

// TODO 2: Tampilkan preview foto KTM yang sudah diupload
// Line ~240-270: Tambahkan preview untuk existingFotoKtm (buat link download/view)
// Contoh:
{
  existingFotoKtm && !fotoKtm && (
    <div className="mb-4">
      <p className="text-sm text-gray-600">Foto KTM yang sudah diupload:</p>
      <a
        href={`${import.meta.env.VITE_API_BASE_URL}/storage/${existingFotoKtm}`}
        target="_blank"
        className="text-indigo-600 hover:text-indigo-800"
      >
        Lihat Foto KTM
      </a>
    </div>
  );
}

// TODO 3: Tampilkan preview foto STNK yang sudah diupload
// Sama seperti KTM tapi untuk existingFotoStnk
```

### 6. ⏳ Fix dashboard mahasiswa (KOMPLEKS!)

**Backend yang perlu ditambahkan:**

```php
// File: Buat file baru MahasiswaController atau buat controller baru

// TODO 1: Endpoint untuk mengambil data dashboard mahasiswa
// GET /mahasiswa/my-dashboard
public function getMyDashboard(Request $request)
{
    $mahasiswa = Mahasiswa::where('user_id', $request->user()->id)
                    ->with(['statusParkir', 'kendaraan'])
                    ->first();

    if (!$mahasiswa) {
        return response()->json(['message' => 'Data mahasiswa tidak ditemukan'], 404);
    }

    // Ambil plat nomor mahasiswa
    $platNomor = $mahasiswa->kendaraan->pluck('plat_nomor');

    // Hitung pelanggaran bulan ini
    $satuBulanLalu = Carbon::now()->subMonth();
    $pelanggaranBulanIni = LaporanPelanggaran::whereIn('plat_nomor_terlapor', $platNomor)
        ->where('status', 'Valid')
        ->where('created_at', '>=', $satuBulanLalu)
        ->count();

    // Ambil laporan yang dibuat mahasiswa
    $laporanSaya = LaporanPelanggaran::where('pelapor_id', $request->user()->id)
        ->orderBy('created_at', 'desc')
        ->get();

    // Status parkir
    $statusParkir = $mahasiswa->statusParkir;
    $isBanned = false;
    $banInfo = null;

    if ($statusParkir) {
        if ($statusParkir->is_banned_permanently) {
            $isBanned = true;
            $banInfo = 'Permanen';
        } elseif ($statusParkir->ban_expires_at && Carbon::parse($statusParkir->ban_expires_at)->isFuture()) {
            $isBanned = true;
            $banInfo = Carbon::parse($statusParkir->ban_expires_at)->format('d/m/Y H:i');
        }
    }

    return response()->json([
        'nama' => $mahasiswa->nama,
        'npm' => $mahasiswa->npm,
        'status_parkir' => $isBanned ? 'Terblokir' : 'Aktif',
        'is_banned' => $isBanned,
        'ban_info' => $banInfo,
        'pelanggaran_bulan_ini' => $pelanggaranBulanIni,
        'total_laporan_saya' => $laporanSaya->count(),
        'laporan_saya' => $laporanSaya,
        'pelanggaran_saya' => LaporanPelanggaran::whereIn('plat_nomor_terlapor', $platNomor)
            ->where('status', 'Valid')
            ->with(['validator:id,nama,username'])
            ->orderBy('created_at', 'desc')
            ->get(),
    ]);
}

// TODO 2: Endpoint untuk edit/cancel laporan mahasiswa
// PUT /laporan/{id}
// DELETE /laporan/{id}
```

**Route yang perlu ditambahkan:**

```php
// File: d:\projects\sistem-parkir-api\routes\api.php
Route::get('/mahasiswa/my-dashboard', [MahasiswaController::class, 'getMyDashboard']);
Route::put('/laporan/{id}', [LaporanController::class, 'updateLaporan']);
Route::delete('/laporan/{id}', [LaporanController::class, 'deleteLaporan']);
```

**Frontend yang perlu diperbaiki:**

```jsx
// File: d:\projects\sistem-parkir-ui\src\pages\MahasiswaDashboard.jsx

// TODO 1: Fetch data dari endpoint baru /mahasiswa/my-dashboard
useEffect(() => {
  axiosClient.get('/mahasiswa/my-dashboard')
    .then(response => {
      setDashboardData(response.data);
    });
}, []);

// TODO 2: Tampilkan status parkir dengan warna (merah jika banned)
// Line ~95-110:
<div className={`rounded-xl p-6 shadow-lg border border-gray-100 ${
  dashboardData.is_banned ? 'bg-red-50 border-red-300' : 'bg-white'
}`}>
  <div className="flex items-center gap-4">
    <div className={`rounded-full p-3 ${
      dashboardData.is_banned ? 'bg-red-100' : 'bg-green-100'
    }`}>
      <TrophyIcon className={`h-6 w-6 ${
        dashboardData.is_banned ? 'text-red-600' : 'text-green-600'
      }`} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-600">Status Parkir</p>
      <p className={`text-2xl font-bold ${
        dashboardData.is_banned ? 'text-red-900' : 'text-gray-900'
      }`}>
        {dashboardData.status_parkir}
      </p>
      {dashboardData.is_banned && (
        <p className="text-sm text-red-600">
          {dashboardData.ban_info === 'Permanen'
            ? 'Ban Permanen'
            : `Hingga: ${dashboardData.ban_info}`}
        </p>
      )}
    </div>
  </div>
</div>

// TODO 3: Tampilkan jumlah pelanggaran yang benar
// Line ~105: Ganti "0" dengan {dashboardData.pelanggaran_bulan_ini}

// TODO 4: Tampilkan jumlah laporan yang dibuat
// Line ~120: Ganti "-" dengan {dashboardData.total_laporan_saya}

// TODO 5: Tambahkan section "Laporan Saya" yang clickable
// Tambahkan setelah Wall of Shame:
<motion.div variants={itemVariants}>
  <h2 className="mb-4 text-2xl font-bold">Laporan Saya</h2>
  {dashboardData.laporan_saya.map(laporan => (
    <div
      key={laporan.id}
      onClick={() => handleShowLaporan(laporan)}
      className="cursor-pointer rounded-xl bg-white p-4 shadow hover:shadow-lg transition-shadow"
    >
      <p>Plat: {laporan.plat_nomor_terlapor}</p>
      <p>Status: {laporan.status}</p>
      <p>Tanggal: {new Date(laporan.created_at).toLocaleDateString()}</p>

      {laporan.status === 'Pending' && (
        <div className="mt-2 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditLaporan(laporan); }}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleCancelLaporan(laporan.id); }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Batalkan
          </button>
        </div>
      )}
    </div>
  ))}
</motion.div>

// TODO 6: Tambahkan section "Pelanggaran Saya"
<motion.div variants={itemVariants}>
  <h2 className="mb-4 text-2xl font-bold">Riwayat Pelanggaran Saya</h2>
  {dashboardData.pelanggaran_saya.map(pelanggaran => (
    <div key={pelanggaran.id} className="rounded-xl bg-red-50 p-4 shadow mb-3">
      <p>Plat: {pelanggaran.plat_nomor_terlapor}</p>
      <p>Tanggal: {new Date(pelanggaran.created_at).toLocaleDateString()}</p>
      <p>Validator: {pelanggaran.validator?.nama}</p>
      <img src={`${API_URL}/storage/${pelanggaran.url_foto_bukti}`} className="mt-2 h-32 object-cover" />
    </div>
  ))}
</motion.div>
```

### 7. ⏳ Fix buat laporan pelanggaran

**Backend yang perlu diperbaiki:**

```php
// File: d:\projects\sistem-parkir-api\app\Http\Controllers\LaporanController.php

// TODO 1: Support multiple foto
// Ubah validasi di method store():
'foto' => 'required|array|min:1|max:5', // Izinkan array foto
'foto.*' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Validasi tiap foto

// TODO 2: Simpan multiple foto
$fotoPaths = [];
foreach ($request->file('foto') as $file) {
    $fotoPaths[] = $file->store('laporan', 'public');
}

// Simpan sebagai JSON atau buat tabel terpisah untuk foto
$laporan = LaporanPelanggaran::create([
    'pelapor_id' => Auth::id(),
    'plat_nomor_terlapor' => $validatedData['plat_nomor_terlapor'],
    'url_foto_bukti' => json_encode($fotoPaths), // Atau simpan di tabel terpisah
    'status' => 'Pending',
]);
```

**Frontend yang perlu diperbaiki:**

```jsx
// File: d:\projects\sistem-parkir-ui\src\pages\BuatLaporanPage.jsx

// TODO 1: Ubah state untuk multiple files
const [fotos, setFotos] = useState([]);
const [previewUrls, setPreviewUrls] = useState([]);

// TODO 2: Handle multiple file selection
const handleFileChange = (event) => {
  const files = Array.from(event.target.files);
  if (files.length + fotos.length > 5) {
    setError("Maksimal 5 foto");
    return;
  }

  setFotos([...fotos, ...files]);

  // Generate previews
  const newPreviews = [];
  files.forEach(file => {
    const reader = new FileReader();
    reader.onloadend = () => {
      newPreviews.push(reader.result);
      if (newPreviews.length === files.length) {
        setPreviewUrls([...previewUrls, ...newPreviews]);
      }
    };
    reader.readAsDataURL(file);
  });
};

// TODO 3: Hapus double notification
// Line ~54-72: Pastikan hanya ada 1 notification yang muncul
// Hapus setError() sebelum setSukses()

// TODO 4: Auto redirect setelah 3 detik
// Line ~60-62: Sudah ada, pastikan setTimeout bekerja
setTimeout(() => {
  navigate("/dashboard");
}, 3000);

// TODO 5: Tampilkan preview multiple foto
<div className="grid grid-cols-2 gap-3">
  {previewUrls.map((url, index) => (
    <div key={index} className="relative">
      <img src={url} className="h-32 w-full object-cover rounded" />
      <button
        onClick={() => handleRemoveFoto(index)}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
      >
        ×
      </button>
    </div>
  ))}
</div>

// TODO 6: Input multiple files
<input
  type="file"
  accept="image/*"
  multiple
  onChange={handleFileChange}
/>
```

### 8. ⏳ Optimasi performa dan loading

**Backend - Eager Loading:**

```php
// File: d:\projects\sistem-parkir-api\app\Http\Controllers\*.php

// TODO: Gunakan eager loading di semua query
// Contoh di MahasiswaController:
$mahasiswa = Mahasiswa::with(['prodi', 'kendaraan', 'user'])
    ->orderBy('created_at', 'desc')
    ->get();

// Contoh di LaporanController:
$laporan = LaporanPelanggaran::with(['pelapor:id,username,nama', 'kendaraan'])
    ->where('status', 'Pending')
    ->orderBy('created_at', 'desc')
    ->get();
```

**Frontend - Loading States:**

```jsx
// TODO: Tambahkan loading state di semua halaman
// Pattern yang konsisten:

const [loading, setLoading] = useState(true);

// Saat fetch data
setLoading(true);
axiosClient
  .get("/endpoint")
  .then((response) => {
    setData(response.data);
    setLoading(false);
  })
  .catch((error) => {
    setError(error);
    setLoading(false);
  });

// Di render
{
  loading && (
    <div className="flex items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
    </div>
  );
}
```

### 9. ⏳ Tampilkan nama user di semua dashboard

**Backend:**

```php
// File: d:\projects\sistem-parkir-api\app\Http\Controllers\AuthController.php

// TODO: Update method me() untuk include nama mahasiswa
public function me(Request $request)
{
    $user = $request->user();

    // Jika role Mahasiswa, ambil nama dari tabel mahasiswa
    if ($user->role === 'Mahasiswa') {
        $mahasiswa = Mahasiswa::where('user_id', $user->id)->first();
        $user->nama = $mahasiswa ? $mahasiswa->nama : null;
    }

    return response()->json([
        'user' => $user,
    ], 200);
}
```

**Frontend:**

```jsx
// File: d:\projects\sistem-parkir-ui\src\pages\AdminDashboard.jsx
// File: d:\projects\sistem-parkir-ui\src\pages\SatpamDashboard.jsx
// File: d:\projects\sistem-parkir-ui\src\pages\MahasiswaDashboard.jsx

// TODO: Fetch user data dan tampilkan nama
const [user, setUser] = useState(null);

useEffect(() => {
  axiosClient.get("/me").then((response) => {
    setUser(response.data.user);
  });
}, []);

// Di header:
<h2>Selamat Datang, {user?.nama || user?.username}! 👋</h2>;
```

---

## 📝 CATATAN PENTING

1. **Migration sudah dijalankan** untuk menambahkan kolom `nama` di tabel users
2. **Pastikan storage linked**: `php artisan storage:link` untuk akses foto
3. **CORS**: Pastikan CORS sudah diatur dengan benar di backend
4. **Environment Variable**: Pastikan `VITE_API_BASE_URL` sudah diatur di `.env` frontend

## 🚀 CARA TESTING FITUR YANG SUDAH SELESAI

### Test Kelola Satpam:

1. Login sebagai Admin
2. Klik tombol "Kelola Satpam" di dashboard
3. Tambah satpam baru dengan username, nama, dan password
4. Coba login dengan akun satpam yang baru dibuat
5. Test hapus satpam

### Test Dashboard Stats:

1. Login sebagai Admin
2. Lihat dashboard - seharusnya menampilkan:
   - Total mahasiswa (bukan strip)
   - Total satpam
   - Total user terblokir
3. Login sebagai Satpam
4. Lihat dashboard - seharusnya menampilkan:
   - Jumlah pending
   - Jumlah divalidasi
   - Jumlah ditolak

---

## 🔧 COMMAND PENTING

```bash
# Backend
cd d:\projects\sistem-parkir-api
php artisan migrate
php artisan storage:link
php artisan serve

# Frontend
cd d:\projects\sistem-parkir-ui
npm install
npm run dev
```

## 📚 FILE YANG SUDAH DIMODIFIKASI

### Backend:

1. ✅ `app/Http/Controllers/AdminController.php`
2. ✅ `app/Http/Controllers/MahasiswaController.php`
3. ✅ `app/Http/Controllers/LaporanController.php`
4. ✅ `app/Models/User.php`
5. ✅ `routes/api.php`
6. ✅ `database/migrations/2025_11_09_101541_add_nama_to_users_table.php`

### Frontend:

1. ✅ `src/pages/AdminDashboard.jsx`
2. ✅ `src/pages/SatpamDashboard.jsx`
3. ✅ `src/pages/AdminManageSatpam.jsx` (NEW FILE)
4. ✅ `src/router.jsx`
