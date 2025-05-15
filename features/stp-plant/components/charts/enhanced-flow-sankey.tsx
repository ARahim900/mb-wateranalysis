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

export const EnhancedFlowSankey: React.FC<EnhancedFlowSankeyProps> = ({
  data,
  title = "Water Flow Sankey Diagram",
}) => {
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
    const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index } = props

    const source = data.links[index].source
    const target = data.links[index].target
    const { source: sourceColor, target: targetColor } = getLinkColor(source, target)

    return (
      <g>
        <defs>
          <linearGradient id={`linkGradient${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
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
          stroke={`url(#linkGradient${index})`}
          strokeWidth={linkWidth}
          strokeOpacity="0.8"
        />
      </g>
    )
  }

  const CustomNode = (props: any) => {
    const { x, y, width, height, index, payload } = props
    const color = nodeColors[index % nodeColors.length]

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
          {payload.name}
        </text>
      </g>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 h-full">
      <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <Sankey
            data={data}
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
