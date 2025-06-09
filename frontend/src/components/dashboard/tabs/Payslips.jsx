"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PayslipCard from "../PayslipCard"
import { usePayslips } from "../../../hooks/usePayslips"

export default function Payslips({ company }) {
  const { payslips, loading, error, getYearlySummary } = usePayslips()
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3

  const yearlySummary = getYearlySummary()

  // Calcular el número total de páginas
  const totalPages = Math.ceil(payslips.length / itemsPerPage)

  // Obtener las nóminas de la página actual
  const getCurrentPagePayslips = () => {
    const startIndex = currentPage * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return payslips.slice(startIndex, endIndex)
  }

  // Funciones para navegar entre páginas
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Nóminas</h2>
          <p className="mt-1 text-gray-600">Ver y descargar tus nóminas</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando nóminas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Nóminas</h2>
          <p className="mt-1 text-gray-600">Ver y descargar tus nóminas</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-2">⚠️</div>
            <p className="text-red-600 font-medium">Error al cargar las nóminas</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Nóminas</h2>
        <p className="mt-1 text-gray-600">Ver y descargar tus nóminas</p>
      </div>

      {payslips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No tienes nóminas disponibles</p>
        </div>
      ) : (
        <>
          {/* Información de paginación */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-600">
              Mostrando {currentPage * itemsPerPage + 1} - {Math.min((currentPage + 1) * itemsPerPage, payslips.length)}{" "}
              de {payslips.length} nóminas
            </div>
            <div className="text-sm text-gray-600">
              Página {currentPage + 1} de {totalPages}
            </div>
          </div>

          {/* Grid de nóminas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {getCurrentPagePayslips().map((payslip) => (
              <PayslipCard
                key={payslip.id}
                payslip={payslip}
                accentColor={company.colors.accent}
                buttonColor={company.colors.button}
                headerColor={company.colors.cardHeader}
                headerTextColor={company.colors.cardHeaderText}
                bgColor={company.colors.cardBackground}
              />
            ))}
          </div>

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-8">
              {/* Botón anterior */}
              <Button
                variant="outline"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </Button>

              {/* Botón siguiente */}
              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center space-x-2"
              >
                <span>Siguiente</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Resumen anual */}
          <div className="mt-8">
            <Card bgColor={company.colors.cardBackground}>
              <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
                <CardTitle>Resumen Anual</CardTitle>
                <CardDescription className="text-gray-300">Año Fiscal 2025</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Salario Bruto</p>
                    <p className="font-bold">{yearlySummary.grossSalary}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Impuestos Pagados</p>
                    <p className="font-bold">{yearlySummary.taxPaid}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Contribuciones de Jubilación</p>
                    <p className="font-bold">{yearlySummary.retirementContributions}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">Salario Neto</p>
                    <p className={`font-bold ${company.colors.accent}`}>{yearlySummary.netSalary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
