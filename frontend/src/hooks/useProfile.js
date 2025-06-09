"use client"

import { useState } from "react"

const initialUserData = {
  name: "Alex Johnson",
  position: "Senior Developer",
  email: "alex.johnson@company.com",
  department: "Engineering",
  avatar: "/placeholder.svg?key=knw3b",
  notifications: 3,
  phone: "+34 600 123 456",
  address: "Calle Principal 123, Madrid, España",
  bio: "Desarrollador senior con más de 8 años de experiencia en desarrollo web y aplicaciones móviles. Especializado en React, TypeScript y Node.js.",
}

export function useProfile() {
  const [userData, setUserData] = useState(initialUserData)
  const [profileOpen, setProfileOpen] = useState(false)

  const toggleProfile = (notificationsOpen, setNotificationsOpen) => {
    if (notificationsOpen) {
      setNotificationsOpen(false)
    }
    setProfileOpen(!profileOpen)
  }

  const handleSaveProfile = (updatedData) => {
    setUserData({
      ...userData,
      ...updatedData,
    })
    return true
  }

  return {
    userData,
    profileOpen,
    toggleProfile,
    handleSaveProfile,
    setProfileOpen,
  }
}
