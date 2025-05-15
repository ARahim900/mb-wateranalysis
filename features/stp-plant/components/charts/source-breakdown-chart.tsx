"use client"

import { useMemo } from "react"
import { ResponsivePie } from "@nivo/pie"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { MonthlyAggregate } from "../../utils/data-parser"

interface SourceBreakdownChartProps {
  data: MonthlyAggregate | null
}

export function SourceBreakdownChart({ data }: SourceBreakdownChartProps) {
  const pieData = useMemo(() => {
    if (!data) return []

    const tankerVolume = data.totalTankerVolume
    const directSewage = data.totalDirectSewage
    const total = tankerVolume + directSewage

    return [
      {
        id: "Tanker Discharge",
        label: "Tanker Discharge",
        value: tankerVolume,
        percentage: total > 0 ? ((tankerVolume / total) * 100).toFixed(1) : "0",
        color: "#4E4456",
      },
      {
        id: "Direct Inline Sewage",
        label: "Direct Inline Sewage",
        value: directSewage,
        percentage: total > 0 ? ((directSewage / total) * 100).toFixed(1) : "0",
        color: "#8ACCD5",
      },
    ]
  }, [data])

  if (!data) return null

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader title="Sewage Source Breakdown" description="Distribution of sewage sources" />
        <div className="h-80">
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ datum: "data.color" }}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            defs={[
              {
                id: "dots",
                type: "patternDots",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: "lines",
                type: "patternLines",
                background: "inherit",
                color: "rgba(255, 255, 255, 0.3)",
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              { match: { id: "Tanker Discharge" }, id: "dots" },
              { match: { id: "Direct Inline Sewage" }, id: "lines" },
            ]}
            legends={[
              {
                anchor: "bottom",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: "#999",
                itemDirection: "left-to-right",
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: "circle",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000",
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionConfig="gentle"
            tooltip={({ datum }) => (
              <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
                <strong>{datum.label}</strong>: {datum.value.toLocaleString()} m³ ({datum.data.percentage}%)
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
