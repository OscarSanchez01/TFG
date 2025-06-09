"use client"

import { useState, useRef, useEffect } from "react"
import { X, Upload, Camera } from "lucide-react"
import { Button } from "../ui/Button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar"
import { useProfileUpdate } from "../../hooks/useProfileUpdate"
import { useToast } from "../../hooks/useToast"

export default function ProfilePanel({ userData, onClose, accentColor, buttonColor }) {
  const [formData, setFormData] = useState({
    id: userData.id,
    name: userData.name || userData.nombre || "",
    email: userData.email || "",
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [originalData, setOriginalData] = useState({
    name: userData.name || userData.nombre || "",
    image: userData.image || null,
    imageUrl: userData.imageUrl || null,
  })
  const fileInputRef = useRef(null)
  const { updateProfile, loading } = useProfileUpdate()
  const { toast } = useToast()

  // Obtener la URL de la imagen del usuario
  const userImage = userData.imageUrl || (userData.image ? `http://localhost:8000/storage/${userData.image}` : null)

  // Actualizar formData cuando userData cambie
  useEffect(() => {
    const newData = {
      id: userData.id,
      name: userData.name || userData.nombre || "",
      email: userData.email || "",
    }
    setFormData(newData)
    setOriginalData({
      name: userData.name || userData.nombre || "",
      image: userData.image || null,
      imageUrl: userData.imageUrl || null,
    })
  }, [userData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageClick = () => {
    fileInputRef.current.click()
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Verificar qué cambios hay
    const hasNameChange = formData.name.trim() !== originalData.name.trim()
    const hasImageChange = imageFile !== null

    console.log("=== SUBMIT DEBUG ===")
    console.log("Original name:", `"${originalData.name}"`)
    console.log("New name:", `"${formData.name.trim()}"`)
    console.log("Has name change:", hasNameChange)
    console.log("Has image change:", hasImageChange)
    console.log("Image file:", imageFile)

    if (!hasNameChange && !hasImageChange) {
      toast({
        title: "Sin cambios",
        description: "No hay cambios para guardar",
      })
      return
    }

    // Mostrar qué se va a actualizar
    let updateMessage = "Actualizando "
    if (hasImageChange && hasNameChange) {
      updateMessage += "imagen y nombre..."
    } else if (hasImageChange) {
      updateMessage += "imagen..."
    } else if (hasNameChange) {
      updateMessage += "nombre..."
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
            {imageFile && <p className="text-xs text-green-600 mt-1">Nueva imagen seleccionada</p>}
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

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" className={buttonColor} disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
