export interface ServiceRecord {
  id: string
  refNo: string
  employee: string
  type: string
  packageName: string
  serNumber: string
  vendor: string
  status: string
  expires: string
}

// Convert data to CSV format
export function generateCSV(data: ServiceRecord[]): string {
  const headers = [
    "Ser_No",
    "Ref No",
    "Employee",
    "Type",
    "Package Name",
    "Service Number",
    "Vendor",
    "Status",
    "Expires",
  ]

  const csvContent = [
    headers.join(","),
    ...data.map((row) =>
      [row.id, row.refNo, row.employee, row.type, row.packageName, row.serNumber, row.vendor, row.status, row.expires]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ].join("\n")

  return csvContent
}

// Download CSV file
export function downloadCSV(data: ServiceRecord[], filename = "services.csv") {
  const csv = generateCSV(data)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Generate PDF content as HTML table
export function generatePDFHTML(data: ServiceRecord[]): string {
  const tableRows = data
    .map(
      (row) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.id}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.refNo}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.employee}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.type}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.packageName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.serNumber}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.vendor}</td>
      <td style="padding: 8px; border: 1px solid #ddd; color: ${getStatusColor(row.status)}; font-weight: bold;">${row.status}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${row.expires}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Services Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f0f0f0; padding: 10px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
          td { padding: 8px; border: 1px solid #ddd; }
          tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>Services Report</h1>
        <p>Generated on: ${new Date().toLocaleDateString()}</p>
        <table>
          <thead>
            <tr>
              <th>Ser_No</th>
              <th>Ref No</th>
              <th>Employee</th>
              <th>Type</th>
              <th>Package Name</th>
              <th>Service Number</th>
              <th>Vendor</th>
              <th>Status</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `
}

// Download PDF file using print-to-PDF
export function downloadPDF(data: ServiceRecord[], filename = "services.pdf") {
  const htmlContent = generatePDFHTML(data)
  const printWindow = window.open("", "", "width=900,height=600")

  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    setTimeout(() => {
      printWindow.print()
      printWindow.close()
    }, 250)
  }
}

// Helper function to get status color for PDF
function getStatusColor(status: string): string {
  switch (status) {
    case "Active":
      return "#16a34a"
    case "Exp_soon":
      return "#ca8a04"
    case "Expired":
      return "#dc2626"
    default:
      return "#000000"
  }
}
