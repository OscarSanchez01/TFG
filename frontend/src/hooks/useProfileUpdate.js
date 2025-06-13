"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export function useProfileUpdate() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token, user, login } = useAuth()

  const updateProfile = async (userData, imageFile = null) => {
    if (!token) {
      console.log("No token available, cannot update profile")
      setError("No hay token de autenticación disponible")
      return { success: false, message: "No hay token de autenticación disponible" }
    }

    try {
      setLoading(true)
      setError(null)

      // Empezar con los datos actuales del usuario
      const finalUserData = { ...user }
      let updateSuccess = false
      const userId = userData.id || user.id

      console.log("=== PROFILE UPDATE START ===")
      console.log("User ID:", userId)
      console.log("Current user data:", user)
      console.log("Has image file:", !!imageFile)
      console.log("Form data:", userData)

      // 1. ACTUALIZAR IMAGEN (independiente)
      if (imageFile) {
        console.log("=== UPDATING IMAGE ===")
        try {
          const imageFormData = new FormData()
          imageFormData.append("image", imageFile)

          const imageResponse = await fetch(`http://localhost:8000/api/empleados/${userId}/upload-image`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            body: imageFormData,
          })

          if (!imageResponse.ok) {
            const errorText = await imageResponse.text()
            console.error("Image upload failed:", errorText)
            throw new Error(`Error al subir la imagen: ${imageResponse.status}`)
          }

          const imageResult = await imageResponse.json()
          console.log("Image upload result:", imageResult)

          if (imageResult.status === "success" && imageResult.data) {
            // Actualizar SOLO los campos de imagen
            finalUserData.image = imageResult.data.image
            finalUserData.imageUrl = `http://localhost:8000/storage/${imageResult.data.image}`

            // Mantener otros campos que puedan venir en la respuesta
            if (imageResult.data.name) finalUserData.name = imageResult.data.name
            if (imageResult.data.email) finalUserData.email = imageResult.data.email
            if (imageResult.data.id) finalUserData.id = imageResult.data.id

            updateSuccess = true
            console.log("✅ Image updated successfully")
            console.log("Updated image data:", {
              image: finalUserData.image,
              imageUrl: finalUserData.imageUrl,
            })
          }
        } catch (imageError) {
          console.error("❌ Image update failed:", imageError)
          throw new Error(`Error al actualizar la imagen: ${imageError.message}`)
        }
      }

      // 2. ACTUALIZAR NOMBRE (independiente)
      const currentName = user.name || ""
      const newName = userData.name?.trim() || ""

      if (newName && newName !== currentName) {
        console.log("=== UPDATING NAME ===")
        console.log("Current name:", `"${currentName}"`)
        console.log("New name:", `"${newName}"`)

        try {
          const nameResponse = await fetch(`http://localhost:8000/api/empleados/${userId}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ name: newName }),
          })

          if (!nameResponse.ok) {
            const errorText = await nameResponse.text()
            console.error("Name update failed:", errorText)
            throw new Error(`Error al actualizar el nombre: ${nameResponse.status}`)
          }

          const nameResult = await nameResponse.json()
          console.log("Name update result:", nameResult)

          if (nameResult.status === "success" && nameResult.data) {
            // Actualizar SOLO el nombre, manteniendo la imagen si ya se actualizó
            finalUserData.name = nameResult.data.name

            // Mantener otros campos que puedan venir en la respuesta
            if (nameResult.data.email) finalUserData.email = nameResult.data.email
            if (nameResult.data.id) finalUserData.id = nameResult.data.id

            // Si no se actualizó imagen en esta sesión, mantener la imagen existente
            if (!imageFile && nameResult.data.image) {
              finalUserData.image = nameResult.data.image
              finalUserData.imageUrl = `http://localhost:8000/storage/${nameResult.data.image}`
            }

            updateSuccess = true
            console.log("✅ Name updated successfully")
            console.log("Updated name:", finalUserData.name)
          }
        } catch (nameError) {
          console.error("❌ Name update failed:", nameError)
          throw new Error(`Error al actualizar el nombre: ${nameError.message}`)
        }
      }

      // 3. ACTUALIZAR CONTRASEÑA (si se proporciona)
      if (userData.currentPassword && userData.newPassword) {
        console.log("=== UPDATING PASSWORD ===")

        try {
          // Primero verificamos la contraseña actual (esto es una buena práctica aunque la API no lo requiera)
          // Nota: Como la API no tiene un endpoint específico para verificar la contraseña actual,
          // simplemente procedemos con la actualización

          // Usamos el mismo endpoint que para actualizar el nombre, pero con el campo password
          const passwordData = {
            password: userData.newPassword,
          }

          const passwordResponse = await fetch(`http://localhost:8000/api/empleados/${userId}`, {
            method: "PUT", // O PATCH, ambos funcionan según la documentación
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(passwordData),
          })

          if (!passwordResponse.ok) {
            const errorText = await passwordResponse.text()
            console.error("Password update failed:", errorText)
            throw new Error(`Error al actualizar la contraseña: ${passwordResponse.status}`)
          }

          const passwordResult = await passwordResponse.json()
          console.log("Password update result:", passwordResult)

          if (passwordResult.status === "success") {
            updateSuccess = true
            console.log("✅ Password updated successfully")

            // Actualizar datos del usuario si la respuesta incluye información actualizada
            if (passwordResult.data) {
              if (passwordResult.data.name) finalUserData.name = passwordResult.data.name
              if (passwordResult.data.email) finalUserData.email = passwordResult.data.email
              if (passwordResult.data.id) finalUserData.id = passwordResult.data.id
              if (passwordResult.data.image) {
                finalUserData.image = passwordResult.data.image
                finalUserData.imageUrl = `http://localhost:8000/storage/${passwordResult.data.image}`
              }
            }
          }
        } catch (passwordError) {
          console.error("❌ Password update failed:", passwordError)
          throw new Error(passwordError.message || "Error al actualizar la contraseña")
        }
      }

      // 4. VERIFICAR SI HUBO ALGUNA ACTUALIZACIÓN
      if (!updateSuccess) {
        console.log("⏭️ No changes to update")
        return { success: true, message: "No hay cambios para guardar", data: user }
      }

      // 5. ACTUALIZAR CONTEXTO Y STORAGE
      console.log("=== FINAL UPDATE ===")
      console.log("Final user data:", finalUserData)

      // Actualizar contexto de autenticación
      await login(token, finalUserData)

      // Actualizar sessionStorage
      sessionStorage.setItem("user", JSON.stringify(finalUserData))
      sessionStorage.setItem("userData", JSON.stringify(finalUserData))

      console.log("✅ Profile update completed successfully")
      return {
        success: true,
        message: "Perfil actualizado correctamente",
        data: finalUserData,
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err)
      setError(err.message || "Error al actualizar el perfil")
      return {
        success: false,
        message: err.message || "Error al actualizar el perfil",
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    updateProfile,
    loading,
    error,
  }
}
