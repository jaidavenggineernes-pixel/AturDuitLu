import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EEF4FF",
          100: "#E0EBFF",
          200: "#C7D9FE",
          300: "#A4C0FE",
          400: "#6095FA",
          500: "#1E5BF6", // Primary Monex Royal Blue
          600: "#1448D6",
          700: "#1039B0",
          800: "#12318E",
          900: "#142D75",
        },
        surface: {
          50: "#FAFBFC",
          100: "#F4F6F9",
          200: "#E9ECF2",
          300: "#D8DFE9",
          DEFAULT: "#FFFFFF",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(20, 45, 117, 0.04), 0 2px 6px -1px rgba(20, 45, 117, 0.02)",
        "card-hover": "0 10px 25px -3px rgba(20, 45, 117, 0.08), 0 4px 10px -2px rgba(20, 45, 117, 0.04)",
        fab: "0 10px 25px -2px rgba(30, 91, 246, 0.45)",
        floating: "0 15px 35px -5px rgba(30, 91, 246, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
