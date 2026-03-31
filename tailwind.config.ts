import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef3ff",
          100: "#dce7ff",
          200: "#bdd0ff",
          300: "#93b1ff",
          400: "#668dfc",
          500: "#3f6ef2",
          600: "#1f4ecf",
          700: "#173faa",
          800: "#163889",
          900: "#162f6f"
        },
        secondary: {
          50: "#fff1f3",
          100: "#ffe1e5",
          200: "#ffc8d1",
          300: "#ff9ead",
          400: "#fd6f86",
          500: "#ef3b5d",
          600: "#cf2146",
          700: "#a9163a",
          800: "#8c1735",
          900: "#741630"
        },
        neutral: {
          50: "#f8f9fc",
          100: "#f1f4f9",
          200: "#e3e8f2",
          300: "#cbd4e3",
          400: "#9eabc1",
          500: "#70809c",
          600: "#53607a",
          700: "#3c475d",
          800: "#273247",
          900: "#151f34"
        },
        success: {
          50: "#ebfdf4",
          100: "#cff9e2",
          200: "#a1efc7",
          300: "#6cdea6",
          400: "#3bc589",
          500: "#1ba86f",
          600: "#13875a",
          700: "#126c4a",
          800: "#14563e",
          900: "#124735"
        },
        warning: {
          50: "#fffaeb",
          100: "#fff1c7",
          200: "#ffe089",
          300: "#ffca4f",
          400: "#f8b329",
          500: "#e58f10",
          600: "#c86d0d",
          700: "#a35010",
          800: "#854014",
          900: "#6f3515"
        },
        info: {
          50: "#ecf7ff",
          100: "#d4eeff",
          200: "#addfff",
          300: "#76c8ff",
          400: "#3ea8fb",
          500: "#1989e1",
          600: "#106cbf",
          700: "#10579b",
          800: "#124a7f",
          900: "#153f6a"
        }
      }
    }
  },
  plugins: []
};

export default config;
