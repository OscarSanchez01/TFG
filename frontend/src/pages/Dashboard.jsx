import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {user ? (
        <div className="mt-4">
          <p><strong>Nombre:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
        </div>
      ) : (
        <p>No hay usuario autenticado.</p>
      )}
    </div>
  )
}
