"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export function useAdminVacations() {
  const [vacations, setVacations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchVacations = async () => {
    if (!token) {
      setError("No hay token de autenticación disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8000/api/vacaciones", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("No tienes permisos de administrador")
        }
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const result = await response.json()
      console.log("Admin vacations API response:", result)

      if (result.status === "success" && result.data && Array.isArray(result.data)) {
        // Transformar los datos (sin filtrar por usuario específico, mostrar todas)
        const transformedVacations = result.data.map((vacation) => {
          const startDate = new Date(vacation.fecha_inicio)
          const endDate = new Date(vacation.fecha_fin)

          const formattedStartDate = startDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })

          const formattedEndDate = endDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })

          // Calcular días laborables
          const workingDays = countWorkingDays(startDate, endDate)

          return {
            id: vacation.id_vacacion,
            employeeName: vacation.empleado?.name || "Empleado Desconocido",
            employeeEmail: vacation.empleado?.email || "",
            startDate: vacation.fecha_inicio,
            endDate: vacation.fecha_fin,
            formattedStartDate,
            formattedEndDate,
            status: vacation.estado,
            days: workingDays,
            dateRange: `${formattedStartDate} - ${formattedEndDate}`,
          }
        })

        setVacations(transformedVacations)
      } else {
        setVacations([])
        setError("No se recibieron datos válidos del servidor")
      }
    } catch (err) {
      console.error("Error fetching admin vacations:", err)
      setError(err.message)
      setVacations([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVacations()
  }, [token])

  // En useAdminVacations.js - Reemplaza la función updateVacationStatus
  const updateVacationStatus = async (vacationId, newStatus) => {
    if (!token) {
      throw new Error("No hay token de autenticación disponible")
    }

    try {
      console.log("=== UPDATE VACATION STATUS DEBUG ===")
      console.log("Vacation ID:", vacationId)
      console.log("New Status:", newStatus)
      console.log("Token:", token ? `${token.substring(0, 15)}...` : "No token")

      // Usar endpoints específicos para aprobar/rechazar con POST
      let url
      let method = "POST" // Cambiar de PATCH a POST

      if (newStatus === "aprobada") {
        url = `http://localhost:8000/api/vacaciones/${vacationId}/aprobar`
      } else if (newStatus === "rechazada") {
        url = `http://localhost:8000/api/vacaciones/${vacationId}/rechazar`
      } else {
        // Para otros estados usar el endpoint general con PUT
        url = `http://localhost:8000/api/vacaciones/${vacationId}`
        method = "PUT"
      }

      console.log("URL:", url)
      console.log("Method:", method)

      const fetchOptions = {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }

      // Solo añadir Content-Type y body si es PUT (para otros estados)
      if (method === "PUT") {
        fetchOptions.headers["Content-Type"] = "application/json"
        fetchOptions.body = JSON.stringify({ estado: newStatus })
      }

      const response = await fetch(url, fetchOptions)

      console.log("Response status:", response.status)
      console.log("Response ok:", response.ok)

      if (!response.ok) {
        const responseText = await response.text()
        console.error("❌ Update failed with status:", response.status)
        console.error("❌ Response text:", responseText)
        throw new Error(`Error del servidor: ${response.status} - ${responseText}`)
      }

      const result = await response.json()
      console.log("✅ Parsed response JSON:", result)

      if (result.status === "success") {
        console.log("✅ Vacation status update successful!")

        // Actualizar la lista local
        setVacations((prev) =>
          prev.map((vacation) => 
            vacation.id === vacationId 
              ? { ...vacation, status: newStatus } 
              : vacation
          ),
        )

        return { success: true }
      } else {
        throw new Error(result.message || "Error al actualizar el estado")
      }
    } catch (err) {
      console.error("❌ Error updating vacation status:", err)
      throw err
    }
  }

  // Función para contar días laborables
  function countWorkingDays(startDate, endDate) {
    let count = 0
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return count
  }

  return {
    vacations,
    loading,
    error,
    updateVacationStatus,
    refetch: fetchVacations,
  }
}
