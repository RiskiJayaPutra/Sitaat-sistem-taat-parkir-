<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Mahasiswa;
use App\Models\Prodi;
use App\Models\Jurusan;
use App\Models\Kendaraan;
use App\Models\StatusParkir;
use App\Models\LaporanPelanggaran;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Nonaktifkan pengecekan foreign key
        Schema::disableForeignKeyConstraints();

        // 2. Truncate tabel dalam urutan TERBALIK (anak dulu)
        // Hapus juga data dari tabel lain yang mungkin kita perlukan nanti
        Mahasiswa::truncate();
        Prodi::truncate();
        User::truncate();
        Jurusan::truncate();
        Kendaraan::truncate();
        StatusParkir::truncate(); // <-- PERBAIKAN
        LaporanPelanggaran::truncate();

        // 3. Aktifkan kembali pengecekan foreign key
        Schema::enableForeignKeyConstraints();

        // 4. Panggil seeder-seeder kita
        $this->call([
            JurusanSeeder::class,
            ProdiSeeder::class,
            UserSeeder::class,
        ]);
    }
}