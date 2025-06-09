"use client"

import { Clock, FileText, CreditCard, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import { useSchedule } from "../../../hooks/useSchedule"
import { useSessionData } from "../../../hooks/useSessionData"
import { usePayslips } from "../../../hooks/usePayslips"

export default function Overview({ company, employeeData }) {
  const { getTodaySchedule, getScheduleStatus, loading: scheduleLoading, error, usingFallback } = useSchedule()
  const { userData: sessionUserData } = useSessionData()
  const { payslips, loading: payslipsLoading } = usePayslips()

  // Obtener el nombre del empleado, con fallback
  const employeeName = employeeData?.nombre || employeeData?.name || "Usuario"

  // Obtener la fecha actual en español
  const getCurrentDateInSpanish = () => {
    const today = new Date()
    return today.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Obtener el horario de hoy
  const todaySchedules = getTodaySchedule()

  // Obtener la última nómina
  const latestPayslip = payslips.length > 0 ? payslips[0] : null

  // Función para obtener el badge apropiado según el estado
  const getStatusBadge = (status) => {
    switch (status) {
      case "current":
        return <Badge className="bg-green-500 text-white">Trabajando</Badge>
      case "finished":
        return <Badge className="bg-gray-500 text-white">Terminado</Badge>
      case "upcoming":
        return <Badge className="bg-blue-500 text-white">Próximo</Badge>
      default:
        return <Badge variant="outline">Desconocido</Badge>
    }
  }

  // Función para formatear la hora
  const formatTime = (time) => {
    // El tiempo viene en formato HH:MM, convertir a formato más legible
    const [hours, minutes] = time.split(":")
    return `${hours}:${minutes}`
  }

  // Función para obtener el texto del estado en español
  const getStatusText = (status) => {
    switch (status) {
      case "current":
        return "Trabajando ahora"
      case "finished":
        return "Jornada terminada"
      case "upcoming":
        return "Próximo turno"
      default:
        return "Estado desconocido"
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Bienvenido, {employeeName}</h2>
        <p className={`mt-1 text-gray-600`}>{getCurrentDateInSpanish()}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Horario del día
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {scheduleLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Cargando horario...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="font-medium text-red-600">Error al cargar horario</p>
                <p className="text-sm text-gray-500 mt-1">{error}</p>
              </div>
            ) : todaySchedules.length === 0 ? (
              <div className="text-center py-4">
                <p className="font-medium text-gray-600">Hoy no trabajas</p>
                <p className="text-sm text-gray-500">Disfruta tu día libre</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedules.map((schedule, index) => {
                  const status = getScheduleStatus(schedule.hora_inicio, schedule.hora_fin)

                  return (
                    <div key={schedule.id_horario} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {todaySchedules.length === 1 ? "Jornada laboral" : `Turno ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatTime(schedule.hora_inicio)} - {formatTime(schedule.hora_fin)}
                        </p>
                        <p className="text-xs text-gray-400">{getStatusText(status)}</p>
                      </div>
                      {getStatusBadge(status)}
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Balance de Vacaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Asignación Anual</p>
                <p className="font-bold">25 días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Utilizados</p>
                <p className="font-bold">8 días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Pendientes de Aprobación</p>
                <p className="font-bold">3 días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Restantes</p>
                <p className={`font-bold ${company.colors.accent}`}>14 días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Última Nómina
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {payslipsLoading ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Cargando nómina...</p>
              </div>
            ) : latestPayslip ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Período</p>
                  <p className="font-bold">{latestPayslip.period}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Cantidad Neta</p>
                  <p className={`font-bold ${company.colors.accent}`}>{latestPayslip.amount}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Fecha de Pago</p>
                  <p className="font-bold">{latestPayslip.date}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Estado</p>
                  <Badge
                    className={
                      latestPayslip.status === "Cobrada" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                    }
                  >
                    {latestPayslip.status}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="font-medium text-gray-600">No hay nóminas disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
