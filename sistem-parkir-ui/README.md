# Sistem Parkir UI

Frontend aplikasi Sistem Manajemen Parkir berbasis React untuk pengelolaan parkir kampus. Aplikasi ini menyediakan dashboard untuk Admin, Satpam, dan Mahasiswa.

## Tech Stack

- **React 19** - Library UI
- **Vite 7** - Build tool
- **Tailwind CSS 4** - Styling
- **React Router DOM** - Routing
- **Axios** - HTTP client
- **Chart.js** - Visualisasi data
- **Framer Motion** - Animasi
- **React Toastify & SweetAlert2** - Notifikasi

## Struktur Folder

```
src/
├── api/            # Konfigurasi Axios client
├── assets/         # Asset statis (gambar, icon)
├── components/     # Komponen reusable
├── contexts/       # React Context (state management)
├── layouts/        # Template layout halaman
├── pages/          # Halaman aplikasi
├── utils/          # Fungsi utilitas
├── App.jsx         # Komponen root
├── main.jsx        # Entry point
└── router.jsx      # Konfigurasi routing
```

## Fitur

**Admin**
- Dashboard statistik parkir
- Manajemen data mahasiswa
- Manajemen data satpam

**Satpam**
- Dashboard monitoring
- Verifikasi kendaraan
- Laporan aktivitas

**Mahasiswa**
- Dashboard pribadi
- Riwayat parkir
- Profil pengguna

## Instalasi

1. Clone repository
   ```bash
   git clone <repository-url>
   cd sistem-parkir-ui
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Konfigurasi environment
   ```bash
   cp .env.example .env
   ```
   Sesuaikan `VITE_API_URL` dengan URL backend API.

4. Jalankan development server
   ```bash
   npm run dev
   ```

5. Akses aplikasi di `http://localhost:5173`

## Build Production

```bash
npm run build
```

Output build akan tersedia di folder `dist/`.

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Menjalankan ESLint |

## Requirements

- Node.js 18+
- npm 9+
- Backend API (sistem-parkir-api) harus berjalan

## Lisensi

MIT License
