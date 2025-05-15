"use client"

import { useMemo } from "react"
import { ResponsiveSankey, type SankeyLinkProps } from "@nivo/sankey"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { MonthlyAggregate } from "../../utils/data-parser"

interface FlowSankeyChartProps {
  data: MonthlyAggregate | null
}

export function FlowSankeyChart({ data }: FlowSankeyChartProps) {
  const sankeyData = useMemo(() => {
    if (!data) return { nodes: [], links: [] }

    // Calculate the values
    const tankerVolume = data.totalTankerVolume
    const directSewage = data.totalDirectSewage
    const treatedWater = data.totalTreatedWater
    const irrigationOutput = data.totalIrrigationOutput
    const treatmentLoss = data.totalInletSewage - data.totalTreatedWater
    const distributionLoss = data.totalTreatedWater - data.totalIrrigationOutput

    return {
      nodes: [
        { id: "tankers", label: "Tanker Discharge" },
        { id: "direct", label: "Direct Inline Sewage" },
        { id: "inlet", label: "Total Inlet" },
        { id: "treated", label: "Treated Water" },
        { id: "irrigation", label: "Irrigation Output" },
        { id: "treatmentLoss", label: "Treatment Loss" },
        { id: "distributionLoss", label: "Distribution Loss" },
      ],
      links: [
        { source: "tankers", target: "inlet", value: tankerVolume },
        { source: "direct", target: "inlet", value: directSewage },
        { source: "inlet", target: "treated", value: treatedWater },
        { source: "inlet", target: "treatmentLoss", value: treatmentLoss },
        { source: "treated", target: "irrigation", value: irrigationOutput },
        { source: "treated", target: "distributionLoss", value: distributionLoss },
      ],
    }
  }, [data])

  if (!data) return null

  return (
    <Card className="col-span-2">
      <CardContent className="p-6">
        <SectionHeader
          title="Water Flow Sankey Diagram"
          description="Visualizes the flow of water through the STP plant"
        />
        <div className="h-96">
          <ResponsiveSankey
            data={sankeyData}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={{ scheme: "category10" }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderColor={{ from: "color", modifiers: [["darker", 0.8]] }}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={3}
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
                  <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
                    <strong>{node.label}</strong>: {node.value?.toLocaleString()} m³
                  </div>
                )
              }
              if (link) {
                return (
                  <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
                    <strong>{link.source.label}</strong> → <strong>{link.target.label}</strong>:{" "}
                    {link.value.toLocaleString()} m³
                  </div>
                )
              }
              return null
            }}
            linkTooltip={({ link }: { link: SankeyLinkProps }) => (
              <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
                <strong>{link.source.label}</strong> → <strong>{link.target.label}</strong>:{" "}
                {link.value.toLocaleString()} m³
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
