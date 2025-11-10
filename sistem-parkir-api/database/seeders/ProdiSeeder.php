<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Prodi; // <-- IMPORT MODEL

class ProdiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Prodi::create([
            'jurusan_id' => 1, // Milik Teknik Elektro
            'nama_prodi' => 'S1 Teknik Informatika'
        ]);

        Prodi::create([
            'jurusan_id' => 1, // Milik Teknik Elektro
            'nama_prodi' => 'S1 Teknik Elektro'
        ]);

        Prodi::create([
            'jurusan_id' => 2, // Milik Teknik Sipil
            'nama_prodi' => 'S1 Teknik Sipil'
        ]);
    }
}