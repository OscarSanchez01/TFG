"use client"

import { useState } from "react"

export function useNotifications() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen)
  }

  return {
    notificationsOpen,
    toggleNotifications,
    setNotificationsOpen,
  }
}
