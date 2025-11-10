<?php

namespace App\Http\Controllers;

use App\Models\LaporanPelanggaran;
use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    public function getTopPelanggar(Request $request)
    {
        $satuBulanLalu = Carbon::now()->subMonth();

        $topPelanggar = LaporanPelanggaran::join('kendaraan', 'laporan_pelanggaran.plat_nomor_terlapor', '=', 'kendaraan.plat_nomor')
            ->join('mahasiswa', 'kendaraan.mahasiswa_id', '=', 'mahasiswa.id')
            ->where('laporan_pelanggaran.status', 'Valid')
            ->where('laporan_pelanggaran.created_at', '>=', $satuBulanLalu)
            ->select('mahasiswa.nama', 'mahasiswa.npm', DB::raw('COUNT(laporan_pelanggaran.id) as total_pelanggaran'))
            ->groupBy('mahasiswa.id', 'mahasiswa.nama', 'mahasiswa.npm')
            ->orderByDesc('total_pelanggaran')
            ->limit(10)
            ->get();

        return response()->json($topPelanggar, 200);
    }

    public function getPelanggaranPerProdi(Request $request)
    {
        if ($request->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $satuBulanLalu = Carbon::now()->subMonth();

        $data = LaporanPelanggaran::join('kendaraan', 'laporan_pelanggaran.plat_nomor_terlapor', '=', 'kendaraan.plat_nomor')
            ->join('mahasiswa', 'kendaraan.mahasiswa_id', '=', 'mahasiswa.id')
            ->join('prodi', 'mahasiswa.prodi_id', '=', 'prodi.id')
            ->where('laporan_pelanggaran.status', 'Valid')
            ->where('laporan_pelanggaran.created_at', '>=', $satuBulanLalu)
            ->select('prodi.nama_prodi', DB::raw('COUNT(laporan_pelanggaran.id) as total'))
            ->groupBy('prodi.id', 'prodi.nama_prodi')
            ->orderByDesc('total')
            ->get();

        return response()->json($data, 200);
    }
}