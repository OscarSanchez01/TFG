<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Empleado extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'empleados';

    protected $fillable = [
        'name',
        'email',
        'password',
        'rol',
        'image',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Relaciones
    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class, 'id_empleado');
    }

    public function nominas()
    {
        return $this->hasMany(Nomina::class, 'id_empleado');
    }

    public function horarios()
    {
        return $this->hasMany(Horario::class, 'id_empleado');
    }

    public function vacaciones()
    {
        return $this->hasMany(Vacacion::class, 'id_empleado');
    }
}
