import express from "express";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || "/app/data";
const DATA_FILE = path.join(DATA_DIR, "portals.json");
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";

const DEFAULT_PORTALS = [];

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_PORTALS, null, 2));
  }
}

async function readPortals() {
  const raw = await fs.readFile(DATA_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

let writeQueue = Promise.resolve();
function writePortals(portals) {
  writeQueue = writeQueue.then(async () => {
    const tmp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(portals, null, 2));
    await fs.rename(tmp, DATA_FILE);
  });
  return writeQueue;
}

function safeEqual(a, b) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

function requireAuth(req, res, next) {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: "admin credentials not configured" });
  }
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="admin"');
    return res.status(401).json({ error: "auth required" });
  }
  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const idx = decoded.indexOf(":");
  const user = idx >= 0 ? decoded.slice(0, idx) : decoded;
  const pass = idx >= 0 ? decoded.slice(idx + 1) : "";
  if (!safeEqual(user, ADMIN_USERNAME) || !safeEqual(pass, ADMIN_PASSWORD)) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  next();
}

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/portals", async (_req, res) => {
  try {
    const portals = await readPortals();
    res.json(portals);
  } catch (err) {
    console.error("read error", err);
    res.status(500).json({ error: "read failed" });
  }
});

app.put("/api/portals", requireAuth, async (req, res) => {
  if (!Array.isArray(req.body)) {
    return res.status(400).json({ error: "body must be an array" });
  }
  try {
    await writePortals(req.body);
    res.json({ ok: true, count: req.body.length });
  } catch (err) {
    console.error("write error", err);
    res.status(500).json({ error: "write failed" });
  }
});

ensureDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(`api listening on ${PORT}, data=${DATA_FILE}`);
  });
});
