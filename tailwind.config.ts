import { type Config } from 'tailwindcss'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00c8ff',
        'neon-cyan': '#00e5ff',
        'neon-black': '#050b14',
        'deep-slate': '#0b1220',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0,200,255,0.35), 0 0 60px rgba(0,200,255,0.10)',
      },
    },
  },
  plugins: [],
}