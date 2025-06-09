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
        // Verificar si la columna ya existe antes de añadirla
        if (!Schema::hasColumn('horarios', 'estado')) {
            Schema::table('horarios', function (Blueprint $table) {
                $table->enum('estado', ['pendiente', 'aceptado', 'rechazado'])->default('pendiente')->after('hora_fin');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('horarios', 'estado')) {
            Schema::table('horarios', function (Blueprint $table) {
                $table->dropColumn('estado');
            });
        }
    }
};
