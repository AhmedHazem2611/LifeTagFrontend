/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#005adc",
          hover: "#0062ff",
          foreground: "#FFFFFF",
        },
        background: "#f8fbff",
        foreground: "#1a1c1e",
        muted: "#9aa5b1",
        accent: "#0062ff",
      },
      boxShadow: {
        clay: "0px 20px 40px rgba(172, 203, 250, 0.8), inset 3px 1px 11px rgba(255, 255, 255, 0.5), inset 0px -4px 10px #0077ff",
        'clay-card': "0px 10px 30px rgba(152, 167, 197, 0.2), 0px 40px 80px rgba(152, 167, 197, 0.15), inset 0px 4px 12px rgba(255, 255, 255, 1), inset 0px -4px 12px rgba(209, 219, 238, 0.2)"
      },
      borderRadius: {
        lg: "32px",
        md: "14px",
        sm: "12px",
      }
    },
  },
  plugins: [],
}
