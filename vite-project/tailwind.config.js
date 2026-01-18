/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite', // Adjust duration as needed
      },
     colors: {
    primary: "#0d9488",
    accent: "#10b981",
    background: "#ffffff",
    foreground: "#0f172a",
    secondary: "#f0fdfa",
  },
    },
    
  },
  plugins: [],
}

