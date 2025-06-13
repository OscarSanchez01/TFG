<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nomina extends Model
{
    use HasFactory;

    protected $table = 'nominas';
    protected $primaryKey = 'id_nomina';

    protected $fillable = [
        'id_empleado',
        'id_empresa',
        'fecha',
        'salario_bruto',
        'salario_neto',
        'archivo_pdf',
    ];

    protected $casts = [
        'fecha' => 'date',
        'salario_bruto' => 'decimal:2',
        'salario_neto' => 'decimal:2',
    ];

    // Relaciones
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }
}
