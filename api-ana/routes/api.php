<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EmpresaController;
use App\Http\Controllers\API\EmpleadoController;
use App\Http\Controllers\API\NotificacionController;
use App\Http\Controllers\API\NominaController;
use App\Http\Controllers\API\HorarioController;
use App\Http\Controllers\API\VacacionController;

// Rutas públicas (no requieren autenticación)
Route::post('/login', [AuthController::class, 'login']);

// GET de empresas público (no requiere token)
Route::get('/empresas', [EmpresaController::class, 'index']);
Route::get('/empresas/{id}', [EmpresaController::class, 'show']);

// Rutas protegidas (requieren token válido)
Route::middleware('auth:sanctum')->group(function () {
    // Rutas de autenticación
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    
    // Rutas de empresas que requieren autenticación (crear, actualizar, eliminar)
    Route::post('/empresas', [EmpresaController::class, 'store']);
    Route::put('/empresas/{id}', [EmpresaController::class, 'update']);
    Route::patch('/empresas/{id}', [EmpresaController::class, 'update']);
    Route::delete('/empresas/{id}', [EmpresaController::class, 'destroy']);
    
    // Ruta para subir imagen de empresa
    Route::post('/empresas/{id}/upload-image', [EmpresaController::class, 'uploadImage']);
    
    // Rutas de empleados (todas requieren autenticación)
    Route::apiResource('empleados', EmpleadoController::class);
    
    // Ruta para subir imagen de empleado
    Route::post('/empleados/{id}/upload-image', [EmpleadoController::class, 'uploadImage']);
    
    // Rutas de notificaciones
    Route::apiResource('notificaciones', NotificacionController::class);
    Route::patch('/notificaciones/{id}/mark-read', [NotificacionController::class, 'markAsRead']);
    Route::post('/notificaciones/{id}/mark-read', [NotificacionController::class, 'markAsRead']);
    
    // Rutas de nóminas
    Route::apiResource('nominas', NominaController::class);
    
    // Rutas de horarios
    Route::apiResource('horarios', HorarioController::class);
    
    // Añadir también rutas POST para mayor compatibilidad
    Route::patch('/horarios/{id}/aceptar', [HorarioController::class, 'aceptar']);
    Route::post('/horarios/{id}/aceptar', [HorarioController::class, 'aceptar']);
    
    Route::patch('/horarios/{id}/rechazar', [HorarioController::class, 'rechazar']);
    Route::post('/horarios/{id}/rechazar', [HorarioController::class, 'rechazar']);
    
    Route::get('/horarios/estado/{estado}', [HorarioController::class, 'porEstado']);
    
    // Rutas de vacaciones
    Route::apiResource('vacaciones', VacacionController::class);
    
    // Añadir rutas POST para vacaciones también
    Route::patch('/vacaciones/{id}/aprobar', [VacacionController::class, 'aprobar']);
    Route::post('/vacaciones/{id}/aprobar', [VacacionController::class, 'aprobar']);
    
    Route::patch('/vacaciones/{id}/rechazar', [VacacionController::class, 'rechazar']);
    Route::post('/vacaciones/{id}/rechazar', [VacacionController::class, 'rechazar']);
});
