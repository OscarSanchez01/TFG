<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empleado;
use Illuminate\Support\Facades\Hash;

class EmpleadoSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        $empleados = [
            [
                'name' => 'Administrador Principal',
                'email' => 'admin@empresa.com',
                'password' => Hash::make('admin123'),
                'rol' => 'administrador',
                'image' => 'https://via.placeholder.com/150x150/0066cc/ffffff?text=Admin'
            ],
            [
                'name' => 'Juan Pérez',
                'email' => 'juan@empresa.com',
                'password' => Hash::make('empleado123'),
                'rol' => 'empleado',
                'image' => 'https://via.placeholder.com/150x150/00cc66/ffffff?text=Juan'
            ],
            [
                'name' => 'Empleado Nuevo',
                'email' => 'nuevo1@empresa.com',
                'password' => Hash::make('password123'),
                'rol' => 'empleado',
                'image' => 'https://via.placeholder.com/150x150/cc6600/ffffff?text=Nuevo'
            ],
            [
                'name' => 'María García',
                'email' => 'maria@empresa.com',
                'password' => Hash::make('password123'),
                'rol' => 'empleado',
                'image' => 'https://via.placeholder.com/150x150/cc0066/ffffff?text=Maria'
            ],
            [
                'name' => 'Carlos López',
                'email' => 'carlos@empresa.com',
                'password' => Hash::make('password123'),
                'rol' => 'administrador',
                'image' => 'https://via.placeholder.com/150x150/6600cc/ffffff?text=Carlos'
            ]
        ];

        foreach ($empleados as $empleadoData) {
            if (!Empleado::where('email', $empleadoData['email'])->exists()) {
                Empleado::create($empleadoData);
            }
        }
    }
}
