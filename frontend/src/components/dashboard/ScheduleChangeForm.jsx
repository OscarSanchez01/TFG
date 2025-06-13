"use client"

import { useState } from "react"
import { Button } from "../ui/Button"
import { useAuth } from "../../contexts/AuthContext"
import { useSessionData } from "../../hooks/useSessionData"
import { useToast } from "../../hooks/useToast"

export default function ScheduleChangeForm({ company }) {
  const [formData, setFormData] = useState({
    fecha: "",
    horaInicio: "",
    horaFin: "",
  })
  const [loading, setLoading] = useState(false)
  const { token } = useAuth()
  const { userData } = useSessionData()
  const { toast } = useToast()

  // Opciones de horarios disponibles
  const horarioOptions = [
    { value: "08:00", label: "08:00 - Turno de Mañana", horaFin: "16:00" },
    { value: "15:00", label: "15:00 - Turno de Tarde", horaFin: "23:00" },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "horaInicio") {
      // Encontrar la opción seleccionada para obtener la hora de fin automáticamente
      const selectedOption = horarioOptions.find((option) => option.value === value)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        horaFin: selectedOption ? selectedOption.horaFin : "",
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validar que todos los campos estén completos
    if (!formData.fecha || !formData.horaInicio || !formData.horaFin) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos",
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
        fecha: formData.fecha,
        hora_inicio: formData.horaInicio,
        hora_fin: formData.horaFin,
        estado: "pendiente",
      }

      console.log("Enviando solicitud de cambio de horario:", requestData)

      // Depuración adicional
      console.log("Token:", token ? `${token.substring(0, 15)}...` : "No token")
      console.log("URL:", "http://localhost:8000/api/horarios")
      console.log("Headers:", {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      })
      console.log("Body:", JSON.stringify(requestData, null, 2))

      // Enviar la solicitud a la API
      const response = await fetch("http://localhost:8000/api/horarios", {
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
        description: "Tu solicitud de cambio de horario ha sido enviada correctamente",
      })

      // Limpiar formulario
      setFormData({
        fecha: "",
        horaInicio: "",
        horaFin: "",
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="fecha" className="text-sm font-medium">
            Fecha del cambio
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="horaInicio" className="text-sm font-medium">
            Hora de inicio
          </label>
          <select
            id="horaInicio"
            name="horaInicio"
            value={formData.horaInicio}
            onChange={handleChange}
            className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Selecciona la hora de inicio</option>
            {horarioOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="horaFin" className="text-sm font-medium">
          Hora de fin
        </label>
        <input
          type="text"
          id="horaFin"
          name="horaFin"
          value={formData.horaFin}
          readOnly
          className="rounded-md border border-gray-300 p-2 bg-gray-100 cursor-not-allowed"
          placeholder="Se completa automáticamente"
        />
      </div>

      {/* Mostrar resumen del horario seleccionado */}
      {formData.horaInicio && formData.horaFin && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-2">Resumen del horario solicitado:</h4>
          <div className="text-sm text-blue-700">
            <p>
              <strong>Turno:</strong> {formData.horaInicio === "08:00" ? "Mañana" : "Tarde"}
            </p>
            <p>
              <strong>Horario:</strong> {formData.horaInicio} - {formData.horaFin}
            </p>
            <p>
              <strong>Duración:</strong> 8 horas
            </p>
          </div>
        </div>
      )}

      <Button type="submit" className={company.colors.button} disabled={loading}>
        {loading ? "Enviando solicitud..." : "Solicitar Cambio de Horario"}
      </Button>
    </form>
  )
}
