<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Jurusan; // <-- IMPORT MODEL

class JurusanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Hapus data lama (jika ada) dan mulai dari ID 1

        Jurusan::create([
            'nama_jurusan' => 'Teknik Elektro'
        ]);

        Jurusan::create([
            'nama_jurusan' => 'Teknik Sipil'
        ]);

        Jurusan::create([
            'nama_jurusan' => 'Teknik Mesin'
        ]);
    }
}