"use client"

import { useMemo } from "react"

const companyThemes = {
  excon: {
    name: "EXCON",
    logo: "/excon-logo-black-orange.png",
    bgGradient: "from-yellow-100 to-white",
    colors: {
      primary: "bg-black",
      accent: "text-orange-500",
      button: "bg-orange-500 hover:bg-orange-600",
      border: "border-orange-500",
      background: "from-yellow-100 to-white",
      sidebar: "bg-yellow-800",
      sidebarText: "text-white",
      sidebarHover: "hover:bg-yellow-700",
      sidebarActive: "bg-yellow-700",
      cardHeader: "bg-yellow-700",
      cardHeaderText: "text-white",
      cardBackground: "bg-white",
      tabActive: "bg-orange-500 text-white",
      tabInactive: "text-yellow-700 hover:text-white",
    },
  },
  rmg: {
    name: "RMG",
    logo: "/rmg-logo-blue-orange.png",
    bgGradient: "from-blue-100 to-white",
    colors: {
      primary: "bg-blue-700",
      accent: "text-orange-500",
      button: "bg-orange-500 hover:bg-orange-600",
      border: "border-orange-500",
      background: "from-blue-100 to-white",
      sidebar: "bg-blue-800",
      sidebarText: "text-white",
      sidebarHover: "hover:bg-blue-700",
      sidebarActive: "bg-blue-700",
      cardHeader: "bg-blue-700",
      cardHeaderText: "text-white",
      cardBackground: "bg-white",
      tabActive: "bg-orange-500 text-white",
      tabInactive: "text-blue-200 hover:text-white",
    },
  },
  aridos: {
    name: "ARIDOS",
    logo: "/aridos-logo.png",
    bgGradient: "from-orange-100 to-white",
    colors: {
      primary: "bg-gray-700",
      accent: "text-orange-500",
      button: "bg-orange-500 hover:bg-orange-600",
      border: "border-orange-500",
      background: "from-orange-100 to-white",
      sidebar: "bg-orange-800",
      sidebarText: "text-white",
      sidebarHover: "hover:bg-orange-700",
      sidebarActive: "bg-orange-700",
      cardHeader: "bg-orange-700",
      cardHeaderText: "text-white",
      cardBackground: "bg-white",
      tabActive: "bg-orange-500 text-white",
      tabInactive: "text-orange-200 hover:text-white",
    },
  },
}

export function useCompanyTheme(companyName, companyData = null) {
  return useMemo(() => {
    // Obtener el tema base
    const baseTheme = companyThemes[companyName] || companyThemes.excon

    // Si tenemos datos de la empresa de la API, usar su logo
    if (companyData && companyData.imagen) {
      // Construir la URL completa de la imagen
      const imageUrl = `http://localhost:8000/storage/${companyData.imagen}`

      return {
        ...baseTheme,
        logo: imageUrl,
        name: companyData.nombre || baseTheme.name,
      }
    }

    return baseTheme
  }, [companyName, companyData])
}
