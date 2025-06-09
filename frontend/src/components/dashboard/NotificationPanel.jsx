"use client"
import { X } from "lucide-react"
import { Button } from "../ui/Button"

export default function NotificationPanel({ onClose, accentColor, buttonColor }) {
  return (
    <div className="fixed right-0 top-0 z-50 h-screen w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-bold">Notifications</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-center p-6">
          <h3 className="text-xl font-semibold mb-2">Upcoming Feature</h3>
          <p className="text-gray-600">El sistema de notificaciones estará disponible próximamente.</p>
        </div>
      </div>
    </div>
  )
}

