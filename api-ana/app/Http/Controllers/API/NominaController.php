<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Nomina;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NominaController extends Controller
{
    public function index()
    {
        $nominas = Nomina::with(['empleado', 'empresa'])->get();
        
        return response()->json([
            'status' => 'success',
            'data' => $nominas
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'required|exists:empleados,id',
            'id_empresa' => 'required|exists:empresas,id_empresa',
            'fecha' => 'required|date',
            'salario_bruto' => 'required|numeric|min:0',
            'salario_neto' => 'required|numeric|min:0',
            'archivo_pdf' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $nomina = Nomina::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Nomina created successfully',
            'data' => $nomina
        ], 201);
    }

    public function show($id)
    {
        $nomina = Nomina::with(['empleado', 'empresa'])->find($id);
        
        if (!$nomina) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nomina not found'
            ], 404);
        }
        
        return response()->json([
            'status' => 'success',
            'data' => $nomina
        ]);
    }

    public function update(Request $request, $id)
    {
        $nomina = Nomina::find($id);
        
        if (!$nomina) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nomina not found'
            ], 404);
        }
        
        $validator = Validator::make($request->all(), [
            'id_empleado' => 'sometimes|required|exists:empleados,id',
            'id_empresa' => 'sometimes|required|exists:empresas,id_empresa',
            'fecha' => 'sometimes|required|date',
            'salario_bruto' => 'sometimes|required|numeric|min:0',
            'salario_neto' => 'sometimes|required|numeric|min:0',
            'archivo_pdf' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $nomina->update($request->all());
        
        return response()->json([
            'status' => 'success',
            'message' => 'Nomina updated successfully',
            'data' => $nomina
        ]);
    }

    public function destroy($id)
    {
        $nomina = Nomina::find($id);
        
        if (!$nomina) {
            return response()->json([
                'status' => 'error',
                'message' => 'Nomina not found'
            ], 404);
        }
        
        $nomina->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Nomina deleted successfully'
        ]);
    }
}
