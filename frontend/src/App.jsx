import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import LoginCompanyPage from "./pages/LoginCompanyPage"
import SelectCompanyPage from "./pages/SelectCompanyPage"
import DashboardCompanyPage from "./pages/DashboardCompanyPage"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:company" element={<LoginCompanyPage />} />
      <Route path="/SelectCompanyPage" element={<SelectCompanyPage />} />

      {/* Rutas protegidas con Layout común */}
      <Route
        path="/dashboard/:company"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:company/overview"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:company/schedule"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:company/payslips"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:company/vacation"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:company/team"
        element={
          <ProtectedRoute>
            <Layout>
              <DashboardCompanyPage />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App
