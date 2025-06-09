"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded transition-transform duration-200 hover:scale-105"
  >
    {children}
  </button>
)

const getCardClasses = (id_empresa) => {
  switch (id_empresa) {
    case 1:
      return "shadow-yellow-500 hover:bg-yellow-100"
    case 2:
      return "shadow-blue-500 hover:bg-blue-100"
    case 3:
      return "shadow-orange-500 hover:bg-orange-100"
    default:
      return "shadow-gray-300 hover:bg-gray-100"
  }
}

const CompanyCard = ({ company, onSelect }) => (
  <div
    className={`scroll-animate p-6 rounded-lg border border-gray-200 bg-white text-center shadow-md transition duration-300 cursor-pointer ${getCardClasses(company.id_empresa)}`}
    onClick={() => onSelect(company)}
  >
    <div className="flex justify-center">
      <img
        src={`http://localhost:8000/storage/${company.imagen}`}
        alt={`${company.nombre} logo`}
        className="h-12 mb-4 object-contain"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = "/default-logo.png"
        }}
      />
    </div>
    <h3 className="text-xl font-bold text-orange-500">{company.nombre}</h3>
    <div className="mt-6">
      <Button>Acceder</Button>
    </div>
  </div>
)

export default function SelectCompanyPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/empresas", {
          headers: {
            Accept: "application/json",
          },
        })
        const data = await res.json()
        setCompanies(data.data || [])
      } catch (error) {
        console.error("Error al obtener empresas:", error)
      }
    }

    fetchCompanies()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (entry.isIntersecting) {
            el.classList.add("animate-fade-in-up")
          } else {
            el.classList.remove("animate-fade-in-up")
          }
        })
      },
      { threshold: 0.2 },
    )

    const elements = document.querySelectorAll(".scroll-animate")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [companies])

  const handleCompanySelect = (company) => {
    // Redirigimos usando el nombre en minúscula o un campo "slug" si lo tienes
    navigate(`/login/${company.nombre.toLowerCase()}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 py-16">
      <section className="container mx-auto px-4 text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-800">Selecciona tu compañía</h1>
        <p className="mt-2 text-slate-600">Elige la empresa a la que deseas acceder</p>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {companies.map((company) => (
            <CompanyCard key={company.id_empresa} company={company} onSelect={handleCompanySelect} />
          ))}
        </div>
      </section>
    </main>
  )
}
