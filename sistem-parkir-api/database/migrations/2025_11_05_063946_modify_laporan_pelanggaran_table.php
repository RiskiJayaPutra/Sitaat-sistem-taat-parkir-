<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('laporan_pelanggaran', function (Blueprint $table) {
            // Tambahkan kolom untuk pelapor (agar bisa anonim)
            // Terhubung ke tabel 'users', 'set null' jika user pelapor dihapus
            $table->foreignId('pelapor_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('set null')
                  ->after('id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('laporan_pelanggaran', function (Blueprint $table) {
            // (Rollback) Hapus kolom yang ditambahkan
            $table->dropForeign(['pelapor_id']);
            $table->dropColumn('pelapor_id');
        });
    }
};