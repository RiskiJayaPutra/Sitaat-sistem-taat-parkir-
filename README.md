# Sistem Taat Parkir Kampus

Sistem informasi manajemen parkir kampus yang terintegrasi dengan fitur pelaporan pelanggaran, validasi petugas, dan sistem sanksi otomatis.

![Laravel](https://img.shields.io/badge/Laravel-11.x-red?style=flat&logo=laravel)
![React](https://img.shields.io/badge/React-19.x-blue?style=flat&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?style=flat&logo=tailwind-css)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

## Deskripsi

Sistem Taat Parkir adalah aplikasi web untuk mengelola pelanggaran parkir di lingkungan kampus dengan 3 role pengguna:

- **Admin** - Mengelola data mahasiswa, satpam, dan sistem sanksi
- **Satpam** - Memvalidasi/menolak laporan pelanggaran
- **Mahasiswa** - Melaporkan pelanggaran dan melihat status parkir

## Fitur Utama

### Admin Dashboard

- Manajemen data mahasiswa (CRUD)
- Manajemen akun satpam
- Statistik dashboard real-time (total mahasiswa, satpam, banned users)
- Grafik pelanggaran per prodi
- Sistem unban pengguna
- Upload foto KTM, STNK, dan foto mahasiswa

### Satpam Dashboard

- Validasi laporan pelanggaran
- Statistik laporan (pending, valid, ditolak)
- Preview foto bukti pelanggaran
- Sistem sanksi otomatis (3-5 hari ban, hingga permanen)

### Mahasiswa Dashboard

- Buat laporan pelanggaran dengan foto bukti
- Status parkir dengan indikator ban (merah saat di-ban)
- Riwayat pelanggaran pribadi
- Manajemen laporan (lihat detail, batalkan pending)
- Wall of Shame - Top 10 pelanggar bulan ini
- Auto-redirect setelah laporan berhasil

## Tech Stack

### Backend

- **Laravel 11** - PHP Framework
- **Laravel Sanctum** - API Authentication
- **MySQL** - Database
- **Carbon** - Date/Time handling

### Frontend

- **React 19** - JavaScript Library
- **Vite 7** - Build Tool & Dev Server
- **React Router v7** - Client-side Routing
- **Axios** - HTTP Client
- **Framer Motion** - Animation Library
- **TailwindCSS 4** - Utility-first CSS
- **Heroicons** - Icon Library
- **Chart.js** - Data Visualization

## Instalasi

### Prerequisites

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL/MariaDB
- Git

### 1. Clone Repository

```bash
git clone https://github.com/RiskiJayaPutra/Sistem-taat-parkir-menggunakan-laravel-tailwind-dan-react.git
cd Sistem-taat-parkir-menggunakan-laravel-tailwind-dan-react
```

### 2. Setup Backend (Laravel)

```bash
cd sistem-parkir-api

# Install dependencies
composer install

# Copy environment file
copy .env.example .env  # Windows
# atau
cp .env.example .env    # Linux/Mac

# Generate application key
php artisan key:generate

# Konfigurasi database di file .env
# DB_DATABASE=sistem_parkir
# DB_USERNAME=root
# DB_PASSWORD=

# Jalankan migrasi
php artisan migrate

# Link storage untuk upload foto
php artisan storage:link

# Jalankan seeder (optional)
php artisan db:seed

# Jalankan server
php artisan serve
```

Backend akan berjalan di: `http://localhost:8000`

### 3. Setup Frontend (React)

```bash
cd ../sistem-parkir-ui

# Install dependencies
npm install

# Copy environment file
copy .env.example .env  # Windows
# atau
cp .env.example .env    # Linux/Mac

# Konfigurasi API URL di .env
# VITE_API_BASE_URL=http://localhost:8000

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:5173`

## Database Schema

### Tabel Utama

| Tabel | Deskripsi |
|-------|-----------|
| `users` | Data user (admin, satpam, mahasiswa) |
| `mahasiswa` | Detail mahasiswa |
| `jurusan` | Data jurusan |
| `prodi` | Program studi |
| `kendaraan` | Data kendaraan mahasiswa |
| `status_parkir` | Status ban mahasiswa |
| `laporan_pelanggaran` | Laporan pelanggaran |
| `kartu_parkir` | Kartu parkir |

## Default Credentials

Setelah menjalankan seeder:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password` |
| Satpam | `satpam1` | `password` |
| Mahasiswa | (sesuai NPM) | (set saat admin membuat akun) |

## API Endpoints

### Authentication

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Get current user |

### Admin

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/mahasiswa` | List mahasiswa |
| POST | `/api/mahasiswa` | Create mahasiswa |
| GET | `/api/admin/banned-users` | List banned users |
| POST | `/api/admin/unban/{id}` | Unban user |
| GET | `/api/admin/satpam` | List satpam |
| POST | `/api/admin/satpam` | Create satpam |
| DELETE | `/api/admin/satpam/{id}` | Delete satpam |

### Satpam

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/laporan/pending` | Pending reports |
| POST | `/api/laporan/{id}/validasi` | Validate report |
| POST | `/api/laporan/{id}/tolak` | Reject report |
| GET | `/api/laporan/satpam-stats` | Statistics |

### Mahasiswa

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/laporan` | Create report |
| GET | `/api/my-dashboard` | Personal dashboard data |
| DELETE | `/api/laporan/{id}` | Cancel pending report |

### Reports

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/report/top-pelanggar` | Top 10 violators |
| GET | `/api/report/per-prodi` | Statistics per department |

## Struktur Project

```
Sistem-taat-parkir/
├── sistem-parkir-api/          # Laravel Backend
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Providers/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   └── storage/
│       └── app/public/         # Uploaded photos
│
└── sistem-parkir-ui/           # React Frontend
    ├── public/
    ├── src/
    │   ├── api/
    │   │   └── axiosClient.js
    │   ├── components/
    │   ├── layouts/
    │   │   └── MainLayout.jsx
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx
    │   │   ├── SatpamDashboard.jsx
    │   │   ├── MahasiswaDashboard.jsx
    │   │   └── BuatLaporanPage.jsx
    │   ├── utils/
    │   ├── router.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Deployment

### Backend (Laravel)

1. Upload ke server (shared hosting/VPS)
2. Set environment production di `.env`
3. Jalankan: `php artisan config:cache`
4. Set document root ke folder `public`

### Frontend (React)

1. Build production: `npm run build`
2. Upload folder `dist` ke server
3. Configure web server (nginx/apache)

## Troubleshooting

### Backend Error "SQLSTATE connection refused"

- Pastikan MySQL service berjalan
- Cek kredensial database di `.env`
- Jalankan: `php artisan config:clear`

### Frontend Error "Network Error"

- Pastikan backend berjalan di port 8000
- Cek `VITE_API_BASE_URL` di `.env`
- Pastikan CORS sudah dikonfigurasi

### Upload Foto Error

- Jalankan: `php artisan storage:link`
- Cek permission folder `storage`
- Pastikan max upload di `php.ini`: `upload_max_filesize=2M`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Riski Jaya Putra**

- GitHub: [@RiskiJayaPutra](https://github.com/RiskiJayaPutra)
