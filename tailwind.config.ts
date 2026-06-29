import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          bg:           "#ece6da",
          "bg-soft":    "#e4dbd0",
          paper:        "#f4efe2",
          ink:          "#171612",
          forest:       "#1a2e1a",
          "forest-soft":"#3a5a3a",
          clay:         "#9d4519",
          "clay-soft":  "#c0612e",
          muted:        "#6e6659",
        },
        // Semantic aliases
        background: "#ece6da",
        surface:    "#f4efe2",
        foreground: "#171612",
        primary: {
          DEFAULT:    "#1a2e1a",
          foreground: "#f4efe2",
        },
        accent: {
          DEFAULT:    "#9d4519",
          foreground: "#f4efe2",
        },
        border:         "rgba(23, 22, 18, 0.15)",
        "border-strong":"rgba(23, 22, 18, 0.35)",
        muted:          "rgba(23, 22, 18, 0.55)",
      },
      fontFamily: {
        serif:   ["'Cormorant Garamond'", "Georgia", "serif"],
        sans:    ["'Nunito'", "system-ui", "sans-serif"],
        mono:    ["'Geist Mono'", "monospace"],
        body:    ["'Nunito'", "system-ui", "sans-serif"],
        display: ["var(--font-cinzel)", "'Cinzel'", "serif"],
      },
      fontSize: {
        "display-2xl": ["4.5rem",   { lineHeight: "1.0",  letterSpacing: "-0.025em" }],
        "display-xl":  ["3.75rem",  { lineHeight: "1.0",  letterSpacing: "-0.025em" }],
        "display-lg":  ["3rem",     { lineHeight: "1.02", letterSpacing: "-0.02em"  }],
        "display-md":  ["2.25rem",  { lineHeight: "1.05", letterSpacing: "-0.01em"  }],
        "display-sm":  ["1.875rem", { lineHeight: "1.1"  }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "26": "6.5rem",
        "30": "7.5rem",
        "34": "8.5rem",
      },
      borderRadius: {
        none:    "0",
        sm:      "0.125rem",
        DEFAULT: "0.25rem",
        md:      "0.375rem",
        lg:      "0.5rem",
        xl:      "0.75rem",
        "2xl":   "1rem",
        full:    "9999px",
      },
      boxShadow: {
        card:          "0 1px 0 0 rgba(23,22,18,0.1), 0 0 0 1px rgba(23,22,18,0.08)",
        "card-hover":  "0 4px 16px 0 rgba(23,22,18,0.12), 0 0 0 1px rgba(23,22,18,0.1)",
        "card-active": "0 0 0 2px #9d4519",
        nav:           "0 1px 24px rgba(23,22,18,0.08)",
      },
      animation: {
        "fade-in":   "fadeIn 0.5s ease-out",
        "slide-up":  "slideUp 0.5s ease-out",
        "slide-down":"slideDown 0.3s ease-out",
        shimmer:     "shimmer 2s linear infinite",
        marquee:     "marquee 60s linear infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(16px)" },  to: { opacity: "1", transform: "translateY(0)" } },
        slideDown: { from: { opacity: "0", transform: "translateY(-8px)" },  to: { opacity: "1", transform: "translateY(0)" } },
        shimmer:   { from: { backgroundPosition: "-200% 0" },                to:  { backgroundPosition: "200% 0" } },
        marquee:   { from: { transform: "translateX(0)" },                   to:  { transform: "translateX(-50%)" } },
      },
      backgroundImage: {
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(244,239,226,0.6) 50%, transparent 100%)",
        "hero-gradient":
          "linear-gradient(to bottom, rgba(26,46,26,0.3) 0%, rgba(26,46,26,0.65) 60%, rgba(26,46,26,0.85) 100%)",
      },
      screens: {
        xs:    "480px",
        sm:    "640px",
        md:    "768px",
        lg:    "1024px",
        xl:    "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [],
};

export default config;
