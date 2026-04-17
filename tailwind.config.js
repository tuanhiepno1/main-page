/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        shell: "#f4f7fb",
        panel: "#ffffff",
        panelAlt: "#f8fbff",
        line: "rgba(148, 163, 184, 0.18)",
        neon: "#2563eb",
        signal: "#0f766e",
        alert: "#d97706",
        text: "#0f172a",
        muted: "#64748b",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
      boxShadow: {
        glow: "0 20px 45px rgba(37, 99, 235, 0.08), 0 0 0 1px rgba(148, 163, 184, 0.1)",
        soft: "0 12px 30px rgba(15, 23, 42, 0.06)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(148, 163, 184, 0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.09) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
