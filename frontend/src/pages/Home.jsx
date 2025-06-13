import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, ChevronDown } from 'lucide-react'

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded transition-transform duration-200 hover:scale-105"
  >
    {children}
  </button>
)

const CompanyCard = ({ name, description, logoSrc }) => (
  <div
    className="scroll-animate p-6 rounded-lg border border-gray-200 bg-white text-center shadow-md transition duration-300 opacity-0 translate-y-8"
  >
    <div className="flex justify-center">
      <img
        src={logoSrc}
        alt={name}
        className="h-12 mb-4 object-contain"
        onError={(e) => {
          e.target.onerror = null
          e.target.src = '/default-logo.png'
        }}
      />
    </div>
    <h3 className="text-xl font-bold text-orange-500">{name}</h3>
    <p className="mt-2 text-sm text-gray-700">{description}</p>
  </div>
)

export default function Home() {
  const { token } = useAuth()
  const [companies, setCompanies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) return

    const fetchCompanies = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/empresas', {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setCompanies(data.data || [])
      } catch (err) {
        console.error('Error al cargar empresas:', err)
      }
    }

    fetchCompanies()
  }, [token])

  // Animaciones al hacer scroll y volver a entrar en pantalla
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (entry.isIntersecting) {
            el.classList.add('animate-fade-in-up')
          } else {
            el.classList.remove('animate-fade-in-up')
          }
        })
      },
      { threshold: 0.2 }
    )

    const elements = document.querySelectorAll('.scroll-animate')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [companies])

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* Hero */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl font-bold md:text-6xl">
            Bienvenido a <span className="text-orange-500">PortalOne</span>
          </h1>
          <p className="mt-6 text-xl text-slate-300">El portal único para todas tus empresas</p>
          <div className="mt-10">
            <Button onClick={() => navigate('/SelectCompanyPage')}>
              Acceso Intranet
              <ArrowRight className="ml-2 inline h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-0 right-0 flex animate-bounce justify-center">
          <ChevronDown className="h-8 w-8 text-orange-500" />
        </div>
      </section>

      {/* Companies Section */}
      <section id="companies" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-bold animate-fade-in">Tus Compañias</h2>
          <div className="grid gap-10 md:grid-cols-3">
            {companies.map((empresa, idx) => (
              <CompanyCard
                key={empresa.id_empresa || idx}
                name={empresa.nombre}
                description={empresa.description}
                logoSrc={`http://localhost:8000/storage/${empresa.imagen}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h2 className="mb-6 text-3xl font-bold">¿Preparado para entrar?</h2>
          <p className="mb-8 text-xl">Elige tu empresa y accede al panel de control personalizado</p>
          <Button onClick={() => navigate('/SelectCompanyPage')}>
            Selecciona tu Compañia
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-10 text-white animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <p>© 2025 PortalOne by Oscar Sanchez Avellan. All rights reserved.</p>
            <div className="mt-4 flex space-x-6 md:mt-0">
              <a href="#" className="text-slate-300 hover:text-orange-500">Terminos</a>
              <a href="#" className="text-slate-300 hover:text-orange-500">Privacidad</a>
              <a href="#" className="text-slate-300 hover:text-orange-500">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
