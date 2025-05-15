import type React from "react"
import { Sankey, Tooltip, ResponsiveContainer, Rectangle } from "recharts"

interface SankeyNode {
  name: string
}

interface SankeyLink {
  source: number
  target: number
  value: number
}

interface EnhancedFlowSankeyProps {
  data: {
    nodes: SankeyNode[]
    links: SankeyLink[]
  }
  title?: string
}

// Helper function to ensure a value is a valid number
const ensureNumber = (value: any, defaultValue = 0): number => {
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

export const EnhancedFlowSankey: React.FC<EnhancedFlowSankeyProps> = ({
  data,
  title = "Water Flow Sankey Diagram",
}) => {
  // Ensure data has valid nodes and links
  const safeData = {
    nodes: Array.isArray(data?.nodes) ? data.nodes : [{ name: "No Data" }],
    links: Array.isArray(data?.links) ? data.links : [],
  }

  // Custom colors for the nodes
  const nodeColors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
    "#06b6d4", // cyan-500
  ]

  // Custom colors for the links
  const getLinkColor = (sourceIndex: number, targetIndex: number) => {
    const sourceColor = nodeColors[sourceIndex % nodeColors.length]
    const targetColor = nodeColors[targetIndex % nodeColors.length]

    return {
      source: sourceColor,
      target: targetColor,
    }
  }

  const CustomLink = (props: any) => {
    // Ensure all position values are valid numbers
    const sourceX = ensureNumber(props.sourceX)
    const targetX = ensureNumber(props.targetX)
    const sourceY = ensureNumber(props.sourceY)
    const targetY = ensureNumber(props.targetY)
    const sourceControlX = ensureNumber(props.sourceControlX)
    const targetControlX = ensureNumber(props.targetControlX)
    const linkWidth = ensureNumber(props.linkWidth, 1)

    // Safely access source and target from payload
    const payload = props.payload || {}
    const sourceIndex = ensureNumber(payload.source, 0)
    const targetIndex = ensureNumber(payload.target, 0)

    const { source: sourceColor, target: targetColor } = getLinkColor(sourceIndex, targetIndex)

    // If any of the position values are still NaN, don't render the link
    if ([sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX].some(isNaN)) {
      return null
    }

    return (
      <g>
        <defs>
          <linearGradient id={`linkGradient${sourceIndex}-${targetIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={sourceColor} stopOpacity={0.6} />
            <stop offset="100%" stopColor={targetColor} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <path
          d={`
            M${sourceX},${sourceY}
            C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
          `}
          fill="none"
          stroke={`url(#linkGradient${sourceIndex}-${targetIndex})`}
          strokeWidth={linkWidth}
          strokeOpacity="0.8"
        />
      </g>
    )
  }

  const CustomNode = (props: any) => {
    // Ensure all position and dimension values are valid numbers
    const x = ensureNumber(props.x)
    const y = ensureNumber(props.y)
    const width = ensureNumber(props.width, 10)
    const height = ensureNumber(props.height, 10)
    const index = ensureNumber(props.index, 0)

    // Safely access payload and name
    const payload = props.payload || {}
    const nodeName = payload.name || `Node ${index}`
    const color = nodeColors[index % nodeColors.length]

    // If any of the position or dimension values are still NaN, don't render the node
    if ([x, y, width, height].some(isNaN)) {
      return null
    }

    return (
      <g>
        <Rectangle x={x} y={y} width={width} height={height} fill={color} fillOpacity="0.8" />
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          fontSize={12}
          fontWeight="bold"
        >
          {nodeName}
        </text>
      </g>
    )
  }

  // If there are no valid links, show a placeholder message
  if (safeData.links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
        <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
        <div className="w-full h-[400px] flex items-center justify-center">
          <p className="text-gray-500">No flow data available for the selected period.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={safeData}
            node={<CustomNode />}
            link={<CustomLink />}
            nodePadding={50}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Tooltip formatter={(value) => `${value} m³`} labelFormatter={(name) => `Node: ${name}`} />
          </Sankey>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500">
        <p>This diagram shows the flow of water through different stages of the STP plant.</p>
      </div>
    </div>
  )
}
