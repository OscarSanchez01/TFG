import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import LoginCompanyPage from "./pages/LoginCompanyPage"
import SelectCompanyPage from "./pages/SelectCompanyPage"
import DashboardCompanyPage from "./pages/DashboardCompanyPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:company" element={<LoginCompanyPage />} />
      <Route path="/SelectCompanyPage" element={<SelectCompanyPage />} />

      {/* Rutas con Layout común */}
      <Route element={<Layout />}>
        <Route path="/dashboard/:company" element={<DashboardCompanyPage />} />
        <Route path="/dashboard/:company/overview" element={<DashboardCompanyPage />} />
        <Route path="/dashboard/:company/schedule" element={<DashboardCompanyPage />} />
        <Route path="/dashboard/:company/payslips" element={<DashboardCompanyPage />} />
        <Route path="/dashboard/:company/vacation" element={<DashboardCompanyPage />} />
        <Route path="/dashboard/:company/team" element={<DashboardCompanyPage />} />
      </Route>
    </Routes>
  )
}

export default App

