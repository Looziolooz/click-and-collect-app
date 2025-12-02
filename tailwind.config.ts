import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom color palette based on project requirements
      colors: {
        sage: {
          DEFAULT: '#9ca986', // Primary accent
          dark: '#7c8a6b',    // Hover state
          light: '#b5c1a3',   // Lighter shade
        },
        charcoal: {
          DEFAULT: '#2d3436', // Primary text
          light: '#636e72',   // Secondary text (Warm Gray)
        },
        cream: {
          DEFAULT: '#fdfbf7', // Background
          dark: '#f5f0e6',    // Secondary background
        },
        alert: {
          red: '#e17055',     // Errors
          green: '#00b894',   // Success
        }
      },
      // Map Tailwind utility classes to the CSS variables defined in layout.tsx
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;