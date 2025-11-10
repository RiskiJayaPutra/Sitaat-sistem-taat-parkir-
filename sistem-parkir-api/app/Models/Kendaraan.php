<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    protected $table = 'kendaraan';

    protected $fillable = ['mahasiswa_id', 'plat_nomor', 'foto_stnk'];

    public function mahasiswa()
    {
        return $this->belongsTo(Mahasiswa::class);
    }
}