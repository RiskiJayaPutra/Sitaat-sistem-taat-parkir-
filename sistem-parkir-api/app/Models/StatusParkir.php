<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// 1. Ubah nama class
class StatusParkir extends Model
{
    use HasFactory;

    // 2. Arahkan ke nama tabel baru
    protected $table = 'status_parkir';

    // 3. Tentukan Primary Key baru (bukan 'id' atau 'id_kartu')
    protected $primaryKey = 'mahasiswa_id';

    // 4. Primary key ini bukan auto-increment
    public $incrementing = false;

    // 5. Perbarui $fillable
    protected $fillable = [
        'mahasiswa_id', 
        'ban_expires_at', 
        'is_banned_permanently'
    ];

    // 6. Relasi ke Mahasiswa (kebalikan)
    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class, 'mahasiswa_id');
    }
}