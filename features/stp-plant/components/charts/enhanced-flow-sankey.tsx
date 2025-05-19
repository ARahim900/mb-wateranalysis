"use client"

import { useEffect, useState } from "react"
import { Sankey, Tooltip, ResponsiveContainer, Rectangle, Layer } from "recharts"
import type { STPData } from "../hooks/use-stp-data"
import { ensureNumber } from "../hooks/use-stp-data"

interface SankeyNode {
  name: string
}

interface SankeyLink {
  source: number
  target: number
  value: number
}

interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

interface EnhancedFlowSankeyProps {
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

  return (
    <Rectangle x={x} y={y} width={width} height={height} fill="#8ACCD5" fillOpacity={0.9}>
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#fff"
        fontSize={12}
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

  return (
    <path
      d={`
        M${sourceX},${sourceY}
        C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
      `}
      fill="none"
      stroke="#4E4456"
      strokeWidth={linkWidth}
      strokeOpacity={0.2}
    />
  )
}

export function EnhancedFlowSankey({ data }: EnhancedFlowSankeyProps) {
  const [sankeyData, setSankeyData] = useState<SankeyData>({
    nodes: [
      { name: "Tanker" },
      { name: "Direct Sewage" },
      { name: "Inlet" },
      { name: "Treatment" },
      { name: "Treated Water" },
      { name: "TSE Water" },
    ],
    links: [
      { source: 0, target: 2, value: 100 },
      { source: 1, target: 2, value: 200 },
      { source: 2, target: 3, value: 300 },
      { source: 3, target: 4, value: 250 },
      { source: 4, target: 5, value: 200 },
    ],
  })

  useEffect(() => {
    if (data && data.length > 0) {
      // Calculate totals
      const tankerVolume = data.reduce((sum, item) => sum + ensureValidNumber(item.expectedTankerVolume), 0)
      const directSewage = data.reduce((sum, item) => sum + ensureValidNumber(item.directInlineSewage), 0)
      const totalInlet = data.reduce((sum, item) => sum + ensureValidNumber(item.totalInletSewage), 0)
      const totalTreated = data.reduce((sum, item) => sum + ensureValidNumber(item.totalTreatedWater), 0)
      const totalTSE = data.reduce((sum, item) => sum + ensureValidNumber(item.totalTSEWater), 0)

      // Create Sankey data
      const newSankeyData: SankeyData = {
        nodes: [
          { name: "Tanker" },
          { name: "Direct Sewage" },
          { name: "Inlet" },
          { name: "Treatment" },
          { name: "Treated Water" },
          { name: "TSE Water" },
        ],
        links: [
          { source: 0, target: 2, value: Math.max(1, tankerVolume) }, // Ensure minimum value of 1
          { source: 1, target: 2, value: Math.max(1, directSewage) },
          { source: 2, target: 3, value: Math.max(1, totalInlet) },
          { source: 3, target: 4, value: Math.max(1, totalTreated) },
          { source: 4, target: 5, value: Math.max(1, totalTSE) },
        ],
      }

      setSankeyData(newSankeyData)
    }
  }, [data])

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <Sankey
          data={sankeyData}
          node={<CustomNode />}
          link={<CustomLink />}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Tooltip formatter={(value) => `${value.toLocaleString()} m³`} labelFormatter={(name) => `${name}`} />
          <Layer />
        </Sankey>
      </ResponsiveContainer>
    </div>
  )
}
