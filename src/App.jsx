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
    "Choose the internal page you need and move there quickly from one central gateway.",
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
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" ? "dark" : "light";
}

function getInitialRoute() {
  if (typeof window === "undefined") {
    return "home";
  }

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
  const action = portal.action?.trim() || `Open ${title}`;
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
  if (typeof window === "undefined") {
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  }

  try {
    const stored = window.localStorage.getItem(PORTALS_STORAGE_KEY);

    // Nếu không có dữ liệu HOẶC bạn muốn ép cập nhật khi sửa code:
    if (!stored) {
      return DEFAULT_PORTAL_LINKS.map(normalizePortal);
    }

    const parsed = JSON.parse(stored);

    // Kiểm tra xem dữ liệu cũ có bị lỗi '#' không (logic tự động sửa sai)
    const hasBadLinks = parsed.some(
      (p) => p.href === "#" && p.id === "incident-report",
    );
    if (hasBadLinks) {
      console.warn(
        "Detected old data with '#' links, resetting to defaults...",
      );
      window.localStorage.removeItem(PORTALS_STORAGE_KEY);
      return DEFAULT_PORTAL_LINKS.map(normalizePortal);
    }

    return parsed.map(normalizePortal);
  } catch {
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  }
}

function persistPortals(portals) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
}

function LogoMark({ styles, theme }) {
  return (
    <div
      className={`relative flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-[24px] border sm:h-36 sm:w-36 ${styles.logoWrap}`}
    >
      {/* Hiệu ứng ánh sáng nền */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />

      {/* Viền trong (Inset border) */}
      <div
        className={`absolute inset-[5px] rounded-[20px] border ${styles.logoInset}`}
      />

      {/* Logo chính */}
      <img
        src={BRAND.logoSrc}
        alt={BRAND.logoAlt}
        className={`relative z-10 h-24 w-24 object-contain sm:h-28 sm:w-28 transition-all duration-500 ${
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
      className={`inline-flex items-center gap-1 rounded-full border p-1 ${styles.toggleWrap}`}
    >
      {["light", "dark"].map((option) => {
        const isActive = option === theme;

        return (
          <button
            key={option}
            type="button"
            onClick={() => setTheme(option)}
            aria-pressed={isActive}
            className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition ${
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
      className={`rounded-[24px] border px-5 py-4 backdrop-blur transition-colors duration-300 ${styles.summaryCard}`}
    >
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.22em] ${styles.summaryLabel}`}
      >
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl font-semibold ${styles.summaryValue}`}
      >
        {value}
      </p>
    </div>
  );
}

function PortalCard({ portal, index, theme, styles }) {
  console.log("Portal data:", portal.title, portal.href);
  const tone = TONE_STYLES[theme][portal.tone];
  const status = STATUS_STYLES[theme][portal.status];
  const isOnline = portal.status === "online";

  const sharedClassName = `group relative overflow-hidden rounded-[32px] border p-6 backdrop-blur transition duration-300 sm:p-7 ${
    isOnline
      ? "cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)]"
      : "cursor-not-allowed opacity-90 pointer-events-none"
  } ${styles.card} ${tone.border}`;

  const cardContent = (
    <div className="relative flex h-full flex-col gap-8">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
          >
            {portal.eyebrow}
          </p>

          <h2
            className={`mt-3 font-display text-3xl font-semibold tracking-tight ${styles.title}`}
          >
            {portal.title}
          </h2>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div
            className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] ${styles.cardBadge}`}
          >
            {(index + 1).toString().padStart(2, "0")}
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${status.badge}`}
          >
            <span className={`h-2 w-2 rounded-full ${status.dot}`} />
            {status.label}
          </div>
        </div>
      </div>

      {/* body */}
      <p
        className={`max-w-md text-sm leading-7 sm:text-base sm:leading-8 ${styles.cardText}`}
      >
        {portal.summary}
      </p>

      {/* footer */}
      <div
        className={`mt-auto flex items-center justify-between gap-4 border-t pt-5 ${styles.cardBorder}`}
      >
        <span
          className={`font-mono text-[11px] uppercase tracking-[0.22em] ${styles.cardMeta}`}
        >
          {isOnline ? "Available now" : "Temporarily unavailable"}
        </span>

        {isOnline ? (
          <span
            className={`inline-flex items-center gap-3 text-sm font-semibold transition duration-300 ${styles.actionBase} ${tone.action}`}
          >
            <span>{portal.action}</span>
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-base leading-none`}
            >
              {"->"}
            </span>
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${styles.disabledAction}`}
          >
            <span>Under maintenance</span>
          </span>
        )}
      </div>
    </div>
  );

  // Nền chung cho cả hai trường hợp
  const backgroundLayers = (
    <>
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.accent}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${styles.cardTopLine}`}
      />
      <div
        className={`pointer-events-none absolute left-7 top-0 h-1.5 w-24 rounded-b-full ${styles.cardCap}`}
      />
    </>
  );

  if (isOnline) {
    return (
      <a
        href={portal.href}
        target="_blank"
        rel="noopener noreferrer"
        className={sharedClassName}
      >
        {backgroundLayers}
        {cardContent}
      </a>
    );
  }

  return (
    <div className={sharedClassName}>
      {backgroundLayers}
      {cardContent}
    </div>
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
    <div className={`rounded-[32px] border p-6 sm:p-8 ${styles.panel}`}>
      <p
        className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
      >
        Admin access
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-semibold ${styles.title}`}
      >
        Sign in to manage portal links
      </h2>
      <p className={`mt-3 text-sm leading-7 ${styles.body}`}>
        Admin access lets you add, edit, and remove destination cards for the
        internal gateway.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
          >
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(event) =>
              setCredentials((current) => ({
                ...current,
                username: event.target.value,
              }))
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
            placeholder="Enter admin username"
          />
        </div>

        <div>
          <label
            className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
          >
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(event) =>
              setCredentials((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
            placeholder="Enter admin password"
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <button
          type="submit"
          className={`inline-flex rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition ${styles.primaryButton}`}
        >
          Admin login
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
    setFormState({
      id: portal.id,
      title: portal.title,
      eyebrow: portal.eyebrow,
      summary: portal.summary,
      href: portal.href,
      status: portal.status,
      tone: portal.tone,
      action: portal.action,
    });
  }

  function cancelEdit() {
    setEditingId("");
    setFormState(EMPTY_FORM);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className={`rounded-[32px] border p-6 sm:p-8 ${styles.panel}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p
              className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
            >
              Admin panel
            </p>
            <h2
              className={`mt-3 font-display text-3xl font-semibold ${styles.title}`}
            >
              {isEditing ? "Edit portal" : "Add a new portal"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${styles.ghostButton}`}
          >
            Logout
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Title
              </label>
              <input
                type="text"
                value={formState.title}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
                placeholder="Knowledge Base"
              />
            </div>

            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Category
              </label>
              <input
                type="text"
                value={formState.eyebrow}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    eyebrow: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
                placeholder="Support"
              />
            </div>
          </div>

          <div>
            <label
              className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
            >
              Summary
            </label>
            <textarea
              value={formState.summary}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  summary: event.target.value,
                }))
              }
              className={`min-h-[120px] w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
              placeholder="Explain what this internal page is used for."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Link
              </label>
              <input
                type="text"
                value={formState.href}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    href: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
                placeholder="/knowledge-base"
              />
            </div>

            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Action label
              </label>
              <input
                type="text"
                value={formState.action}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    action: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
                placeholder="Open Knowledge Base"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Status
              </label>
              <select
                value={formState.status}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    status: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
              >
                {PORTAL_STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`mb-2 block font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
              >
                Tone
              </label>
              <select
                value={formState.tone}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    tone: event.target.value,
                  }))
                }
                className={`w-full rounded-2xl border px-4 py-3 outline-none transition ${styles.input}`}
              >
                {PORTAL_TONE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className={`rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition ${styles.primaryButton}`}
            >
              {isEditing ? "Save changes" : "Add portal"}
            </button>

            {isEditing ? (
              <button
                type="button"
                onClick={cancelEdit}
                className={`rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition ${styles.ghostButton}`}
              >
                Cancel
              </button>
            ) : null}

            <button
              type="button"
              onClick={onResetDefaults}
              className={`rounded-full border px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition ${styles.subtleButton}`}
            >
              Reset defaults
            </button>
          </div>
        </form>
      </section>

      <section className={`rounded-[32px] border p-6 sm:p-8 ${styles.panel}`}>
        <p
          className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
        >
          Current portals
        </p>
        <h2
          className={`mt-3 font-display text-3xl font-semibold ${styles.title}`}
        >
          Manage existing entries
        </h2>
        <p className={`mt-3 text-sm leading-7 ${styles.body}`}>
          Changes are saved in this browser through localStorage. This admin
          screen is front-end only and should be replaced with real backend
          authentication later.
        </p>

        <div className="mt-8 space-y-4">
          {portals.map((portal) => (
            <div
              key={portal.id}
              className={`rounded-[24px] border p-5 transition-colors duration-300 ${styles.summaryCard}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.2em] ${styles.overline}`}
                  >
                    {portal.eyebrow}
                  </p>
                  <h3
                    className={`mt-2 font-display text-2xl font-semibold ${styles.title}`}
                  >
                    {portal.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-xl text-sm leading-7 ${styles.body}`}
                  >
                    {portal.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(portal)}
                    className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${styles.ghostButton}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(portal.id)}
                    className={`rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition ${styles.dangerButton}`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${styles.cardBadge}`}
                >
                  {portal.status}
                </span>
                <span
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${styles.cardBadge}`}
                >
                  {portal.tone}
                </span>
                <span
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] ${styles.cardBadge}`}
                >
                  {portal.href}
                </span>
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
    if (typeof window === "undefined") {
      return false;
    }

    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  });
  const [loginError, setLoginError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formState, setFormState] = useState(EMPTY_FORM);

  const styles = THEME_STYLES[theme];

  const summary = useMemo(
    () => ({
      total: portals.length,
      online: portals.filter((portal) => portal.status === "online").length,
      maintenance: portals.filter((portal) => portal.status === "maintenance")
        .length,
    }),
    [portals],
  );

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.style.colorScheme = theme;
    document.body.style.backgroundColor =
      theme === "dark" ? "#10182b" : "#f7f9fc";
    document.body.style.color = theme === "dark" ? "#f8fafc" : "#0f172a";
  }, [theme]);

  useEffect(() => {
    persistPortals(portals);
  }, [portals]);

  useEffect(() => {
    function handlePopState() {
      setRoute(window.location.pathname === "/admin" ? "admin" : "home");
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(nextRoute) {
    const nextPath = nextRoute === "admin" ? "/admin" : "/";
    window.history.pushState({}, "", nextPath);
    setRoute(nextRoute);
  }

  function handleAdminLogin(credentials) {
    const isValid =
      credentials.username === ADMIN_CONFIG.username &&
      credentials.password === ADMIN_CONFIG.password;

    if (!isValid) {
      setLoginError("Invalid admin credentials.");
      return;
    }

    window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    setIsAdminAuthed(true);
    setLoginError("");
  }

  function handleLogout() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAdminAuthed(false);
    setEditingId("");
    setFormState(EMPTY_FORM);
    navigate("home");
  }

  function handlePortalSubmit(event) {
    event.preventDefault();

    const normalized = normalizePortal(
      {
        ...formState,
        id: editingId || createSlug(formState.title),
      },
      portals.length,
    );

    if (editingId) {
      setPortals((current) =>
        current.map((portal) =>
          portal.id === editingId ? normalized : portal,
        ),
      );
    } else {
      const exists = portals.some((portal) => portal.id === normalized.id);
      const nextPortal = exists
        ? { ...normalized, id: `${normalized.id}-${Date.now()}` }
        : normalized;

      setPortals((current) => [...current, nextPortal]);
    }

    setEditingId("");
    setFormState(EMPTY_FORM);
  }

  function handleDeletePortal(id) {
    setPortals((current) => current.filter((portal) => portal.id !== id));

    if (editingId === id) {
      setEditingId("");
      setFormState(EMPTY_FORM);
    }
  }

  function handleResetDefaults() {
    setPortals(DEFAULT_PORTAL_LINKS.map(normalizePortal));
    setEditingId("");
    setFormState(EMPTY_FORM);
  }

  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${styles.shell}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-grid bg-[size:48px_48px] ${styles.grid}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[440px] ${styles.topGlow}`}
      />
      <div
        className={`pointer-events-none absolute -left-16 top-20 h-[240px] w-[240px] rounded-full blur-3xl ${styles.leftGlow}`}
      />
      <div
        className={`pointer-events-none absolute bottom-0 right-0 h-[260px] w-[260px] rounded-full blur-3xl ${styles.rightGlow}`}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header
          className={`rounded-[36px] border px-5 py-6 backdrop-blur transition-colors duration-300 sm:px-6 ${styles.header}`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-5">
              <LogoMark styles={styles} theme={theme} />

              <div className="max-w-xl">
                <p
                  className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
                >
                  Internal navigation
                </p>
                <h1
                  className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${styles.title}`}
                >
                  {BRAND.projectName}
                </h1>
                <p
                  className={`mt-3 text-sm leading-7 sm:text-base ${styles.body}`}
                >
                  {BRAND.description}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <ThemeSwitch theme={theme} setTheme={setTheme} styles={styles} />

              {route === "admin" ? (
                <button
                  type="button"
                  onClick={() => navigate("home")}
                  className={`rounded-full border px-4 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition ${styles.ghostButton}`}
                >
                  Back to home
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => navigate("admin")}
                  className={`rounded-full border font-mono font-semibold uppercase px-6 py-3.5 text-[11px] tracking-[0.22em] transition ${styles.headerAdminButton}`}
                >
                  Admin login
                </button>
              )}
            </div>
          </div>
        </header>

        {route === "admin" ? (
          <section className="flex-1 py-10 sm:py-14">
            {isAdminAuthed ? (
              <AdminEditor
                portals={portals}
                styles={styles}
                editingId={editingId}
                setEditingId={setEditingId}
                formState={formState}
                setFormState={setFormState}
                onSubmit={handlePortalSubmit}
                onDelete={handleDeletePortal}
                onResetDefaults={handleResetDefaults}
                onLogout={handleLogout}
              />
            ) : (
              <div className="mx-auto max-w-2xl">
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
            <section className="pt-10 sm:pt-14">
              <div className="grid gap-4 sm:grid-cols-3">
                <SummaryCard
                  label="Total pages"
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

            <section className="flex-1 py-10 sm:py-14">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p
                    className={`font-mono text-[11px] uppercase tracking-[0.24em] ${styles.overline}`}
                  >
                    Available destinations
                  </p>
                  <h2
                    className={`mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${styles.title}`}
                  >
                    Open the page you need
                  </h2>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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
