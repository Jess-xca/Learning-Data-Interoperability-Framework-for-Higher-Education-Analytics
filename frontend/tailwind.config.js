/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary (Academic Navy)
        primary: "#002045",
        "on-primary": "#ffffff",
        "primary-container": "#1a365d",
        "on-primary-container": "#86a0cd",

        // Secondary (Academic Blue)
        secondary: "#545f72",
        "on-secondary": "#ffffff",
        "secondary-container": "#193657",
        "on-secondary-container": "#c4dced",

        // Tertiary (Success Green)
        tertiary: "#002617",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003e28",
        "on-tertiary-container": "#00b47d",
        "tertiary-fixed": "#6ffbbe",
        "on-tertiary-fixed": "#002113",
        "tertiary-fixed-dim": "#4edea3",
        "on-tertiary-fixed-variant": "#005236",

        // Surface (Backgrounds)
        surface: "#f9f9ff",
        "on-surface": "#111c2c",
        "surface-bright": "#f9f9ff",
        "surface-dim": "#cfdaf1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0f3ff",
        "surface-container": "#e7eeff",
        "surface-container-high": "#dee8ff",
        "surface-container-highest": "#d8e3fa",
        "on-surface-variant": "#43474e",

        // Supporting Colors
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Outline & Utility
        outline: "#74777f",
        "outline-variant": "#c4c6cf",
        "inverse-surface": "#263142",
        "inverse-on-surface": "#ebf1ff",
        "inverse-primary": "#adc7f7",

        // Additional fixed variants
        "primary-fixed": "#d6e3ff",
        "on-primary-fixed": "#001b3c",
        "primary-fixed-dim": "#adc7f7",
        "on-primary-fixed-variant": "#2d476f",

        "secondary-fixed": "#d8e3fa",
        "on-secondary-fixed": "#111c2c",
        "secondary-fixed-dim": "#bcc7dd",
        "on-secondary-fixed-variant": "#3c475a",

        "surface-variant": "#d8e3fa",
        "surface-tint": "#455f88",
      },
      fontFamily: {
        headline: ["Inter", "sans-serif"],
        body: ["Inter", "sans-serif"],
        label: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        xs: ["12px", "16px"], // Label
        sm: ["14px", "20px"], // Body small
        base: ["16px", "24px"], // Body
        lg: ["18px", "28px"], // Subtitle
        xl: ["20px", "28px"], // Card title
        "2xl": ["24px", "32px"], // Section title
        "3xl": ["30px", "36px"], // Page title
        "4xl": ["36px", "40px"], // Hero title
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
        xl: "12px",
        full: "9999px",
      },
      spacing: {
        sidebar: "288px",
        header: "64px",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [],
};
