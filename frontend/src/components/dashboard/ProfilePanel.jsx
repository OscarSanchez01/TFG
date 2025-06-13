"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Camera, AlertCircle } from "lucide-react"
import { Button } from "../ui/Button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar"
import { useProfileUpdate } from "../../hooks/useProfileUpdate"
import { useToast } from "../../hooks/useToast"

export default function ProfilePanel({ userData, onClose, accentColor, buttonColor }) {
  // Actualizar el estado inicial para incluir campos de contraseña
  const [formData, setFormData] = useState({
    id: userData.id,
    name: userData.name || userData.nombre || "",
    email: userData.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState(null)
  const [imageSize, setImageSize] = useState(null)
  const [originalData, setOriginalData] = useState({
    name: userData.name || userData.nombre || "",
    image: userData.image || null,
    imageUrl: userData.imageUrl || null,
  })
  const fileInputRef = useRef(null)
  const { updateProfile, loading } = useProfileUpdate()
  const { toast } = useToast()

  // Constante para el tamaño máximo de imagen (2MB en bytes)
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024 // 2MB

  // Añadir estados para validación de contraseña
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    symbol: false,
    match: false,
  })

  // Añadir estado para mostrar/ocultar validaciones
  const [showPasswordValidation, setShowPasswordValidation] = useState(false)

  // Obtener la URL de la imagen del usuario
  const userImage = userData.imageUrl || (userData.image ? `http://localhost:8000/storage/${userData.image}` : null)

  // Actualizar formData cuando userData cambie
  useEffect(() => {
    const newData = {
      id: userData.id,
      name: userData.name || userData.nombre || "",
      email: userData.email || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }
    setFormData(newData)
    setOriginalData({
      name: userData.name || userData.nombre || "",
      image: userData.image || null,
      imageUrl: userData.imageUrl || null,
    })
  }, [userData])

  // Añadir función para validar contraseña
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      match: password === formData.confirmPassword,
    }
    setPasswordValidation(validations)
    return Object.values(validations).every(Boolean)
  }

  // Modificar la función handleChange para validar contraseñas
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validar contraseña cuando cambia
    if (name === "newPassword") {
      validatePassword(value)
      setShowPasswordValidation(true)
    }

    // Verificar coincidencia cuando cambia la confirmación
    if (name === "confirmPassword") {
      setPasswordValidation((prev) => ({
        ...prev,
        match: value === formData.newPassword,
      }))
    }
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  // Función para formatear el tamaño en MB
  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    // Limpiar estados previos
    setImageError(null)
    setImageSize(null)

    if (file) {
      // Validar el tamaño de la imagen
      if (file.size > MAX_IMAGE_SIZE) {
        const fileSizeMB = formatSize(file.size)
        const maxSizeMB = formatSize(MAX_IMAGE_SIZE)

        setImageError(`La imagen es demasiado grande (${fileSizeMB}). El tamaño máximo permitido es ${maxSizeMB}.`)
        setImageSize(file.size)

        // No establecer el archivo ni la vista previa si es demasiado grande
        return
      }

      // Si el tamaño es válido, continuar con el procesamiento
      setImageFile(file)
      setImageSize(file.size)

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      console.log(`Imagen seleccionada: ${file.name}, Tamaño: ${formatSize(file.size)}`)
    }
  }

  // Modificar handleSubmit para incluir cambio de contraseña
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificar si hay error de imagen
    if (imageError) {
      toast({
        title: "Error",
        description: imageError,
      })
      return
    }

    // Verificar qué cambios hay
    const hasNameChange = formData.name.trim() !== originalData.name.trim()
    const hasImageChange = imageFile !== null
    const hasPasswordChange = formData.newPassword.trim() !== ""

    console.log("=== SUBMIT DEBUG ===")
    console.log("Original name:", `"${originalData.name}"`)
    console.log("New name:", `"${formData.name.trim()}"`)
    console.log("Has name change:", hasNameChange)
    console.log("Has image change:", hasImageChange)
    console.log("Has password change:", hasPasswordChange)
    console.log("Image file:", imageFile)
    if (imageFile) {
      console.log("Image size:", formatSize(imageFile.size))
    }

    if (!hasNameChange && !hasImageChange && !hasPasswordChange) {
      toast({
        title: "Sin cambios",
        description: "No hay cambios para guardar",
      })
      return
    }

    // Validar contraseña si se está cambiando
    if (hasPasswordChange) {
      if (!formData.currentPassword) {
        toast({
          title: "Error",
          description: "Debes ingresar tu contraseña actual",
        })
        return
      }

      if (!validatePassword(formData.newPassword)) {
        toast({
          title: "Error",
          description: "La nueva contraseña no cumple con los requisitos",
        })
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
        })
        return
      }
    }

    // Mostrar qué se va a actualizar
    let updateMessage = "Actualizando "
    if (hasImageChange && hasNameChange && hasPasswordChange) {
      updateMessage += "imagen, nombre y contraseña..."
    } else if (hasImageChange && hasNameChange) {
      updateMessage += "imagen y nombre..."
    } else if (hasImageChange && hasPasswordChange) {
      updateMessage += "imagen y contraseña..."
    } else if (hasNameChange && hasPasswordChange) {
      updateMessage += "nombre y contraseña..."
    } else if (hasImageChange) {
      updateMessage += "imagen..."
    } else if (hasNameChange) {
      updateMessage += "nombre..."
    } else if (hasPasswordChange) {
      updateMessage += "contraseña..."
    }

    console.log(updateMessage)

    const result = await updateProfile(formData, imageFile)

    if (result.success) {
      toast({
        title: "Perfil actualizado",
        description: "Los cambios han sido guardados correctamente",
      })

      // Cerrar el panel
      onClose()

      // Recargar la página para mostrar los cambios
      setTimeout(() => {
        console.log("Reloading page to show changes...")
        window.location.reload()
      }, 300)
    } else {
      toast({
        title: "Error",
        description: result.message,
      })
    }
  }

  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-bold">Configuración de Perfil</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="overflow-auto h-[calc(100vh-80px)] p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group cursor-pointer" onClick={handleImageClick}>
              <Avatar className="h-24 w-24">
                {imagePreview ? (
                  <AvatarImage src={imagePreview || "/placeholder.svg"} alt={formData.name} className="object-cover" />
                ) : userImage ? (
                  <AvatarImage src={userImage || "/placeholder.svg"} alt={formData.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="text-2xl">{formData.name.charAt(0)}</AvatarFallback>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </Avatar>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
            <button
              type="button"
              onClick={handleImageClick}
              className={`mt-2 text-sm ${accentColor} hover:underline flex items-center`}
            >
              <Upload className="h-3 w-3 mr-1" />
              {imageFile ? "Cambiar imagen seleccionada" : "Cambiar foto"}
            </button>

            {imageFile && !imageError && (
              <p className="text-xs text-green-600 mt-1">Nueva imagen seleccionada ({formatSize(imageSize)})</p>
            )}

            {imageError && (
              <div className="mt-2 text-xs text-red-500 flex items-start">
                <AlertCircle className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                <span>{imageError}</span>
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">El tamaño máximo permitido es 2 MB.</p>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 p-2 border"
            />
            <p className="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
          </div>

          {/* Sección de cambio de contraseña */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Cambiar contraseña</h3>

            <div className="space-y-3">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Contraseña actual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Nueva contraseña
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordValidation(true)}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    formData.newPassword && !Object.values(passwordValidation).every(Boolean)
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
              </div>

              {showPasswordValidation && (
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-xs font-medium text-gray-700 mb-1">La contraseña debe tener:</p>
                  <ul className="space-y-1 text-xs">
                    <li
                      className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-gray-500"}`}
                    >
                      {passwordValidation.length ? "✓" : "○"} Al menos 8 caracteres
                    </li>
                    <li
                      className={`flex items-center ${passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      {passwordValidation.uppercase ? "✓" : "○"} Al menos una mayúscula (A-Z)
                    </li>
                    <li
                      className={`flex items-center ${passwordValidation.lowercase ? "text-green-600" : "text-gray-500"}`}
                    >
                      {passwordValidation.lowercase ? "✓" : "○"} Al menos una minúscula (a-z)
                    </li>
                    <li
                      className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-gray-500"}`}
                    >
                      {passwordValidation.number ? "✓" : "○"} Al menos un número (0-9)
                    </li>
                    <li
                      className={`flex items-center ${passwordValidation.symbol ? "text-green-600" : "text-gray-500"}`}
                    >
                      {passwordValidation.symbol ? "✓" : "○"} Al menos un símbolo (!@#$%^&*...)
                    </li>
                  </ul>
                </div>
              )}

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar nueva contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm p-2 border ${
                    formData.confirmPassword && !passwordValidation.match
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {formData.confirmPassword && !passwordValidation.match && (
                  <p className="mt-1 text-xs text-red-500">Las contraseñas no coinciden</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" className={buttonColor} disabled={loading || imageError}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

