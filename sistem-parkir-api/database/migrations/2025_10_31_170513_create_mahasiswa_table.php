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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            // INI 'LEM'-NYA: terhubung ke tabel users
            $table->foreignId('user_id')->unique()->constrained('users')->onDelete('cascade'); 
            
            $table->foreignId('prodi_id')->constrained('prodi')->onDelete('cascade');
            $table->string('npm', 15)->unique(); 
            $table->string('nama');
            $table->string('angkatan', 4);
            $table->string('dosen_pembimbing')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};
