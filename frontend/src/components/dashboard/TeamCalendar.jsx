"use client"

import { useEffect, useRef } from "react"
import { Calendar } from "@fullcalendar/core"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import esLocale from "@fullcalendar/core/locales/es"

export default function TeamCalendar({ schedules, employees, company, loading, error }) {
  const calendarRef = useRef(null)
  const calendarInstance = useRef(null)

  // Convertir los horarios del equipo al formato de FullCalendar
  const convertTeamSchedulesToEvents = (schedules) => {
    return schedules.map((schedule) => {
      const date = schedule.fecha.split("T")[0] // Obtener solo la fecha YYYY-MM-DD
      const startDateTime = `${date}T${schedule.hora_inicio}:00`
      const endDateTime = `${date}T${schedule.hora_fin}:00`

      return {
        id: `team-schedule-${schedule.id_horario}`,
        title: schedule.employeeName,
        start: startDateTime,
        end: endDateTime,
        description: `${schedule.employeeName}: ${schedule.hora_inicio} - ${schedule.hora_fin}`,
        className: "fc-event-team-schedule",
        backgroundColor: schedule.employeeColor.bg,
        borderColor: schedule.employeeColor.border,
        textColor: "#ffffff",
        extendedProps: {
          type: "team-schedule",
          employeeId: schedule.id_empleado,
          employeeName: schedule.employeeName,
          horaInicio: schedule.hora_inicio,
          horaFin: schedule.hora_fin,
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

    // Crear eventos del equipo
    const teamEvents = loading || error ? [] : convertTeamSchedulesToEvents(schedules)

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
        startTime: "08:00",
        endTime: "18:00",
      },
      events: teamEvents,
      eventContent: (info) => {
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
      },
      eventClick: (info) => {
        // Manejar click en evento
        const event = info.event
        alert(
          `Empleado: ${event.extendedProps.employeeName}\n` +
            `Fecha: ${event.start.toLocaleDateString("es-ES")}\n` +
            `Horario: ${event.extendedProps.horaInicio} - ${event.extendedProps.horaFin}`,
        )
      },
      dateClick: (info) => {
        // Manejar click en fecha
        console.log("Fecha clickeada:", info.dateStr)
      },
      eventDidMount: (info) => {
        // Agregar tooltip
        info.el.setAttribute("title", info.event.extendedProps.description || "")
      },
    })

    calendar.render()
    calendarInstance.current = calendar

    return () => {
      if (calendarInstance.current) {
        calendarInstance.current.destroy()
      }
    }
  }, [schedules, loading, error, company.colors.accent])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando calendario del equipo...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">Error al cargar el calendario del equipo</p>
          <p className="text-sm text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="team-calendar-container">
      <div ref={calendarRef} id="team-fullcalendar" />
      <style jsx>{`
        .team-calendar-container {
          --fc-border-color: #e5e7eb;
          --fc-button-bg-color: ${company.colors.accent.includes("orange") ? "#f97316" : "#3b82f6"};
          --fc-button-border-color: ${company.colors.accent.includes("orange") ? "#ea580c" : "#2563eb"};
          --fc-button-hover-bg-color: ${company.colors.accent.includes("orange") ? "#ea580c" : "#2563eb"};
          --fc-button-active-bg-color: ${company.colors.accent.includes("orange") ? "#c2410c" : "#1d4ed8"};
          --fc-today-bg-color: ${company.colors.accent.includes("orange") ? "#fed7aa" : "#dbeafe"};
        }

        .team-calendar-container :global(.fc-button-primary) {
          background-color: var(--fc-button-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .team-calendar-container :global(.fc-button-primary:hover) {
          background-color: var(--fc-button-hover-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .team-calendar-container :global(.fc-button-primary:focus) {
          box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.25) !important;
        }

        .team-calendar-container :global(.fc-today-button) {
          background-color: var(--fc-button-bg-color) !important;
          border-color: var(--fc-button-border-color) !important;
        }

        .team-calendar-container :global(.fc-day-today) {
          background-color: var(--fc-today-bg-color) !important;
        }

        .team-calendar-container :global(.fc-event) {
          cursor: pointer;
        }

        .team-calendar-container :global(.fc-event-time) {
          font-size: 0.75rem;
          opacity: 0.9;
        }

        .team-calendar-container :global(.fc-toolbar-title) {
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          text-transform: capitalize;
        }

        .team-calendar-container :global(.fc-col-header-cell) {
          background-color: #f9fafb;
          font-weight: 600;
        }

        .team-calendar-container :global(.fc-daygrid-event) {
          margin: 1px 2px;
          border-radius: 4px;
        }

        .team-calendar-container :global(.fc-timegrid-event) {
          border-radius: 4px;
        }

        .team-calendar-container :global(.fc-event-team-schedule) {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}
