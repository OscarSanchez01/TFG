"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSessionData } from "./useSessionData"

export function useSchedule() {
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const { token } = useAuth()
  const { userData } = useSessionData()

  useEffect(() => {
    const fetchSchedules = async () => {
      // console.log("=== useSchedule: Starting fetch ===")
      // console.log("Token available:", !!token)
      // console.log("User data from sessionStorage:", userData)

      // Debug: Revisar todo el sessionStorage
      // console.log("=== SessionStorage Debug ===")
      // console.log("All sessionStorage keys:", Object.keys(sessionStorage))
      // console.log("user key:", sessionStorage.getItem("user"))
      // console.log("userData key:", sessionStorage.getItem("userData"))
      // console.log("token key:", sessionStorage.getItem("token"))

      // Si no hay token, no podemos hacer la llamada
      if (!token) {
        console.log("No token available, cannot fetch schedules")
        setSchedules([])
        setUsingFallback(false)
        setLoading(false)
        setError("No hay token de autenticación disponible")
        return
      }

      // Si no hay userData o ID, no podemos filtrar
      if (!userData) {
        console.log("No user data available")
        setSchedules([])
        setUsingFallback(false)
        setLoading(false)
        setError("No hay datos de usuario disponibles")
        return
      }

      if (!userData.id) {
        console.log("No user ID available in userData:", userData)
        setSchedules([])
        setUsingFallback(false)
        setLoading(false)
        setError("No se encontró ID de usuario")
        return
      }

      try {
        console.log("Fetching schedules from API...")
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

        console.log("API Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Server error response:", errorText)
          throw new Error(`Error del servidor: ${response.status}`)
        }

        const result = await response.json()
        console.log("Horarios API response:", result)

        if (result.status === "success" && result.data && Array.isArray(result.data)) {
          // Filtrar solo los horarios del usuario actual usando el ID del sessionStorage
          // Y que tengan estado "aceptado"
          const currentUserId = userData.id
          console.log("Current user ID from sessionStorage:", currentUserId, typeof currentUserId)

          const userSchedules = result.data.filter((schedule) => {
            const scheduleEmployeeId = schedule.id_empleado
            // Verificar que pertenezca al usuario actual y tenga estado "aceptado"
            const matchUser = Number.parseInt(scheduleEmployeeId) === Number.parseInt(currentUserId)
            const matchStatus = schedule.estado === "aceptado"

            return matchUser && matchStatus
          })

          console.log("Filtered user schedules (aceptado only):", userSchedules)
          console.log("Total accepted schedules found for user:", userSchedules.length)

          setSchedules(userSchedules)
          setUsingFallback(false)

          if (userSchedules.length === 0) {
            console.log("No accepted schedules found for this user")
          }
        } else {
          console.log("No valid data in response")
          setSchedules([])
          setError("No se recibieron datos válidos del servidor")
        }
      } catch (err) {
        console.error("Error fetching horarios:", err)

        // Verificar si es un error de CORS
        if (err.message.includes("Failed to fetch") || err.message.includes("CORS")) {
          setError("Error de conexión con el servidor. Contacta al administrador.")
        } else {
          setError("Error al obtener los horarios.")
        }

        setSchedules([])
        setUsingFallback(false)
      } finally {
        setLoading(false)
      }
    }

    fetchSchedules()
  }, [token, userData])

  // Función para obtener el horario de hoy
  const getTodaySchedule = () => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0] // YYYY-MM-DD format

    console.log("=== getTodaySchedule ===")
    console.log("Today's date:", todayString)
    console.log("Available schedules:", schedules)
    console.log("Schedules length:", schedules.length)

    if (!schedules || schedules.length === 0) {
      console.log("No schedules available")
      return []
    }

    const todaySchedules = schedules.filter((schedule) => {
      if (!schedule || !schedule.fecha) {
        console.log("Invalid schedule object:", schedule)
        return false
      }

      // La fecha viene en formato ISO: "2025-06-08T00:00:00.000000Z"
      // Extraemos solo la parte de la fecha
      const scheduleDate = schedule.fecha.split("T")[0]
      console.log("Comparing schedule date:", scheduleDate, "with today:", todayString)
      const match = scheduleDate === todayString
      console.log("Date match:", match)

      if (match) {
        console.log("Found matching schedule for today:", schedule)
      }

      return match
    })

    console.log("Today's schedules found:", todaySchedules)
    console.log("Number of schedules for today:", todaySchedules.length)
    return todaySchedules
  }

  // Función para determinar el estado de un horario
  const getScheduleStatus = (startTime, endTime) => {
    if (!startTime || !endTime) {
      console.log("Invalid time parameters:", startTime, endTime)
      return "unknown"
    }

    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes() // minutos desde medianoche

    console.log("=== getScheduleStatus ===")
    console.log("Current time in minutes:", currentTime)
    console.log("Current time:", `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`)
    console.log("Checking schedule:", startTime, "-", endTime)

    try {
      // Convertir horarios a minutos (formato HH:MM)
      const [startHour, startMinute] = startTime.split(":").map(Number)
      const [endHour, endMinute] = endTime.split(":").map(Number)

      const startMinutes = startHour * 60 + startMinute
      const endMinutes = endHour * 60 + endMinute

      console.log("Start minutes:", startMinutes, "End minutes:", endMinutes)

      if (currentTime >= startMinutes && currentTime <= endMinutes) {
        console.log("Status: current")
        return "current"
      } else if (currentTime > endMinutes) {
        console.log("Status: finished")
        return "finished"
      } else {
        console.log("Status: upcoming")
        return "upcoming"
      }
    } catch (error) {
      console.error("Error parsing time:", error)
      return "unknown"
    }
  }

  console.log("=== useSchedule hook final state ===")
  console.log("Schedules:", schedules)
  console.log("Loading:", loading)
  console.log("Error:", error)
  console.log("Using fallback:", usingFallback)

  return {
    schedules,
    loading,
    error,
    usingFallback,
    getTodaySchedule,
    getScheduleStatus,
  }
}
