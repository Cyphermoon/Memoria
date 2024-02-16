/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./screens/**/*{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors:{
          primary:{
            300: "#0F1728",
            DEFAULT: "#030712",
          },
          accent: "#FFAEDC",
          secondary: "#F9FAFB"
        }
      },
    },
    plugins: [],
  }
