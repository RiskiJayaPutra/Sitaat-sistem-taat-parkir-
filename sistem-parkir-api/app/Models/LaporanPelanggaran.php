<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanPelanggaran extends Model
{
    use HasFactory;

    /**
     * Nama tabel yang terkait dengan model.
     *
     * @var string
     */
    protected $table = 'laporan_pelanggaran';

    /**
     * Atribut yang dapat diisi secara massal.
     *
     * @var array
     */
    protected $fillable = [
        'pelapor_id',           // <-- Kolom BARU
        'plat_nomor_terlapor',  // <-- Tetap ADA
        'url_foto_bukti',
        'status',
        'validator_id',
        'waktu_validasi',
    ];

    /**
     * Mendapatkan data Satpam (User) yang memvalidasi laporan ini.
     */
    public function validator()
    {
        // Relasi ke User (sebagai validator)
        return $this->belongsTo(User::class, 'validator_id');
    }

    /**
     * Mendapatkan data User (Mahasiswa) yang MELAPOR.
     */
    public function pelapor()
    {
        // Relasi ke User (sebagai pelapor)
        return $this->belongsTo(User::class, 'pelapor_id');
    }
}