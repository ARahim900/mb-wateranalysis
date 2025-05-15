"use client"

import { useMemo } from "react"
import { ResponsiveLine } from "@nivo/line"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"

interface LossAnalysisChartProps {
  data: any[]
  selectedMonth: string
}

export function LossAnalysisChart({ data, selectedMonth }: LossAnalysisChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    // Calculate losses for each day
    return [
      {
        id: "Treatment Losses",
        color: "#FF5252", // Red color for losses
        data: data.map((day) => ({
          x: day.day || 0,
          y: (day.influentFlow || 0) - (day.effluentFlow || 0),
        })),
      },
      {
        id: "Inflow",
        color: "#4E4456",
        data: data.map((day) => ({
          x: day.day || 0,
          y: day.influentFlow || 0,
        })),
      },
      {
        id: "Outflow",
        color: "#8ACCD5",
        data: data.map((day) => ({
          x: day.day || 0,
          y: day.effluentFlow || 0,
        })),
      },
    ]
  }, [data])

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <SectionHeader title="Loss Analysis" description="Daily water loss analysis for the selected month" />
          <div className="h-80 flex items-center justify-center">
            <p className="text-gray-500">No data available for the selected month</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader title="Loss Analysis" description={`Daily water loss analysis for ${selectedMonth}`} />
        <div className="h-80">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: 0,
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
            pointSize={8}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            lineWidth={3} // Increase line width for better visibility
            enablePoints={true}
            enableLine={true} // Ensure lines are always enabled
            enableSlices="x"
            useMesh={true}
            animate={true}
            motionConfig="gentle"
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
