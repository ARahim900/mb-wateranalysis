"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sankey, Tooltip, ResponsiveContainer, Rectangle, Layer } from "recharts"
import type { STPData } from "../../hooks/use-stp-data"
import { ensureNumber } from "../../hooks/use-stp-data"
import { BASE_COLOR, ACCENT_COLOR, SUCCESS_COLOR, WARNING_COLOR, DANGER_COLOR, INFO_COLOR } from "@/lib/theme-constants"
import { Info } from "lucide-react" // Declare the Info variable

interface WaterFlowSankeyProps {
  data: STPData[]
}

// Helper function to ensure a value is a number
function ensureValidNumber(value: any): number {
  const num = ensureNumber(value)
  return isNaN(num) ? 0 : num
}

// Custom Node component with safety checks
const CustomNode = (props: any) => {
  // Safety check for props
  if (!props || !props.payload) {
    return null
  }

  // Ensure x, y, width, height are valid numbers
  const x = ensureValidNumber(props.x)
  const y = ensureValidNumber(props.y)
  const width = ensureValidNumber(props.width)
  const height = ensureValidNumber(props.height)

  // Get node name with fallback
  const name = props.payload.name || "Unknown"

  // Get node color with fallback
  const color = props.payload.color || ACCENT_COLOR

  return (
    <Rectangle x={x} y={y} width={width} height={height} fill={color} fillOpacity={0.9} rx={4} ry={4}>
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={12}
        fontWeight="bold"
      >
        {name}
      </text>
    </Rectangle>
  )
}

// Custom Link component with safety checks
const CustomLink = (props: any) => {
  // Safety check for props
  if (!props || !props.sourceX === undefined || !props.targetX === undefined) {
    return null
  }

  // Ensure all coordinates are valid numbers
  const sourceX = ensureValidNumber(props.sourceX)
  const sourceY = ensureValidNumber(props.sourceY)
  const sourceControlX = ensureValidNumber(props.sourceControlX)
  const targetX = ensureValidNumber(props.targetX)
  const targetY = ensureValidNumber(props.targetY)
  const targetControlX = ensureValidNumber(props.targetControlX)
  const linkWidth = ensureValidNumber(props.linkWidth)

  // Get link color with fallback
  const color = props.payload?.color || BASE_COLOR

  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      fill="none"
      stroke={color}
      strokeWidth={linkWidth}
      strokeOpacity={0.3}
    />
  )
}

export function WaterFlowSankey({ data }: WaterFlowSankeyProps) {
  const sankeyData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        nodes: [],
        links: [],
      }
    }

    // Calculate totals
    const tankerVolume = data.reduce((sum, item) => sum + ensureValidNumber(item.expectedTankerVolume), 0)
    const directSewage = data.reduce((sum, item) => sum + ensureValidNumber(item.directInlineSewage), 0)
    const totalInlet = data.reduce((sum, item) => sum + ensureValidNumber(item.totalInletSewage), 0)
    const totalTreated = data.reduce((sum, item) => sum + ensureValidNumber(item.totalTreatedWater), 0)
    const totalTSE = data.reduce((sum, item) => sum + ensureValidNumber(item.totalTSEWater), 0)

    // Calculate losses
    const treatmentLoss = Math.max(0, totalInlet - totalTreated)
    const irrigationLoss = Math.max(0, totalTreated - totalTSE)

    return {
      nodes: [
        { name: "Tanker Discharge", color: BASE_COLOR },
        { name: "Direct Sewage", color: INFO_COLOR },
        { name: "Total Inlet", color: ACCENT_COLOR },
        { name: "Treatment Process", color: "#8B5CF6" },
        { name: "Treated Water", color: SUCCESS_COLOR },
        { name: "TSE for Irrigation", color: "#059669" },
        { name: "Treatment Loss", color: DANGER_COLOR },
        { name: "Distribution Loss", color: WARNING_COLOR },
      ],
      links: [
        { source: 0, target: 2, value: Math.max(1, tankerVolume), color: BASE_COLOR },
        { source: 1, target: 2, value: Math.max(1, directSewage), color: INFO_COLOR },
        { source: 2, target: 3, value: Math.max(1, totalInlet), color: ACCENT_COLOR },
        { source: 3, target: 4, value: Math.max(1, totalTreated), color: "#8B5CF6" },
        { source: 3, target: 6, value: Math.max(1, treatmentLoss), color: DANGER_COLOR },
        { source: 4, target: 5, value: Math.max(1, totalTSE), color: SUCCESS_COLOR },
        { source: 4, target: 7, value: Math.max(1, irrigationLoss), color: WARNING_COLOR },
      ],
    }
  }, [data])

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/10 dark:to-gray-900/5 shadow-sm border border-gray-100 dark:border-gray-800">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-[#4E4456] font-semibold">Water Flow Sankey Diagram</CardTitle>
          <Info className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardDescription>Visualizing the complete water flow through the STP system</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <Sankey
              data={sankeyData}
              node={<CustomNode />}
              link={<CustomLink />}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              nodePadding={50}
            >
              <Tooltip
                formatter={(value) => `${value.toLocaleString()} m³`}
                labelFormatter={(name) => `${name}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "0.375rem",
                  padding: "8px 12px",
                  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                }}
              />
              <Layer />
            </Sankey>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
