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
      sessionStorage.removeItem("userData")
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
    console.log("Ejecutando logout desde AuthContext...")

    // Limpiar el estado del contexto
    setToken(null)
    setUser(null)

    // Función para limpiar completamente el sessionStorage
    const clearAllStorage = () => {
      try {
        // 1. Primero, sobrescribir con valores vacíos
        console.log("Sobrescribiendo valores en sessionStorage...")
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key) {
            sessionStorage.setItem(key, "")
          }
        }

        // 2. Eliminar elementos específicos que sabemos que existen
        console.log("Eliminando elementos específicos...")
        sessionStorage.removeItem("token")
        sessionStorage.removeItem("user")
        sessionStorage.removeItem("userData")
        sessionStorage.removeItem("companyData")

        // 3. Limpiar todo el sessionStorage
        console.log("Limpiando todo el sessionStorage...")
        sessionStorage.clear()

        // 4. Verificar que se haya limpiado
        const remainingItems = sessionStorage.length
        console.log(`Elementos restantes en sessionStorage: ${remainingItems}`)

        if (remainingItems > 0) {
          console.warn("Aún quedan elementos en sessionStorage después de limpiar")

          // Listar los elementos restantes
          for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i)
            console.warn(`- ${key}: ${sessionStorage.getItem(key)}`)
          }

          // Intentar un enfoque alternativo
          console.log("Intentando enfoque alternativo...")

          // Usar un iframe para limpiar el sessionStorage
          const iframe = document.createElement("iframe")
          iframe.style.display = "none"
          document.body.appendChild(iframe)
          iframe.contentWindow.sessionStorage.clear()
          document.body.removeChild(iframe)
        }
      } catch (e) {
        console.error("Error al limpiar sessionStorage:", e)
      }
    }

    // Ejecutar la limpieza
    clearAllStorage()

    // Verificar una última vez
    console.log("Verificación final - elementos en sessionStorage:", sessionStorage.length)

    // Forzar recarga completa de la página para asegurar un estado limpio
    console.log("Redirigiendo a la página de inicio...")

    // Usar replace en lugar de href para evitar que quede en el historial
    // y añadir un parámetro de timestamp para evitar caché
    window.location.replace("/?logout=" + new Date().getTime())
  }

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
