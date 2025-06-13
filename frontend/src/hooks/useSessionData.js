"use client"

import { useState, useEffect } from "react"

export function useSessionData() {
  const [userData, setUserData] = useState(null)
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Intentar leer diferentes posibles claves para los datos del usuario
      const userDataString = sessionStorage.getItem("user")
      const userDataAltString = sessionStorage.getItem("userData")
      const companyDataString = sessionStorage.getItem("companyData")

      // Usar la clave que tenga datos
      const finalUserDataString = userDataString || userDataAltString

      if (finalUserDataString) {
        const parsedUserData = JSON.parse(finalUserDataString)

        // Si el usuario tiene una imagen, construir la URL completa
        if (parsedUserData.image) {
          parsedUserData.imageUrl = `http://localhost:8000/storage/${parsedUserData.image}`
        }

        setUserData(parsedUserData)
      }

      if (companyDataString) {
        const parsedCompanyData = JSON.parse(companyDataString)
        setCompanyData(parsedCompanyData)
      }
    } catch (error) {
      console.error("Error parsing session data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    userData,
    companyData,
    loading,
  }
}
