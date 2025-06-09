"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "../ui/Button"

export default function ScheduleCalendar({ accentColor }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  // Generar días del mes
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Ajustar para que la semana comience en lunes (0 = lunes, 6 = domingo)
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  const monthName = currentMonth.toLocaleString("default", { month: "long" })
  const year = currentMonth.getFullYear()

  // Generar calendario
  const calendar = []
  let day = 1

  // Ejemplo de datos de horario (simulados)
  const scheduleData = {}
  for (let i = 1; i <= daysInMonth; i++) {
    const random = Math.random()
    if (random < 0.7) {
      // 70% de probabilidad de tener un turno
      const isOffice = random < 0.4
      scheduleData[i] = {
        type: isOffice ? "office" : "remote",
        hours: isOffice ? "9:00 - 18:00" : "10:00 - 19:00",
      }
    }
  }

  // Crear filas del calendario
  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < adjustedFirstDay) {
        week.push(<td key={`empty-${j}`} className="p-1 border text-center"></td>)
      } else if (day > daysInMonth) {
        week.push(<td key={`empty-end-${j}`} className="p-1 border text-center"></td>)
      } else {
        const currentDay = day
        const daySchedule = scheduleData[currentDay]
        const isWeekend = j === 5 || j === 6 // Sábado o domingo

        week.push(
          <td key={day} className={`p-1 border text-center ${isWeekend ? "bg-gray-100" : ""}`}>
            <div className="flex flex-col h-16 sm:h-24">
              <span className={`text-sm ${isWeekend ? "text-gray-500" : ""}`}>{day}</span>
              {daySchedule && (
                <div
                  className={`mt-1 text-xs ${daySchedule.type === "office" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"} p-1 rounded`}
                >
                  <div>{daySchedule.type}</div>
                  <div>{daySchedule.hours}</div>
                </div>
              )}
            </div>
          </td>,
        )
        day++
      }
    }
    calendar.push(<tr key={`week-${i}`}>{week}</tr>)
    if (day > daysInMonth) break
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="sm" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">
          {monthName} {year}
        </h2>
        <Button variant="outline" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border text-center">Mon</th>
              <th className="p-2 border text-center">Tue</th>
              <th className="p-2 border text-center">Wed</th>
              <th className="p-2 border text-center">Thu</th>
              <th className="p-2 border text-center">Fri</th>
              <th className="p-2 border text-center bg-gray-100">Sat</th>
              <th className="p-2 border text-center bg-gray-100">Sun</th>
            </tr>
          </thead>
          <tbody>{calendar}</tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <div className="flex items-center mr-4">
          <div className="w-3 h-3 bg-blue-100 mr-1"></div>
          <span className="text-xs">Office</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-100 mr-1"></div>
          <span className="text-xs">Remote</span>
        </div>
      </div>
    </div>
  )
}
