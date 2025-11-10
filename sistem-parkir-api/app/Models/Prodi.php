<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prodi extends Model
{
    use HasFactory;

    // Tentukan nama tabel jika tidak jamak
    protected $table = 'prodi';

    // Kolom yang boleh diisi
    protected $fillable = ['jurusan_id', 'nama_prodi'];

    /**
     * Mendapatkan jurusan dari prodi ini.
     */
    public function jurusan()
    {
        // Satu Prodi milik satu Jurusan
        return $this->belongsTo(Jurusan::class);
    }

    /**
     * Mendapatkan semua mahasiswa di prodi ini.
     */
    public function mahasiswa()
    {
        // Satu Prodi memiliki banyak Mahasiswa
        return $this->hasMany(Mahasiswa::class);
    }
}