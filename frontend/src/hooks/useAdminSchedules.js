"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export function useAdminSchedules() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchSchedules = async () => {
    if (!token) {
      setError("No hay token de autenticación disponible")
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch("http://localhost:8000/api/horarios", {
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
      console.log("Admin schedules API response:", result)

      if (result.status === "success" && result.data && Array.isArray(result.data)) {
        // Transformar los datos
        const transformedSchedules = result.data.map((schedule) => {
          const scheduleDate = new Date(schedule.fecha)
          const formattedDate = scheduleDate.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })

          return {
            id: schedule.id_horario,
            employeeName: schedule.empleado?.name || "Empleado Desconocido",
            employeeEmail: schedule.empleado?.email || "",
            employeeId: schedule.id_empleado,
            date: schedule.fecha,
            formattedDate,
            startTime: schedule.hora_inicio,
            endTime: schedule.hora_fin,
            status: schedule.estado,
          }
        })

        setSchedules(transformedSchedules)
      } else {
        setSchedules([])
        setError("No se recibieron datos válidos del servidor")
      }
    } catch (err) {
      console.error("Error fetching admin schedules:", err)
      setError(err.message)
      setSchedules([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [token])

  const updateScheduleStatus = async (scheduleId, newStatus) => {
    if (!token) {
      throw new Error("No hay token de autenticación disponible")
    }

    try {
      console.log("=== UPDATE SCHEDULE STATUS DEBUG ===")
      console.log("Schedule ID:", scheduleId)
      console.log("New Status:", newStatus)
      console.log("Token:", token ? `${token.substring(0, 15)}...` : "No token")

      // Usar endpoints específicos para aceptar/rechazar con POST
      let url
      let method = "POST" // Cambiar a POST
      let requestBody = null

      if (newStatus === "aceptado") {
        url = `http://localhost:8000/api/horarios/${scheduleId}/aceptar`
      } else if (newStatus === "rechazado") {
        url = `http://localhost:8000/api/horarios/${scheduleId}/rechazar`
      } else {
        // Para 'pendiente' usar el endpoint general con PUT
        url = `http://localhost:8000/api/horarios/${scheduleId}`
        method = "PUT"
        requestBody = { estado: newStatus }
      }

      console.log("URL:", url)
      console.log("Method:", method)
      console.log("Request body:", requestBody)

      const fetchOptions = {
        method: method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }

      // Solo añadir Content-Type y body si hay datos para enviar
      if (requestBody) {
        fetchOptions.headers["Content-Type"] = "application/json"
        fetchOptions.body = JSON.stringify(requestBody)
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
        console.log("✅ Schedule status update successful!")

        // Actualizar la lista local
        setSchedules((prev) =>
          prev.map((schedule) => (schedule.id === scheduleId ? { ...schedule, status: newStatus } : schedule)),
        )

        // Refetch para asegurar que los datos estén actualizados
        await fetchSchedules()

        return { success: true }
      } else {
        throw new Error(result.message || "Error al actualizar el estado")
      }
    } catch (err) {
      console.error("❌ Error updating schedule status:", err)
      throw err
    }
  }

  return {
    schedules,
    loading,
    error,
    updateScheduleStatus,
    refetch: fetchSchedules,
  }
}
