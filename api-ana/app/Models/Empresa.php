<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    protected $table = 'empresas';
    protected $primaryKey = 'id_empresa';

    protected $fillable = [
        'nombre',
        'cif',
        'direccion',
        'imagen',
        'description',
    ];

    // Relaciones
    public function nominas()
    {
        return $this->hasMany(Nomina::class, 'id_empresa', 'id_empresa');
    }
}
