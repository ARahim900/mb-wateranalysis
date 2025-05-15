"use client"

import { useState } from "react"
import LandingPage from "@/components/landing-page"
import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Dynamically import section components
const WaterDashboard = dynamic(() => import("@/components/water-dashboard"), {
  loading: () => <LoadingSpinner />,
})

const ElectricityDashboard = dynamic(() => import("@/features/electricity/components/electricity-dashboard"), {
  loading: () => <LoadingSpinner />,
})

const StpPlantDashboard = dynamic(() => import("@/features/stp-plant/components/stp-plant-dashboard"), {
  loading: () => <LoadingSpinner />,
})

const ContractorDashboard = dynamic(() => import("@/features/contractors/components/contractor-dashboard"), {
  loading: () => <LoadingSpinner />,
})

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  // Render the appropriate section based on selection
  const renderSection = () => {
    switch (selectedSection) {
      case "waterAnalysis":
        return <WaterDashboard />
      case "electricityAnalysis":
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <ElectricityDashboard />
          </motion.div>
        )
      case "stpPlant":
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <StpPlantDashboard />
          </motion.div>
        )
      case "contractorTracker":
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen"
          >
            <ContractorDashboard />
          </motion.div>
        )
      default:
        return <LandingPage onSelectSection={setSelectedSection} />
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>

      {selectedSection && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedSection(null)}
            className="px-6 py-3 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-xl text-[#4E4456] font-semibold transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-2xl"
          >
            Back to Dashboard
          </motion.button>
        </div>
      )}
    </main>
  )
}
