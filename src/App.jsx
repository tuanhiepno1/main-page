import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_CONFIG,
  DEFAULT_PORTAL_LINKS,
  PORTAL_STATUS_OPTIONS,
  PORTAL_TONE_OPTIONS,
} from "./data/portalLinks";

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
  };
}

function loadPortals() {
  if (typeof window === "undefined")
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  try {
    const stored = window.localStorage.getItem(PORTALS_STORAGE_KEY);
    return stored
      ? JSON.parse(stored).map(normalizePortal)
      : DEFAULT_PORTAL_LINKS.map(normalizePortal);
  } catch {
    return DEFAULT_PORTAL_LINKS.map(normalizePortal);
  }
}

// Components
function LogoMark() {
  return (
    <div
      className={`relative flex h-40 w-40 shrink-0 items-center justify-center overflow-hidden rounded-[32px] border sm:h-44 sm:w-44 ${STYLES.logoWrap}`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.08),transparent_58%)]" />
      <div
        className={`absolute inset-[8px] rounded-[24px] border ${STYLES.logoInset}`}
      />
      <img
        src={BRAND.logoSrc}
        alt={BRAND.logoAlt}
        className="relative z-10 h-32 w-32 object-contain sm:h-36 sm:w-36"
      />
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div
      className={`rounded-[32px] border px-8 py-7 backdrop-blur transition-colors duration-300 ${STYLES.summaryCard}`}
    >
      <p
        className={`font-mono text-[12px] uppercase tracking-[0.22em] ${STYLES.summaryLabel}`}
      >
        {label}
      </p>
      <p
        className={`mt-3 font-display text-4xl font-semibold ${STYLES.summaryValue}`}
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

  return (
    <a
      href={isOnline ? portal.href : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative overflow-hidden rounded-[40px] border p-8 backdrop-blur transition duration-300 sm:p-10 ${
        isOnline
          ? "cursor-pointer hover:-translate-y-2 hover:shadow-[0_30px_60px_rgba(15,23,42,0.15)]"
          : "cursor-not-allowed opacity-90 pointer-events-none"
      } ${STYLES.card} ${tone.border}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tone.accent}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px ${STYLES.cardTopLine}`}
      />
      <div
        className={`pointer-events-none absolute left-10 top-0 h-2 w-32 rounded-b-full ${STYLES.cardCap}`}
      />

      <div className="relative flex h-full flex-col gap-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p
              className={`font-mono text-[12px] uppercase tracking-[0.24em] ${STYLES.overline}`}
            >
              {portal.eyebrow}
            </p>
            <h2
              className={`mt-4 font-display text-4xl font-semibold tracking-tight ${STYLES.title}`}
            >
              {portal.title}
            </h2>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div
              className={`rounded-full border px-4 py-2 font-mono text-[12px] uppercase tracking-[0.2em] ${STYLES.cardBadge}`}
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
          className={`max-w-2xl text-base leading-8 sm:text-lg sm:leading-9 ${STYLES.cardText}`}
        >
          {portal.summary}
        </p>
        <div
          className={`mt-auto flex items-center justify-between gap-6 border-t pt-7 ${STYLES.cardBorder}`}
        >
          <span
            className={`font-mono text-[12px] uppercase tracking-[0.22em] ${STYLES.cardMeta}`}
          >
            {isOnline ? "Available" : "Maintenance"}
          </span>
          {isOnline ? (
            <span
              className={`inline-flex items-center gap-4 text-base font-semibold transition duration-300 ${STYLES.actionBase} ${tone.action}`}
            >
              <span>{portal.action}</span>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border text-lg leading-none">
                {"->"}
              </span>
            </span>
          ) : (
            <span
              className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 text-base font-semibold ${STYLES.disabledAction}`}
            >
              Paused
            </span>
          )}
        </div>
      </div>
    </a>
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
}) {
  const isEditing = Boolean(editingId);
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <section className={`rounded-[40px] border p-10 sm:p-14 ${STYLES.panel}`}>
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
  const [portals, setPortals] = useState(loadPortals);
  const [isAdminAuthed, setIsAdminAuthed] = useState(
    () =>
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(ADMIN_SESSION_KEY) === "true",
  );
  const [loginError, setLoginError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [formState, setFormState] = useState(EMPTY_FORM);

  const summary = useMemo(
    () => ({
      total: portals.length,
      online: portals.filter((p) => p.status === "online").length,
      maintenance: portals.filter((p) => p.status === "maintenance").length,
    }),
    [portals],
  );

  useEffect(() => {
    window.localStorage.setItem(PORTALS_STORAGE_KEY, JSON.stringify(portals));
  }, [portals]);

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

  return (
    <main
      className={`relative min-h-screen overflow-x-hidden transition-colors duration-300 pb-20 ${STYLES.shell}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 bg-grid bg-[size:60px_60px] ${STYLES.grid}`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-[600px] ${STYLES.topGlow}`}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-6 py-10 sm:px-12 lg:px-16">
        <header
          className={`rounded-[48px] border px-8 py-10 backdrop-blur sm:px-12 ${STYLES.header}`}
        >
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-10">
              <LogoMark />
              <div className="max-w-3xl">
                <p
                  className={`font-mono text-[12px] uppercase tracking-[0.24em] ${STYLES.overline}`}
                >
                  Internal Navigation Gateway
                </p>
                <h1
                  className={`mt-5 font-display text-5xl font-bold tracking-tight sm:text-6xl ${STYLES.title}`}
                >
                  {BRAND.projectName}
                </h1>
                <p
                  className={`mt-6 text-lg leading-9 sm:text-xl ${STYLES.body}`}
                >
                  {BRAND.description}
                </p>
              </div>
            </div>
            {route === "admin" && (
              <button
                onClick={() => navigate("home")}
                className={`rounded-full border px-8 py-4 font-mono text-[12px] uppercase tracking-[0.22em] ${STYLES.ghostButton}`}
              >
                Exit Admin
              </button>
            )}
          </div>
        </header>

        {route === "admin" ? (
          <section className="flex-1 py-16">
            {isAdminAuthed ? (
              <AdminEditor
                portals={portals}
                editingId={editingId}
                setEditingId={setEditingId}
                formState={formState}
                setFormState={setFormState}
                onSubmit={(e) => {
                  e.preventDefault();
                  const normalized = normalizePortal(
                    {
                      ...formState,
                      id: editingId || createSlug(formState.title),
                    },
                    portals.length,
                  );
                  setPortals((curr) =>
                    editingId
                      ? curr.map((p) => (p.id === editingId ? normalized : p))
                      : [...curr, normalized],
                  );
                  setEditingId("");
                  setFormState(EMPTY_FORM);
                }}
                onDelete={(id) =>
                  setPortals((c) => c.filter((p) => p.id !== id))
                }
                onLogout={() => {
                  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
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
                      window.sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
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
            <section className="pt-16 grid gap-8 sm:grid-cols-3">
              <SummaryCard label="Total Portals" value={summary.total} />
              <SummaryCard label="Online" value={summary.online} />
              <SummaryCard label="Maintenance" value={summary.maintenance} />
            </section>
            <section className="flex-1 py-16">
              <div className="mb-10">
                <p
                  className={`font-mono text-[12px] uppercase tracking-[0.24em] ${STYLES.overline}`}
                >
                  Available Destinations
                </p>
                <h2
                  className={`mt-4 font-display text-4xl font-semibold tracking-tight ${STYLES.title}`}
                >
                  Internal Access Directory
                </h2>
              </div>
              <div className="grid gap-10 md:grid-cols-2">
                {portals.map((portal, index) => (
                  <PortalCard key={portal.id} portal={portal} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
