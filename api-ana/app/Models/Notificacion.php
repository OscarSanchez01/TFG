<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';
    protected $primaryKey = 'id_notificacion';

    protected $fillable = [
        'id_empleado',
        'mensaje',
        'fecha_envio',
        'leida',
    ];

    protected $casts = [
        'fecha_envio' => 'datetime',
        'leida' => 'boolean',
    ];

    // Relaciones
    public function empleado()
    {
        return $this->belongsTo(Empleado::class, 'id_empleado');
    }
}
