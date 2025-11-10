<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kartu_parkir', function (Blueprint $table) {
            // 1. Hapus kolom status_kartu (logika lama)
            $table->dropColumn('status_kartu');

            // 2. Tambah kolom untuk ban 3 hari / 5 hari
            // Jika null = tidak di-ban. Jika ada tanggal = di-ban sampai tanggal itu.
            $table->timestamp('ban_expires_at')->nullable()->after('mahasiswa_id');

            // 3. Tambah kolom untuk ban permanen
            $table->boolean('is_banned_permanently')->default(false)->after('ban_expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kartu_parkir', function (Blueprint $table) {
            // (Rollback) Kembalikan kolom status_kartu yang lama
            $table->enum('status_kartu', ['Aktif', 'Diblokir'])->default('Aktif')->after('mahasiswa_id');

            // Hapus 2 kolom baru
            $table->dropColumn('is_banned_permanently');
            $table->dropColumn('ban_expires_at');
        });
    }
};
