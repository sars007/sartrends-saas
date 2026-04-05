import type { Config } from "tailwindcss"

const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B0B0C',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#2563EB',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#0B0B0C',
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
        border: '#E5E7EB',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#0B0B0C',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'counting': 'counting 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        counting: {
          'from': { opacity: '0.4' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

export default config

