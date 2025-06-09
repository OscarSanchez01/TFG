"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import VacationRequestForm from "../VacationRequestForm"
import { useVacations } from "../../../hooks/useVacations"

export default function Vacation({ company }) {
  const { vacations, loading, error, getVacationBalance } = useVacations()
  const vacationBalance = getVacationBalance()

  const getStatusBadge = (status, originalStatus) => {
    switch (originalStatus) {
      case "aprobada":
        return <Badge className="bg-green-500 text-white">{status}</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white">{status}</Badge>
      case "rechazada":
        return <Badge className="bg-red-500 text-white">{status}</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Solicitudes de Vacaciones</h2>
          <p className="mt-1 text-gray-600">Solicitar y gestionar tu tiempo libre</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando vacaciones...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Solicitudes de Vacaciones</h2>
          <p className="mt-1 text-gray-600">Solicitar y gestionar tu tiempo libre</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Error al cargar las vacaciones</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Solicitudes de Vacaciones</h2>
        <p className="mt-1 text-gray-600">Solicitar y gestionar tu tiempo libre</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle>Balance de Vacaciones</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Asignación Anual</p>
                <p className="font-bold">{vacationBalance.annualAllowance} días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Utilizados</p>
                <p className="font-bold">{vacationBalance.usedDays} días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Pendientes de Aprobación</p>
                <p className="font-bold">{vacationBalance.pendingDays} días</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="font-medium">Restantes</p>
                <p className={`font-bold ${company.colors.accent}`}>{vacationBalance.remainingDays} días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle>Solicitar Vacaciones</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <VacationRequestForm buttonColor={company.colors.button} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle>Historial de Vacaciones</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {vacations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tienes solicitudes de vacaciones</p>
              </div>
            ) : (
              <div className="space-y-4">
                {vacations.map((vacation) => (
                  <div key={vacation.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold">{vacation.vacationTypeName}</h3>
                        <p className="text-sm text-gray-600">
                          {vacation.dateRange} ({vacation.days} {vacation.days === 1 ? "día" : "días"} laborables)
                        </p>
                        <p className="text-xs text-gray-500">No se cuentan sábados ni domingos</p>
                      </div>
                      {getStatusBadge(vacation.status, vacation.originalStatus)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
