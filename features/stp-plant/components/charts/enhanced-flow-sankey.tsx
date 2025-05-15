"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveSankey } from "@nivo/sankey"

interface FlowSankeyProps {
  data: {
    nodes: { name: string }[]
    links: { source: number; target: number; value: number }[]
  }
}

export function EnhancedFlowSankey({ data }: FlowSankeyProps) {
  // Create a safer version of the data with direct string IDs
  // instead of relying on indexes that might be out of bounds
  const safeNodes = data.nodes.map((node, index) => ({ 
    id: `node_${index}`,
    label: node.name || `Node ${index}`
  }))
  
  const safeLinks = data.links
    .filter(link => 
      // Ensure source and target indexes are valid
      typeof link.source === 'number' && 
      typeof link.target === 'number' && 
      link.source >= 0 && 
      link.source < data.nodes.length &&
      link.target >= 0 && 
      link.target < data.nodes.length
    )
    .map(link => ({
      source: `node_${link.source}`,
      target: `node_${link.target}`,
      value: link.value
    }))
  
  // Only render if we have valid data
  const hasValidData = safeNodes.length > 0 && safeLinks.length > 0
  
  if (!hasValidData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Water Flow Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-500">Insufficient data for flow visualization</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Water Flow Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveSankey
            data={{
              nodes: safeNodes,
              links: safeLinks
            }}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={{ scheme: "blues" }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={0.6}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={16}
            labelTextColor={{ from: "color", modifiers: [["darker", 1]] }}
            animate={true}
            motionConfig="gentle"
            tooltip={({ node, link }) => {
              if (node) {
                return (
                  <div className="bg-white p-2 rounded-md border shadow-sm text-sm">
                    <strong>{node.label}</strong>: {node.value?.toLocaleString() || 0} m³
                  </div>
                )
              }
              if (link) {
                return (
                  <div className="bg-white p-2 rounded-md border shadow-sm text-sm">
                    <strong>{link.source.label} → {link.target.label}</strong>: {link.value.toLocaleString()} m³
                  </div>
                )
              }
              return null
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
