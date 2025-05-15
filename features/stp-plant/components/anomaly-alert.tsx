import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, AlertCircle, Clock, AlertOctagon, CheckCircle2 } from "lucide-react"

interface AnomalyAlertProps {
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
  status: "active" | "investigating" | "resolved"
}

export default function AnomalyAlert({
  title,
  description,
  severity,
  timestamp,
  status
}: AnomalyAlertProps) {
  // Convert timestamp to relative time (e.g., "2 hours ago")
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
    }
    
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    }
    
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  }
  
  // Get color based on severity
  const getSeverityColor = () => {
    switch (severity) {
      case "high":
        return "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800"
      case "medium":
        return "bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
      case "low":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
      default:
        return "bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800"
    }
  }
  
  // Get icon based on severity
  const getSeverityIcon = () => {
    switch (severity) {
      case "high":
        return <AlertOctagon className="h-5 w-5 text-red-600 dark:text-red-400" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
      case "low":
        return <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
    }
  }
  
  // Get badge based on status
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">Active</Badge>
      case "investigating":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Investigating</Badge>
      case "resolved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  return (
    <Card className={`border ${getSeverityColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-start">
            <div className="mr-3 mt-0.5">
              {getSeverityIcon()}
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{getRelativeTime(timestamp)}</span>
          </div>
          {status === "resolved" && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              <span>Resolved</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}