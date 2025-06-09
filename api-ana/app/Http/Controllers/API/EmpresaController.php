<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Empresa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class EmpresaController extends Controller
{
    public function index()
    {
        $empresas = Empresa::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $empresas
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'cif' => 'required|string|size:9|unique:empresas',
            'direccion' => 'required|string',
            'imagen' => 'nullable|string|max:255', // URL de imagen o nombre de archivo
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $empresa = Empresa::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Empresa created successfully',
            'data' => $empresa
        ], 201);
    }

    public function show($id)
    {
        $empresa = Empresa::find($id);
        
        if (!$empresa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empresa not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $empresa
        ]);
    }

    public function update(Request $request, $id)
    {
        $empresa = Empresa::find($id);
        
        if (!$empresa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empresa not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'nombre' => 'sometimes|required|string|max:100',
            'cif' => 'sometimes|required|string|size:9|unique:empresas,cif,' . $id . ',id_empresa',
            'direccion' => 'sometimes|required|string',
            'imagen' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $empresa->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Empresa updated successfully',
            'data' => $empresa
        ]);
    }

    public function destroy($id)
    {
        $empresa = Empresa::find($id);
        
        if (!$empresa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empresa not found'
            ], 404);
        }
        
        $empresa->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Empresa deleted successfully'
        ]);
    }

    /**
     * Upload image for empresa
     */
    public function uploadImage(Request $request, $id)
    {
        $empresa = Empresa::find($id);
        
        if (!$empresa) {
            return response()->json([
                'status' => 'error',
                'message' => 'Empresa not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // 2MB max
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
            if ($empresa->imagen && Storage::disk('public')->exists($empresa->imagen)) {
                Storage::disk('public')->delete($empresa->imagen);
            }

            // Subir nueva imagen
            $imagePath = $request->file('imagen')->store('empresas', 'public');
            
            // Actualizar empresa con la nueva ruta de imagen
            $empresa->update(['imagen' => $imagePath]);

            return response()->json([
                'status' => 'success',
                'message' => 'Image uploaded successfully',
                'data' => [
                    'empresa' => $empresa,
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
