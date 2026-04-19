import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_CONFIG,
  DEFAULT_PORTAL_LINKS,
  PORTAL_STATUS_OPTIONS,
  PORTAL_TONE_OPTIONS,
} from "./data/portalLinks";

const THEME_STORAGE_KEY = "employee-gateway-theme";
const PORTALS_STORAGE_KEY = "employee-gateway-portals";
const ADMIN_SESSION_KEY = "employee-gateway-admin-session";

const BRAND = {
  projectName: "Employee Gateway",
  description:
    "Select the internal portal you need and navigate quickly from a single central company hub.",
  logoSrc: "/teampl.png",
  logoAlt: "Company logo",
};

const EMPTY_FORM = {
  id: "",
  title: "",
  eyebrow: "",
  summary: "",
  href: "",
  status: "online",
  tone: "blue",
  action: "",
};

const THEME_STYLES = {
  light: {
    shell:
      "bg-[linear-gradient(180deg,#fbfdff_0%,#f5f8fd_48%,#eef3f8_100%)] text-slate-950",
    grid: "opacity-20",
    topGlow:
      "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_62%)]",
    leftGlow:
      "bg-[radial-gradient(circle,rgba(37,99,235,0.05),transparent_74%)]",
    rightGlow:
      "bg-[radial-gradient(circle,rgba(20,184,166,0.05),transparent_74%)]",
    header:
      "border-slate-200/90 bg-white/92 shadow-[0_18px_42px_rgba(15,23,42,0.06)]",
    logoWrap:
      "border-slate-200/80 bg-white/88 shadow-[0_8px_20px_rgba(15,23,42,0.05)]",
    logoInset: "border-slate-200/60",
    overline: "text-slate-500",
    title: "text-slate-950",
    body: "text-slate-600",
    toggleWrap: "border-slate-200 bg-slate-100/90",
    toggleActive:
      "bg-white text-slate-950 shadow-[0_8px_16px_rgba(15,23,42,0.08)]",
    toggleIdle: "text-slate-500 hover:text-slate-700",
    primaryButton:
      "border-blue-200 bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_22px_rgba(37,99,235,0.18)]",
    headerAdminButton:
      "border-blue-200 bg-blue-600 text-white hover:bg-blue-700 shadow-[0_14px_28px_rgba(37,99,235,0.22)]",
    ghostButton: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    subtleButton:
      "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200",
    summaryCard:
      "border-slate-200 bg-white/88 text-slate-700 shadow-[0_14px_30px_rgba(15,23,42,0.05)]",
    summaryValue: "text-slate-950",
    summaryLabel: "text-slate-500",
    card: "border-slate-200 bg-white/[0.96] shadow-[0_14px_34px_rgba(15,23,42,0.06)]",
    cardBorder: "border-slate-200/90",
    cardTopLine: "bg-slate-200/90",
    cardCap: "bg-slate-300/65",
    cardBadge: "border-slate-200 bg-slate-50 text-slate-500",
    cardText: "text-slate-600",
    cardMeta: "text-slate-400",
    actionBase: "text-slate-700",
    arrowBase: "border-slate-200 bg-slate-50 text-slate-700",
    disabledAction: "border-slate-200 bg-slate-100 text-slate-500",
    panel:
      "border-slate-200 bg-white/[0.96] shadow-[0_16px_34px_rgba(15,23,42,0.06)]",
    input:
      "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100",
    helper: "text-slate-500",
    dangerButton:
      "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
  },
  dark: {
    shell:
      "bg-[linear-gradient(180deg,#0e1628_0%,#111d31_50%,#0c1424_100%)] text-slate-100",
    grid: "opacity-10",
    topGlow:
      "bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.1),transparent_62%)]",
    leftGlow:
      "bg-[radial-gradient(circle,rgba(37,99,235,0.08),transparent_74%)]",
    rightGlow:
      "bg-[radial-gradient(circle,rgba(45,212,191,0.06),transparent_74%)]",
    header:
      "border-white/10 bg-white/[0.05] shadow-[0_22px_52px_rgba(2,6,23,0.28)]",
    logoWrap:
      "border-white/10 bg-white/[0.04] shadow-[0_10px_24px_rgba(2,6,23,0.18)]",
    logoInset: "border-white/[0.1]",
    overline: "text-slate-400",
    title: "text-slate-50",
    body: "text-slate-300",
    toggleWrap: "border-white/10 bg-white/[0.06]",
    toggleActive:
      "bg-slate-100 text-slate-950 shadow-[0_10px_20px_rgba(15,23,42,0.22)]",
    toggleIdle: "text-slate-400 hover:text-slate-200",
    primaryButton:
      "border-sky-400/20 bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-[0_12px_24px_rgba(56,189,248,0.18)]",
    headerAdminButton:
      "border-sky-300/30 bg-gradient-to-r from-sky-400 to-cyan-300 text-slate-950 hover:brightness-110 shadow-[0_18px_38px_rgba(56,189,248,0.28)] ring-1 ring-white/10",
    ghostButton:
      "border-white/10 bg-white/[0.06] text-slate-200 hover:bg-white/[0.1]",
    subtleButton:
      "border-white/10 bg-white/[0.06] text-slate-300 hover:bg-white/[0.12]",
    summaryCard:
      "border-white/10 bg-white/[0.06] text-slate-300 shadow-[0_18px_34px_rgba(2,6,23,0.24)]",
    summaryValue: "text-slate-50",
    summaryLabel: "text-slate-400",
    card: "border-white/10 bg-[#111b31]/[0.88] shadow-[0_18px_40px_rgba(2,6,23,0.28)]",
    cardBorder: "border-white/10",
    cardTopLine: "bg-white/[0.12]",
    cardCap: "bg-white/[0.18]",
    cardBadge: "border-white/10 bg-white/[0.06] text-slate-400",
    cardText: "text-slate-300",
    cardMeta: "text-slate-500",
    actionBase: "text-slate-200",
    arrowBase: "border-white/10 bg-white/[0.06] text-slate-200",
    disabledAction: "border-white/10 bg-white/[0.06] text-slate-500",
    panel:
      "border-white/10 bg-[#111b31]/[0.92] shadow-[0_20px_40px_rgba(2,6,23,0.28)]",
    input:
      "border-white/10 bg-white/[0.06] text-slate-100 placeholder:text-slate-500 focus:border-sky-400/30 focus:ring-2 focus:ring-sky-400/10",
    helper: "text-slate-400",
    dangerButton:
      "border-red-400/15 bg-red-400/10 text-red-300 hover:bg-red-400/15",
  },
};

const TONE_STYLES = {
  light: {
    blue: {
      accent: "from-blue-100 via-blue-50 to-transparent",
      border: "group-hover:border-blue-300",
      action: "group-hover:text-blue-600",
      arrow:
        "group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600",
    },
    teal: {
      accent: "from-teal-100 via-teal-50 to-transparent",
      border: "group-hover:border-teal-300",
      action: "group-hover:text-teal-700",
      arrow:
        "group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700",
    },
    amber: {
      accent: "from-amber-100 via-amber-50 to-transparent",
      border: "group-hover:border-amber-300",
      action: "group-hover:text-amber-700",
      arrow:
        "group-hover:border-amber-200 group-hover:bg-amber-50 group-hover:text-amber-700",
    },
  },
  dark: {
    blue: {
      accent: "from-sky-400/[0.14] via-sky-400/[0.04] to-transparent",
      border: "group-hover:border-sky-400/30",
      action: "group-hover:text-sky-300",
      arrow:
        "group-hover:border-sky-400/25 group-hover:bg-sky-400/10 group-hover:text-sky-300",
    },
    teal: {
      accent: "from-teal-400/[0.14] via-teal-400/[0.04] to-transparent",
      border: "group-hover:border-teal-400/30",
      action: "group-hover:text-teal-300",
      arrow:
        "group-hover:border-teal-400/25 group-hover:bg-teal-400/10 group-hover:text-teal-300",
    },
    amber: {
      accent: "from-amber-400/[0.14] via-amber-400/[0.04] to-transparent",
      border: "group-hover:border-amber-400/30",
      action: "group-hover:text-amber-300",
      arrow:
        "group-hover:border-amber-400/25 group-hover:bg-amber-400/10 group-hover:text-amber-300",
    },
  },
};

const STATUS_STYLES = {
  light: {
    online: {
      label: "Online",
      dot: "bg-emerald-500",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    maintenance: {
      label: "Maintenance",
      dot: "bg-amber-500",
      badge: "border-amber-200 bg-amber-50 text-amber-700",
    },
  },
  dark: {
    online: {
      label: "Online",
      dot: "bg-emerald-300",
      badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },
    maintenance: {
      label: "Maintenance",
      dot: "bg-amber-300",
      badge: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
  },
};

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" ? "dark" : "light";
}

function getInitialRoute() {
  if (typeof window === "undefined") return "home";
  return window.location.pathname === "/admin" ? "admin" : "home";
}

function createSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizePortal(portal, index = 0) {
  const title = portal.title?.trim() || `Portal ${index + 1}`;
  const summary = portal.summary?.trim() || "Open this internal page.";
  const href = portal.href || "#";
  const eyebrow = portal.eyebrow?.trim() || "General";
  const action = portal.action?.trim() || `Access ${title}`;
  const tone = PORTAL_TONE_OPTIONS.includes(portal.tone) ? portal.tone : "blue";
  const status = PORTAL_STATUS_OPTIONS.includes(portal.status)
    ? portal.status
    : "online";

  return {
    id: portal.id?.trim() || createSlug(title) || `portal-${index + 1}`,
    title,
    eyebrow,
    summary,
    href,
    status,
    tone,
    action,
  };
}

function loadPortals() {
  if (typeof window === "undefined")
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  try {
    const stored = window.localStorage.getItem(PORTALS_STORAGE_KEY);
    if (!stored) return DEFAULT_PORTAL_LINKS.map(normalizePortal);
    const parsed = JSON.parse(stored);
    return parsed.map(normalizePortal);
  } catch {
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  }
}

function persistPortals(portals) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
}

function LogoMark({ styles, theme }) {
  return (
    <div
      className={`relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border sm:h-44 sm:w-44 ${styles.logoWrap}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />
      <div
        className={`absolute inset-[8px] rounded-[24px] border ${styles.logoInset}`}
      />
      <img
        src={BRAND.logoSrc}
        alt={BRAND.logoAlt}
        className={`relative z-10 h-32 w-32 object-contain sm:h-36 sm:w-36 transition-all duration-500 ${
          theme === "dark"
            ? "brightness-0 invert opacity-90 hover:opacity-100"
            : "brightness-100"
        }`}
      />
    </div>
  );
}

function ThemeSwitch({ theme, setTheme, styles }) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-1.5 ${styles.toggleWrap}`}
    >
      {["light", "dark"].map((option) => {
        const isActive = option === theme;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            aria-pressed={isActive}
            className={`rounded-full px-6 py-3 font-mono text-[12px] uppercase tracking-[0.22em] transition ${
              isActive ? styles.toggleActive : styles.toggleIdle
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function SummaryCard({ label, value, styles }) {
  return (
    <div
      className={`rounded-[32px] border px-8 py-7 backdrop-blur transition-colors duration-300 ${styles.summaryCard}`}
    >
      <p
        className={`font-mono text-[12px] uppercase tracking-[0.22em] ${styles.summaryLabel}`}
      >
        {label}
      </p>
      <p
        className={`mt-3 font-display text-4xl font-semibold ${styles.summaryValue}`}
      >
        {value}
      </p>
    </div>
  );
}

function PortalCard({ portal, index, theme, styles }) {
  const tone = TONE_STYLES[theme][portal.tone];
  const status = STATUS_STYLES[theme][portal.status];
  const isOnline = portal.status === "online";

  const sharedClassName = `group relative overflow-hidden rounded-[40px] border p-8 backdrop-blur transition duration-300 sm:p-10 ${
    isOnline
      ? "cursor-pointer hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,23,42,0.15)]"
      : "cursor-not-allowed opacity-90 pointer-events-none"
  } ${styles.card} ${tone.border}`;

  const cardContent = (
    <div className="relative flex h-full flex-col gap-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p
            className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
          >
            {portal.eyebrow}
          </p>
          <h2
            className={`mt-4 font-display text-4xl font-semibold tracking-tight ${styles.title}`}
          >
            {portal.title}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-3">
          <div
            className={`rounded-full border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.2em] ${styles.cardBadge}`}
          >
            {(index + 1).toString().padStart(2, "0")}
          </div>
          <div
            className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.18em] ${status.badge}`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>
      </div>
      <p
        className={`max-w-2xl text-base leading-8 sm:text-lg sm:leading-9 ${styles.cardText}`}
      >
        {portal.summary}
      </p>
      <div
        className={`mt-auto flex items-center justify-between gap-6 border-t pt-7 ${styles.cardBorder}`}
      >
        <span
          className={`font-mono text-[12px] uppercase tracking-[0.22em] ${styles.cardMeta}`}
        >
          {isOnline ? "Available" : "Maintenance"}
        </span>
        {isOnline ? (
          <span
            className={`inline-flex items-center gap-4 text-base font-semibold transition duration-300 ${styles.actionBase} ${tone.action}`}
          >
            <span>{portal.action}</span>
            <span
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border text-lg leading-none`}
            >
              {"->"}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-base font-semibold ${styles.disabledAction}`}
          >
            <span>Paused</span>
          </span>
        )}
      </div>
    </div>
  );

  return (
    <a
      href={isOnline ? portal.href : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={sharedClassName}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.accent}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${styles.cardTopLine}`}
      />
      <div
        className={`pointer-events-none absolute left-10 top-0 h-2 w-32 rounded-b-full ${styles.cardCap}`}
      />
      {cardContent}
    </a>
  );
}

function AdminLogin({ styles, onLogin, error }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  function handleSubmit(event) {
    event.preventDefault();
    onLogin(credentials);
  }

  return (
    <div className={`rounded-[40px] border p-10 sm:p-14 ${styles.panel}`}>
      <p
        className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
      >
        Admin Access
      </p>
      <h2
        className={`mt-5 font-display text-4xl font-semibold ${styles.title}`}
      >
        Admin Sign In
      </h2>
      <p className={`mt-5 text-lg leading-8 ${styles.body}`}>
        Sign in with your admin account to manage portal links.
      </p>
      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
          >
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, username: e.target.value }))
            }
            className={`w-full rounded-2xl border px-6 py-4 text-lg outline-none transition ${styles.input}`}
            placeholder="Enter username"
          />
        </div>
        <div>
          <label
            className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
          >
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, password: e.target.value }))
            }
            className={`w-full rounded-2xl border px-6 py-4 text-lg outline-none transition ${styles.input}`}
            placeholder="Enter password"
          />
        </div>
        {error ? (
          <p className="text-base text-red-500 font-medium">{error}</p>
        ) : null}
        <button
          type="submit"
          className={`inline-flex rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] transition ${styles.primaryButton}`}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

function AdminEditor({
  portals,
  styles,
  editingId,
  setEditingId,
  formState,
  setFormState,
  onSubmit,
  onDelete,
  onResetDefaults,
  onLogout,
}) {
  const isEditing = Boolean(editingId);
  function startEdit(portal) {
    setEditingId(portal.id);
    setFormState({ ...portal });
  }
  function cancelEdit() {
    setEditingId("");
    setFormState(EMPTY_FORM);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <section className={`rounded-[40px] border p-10 sm:p-14 ${styles.panel}`}>
        <div className="flex items-start justify-between gap-6">
          <div>
            <p
              className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
            >
              Admin Panel
            </p>
            <h2
              className={`mt-5 font-display text-4xl font-semibold ${styles.title}`}
            >
              {isEditing ? "Update Portal" : "Add New Portal"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className={`rounded-full border px-6 py-3 font-mono text-[12px] uppercase tracking-[0.2em] transition ${styles.ghostButton}`}
          >
            Logout
          </button>
        </div>
        <form className="mt-10 space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Title
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(e) =>
                  setFormState((c) => ({ ...c, title: e.target.value }))
                }
                className={`w-full rounded-2xl border px-5 py-4 text-lg outline-none transition ${styles.input}`}
                placeholder="e.g. Knowledge Base"
              />
            </div>
            <div>
              <label
                className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Category
              </label>
              <input
                type="text"
                value={formState.eyebrow}
                onChange={(e) =>
                  setFormState((c) => ({ ...c, eyebrow: e.target.value }))
                }
                className={`w-full rounded-2xl border px-5 py-4 text-lg outline-none transition ${styles.input}`}
                placeholder="e.g. Support"
              />
            </div>
          </div>
          <div>
            <label
              className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
            >
              Description
            </label>
            <textarea
              value={formState.summary}
              onChange={(e) =>
                setFormState((c) => ({ ...c, summary: e.target.value }))
              }
              className={`min-h-[160px] w-full rounded-2xl border px-5 py-4 text-lg outline-none transition ${styles.input}`}
              placeholder="Explain what this portal is for..."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label
                className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                URL Path
              </label>
              <input
                type="text"
                value={formState.href}
                onChange={(e) =>
                  setFormState((c) => ({ ...c, href: e.target.value }))
                }
                className={`w-full rounded-2xl border px-5 py-4 text-lg outline-none transition ${styles.input}`}
                placeholder="https://..."
              />
            </div>
            <div>
              <label
                className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Action Text
              </label>
              <input
                type="text"
                value={formState.action}
                onChange={(e) =>
                  setFormState((c) => ({ ...c, action: e.target.value }))
                }
                className={`w-full rounded-2xl border px-5 py-4 text-lg outline-none transition ${styles.input}`}
                placeholder="e.g. Access Now"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <button
              type="submit"
              className={`rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] transition ${styles.primaryButton}`}
            >
              {isEditing ? "Save Changes" : "Add Portal"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={cancelEdit}
                className={`rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] transition ${styles.ghostButton}`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section className={`rounded-[40px] border p-10 sm:p-14 ${styles.panel}`}>
        <p
          className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
        >
          Active Portals
        </p>
        <h2
          className={`mt-5 font-display text-4xl font-semibold ${styles.title}`}
        >
          Manage Entries
        </h2>
        <div className="mt-10 space-y-6">
          {portals.map((p) => (
            <div
              key={p.id}
              className={`rounded-[32px] border p-7 ${styles.summaryCard}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="max-w-md">
                  <h3
                    className={`font-display text-2xl font-semibold ${styles.title}`}
                  >
                    {p.title}
                  </h3>
                  <p className={`mt-2 text-base line-clamp-1 ${styles.body}`}>
                    {p.summary}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(p)}
                    className={`rounded-full border px-5 py-2.5 text-[12px] uppercase font-bold transition ${styles.ghostButton}`}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(p.id)}
                    className={`rounded-full border px-5 py-2.5 text-[12px] uppercase font-bold transition ${styles.dangerButton}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [route, setRoute] = useState(getInitialRoute);
  const [portals, setPortals] = useState(loadPortals);
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });
  const [loginError, setLoginError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formState, setFormState] = useState(EMPTY_FORM);
  const styles = THEME_STYLES[theme];

  const summary = useMemo(
    () => ({
      total: portals.length,
      online: portals.filter((p) => p.status === "online").length,
      maintenance: portals.filter((p) => p.status === "maintenance").length,
    }),
    [portals],
  );

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => persistPortals(portals), [portals]);

  useEffect(() => {
    const handlePopState = () =>
      setRoute(window.location.pathname === "/admin" ? "admin" : "home");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextRoute) {
    const nextPath = nextRoute === "admin" ? "/admin" : "/";
    window.history.pushState({}, "", nextPath);
    setRoute(nextRoute);
  }

  function handleAdminLogin(cred) {
    if (
      cred.username === ADMIN_CONFIG.username &&
      cred.password === ADMIN_CONFIG.password
    ) {
      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      setIsAdminAuthed(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials provided.");
    }
  }

  function handleLogout() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthed(false);
    navigate("home");
  }

  function handlePortalSubmit(e) {
    e.preventDefault();
    const normalized = normalizePortal(
      { ...formState, id: editingId || createSlug(formState.title) },
      portals.length,
    );
    if (editingId) {
      setPortals((curr) =>
        curr.map((p) => (p.id === editingId ? normalized : p)),
      );
    } else {
      setPortals((curr) => [...curr, normalized]);
    }
    setEditingId("");
    setFormState(EMPTY_FORM);
  }

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 pb-20 ${styles.shell}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-grid bg-[size:60px_60px] ${styles.grid}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[600px] ${styles.topGlow}`}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 py-10 sm:px-12 lg:px-16">
        <header
          className={`rounded-[48px] border px-8 py-10 backdrop-blur transition-colors duration-300 sm:px-12 ${styles.header}`}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-10">
              <LogoMark styles={styles} theme={theme} />
              <div className="max-w-3xl">
                <p
                  className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
                >
                  Internal Navigation Gateway
                </p>
                <h1
                  className={`mt-5 font-display text-5xl font-bold tracking-tight sm:text-6xl ${styles.title}`}
                >
                  {BRAND.projectName}
                </h1>
                <p
                  className={`mt-6 text-lg leading-9 sm:text-xl ${styles.body}`}
                >
                  {BRAND.description}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <ThemeSwitch theme={theme} setTheme={setTheme} styles={styles} />
              {route === "admin" && (
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  className={`rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] transition ${styles.ghostButton}`}
                >
                  Exit Admin
                </button>
              )}
            </div>
          </div>
        </header>

        {route === "admin" ? (
          <section className="flex-1 py-16">
            {isAdminAuthed ? (
              <AdminEditor
                portals={portals}
                styles={styles}
                editingId={editingId}
                setEditingId={setEditingId}
                formState={formState}
                setFormState={setFormState}
                onSubmit={handlePortalSubmit}
                onDelete={(id) =>
                  setPortals((c) => c.filter((p) => p.id !== id))
                }
                onResetDefaults={() =>
                  setPortals(DEFAULT_PORTAL_LINKS.map(normalizePortal))
                }
                onLogout={handleLogout}
              />
            ) : (
              <div className="mx-auto max-w-3xl">
                <AdminLogin
                  styles={styles}
                  onLogin={handleAdminLogin}
                  error={loginError}
                />
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="pt-16">
              <div className="grid gap-8 sm:grid-cols-3">
                <SummaryCard
                  label="Total Portals"
                  value={summary.total}
                  styles={styles}
                />
                <SummaryCard
                  label="Online"
                  value={summary.online}
                  styles={styles}
                />
                <SummaryCard
                  label="Maintenance"
                  value={summary.maintenance}
                  styles={styles}
                />
              </div>
            </section>

            <section className="flex-1 py-16">
              <div className="mb-10">
                <p
                  className={`font-mono text-[12px] uppercase tracking-[0.24em] ${styles.overline}`}
                >
                  Available Destinations
                </p>
                <h2
                  className={`mt-4 font-display text-4xl font-semibold tracking-tight ${styles.title}`}
                >
                  Internal Access Directory
                </h2>
              </div>
              <div className="grid gap-10 md:grid-cols-2">
                {portals.map((portal, index) => (
                  <PortalCard
                    key={portal.id}
                    portal={portal}
                    index={index}
                    theme={theme}
                    styles={styles}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
