"use client"

import { useState, useEffect } from "react"

export function useCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/empresas/")

        if (!response.ok) {
          throw new Error("Failed to fetch companies")
        }

        const result = await response.json()
        console.log("Companies API response:", result)

        if (result.status === "success" && result.data) {
          setCompanies(result.data)

          // Guardar las empresas en sessionStorage para uso posterior
          sessionStorage.setItem("companiesData", JSON.stringify(result.data))
        }
      } catch (err) {
        console.error("Error fetching companies:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCompanies()
  }, [])

  const getCompanyByName = (companyName) => {
    return companies.find((company) => company.nombre.toLowerCase() === companyName.toLowerCase())
  }

  const getCompanyById = (companyId) => {
    return companies.find((company) => company.id_empresa === companyId)
  }

  return {
    companies,
    loading,
    error,
    getCompanyByName,
    getCompanyById,
  }
}
