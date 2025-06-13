"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Badge } from "../../ui/Badge"
import { Button } from "../../ui/Button"
import { Check, X, Clock } from "lucide-react"
import { useAdminVacations } from "../../../hooks/useAdminVacations"
import { useToast } from "../../../hooks/useToast"

export default function AdminVacations({ company }) {
  const { vacations, loading, error, updateVacationStatus } = useAdminVacations()
  const { toast } = useToast()

  const handleStatusUpdate = async (vacationId, newStatus) => {
    try {
      await updateVacationStatus(vacationId, newStatus)
      toast({
        title: "Estado actualizado",
        description: `La solicitud de vacaciones ha sido ${newStatus === "aprobada" ? "aprobada" : "rechazada"}`,
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
      case "aprobada":
        return <Badge className="bg-green-500 text-white">Aprobada</Badge>
      case "pendiente":
        return <Badge className="bg-yellow-500 text-white">Pendiente</Badge>
      case "rechazada":
        return <Badge className="bg-red-500 text-white">Rechazada</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const pendingVacations = vacations.filter((vacation) => vacation.status === "pendiente")
  const processedVacations = vacations.filter((vacation) => vacation.status !== "pendiente")

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Vacaciones</h2>
          <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de vacaciones</p>
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
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Vacaciones</h2>
          <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de vacaciones</p>
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
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Vacaciones</h2>
        <p className="mt-1 text-gray-600">Aprobar o rechazar solicitudes de vacaciones</p>
      </div>

      {/* Solicitudes Pendientes */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Solicitudes Pendientes ({pendingVacations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {pendingVacations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay solicitudes pendientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingVacations.map((vacation) => (
                <div key={vacation.id} className="rounded-lg border p-4 bg-yellow-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{vacation.employeeName}</h3>
                      <p className="text-sm text-gray-600">{vacation.employeeEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {vacation.dateRange} ({vacation.days} {vacation.days === 1 ? "día" : "días"} laborables)
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(vacation.status)}
                      <Button
                        size="sm"
                        className="bg-green-500 hover:bg-green-600 text-white"
                        onClick={() => handleStatusUpdate(vacation.id, "aprobada")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-white"
                        onClick={() => handleStatusUpdate(vacation.id, "rechazada")}
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
      {processedVacations.length > 0 && (
        <Card bgColor={company.colors.cardBackground}>
          <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
            <CardTitle>Solicitudes Procesadas ({processedVacations.length})</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {processedVacations.map((vacation) => (
                <div key={vacation.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{vacation.employeeName}</h3>
                      <p className="text-sm text-gray-600">{vacation.employeeEmail}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {vacation.dateRange} ({vacation.days} {vacation.days === 1 ? "día" : "días"} laborables)
                      </p>
                    </div>
                    {getStatusBadge(vacation.status)}
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
