"use client"

import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Button } from "../ui/Button"
import { Download } from "lucide-react"

export default function PayslipCard({
  payslip,
  accentColor,
  buttonColor,
  headerColor,
  headerTextColor,
  bgColor = "bg-white",
}) {
  const handleDownload = () => {
    if (payslip.archivo_pdf) {
      // Si hay un archivo PDF, descargarlo
      const link = document.createElement("a")
      link.href = `http://localhost:8000/storage/${payslip.archivo_pdf}`
      link.download = `nomina_${payslip.period.replace(" ", "_")}.pdf`
      link.click()
    } else {
      // Si no hay archivo PDF, mostrar mensaje
      alert("El archivo PDF no está disponible para esta nómina")
    }
  }

  const getStatusBadge = (status) => {
    if (status === "Cobrada") {
      return <Badge className="bg-green-500 text-white">{status}</Badge>
    } else {
      return <Badge className="bg-yellow-500 text-white">{status}</Badge>
    }
  }

  return (
    <Card bgColor={bgColor}>
      <CardHeader className={`${headerColor} ${headerTextColor}`}>
        <CardTitle>{payslip.period}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Cantidad Neta</p>
            <p className={`font-bold ${accentColor}`}>{payslip.amount}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Cantidad Bruta</p>
            <p className="font-bold">{payslip.grossAmount}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Fecha de Pago</p>
            <p className="font-bold">{payslip.date}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-medium">Estado</p>
            {getStatusBadge(payslip.status)}
          </div>
          <Button className={`w-full mt-4 ${buttonColor}`} onClick={handleDownload} disabled={!payslip.archivo_pdf}>
            <Download className="mr-2 h-4 w-4" />
            {payslip.archivo_pdf ? "Descargar PDF" : "PDF no disponible"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
