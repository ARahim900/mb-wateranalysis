// Define the base color and generate a color palette
export const BASE_COLOR = "#4E4456"
export const SECONDARY_COLOR = "#8A7A94"
export const ACCENT_COLOR = "#8ACCD5"
export const SUCCESS_COLOR = "#50C878"
export const WARNING_COLOR = "#FFB347"
export const DANGER_COLOR = "#FF6B6B"
export const INFO_COLOR = "#5BC0DE"
export const NEUTRAL_COLOR = "#ADB5BD"

// Color palettes for charts
export const ZONE_COLORS = [
  ACCENT_COLOR, // Teal/Light Blue (primary accent)
  BASE_COLOR, // Dark Purple/Aubergine
  INFO_COLOR, // Info Blue
  SUCCESS_COLOR, // Success Green
  WARNING_COLOR, // Warning Orange
  DANGER_COLOR, // Danger Red
]

// Function to lighten a color
export const lightenColor = (color: string, amount: number) => {
  const num = Number.parseInt(color.replace("#", ""), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + 255 * amount)
  const g = Math.min(255, ((num >> 8) & 0xff) + 255 * amount)
  const b = Math.min(255, (num & 0xff) + 255 * amount)
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1)
}

// Generate gradient string for CSS
export const generateGradient = (color1: string, color2: string, direction = "to right") => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`
}
