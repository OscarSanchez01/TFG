"use client"

import { useEffect, useState } from "react"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  // Estado para controlar si se ha completado la verificación
  const [isVerified, setIsVerified] = useState(false)

  // Verificar autenticación directamente desde sessionStorage
  const isAuthenticated = () => {
    const userStr = sessionStorage.getItem("user")
    const token = sessionStorage.getItem("token")

    console.log("ProtectedRoute - Auth check from sessionStorage:", {
      userExists: !!userStr,
      tokenExists: !!token,
      userValue: userStr ? `${userStr.substring(0, 20)}...` : null,
      tokenValue: token ? `${token.substring(0, 20)}...` : null,
    })

    return !!userStr && !!token
  }

  // Efecto que se ejecuta inmediatamente
  useEffect(() => {
    console.log("ProtectedRoute - Checking authentication...")
    setIsVerified(true)
  }, [])

  // Si la verificación está completa y no hay autenticación, redirigir
  if (isVerified && !isAuthenticated()) {
    console.log("ProtectedRoute - No authentication detected, redirecting to home page...")
    return <Navigate to="/" replace={true} />
  }

  // Si hay autenticación o la verificación no está completa, renderizar los hijos
  return isVerified ? children : null
}
