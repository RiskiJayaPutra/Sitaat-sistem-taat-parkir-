<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('laporan_pelanggaran', function (Blueprint $table) {
            $table->id();
            $table->string('plat_nomor_terlapor');
            $table->string('url_foto_bukti'); // Nanti kita simpan path/link fotonya di sini
            $table->enum('status', ['Pending', 'Valid', 'Ditolak'])->default('Pending');
            // ID Satpam yang memvalidasi, terhubung ke tabel 'users'
            $table->foreignId('validator_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('waktu_validasi')->nullable(); // Kapan laporan divalidasi
            // Kolom 'created_at' bawaan timestamps akan jadi 'waktu_lapor'
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_pelanggaran');
    }
};
