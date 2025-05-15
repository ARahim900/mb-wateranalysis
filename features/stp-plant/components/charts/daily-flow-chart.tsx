"use client"

import { useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { STPRecord } from "../../utils/data-parser"

interface DailyFlowChartProps {
  data: STPRecord[]
}

export function DailyFlowChart({ data }: DailyFlowChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return [
      {
        id: "Total Inlet Sewage",
        color: "#4E4456",
        data: data.map((record) => ({
          x: new Date(record.date).getDate(),
          y: record.totalInletSewage,
        })),
      },
      {
        id: "Total Treated Water",
        color: "#8ACCD5",
        data: data.map((record) => ({
          x: new Date(record.date).getDate(),
          y: record.totalTreatedWater,
        })),
      },
      {
        id: "Irrigation Output",
        color: "#50C878",
        data: data.map((record) => ({
          x: new Date(record.date).getDate(),
          y: record.totalTSEWaterOutput,
        })),
      },
    ]
  }, [data])

  if (!data.length) return null

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader title="Daily Flow Rates" description="Daily water flow through the STP plant" />
        <div className="h-80">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Day of Month",
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Volume (m³)",
              legendOffset: -40,
              legendPosition: "middle",
            }}
            colors={{ datum: "color" }}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionConfig="gentle"
            theme={{
              tooltip: {
                container: {
                  background: "white",
                  color: "#333",
                  fontSize: 12,
                  borderRadius: "4px",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.25)",
                  padding: "5px 9px",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  )
}
