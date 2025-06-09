"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import { Button } from "../../ui/Button"
import { Check, X, Clock } from "lucide-react"
import { useAdminSchedules } from "../../../hooks/useAdminSchedules"
import { useToast } from "../../../hooks/useToast"

export default function AdminSchedules({ company }) {
  const { schedules, loading, error, updateScheduleStatus } = useAdminSchedules()
  const { toast } = useToast()

  const handleStatusUpdate = async (scheduleId, newStatus) => {
    try {
      await updateScheduleStatus(scheduleId, newStatus)
      toast({
        title: "Estado actualizado",
        description: `La solicitud de horario ha sido ${newStatus === "aceptado" ? "aceptada" : "rechazada"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el estado",
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "aceptado":
        return <Badge className="bg-green-500 text-white">Aceptado</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
      case "rechazado":
        return <Badge className="bg-red-500 text-white">Rechazado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingSchedules = schedules.filter((schedule) => schedule.status === "pendiente")
  const processedSchedules = schedules.filter((schedule) => schedule.status !== "pendiente")

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Horarios</h2>
          <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de cambio de horario</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Horarios</h2>
          <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de cambio de horario</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Error al cargar las solicitudes</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Horarios</h2>
        <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de cambio de horario</p>
      </div>

      {/* Solicitudes Pendientes */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Solicitudes Pendientes ({pendingSchedules.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pendingSchedules.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay solicitudes pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingSchedules.map((schedule) => (
                <div key={schedule.id} className="rounded-lg border p-4 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{schedule.employeeName}</h3>
                      <p className="text-sm text-gray-600">{schedule.employeeEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Fecha:</strong> {schedule.formattedDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Horario:</strong> {schedule.startTime} - {schedule.endTime}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Turno:</strong> {schedule.startTime === "08:00" ? "Mañana" : "Tarde"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(schedule.status)}
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleStatusUpdate(schedule.id, "aceptado")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleStatusUpdate(schedule.id, "rechazado")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Solicitudes Procesadas */}
      {processedSchedules.length > 0 && (
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle>Solicitudes Procesadas ({processedSchedules.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {processedSchedules.map((schedule) => (
                <div key={schedule.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{schedule.employeeName}</h3>
                      <p className="text-sm text-gray-600">{schedule.employeeEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Fecha:</strong> {schedule.formattedDate}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Horario:</strong> {schedule.startTime} - {schedule.endTime}
                      </p>
                    </div>
                    {getStatusBadge(schedule.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
