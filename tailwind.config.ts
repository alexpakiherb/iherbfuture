import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans"',
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "sans-serif",
        ],
      },
      colors: {
        /* iHerb Brand Colors */
        "iherb-green": "#0A6B3C",
        "iherb-green-dark": "#065C32",
        "iherb-green-light": "#E5F8E6",
        "iherb-orange": "#D14800",
        "iherb-blue": "#1558A6",
        "iherb-white": "#FFFFFF",
        "iherb-gray-bg": "#F7F8F7",
        "iherb-text-primary": "#333333",
        "iherb-text-secondary": "#666666",
        "iherb-border": "#CCCCCC",
        "iherb-divider": "#E0E0E0",
        "iherb-dark": "#212529",
        "iherb-gold": "#F5A623",
        "iherb-error": "#CA2222",
      },
      spacing: {
        /* 4px base grid */
        "1": "2px",
        "2": "4px",
        "3": "8px",
        "4": "12px",
        "5": "16px",
        "6": "24px",
        "7": "28px",
        "8": "32px",
      },
      borderRadius: {
        "none": "0",
        "xs": "4px",
        "sm": "6px",
        "base": "8px",
        "md": "12px",
        "lg": "16px",
        "full": "9999px",
      },
      boxShadow: {
        "elevation-1": "0px 2px 8px rgba(0, 0, 0, 0.12)",
        "elevation-2":
          "0px 3px 8px rgba(0, 0, 0, 0.06), 0px 6px 8px rgba(0, 0, 0, 0.12)",
        "elevation-3": "0px 12px 20px rgba(0, 0, 0, 0.16)",
      },
      backgroundColor: {
        "iherb-gray": "#F7F8F7",
      },
    },
  },
  plugins: [],
};

export default config;
