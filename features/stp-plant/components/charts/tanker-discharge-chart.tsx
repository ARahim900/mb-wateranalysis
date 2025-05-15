"use client"

import { useMemo } from "react"
import { ResponsiveBar } from "@nivo/bar"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "@/components/ui/section-header"
import type { STPRecord } from "../../utils/data-parser"

interface TankerDischargeChartProps {
  data: STPRecord[]
}

export function TankerDischargeChart({ data }: TankerDischargeChartProps) {
  const chartData = useMemo(() => {
    if (!data.length) return []

    return data.map((record) => ({
      day: new Date(record.date).getDate(),
      count: record.tankersCount,
      volume: record.expectedTankerVolume,
    }))
  }, [data])

  if (!data.length) return null

  return (
    <Card>
      <CardContent className="p-6">
        <SectionHeader title="Tanker Discharge" description="Daily tanker discharge count and volume" />
        <div className="h-80">
          <ResponsiveBar
            data={chartData}
            keys={["count"]}
            indexBy="day"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: "linear" }}
            indexScale={{ type: "band", round: true }}
            colors={["#4E4456"]}
            borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Day of Month",
              legendPosition: "middle",
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "Number of Tankers",
              legendPosition: "middle",
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
            legends={[
              {
                dataFrom: "keys",
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: "left-to-right",
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
            animate={true}
            motionConfig="gentle"
            role="application"
            ariaLabel="Tanker discharge count by day"
            barAriaLabel={(e) => `Day ${e.indexValue}: ${e.value} tankers`}
            tooltip={({ id, value, color, indexValue }) => (
              <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
                <strong>Day {indexValue}</strong>: {value} tankers
                <div>
                  <strong>Volume</strong>: {value * 20} m³
                </div>
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
