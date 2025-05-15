"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { DashboardCard } from "@/components/ui/dashboard-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { SectionHeader } from "@/components/ui/section-header"
import { useDashboardData } from "@/hooks/use-dashboard-data"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

// Define the base color and generate a color palette
const BASE_COLOR = "#4E4456"
const SECONDARY_COLOR = "#8A7A94"
const ACCENT_COLOR = "#8ACCD5"
const SUCCESS_COLOR = "#50C878"
const WARNING_COLOR = "#FFB347"
const DANGER_COLOR = "#FF6B6B"
const INFO_COLOR = "#5BC0DE"

const COLORS = [SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR, ACCENT_COLOR, BASE_COLOR]

export default function ContractorDashboard() {
  const { data, isLoading } = useDashboardData("contractors", {
    summary: {
      activeContractors: 0,
      ongoingProjects: 0,
      completedThisMonth: 0,
      pendingApprovals: 0,
      completionChange: 0,
    },
    projectStatusBreakdown: [],
    contractors: [],
    recentActivities: [],
  })

  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  if (isLoading) return <LoadingSpinner />

  // Filter contractors based on status
  const filteredContractors =
    statusFilter === "all"
      ? data.contractors
      : data.contractors.filter((contractor) => contractor.status === statusFilter)

  // Sort contractors based on sortBy
  const sortedContractors = [...filteredContractors].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name)
    } else if (sortBy === "projects") {
      return b.activeProjects - a.activeProjects
    } else if (sortBy === "rating") {
      return b.rating - a.rating
    }
    return 0
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex overflow-x-auto scrollbar-hide h-auto">
          <TabsTrigger
            value="overview"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Dashboard Overview
          </TabsTrigger>
          <TabsTrigger
            value="contractors"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Contractors
          </TabsTrigger>
          <TabsTrigger
            value="projects"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="px-6 py-4 font-medium transition-all duration-200 text-sm whitespace-nowrap data-[state=active]:text-[#8ACCD5] data-[state=active]:border-b-2 data-[state=active]:border-[#8ACCD5] data-[state=inactive]:text-gray-500 data-[state=inactive]:hover:text-[#8ACCD5]"
          >
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <DashboardCard title="Active Contractors" value={data.summary.activeContractors} />
            <DashboardCard title="Ongoing Projects" value={data.summary.ongoingProjects} />
            <DashboardCard
              title="Completed This Month"
              value={data.summary.completedThisMonth}
              change={data.summary.completionChange}
            />
            <DashboardCard title="Pending Approvals" value={data.summary.pendingApprovals} />
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <SectionHeader title="Project Status" description="Current project status distribution" />
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.projectStatusBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.projectStatusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name, props) => [`${value} (${props.payload.percentage}%)`, name]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <SectionHeader title="Recent Activities" description="Latest contractor activities and updates" />
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.recentActivities.map((activity) => (
                        <TableRow key={activity.id}>
                          <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                          <TableCell>{activity.contractor}</TableCell>
                          <TableCell>{activity.description}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                activity.status === "Completed"
                                  ? "bg-green-100 text-green-800"
                                  : activity.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {activity.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contractor Performance */}
          <Card>
            <CardContent className="p-6">
              <SectionHeader title="Contractor Performance" description="Active projects by contractor" />
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.contractors}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activeProjects" name="Active Projects" fill={ACCENT_COLOR} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                title="Contractor Directory"
                description="Complete list of contractors and their details"
                actions={
                  <div className="flex flex-wrap gap-2">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="projects">Sort by Projects</option>
                      <option value="rating">Sort by Rating</option>
                    </select>
                  </div>
                }
              />
              <div className="overflow-x-auto mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contractor</TableHead>
                      <TableHead>Active Projects</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedContractors.map((contractor) => (
                      <TableRow key={contractor.id}>
                        <TableCell className="font-medium">{contractor.name}</TableCell>
                        <TableCell>{contractor.activeProjects}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-2">{contractor.rating}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${
                                    star <= Math.floor(contractor.rating)
                                      ? "text-yellow-400"
                                      : star <= contractor.rating
                                        ? "text-yellow-300"
                                        : "text-gray-300"
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              contractor.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {contractor.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <button className="px-2 py-1 text-xs bg-[#4E4456] text-white rounded-md">View</button>
                            <button className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-md">Edit</button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                title="Project Management"
                description="Track and manage all ongoing and upcoming projects"
              />
              <p className="text-gray-600">This section will contain project management tools and reports.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <Card>
            <CardContent className="p-6">
              <SectionHeader
                title="Reports & Analytics"
                description="Comprehensive reports and analytics on contractor performance"
              />
              <p className="text-gray-600">This section will contain detailed reports and analytics.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
