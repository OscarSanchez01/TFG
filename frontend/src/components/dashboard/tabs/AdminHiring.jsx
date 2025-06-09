"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/Card"
import { Button } from "../../ui/Button"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "../../ui/Modal"
import { UserPlus, Users, Building, Edit, Trash2, X, Save, AlertTriangle, Skull } from "lucide-react"
import { useToast } from "../../../hooks/useToast"
import { useAuth } from "../../../contexts/AuthContext"
import { useSessionData } from "../../../hooks/useSessionData"

export default function AdminHiring({ company }) {
  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState([])
  const [loadingEmployees, setLoadingEmployees] = useState(true)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [deletingEmployee, setDeletingEmployee] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState(null)
  const { token } = useAuth()
  const { userData, companyData } = useSessionData()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company_domain: "",
    password: "password123", // Contraseña por defecto
    rol: "empleado",
  })

  // Mapeo de dominios por empresa
  const companyDomains = {
    excon: "@excon.com",
    rmg: "@rmg.com",
    aridos: "@aridos.com",
  }

  // Mapeo de nombres de empresa
  const companyNames = {
    "@excon.com": "EXCON",
    "@rmg.com": "RMG",
    "@aridos.com": "ÁRIDOS",
  }

  // Obtener el dominio basado en la empresa actual
  const getCurrentCompanyDomain = () => {
    if (companyData && companyData.nombre) {
      const companyName = companyData.nombre.toLowerCase()
      return companyDomains[companyName] || "@empresa.com"
    }
    return "@empresa.com"
  }

  // Obtener empleados existentes
  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    if (!token) return

    try {
      setLoadingEmployees(true)
      const response = await fetch("http://localhost:8000/api/empleados", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.status === "success" && result.data) {
          // No filtrar por empresa aquí, mostrar todos los empleados agrupados
          setEmployees(result.data)
        }
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
    } finally {
      setLoadingEmployees(false)
    }
  }

  // Agrupar empleados por empresa basado en su email
  const groupEmployeesByCompany = () => {
    const grouped = {}

    employees.forEach((employee) => {
      let companyKey = "Otros"

      // Determinar la empresa basada en el email
      if (employee.email.includes("@excon")) {
        companyKey = "EXCON"
      } else if (employee.email.includes("@rmg")) {
        companyKey = "RMG"
      } else if (employee.email.includes("@aridos")) {
        companyKey = "ÁRIDOS"
      } else if (employee.email.includes("@empleado")) {
        companyKey = "Administradores"
      }

      if (!grouped[companyKey]) {
        grouped[companyKey] = []
      }

      grouped[companyKey].push(employee)
    })

    return grouped
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateEmail = () => {
    if (formData.name && formData.company_domain) {
      // Generar email basado en el nombre y dominio seleccionado
      const cleanName = formData.name
        .toLowerCase()
        .replace(/\s+/g, ".")
        .replace(/[^a-z0-9.]/g, "")

      const email = `${cleanName}${formData.company_domain}`
      setFormData((prev) => ({ ...prev, email }))
    }
  }

  // Generar email automáticamente cuando cambie el nombre o dominio
  useEffect(() => {
    generateEmail()
  }, [formData.name, formData.company_domain])

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({ title: "Error", description: "El nombre es obligatorio" })
      return false
    }

    if (!formData.email.trim()) {
      toast({ title: "Error", description: "El email es obligatorio" })
      return false
    }

    if (!formData.company_domain) {
      toast({ title: "Error", description: "Selecciona un dominio de empresa" })
      return false
    }

    // Verificar que el email no esté ya en uso
    const emailExists = employees.some((employee) => employee.email.toLowerCase() === formData.email.toLowerCase())

    if (emailExists) {
      toast({ title: "Error", description: "Este email ya está en uso" })
      return false
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Error", description: "Formato de email inválido" })
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setLoading(true)

      // Obtener el id_empresa del usuario actual o de la sesión
      const companyId = companyData?.id_empresa || userData?.id_empresa || 1

      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        rol: formData.rol,
        id_empresa: companyId,
      }

      console.log("Enviando datos de empleado:", employeeData)

      const response = await fetch("http://localhost:8000/api/empleados", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(employeeData),
      })

      const result = await response.json()
      console.log("Respuesta de la API:", result)

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Error al crear el empleado")
      }

      toast({
        title: "Empleado contratado",
        description: `${formData.name} ha sido contratado correctamente`,
      })

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        company_domain: "",
        password: "password123",
        rol: "empleado",
      })

      // Actualizar lista de empleados
      await fetchEmployees()
    } catch (error) {
      console.error("Error creating employee:", error)
      toast({
        title: "Error",
        description: error.message || "Error al contratar el empleado",
      })
    } finally {
      setLoading(false)
    }
  }

  // Funciones para editar empleado
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee.id)
    setEditFormData({
      name: employee.name,
      email: employee.email,
      rol: employee.rol,
    })
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveEdit = async (employeeId) => {
    try {
      // Validar que el email no esté en uso por otro empleado
      const emailExists = employees.some(
        (employee) => employee.id !== employeeId && employee.email.toLowerCase() === editFormData.email.toLowerCase(),
      )

      if (emailExists) {
        toast({ title: "Error", description: "Este email ya está en uso por otro empleado" })
        return
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(editFormData.email)) {
        toast({ title: "Error", description: "Formato de email inválido" })
        return
      }

      const response = await fetch(`http://localhost:8000/api/empleados/${employeeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(editFormData),
      })

      const result = await response.json()

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Error al actualizar el empleado")
      }

      toast({
        title: "Empleado actualizado",
        description: "Los datos del empleado han sido actualizados correctamente",
      })

      setEditingEmployee(null)
      setEditFormData({})
      await fetchEmployees()
    } catch (error) {
      console.error("Error updating employee:", error)
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el empleado",
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingEmployee(null)
    setEditFormData({})
  }

  // Funciones para eliminar empleado
  const handleDeleteClick = (employee) => {
    setEmployeeToDelete(employee)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return

    try {
      setDeletingEmployee(employeeToDelete.id)

      const response = await fetch(`http://localhost:8000/api/empleados/${employeeToDelete.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Error al eliminar el empleado")
      }

      toast({
        title: "Empleado eliminado",
        description: `${employeeToDelete.name} ha sido eliminado correctamente`,
      })

      await fetchEmployees()
      setDeleteModalOpen(false)
      setEmployeeToDelete(null)
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el empleado",
      })
    } finally {
      setDeletingEmployee(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setEmployeeToDelete(null)
  }

  const groupedEmployees = groupEmployeesByCompany()
  const totalEmployees = employees.length

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className={`text-2xl font-bold ${company.colors.accent}`}>Contratar Empleados</h2>
        <p className="mt-1 text-gray-600">Añadir nuevos empleados a la empresa</p>
      </div>

      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Contratar Nuevo Empleado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Nombre completo */}
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Juan Pérez García"
                  required
                />
              </div>

              {/* Dominio de empresa */}
              <div className="grid gap-2">
                <label htmlFor="company_domain" className="text-sm font-medium">
                  Empresa *
                </label>
                <select
                  id="company_domain"
                  name="company_domain"
                  value={formData.company_domain}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona una empresa</option>
                  <option value="@excon.com">EXCON (@excon.com)</option>
                  <option value="@rmg.com">RMG (@rmg.com)</option>
                  <option value="@aridos.com">ÁRIDOS (@aridos.com)</option>
                </select>
              </div>
            </div>

            {/* Email generado automáticamente */}
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Corporativo *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                placeholder="juan.perez@empresa.com"
                required
              />
              <p className="text-xs text-gray-500">
                Se genera automáticamente basado en el nombre y empresa seleccionada
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Contraseña por defecto */}
              <div className="grid gap-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Contraseña Temporal *
                </label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Rol */}
              <div className="grid gap-2">
                <label htmlFor="rol" className="text-sm font-medium">
                  Rol *
                </label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                  className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="empleado">Empleado</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>
            </div>

            {/* Resumen */}
            {formData.name && formData.email && formData.company_domain && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Resumen del nuevo empleado:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>
                    <strong>Nombre:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Empresa:</strong>{" "}
                    {formData.company_domain.replace("@", "").replace(".com", "").toUpperCase()}
                  </p>
                  <p>
                    <strong>Rol:</strong> {formData.rol.charAt(0).toUpperCase() + formData.rol.slice(1)}
                  </p>
                  <p>
                    <strong>Contraseña temporal:</strong> {formData.password}
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className={`w-full ${company.colors.button}`} disabled={loading}>
              {loading ? "Contratando empleado..." : "Contratar Empleado"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de empleados actuales agrupados por empresa */}
      <Card bgColor={company.colors.cardBackground}>
        <CardHeader className={`${company.colors.cardHeader} ${company.colors.cardHeaderText}`}>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Empleados Actuales ({totalEmployees})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingEmployees ? (
            <div className="text-center py-4">
              <p className="text-gray-500">Cargando empleados...</p>
            </div>
          ) : totalEmployees === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay empleados registrados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEmployees).map(([companyName, companyEmployees]) => (
                <div key={companyName} className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Building className="mr-2 h-5 w-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-800">
                      {companyName} ({companyEmployees.length})
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {companyEmployees.map((employee) => (
                      <div key={employee.id} className="p-3 bg-gray-50 rounded-lg">
                        {editingEmployee === employee.id ? (
                          // Modo edición
                          <div className="space-y-3">
                            <div className="grid gap-3 md:grid-cols-2">
                              <div>
                                <label className="text-xs font-medium text-gray-600">Nombre</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={editFormData.name}
                                  onChange={handleEditInputChange}
                                  className="w-full text-sm rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-gray-600">Email</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={editFormData.email}
                                  onChange={handleEditInputChange}
                                  className="w-full text-sm rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">Rol</label>
                              <select
                                name="rol"
                                value={editFormData.rol}
                                onChange={handleEditInputChange}
                                className="w-full text-sm rounded border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="empleado">Empleado</option>
                                <option value="administrador">Administrador</option>
                              </select>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white"
                                onClick={() => handleSaveEdit(employee.id)}
                              >
                                <Save className="h-3 w-3 mr-1" />
                                Guardar
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-3 w-3 mr-1" />
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // Modo visualización
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{employee.name}</h4>
                              <p className="text-sm text-gray-600">{employee.email}</p>
                              <p className="text-xs text-gray-500 capitalize">{employee.rol}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="text-right mr-3">
                                <p className="text-xs text-gray-500">ID: {employee.id}</p>
                                {employee.created_at && (
                                  <p className="text-xs text-gray-500">
                                    Desde: {new Date(employee.created_at).toLocaleDateString("es-ES")}
                                  </p>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleEditEmployee(employee)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleDeleteClick(employee)}
                                disabled={deletingEmployee === employee.id}
                              >
                                {deletingEmployee === employee.id ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={deleteModalOpen} onClose={handleDeleteCancel} className="max-w-md w-full mx-4">
        <ModalHeader className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-full">
              <Skull className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">¡Zona de Peligro!</h3>
              <p className="text-sm opacity-90">Esta acción es irreversible</p>
            </div>
          </div>
        </ModalHeader>

        <ModalContent className="text-center py-6">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar a {employeeToDelete?.name}?</h4>
            <p className="text-gray-600 mb-4">
              Esta acción eliminará permanentemente al empleado y todos sus datos asociados.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">
                <strong>⚠️ Advertencia:</strong> No podrás recuperar esta información una vez eliminada.
              </p>
            </div>
            {employeeToDelete && (
              <div className="bg-gray-50 rounded-lg p-3 text-left">
                <p className="text-sm">
                  <strong>Nombre:</strong> {employeeToDelete.name}
                </p>
                <p className="text-sm">
                  <strong>Email:</strong> {employeeToDelete.email}
                </p>
                <p className="text-sm">
                  <strong>Rol:</strong> {employeeToDelete.rol}
                </p>
              </div>
            )}
          </div>
        </ModalContent>

        <ModalFooter className="bg-gray-50 rounded-b-lg">
          <Button variant="outline" onClick={handleDeleteCancel} className="border-gray-300 hover:bg-gray-100">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            disabled={deletingEmployee === employeeToDelete?.id}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
          >
            {deletingEmployee === employeeToDelete?.id ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Eliminando...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Sí, Eliminar
              </>
            )}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
