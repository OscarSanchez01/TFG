"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { FileText, Plus } from "lucide-react"
import { useToast } from "../../../hooks/useToast"
import { useAuth } from "../../../contexts/AuthContext"
import { useSessionData } from "../../../hooks/useSessionData"

export default function AdminPayslips({ company }) {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [existingPayslips, setExistingPayslips] = useState([])
  const { token } = useAuth()
  const { userData } = useSessionData()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    id_empleado: "",
    fecha: "",
    salario_bruto: "",
    salario_neto: "",
    archivo_pdf: null,
  })

  // Obtener empleados y nóminas existentes al cargar
  useEffect(() => {
    fetchEmployees()
    fetchExistingPayslips()
  }, [])

  const fetchEmployees = async () => {
    if (!token) return

    try {
      const response = await fetch("http://localhost:8000/api/empleados", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.status === "success" && result.data) {
          setEmployees(result.data)
        }
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  const fetchExistingPayslips = async () => {
    if (!token) return

    try {
      const response = await fetch("http://localhost:8000/api/nominas", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.status === "success" && result.data) {
          setExistingPayslips(result.data)
        }
      }
    } catch (error) {
      console.error("Error fetching existing payslips:", error)
    }
  }

  // Generar opciones de fecha (solo día 28 de cada mes)
  const generateDateOptions = () => {
    const options = []
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    // Generar fechas para los últimos 6 meses y próximos 6 meses
    for (let i = -6; i <= 6; i++) {
      const date = new Date(currentYear, currentDate.getMonth() + i, 28)
      const dateString = date.toISOString().split("T")[0]
      const monthYear = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" })

      // Verificar si ya existe una nómina para este mes y empleado
      const isUsed = existingPayslips.some((payslip) => {
        const payslipDate = new Date(payslip.fecha)
        return (
          payslipDate.getMonth() === date.getMonth() &&
          payslipDate.getFullYear() === date.getFullYear() &&
          payslip.id_empleado === Number.parseInt(formData.id_empleado)
        )
      })

      options.push({
        value: dateString,
        label: `28 de ${monthYear}`,
        disabled: isUsed,
      })
    }

    return options.sort((a, b) => new Date(b.value) - new Date(a.value))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    if (name === "archivo_pdf") {
      const file = e.target.files[0]
      if (file && file.type !== "application/pdf") {
        toast({
          title: "Error",
          description: "Solo se permiten archivos PDF",
        })
        return
      }
      setFormData((prev) => ({ ...prev, [name]: file }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    if (!formData.id_empleado) {
      toast({ title: "Error", description: "Selecciona un empleado" })
      return false
    }

    if (!formData.fecha) {
      toast({ title: "Error", description: "Selecciona una fecha" })
      return false
    }

    if (!formData.salario_bruto || Number.parseFloat(formData.salario_bruto) <= 0) {
      toast({ title: "Error", description: "El salario bruto debe ser mayor a 0" })
      return false
    }

    if (!formData.salario_neto || Number.parseFloat(formData.salario_neto) <= 0) {
      toast({ title: "Error", description: "El salario neto debe ser mayor a 0" })
      return false
    }

    if (Number.parseFloat(formData.salario_neto) >= Number.parseFloat(formData.salario_bruto)) {
      toast({ title: "Error", description: "El salario neto debe ser menor al salario bruto" })
      return false
    }

    if (!formData.archivo_pdf) {
      toast({ title: "Error", description: "Selecciona un archivo PDF" })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      // Primero subir el archivo PDF
      const fileFormData = new FormData()
      fileFormData.append("file", formData.archivo_pdf)

      const fileResponse = await fetch("http://localhost:8000/api/upload-pdf", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: fileFormData,
      })

      let pdfPath = ""
      if (fileResponse.ok) {
        const fileResult = await fileResponse.json()
        pdfPath = fileResult.path || `nominas/${formData.archivo_pdf.name}`
      } else {
        // Si falla la subida, usar un nombre por defecto
        const selectedDate = new Date(formData.fecha)
        const monthName = selectedDate.toLocaleDateString("es-ES", { month: "long" })
        const year = selectedDate.getFullYear()
        pdfPath = `nominas/nomina_${monthName}_${year}.pdf`
      }

      // Obtener el id_empresa del usuario actual o de la sesión
      const companyId = userData?.id_empresa || 1 // Fallback a 1 si no se encuentra

      // Crear la nómina
      const payslipData = {
        id_empleado: Number.parseInt(formData.id_empleado),
        id_empresa: companyId,
        fecha: formData.fecha,
        salario_bruto: Number.parseFloat(formData.salario_bruto),
        salario_neto: Number.parseFloat(formData.salario_neto),
        archivo_pdf: pdfPath,
      }

      console.log("Enviando datos de nómina:", payslipData)

      const response = await fetch("http://localhost:8000/api/nominas", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payslipData),
      })

      const result = await response.json()
      console.log("Respuesta de la API:", result)

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Error al crear la nómina")
      }

      toast({
        title: "Nómina creada",
        description: "La nómina ha sido creada correctamente",
      })

      // Limpiar formulario
      setFormData({
        id_empleado: "",
        fecha: "",
        salario_bruto: "",
        salario_neto: "",
        archivo_pdf: null,
      })

      // Actualizar lista de nóminas existentes
      fetchExistingPayslips()

      // Limpiar el input de archivo
      const fileInput = document.getElementById("archivo_pdf")
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Error creating payslip:", error)
      toast({
        title: "Error",
        description: error.message || "Error al crear la nómina",
      })
    } finally {
      setLoading(false)
    }
  }

  const dateOptions = generateDateOptions()

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Gestión de Nóminas</h2>
        <p className="mt-1 text-gray-600">Crear y gestionar nóminas de empleados</p>
      </div>

      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <Plus className="mr-2 h-5 w-5" />
            Crear Nueva Nómina
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Selección de empleado */}
              <div className="grid gap-2">
                <label htmlFor="id_empleado" className="text-sm font-medium">
                  Empleado *
                </label>
                <select
                  id="id_empleado"
                  name="id_empleado"
                  value={formData.id_empleado}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loadingEmployees}
                >
                  <option value="">{loadingEmployees ? "Cargando empleados..." : "Selecciona un empleado"}</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selección de fecha */}
              <div className="grid gap-2">
                <label htmlFor="fecha" className="text-sm font-medium">
                  Fecha (Solo día 28) *
                </label>
                <select
                  id="fecha"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={!formData.id_empleado}
                >
                  <option value="">
                    {!formData.id_empleado ? "Primero selecciona un empleado" : "Selecciona una fecha"}
                  </option>
                  {formData.id_empleado &&
                    dateOptions.map((option) => (
                      <option key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label} {option.disabled ? "(Ya existe)" : ""}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Salario bruto */}
              <div className="grid gap-2">
                <label htmlFor="salario_bruto" className="text-sm font-medium">
                  Salario Bruto (€) *
                </label>
                <input
                  type="number"
                  id="salario_bruto"
                  name="salario_bruto"
                  value={formData.salario_bruto}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="3000.00"
                  required
                />
              </div>

              {/* Salario neto */}
              <div className="grid gap-2">
                <label htmlFor="salario_neto" className="text-sm font-medium">
                  Salario Neto (€) *
                </label>
                <input
                  type="number"
                  id="salario_neto"
                  name="salario_neto"
                  value={formData.salario_neto}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max={formData.salario_bruto || undefined}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="2400.00"
                  required
                />
              </div>
            </div>

            {/* Archivo PDF */}
            <div className="grid gap-2">
              <label htmlFor="archivo_pdf" className="text-sm font-medium">
                Archivo PDF de la Nómina *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <label htmlFor="archivo_pdf" className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">Seleccionar archivo PDF</span>
                      <input
                        type="file"
                        id="archivo_pdf"
                        name="archivo_pdf"
                        accept=".pdf"
                        onChange={handleInputChange}
                        className="hidden"
                        required
                      />
                    </label>
                    {formData.archivo_pdf && (
                      <p className="text-xs text-gray-600 mt-1">Archivo seleccionado: {formData.archivo_pdf.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen */}
            {formData.salario_bruto && formData.salario_neto && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Resumen:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Salario Bruto:</strong> €{Number.parseFloat(formData.salario_bruto).toFixed(2)}
                  </p>
                  <p>
                    <strong>Salario Neto:</strong> €{Number.parseFloat(formData.salario_neto).toFixed(2)}
                  </p>
                  <p>
                    <strong>Deducciones:</strong> €
                    {(Number.parseFloat(formData.salario_bruto) - Number.parseFloat(formData.salario_neto)).toFixed(2)}
                  </p>
                  <p>
                    <strong>% Deducciones:</strong>{" "}
                    {(
                      ((Number.parseFloat(formData.salario_bruto) - Number.parseFloat(formData.salario_neto)) /
                        Number.parseFloat(formData.salario_bruto)) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className={`w-full ${company.colors.button}`} disabled={loading}>
              {loading ? "Creando nómina..." : "Crear Nómina"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Instrucciones
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Solo se pueden crear nóminas para el día 28 de cada mes</li>
              <li>• No se puede repetir el mismo mes para el mismo empleado</li>
              <li>• El salario neto debe ser menor al salario bruto</li>
              <li>• Solo se permiten archivos en formato PDF</li>
              <li>• Todos los campos son obligatorios</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
