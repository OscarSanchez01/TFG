"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useMobile } from "../hooks/useMobile"
import { useCompanyTheme } from "../hooks/useCompanyTheme"
import { useNotifications } from "../hooks/useNotifications"
import { useProfile } from "../hooks/useProfile"
import { useToast } from "../hooks/useToast"
import { useSessionData } from "../hooks/useSessionData"
import { useCompanies } from "../hooks/useCompanies"

import Sidebar from "../components/dashboard/Sidebar"
import Header from "../components/dashboard/Header"
import NotificationPanel from "../components/dashboard/NotificationPanel"
import ProfilePanel from "../components/dashboard/ProfilePanel"

// Importar las pestañas
import Overview from "../components/dashboard/tabs/Overview"
import Schedule from "../components/dashboard/tabs/Schedule"
import Payslips from "../components/dashboard/tabs/Payslips"
import Vacation from "../components/dashboard/tabs/Vacation"
import Team from "../components/dashboard/tabs/Team"

// Importar los nuevos componentes de administrador al inicio del archivo:
import AdminSchedules from "../components/dashboard/tabs/AdminSchedules"
import AdminPayslips from "../components/dashboard/tabs/AdminPayslips"
import AdminVacations from "../components/dashboard/tabs/AdminVacations"
import AdminHiring from "../components/dashboard/tabs/AdminHiring"

// Datos de fallback para cuando no hay datos de usuario
const fallbackUserData = {
  name: "Usuario",
  position: "Employee",
  email: "",
  department: "General",
  avatar: "/placeholder.svg",
  notifications: 3,
}

export default function DashboardCompanyPage() {
  const { company: companyParam } = useParams()
  const { user } = useAuth()
  const isMobile = useMobile()
  const { userData: sessionUserData, companyData: sessionCompanyData, loading: sessionLoading } = useSessionData()
  const { companies, getCompanyByName } = useCompanies()

  // Obtener datos de la empresa desde la API si no están en sessionStorage
  const apiCompanyData = getCompanyByName(companyParam)
  const finalCompanyData = sessionCompanyData || apiCompanyData

  const company = useCompanyTheme(companyParam, finalCompanyData)
  const { toast } = useToast()

  // Estados
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Hooks personalizados
  const { notificationsOpen, toggleNotifications, setNotificationsOpen, notifications } = useNotifications()

  const { profileOpen, toggleProfile, setProfileOpen } = useProfile()

  // NUEVO: Detectar cambios en el usuario y recargar datos si es necesario
  useEffect(() => {
    // Verificar si hay un cambio de usuario comparando con sessionStorage
    const storedUser = sessionStorage.getItem("user")
    if (user && storedUser) {
      const parsedStoredUser = JSON.parse(storedUser)

      // Si el ID del usuario actual es diferente al almacenado, recargar
      if (parsedStoredUser.id !== user.id) {
        console.log("Detectado cambio de usuario, recargando datos...")
        window.location.reload()
      }
    }
  }, [user])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleProfileToggle = () => {
    toggleProfile(notificationsOpen, setNotificationsOpen)
  }

  // Guardar datos de la empresa en sessionStorage si los obtuvimos de la API
  useEffect(() => {
    if (apiCompanyData && !sessionCompanyData) {
      console.log("Saving company data to sessionStorage:", apiCompanyData)
      sessionStorage.setItem("companyData", JSON.stringify(apiCompanyData))
    }
  }, [apiCompanyData, sessionCompanyData])

  // Close mobile menu when switching to desktop view
  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false)
    }
  }, [isMobile, mobileMenuOpen])

  // Mostrar loading mientras cargamos los datos de sesión
  if (sessionLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${company.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-xl font-semibold text-gray-700">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  // Usar los datos de sesión si están disponibles, sino usar los datos del contexto de auth, sino usar fallback
  const employeeData = sessionUserData || user || fallbackUserData

  console.log("Final employee data being used:", employeeData)
  console.log("Final company data being used:", finalCompanyData)
  console.log("Company theme:", company)

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview company={company} employeeData={employeeData} />
      case "schedule":
        return <Schedule company={company} />
      case "payslips":
        return <Payslips company={company} />
      case "vacation":
        return <Vacation company={company} />
      case "team":
        return <Team company={company} />
      case "admin-schedules":
        return <AdminSchedules company={company} />
      case "admin-payslips":
        return <AdminPayslips company={company} />
      case "admin-vacations":
        return <AdminVacations company={company} />
      case "admin-hiring":
        return <AdminHiring company={company} />
      default:
        return <Overview company={company} employeeData={employeeData} />
    }
  }

  // Determinar si algún panel está abierto para aplicar el efecto de bloqueo
  const isPanelOpen = notificationsOpen || profileOpen

  return (
    <div className={`min-h-screen bg-gradient-to-b ${company.bgGradient} flex flex-col md:flex-row`}>
      <Sidebar
        company={company}
        employeeData={employeeData}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
      />

      {/* Main Content */}
      <div
        className={`flex flex-1 flex-col overflow-hidden ${
          isPanelOpen
            ? "opacity-50 pointer-events-none transition-opacity duration-300"
            : "transition-opacity duration-300"
        }`}
      >
        <Header
          company={company}
          employeeData={employeeData}
          notifications={notifications}
          toggleMobileMenu={toggleMobileMenu}
          toggleNotifications={toggleNotifications}
          toggleProfile={handleProfileToggle}
        />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 relative z-10">{renderActiveTab()}</main>
      </div>

      {/* Panels */}
      {notificationsOpen && (
        <NotificationPanel
          onClose={() => setNotificationsOpen(false)}
          accentColor={company.colors.accent}
          buttonColor={company.colors.button}
        />
      )}

      {profileOpen && (
        <ProfilePanel
          userData={employeeData}
          onClose={() => setProfileOpen(false)}
          accentColor={company.colors.accent}
          buttonColor={company.colors.button}
        />
      )}
    </div>
  )
}
