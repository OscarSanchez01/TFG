<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nominas', function (Blueprint $table) {
            $table->id('id_nomina');
            $table->foreignId('id_empleado')->constrained('empleados', 'id')->onDelete('cascade');
            $table->foreignId('id_empresa')->constrained('empresas', 'id_empresa')->onDelete('cascade');
            $table->date('fecha');
            $table->decimal('salario_bruto', 10, 2);
            $table->decimal('salario_neto', 10, 2);
            $table->string('archivo_pdf')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nominas');
    }
};
