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
        Schema::create('kartu_parkir', function (Blueprint $table) {
            // ID Kartu bukan angka, tapi teks/nomor serial dari kartu RFID
            $table->string('id_kartu')->primary(); 
            $table->foreignId('mahasiswa_id')->unique()->constrained('mahasiswa')->onDelete('cascade');
            $table->enum('status_kartu', ['Aktif', 'Diblokir'])->default('Aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kartu_parkir');
    }
};
