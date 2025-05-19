export async function fetchCSVData(url: string): Promise<Record<string, string>[]> {
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.status} ${response.statusText}`)
    }

    const text = await response.text()

    // Simple CSV parser
    const rows = text.split("\n")
    if (rows.length === 0) {
      return []
    }

    // Get headers (first row)
    const headers = rows[0].split(",").map((header) => header.trim().replace(/^"|"$/g, ""))

    // Parse data rows
    const data = rows
      .slice(1)
      .filter((row) => row.trim() !== "")
      .map((row) => {
        const values = row.split(",").map((value) => value.trim().replace(/^"|"$/g, ""))
        const rowData: Record<string, string> = {}

        headers.forEach((header, index) => {
          rowData[header] = values[index] || ""
        })

        return rowData
      })

    return data
  } catch (error) {
    console.error("Error fetching CSV data:", error)
    // Return empty array instead of throwing to prevent app crashes
    return []
  }
}
