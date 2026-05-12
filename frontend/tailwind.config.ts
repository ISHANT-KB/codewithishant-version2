import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
      'fade-up': 'fadeUp 0.7s ease-out forwards',
    },
    keyframes: {
      fadeUp: {
        '0%': { opacity: '0', transform: 'translateY(20px)' },
        '100%': { opacity: '1', transform: 'translateY(0)' },
      },
    },
    },
    typography: {
      // ... your existing colors, fonts, animations ...
      
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "inherit",
            h1: {
              fontSize: "2.25rem",   // text-4xl
              fontWeight: "700",      // font-bold
              marginBottom: "1.5rem", // mb-6
              scrollMarginTop: "5rem", // scroll-m-20
            },
            h2: {
              fontSize: "1.875rem",   // text-3xl
              fontWeight: "600",      // font-semibold
              marginTop: "3rem",      // mt-12
              marginBottom: "1rem",   // mb-4
              scrollMarginTop: "5rem",
            },
            h3: {
              fontSize: "1.5rem",     // text-2xl
              fontWeight: "600",
              marginTop: "2.5rem",    // mt-10
              marginBottom: "0.75rem",// mb-3
            },
            h4: {
              fontSize: "1.25rem",    // text-xl
              fontWeight: "600",
            },
            p: {
              fontSize: "1rem",
              lineHeight: "1.75",
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            a: {
              color: "#3b82f6",       // text-blue-500
              textDecoration: "none",
              "&:hover": {
                color: "#60a5fa",     // text-blue-400
                textDecoration: "underline",
              },
            },
            strong: {
              fontWeight: "600",
              color: "inherit",
            },
            ul: {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            ol: {
              marginTop: "1rem",
              marginBottom: "1rem",
            },
            li: {
              marginTop: "0.25rem",
              marginBottom: "0.25rem",
            },
            "li::marker": {
              color: "#78716c",       // text-stone-500
            },
            blockquote: {
              borderLeftWidth: "4px",
              borderLeftColor: "#a8a29e", // stone-400
              paddingLeft: "1rem",
              fontStyle: "italic",
            },
            code: {
              color: "#ec4899",       // text-pink-500
              backgroundColor: "#f5f5f4", // stone-100
              paddingLeft: "0.375rem",
              paddingRight: "0.375rem",
              paddingTop: "0.125rem",
              paddingBottom: "0.125rem",
              borderRadius: "0.375rem",
              fontWeight: "500",
              "&::before": { content: "none" },
              "&::after": { content: "none" },
            },
            pre: {
              backgroundColor: "#1c1917", // stone-900
              color: "#f5f5f4",           // stone-100
              borderWidth: "1px",
              borderColor: "#44403c",     // stone-700
              borderRadius: "0.75rem",
              padding: "1rem",
              overflowX: "auto",
            },
            table: {
              width: "100%",
              borderCollapse: "collapse",
            },
            th: {
              borderWidth: "1px",
              borderColor: "#d6d3d1", // stone-300
              padding: "0.5rem 1rem",
              backgroundColor: "#f5f5f4", // stone-100
            },
            td: {
              borderWidth: "1px",
              borderColor: "#d6d3d1",
              padding: "0.5rem 1rem",
            },
            img: {
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            },
            hr: {
              borderColor: "#d6d3d1",
            },
          },
        },
        invert: {
          css: {
            color: "inherit",
            h1: { color: "inherit" },
            h2: { color: "inherit" },
            h3: { color: "inherit" },
            h4: { color: "inherit" },
            code: {
              backgroundColor: "#292524", // stone-800
            },
            th: {
              borderColor: "#44403c", // stone-700
              backgroundColor: "#292524",
            },
            td: {
              borderColor: "#44403c",
            },
            hr: {
              borderColor: "#44403c",
            },
            blockquote: {
              borderLeftColor: "#a8a29e",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;