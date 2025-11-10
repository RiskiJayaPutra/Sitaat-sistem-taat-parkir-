<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mahasiswa extends Model
{
    use HasFactory;

    // Tentukan nama tabel jika tidak jamak
    protected $table = 'mahasiswa';

    // Kolom yang boleh diisi
    protected $fillable = [
        'user_id',
        'prodi_id',
        'npm',
        'nama',
        'angkatan',
        'foto_ktm',
    ];

    /**
     * Mendapatkan data akun user dari mahasiswa ini.
     */
    public function user()
    {
        // Satu Mahasiswa milik satu User
        return $this->belongsTo(User::class);
    }

    /**
     * Mendapatkan data prodi dari mahasiswa ini.
     */
    public function prodi()
    {
        // Satu Mahasiswa milik satu Prodi
        return $this->belongsTo(Prodi::class);
    }
    
    /**
     * Mendapatkan semua kendaraan milik mahasiswa ini.
     */
    public function kendaraan()
    {
        // Satu Mahasiswa memiliki banyak Kendaraan
        return $this->hasMany(Kendaraan::class);
    }

    /**
     * Mendapatkan kartu parkir milik mahasiswa ini.
     */
   /**
     * Mendapatkan status parkir milik mahasiswa ini.
     */
    // GANTI NAMA FUNGSI INI
    public function statusParkir()
    {
        // GANTI MODEL INI
        return $this->hasOne(StatusParkir::class, 'mahasiswa_id');
    }
}