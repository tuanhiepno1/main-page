// Default portal entries used when there is nothing stored in localStorage yet.
// Supported status values: "online" | "maintenance"
// Supported tone values: "blue" | "teal" | "amber"
export const DEFAULT_PORTAL_LINKS = [
  {
    id: "incident-report",
    title: "Incident Report",
    eyebrow: "Operations",
    summary:
      "Report an issue, share the details clearly, and help the right team respond faster.",
    href: "http://10.10.73.6:3001/",
    status: "online",
    tone: "blue",
    action: "Open Incident Report",
  },
  {
    id: "leave-management",
    title: "Leave Management",
    eyebrow: "People",
    summary:
      "Submit leave requests, review approval status, and keep track of time-off details in one place.",
    href: "#",
    status: "maintenance",
    tone: "blue",
    action: "Open Leave Management",
  },
];

export const PORTAL_STATUS_OPTIONS = ["online", "maintenance"];
export const PORTAL_TONE_OPTIONS = ["blue", "teal", "amber"];

// Frontend-only admin access for local portal management.
// Replace these values or connect this screen to a real backend auth flow later.
export const ADMIN_CONFIG = {
  username: "admin",
  password: "admin",
};
