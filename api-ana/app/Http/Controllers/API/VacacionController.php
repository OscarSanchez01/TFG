<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Vacacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VacacionController extends Controller
{
    public function index()
    {
        $vacaciones = Vacacion::with('empleado')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $vacaciones
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'required|exists:empleados,id',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'estado' => 'sometimes|in:pendiente,aprobada,rechazada',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vacacion = Vacacion::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Vacacion created successfully',
            'data' => $vacacion
        ], 201);
    }

    public function show($id)
    {
        $vacacion = Vacacion::with('empleado')->find($id);
        
        if (!$vacacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacacion not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $vacacion
        ]);
    }

    public function update(Request $request, $id)
    {
        $vacacion = Vacacion::find($id);
        
        if (!$vacacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacacion not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'sometimes|required|exists:empleados,id',
            'fecha_inicio' => 'sometimes|required|date',
            'fecha_fin' => 'sometimes|required|date|after_or_equal:fecha_inicio',
            'estado' => 'sometimes|in:pendiente,aprobada,rechazada',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $vacacion->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Vacacion updated successfully',
            'data' => $vacacion
        ]);
    }

    public function destroy($id)
    {
        $vacacion = Vacacion::find($id);
        
        if (!$vacacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacacion not found'
            ], 404);
        }
        
        $vacacion->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Vacacion deleted successfully'
        ]);
    }

    public function aprobar($id)
    {
        $vacacion = Vacacion::find($id);
        
        if (!$vacacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacacion not found'
            ], 404);
        }
        
        $vacacion->update(['estado' => 'aprobada']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Vacacion approved successfully',
            'data' => $vacacion
        ]);
    }

    public function rechazar($id)
    {
        $vacacion = Vacacion::find($id);
        
        if (!$vacacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Vacacion not found'
            ], 404);
        }
        
        $vacacion->update(['estado' => 'rechazada']);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Vacacion rejected successfully',
            'data' => $vacacion
        ]);
    }
}
