// Supported status values: "online" | "maintenance"
// Supported tone values: "blue" | "teal" | "amber"
// Default (production): empty — real data comes from API /api/portals
export const DEFAULT_PORTAL_LINKS = [];

// Sample data for local development only — loaded via import.meta.env.DEV
export const SAMPLE_PORTAL_LINKS = [
  {
    id: "hr-portal",
    title: "HR & People Portal",
    eyebrow: "Human Resources",
    summary: "Access payslips, benefits, leave requests, and performance reviews. Your one-stop shop for all HR services.",
    href: "https://hr.example.com",
    status: "online",
    tone: "blue",
    action: "Go to HR",
    owner: "Sarah Nguyen",
    contact: "hr@example.com",
    subOwner: "David Tran",
    subContact: "david.tran@example.com",
  },
  {
    id: "it-service-desk",
    title: "IT Service Desk",
    eyebrow: "Information Technology",
    summary: "Submit IT tickets, request software, reset passwords, and check system status.",
    href: "https://it.example.com",
    status: "online",
    tone: "teal",
    action: "Open Desk",
    owner: "Michael Le",
    contact: "it-support@example.com",
    subOwner: "Lisa Pham",
    subContact: "lisa.pham@example.com",
  },
  {
    id: "finance-hub",
    title: "Finance Hub",
    eyebrow: "Finance & Accounting",
    summary: "Expense claims, invoice approvals, budget tracking, and procurement workflows.",
    href: "https://finance.example.com",
    status: "online",
    tone: "amber",
    action: "Enter Hub",
    owner: "Emily Dang",
    contact: "finance@example.com",
    subOwner: "James Hoang",
    subContact: "james.hoang@example.com",
  },
  {
    id: "learning-platform",
    title: "Learning & Development",
    eyebrow: "Training",
    summary: "Browse courses, enroll in workshops, track certifications, and manage your learning path.",
    href: "https://lms.example.com",
    status: "online",
    tone: "blue",
    action: "Start Learning",
    owner: "Anna Vu",
    contact: "training@example.com",
    subOwner: "Tom Bui",
    subContact: "tom.bui@example.com",
  },
  {
    id: "cms-admin",
    title: "CMS Admin Panel",
    eyebrow: "Content Management",
    summary: "Manage website content, publish articles, and configure site-wide settings for the company intranet.",
    href: "https://cms.example.com",
    status: "maintenance",
    tone: "amber",
    action: "Visit CMS",
    owner: "Chris Phan",
    contact: "cms-team@example.com",
    subOwner: "Katie Do",
    subContact: "katie.do@example.com",
  },
];

export const PORTAL_STATUS_OPTIONS = ["online", "maintenance"];
export const PORTAL_TONE_OPTIONS = ["blue", "teal", "amber"];

// Frontend-only admin access for local portal management.
// Set these via Vite env vars for production: VITE_ADMIN_USER / VITE_ADMIN_PASS
export const ADMIN_CONFIG = {
  username: import.meta.env.VITE_ADMIN_USER || "admin",
  password: import.meta.env.VITE_ADMIN_PASS || "",
};
