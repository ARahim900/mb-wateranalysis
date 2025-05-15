"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Define the main color palette
const colors = {
  primary: "#4E4456", // Muscat Bay logo color
  neutralLight: "#F3F4F6", // Soft gray
  neutralMid: "#D1D5DB", // Muted gray
  neutralDark: "#6B7280", // Darker gray
  gold: "#D4AF37", // Muted gold
}

// Define the structure for a section item in the carousel
type SectionItem = {
  id: string
  title: string
  description: string
  imageSrc: string
}

// Props for the landing page component
interface LandingPageProps {
  onSelectSection: (sectionId: string) => void
}

// Section Carousel Component with stacked card effect
const SectionCarousel = ({ sections, onSelectSection, autoplay = false }) => {
  const [active, setActive] = useState(0)

  const handleNext = () => {
    setActive((prev) => (prev + 1) % sections.length)
  }

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + sections.length) % sections.length)
  }

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000)
      return () => clearInterval(interval)
    }
  }, [autoplay, sections.length])

  // Calculate positions for stacked cards
  const getCardStyles = (index: number) => {
    const activeIndex = active
    const totalCards = sections.length

    // Calculate the relative position (how far from active)
    let relativePosition = (index - activeIndex + totalCards) % totalCards

    // Ensure we only show at most 3 cards (active, one before, one after)
    if (relativePosition > totalCards / 2) {
      relativePosition = relativePosition - totalCards
    }

    // Calculate transforms based on position
    const zIndex = 10 - Math.abs(relativePosition) * 2
    const opacity = relativePosition === 0 ? 1 : 0.7 - Math.abs(relativePosition) * 0.2
    const scale = 1 - Math.abs(relativePosition) * 0.1
    const x = relativePosition * -15 // Horizontal offset for stacking
    const y = relativePosition * 10 // Vertical offset for stacking
    const rotate = relativePosition * -5 // Rotation for 3D effect

    return {
      zIndex,
      opacity,
      scale,
      x,
      y,
      rotate,
      visible: Math.abs(relativePosition) <= 2, // Only show nearby cards
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Stacked Image Cards Section */}
        <div className="relative h-80 md:h-96 w-full flex items-center justify-center">
          <div className="relative w-full h-full max-w-md mx-auto">
            <AnimatePresence>
              {sections.map((section, index) => {
                const styles = getCardStyles(index)

                if (!styles.visible) return null

                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, scale: 0.8, rotate: styles.rotate }}
                    animate={{
                      opacity: styles.opacity,
                      scale: styles.scale,
                      x: styles.x,
                      y: styles.y,
                      rotate: styles.rotate,
                      zIndex: styles.zIndex,
                    }}
                    exit={{ opacity: 0, scale: 0.8, rotate: styles.rotate }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-full origin-center cursor-pointer"
                    style={{
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                      boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.2)",
                      borderRadius: "24px",
                      overflow: "hidden",
                    }}
                    onClick={() => onSelectSection(section.id)}
                  >
                    <div className="relative w-full h-full rounded-3xl overflow-hidden">
                      <Image
                        src={section.imageSrc || "/placeholder.svg"}
                        alt={section.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-3xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-3xl">
                        <div className="absolute bottom-0 left-0 p-6 text-white">
                          <h3 className="text-xl font-bold">{section.title}</h3>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Text and Controls Section */}
        <div className="flex justify-between flex-col py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ color: colors.primary }}>
              {sections[active].title}
            </h3>
            <motion.p className="text-lg text-gray-700 mt-4">
              {sections[active].description.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut", delay: 0.01 * index }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation Controls */}
          <div className="flex gap-4 pt-8 md:pt-6 justify-center md:justify-start">
            <button
              onClick={handlePrev}
              className="h-10 w-10 rounded-full bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg flex items-center justify-center group/button shadow-xl transition-all duration-300 ease-in-out hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 group-hover/button:rotate-12 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 rounded-full bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg flex items-center justify-center group/button shadow-xl transition-all duration-300 ease-in-out hover:scale-110"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-800 group-hover/button:-rotate-12 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center md:justify-start gap-2 mt-4">
            {sections.map((_, index) => (
              <button
                key={index}
                onClick={() => setActive(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === active ? "w-6 bg-[#4E4456]" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main Landing Page component
const LandingPage: React.FC<LandingPageProps> = ({ onSelectSection }) => {
  // Define the data for the sections in the carousel
  const dashboardSections: SectionItem[] = [
    {
      id: "waterAnalysis",
      title: "Water Analysis",
      description: "Monitor and analyze water quality, consumption data, and distribution metrics across Muscat Bay.",
      imageSrc: "/water-dashboard-screenshot.png",
    },
    {
      id: "electricityAnalysis",
      title: "Electricity Analysis",
      description: "Track electricity usage, performance metrics, and identify optimization opportunities.",
      imageSrc: "/electricity-dashboard-screenshot.png",
    },
    {
      id: "stpPlant",
      title: "STP Plant (750 m³/d)",
      description: "View operational data and status for the Sewage Treatment Plant with real-time monitoring.",
      imageSrc: "/stp-plant-screenshot.png",
    },
    {
      id: "contractorTracker",
      title: "Contractor Tracker",
      description: "Manage contractor activities, project progress, and maintenance schedules efficiently.",
      imageSrc: "/contractor-tracker-screenshot.png",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-[#F3F4F6]"
    >
      {/* Header with logo and title */}
      <div className="w-full max-w-6xl mx-auto mb-4 px-4 pt-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="h-16 w-16 relative mr-4">
            <Image src="/logo.png" alt="Muscat Bay Logo" fill style={{ objectFit: "contain" }} priority />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: colors.primary }}>
            Muscat Bay Operations
          </h1>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 rounded-lg bg-white shadow-md text-[#4E4456] hover:shadow-lg transition-shadow">
            Help
          </button>
          <button className="px-4 py-2 rounded-lg bg-[#4E4456] shadow-md text-white hover:shadow-lg transition-shadow">
            Login
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto flex-grow px-4">
        <div className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: colors.primary }}>
            Operational Dashboard
          </h2>

          {/* Carousel of sections with stacked card effect */}
          <SectionCarousel sections={dashboardSections} onSelectSection={onSelectSection} autoplay={true} />

          {/* Quick stats section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Water Consumption", value: "46,039 m³", change: "+2.4%" },
              { label: "Electricity Usage", value: "1,245 kWh", change: "-1.8%" },
              { label: "STP Efficiency", value: "94.2%", change: "+0.5%" },
              { label: "Active Contractors", value: "8", change: "0" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.5 }}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col"
              >
                <span className="text-sm text-gray-500">{stat.label}</span>
                <span className="text-2xl font-bold mt-1" style={{ color: colors.primary }}>
                  {stat.value}
                </span>
                <span
                  className={`text-xs mt-1 ${stat.change.startsWith("+") ? "text-green-500" : stat.change.startsWith("-") ? "text-red-500" : "text-gray-500"}`}
                >
                  {stat.change} from last month
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto mt-8 mb-6 px-4 text-center text-gray-500 text-sm">
        <p>© 2025 Muscat Bay Operations. All rights reserved.</p>
        <p className="mt-1">Version 2.0.1</p>
      </footer>
    </motion.div>
  )
}

export default LandingPage
