<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Empleado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login empleado and create token
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $empleado = Empleado::where('email', $request->email)->first();

            if (!$empleado || !Hash::check($request->password, $empleado->password)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }

            // Revocar tokens anteriores
            $empleado->tokens()->delete();

            // Crear nuevo token simple (sin expiración por ahora para debugging)
            $token = $empleado->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'empleado' => [
                        'id' => $empleado->id,
                        'name' => $empleado->name,
                        'email' => $empleado->email,
                        'rol' => $empleado->rol,
                    ],
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Logout empleado
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully logged out'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error during logout: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get current authenticated empleado
     */
    public function me(Request $request)
    {
        try {
            $empleado = $request->user();
            return response()->json([
                'status' => 'success',
                'data' => [
                    'empleado' => [
                        'id' => $empleado->id,
                        'name' => $empleado->name,
                        'email' => $empleado->email,
                        'rol' => $empleado->rol,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error retrieving user data: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh token
     */
    public function refreshToken(Request $request)
    {
        try {
            $empleado = $request->user();
            $request->user()->currentAccessToken()->delete();
            $token = $empleado->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Token refreshed successfully',
                'data' => [
                    'access_token' => $token,
                    'token_type' => 'Bearer',
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error refreshing token: ' . $e->getMessage()
            ], 500);
        }
    }
}
