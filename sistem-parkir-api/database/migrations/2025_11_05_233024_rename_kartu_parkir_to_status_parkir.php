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
        // 1. Ganti nama tabel
        Schema::rename('kartu_parkir', 'status_parkir');

        // 2. Modifikasi tabel baru
        Schema::table('status_parkir', function (Blueprint $table) {
            // Hapus primary key 'id_kartu' yang lama
            $table->dropPrimary('kartu_parkir_id_kartu_primary');
            $table->dropColumn('id_kartu');

            // Jadikan 'mahasiswa_id' sebagai primary key baru
            $table->primary('mahasiswa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Lakukan kebalikannya
        Schema::table('status_parkir', function (Blueprint $table) {
            $table->dropPrimary('status_parkir_mahasiswa_id_primary');
            $table->string('id_kartu')->after('mahasiswa_id');
            $table->primary('id_kartu');
        });

        Schema::rename('status_parkir', 'kartu_parkir');
    }
};