"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export function useTeamSchedules() {
  const [schedules, setSchedules] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token, user } = useAuth()

  // Colores predefinidos para los empleados
  const employeeColors = [
    { bg: "#3b82f6", border: "#2563eb" }, // Azul
    { bg: "#10b981", border: "#059669" }, // Verde
    { bg: "#f59e0b", border: "#d97706" }, // Amarillo
    { bg: "#ef4444", border: "#dc2626" }, // Rojo
    { bg: "#8b5cf6", border: "#7c3aed" }, // Púrpura
    { bg: "#06b6d4", border: "#0891b2" }, // Cian
    { bg: "#f97316", border: "#ea580c" }, // Naranja
    { bg: "#84cc16", border: "#65a30d" }, // Lima
    { bg: "#ec4899", border: "#db2777" }, // Rosa
    { bg: "#6b7280", border: "#4b5563" }, // Gris
  ]

  // Función para extraer el dominio del email
  const getEmailDomain = (email) => {
    if (!email || typeof email !== "string") return null
    const parts = email.split("@")
    return parts.length === 2 ? parts[1].toLowerCase() : null
  }

  useEffect(() => {
    const fetchTeamSchedules = async () => {
      if (!token) {
        console.log("No token available, cannot fetch team schedules")
        setSchedules([])
        setLoading(false)
        setError("No hay token de autenticación disponible")
        return
      }

      if (!user?.email) {
        console.log("No user email available")
        setSchedules([])
        setLoading(false)
        setError("No se pudo determinar la empresa del usuario")
        return
      }

      try {
        console.log("Fetching team schedules from API...")
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

        console.log("Team Schedules API Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Server error response:", errorText)
          throw new Error(`Error del servidor: ${response.status}`)
        }

        const result = await response.json()
        console.log("Team Schedules API response:", result)

        if (result.status === "success" && result.data && Array.isArray(result.data)) {
          // Obtener el dominio del usuario logueado
          const userDomain = getEmailDomain(user.email)
          console.log("User domain:", userDomain)

          // Filtrar solo los horarios con estado "aceptado" y del mismo dominio de empresa
          const acceptedSchedules = result.data.filter((schedule) => {
            if (schedule.estado !== "aceptado") return false

            if (!schedule.empleado || !schedule.empleado.email) return false

            const employeeDomain = getEmailDomain(schedule.empleado.email)
            const isSameCompany = employeeDomain === userDomain

            console.log(
              `Employee: ${schedule.empleado.name}, Domain: ${employeeDomain}, Same company: ${isSameCompany}`,
            )

            return isSameCompany
          })

          console.log("Filtered schedules for company domain:", userDomain, acceptedSchedules)

          // Extraer empleados únicos de los horarios aceptados
          const uniqueEmployees = []
          const employeeMap = new Map()

          acceptedSchedules.forEach((schedule) => {
            if (schedule.empleado && !employeeMap.has(schedule.empleado.id)) {
              employeeMap.set(schedule.empleado.id, {
                id: schedule.empleado.id,
                name: schedule.empleado.name,
                email: schedule.empleado.email,
                rol: schedule.empleado.rol,
                image: schedule.empleado.image,
              })
              uniqueEmployees.push(employeeMap.get(schedule.empleado.id))
            }
          })

          // Asignar colores a cada empleado
          const employeesWithColors = uniqueEmployees.map((employee, index) => ({
            ...employee,
            color: employeeColors[index % employeeColors.length],
          }))

          console.log("Unique employees with colors:", employeesWithColors)

          // Transformar los horarios con información de color del empleado
          const transformedSchedules = acceptedSchedules.map((schedule) => {
            const employee = employeesWithColors.find((emp) => emp.id === schedule.empleado?.id)

            return {
              ...schedule,
              employeeColor: employee?.color || employeeColors[0],
              employeeName: schedule.empleado?.name || "Empleado Desconocido",
            }
          })

          setSchedules(transformedSchedules)
          setEmployees(employeesWithColors)
          console.log("Transformed team schedules (same company only):", transformedSchedules)
        } else {
          console.log("No valid data in response")
          setSchedules([])
          setEmployees([])
          setError("No se recibieron datos válidos del servidor")
        }
      } catch (err) {
        console.error("Error fetching team schedules:", err)
        setError("Error al obtener los horarios del equipo.")
        setSchedules([])
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }

    fetchTeamSchedules()
  }, [token, user?.email])

  // Función para obtener estadísticas del equipo
  const getTeamStats = () => {
    const today = new Date()
    const todayString = today.toISOString().split("T")[0]

    const todaySchedules = schedules.filter((schedule) => {
      const scheduleDate = schedule.fecha.split("T")[0]
      return scheduleDate === todayString
    })

    const totalEmployees = employees.length
    const workingToday = todaySchedules.length

    return {
      totalEmployees,
      workingToday,
      offToday: totalEmployees - workingToday,
    }
  }

  return {
    schedules,
    employees,
    loading,
    error,
    getTeamStats,
  }
}
