"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

export function MainNavigation() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Water Analysis", path: "/water" },
    { name: "Electricity Analysis", path: "/electricity" },
    { name: "STP Plant", path: "/stp-plant" },
    { name: "Contractor Tracker", path: "/contractors" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.png" alt="Muscat Bay Logo" width={40} height={40} />
          <h1 className={`ml-3 font-bold text-xl ${isScrolled ? "text-[#4E4456]" : "text-white"}`}>
            Muscat Bay Operations
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`transition-colors duration-200 ${
                    pathname === item.path
                      ? isScrolled
                        ? "text-[#4E4456] font-medium"
                        : "text-white font-medium"
                      : isScrolled
                        ? "text-gray-600 hover:text-[#4E4456]"
                        : "text-white/80 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-6 w-6 ${isScrolled ? "text-[#4E4456]" : "text-white"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Login Button */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              isScrolled ? "bg-[#4E4456] text-white" : "bg-white text-[#4E4456]"
            }`}
          >
            Login
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <ul className="py-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block py-2 px-4 ${
                    pathname === item.path
                      ? "text-[#4E4456] font-medium bg-gray-100"
                      : "text-gray-600 hover:text-[#4E4456] hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <li className="px-4 pt-4">
              <button className="w-full px-4 py-2 rounded-lg bg-[#4E4456] text-white">Login</button>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
