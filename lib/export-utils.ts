/**
 * Converts data to CSV format and triggers a download
 * @param data Array of objects to convert to CSV
 * @param filename Name of the file to download (without extension)
 */
export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (!data || data.length === 0) {
    console.error("No data to export")
    return
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0])

    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(","),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header]
            // Handle values that need quotes (strings with commas, quotes, or newlines)
            if (typeof value === "string" && (value.includes(",") || value.includes('"') || value.includes("\n"))) {
              return `"${value.replace(/"/g, '""')}"`
            }
            return value !== undefined && value !== null ? value : ""
          })
          .join(","),
      ),
    ].join("\n")

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

    // Create a download link
    const link = document.createElement("a")

    // Create a URL for the blob
    const url = URL.createObjectURL(blob)

    // Set link properties
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"

    // Add link to document, click it, and remove it
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up the URL object
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error exporting data to CSV:", error)
  }
}

/**
 * Formats data for export based on chart data
 * @param chartData Data from a chart component
 * @param additionalFields Additional fields to include in the export
 */
export function formatChartDataForExport(
  chartData: any[],
  additionalFields: Record<string, string> = {},
): Record<string, any>[] {
  if (!chartData || chartData.length === 0) return []

  return chartData.map((item) => {
    // Create a new object with all the item's properties
    const exportItem = { ...item }

    // Add any additional fields
    Object.entries(additionalFields).forEach(([key, value]) => {
      exportItem[key] = value
    })

    return exportItem
  })
}

/**
 * Prepares tabular data for export
 * @param data Array of objects to export
 * @param columns Column definitions with optional formatting
 */
export function prepareTableDataForExport(
  data: Record<string, any>[],
  columns?: { key: string; header: string; format?: (value: any) => any }[],
): Record<string, any>[] {
  if (!data || data.length === 0) return []

  if (!columns) {
    return data
  }

  return data.map((row) => {
    const exportRow: Record<string, any> = {}

    columns.forEach((column) => {
      const value = row[column.key]
      exportRow[column.header] = column.format ? column.format(value) : value
    })

    return exportRow
  })
}
