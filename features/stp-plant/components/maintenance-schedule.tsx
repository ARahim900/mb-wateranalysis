import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  WrenchIcon, 
  CalendarDays, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ClipboardCheck,
  AlertCircle,
  FileText,
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Calendar,
  CircleDollarSign,
  PlusCircle,
  DownloadIcon
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MaintenanceItem {
  equipment: string
  lastService: string
  nextService: string
  status: string
  priority: "high" | "medium" | "low"
}

interface MaintenanceScheduleProps {
  maintenanceData: MaintenanceItem[]
}

export default function MaintenanceSchedule({
  maintenanceData
}: MaintenanceScheduleProps) {
  // Generate synthetic scheduled maintenance tasks
  const scheduledMaintenance = [
    {
      id: "M001",
      equipment: "Aeration Blowers",
      task: "Belt Replacement",
      scheduledDate: "2025-05-22",
      assignedTo: "Engineering",
      estimatedHours: 4,
      status: "Scheduled"
    },
    {
      id: "M002",
      equipment: "Chemical Dosing Pumps",
      task: "Calibration & Seal Replacement",
      scheduledDate: "2025-05-18",
      assignedTo: "Operations",
      estimatedHours: 3,
      status: "Scheduled"
    },
    {
      id: "M003",
      equipment: "Clarifier Drive",
      task: "Lubrication & Inspection",
      scheduledDate: "2025-06-15",
      assignedTo: "Maintenance",
      estimatedHours: 2,
      status: "Scheduled"
    },
    {
      id: "M004",
      equipment: "UV Disinfection System",
      task: "Lamp Replacement",
      scheduledDate: "2025-05-25",
      assignedTo: "Operations",
      estimatedHours: 6,
      status: "Scheduled"
    },
    {
      id: "M005",
      equipment: "Flow Meters",
      task: "Calibration",
      scheduledDate: "2025-05-30",
      assignedTo: "Instrumentation",
      estimatedHours: 3,
      status: "Scheduled"
    }
  ]
  
  // Generate synthetic work orders
  const workOrders = [
    {
      id: "WO2025-042",
      equipment: "RAS Pump #2",
      description: "Bearing noise and vibration",
      priority: "high",
      status: "In Progress",
      dateReported: "2025-05-10",
      assignedTo: "Maintenance"
    },
    {
      id: "WO2025-043",
      equipment: "Polymer Mixer",
      description: "Motor tripping on overload",
      priority: "medium",
      status: "Pending Parts",
      dateReported: "2025-05-12",
      assignedTo: "Electrical"
    },
    {
      id: "WO2025-044",
      equipment: "Chlorine Analyzer",
      description: "Out of calibration",
      priority: "low",
      status: "Scheduled",
      dateReported: "2025-05-14",
      assignedTo: "Instrumentation"
    },
    {
      id: "WO2025-041",
      equipment: "Sludge Conveyor",
      description: "Belt tracking issue",
      priority: "medium",
      status: "Completed",
      dateReported: "2025-05-08",
      assignedTo: "Maintenance"
    }
  ]
  
  // Generate synthetic spare parts inventory
  const sparePartsInventory = [
    {
      id: "P001",
      name: "Aeration Diffuser Membranes",
      quantity: 24,
      minQuantity: 10,
      orderStatus: "In stock",
      location: "Warehouse A-12"
    },
    {
      id: "P002",
      name: "Blower Bearing Kit",
      quantity: 3,
      minQuantity: 2,
      orderStatus: "In stock",
      location: "Warehouse B-5"
    },
    {
      id: "P003",
      name: "Dosing Pump Diaphragm",
      quantity: 1,
      minQuantity: 4,
      orderStatus: "On order",
      location: "Warehouse A-3"
    },
    {
      id: "P004",
      name: "UV Lamp (254nm)",
      quantity: 8,
      minQuantity: 6,
      orderStatus: "In stock",
      location: "Warehouse C-8"
    },
    {
      id: "P005",
      name: "Clarifier Drive Gear",
      quantity: 0,
      minQuantity: 1,
      orderStatus: "Critical - Ordering",
      location: "Warehouse B-7"
    }
  ]
  
  // Generate synthetic maintenance costs
  const maintenanceCosts = [
    {
      category: "Preventive Maintenance",
      monthlyAverage: 4200,
      yearToDate: 18600,
      previousYear: 52000
    },
    {
      category: "Corrective Maintenance",
      monthlyAverage: 3100,
      yearToDate: 12900,
      previousYear: 38700
    },
    {
      category: "Parts & Materials",
      monthlyAverage: 2800,
      yearToDate: 11400,
      previousYear: 33600
    },
    {
      category: "External Services",
      monthlyAverage: 1900,
      yearToDate: 8500,
      previousYear: 24800
    }
  ]

  // Function to get priority badge
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "high":
        return <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mr-1" /> High
        </Badge>
      case "medium":
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3 mr-1" /> Medium
        </Badge>
      case "low":
        return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-3 w-3 mr-1" /> Low
        </Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }
  
  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Operational":
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Operational
        </Badge>
      case "Needs Attention":
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <AlertTriangle className="h-3 w-3 mr-1" /> Needs Attention
        </Badge>
      case "Out of Service":
        return <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <AlertCircle className="h-3 w-3 mr-1" /> Out of Service
        </Badge>
      case "In Progress":
        return <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
          <Clock className="h-3 w-3 mr-1" /> In Progress
        </Badge>
      case "Scheduled":
        return <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
          <Calendar className="h-3 w-3 mr-1" /> Scheduled
        </Badge>
      case "Completed":
        return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
        </Badge>
      case "Pending Parts":
        return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
          <Clock className="h-3 w-3 mr-1" /> Pending Parts
        </Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  // Function to get stock status badge
  const getStockStatusBadge = (orderStatus: string, quantity: number, minQuantity: number) => {
    if (orderStatus === "Critical - Ordering") {
      return <Badge className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle className="h-3 w-3 mr-1" /> Out of Stock
      </Badge>
    } else if (quantity < minQuantity) {
      return <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400">
        <AlertTriangle className="h-3 w-3 mr-1" /> Low Stock
      </Badge>
    } else {
      return <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
        <CheckCircle2 className="h-3 w-3 mr-1" /> In Stock
      </Badge>
    }
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="schedule" className="w-full">
        <TabsList className="mb-6 w-full justify-start overflow-auto">
          <TabsTrigger value="schedule">
            <CalendarDays className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="work-orders">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Work Orders
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <FileText className="h-4 w-4 mr-2" />
            Spare Parts
          </TabsTrigger>
          <TabsTrigger value="costs">
            <CircleDollarSign className="h-4 w-4 mr-2" />
            Costs
          </TabsTrigger>
        </TabsList>
        
        {/* Maintenance Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          {/* Equipment Status Overview */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <WrenchIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Equipment Maintenance Status
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
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
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.equipment}</TableCell>
                        <TableCell>{item.lastService}</TableCell>
                        <TableCell>{item.nextService}</TableCell>
                        <TableCell>
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell>
                          {getPriorityBadge(item.priority)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                              <DropdownMenuItem>View History</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Generate Report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Scheduled Maintenance Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                  Scheduled Maintenance Tasks
                </CardTitle>
                <Button variant="outline" size="sm" className="h-8">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  New Task
                </Button>
              </div>
              <CardDescription>
                Upcoming maintenance activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Est. Hours</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledMaintenance.map((task, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{task.id}</TableCell>
                        <TableCell>{task.equipment}</TableCell>
                        <TableCell>{task.task}</TableCell>
                        <TableCell>{new Date(task.scheduledDate).toLocaleDateString()}</TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>{task.estimatedHours}h</TableCell>
                        <TableCell>
                          {getStatusBadge(task.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Maintenance Calendar Preview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-blue-600" />
                Maintenance Calendar Overview
              </CardTitle>
              <CardDescription>
                Upcoming 15-day schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                <div className="col-span-5 flex justify-between mb-2">
                  <Button variant="outline" size="sm" className="h-8">
                    Previous
                  </Button>
                  <div className="font-medium">May 15-30, 2025</div>
                  <Button variant="outline" size="sm" className="h-8">
                    Next
                  </Button>
                </div>
                
                {Array.from({ length: 15 }, (_, i) => {
                  const date = new Date(2025, 4, 15 + i) // May 15, 2025 + i days
                  const dayOfMonth = date.getDate()
                  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date)
                  const isToday = i === 0
                  const hasEvent = [3, 7, 10].includes(i) // Example days with events
                  
                  return (
                    <div 
                      key={i} 
                      className={`p-2 border rounded-md text-center ${
                        isToday 
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' 
                          : hasEvent
                          ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                          : ''
                      }`}
                    >
                      <div className="text-sm font-medium">{dayName}</div>
                      <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                        {dayOfMonth}
                      </div>
                      {hasEvent && (
                        <div className="mt-1">
                          <span className="inline-block w-2 h-2 rounded-full bg-amber-500"></span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium">Upcoming Events:</div>
                <div className="space-y-2">
                  <div className="flex items-center p-2 border rounded-md bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                    <div>
                      <div className="text-sm font-medium">May 18, 2025</div>
                      <div className="text-xs text-gray-500">Chemical Dosing Pumps - Calibration & Seal Replacement</div>
                    </div>
                  </div>
                  <div className="flex items-center p-2 border rounded-md bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                    <div>
                      <div className="text-sm font-medium">May 22, 2025</div>
                      <div className="text-xs text-gray-500">Aeration Blowers - Belt Replacement</div>
                    </div>
                  </div>
                  <div className="flex items-center p-2 border rounded-md bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                    <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                    <div>
                      <div className="text-sm font-medium">May 25, 2025</div>
                      <div className="text-xs text-gray-500">UV Disinfection System - Lamp Replacement</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Work Orders Tab */}
        <TabsContent value="work-orders" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="grid grid-cols-4 gap-4 flex-1">
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {workOrders.length}
                    </div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Work Orders</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">
                      {workOrders.filter(wo => wo.status === "In Progress").length}
                    </div>
                    <p className="text-sm text-amber-600 dark:text-amber-400">In Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                      {workOrders.filter(wo => wo.status === "Pending Parts" || wo.status === "Scheduled").length}
                    </div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Pending</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                <CardContent className="p-4">
                  <div className="flex flex-col items-center">
                    <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                      {workOrders.filter(wo => wo.status === "Completed").length}
                    </div>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400">Completed</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ClipboardCheck className="h-5 w-5 mr-2 text-blue-600" />
                  Work Orders
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="default" size="sm" className="h-8">
                    <PlusCircle className="h-4 w-4 mr-1" />
                    New Work Order
                  </Button>
                </div>
              </div>
              <CardDescription>
                Current maintenance work orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Equipment</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workOrders.map((workOrder, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{workOrder.id}</TableCell>
                        <TableCell>{workOrder.equipment}</TableCell>
                        <TableCell>{workOrder.description}</TableCell>
                        <TableCell>{new Date(workOrder.dateReported).toLocaleDateString()}</TableCell>
                        <TableCell>{workOrder.assignedTo}</TableCell>
                        <TableCell>
                          {getPriorityBadge(workOrder.priority)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(workOrder.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Update Status</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Close Work Order</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Spare Parts Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Spare Parts Inventory
                </CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] h-8">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                Current spare parts inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Part Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Min Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sparePartsInventory.map((part, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{part.id}</TableCell>
                        <TableCell>{part.name}</TableCell>
                        <TableCell>{part.quantity}</TableCell>
                        <TableCell>{part.minQuantity}</TableCell>
                        <TableCell>
                          {getStockStatusBadge(part.orderStatus, part.quantity, part.minQuantity)}
                        </TableCell>
                        <TableCell>{part.location}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Update Quantity</DropdownMenuItem>
                              <DropdownMenuItem>Order More</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Usage History</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Inventory Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                  Inventory Alerts
                </CardTitle>
                <CardDescription>
                  Items requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sparePartsInventory
                    .filter(part => part.quantity < part.minQuantity)
                    .map((part, index) => (
                      <div 
                        key={index} 
                        className={`border p-4 rounded-lg ${
                          part.quantity === 0 
                            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                            : 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium flex items-center">
                            {part.quantity === 0 
                              ? <AlertCircle className="h-4 w-4 mr-2 text-red-600" /> 
                              : <AlertTriangle className="h-4 w-4 mr-2 text-amber-600" />}
                            {part.name}
                          </h3>
                          <Badge variant="outline" className={part.quantity === 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                          }>
                            {part.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          </Badge>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Current Quantity:</span>
                          <span className="font-medium">{part.quantity}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">Min Quantity:</span>
                          <span className="font-medium">{part.minQuantity}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium">{part.orderStatus}</span>
                        </div>
                        
                        <div className="mt-3">
                          <Button size="sm" className="w-full">
                            Reorder Now
                          </Button>
                        </div>
                      </div>
                    ))}
                  
                  {sparePartsInventory.filter(part => part.quantity < part.minQuantity).length === 0 && (
                    <div className="bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 p-4 rounded-lg text-center">
                      <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-emerald-600" />
                      <p className="font-medium text-emerald-600">All parts are within inventory thresholds</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ArrowUpDown className="h-5 w-5 mr-2 text-blue-600" />
                  Inventory Movement
                </CardTitle>
                <CardDescription>
                  Recent usage trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Most Used Parts (Last 30 Days)</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>UV Lamp (254nm)</span>
                          <span className="font-medium">12 units</span>
                        </div>
                        <Progress value={80} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Dosing Pump Diaphragm</span>
                          <span className="font-medium">8 units</span>
                        </div>
                        <Progress value={53} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Aeration Diffuser Membranes</span>
                          <span className="font-medium">6 units</span>
                        </div>
                        <Progress value={40} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Blower Bearing Kit</span>
                          <span className="font-medium">3 units</span>
                        </div>
                        <Progress value={20} className="h-1.5" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Transactions</h3>
                    <div className="space-y-2">
                      <div className="border rounded-md p-2 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">UV Lamp (254nm)</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">-2 units</Badge>
                        </div>
                        <div className="text-gray-500">Used for UV System Maintenance • May 10, 2025</div>
                      </div>
                      <div className="border rounded-md p-2 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Dosing Pump Diaphragm</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700">-1 unit</Badge>
                        </div>
                        <div className="text-gray-500">Chemical Pump Repair • May 12, 2025</div>
                      </div>
                      <div className="border rounded-md p-2 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Aeration Diffuser Membranes</span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700">+12 units</Badge>
                        </div>
                        <div className="text-gray-500">Received New Order • May 14, 2025</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Maintenance Costs Tab */}
        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium flex items-center">
                  <CircleDollarSign className="h-5 w-5 mr-2 text-blue-600" />
                  Maintenance Cost Analysis
                </CardTitle>
                <div className="flex gap-2">
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-[150px] h-8">
                      <SelectValue placeholder="Time Period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" className="h-8">
                    <DownloadIcon className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>
                Analysis of maintenance expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Monthly Average ($)</TableHead>
                      <TableHead>Year to Date ($)</TableHead>
                      <TableHead>Previous Year ($)</TableHead>
                      <TableHead>YoY Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceCosts.map((cost, index) => {
                      const annualizedCurrent = cost.monthlyAverage * 12
                      const yoyChange = ((annualizedCurrent - cost.previousYear) / cost.previousYear) * 100
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{cost.category}</TableCell>
                          <TableCell>${cost.monthlyAverage.toLocaleString()}</TableCell>
                          <TableCell>${cost.yearToDate.toLocaleString()}</TableCell>
                          <TableCell>${cost.previousYear.toLocaleString()}</TableCell>
                          <TableCell className={yoyChange < 0 ? 'text-emerald-600' : 'text-red-600'}>
                            {yoyChange.toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="font-bold">
                        ${maintenanceCosts.reduce((sum, cost) => sum + cost.monthlyAverage, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        ${maintenanceCosts.reduce((sum, cost) => sum + cost.yearToDate, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        ${maintenanceCosts.reduce((sum, cost) => sum + cost.previousYear, 0).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold">
                        {(((maintenanceCosts.reduce((sum, cost) => sum + cost.monthlyAverage, 0) * 12) / 
                           maintenanceCosts.reduce((sum, cost) => sum + cost.previousYear, 0) - 1) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-sm font-medium mb-4">Cost Distribution</h3>
                  <div className="h-64">
                    {/* This would be a proper chart in a real implementation */}
                    <div className="space-y-4">
                      {maintenanceCosts.map((cost, index) => {
                        const percentage = (cost.monthlyAverage / maintenanceCosts.reduce((sum, c) => sum + c.monthlyAverage, 0)) * 100
                        
                        return (
                          <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                              <span>{cost.category}</span>
                              <span className="font-medium">{percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  index === 0 ? 'bg-blue-500' :
                                  index === 1 ? 'bg-emerald-500' :
                                  index === 2 ? 'bg-amber-500' :
                                  'bg-purple-500'
                                }`}
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-4">Monthly Trend (Last 6 Months)</h3>
                  <div className="h-64">
                    {/* This would be a proper chart in a real implementation */}
                    <div className="h-full flex items-end gap-1">
                      {[12000, 11500, 12200, 10800, 11700, 12000].map((cost, index) => {
                        const month = new Date(2025, 4 - index, 1)
                        const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(month)
                        const percentage = (cost / 15000) * 100 // Normalize to max height
                        
                        return (
                          <div 
                            key={index} 
                            className="flex-1 flex flex-col items-center justify-end"
                          >
                            <div 
                              className="w-full bg-blue-500 rounded-t-sm"
                              style={{ height: `${percentage}%` }}
                            ></div>
                            <div className="text-xs text-gray-500 mt-1">{monthName}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Cost Optimization Recommendations</h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                        Preventive Maintenance Schedule Optimization
                      </h3>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">High Impact</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Optimize the PM schedule based on equipment performance data, reducing frequency for reliable equipment and focusing on critical assets.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Estimated savings:</span>
                      <span className="font-medium text-emerald-600">$14,000 - $20,000 annually</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                        Spare Parts Inventory Management
                      </h3>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Medium Impact</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Implement just-in-time inventory practices for non-critical parts and establish vendor-managed inventory for common consumables.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Estimated savings:</span>
                      <span className="font-medium text-emerald-600">$8,000 - $12,000 annually</span>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-600" />
                        Consolidate Maintenance Service Contracts
                      </h3>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700">Medium Impact</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Negotiate multi-year service contracts with preferred vendors for equipment maintenance, leveraging volume discounts.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Estimated savings:</span>
                      <span className="font-medium text-emerald-600">$6,000 - $10,000 annually</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}