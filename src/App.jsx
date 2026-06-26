import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ADMIN_CONFIG,
  DEFAULT_PORTAL_LINKS,
  SAMPLE_PORTAL_LINKS,
  PORTAL_STATUS_OPTIONS,
  PORTAL_TONE_OPTIONS,
} from "./data/portalLinks";
import { createIssueReport, validateIssueReport, buildTicketPayload } from "./reportIssueFlow";
import { submitTicket } from "./submitTicket";


const ADMIN_SESSION_KEY = "employee-gateway-admin-session";
const ADMIN_AUTH_KEY = "employee-gateway-admin-auth";
const PORTALS_API = "/api/portals";

const BRAND = {
  projectName: "Employee Gateway",
  description:
    "Select the internal portal you need and navigate quickly from a single central company hub.",
  logoSrc: "/timpl.png",
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
  owner: "",
  contact: "",
  subOwner: "",
  subContact: "",
};

// Cố định cấu hình Light Mode
const STYLES = {
  shell:
    "bg-[linear-gradient(180deg,#fbfdff_0%,#f5f8fd_48%,#eef3f8_100%)] text-slate-950",
  grid: "opacity-20",
  topGlow:
    "bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08),transparent_62%)]",
  header:
    "border-slate-200/90 bg-white/92 shadow-[0_18px_42px_rgba(15,23,42,0.06)]",
  logoWrap:
    "border-slate-200/80 bg-white/88 shadow-[0_8px_20px_rgba(15,23,42,0.05)]",
  logoInset: "border-slate-200/60",
  overline: "text-slate-500",
  title: "text-slate-950",
  body: "text-slate-600",
  primaryButton:
    "border-blue-200 bg-blue-600 text-white hover:bg-blue-700 shadow-[0_10px_22px_rgba(37,99,235,0.18)]",
  ghostButton: "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
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
  disabledAction: "border-slate-200 bg-slate-100 text-slate-500",
  panel:
    "border-slate-200 bg-white/[0.96] shadow-[0_16px_34px_rgba(15,23,42,0.06)]",
  input:
    "border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:ring-2 focus:ring-blue-100",
  dangerButton:
    "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
};

const TONE_STYLES = {
  blue: {
    accent: "from-blue-100 via-blue-50 to-transparent",
    border: "group-hover:border-blue-300",
    action: "group-hover:text-blue-600",
  },
  teal: {
    accent: "from-teal-100 via-teal-50 to-transparent",
    border: "group-hover:border-teal-300",
    action: "group-hover:text-teal-700",
  },
  amber: {
    accent: "from-amber-100 via-amber-50 to-transparent",
    border: "group-hover:border-amber-300",
    action: "group-hover:text-amber-700",
  },
};

const STATUS_STYLES = {
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
};

const SUMMARY_CHIP_STYLES = {
  total: {
    wrap: "border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-900",
    label: "text-blue-700",
    value: "text-blue-950",
    dot: "bg-blue-500",
  },
  online: {
    wrap: "border-emerald-200 bg-gradient-to-r from-emerald-50 to-lime-50 text-emerald-900",
    label: "text-emerald-700",
    value: "text-emerald-950",
    dot: "bg-emerald-500",
  },
  maintenance: {
    wrap: "border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900",
    label: "text-amber-700",
    value: "text-amber-950",
    dot: "bg-amber-500",
  },
};

// Helper Functions
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
  return {
    id: portal.id?.trim() || createSlug(title) || `portal-${index + 1}`,
    title,
    eyebrow: portal.eyebrow?.trim() || "General",
    summary: portal.summary?.trim() || "Open this internal page.",
    href: portal.href || "#",
    status: PORTAL_STATUS_OPTIONS.includes(portal.status)
      ? portal.status
      : "online",
    tone: PORTAL_TONE_OPTIONS.includes(portal.tone) ? portal.tone : "blue",
    action: portal.action?.trim() || `Access ${title}`,
    owner: portal.owner?.trim() || "",
    contact: portal.contact?.trim() || "",
    subOwner: portal.subOwner?.trim() || "",
    subContact: portal.subContact?.trim() || "",
  };
}

async function fetchPortals() {
  const res = await fetch(PORTALS_API, { cache: "no-store" });
  if (!res.ok) throw new Error(`GET ${PORTALS_API} -> ${res.status}`);
  const data = await res.json();
  return (Array.isArray(data) ? data : []).map(normalizePortal);
}

async function savePortals(portals, authHeader) {
  const res = await fetch(PORTALS_API, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify(portals),
  });
  if (!res.ok) throw new Error(`PUT ${PORTALS_API} -> ${res.status}`);
}

// Components
function getPortalGridClass(count) {
  if (count >= 4) return "sm:grid-cols-2 lg:grid-cols-4";
  if (count >= 2) return "sm:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1";
}

function LogoMark({ compact = false }) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden border ${
        compact
          ? "h-40 w-40 rounded-[32px] sm:h-44 sm:w-44"
          : "h-40 w-40 rounded-[32px] sm:h-44 sm:w-44"
      } ${STYLES.logoWrap}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />
      <div
        className={`absolute ${
          compact ? "inset-[3px] rounded-[28px]" : "inset-[8px] rounded-[28px]"
        } border ${STYLES.logoInset}`}
      />
      <img
        src={BRAND.logoSrc}
        alt={BRAND.logoAlt}
        className={`relative z-10 object-contain ${
          compact
            ? "h-[7.75rem] w-[7.75rem] sm:h-[8.75rem] sm:w-[8.75rem]"
            : "h-32 w-32 sm:h-36 sm:w-36"
        }`}
      />
    </div>
  );
}

function SummaryChip({ label, value, tone }) {
  const toneStyle = SUMMARY_CHIP_STYLES[tone];

  return (
    <div
      className={`inline-flex min-w-[150px] items-center gap-3 rounded-full border px-4 py-3 backdrop-blur transition-colors duration-300 sm:px-5 ${STYLES.summaryCard} ${toneStyle.wrap}`}
    >
      <span className={`h-2.5 w-2.5 rounded-full ${toneStyle.dot}`} />
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${toneStyle.label}`}
      >
        {label}
      </p>
      <p
        className={`ml-auto font-display text-lg font-semibold sm:text-xl ${toneStyle.value}`}
      >
        {value}
      </p>
    </div>
  );
}

function PortalCard({ portal, index }) {
  const tone = TONE_STYLES[portal.tone];
  const status = STATUS_STYLES[portal.status];
  const isOnline = portal.status === "online";
  const hasOwner = portal.owner || portal.subOwner;

  return (
    <a
      href={isOnline ? portal.href : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative h-full overflow-hidden rounded-[28px] border p-5 backdrop-blur transition duration-300 sm:p-6 ${
        isOnline
          ? "cursor-pointer hover:-translate-y-1.5 hover:shadow-[0_24px_48px_rgba(15,23,42,0.12)]"
          : "cursor-not-allowed opacity-90 pointer-events-none"
      } ${STYLES.card} ${tone.border}`}
    >
      {/* Background gradient */}
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.accent}`}
      />
      {/* Top decorative line + cap */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${STYLES.cardTopLine}`}
      />
      <div
        className={`pointer-events-none absolute left-6 top-0 h-2 w-20 rounded-b-full ${STYLES.cardCap}`}
      />

      <div className="relative flex h-full flex-col gap-5">
        {/* ── Header: eyebrow + title + badges ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
              {portal.eyebrow}
            </p>
            <h2 className="mt-1.5 font-display text-xl font-bold leading-tight tracking-tight text-slate-950 sm:text-2xl">
              {portal.title}
            </h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
              {(index + 1).toString().padStart(2, "0")}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] ${status.badge}`}>
              <span className={`h-2 w-2 rounded-full ${status.dot}`} />
              {status.label}
            </span>
          </div>
        </div>

        {/* ── Description ── */}
        <p className="text-sm leading-relaxed text-slate-700 sm:text-[15px]">
          {portal.summary}
        </p>

        {/* ── Owner / Sub-owner section ── */}
        {hasOwner && (
          <div className="mt-auto space-y-3">
            {/* Action bar */}
            <div className={`flex items-center justify-between gap-3 border-t pt-4 ${STYLES.cardBorder}`}>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                {isOnline ? "Available" : "Maintenance"}
              </span>
              {isOnline ? (
                <span className={`inline-flex items-center gap-2 text-sm font-semibold transition duration-300 ${STYLES.actionBase} ${tone.action}`}>
                  <span className="max-w-[10rem] truncate">{portal.action}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-base leading-none">
                    &#8599;
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-500">
                  Paused
                </span>
              )}
            </div>

            {/* Contact cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Owner */}
              <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white/70 p-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Owner
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                  {portal.owner || "—"}
                </p>
                {portal.contact && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {portal.contact}
                  </p>
                )}
              </div>
              {/* Sub-owner */}
              <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white/70 p-3">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  Sub-owner
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-slate-900">
                  {portal.subOwner || "—"}
                </p>
                {portal.subContact && (
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {portal.subContact}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Fallback when no owner info */}
        {!hasOwner && (
          <div className={`mt-auto flex items-center justify-between gap-3 border-t pt-4 ${STYLES.cardBorder}`}>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {isOnline ? "Available" : "Maintenance"}
            </span>
            {isOnline ? (
              <span className={`inline-flex items-center gap-2 text-sm font-semibold transition duration-300 ${STYLES.actionBase} ${tone.action}`}>
                <span className="max-w-[10rem] truncate">{portal.action}</span>
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border text-base leading-none">
                  &#8599;
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-4 py-1.5 text-sm font-semibold text-slate-500">
                Paused
              </span>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

function IssueReportModal({ portals, onClose }) {
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [reporter, setReporter] = useState({
    email: "",
  });
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmedReport, setConfirmedReport] = useState(null);
  const [submissionState, setSubmissionState] = useState("idle"); // idle | submitting | success | error
  const [submissionError, setSubmissionError] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const dialogRef = useRef(null);
  const selectedProject = useMemo(
    () => portals.find((portal) => portal.id === selectedProjectId),
    [portals, selectedProjectId],
  );

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateIssueReport({
      projectId: selectedProjectId,
      description,
      fullName: reporter.email,
      ...reporter,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const report = createIssueReport({
      projectId: selectedProjectId,
      description,
      fullName: reporter.email,
      ...reporter,
    });
    const payload = buildTicketPayload(
      { ...report, projectTitle: selectedProject.title },
      priority,
    );

    setSubmissionState("submitting");
    setSubmissionError("");

    const result = await submitTicket(payload);
    if (result.success) {
      setSubmittedTicketId(result.ticketId);
      setIsNewUser(result.isNewUser === true);
      setConfirmedReport({ ...report, priority });
      setSubmissionState("success");
    } else {
      setSubmissionError(result.error);
      setSubmissionState("error");
    }
  };

  const selectProject = (projectId) => {
    setSelectedProjectId(projectId);
    setErrors({});
    setConfirmedReport(null);
    setSubmissionState("idle");
    setSubmissionError("");
    setSubmittedTicketId("");
    setIsNewUser(false);
  };

  const updateReporter = (field, value) => {
    setReporter((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const canSubmit = Boolean(
    selectedProject &&
    reporter.email.trim() &&
    priority &&
    description.trim() &&
    submissionState !== "submitting",
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="issue-report-title"
        tabIndex={-1}
        className="relative flex max-h-[96vh] w-full max-w-[64rem] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_32px_90px_rgba(15,23,42,0.28)] outline-none sm:rounded-[36px]"
      >
        <div className="relative shrink-0 overflow-hidden border-b border-slate-200 bg-[linear-gradient(125deg,#eff6ff_0%,#ffffff_48%,#f0fdfa_100%)] px-5 py-5 sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full border-[32px] border-blue-100/70" />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-blue-700">
                Support routing
              </p>
              <h2
                id="issue-report-title"
                className="mt-2 font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
              >
                Report a project issue
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Choose the affected project, describe what happened, and review
                who will receive the report.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close issue report"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-xl text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              ×
            </button>
          </div>
        </div>

        <div className="scrollbar-hidden grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[minmax(0,0.92fr)_minmax(360px,1.08fr)] lg:overflow-hidden">
          <div className="scrollbar-hidden border-b border-slate-200 bg-slate-50/80 p-5 sm:p-7 lg:overflow-y-auto lg:border-b-0 lg:border-r">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Step 01
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
                  Report context
                </h3>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                {portals.length} projects
              </span>
            </div>

            <label
              htmlFor="issue-project"
              className="block text-sm font-semibold text-slate-800"
            >
              Project
            </label>
            <div className="relative mt-2">
              <select
                id="issue-project"
                form="issue-report-form"
                value={selectedProjectId}
                onChange={(event) => selectProject(event.target.value)}
                className={`w-full appearance-none rounded-2xl border px-4 py-4 pr-12 text-sm font-semibold outline-none transition ${STYLES.input}`}
              >
                <option value="">Select a project</option>
                {portals.map((portal) => (
                  <option key={portal.id} value={portal.id}>
                    {portal.title} - {portal.eyebrow}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                v
              </span>
            </div>
            {errors.projectId ? (
              <p className="mt-2 text-sm font-medium text-red-600">
                {errors.projectId}
              </p>
            ) : null}

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">
                Reporter details
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="space-y-4">
              <ReporterField
                id="reporter-email"
                form="issue-report-form"
                type="email"
                label="Email"
                value={reporter.email}
                error={errors.email}
                placeholder="you@example.com — used for ticket tracking"
                onChange={(value) => updateReporter("email", value)}
              />
              <div className="flex items-start gap-2 rounded-lg border border-blue-100 bg-blue-50/70 px-3 py-2 text-xs leading-5 text-blue-700">
                <span className="mt-0.5 shrink-0">ℹ️</span>
                <span>
                  Enter your real email — we'll send a ticket tracking link and
                  password setup here. Without it you won't be able to follow up
                  on your report.
                </span>
              </div>
            </div>
          </div>

          <div
            className={
              confirmedReport
                ? "scrollbar-hidden p-5 sm:p-7 lg:overflow-y-auto lg:p-8"
                : "p-5 sm:p-6 lg:overflow-hidden lg:p-5 xl:p-6"
            }
          >
            {submissionState === "submitting" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-blue-100 bg-blue-500 text-white">
                  <svg className="h-7 w-7 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-blue-700">
                  Submitting
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">
                  Creating your ticket...
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  Sending report to the support team.
                </p>
              </div>
            ) : submissionState === "error" ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-8 border-red-100 bg-red-500 text-2xl font-bold text-white">
                  !
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.22em] text-red-700">
                  Submission failed
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-slate-950">
                  Could not create ticket
                </h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
                  {submissionError}
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${STYLES.primaryButton}`}
                  >
                    Retry
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`rounded-full border px-6 py-3 text-sm font-semibold transition ${STYLES.ghostButton}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : confirmedReport ? (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-8 border-emerald-100 bg-emerald-500 text-3xl font-bold text-white shadow-[0_16px_36px_rgba(16,185,129,0.22)]">
                  ✓
                </div>
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.22em] text-emerald-700">
                  Ticket created
                </p>
                <h3 className="mt-1.5 font-display text-4xl font-semibold text-slate-950">
                  Report submitted successfully
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">
                  Your report for <strong>{selectedProject?.title}</strong> has
                  been created as ticket{" "}
                  <strong className="text-blue-700">{submittedTicketId}</strong>.
                </p>

                <div className="mt-5 flex w-full max-w-xl flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-left text-base leading-6 text-slate-600">
                  <span className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-slate-500">
                    {confirmedReport.priority}
                  </span>
                  <span className="truncate">"{confirmedReport.description}"</span>
                </div>

                {/* Password setup notice — only for new users */}
                {isNewUser && (
                <div className="mt-5 w-full max-w-xl rounded-xl border-2 border-amber-200 bg-amber-50/80 px-6 py-5 text-left">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-xl">🔑</span>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-amber-900">
                        Set up your account to track this ticket
                      </h4>
                      <p className="mt-2 text-base leading-7 text-amber-800">
                        Check <strong>{reporter.email}</strong> — we sent a link
                        to set up your password. Once set, you can log in to view
                        ticket status, chat with support, and submit follow-ups.
                      </p>
                      <p className="mt-2.5 text-sm leading-5 text-amber-700">
                        ⏳ Link expires in 30 min. Already have an account? Just
                        log in — no setup needed.
                      </p>
                    </div>
                  </div>
                </div>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProjectId("");
                      setReporter({
                        email: "",
                      });
                      setPriority("");
                      setDescription("");
                      setConfirmedReport(null);
                      setSubmissionState("idle");
                      setSubmissionError("");
                      setSubmittedTicketId("");
                      setIsNewUser(false);
                    }}
                    className={`rounded-full border px-7 py-3.5 text-base font-semibold transition ${STYLES.primaryButton}`}
                  >
                    Report another issue
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className={`rounded-full border px-7 py-3.5 text-base font-semibold transition ${STYLES.ghostButton}`}
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form id="issue-report-form" onSubmit={handleSubmit}>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
                  Step 02
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-slate-950">
                  Issue details
                </h3>

                <div
                  className={`mt-3 rounded-2xl border p-3 transition ${
                    selectedProject
                      ? "border-blue-200 bg-blue-50/70"
                      : "border-dashed border-slate-300 bg-slate-50"
                  }`}
                >
                  {selectedProject ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                            Selected project
                          </p>
                          <p className="mt-1 font-display text-base font-semibold text-slate-950">
                            {selectedProject.title}
                          </p>
                        </div>
                        <span className="rounded-full border border-blue-200 bg-white/80 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-blue-700">
                          Recipients
                        </span>
                      </div>
                      <div className="mt-2 grid gap-2 border-t border-blue-200/70 pt-2 sm:grid-cols-2">
                        <Recipient
                          role="Owner"
                          name={selectedProject.owner}
                          email={selectedProject.contact}
                        />
                        <Recipient
                          role="Sub-owner"
                          name={selectedProject.subOwner}
                          email={selectedProject.subContact}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm leading-6 text-slate-500">
                      Select a project from the dropdown to unlock the issue
                      description and review its recipients.
                    </p>
                  )}
                </div>

                <label className="mt-4 block text-sm font-semibold text-slate-800">
                  Priority
                </label>

                <div className="mt-2 flex gap-2">
                  {[
                    {
                      value: "low",
                      label: "Low",
                      color: "bg-green-500",
                      selected: "ring-2 ring-green-300 border-green-500",
                    },
                    {
                      value: "medium",
                      label: "Medium",
                      color: "bg-yellow-500",
                      selected: "ring-2 ring-yellow-300 border-yellow-500",
                    },
                    {
                      value: "high",
                      label: "High",
                      color: "bg-orange-500",
                      selected: "ring-2 ring-orange-300 border-orange-500",
                    },
                    {
                      value: "critical",
                      label: "Critical",
                      color: "bg-red-500",
                      selected: "ring-2 ring-red-300 border-red-500",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      disabled={!selectedProject}
                      onClick={() => setPriority(item.value)}
                      className={`
        flex-1 rounded-xl border bg-white px-3 py-2
        transition-all hover:shadow-sm
        disabled:cursor-not-allowed disabled:opacity-50
        ${
          priority === item.value
            ? item.selected
            : "border-slate-200 hover:border-slate-300"
        }
      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <label
                  htmlFor="issue-description"
                  className="mt-4 block text-sm font-semibold text-slate-800"
                >
                  What went wrong?
                </label>
                <textarea
                  id="issue-description"
                  value={description}
                  disabled={!selectedProject}
                  maxLength={1200}
                  onChange={(event) => {
                    setDescription(event.target.value);
                    setErrors({});
                  }}
                  placeholder="Include what you were doing, what you expected, and what happened instead."
                  className={`mt-2 w-full resize-none h-28 rounded-2xl border px-4 py-3 text-sm leading-6 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${STYLES.input}`}
                />
                <div className="mt-1 flex items-start justify-between gap-4">
                  <p className="text-xs leading-5 text-slate-500">
                    Do not include passwords or other sensitive information.
                  </p>
                  <span className="shrink-0 font-mono text-[10px] text-slate-400">
                    {description.length}/1200
                  </span>
                </div>
                {errors.description ? (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {errors.description}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className={`mt-4 inline-flex w-full items-center justify-center gap-3 rounded-full border px-6 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none ${STYLES.primaryButton}`}
                >
                  Confirm report
                  <span aria-hidden="true">→</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Recipient({ role, name, email }) {
  return (
    <div className="min-w-0 rounded-xl border border-white/90 bg-white/80 px-3 py-3 shadow-sm">
      <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {role}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
        {name || "Not assigned"}
      </p>
      <p className="mt-0.5 truncate text-xs text-slate-500">
        {email || "No email configured"}
      </p>
    </div>
  );
}

function ReporterField({
  id,
  form,
  label,
  value,
  error,
  placeholder,
  onChange,
  type = "text",
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-800"
      >
        {label}
      </label>
      <input
        id={id}
        form={form}
        type={type}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`mt-2 w-full rounded-2xl border px-4 py-3.5 text-sm outline-none transition ${STYLES.input}`}
      />
      {error ? (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function AdminLogin({ onLogin, error }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  return (
    <div className={`rounded-[40px] border p-10 sm:p-14 ${STYLES.panel}`}>
      <p
        className={`font-mono text-[12px] uppercase tracking-[0.24em] ${STYLES.overline}`}
      >
        Admin Access
      </p>
      <h2
        className={`mt-5 font-display text-4xl font-semibold ${STYLES.title}`}
      >
        Admin Sign In
      </h2>
      <form
        className="mt-10 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          onLogin(credentials);
        }}
      >
        <div>
          <label
            className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${STYLES.overline}`}
          >
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, username: e.target.value }))
            }
            className={`w-full rounded-2xl border px-6 py-4 text-lg outline-none transition ${STYLES.input}`}
          />
        </div>
        <div>
          <label
            className={`mb-3 block font-mono text-[12px] uppercase tracking-[0.2em] ${STYLES.overline}`}
          >
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((c) => ({ ...c, password: e.target.value }))
            }
            className={`w-full rounded-2xl border px-6 py-4 text-lg outline-none transition ${STYLES.input}`}
          />
        </div>
        {error && <p className="text-base text-red-500 font-medium">{error}</p>}
        <button
          type="submit"
          className={`inline-flex rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] transition ${STYLES.primaryButton}`}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}

function AdminEditor({
  portals,
  editingId,
  setEditingId,
  formState,
  setFormState,
  onSubmit,
  onDelete,
  onLogout,
  saveError,
}) {
  const isEditing = Boolean(editingId);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <section className={`rounded-[40px] border p-10 sm:p-14 ${STYLES.panel}`}>
        {saveError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {saveError}
          </div>
        )}
        <div className="flex items-start justify-between gap-6">
          <h2 className={`font-display text-4xl font-semibold ${STYLES.title}`}>
            {isEditing ? "Update Portal" : "Add Portal"}
          </h2>
          <button
            onClick={onLogout}
            className={`rounded-full border px-6 py-3 font-mono text-[12px] uppercase tracking-[0.2em] ${STYLES.ghostButton}`}
          >
            Logout
          </button>
        </div>
        <form className="mt-10 space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              value={formState.title}
              onChange={(e) =>
                setFormState((c) => ({ ...c, title: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Title"
            />
            <input
              type="text"
              value={formState.eyebrow}
              onChange={(e) =>
                setFormState((c) => ({ ...c, eyebrow: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Category"
            />
          </div>
          <textarea
            value={formState.summary}
            onChange={(e) =>
              setFormState((c) => ({ ...c, summary: e.target.value }))
            }
            className={`w-full rounded-2xl border px-5 py-4 min-h-[120px] ${STYLES.input}`}
            placeholder="Description"
          />
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              value={formState.href}
              onChange={(e) =>
                setFormState((c) => ({ ...c, href: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="URL Path"
            />
            <input
              type="text"
              value={formState.action}
              onChange={(e) =>
                setFormState((c) => ({ ...c, action: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Action Text"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              value={formState.owner}
              onChange={(e) =>
                setFormState((c) => ({ ...c, owner: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Owner Name (e.g. John Doe)"
            />
            <input
              type="text"
              value={formState.contact}
              onChange={(e) =>
                setFormState((c) => ({ ...c, contact: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Owner Contact (e.g. Slack @john)"
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <input
              type="text"
              value={formState.subOwner}
              onChange={(e) =>
                setFormState((c) => ({ ...c, subOwner: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Sub Owner Name (e.g. Jane Smith)"
            />
            <input
              type="text"
              value={formState.subContact}
              onChange={(e) =>
                setFormState((c) => ({ ...c, subContact: e.target.value }))
              }
              className={`w-full rounded-2xl border px-5 py-4 ${STYLES.input}`}
              placeholder="Sub Contact (e.g. ext 456)"
            />
          </div>
          <button
            type="submit"
            className={`rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] ${STYLES.primaryButton}`}
          >
            {isEditing ? "Save" : "Add"}
          </button>
        </form>
      </section>
      <section className={`rounded-[40px] border p-10 sm:p-14 ${STYLES.panel}`}>
        <h2 className={`font-display text-4xl font-semibold ${STYLES.title}`}>
          Manage Entries
        </h2>
        <div className="mt-10 space-y-6">
          {portals.map((p) => (
            <div
              key={p.id}
              className={`rounded-[32px] border p-7 ${STYLES.summaryCard} flex justify-between items-center`}
            >
              <div>
                <h3 className="font-display text-xl font-bold">{p.title}</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(p.id);
                    setFormState({ ...p });
                  }}
                  className="px-4 py-2 border rounded-full text-xs font-bold uppercase"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(p.id)}
                  className={`px-4 py-2 border rounded-full text-xs font-bold uppercase ${STYLES.dangerButton}`}
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Main App
export default function App() {
  const [route, setRoute] = useState(getInitialRoute);
  const [portals, setPortals] = useState(() =>
    (import.meta.env.DEV ? SAMPLE_PORTAL_LINKS : DEFAULT_PORTAL_LINKS).map(normalizePortal),
  );
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );
  const [authHeader, setAuthHeader] = useState(() =>
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(ADMIN_AUTH_KEY) || ""
      : "",
  );
  const [loginError, setLoginError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formState, setFormState] = useState(EMPTY_FORM);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const persist = async (next) => {
    setPortals(next);
    try {
      await savePortals(next, authHeader);
      setSaveError("");
    } catch (err) {
      console.error(err);
      setSaveError("Save failed. Please sign in again.");
    }
  };

  const summary = useMemo(
    () => ({
      total: portals.length,
      online: portals.filter((p) => p.status === "online").length,
      maintenance: portals.filter((p) => p.status === "maintenance").length,
    }),
    [portals],
  );
  const portalGridClass = useMemo(
    () => getPortalGridClass(portals.length),
    [portals.length],
  );

  useEffect(() => {
    fetchPortals()
      .then(setPortals)
      .catch((err) => console.error("failed to load portals", err));
  }, []);

  useEffect(() => {
    const handlePopState = () =>
      setRoute(window.location.pathname === "/admin" ? "admin" : "home");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (next) => {
    window.history.pushState({}, "", next === "admin" ? "/admin" : "/");
    setRoute(next);
  };
  const closeIssueModal = useCallback(() => setIsIssueModalOpen(false), []);

  return (
    <main
      className={`scrollbar-hidden relative h-screen overflow-y-auto transition-colors duration-300 ${STYLES.shell}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-grid bg-[size:60px_60px] ${STYLES.grid}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[600px] ${STYLES.topGlow}`}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1680px] flex-col px-4 py-4 sm:px-8 sm:py-6 lg:px-10 lg:py-8">
        <header
          className={`rounded-[32px] border px-4 py-3.5 backdrop-blur sm:px-5 sm:py-4 ${STYLES.header}`}
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <LogoMark compact={route === "home"} />
              <div className="max-w-4xl">
                <p
                  className={`font-mono text-[9px] uppercase tracking-[0.2em] ${STYLES.overline}`}
                >
                  Internal Navigation Gateway
                </p>
                <h1
                  className={`mt-1 font-display text-[2rem] font-bold tracking-tight sm:text-[2.55rem] ${STYLES.title}`}
                >
                  {BRAND.projectName}
                </h1>
                <p
                  className={`mt-1 max-w-3xl text-[14px] leading-5 sm:text-[15px] sm:leading-6 ${STYLES.body}`}
                >
                  {BRAND.description}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {route === "home" && (
                <>
                  <SummaryChip
                    label="Total"
                    value={summary.total}
                    tone="total"
                  />
                  <SummaryChip
                    label="Online"
                    value={summary.online}
                    tone="online"
                  />
                  <div className="flex items-center gap-2">
                    <SummaryChip
                      label="Maintenance"
                      value={summary.maintenance}
                      tone="maintenance"
                    />
                    <button
                      type="button"
                      onClick={() => setIsIssueModalOpen(true)}
                      className={`inline-flex min-h-[50px] items-center gap-3 rounded-full border px-5 py-3 text-left transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${STYLES.primaryButton}`}
                    >
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-lg">
                        !
                      </span>
                      <span>
                        <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-blue-100">
                          Need help?
                        </span>
                        <span className="block text-sm font-semibold">
                          Report an issue
                        </span>
                      </span>
                    </button>
                  </div>
                </>
              )}
              {route === "admin" && (
                <button
                  onClick={() => navigate("home")}
                  className={`rounded-full border px-6 py-3 font-mono text-[12px] uppercase tracking-[0.22em] ${STYLES.ghostButton}`}
                >
                  Exit Admin
                </button>
              )}
            </div>
          </div>
        </header>

        {route === "admin" ? (
          <section className="flex-1 min-h-0 overflow-y-auto py-16">
            {isAdminAuthed ? (
              <AdminEditor
                portals={portals}
                editingId={editingId}
                setEditingId={setEditingId}
                formState={formState}
                setFormState={setFormState}
                saveError={saveError}
                onSubmit={(e) => {
                  e.preventDefault();
                  const normalized = normalizePortal(
                    {
                      ...formState,
                      id: editingId || createSlug(formState.title),
                    },
                    portals.length,
                  );
                  const next = editingId
                    ? portals.map((p) =>
                        p.id === editingId ? normalized : p,
                      )
                    : [...portals, normalized];
                  persist(next);
                  setEditingId("");
                  setFormState(EMPTY_FORM);
                }}
                onDelete={(id) =>
                  persist(portals.filter((p) => p.id !== id))
                }
                onLogout={() => {
                  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
                  window.sessionStorage.removeItem(ADMIN_AUTH_KEY);
                  setAuthHeader("");
                  setIsAdminAuthed(false);
                  navigate("home");
                }}
              />
            ) : (
              <div className="mx-auto max-w-3xl">
                <AdminLogin
                  onLogin={(cred) => {
                    if (
                      cred.username === ADMIN_CONFIG.username &&
                      cred.password === ADMIN_CONFIG.password
                    ) {
                      const header =
                        "Basic " +
                        btoa(`${cred.username}:${cred.password}`);
                      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
                      window.sessionStorage.setItem(ADMIN_AUTH_KEY, header);
                      setAuthHeader(header);
                      setIsAdminAuthed(true);
                      setLoginError("");
                    } else setLoginError("Invalid credentials.");
                  }}
                  error={loginError}
                />
              </div>
            )}
          </section>
        ) : (
          <>
            <section className="py-4 sm:py-5">
              <div className="mb-4 flex flex-col gap-1 sm:mb-5">
                <p
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${STYLES.overline}`}
                >
                  Available Destinations
                </p>
                <h2
                  className={`font-display text-2xl font-semibold tracking-tight sm:text-3xl ${STYLES.title}`}
                >
                  Internal Access Directory
                </h2>
              </div>
              <div className={`grid auto-rows-auto gap-4 ${portalGridClass}`}>
                {portals.map((portal, index) => (
                  <PortalCard key={portal.id} portal={portal} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      {route === "home" && isIssueModalOpen ? (
        <IssueReportModal portals={portals} onClose={closeIssueModal} />
      ) : null}
    </main>
  );
}
