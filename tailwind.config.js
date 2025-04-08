/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef1f2',
          100: '#fee2e4',
          200: '#fec5c9',
          300: '#fd9aa2',
          400: '#fb6f7b',
          500: '#e94057',  // Our main brand color
          600: '#d11f3a',
          700: '#b1152d',
          800: '#931425',
          900: '#7b1420',
          950: '#43060e',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
    },
  },
  plugins: [],
} 