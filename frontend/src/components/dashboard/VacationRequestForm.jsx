"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import { useAuth } from "../../contexts/AuthContext"
import { useSessionData } from "../../hooks/useSessionData"
import { useToast } from "../../hooks/useToast"
import { useVacations } from "../../hooks/useVacations"

export default function VacationRequestForm({ buttonColor }) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  })
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { userData } = useSessionData()
  const { toast } = useToast()
  const { getVacationBalance } = useVacations()
  const vacationBalance = getVacationBalance()

  // Función para verificar si una fecha es fin de semana
  const isWeekend = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDay()
    return day === 0 || day === 6 // 0 es domingo, 6 es sábado
  }

  // Función para obtener la siguiente fecha laborable
  const getNextWorkingDay = (date) => {
    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    // Si es fin de semana, buscar el próximo día laborable (lunes)
    while (nextDay.getDay() === 0 || nextDay.getDay() === 6) {
      nextDay.setDate(nextDay.getDate() + 1)
    }

    return nextDay.toISOString().split("T")[0]
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // Si la fecha seleccionada es fin de semana, no permitir la selección
    if (isWeekend(value)) {
      toast({
        title: "Fecha no válida",
        description: "No puedes seleccionar sábados ni domingos",
      })
      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Función para contar días laborables entre dos fechas
  const countWorkingDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0

    let count = 0
    const currentDate = new Date(startDate)
    const endDateObj = new Date(endDate)

    while (currentDate <= endDateObj) {
      const dayOfWeek = currentDate.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        // No es domingo (0) ni sábado (6)
        count++
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return count
  }

  // Calcular días laborables solicitados
  const workingDaysRequested = countWorkingDays(formData.startDate, formData.endDate)

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que todos los campos estén completos
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
      })
      return
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      toast({
        title: "Error",
        description: "La fecha de fin debe ser posterior a la fecha de inicio",
      })
      return
    }

    // Validar que no se soliciten más días de los disponibles
    if (workingDaysRequested > vacationBalance.remainingDays) {
      toast({
        title: "Error",
        description: `No tienes suficientes días disponibles. Solicitaste ${workingDaysRequested} días pero solo tienes ${vacationBalance.remainingDays} disponibles.`,
      })
      return
    }

    // Validar que tenemos el ID del empleado y el token
    if (!userData || !userData.id) {
      toast({
        title: "Error",
        description: "No se pudo obtener la información del usuario",
      })
      return
    }

    if (!token) {
      toast({
        title: "Error",
        description: "No se pudo obtener el token de autenticación",
      })
      return
    }

    try {
      setLoading(true)

      // Preparar los datos para enviar a la API
      const requestData = {
        id_empleado: userData.id,
        fecha_inicio: formData.startDate,
        fecha_fin: formData.endDate,
        estado: "pendiente",
      }

      console.log("Enviando solicitud de vacaciones:", requestData)

      // Depuración adicional
      console.log("Token:", token ? `${token.substring(0, 15)}...` : "No token")
      console.log("URL:", "http://localhost:8000/api/vacaciones")
      console.log("Headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      })
      console.log("Body:", JSON.stringify(requestData, null, 2))

      // Enviar la solicitud a la API
      const response = await fetch("http://localhost:8000/api/vacaciones", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()
      console.log("Respuesta de la API:", result)

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Error al enviar la solicitud")
      }

      // Mostrar mensaje de éxito
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de vacaciones ha sido enviada correctamente",
      })

      // Limpiar formulario
      setFormData({
        startDate: "",
        endDate: "",
      })
    } catch (error) {
      console.error("Error al enviar la solicitud:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al enviar la solicitud",
      })
    } finally {
      setLoading(false)
    }
  }

  // Obtener la fecha actual en formato YYYY-MM-DD para el mínimo del selector
  const today = new Date().toISOString().split("T")[0]

  // Obtener el próximo día laborable para la fecha de inicio mínima
  const nextWorkingDay = getNextWorkingDay(new Date())

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <label htmlFor="startDate" className="text-sm font-medium">
          Fecha Inicio
        </label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          min={today} // No permitir fechas anteriores a hoy
          className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
          required
        />
        <p className="text-xs text-gray-500">No se pueden seleccionar sábados ni domingos</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="endDate" className="text-sm font-medium">
          Fecha Fin
        </label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          min={formData.startDate || today} // No permitir fechas anteriores a la fecha de inicio
          className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
          required
          disabled={!formData.startDate} // Deshabilitar hasta que se seleccione fecha de inicio
        />
        <p className="text-xs text-gray-500">No se pueden seleccionar sábados ni domingos</p>
      </div>

      {/* Mostrar días laborables calculados y disponibles */}
      {formData.startDate && formData.endDate && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-sm text-blue-800">
            <strong>Días laborables solicitados:</strong> {workingDaysRequested} días
          </p>
          <p className="text-sm text-blue-800">
            <strong>Días disponibles:</strong> {vacationBalance.remainingDays} días
          </p>
          {workingDaysRequested > vacationBalance.remainingDays && (
            <p className="text-sm text-red-600 mt-1 font-medium">
              ¡Atención! Has solicitado más días de los que tienes disponibles.
            </p>
          )}
          <p className="text-xs text-blue-600 mt-1">(No se cuentan sábados ni domingos)</p>
        </div>
      )}

      <Button
        type="submit"
        className={buttonColor}
        disabled={
          loading || workingDaysRequested > vacationBalance.remainingDays || !formData.startDate || !formData.endDate
        }
      >
        {loading ? "Enviando solicitud..." : "Enviar Solicitud"}
      </Button>
    </form>
  )
}
