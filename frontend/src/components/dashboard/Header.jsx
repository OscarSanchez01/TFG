"use client"
import { Menu, Bell, Settings } from "lucide-react"
import { Button } from "../ui/Button"

export default function Header({
  company,
  employeeData,
  notifications,
  toggleMobileMenu,
  toggleNotifications,
  toggleProfile,
}) {
  // Obtener el nombre del empleado con fallback
  const employeeName = employeeData?.nombre || employeeData?.name || "Usuario"

  console.log("Header - Employee data:", {
    name: employeeName,
    hasImageField: !!employeeData?.image,
    hasImageUrl: !!employeeData?.imageUrl,
  })

  return (
    <header
      className={`flex h-16 items-center justify-between border-b ${company.colors.border} px-4 md:px-6 w-full overflow-hidden ${company.colors.cardBackground} shadow-sm`}
    >
      <div className="flex items-center overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className={`mr-2 ${company.colors.accent} lg:hidden flex-shrink-0`}
          onClick={toggleMobileMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className={`text-xl font-bold ${company.colors.accent} truncate`}>{company.name} PortalOne</h1>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className={company.colors.accent}
            onClick={toggleNotifications}
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500"></span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={company.colors.accent}
          onClick={toggleProfile}
          aria-label="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
