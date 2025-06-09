"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem("user")
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => sessionStorage.getItem("token"))

  const login = async (token, userData) => {
    try {
      // Limpiar datos anteriores primero
      setToken(null)
      setUser(null)
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("user")
      sessionStorage.removeItem("companyData")

      // Si el userData no tiene el campo image, intentar obtener los datos completos
      if (userData && userData.id && !userData.image) {
        console.log("User data missing image field, fetching complete data...")

        const response = await fetch(`http://localhost:8000/api/empleados/${userData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const result = await response.json()
          console.log("Complete user data from API:", result)

          if (result.status === "success" && result.data) {
            // Combinar los datos originales con los datos completos de la API
            userData = {
              ...userData,
              ...result.data,
            }
            console.log("Updated user data with image:", userData)
          }
        } else {
          console.warn("Failed to fetch complete user data, using original data")
        }
      }

      // Establecer nuevos datos con un pequeño delay para asegurar el re-render
      setTimeout(() => {
        setToken(token)
        setUser(userData)
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(userData))
      }, 100)

      console.log("User logged in with data:", userData)
    } catch (error) {
      console.error("Error during login process:", error)
      // En caso de error, usar los datos originales
      setTimeout(() => {
        setToken(token)
        setUser(userData)
        sessionStorage.setItem("token", token)
        sessionStorage.setItem("user", JSON.stringify(userData))
      }, 100)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.clear() // Limpiar todo el sessionStorage

    // Forzar recarga de la página para limpiar cualquier estado residual
    setTimeout(() => {
      window.location.href = "/"
    }, 100)
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
