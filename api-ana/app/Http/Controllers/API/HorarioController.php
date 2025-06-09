<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Horario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class HorarioController extends Controller
{
    public function index()
    {
        $horarios = Horario::with('empleado')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $horarios
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'required|exists:empleados,id',
            'fecha' => 'required|date',
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fin' => 'required|date_format:H:i|after:hora_inicio',
            'estado' => 'sometimes|in:pendiente,aceptado,rechazado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $horario = Horario::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Horario created successfully',
            'data' => $horario
        ], 201);
    }

    public function show($id)
    {
        $horario = Horario::with('empleado')->find($id);
        
        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horario not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $horario
        ]);
    }

    public function update(Request $request, $id)
    {
        Log::info('=== HORARIO UPDATE DEBUG ===');
        Log::info('ID: ' . $id);
        Log::info('Request data: ', $request->all());

        $horario = Horario::find($id);
        
        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horario not found'
            ], 404);
        }

        Log::info('Horario ANTES: ', $horario->toArray());
        
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'sometimes|required|exists:empleados,id',
            'fecha' => 'sometimes|required|date',
            'hora_inicio' => 'sometimes|required|date_format:H:i',
            'hora_fin' => 'sometimes|required|date_format:H:i',
            'estado' => 'sometimes|required|in:pendiente,aceptado,rechazado',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Usar DB::table para forzar la actualización
        if ($request->has('estado')) {
            $affected = DB::table('horarios')
                ->where('id_horario', $id)
                ->update([
                    'estado' => $request->estado,
                    'updated_at' => now()
                ]);
            
            Log::info('Filas afectadas por DB::table update: ' . $affected);
        }

        // Recargar el modelo
        $horario = Horario::find($id);
        Log::info('Horario DESPUÉS: ', $horario->toArray());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Horario updated successfully',
            'data' => $horario
        ]);
    }

    public function destroy($id)
    {
        $horario = Horario::find($id);
        
        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horario not found'
            ], 404);
        }
        
        $horario->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Horario deleted successfully'
        ]);
    }

    /**
     * Aceptar horario usando DB directo
     */
    public function aceptar($id)
    {
        Log::info('=== ACEPTAR HORARIO DEBUG ===');
        Log::info('ID: ' . $id);
        
        // Verificar que el horario existe
        $horario = Horario::find($id);
        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horario not found'
            ], 404);
        }

        Log::info('Horario ANTES de aceptar: ', $horario->toArray());
        
        // Usar DB::table para forzar la actualización
        $affected = DB::table('horarios')
            ->where('id_horario', $id)
            ->update([
                'estado' => 'aceptado',
                'updated_at' => now()
            ]);
        
        Log::info('Filas afectadas: ' . $affected);
        
        // Recargar el horario desde la BD
        $horario = Horario::find($id);
        Log::info('Horario DESPUÉS de aceptar: ', $horario->toArray());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Horario accepted successfully',
            'data' => $horario
        ]);
    }

    /**
     * Rechazar horario usando DB directo
     */
    public function rechazar($id)
    {
        Log::info('=== RECHAZAR HORARIO DEBUG ===');
        Log::info('ID: ' . $id);
        
        // Verificar que el horario existe
        $horario = Horario::find($id);
        if (!$horario) {
            return response()->json([
                'status' => 'error',
                'message' => 'Horario not found'
            ], 404);
        }

        Log::info('Horario ANTES de rechazar: ', $horario->toArray());
        
        // Usar DB::table para forzar la actualización
        $affected = DB::table('horarios')
            ->where('id_horario', $id)
            ->update([
                'estado' => 'rechazado',
                'updated_at' => now()
            ]);
        
        Log::info('Filas afectadas: ' . $affected);
        
        // Recargar el horario desde la BD
        $horario = Horario::find($id);
        Log::info('Horario DESPUÉS de rechazar: ', $horario->toArray());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Horario rejected successfully',
            'data' => $horario
        ]);
    }

    /**
     * Filtrar horarios por estado
     */
    public function porEstado($estado)
    {
        $validator = Validator::make(['estado' => $estado], [
            'estado' => 'required|in:pendiente,aceptado,rechazado'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Estado inválido. Debe ser: pendiente, aceptado o rechazado'
            ], 422);
        }

        $horarios = Horario::with('empleado')->where('estado', $estado)->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $horarios
        ]);
    }
}
