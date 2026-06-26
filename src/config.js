// Ticket System public API configuration.
// Set these via environment variables at build time (Vite).
// .env.production or .env.local — all values prefixed with VITE_.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5555/api/public";
export const API_KEY = import.meta.env.VITE_API_KEY || "";
