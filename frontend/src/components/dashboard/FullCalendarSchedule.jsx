"use client"

import { useEffect, useRef } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"
import { useVacations } from "../../hooks/useVacations"

export default function FullCalendarSchedule({ schedules, company, loading, error }) {
  const calendarRef = useRef(null)
  const calendarInstance = useRef(null)
  const { vacations, loading: vacationsLoading } = useVacations()

  // Convertir los horarios de la API al formato de FullCalendar
  const convertSchedulesToEvents = (schedules) => {
    return schedules.map((schedule) => {
      const date = schedule.fecha.split("T")[0] // Obtener solo la fecha YYYY-MM-DD
      const startDateTime = `${date}T${schedule.hora_inicio}:00`
      const endDateTime = `${date}T${schedule.hora_fin}:00`

      return {
        id: `schedule-${schedule.id_horario}`,
        title: "Jornada Laboral",
        start: startDateTime,
        end: endDateTime,
        description: `Horario: ${schedule.hora_inicio} - ${schedule.hora_fin}`,
        className: "fc-event-schedule",
        backgroundColor: company.colors.accent.includes("orange") ? "#f97316" : "#3b82f6",
        borderColor: company.colors.accent.includes("orange") ? "#ea580c" : "#2563eb",
        textColor: "#ffffff",
        extendedProps: {
          type: "schedule",
          empleado: schedule.empleado,
          horaInicio: schedule.hora_inicio,
          horaFin: schedule.hora_fin,
        },
      }
    })
  }

  // Actualizar la función que convierte las vacaciones a eventos para mostrar solo días laborables
  const convertVacationsToEvents = (vacations) => {
    return vacations.map((vacation) => {
      const startDate = vacation.startDate.split("T")[0] // Solo la fecha
      const endDate = vacation.endDate.split("T")[0]

      // Calcular la fecha de fin para FullCalendar (debe ser el día siguiente)
      const endDateForCalendar = new Date(endDate)
      endDateForCalendar.setDate(endDateForCalendar.getDate() + 1)
      const formattedEndDate = endDateForCalendar.toISOString().split("T")[0]

      // Colores según el estado
      let backgroundColor, borderColor
      switch (vacation.originalStatus) {
        case "aprobada":
          backgroundColor = "#10b981" // Verde
          borderColor = "#059669"
          break
        case "pendiente":
          backgroundColor = "#6b7280" // Gris
          borderColor = "#4b5563"
          break
        case "rechazada":
          backgroundColor = "#ef4444" // Rojo
          borderColor = "#dc2626"
          break
        default:
          backgroundColor = "#6b7280"
          borderColor = "#4b5563"
      }

      return {
        id: `vacation-${vacation.id}`,
        title: `Vacaciones (${vacation.status})`,
        start: startDate,
        end: formattedEndDate,
        allDay: true,
        className: "fc-event-vacation",
        backgroundColor,
        borderColor,
        textColor: "#ffffff",
        extendedProps: {
          type: "vacation",
          status: vacation.status,
          originalStatus: vacation.originalStatus,
          days: vacation.days,
          dateRange: vacation.dateRange,
          workingDaysOnly: true, // Indicar que solo se cuentan días laborables
        },
      }
    })
  }

  useEffect(() => {
    if (!calendarRef.current) return

    // Destruir calendario anterior si existe
    if (calendarInstance.current) {
      calendarInstance.current.destroy()
    }

    // Combinar eventos de horarios y vacaciones
    const scheduleEvents = loading || error ? [] : convertSchedulesToEvents(schedules)
    const vacationEvents = vacationsLoading ? [] : convertVacationsToEvents(vacations)
    const allEvents = [...scheduleEvents, ...vacationEvents]

    // Crear nuevo calendario
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      locale: esLocale,
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      buttonText: {
        today: "Hoy",
        month: "Mes",
        week: "Semana",
        day: "Día",
        list: "Lista",
      },
      height: 700,
      contentHeight: 650,
      aspectRatio: 2.5,
      nowIndicator: true,
      views: {
        dayGridMonth: { buttonText: "Mes" },
        timeGridWeek: { buttonText: "Semana" },
        timeGridDay: { buttonText: "Día" },
        listMonth: { buttonText: "Lista" },
      },
      initialView: "dayGridMonth",
      editable: false,
      dayMaxEvents: true,
      navLinks: true,
      weekends: true,
      businessHours: {
        daysOfWeek: [1, 2, 3, 4, 5], // Lunes a Viernes
        startTime: "09:00",
        endTime: "18:00",
      },
      events: allEvents,
      eventContent: (info) => {
        // Personalizar el contenido del evento según el tipo
        if (info.event.extendedProps.type === "vacation") {
          return {
            html: `
              <div class="fc-event-main-frame">
                <div class="fc-event-title-container">
                  <div class="fc-event-title fc-sticky">
                    ${info.event.title}
                  </div>
                </div>
                <div class="fc-event-time">
                  ${info.event.extendedProps.days} ${info.event.extendedProps.days === 1 ? "día" : "días"} laborables
                </div>
              </div>
            `,
          }
        } else {
          return {
            html: `
              <div class="fc-event-main-frame">
                <div class="fc-event-title-container">
                  <div class="fc-event-title fc-sticky">
                    ${info.event.title}
                  </div>
                </div>
                <div class="fc-event-time">
                  ${info.event.extendedProps.horaInicio} - ${info.event.extendedProps.horaFin}
                </div>
              </div>
            `,
          }
        }
      },
      eventClick: (info) => {
        // Manejar click en evento
        const event = info.event
        if (event.extendedProps.type === "vacation") {
          alert(
            `Vacaciones: ${event.extendedProps.dateRange}\n` +
              `Estado: ${event.extendedProps.status}\n` +
              `Duración: ${event.extendedProps.days} ${event.extendedProps.days === 1 ? "día" : "días"} laborables\n` +
              `(No se cuentan sábados ni domingos)`,
          )
        } else {
          alert(
            `Horario: ${event.title}\n` +
              `Fecha: ${event.start.toLocaleDateString("es-ES")}\n` +
              `Hora: ${event.extendedProps.horaInicio} - ${event.extendedProps.horaFin}`,
          )
        }
      },
      dateClick: (info) => {
        // Manejar click en fecha
        console.log("Fecha clickeada:", info.dateStr)
      },
      eventDidMount: (info) => {
        // Agregar tooltip
        const tooltipText =
          info.event.extendedProps.type === "vacation"
            ? `Vacaciones: ${info.event.extendedProps.dateRange} (${info.event.extendedProps.status})`
            : info.event.extendedProps.description || ""

        info.el.setAttribute("title", tooltipText)
      },
    })

    calendar.render()
    calendarInstance.current = calendar

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy()
      }
    }
  }, [schedules, vacations, loading, error, vacationsLoading, company.colors.accent])

  if (loading && vacationsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando calendario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">Error al cargar el calendario</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fullcalendar-container">
      <div ref={calendarRef} id="fullcalendar-schedule" />
      <style jsx>{`
        .fullcalendar-container {
          --fc-border-color: #e5e7eb;
          --fc-button-bg-color: ${company.colors.accent.includes("orange") ? "#f97316" : "#3b82f6"};
          --fc-button-border-color: ${company.colors.accent.includes("orange") ? "#ea580c" : "#2563eb"};
          --fc-button-hover-bg-color: ${company.colors.accent.includes("orange") ? "#ea580c" : "#2563eb"};
          --fc-button-active-bg-color: ${company.colors.accent.includes("orange") ? "#c2410c" : "#1d4ed8"};
          --fc-today-bg-color: ${company.colors.accent.includes("orange") ? "#fed7aa" : "#dbeafe"};
        }

        .fullcalendar-container :global(.fc-button-primary) {
          background-color: var(--fc-button-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .fullcalendar-container :global(.fc-button-primary:hover) {
          background-color: var(--fc-button-hover-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .fullcalendar-container :global(.fc-button-primary:focus) {
          box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
        }

        .fullcalendar-container :global(.fc-today-button) {
          background-color: var(--fc-button-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .fullcalendar-container :global(.fc-day-today) {
          background-color: var(--fc-today-bg-color) !important;
        }

        .fullcalendar-container :global(.fc-event) {
          cursor: pointer;
        }

        .fullcalendar-container :global(.fc-event-time) {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .fullcalendar-container :global(.fc-toolbar-title) {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          text-transform: capitalize;
        }

        .fullcalendar-container :global(.fc-col-header-cell) {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .fullcalendar-container :global(.fc-daygrid-event) {
          margin: 1px 2px;
          border-radius: 4px;
        }

        .fullcalendar-container :global(.fc-timegrid-event) {
          border-radius: 4px;
        }

        .fullcalendar-container :global(.fc-event-vacation) {
          opacity: 0.8;
        }

        .fullcalendar-container :global(.fc-event-schedule) {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
