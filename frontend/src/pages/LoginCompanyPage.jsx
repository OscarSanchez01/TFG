"use client"

import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export default function LoginCompanyPage() {
  const { company } = useParams()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [companyInfo, setCompanyInfo] = useState(null)
  const [error, setError] = useState(null)

  // Añadir al inicio del componente, después de los hooks existentes
  useEffect(() => {
    // Limpiar datos de usuario anteriores al cargar la página de login
    sessionStorage.removeItem("user")
    sessionStorage.removeItem("companyData")
  }, [])

  // Mapeo de nombres de empresa a dominios de email
  const companyDomains = {
    rmg: "@rmg",
    excon: "@excon",
    aridos: "@aridos",
  }

  // Dominio de administradores que puede acceder a cualquier empresa
  const adminDomain = "@empleado"

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/empresas`)
        const data = await res.json()
        const matched = data.data.find((e) => e.nombre.toLowerCase() === company.toLowerCase())
        setCompanyInfo(matched)
      } catch (err) {
        console.error("Error cargando empresa:", err)
      }
    }

    fetchCompany()
  }, [company])

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError(null)
    }
  }

  const validateEmailDomain = (email, companyName) => {
    const expectedDomain = companyDomains[companyName.toLowerCase()]

    if (!expectedDomain) {
      return { isValid: false, message: "Empresa no reconocida" }
    }

    // Verificar formato básico del email
    const emailParts = email.split("@")
    if (emailParts.length !== 2) {
      return { isValid: false, message: "Formato de email inválido" }
    }

    const domain = "@" + emailParts[1].toLowerCase()

    // ✅ PERMITIR ACCESO A ADMINISTRADORES (@empleado)
    if (domain.startsWith(adminDomain.toLowerCase())) {
      return { isValid: true, isAdmin: true }
    }

    // Verificar que el email contenga el dominio esperado para la empresa específica
    if (!email.toLowerCase().includes(expectedDomain.toLowerCase())) {
      return {
        isValid: false,
        message: `El correo debe contener el dominio ${expectedDomain} para acceder a ${companyName.toUpperCase()} o ${adminDomain} para administradores`,
      }
    }

    // Verificar que el dominio esté después del @
    const expectedDomainLower = expectedDomain.toLowerCase()

    if (!domain.startsWith(expectedDomainLower)) {
      return {
        isValid: false,
        message: `El correo debe tener el dominio ${expectedDomain} para acceder a ${companyName.toUpperCase()} o ${adminDomain} para administradores`,
      }
    }

    return { isValid: true, isAdmin: false }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validar dominio del email antes de enviar al servidor
    const emailValidation = validateEmailDomain(formData.email, company)
    if (!emailValidation.isValid) {
      setError(emailValidation.message)
      return
    }

    // Mostrar mensaje informativo si es administrador
    if (emailValidation.isAdmin) {
      console.log("🔑 Acceso de administrador detectado para:", formData.email)
    }

    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("🔄 Respuesta completa de la API:", data)

      if (!response.ok || data.status !== "success") {
        // Personalizar mensajes de error del servidor
        let errorMessage = data.message || "Credenciales incorrectas"

        if (data.message && data.message.toLowerCase().includes("email")) {
          errorMessage = "El email introducido no existe en el sistema"
        } else if (data.message && data.message.toLowerCase().includes("password")) {
          errorMessage = "La contraseña es incorrecta"
        } else if (data.message && data.message.toLowerCase().includes("credentials")) {
          errorMessage = "Email o contraseña incorrectos"
        }

        throw new Error(errorMessage)
      }

      const token = data.data.access_token
      const user = data.data.empleado

      await login(token, user)

      // Usar window.location para forzar una navegación completa
      setTimeout(() => {
        window.location.href = `/dashboard/${company}`
      }, 200)
    } catch (err) {
      console.error("❌ Error al hacer login:", err)
      setError(err.message)
    }
  }

  if (!companyInfo) return <div className="text-center mt-10">Accediendo ...</div>

  const bgColor =
    companyInfo.id_empresa === 1
      ? "from-yellow-100 to-white"
      : companyInfo.id_empresa === 2
        ? "from-blue-100 to-white"
        : "from-orange-100 to-white"

  // Obtener el dominio esperado para mostrar en el placeholder
  const expectedDomain = companyDomains[company.toLowerCase()] || "@empresa"

  return (
    <div className={`min-h-screen bg-gradient-to-b ${bgColor} py-10`}>
      <div className="container mx-auto max-w-md bg-white shadow-lg rounded-lg p-8 animate-fade-in">
        <button
          onClick={() => navigate("/SelectCompanyPage")}
          className="mb-6 flex items-center text-sm text-gray-500 hover:text-orange-500"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Volver a selección
        </button>

        <div className="text-center">
          <img
            src={`http://localhost:8000/storage/${companyInfo.imagen}`}
            alt={companyInfo.nombre}
            className="h-16 mx-auto mb-4 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Correo</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={`ejemplo${expectedDomain}.com`}
              className="w-full mt-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full mt-1 border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2 right-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded transition-transform duration-200"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  )
}
