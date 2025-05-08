"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { parseWaterData, validateWaterData, type WaterData } from "@/lib/waterDataService"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"

interface DataUploaderProps {
  onDataLoaded: (data: WaterData) => void
}

export function DataUploader({ onDataLoaded }: DataUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setError(null)
    setSuccess(null)
    setValidationErrors([])
    setFileName(file.name)

    try {
      // Parse the uploaded file
      const parsedData = await parseWaterData(file)
      
      // Validate data consistency
      const validation = validateWaterData(parsedData)
      
      if (!validation.valid) {
        setValidationErrors(validation.errors)
      }
      
      // Pass the data to parent component
      onDataLoaded(parsedData)
      
      setSuccess(`Successfully processed ${file.name}`)
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Upload Water Data</CardTitle>
        <CardDescription>
          Upload paste.txt or CSV file with water consumption data to update the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="data-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 border-gray-300 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">TXT or CSV file</p>
                {fileName && <p className="text-xs font-medium text-blue-500 mt-2">{fileName}</p>}
              </div>
              <input
                id="data-file"
                type="file"
                accept=".txt,.csv"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
          </div>

          {isUploading && (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
              <span className="ml-2">Processing data...</span>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {validationErrors.length > 0 && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Validation Warnings</AlertTitle>
              <AlertDescription>
                <p className="mb-2">The data was loaded, but some inconsistencies were found:</p>
                <ul className="list-disc pl-5 text-sm space-y-1 max-h-40 overflow-y-auto">
                  {validationErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
