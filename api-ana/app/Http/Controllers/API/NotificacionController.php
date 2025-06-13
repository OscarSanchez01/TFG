<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificacionController extends Controller
{
    public function index()
    {
        $notificaciones = Notificacion::with('empleado')->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $notificaciones
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'required|exists:empleados,id',
            'mensaje' => 'required|string',
            'fecha_envio' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $notificacion = Notificacion::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Notificacion created successfully',
            'data' => $notificacion
        ], 201);
    }

    public function show($id)
    {
        $notificacion = Notificacion::with('empleado')->find($id);
        
        if (!$notificacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notificacion not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $notificacion
        ]);
    }

    public function update(Request $request, $id)
    {
        $notificacion = Notificacion::find($id);
        
        if (!$notificacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notificacion not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'sometimes|required|exists:empleados,id',
            'mensaje' => 'sometimes|required|string',
            'fecha_envio' => 'sometimes|required|date',
            'leida' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $notificacion->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Notificacion updated successfully',
            'data' => $notificacion
        ]);
    }

    public function destroy($id)
    {
        $notificacion = Notificacion::find($id);
        
        if (!$notificacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notificacion not found'
            ], 404);
        }
        
        $notificacion->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Notificacion deleted successfully'
        ]);
    }

    public function markAsRead($id)
    {
        $notificacion = Notificacion::find($id);
        
        if (!$notificacion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Notificacion not found'
            ], 404);
        }
        
        $notificacion->update(['leida' => true]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Notificacion marked as read',
            'data' => $notificacion
        ]);
    }
}
