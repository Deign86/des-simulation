/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        accent: {
          cyan: '#00D4FF',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        void: '#08090F',
      },
    },
  },
  plugins: [],
}
