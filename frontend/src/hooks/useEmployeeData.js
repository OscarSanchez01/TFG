"use client"

import { useState, useEffect } from "react"

export function useEmployeeData(employeeId) {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!employeeId) {
      setLoading(false)
      return
    }

    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/empleados/${employeeId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch employee data")
        }

        const result = await response.json()
        console.log("Employee API response:", result)

        if (result.status === "success" && result.data) {
          // Si el empleado tiene una imagen, construir la URL completa
          if (result.data.image) {
            result.data.avatarUrl = `http://localhost:8000/storage/${result.data.image}`
          }

          setEmployee(result.data)

          // Guardar los datos del empleado en sessionStorage para uso posterior
          sessionStorage.setItem("employeeData", JSON.stringify(result.data))
        }
      } catch (err) {
        console.error("Error fetching employee data:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployee()
  }, [employeeId])

  return {
    employee,
    loading,
    error,
  }
}
