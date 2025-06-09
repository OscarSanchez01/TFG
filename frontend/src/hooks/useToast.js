"use client"

import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description }) => {
    const id = Date.now()
    const newToast = {
      id,
      title,
      description,
    }

    setToasts((prevToasts) => [...prevToasts, newToast])

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, 3000)
  }

  return { toast, toasts }
}
