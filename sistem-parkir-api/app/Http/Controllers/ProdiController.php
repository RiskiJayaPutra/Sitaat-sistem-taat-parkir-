<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;

class ProdiController extends Controller
{
    /**
     * Mengambil semua data prodi (untuk dropdown).
     */
    public function index()
    {
        // Ambil semua prodi, diurutkan berdasarkan nama
        $prodi = Prodi::orderBy('nama_prodi', 'asc')->get();
        return response()->json($prodi, 200);
    }
}