/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F14",
        surface: "#12171F",
        card: "#171D26",
        primary: "#C9A86A",
        secondary: "#7B61FF",
        success: "#4CAF50",
        warning: "#F6B93B",
        critical: "#FF5C5C",
        info: "#50A7FF",
        text: "#F7F8FA",
        muted: "#9CA3AF",
        border: "#2A313C"
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"]
      },
      spacing: {
        // 8px system is default in tailwind (1 = 0.25rem = 4px), we don't strictly need to override
      },
      borderRadius: {
        'xl': '16px', // Rounded corners: 16px as per PRD
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(0, 0, 0, 0.25)', // Soft shadows for cards
      }
    },
  },
  plugins: [],
}
