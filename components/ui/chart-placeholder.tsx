interface ChartPlaceholderProps {
  type: "line" | "bar"
  height?: number
  className?: string
}

export function ChartPlaceholder({ type, height = 250, className }: ChartPlaceholderProps) {
  if (type === "line") {
    return (
      <div className={`w-full h-${height} flex items-end justify-between ${className}`}>
        <svg width="100%" height={height} viewBox={`0 0 600 ${height}`} className="overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1={height - 20} x2="600" y2={height - 20} stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1={height - 70} x2="600" y2={height - 70} stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1={height - 120} x2="600" y2={height - 120} stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1={height - 170} x2="600" y2={height - 170} stroke="#e5e7eb" strokeWidth="1" />
          <line x1="0" y1={height - 220} x2="600" y2={height - 220} stroke="#e5e7eb" strokeWidth="1" />

          {/* Supply Line (L1) */}
          <path
            d={`M 50 ${height - 150} C 100 ${height - 120}, 150 ${height - 180}, 200 ${height - 160} S 300 ${height - 140}, 350 ${height - 170} S 450 ${height - 130}, 550 ${height - 80}`}
            fill="none"
            stroke="#4E4456"
            strokeWidth="3"
          />

          {/* Distribution Line (L2) */}
          <path
            d={`M 50 ${height - 130} C 100 ${height - 110}, 150 ${height - 150}, 200 ${height - 140} S 300 ${height - 120}, 350 ${height - 150} S 450 ${height - 110}, 550 ${height - 100}`}
            fill="none"
            stroke="#8A7A94"
            strokeWidth="3"
            strokeDasharray="5,5"
          />

          {/* Consumption Line (L3) */}
          <path
            d={`M 50 ${height - 100} C 100 ${height - 90}, 150 ${height - 110}, 200 ${height - 100} S 300 ${height - 90}, 350 ${height - 110} S 450 ${height - 80}, 550 ${height - 120}`}
            fill="none"
            stroke="#8ACCD5"
            strokeWidth="3"
          />

          {/* X-axis labels */}
          <text x="50" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Oct
          </text>
          <text x="150" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Nov
          </text>
          <text x="250" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Dec
          </text>
          <text x="350" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Jan
          </text>
          <text x="450" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Feb
          </text>
          <text x="550" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
            Mar
          </text>
        </svg>

        {/* Legend */}
        <div className="flex gap-4 mt-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#4E4456]"></div>
            <span>Supply (L1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8A7A94]"></div>
            <span>Distribution (L2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#8ACCD5]"></div>
            <span>Consumption (L3)</span>
          </div>
        </div>
      </div>
    )
  }

  // Bar chart
  return (
    <div className={`w-full h-${height} flex items-end justify-between ${className}`}>
      <svg width="100%" height={height} viewBox={`0 0 600 ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <line x1="0" y1={height - 20} x2="600" y2={height - 20} stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1={height - 70} x2="600" y2={height - 70} stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1={height - 120} x2="600" y2={height - 120} stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1={height - 170} x2="600" y2={height - 170} stroke="#e5e7eb" strokeWidth="1" />
        <line x1="0" y1={height - 220} x2="600" y2={height - 220} stroke="#e5e7eb" strokeWidth="1" />

        {/* Bars */}
        <rect x="50" y={height - 200} width="60" height="180" fill="#F8B84E" rx="4" />
        <rect x="150" y={height - 190} width="60" height="170" fill="#F8B84E" rx="4" />
        <rect x="250" y={height - 190} width="60" height="170" fill="#F8B84E" rx="4" />
        <rect x="350" y={height - 180} width="60" height="160" fill="#F8B84E" rx="4" />
        <rect x="450" y={height - 150} width="60" height="130" fill="#F8B84E" rx="4" />
        <rect x="550" y={height - 100} width="60" height="80" fill="#F8B84E" rx="4" />

        {/* X-axis labels */}
        <text x="80" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Nov-24
        </text>
        <text x="180" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Dec-24
        </text>
        <text x="280" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Jan-25
        </text>
        <text x="380" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Feb-25
        </text>
        <text x="480" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Mar-25
        </text>
        <text x="580" y={height - 5} fontSize="12" textAnchor="middle" fill="#6B7280">
          Apr-25
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-4 mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F8B84E]"></div>
          <span>Consumption (kWh)</span>
        </div>
      </div>
    </div>
  )
}
