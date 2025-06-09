"use client"
import { useNavigate } from "react-router-dom"
import { Home, Calendar, CreditCard, FileText, Users, LogOut, UserPlus } from "lucide-react"
import { Button } from "../ui/Button"
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar"
import { useToast } from "../../hooks/useToast"
import { useAdminAuth } from "../../hooks/useAdminAuth"

export default function Sidebar({
  company,
  employeeData,
  activeTab,
  setActiveTab,
  isMobile,
  mobileMenuOpen,
  toggleMobileMenu,
}) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { isAdmin } = useAdminAuth()

  const handleLogout = () => {
    // Limpiar sessionStorage al hacer logout
    sessionStorage.removeItem("userData")
    sessionStorage.removeItem("companyData")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
    navigate("/")
  }

  // Obtener el nombre del empleado con fallback
  const employeeName = employeeData?.nombre || employeeData?.name || "Usuario"
  const employeePosition = employeeData?.rol || employeeData?.position || "Employee"

  // Obtener la imagen del empleado
  let employeeImage = "/placeholder.svg?height=40&width=40"

  if (employeeData?.imageUrl) {
    employeeImage = employeeData.imageUrl
  } else if (employeeData?.image) {
    employeeImage = `http://localhost:8000/storage/${employeeData.image}`
  }

  console.log("Sidebar - Employee data:", {
    name: employeeName,
    position: employeePosition,
    image: employeeImage,
    hasImageField: !!employeeData?.image,
    hasImageUrl: !!employeeData?.imageUrl,
  })

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col min-h-screen ${company.colors.sidebar} ${company.colors.sidebarText}`}
      >
        <div className="flex h-16 items-center justify-start border-b border-gray-700 px-4">
          <img src={company.logo || "/placeholder.svg"} alt={`${company.name} logo`} className="h-8 w-auto" />
        </div>
        <div className="flex flex-col p-4 flex-grow">
          <div className="mb-6 flex items-center space-x-3 rounded-lg p-3">
            <Avatar>
              <AvatarImage src={employeeImage || "/placeholder.svg"} alt={employeeName} />
              <AvatarFallback>{employeeName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{employeeName}</p>
              <p className="text-sm opacity-70">{employeePosition}</p>
            </div>
          </div>
          <nav className="space-y-1 flex-grow">
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                activeTab === "overview" ? company.colors.sidebarActive : ""
              }`}
              onClick={() => setActiveTab("overview")}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                activeTab === "schedule" ? company.colors.sidebarActive : ""
              }`}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Horario
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                activeTab === "payslips" ? company.colors.sidebarActive : ""
              }`}
              onClick={() => setActiveTab("payslips")}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Nóminas
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                activeTab === "vacation" ? company.colors.sidebarActive : ""
              }`}
              onClick={() => setActiveTab("vacation")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Vacaciones
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                activeTab === "team" ? company.colors.sidebarActive : ""
              }`}
              onClick={() => setActiveTab("team")}
            >
              <Users className="mr-2 h-4 w-4" />
              Horario General
            </Button>
            {isAdmin && (
              <>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="text-xs text-gray-400 uppercase tracking-wider px-3 py-2">Administración</div>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                    activeTab === "admin-schedules" ? company.colors.sidebarActive : ""
                  }`}
                  onClick={() => setActiveTab("admin-schedules")}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Aprobar Horarios
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                    activeTab === "admin-payslips" ? company.colors.sidebarActive : ""
                  }`}
                  onClick={() => setActiveTab("admin-payslips")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Subir Nóminas
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                    activeTab === "admin-vacations" ? company.colors.sidebarActive : ""
                  }`}
                  onClick={() => setActiveTab("admin-vacations")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Aprobar Vacaciones
                </Button>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                    activeTab === "admin-hiring" ? company.colors.sidebarActive : ""
                  }`}
                  onClick={() => setActiveTab("admin-hiring")}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Contratar
                </Button>
              </>
            )}
            <div className="border-t border-gray-700 my-2"></div>
            <Button
              variant="ghost"
              className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover}`}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={toggleMobileMenu} />
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 ${company.colors.sidebar} ${company.colors.sidebarText} lg:hidden min-h-screen`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-700 px-4">
            <img
              src={company.logo || "/placeholder.svg"}
              alt={`${company.name} logo`}
              width={120}
              height={30}
              className="h-8 w-auto"
            />
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="text-white">
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          </div>
          <div className="flex h-[calc(100%-4rem)] flex-col p-4">
            <div className="mb-6 flex items-center space-x-3 rounded-lg p-3">
              <Avatar>
                <AvatarImage src={employeeImage || "/placeholder.svg"} alt={employeeName} />
                <AvatarFallback>{employeeName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{employeeName}</p>
                <p className="text-sm opacity-70">{employeePosition}</p>
              </div>
            </div>
            <nav className="space-y-1 flex-grow">
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                  activeTab === "overview" ? company.colors.sidebarActive : ""
                }`}
                onClick={() => {
                  setActiveTab("overview")
                  toggleMobileMenu()
                }}
              >
                <Home className="mr-2 h-4 w-4" />
                Overview
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                  activeTab === "schedule" ? company.colors.sidebarActive : ""
                }`}
                onClick={() => {
                  setActiveTab("schedule")
                  toggleMobileMenu()
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Schedule
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                  activeTab === "payslips" ? company.colors.sidebarActive : ""
                }`}
                onClick={() => {
                  setActiveTab("payslips")
                  toggleMobileMenu()
                }}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                Payslips
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                  activeTab === "vacation" ? company.colors.sidebarActive : ""
                }`}
                onClick={() => {
                  setActiveTab("vacation")
                  toggleMobileMenu()
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Vacation Requests
              </Button>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                  activeTab === "team" ? company.colors.sidebarActive : ""
                }`}
                onClick={() => {
                  setActiveTab("team")
                  toggleMobileMenu()
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Team Schedule
              </Button>
              {isAdmin && (
                <>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider px-3 py-2">Administración</div>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                      activeTab === "admin-schedules" ? company.colors.sidebarActive : ""
                    }`}
                    onClick={() => {
                      setActiveTab("admin-schedules")
                      toggleMobileMenu()
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Aprobar Horarios
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                      activeTab === "admin-payslips" ? company.colors.sidebarActive : ""
                    }`}
                    onClick={() => {
                      setActiveTab("admin-payslips")
                      toggleMobileMenu()
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subir Nóminas
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                      activeTab === "admin-vacations" ? company.colors.sidebarActive : ""
                    }`}
                    onClick={() => {
                      setActiveTab("admin-vacations")
                      toggleMobileMenu()
                    }}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Aprobar Vacaciones
                  </Button>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover} ${
                      activeTab === "admin-hiring" ? company.colors.sidebarActive : ""
                    }`}
                    onClick={() => {
                      setActiveTab("admin-hiring")
                      toggleMobileMenu()
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Contratar
                  </Button>
                </>
              )}
              <div className="border-t border-gray-700 my-2"></div>
              <Button
                variant="ghost"
                className={`w-full justify-start text-white hover:text-white ${company.colors.sidebarHover}`}
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
