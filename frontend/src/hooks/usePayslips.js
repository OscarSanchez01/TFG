"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSessionData } from "./useSessionData"

export function usePayslips() {
  const [payslips, setPayslips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { token } = useAuth()
  const { userData } = useSessionData()

  useEffect(() => {
    const fetchPayslips = async () => {
      if (!token) {
        console.log("No token available, cannot fetch payslips")
        setPayslips([])
        setLoading(false)
        setError("No hay token de autenticación disponible")
        return
      }

      if (!userData || !userData.id) {
        console.log("No user data available")
        setPayslips([])
        setLoading(false)
        setError("No hay datos de usuario disponibles")
        return
      }

      try {
        console.log("Fetching payslips from API...")
        setLoading(true)
        setError(null)

        const response = await fetch("http://localhost:8000/api/nominas", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })

        console.log("Payslips API Response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Server error response:", errorText)
          throw new Error(`Error del servidor: ${response.status}`)
        }

        const result = await response.json()
        console.log("Payslips API response:", result)

        if (result.status === "success" && result.data && Array.isArray(result.data)) {
          // Filtrar solo las nóminas del usuario actual
          const currentUserId = userData.id
          console.log("Current user ID:", currentUserId)

          const userPayslips = result.data.filter((payslip) => {
            const payslipEmployeeId = payslip.id_empleado
            return Number.parseInt(payslipEmployeeId) === Number.parseInt(currentUserId)
          })

          console.log("Filtered user payslips:", userPayslips)

          // Transformar los datos al formato esperado por el componente
          const transformedPayslips = userPayslips.map((payslip) => {
            const payslipDate = new Date(payslip.fecha)
            const currentDate = new Date()

            // Calcular si han pasado 2 días desde la fecha de la nómina
            const daysDifference = Math.floor((currentDate - payslipDate) / (1000 * 60 * 60 * 24))
            const status = daysDifference >= 2 ? "Cobrada" : "Pendiente"

            // Formatear la fecha
            const formattedDate = payslipDate.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })

            // Formatear el período (mes y año)
            const period = payslipDate.toLocaleDateString("es-ES", {
              month: "long",
              year: "numeric",
            })

            return {
              id: payslip.id_nomina,
              period: period.charAt(0).toUpperCase() + period.slice(1), // Capitalizar primera letra
              amount: `€${Number.parseFloat(payslip.salario_neto).toFixed(2)}`,
              grossAmount: `€${Number.parseFloat(payslip.salario_bruto).toFixed(2)}`,
              date: formattedDate,
              status: status,
              archivo_pdf: payslip.archivo_pdf,
              originalDate: payslip.fecha,
            }
          })

          // Ordenar por fecha (más reciente primero)
          transformedPayslips.sort((a, b) => new Date(b.originalDate) - new Date(a.originalDate))

          setPayslips(transformedPayslips)
          console.log("Transformed payslips:", transformedPayslips)
        } else {
          console.log("No valid data in response")
          setPayslips([])
          setError("No se recibieron datos válidos del servidor")
        }
      } catch (err) {
        console.error("Error fetching payslips:", err)
        setError("Error al obtener las nóminas.")
        setPayslips([])
      } finally {
        setLoading(false)
      }
    }

    fetchPayslips()
  }, [token, userData])

  // Función para calcular el resumen anual
  const getYearlySummary = () => {
    const currentYear = new Date().getFullYear()
    const yearlyPayslips = payslips.filter((payslip) => {
      const payslipYear = new Date(payslip.originalDate).getFullYear()
      return payslipYear === currentYear
    })

    const totalGross = yearlyPayslips.reduce((total, payslip) => {
      return total + Number.parseFloat(payslip.grossAmount.replace("€", ""))
    }, 0)

    const totalNet = yearlyPayslips.reduce((total, payslip) => {
      return total + Number.parseFloat(payslip.amount.replace("€", ""))
    }, 0)

    const totalTax = totalGross - totalNet
    const retirementContributions = totalGross * 0.1 // Estimado 10%

    return {
      grossSalary: `€${totalGross.toFixed(2)}`,
      taxPaid: `€${totalTax.toFixed(2)}`,
      retirementContributions: `€${retirementContributions.toFixed(2)}`,
      netSalary: `€${totalNet.toFixed(2)}`,
    }
  }

  return {
    payslips,
    loading,
    error,
    getYearlySummary,
  }
}
