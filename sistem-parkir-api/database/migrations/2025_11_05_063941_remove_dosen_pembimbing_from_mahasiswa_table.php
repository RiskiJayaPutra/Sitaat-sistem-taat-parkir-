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
        Schema::table('mahasiswa', function (Blueprint $table) {
            // Menghapus kolom dosen_pembimbing
            $table->dropColumn('dosen_pembimbing');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            // (Rollback) Jika dibatalkan, tambahkan lagi kolomnya
            $table->string('dosen_pembimbing')->nullable()->after('angkatan');
        });
    }
};
