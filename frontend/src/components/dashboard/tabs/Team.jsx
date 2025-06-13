"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import TeamCalendar from "../TeamCalendar"
import { useTeamSchedules } from "../../../hooks/useTeamSchedules"

export default function Team({ company }) {
  const { schedules, employees, loading, error, getTeamStats } = useTeamSchedules()
  const teamStats = getTeamStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Horarios del Equipo</h2>
          <p className="mt-1 text-gray-600">Ver los horarios y disponibilidad de tu equipo</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando horarios del equipo...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Horarios del Equipo</h2>
          <p className="mt-1 text-gray-600">Ver los horarios y disponibilidad de tu equipo</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Error al cargar los horarios del equipo</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Horarios del Equipo</h2>
        <p className="mt-1 text-gray-600">Ver los horarios y disponibilidad de tu equipo</p>
      </div>

      {/* Estadísticas del equipo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText} pb-2`}>
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText} pb-2`}>
            <CardTitle className="text-sm font-medium">Trabajando Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{teamStats.workingToday}</div>
          </CardContent>
        </Card>

        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText} pb-2`}>
            <CardTitle className="text-sm font-medium">Libres Hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{teamStats.offToday}</div>
          </CardContent>
        </Card>
      </div>

      {/* Leyenda de colores de empleados */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle>Empleados del Equipo</CardTitle>
          <CardDescription className="text-gray-300">
            Cada empleado tiene un color asignado en el calendario
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: employee.color.bg }}></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{employee.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{employee.rol}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendario del equipo */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle>Calendario de Horarios del Equipo</CardTitle>
          <CardDescription className="text-gray-300">
            Vista completa de los horarios de todos los miembros del equipo
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mt-6">
            <TeamCalendar
              schedules={schedules}
              employees={employees}
              company={company}
              loading={loading}
              error={error}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
