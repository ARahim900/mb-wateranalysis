"use client"

import { useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { MonthlyAggregate } from "../../utils/data-parser"

interface MonthlyTrendChartProps {
  data: MonthlyAggregate[]
  selectedMonth: string | null
}

export function MonthlyTrendChart({ data, selectedMonth }: MonthlyTrendChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return [
      {
        id: "Total Inlet Sewage",
        color: "#4E4456",
        data: data.map((month) => ({
          x: month.month,
          y: month.totalInletSewage,
        })),
      },
      {
        id: "Total Treated Water",
        color: "#8ACCD5",
        data: data.map((month) => ({
          x: month.month,
          y: month.totalTreatedWater,
        })),
      },
      {
        id: "Irrigation Output",
        color: "#50C878",
        data: data.map((month) => ({
          x: month.month,
          y: month.totalIrrigationOutput,
        })),
      },
    ]
  }, [data])

  const formatMonth = (month: string) => {
    const date = new Date(month + "-01")
    return date.toLocaleDateString("en-US", { month: "short" })
  }

  if (!data.length) return null

  return (
    <Card className="col-span-2">
      <CardContent className="p-6">
        <SectionHeader title="Monthly Trends" description="Monthly water flow trends through the STP plant" />
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
              tickRotation: -45,
              legend: "Month",
              legendOffset: 36,
              legendPosition: "middle",
              format: formatMonth,
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
            enableSlices="x"
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
            markers={
              selectedMonth
                ? [
                    {
                      axis: "x",
                      value: selectedMonth,
                      lineStyle: { stroke: "#FF6B6B", strokeWidth: 2, strokeDasharray: "4 4" },
                      legend: "Selected Month",
                      legendOrientation: "vertical",
                      legendPosition: "top-right",
                      textStyle: { fill: "#FF6B6B" },
                    },
                  ]
                : []
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}
