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
    owner: "sol",
    contact: "sol@teampl.com",
    subOwner: "silver",
    subContact: "silver@teampl.com",
  },
  {
    id: "safety-observation",
    title: "Safety Observation",
    eyebrow: "EHS",
    summary:
      "Log unsafe conditions, near misses, and preventive observations before they become incidents.",
    href: "#",
    status: "online",
    tone: "teal",
    action: "Open Safety Observation",
    owner: "silver",
    contact: "silver@teampl.com",
    subOwner: "capone",
    subContact: "capone@teampl.com",
  },
  {
    id: "visitor-checkin",
    title: "Visitor Check-In",
    eyebrow: "Security",
    summary:
      "Register visitors, print badges, and keep a clean entry history for reception and guards.",
    href: "#",
    status: "online",
    tone: "amber",
    action: "Open Visitor Check-In",
    owner: "capone",
    contact: "capone@teampl.com",
    subOwner: "matthew",
    subContact: "matthew@teampl.com",
  },
  {
    id: "asset-request",
    title: "Asset Request",
    eyebrow: "IT Service",
    summary:
      "Request laptops, monitors, accessories, and track provisioning progress from one queue.",
    href: "#",
    status: "online",
    tone: "blue",
    action: "Open Asset Request",
    owner: "matthew",
    contact: "matthew@teampl.com",
    subOwner: "sol",
    subContact: "sol@teampl.com",
  },
  {
    id: "training-center",
    title: "Training Center",
    eyebrow: "Learning",
    summary:
      "Access onboarding modules, compliance training, and required certifications in one place.",
    href: "#",
    status: "online",
    tone: "teal",
    action: "Open Training Center",
    owner: "sol",
    contact: "sol@teampl.com",
    subOwner: "capone",
    subContact: "capone@teampl.com",
  },
  {
    id: "leave-management",
    title: "Leave Management",
    eyebrow: "People",
    summary:
      "Submit leave requests, review approval status, and keep track of time-off details in one place.",
    href: "#",
    status: "maintenance",
    tone: "amber",
    action: "Open Leave Management",
    owner: "silver",
    contact: "silver@teampl.com",
    subOwner: "matthew",
    subContact: "matthew@teampl.com",
  },
  {
    id: "payroll-self-service",
    title: "Payroll Self Service",
    eyebrow: "Finance",
    summary:
      "Review pay slips, tax documents, and compensation history without waiting for manual support.",
    href: "#",
    status: "online",
    tone: "blue",
    action: "Open Payroll",
    owner: "capone",
    contact: "capone@teampl.com",
    subOwner: "silver",
    subContact: "silver@teampl.com",
  },
  {
    id: "purchase-approval",
    title: "Purchase Approval",
    eyebrow: "Procurement",
    summary:
      "Approve spend requests, compare vendor options, and track pending purchasing actions quickly.",
    href: "#",
    status: "maintenance",
    tone: "amber",
    action: "Open Purchase Approval",
    owner: "matthew",
    contact: "matthew@teampl.com",
    subOwner: "sol",
    subContact: "sol@teampl.com",
  },
  {
    id: "fleet-booking",
    title: "Fleet Booking",
    eyebrow: "Logistics",
    summary:
      "Reserve company vehicles, manage trip schedules, and avoid booking conflicts across teams.",
    href: "#",
    status: "online",
    tone: "teal",
    action: "Open Fleet Booking",
    owner: "sol",
    contact: "sol@teampl.com",
    subOwner: "matthew",
    subContact: "matthew@teampl.com",
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
