"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  WrenchIcon, 
  Gauge, 
  ChevronDown,
  CalendarIcon,
  ClipboardList,
  AlertCircle,
  BellIcon,
  ArrowRightCircle
} from "lucide-react"

interface MaintenanceScheduleProps {
  maintenanceData: Array<{
    equipment: string
    lastService: string
    nextService: string
    status: string
    priority: string
  }>
}

export function MaintenanceSchedule({ maintenanceData }: MaintenanceScheduleProps) {
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  
  // Calculate days until next maintenance for an equipment
  const getDaysUntil = (dateStr: string): number => {
    const today = new Date()
    const nextDate = new Date(dateStr)
    const diffTime = nextDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  // Generate mock maintenance history for an equipment
  const generateMaintenanceHistory = (equipment: string) => {
    const mockHistory = [
      {
        date: "28/02/2025",
        type: "Preventive",
        technician: "Ahmed K.",
        description: "Performed scheduled maintenance including lubrication, belt tensioning, and general cleaning.",
        parts: "None"
      },
      {
        date: "15/12/2024",
        type: "Corrective",
        technician: "Mohammed S.",
        description: "Replaced worn belt and adjusted tension. Cleaned air filter and housing.",
        parts: "Drive belt (Model DB-478)"
      },
      {
        date: "30/09/2024",
        type: "Preventive",
        technician: "Ahmed K.",
        description: "Conducted quarterly inspection and maintenance. Replaced oil and filters.",
        parts: "Oil filter (OF-237), Air filter (AF-112)"
      }
    ]
    
    return mockHistory
  }
  
  // Generate maintenance task list for upcoming service
  const generateTaskList = (equipment: string) => {
    const taskLists: { [key: string]: Array<{task: string, estimated: string, category: string}> } = {
      "Aeration Blowers": [
        { task: "Inspect and clean air intake filters", estimated: "45 min", category: "Essential" },
        { task: "Check belt tension and condition", estimated: "30 min", category: "Essential" },
        { task: "Inspect motor bearings and lubricate if necessary", estimated: "60 min", category: "Essential" },
        { task: "Check and record amperage draw", estimated: "15 min", category: "Essential" },
        { task: "Inspect diffuser membrane condition", estimated: "90 min", category: "Essential" },
        { task: "Check for unusual vibration or noise", estimated: "30 min", category: "Essential" },
        { task: "Test pressure relief valve", estimated: "15 min", category: "Safety" }
      ],
      "Clarifier Drive": [
        { task: "Inspect drive unit for leaks", estimated: "30 min", category: "Essential" },
        { task: "Check oil level and condition", estimated: "15 min", category: "Essential" },
        { task: "Inspect drive chain and sprockets", estimated: "45 min", category: "Essential" },
        { task: "Check skimmer arm condition", estimated: "30 min", category: "Essential" },
        { task: "Inspect and lubricate bearings", estimated: "60 min", category: "Essential" },
        { task: "Check weir condition and levelness", estimated: "45 min", category: "Essential" }
      ],
      "Chemical Dosing Pumps": [
        { task: "Calibrate pump flow rate", estimated: "45 min", category: "Essential" },
        { task: "Inspect tubing for wear or damage", estimated: "30 min", category: "Essential" },
        { task: "Check for leaks at connection points", estimated: "30 min", category: "Essential" },
        { task: "Clean injection points", estimated: "60 min", category: "Essential" },
        { task: "Test check valves", estimated: "30 min", category: "Essential" },
        { task: "Inspect diaphragm condition", estimated: "45 min", category: "Essential" }
      ],
      "UV Disinfection System": [
        { task: "Check UV intensity", estimated: "15 min", category: "Essential" },
        { task: "Clean quartz sleeves", estimated: "60 min", category: "Essential" },
        { task: "Inspect and clean UV sensors", estimated: "30 min", category: "Essential" },
        { task: "Check lamp age and replace if necessary", estimated: "90 min", category: "Essential" },
        { task: "Inspect wiper mechanisms", estimated: "45 min", category: "Essential" },
        { task: "Check ballast operation", estimated: "30 min", category: "Essential" }
      ],
      "Sludge Dewatering Unit": [
        { task: "Inspect belt condition", estimated: "45 min", category: "Essential" },
        { task: "Check belt tracking and tension", estimated: "60 min", category: "Essential" },
        { task: "Inspect and clean spray nozzles", estimated: "90 min", category: "Essential" },
        { task: "Check polymer mixing system", estimated: "30 min", category: "Essential" },
        { task: "Inspect bearings and lubricate", estimated: "60 min", category: "Essential" },
        { task: "Check drive motor and gearbox", estimated: "45 min", category: "Essential" }
      ]
    }
    
    return taskLists[equipment] || []
  }
  
  // Get the appropriate status badge for a maintenance item
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "operational":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Operational</Badge>
      case "needs attention":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Needs Attention</Badge>
      case "critical":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Critical</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  // Get the appropriate priority badge for a maintenance item
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return <Badge className="bg-red-50 text-red-700 border-red-200">High</Badge>
      case "medium":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Medium</Badge>
      case "low":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Low</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }
  
  // Get appropriate color class for days until maintenance
  const getDaysUntilColor = (days: number) => {
    if (days < 0) return "text-red-600"
    if (days <= 7) return "text-amber-600"
    return "text-emerald-600"
  }
  
  // Generate plant reliability index
  const plantReliabilityIndex = 94.7
  
  // Equipment with the highest maintenance priority
  const criticalMaintenance = maintenanceData.find(item => item.priority.toLowerCase() === "high")
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Plant Reliability Index</CardTitle>
            <CardDescription>Overall equipment reliability status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#f3f4f6"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={plantReliabilityIndex >= 90 ? "#10b981" : plantReliabilityIndex >= 75 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10"
                    strokeDasharray={`${(plantReliabilityIndex / 100) * 283} 283`}
                    strokeDashoffset="0"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold">{plantReliabilityIndex}%</span>
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {plantReliabilityIndex >= 90 ? (
                    <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                  )}
                  <span className={plantReliabilityIndex >= 90 ? "text-emerald-600" : "text-amber-600"}>
                    {plantReliabilityIndex >= 90 ? "Excellent" : "Needs Improvement"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Based on equipment health metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Maintenance Compliance</CardTitle>
            <CardDescription>Scheduled vs. completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Preventive Maintenance</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">73 completed / 79 scheduled</span>
                  <span className="text-xs text-emerald-500">On Track</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Corrective Maintenance</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <Progress value={87} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">26 completed / 30 identified</span>
                  <span className="text-xs text-amber-500">Attention Needed</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Safety Inspections</span>
                  <span className="text-sm font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2" />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">12 completed / 12 scheduled</span>
                  <span className="text-xs text-emerald-500">Complete</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Upcoming Maintenance</CardTitle>
            <CardDescription>Highest priority task</CardDescription>
          </CardHeader>
          <CardContent>
            {criticalMaintenance ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{criticalMaintenance.equipment}</h3>
                  {getPriorityBadge(criticalMaintenance.priority)}
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    Due: {criticalMaintenance.nextService} 
                    <span className={`ml-1 font-medium ${getDaysUntilColor(getDaysUntil(criticalMaintenance.nextService))}`}>
                      ({getDaysUntil(criticalMaintenance.nextService)} days)
                    </span>
                  </span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <WrenchIcon className="h-4 w-4 mr-1" />
                  <span>Last service: {criticalMaintenance.lastService}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500">
                  <Gauge className="h-4 w-4 mr-1" />
                  <span>Current status: {criticalMaintenance.status}</span>
                </div>
                
                <Button 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => setSelectedEquipment(criticalMaintenance.equipment)}
                >
                  View Details
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2" />
                <p className="text-center text-gray-500">No high priority maintenance tasks at this time</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Maintenance Schedule</CardTitle>
          <CardDescription>Upcoming and recent maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Last Service</TableHead>
                  <TableHead>Next Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceData.map((item, index) => (
                  <TableRow 
                    key={index}
                    className={selectedEquipment === item.equipment ? "bg-sky-50" : ""}
                  >
                    <TableCell className="font-medium">{item.equipment}</TableCell>
                    <TableCell>{item.lastService}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{item.nextService}</span>
                        <Badge
                          className={`${
                            getDaysUntil(item.nextService) < 0
                              ? "bg-red-50 text-red-700"
                              : getDaysUntil(item.nextService) <= 7
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {getDaysUntil(item.nextService) < 0
                            ? "Overdue"
                            : getDaysUntil(item.nextService) <= 7
                            ? "Soon"
                            : `${getDaysUntil(item.nextService)} days`}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedEquipment(selectedEquipment === item.equipment ? null : item.equipment)}
                      >
                        {selectedEquipment === item.equipment ? "Hide" : "View"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedEquipment && (
        <div className="space-y-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">{selectedEquipment} Maintenance Details</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2"
              onClick={() => setSelectedEquipment(null)}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Maintenance History</CardTitle>
                <CardDescription>Recent service records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generateMaintenanceHistory(selectedEquipment).map((record, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium">{record.date}</span>
                          <Badge 
                            className={`ml-2 ${
                              record.type === "Preventive" 
                                ? "bg-blue-50 text-blue-700" 
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {record.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">Tech: {record.technician}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Parts Used:</span> {record.parts}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Upcoming Maintenance Plan</CardTitle>
                <CardDescription>Task list for next service</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">
                        {maintenanceData.find(item => item.equipment === selectedEquipment)?.nextService}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-blue-600" />
                      <span>
                        {generateTaskList(selectedEquipment).length} tasks
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {generateTaskList(selectedEquipment).map((task, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-start">
                          <div className="h-5 w-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{task.task}</div>
                            <div className="text-xs text-gray-500">Est. Time: {task.estimated}</div>
                          </div>
                        </div>
                        <Badge className={`${
                          task.category === "Essential" 
                            ? "bg-blue-50 text-blue-700" 
                            : task.category === "Safety" 
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                        }`}>
                          {task.category}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <BellIcon className="h-4 w-4 mr-2" />
                      Set Reminder
                    </Button>
                    <Button size="sm" className="flex items-center">
                      <ArrowRightCircle className="h-4 w-4 mr-2" />
                      Schedule Service
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaintenanceSchedule