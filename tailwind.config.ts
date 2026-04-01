import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: "#eef4ff",
          100: "#dce8ff",
          200: "#c0d5ff",
          300: "#95b6ff",
          400: "#628df7",
          500: "#2f67e0",
          600: "#1149aa",
          700: "#0e3d8e",
          800: "#113470",
          900: "#102b59"
        },
        red: {
          50: "#fff1f4",
          100: "#ffe2e8",
          200: "#ffc8d3",
          300: "#ff9cb0",
          400: "#f86f8e",
          500: "#e03f67",
          600: "#c01d49",
          700: "#9f173d",
          800: "#7f1736",
          900: "#63142f"
        },
        neutral: {
          50: "#f8f9fc",
          100: "#f1f3f8",
          200: "#e5e9f1",
          300: "#d0d7e4",
          400: "#9aa7bd",
          500: "#687792",
          600: "#4c5a74",
          700: "#364259",
          800: "#232d40",
          900: "#131a2b"
        },
        primary: "var(--color-primary)",
        "primary-hover": "var(--color-primary-hover)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-text-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)"
      }
    }
  },
  plugins: []
};

export default config;
