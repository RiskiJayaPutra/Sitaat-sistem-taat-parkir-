<?php

namespace App\Http\Controllers;

use App\Models\Mahasiswa;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GerbangController extends Controller
{
    /**
     * Cek status parkir mahasiswa berdasarkan NPM.
     * Endpoint ini dipanggil oleh simulator/alat fingerprint.
     */
    public function cekStatusByNpm($npm)
    {
        // 1. Cari mahasiswa berdasarkan NPM
        // Kita gunakan 'with' untuk langsung mengambil data status parkirnya
        $mahasiswa = Mahasiswa::where('npm', $npm)->with('statusParkir')->first();

        if (!$mahasiswa) {
            return response()->json([
                'status' => 'Ditolak',
                'message' => 'Mahasiswa tidak terdaftar di sistem'
            ], 404);
        }

        // 2. Ambil data status parkir
        $status = $mahasiswa->statusParkir;

        // Jika data mahasiswa ada tapi data status_parkir belum dibuat (kasus jarang),
        // kita anggap dia boleh masuk (default aman).
        if (!$status) {
             return response()->json([
                'status' => 'Diizinkan',
                'message' => 'SILAKAN MASUK (Status Baru)'
            ], 200);
        }

        // 3. Cek Ban Permanen
        if ($status->is_banned_permanently) {
            return response()->json([
                'status' => 'Ditolak',
                'message' => 'AKSES DITOLAK: Diblokir Permanen!'
            ], 403);
        }

        // 4. Cek Ban Sementara
        // Jika ada tanggal 'ban_expires_at' DAN tanggal itu MASIH di masa depan
        if ($status->ban_expires_at && Carbon::now()->lessThan($status->ban_expires_at)) {
            $tanggalSelesai = Carbon::parse($status->ban_expires_at)
                                    ->locale('id')
                                    ->isoFormat('D MMMM Y HH:mm');
            return response()->json([
                'status' => 'Ditolak',
                'message' => "AKSES DITOLAK: Diblokir s/d $tanggalSelesai"
            ], 403);
        }

        // 5. Jika lolos semua pengecekan
        return response()->json([
            'status' => 'Diizinkan',
            'message' => "SILAKAN MASUK, {$mahasiswa->nama}"
        ], 200);
    }
}