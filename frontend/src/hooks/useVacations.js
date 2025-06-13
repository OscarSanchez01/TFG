"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSessionData } from "./useSessionData"

export function useVacations() {
  const [vacations, setVacations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const { userData } = useSessionData()

  // Tipos de vacaciones para mapear los valores
  const vacationTypes = {
    anuales: "Vacaciones Anuales",
    personales: "Días Personales",
    enfermedad: "Baja por Enfermedad",
    maternidad: "Baja por Maternidad/Paternidad",
    matrimonio: "Permiso por Matrimonio",
    fallecimiento: "Permiso por Fallecimiento",
    mudanza: "Permiso por Mudanza",
    examenes: "Permiso por Exámenes",
    otros: "Otros",
  }

  useEffect(() => {
    const fetchVacations = async () => {
      if (!token) {
        console.log("No token available, cannot fetch vacations")
        setVacations([])
        setLoading(false)
        setError("No hay token de autenticación disponible")
        return
      }

      if (!userData || !userData.id) {
        console.log("No user data available")
        setVacations([])
        setLoading(false)
        setError("No hay datos de usuario disponibles")
        return
      }

      try {
        console.log("Fetching vacations from API...")
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

        console.log("Vacations API Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Server error response:", errorText)
          throw new Error(`Error del servidor: ${response.status}`)
        }

        const result = await response.json()
        console.log("Vacations API response:", result)

        if (result.status === "success" && result.data && Array.isArray(result.data)) {
          // Filtrar solo las vacaciones del usuario actual
          const currentUserId = userData.id
          console.log("Current user ID:", currentUserId)

          const userVacations = result.data.filter((vacation) => {
            const vacationEmployeeId = vacation.id_empleado
            return Number.parseInt(vacationEmployeeId) === Number.parseInt(currentUserId)
          })

          console.log("Filtered user vacations:", userVacations)

          // Transformar los datos al formato esperado por el componente
          const transformedVacations = userVacations.map((vacation) => {
            const startDate = new Date(vacation.fecha_inicio)
            const endDate = new Date(vacation.fecha_fin)

            // Calcular días laborables de vacaciones (excluyendo sábados y domingos)
            const workingDays = countWorkingDays(startDate, endDate)

            // Formatear fechas
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

            // Traducir estado
            const statusTranslation = {
              aprobada: "Aprobada",
              pendiente: "Pendiente",
              rechazada: "Rechazada",
            }

            // Obtener el tipo de vacación (si existe en la API, sino usar un valor por defecto)
            const vacationType = vacation.tipo || "anuales" // Asumir que la API puede tener un campo 'tipo'
            const vacationTypeName = vacationTypes[vacationType] || "Vacaciones Anuales"

            return {
              id: vacation.id_vacacion,
              startDate: vacation.fecha_inicio,
              endDate: vacation.fecha_fin,
              formattedStartDate,
              formattedEndDate,
              status: statusTranslation[vacation.estado] || vacation.estado,
              originalStatus: vacation.estado,
              days: workingDays, // Ahora solo días laborables
              title: `${vacationTypeName}`,
              dateRange: `${formattedStartDate} - ${formattedEndDate}`,
              vacationType: vacationType,
              vacationTypeName: vacationTypeName,
            }
          })

          // Ordenar por fecha de inicio (más reciente primero)
          transformedVacations.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))

          setVacations(transformedVacations)
          console.log("Transformed vacations:", transformedVacations)
        } else {
          console.log("No valid data in response")
          setVacations([])
          setError("No se recibieron datos válidos del servidor")
        }
      } catch (err) {
        console.error("Error fetching vacations:", err)
        setError("Error al obtener las vacaciones.")
        setVacations([])
      } finally {
        setLoading(false)
      }
    }

    fetchVacations()
  }, [token, userData])

  // Actualizar la función getVacationBalance para asegurar que el total es 25 días laborables
  const getVacationBalance = () => {
    const currentYear = new Date().getFullYear()
    const yearlyVacations = vacations.filter((vacation) => {
      const vacationYear = new Date(vacation.startDate).getFullYear()
      return vacationYear === currentYear
    })

    const usedDays = yearlyVacations
      .filter((vacation) => vacation.originalStatus === "aprobada")
      .reduce((total, vacation) => total + vacation.days, 0)

    const pendingDays = yearlyVacations
      .filter((vacation) => vacation.originalStatus === "pendiente")
      .reduce((total, vacation) => total + vacation.days, 0)

    const annualAllowance = 25 // Días laborables anuales permitidos
    const remainingDays = annualAllowance - usedDays - pendingDays

    return {
      annualAllowance,
      usedDays,
      pendingDays,
      remainingDays: Math.max(0, remainingDays),
    }
  }

  // Función para obtener vacaciones en un rango de fechas (para el calendario)
  const getVacationsInDateRange = (startDate, endDate) => {
    return vacations.filter((vacation) => {
      const vacationStart = new Date(vacation.startDate)
      const vacationEnd = new Date(vacation.endDate)

      // Verificar si hay solapamiento entre las fechas
      return vacationStart <= endDate && vacationEnd >= startDate
    })
  }

  // Función para verificar si una fecha específica es día de vacaciones
  const isVacationDay = (date) => {
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)

    return vacations.find((vacation) => {
      const startDate = new Date(vacation.startDate)
      const endDate = new Date(vacation.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(0, 0, 0, 0)

      return checkDate >= startDate && checkDate <= endDate
    })
  }

  // Añadir la función para contar días laborables (excluyendo sábados y domingos)
  function countWorkingDays(startDate, endDate) {
    let count = 0
    const currentDate = new Date(startDate)

    // Iterar por cada día entre las fechas
    while (currentDate <= endDate) {
      // 0 = domingo, 6 = sábado
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++
      }
      // Avanzar al siguiente día
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return count
  }

  return {
    vacations,
    loading,
    error,
    getVacationBalance,
    getVacationsInDateRange,
    isVacationDay,
  }
}
