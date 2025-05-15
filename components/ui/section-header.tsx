import type React from "react"
interface SectionHeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function SectionHeader({ title, description, actions }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        {description && <p className="text-gray-500 mt-1">{description}</p>}
      </div>
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  )
}
