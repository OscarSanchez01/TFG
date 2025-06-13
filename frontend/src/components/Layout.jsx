"use client"

import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export default function Layout({ children }) {
  const navigate = useNavigate()

  // Verificación adicional de autenticación en el Layout
  useEffect(() => {
    const checkAuth = () => {
      const userStr = sessionStorage.getItem("user")
      const token = sessionStorage.getItem("token")

      console.log("Layout - Additional auth check:", {
        userExists: !!userStr,
        tokenExists: !!token,
      })

      if (!userStr || !token) {
        console.log("Layout - No authentication detected, redirecting to home page...")
        navigate("/", { replace: true })
      }
    }

    // Verificar inmediatamente
    checkAuth()

    // Verificar periódicamente (cada 5 segundos)
    const interval = setInterval(checkAuth, 60000)

    return () => clearInterval(interval)
  }, [navigate])

  return children || <Outlet />
}
