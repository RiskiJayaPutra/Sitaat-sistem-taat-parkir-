<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurusan extends Model
{
    use HasFactory;

    // Tentukan nama tabel jika tidak jamak
    protected $table = 'jurusan';

    // Kolom yang boleh diisi
    protected $fillable = ['nama_jurusan'];

    /**
     * Mendapatkan semua prodi yang ada di jurusan ini.
     */
    public function prodi()
    {
        // Satu Jurusan memiliki banyak Prodi
        return $this->hasMany(Prodi::class);
    }
}