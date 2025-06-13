<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmpleadoController extends Controller
{
    public function index()
    {
        $empleados = Empleado::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $empleados
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:empleados',
            'password' => 'required|string|min:8',
            'rol' => 'required|in:empleado,administrador',
            'image' => 'nullable|string|max:255', // URL de imagen o nombre de archivo
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $empleado = Empleado::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
            'image' => $request->image,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Empleado created successfully',
            'data' => $empleado
        ], 201);
    }

    public function show($id)
    {
        $empleado = Empleado::with(['notificaciones', 'nominas', 'horarios', 'vacaciones'])->find($id);
        
        if (!$empleado) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empleado not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $empleado
        ]);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        
        if (!$empleado) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empleado not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|string|email|max:100|unique:empleados,email,' . $id,
            'password' => 'sometimes|required|string|min:8',
            'rol' => 'sometimes|required|in:empleado,administrador',
            'image' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $empleado->update($data);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Empleado updated successfully',
            'data' => $empleado
        ]);
    }

    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        
        if (!$empleado) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empleado not found'
            ], 404);
        }
        
        $empleado->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Empleado deleted successfully'
        ]);
    }

    /**
     * Upload image for empleado
     */
    public function uploadImage(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        
        if (!$empleado) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empleado not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Eliminar imagen anterior si existe
            if ($empleado->image && Storage::disk('public')->exists($empleado->image)) {
                Storage::disk('public')->delete($empleado->image);
            }

            // Subir nueva imagen
            $imagePath = $request->file('image')->store('empleados', 'public');
            
            // Actualizar empleado con la nueva ruta de imagen
            $empleado->update(['image' => $imagePath]);

            return response()->json([
                'status' => 'success',
                'message' => 'Image uploaded successfully',
                'data' => [
                    'empleado' => $empleado,
                    'image_url' => Storage::url($imagePath)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error uploading image: ' . $e->getMessage()
            ], 500);
        }
    }
}
