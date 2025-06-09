"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { useSchedule } from "../../../hooks/useSchedule"
import FullCalendarSchedule from "../FullCalendarSchedule"
import ScheduleChangeForm from "../ScheduleChangeForm"

export default function Schedule({ company }) {
  const { schedules, loading, error } = useSchedule()

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Mi Horario</h2>
        <p className="mt-1 text-gray-600">Ver y gestionar tu horario de trabajo</p>
      </div>

      {/* Calendario Principal con FullCalendar */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle>Calendario de Horarios</CardTitle>
          <CardDescription className="text-gray-300">Vista completa de tus horarios de trabajo</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mt-6">
            <FullCalendarSchedule schedules={schedules} company={company} loading={loading} error={error} />
          </div>
        </CardContent>
      </Card>

      {/* Formulario de Solicitud de Cambio de Horario */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle>Solicitar Cambio de Horario</CardTitle>
          <CardDescription className="text-gray-300">
            Solicita un cambio en tu horario de trabajo para una fecha específica
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ScheduleChangeForm company={company} />
        </CardContent>
      </Card>
    </div>
  )
}
