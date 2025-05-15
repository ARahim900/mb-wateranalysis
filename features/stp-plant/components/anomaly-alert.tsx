"use client"

import { AlertCircle, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AnomalyAlertProps {
  title: string
  description: string
  severity: "low" | "medium" | "high"
  timestamp: string
  status: "active" | "resolved" | "investigating"
}

export function AnomalyAlert({ title, description, severity, timestamp, status }: AnomalyAlertProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return <Badge variant={severity === "high" ? "destructive" : severity === "medium" ? "warning" : "outline"}>Active</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Resolved</Badge>;
      case "investigating":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Investigating</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getBorderColor = () => {
    switch (severity) {
      case "high":
        return "border-red-200";
      case "medium":
        return "border-amber-200";
      case "low":
        return "border-blue-200";
      default:
        return "border-gray-200";
    }
  };
  
  const getIcon = () => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "low":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <div className={`border rounded-lg p-4 ${getBorderColor()}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium flex items-center">
          {getIcon()}
          <span className="ml-2">{title}</span>
        </h3>
        {getStatusBadge()}
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="text-xs text-gray-500">
        Detected: {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  );
}

export default AnomalyAlert;