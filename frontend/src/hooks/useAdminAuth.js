"use client"

import { useMemo } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSessionData } from "./useSessionData"

export function useAdminAuth() {
  const { user } = useAuth()
  const { userData } = useSessionData()

  const isAdmin = useMemo(() => {
    const currentUser = userData || user

    if (!currentUser) return false

    // Verificar si es admin por email (@empleado)
    const email = currentUser.email || ""
    const isAdminByEmail = email.toLowerCase().includes("@empleado")

    // Verificar si es admin por rol
    const rol = currentUser.rol || ""
    const isAdminByRole = rol.toLowerCase() === "administrador" || rol.toLowerCase() === "admin"

    console.log("Admin check:", {
      email,
      rol,
      isAdminByEmail,
      isAdminByRole,
      finalResult: isAdminByEmail || isAdminByRole,
    })

    return isAdminByEmail || isAdminByRole
  }, [user, userData])

  return { isAdmin }
}
