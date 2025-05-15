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
  // Transform data to be compatible with Nivo's Sankey
  const transformedData = {
    nodes: data.nodes.map(node => ({ id: node.name })),
    links: data.links.map(link => ({
      source: data.nodes[link.source]?.name || "Unknown",
      target: data.nodes[link.target]?.name || "Unknown",
      value: link.value,
    }))
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Water Flow Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveSankey
            data={transformedData}
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
            tooltip={({ node }) => {
              return (
                <div className="bg-white p-2 rounded-md border shadow-sm text-sm">
                  <strong>{node.id}:</strong> {node.value.toLocaleString()} m³
                </div>
              )
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
