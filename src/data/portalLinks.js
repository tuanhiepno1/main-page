// Supported status values: "online" | "maintenance"
// Supported tone values: "blue" | "teal" | "amber"
export const DEFAULT_PORTAL_LINKS = [];

export const PORTAL_STATUS_OPTIONS = ["online", "maintenance"];
export const PORTAL_TONE_OPTIONS = ["blue", "teal", "amber"];

// Frontend-only admin access. Credentials come from .env (VITE_ADMIN_* vars).
// Note: Vite bundles VITE_* vars into the client JS — use a backend auth flow for true security.
export const ADMIN_CONFIG = {
  username: import.meta.env.VITE_ADMIN_USERNAME,
  password: import.meta.env.VITE_ADMIN_PASSWORD,
};
