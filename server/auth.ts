import { createHash, timingSafeEqual } from "node:crypto";
import session, { type Store } from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, Request, RequestHandler } from "express";
import { hashPassword, validPassword, verifyPassword } from "./passwords";

const SESSION_MS = 7 * 24 * 60 * 60 * 1000;
const OWNER = { id: "owner", username: "Nick", role: "owner" as const };

declare module "express-session" {
  interface SessionData {
    owner?: { expiresAt: number };
  }
}

export interface OwnerCredentials {
  getHash(): Promise<string | undefined>;
  initialize(hash: string): Promise<boolean>;
}

export interface AuthConfig {
  origin: string;
  sessionSecret: string;
  setupTokenHash?: string;
  setupExpiresAt?: number;
}

export function hasAdminSession(req: Request): boolean {
  return Number.isFinite(req.session?.owner?.expiresAt) &&
    req.session.owner!.expiresAt > Date.now();
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!hasAdminSession(req)) {
    res.status(401).json({ message: "Please sign in to the blog editor." });
    return;
  }
  next();
};

function secureEqual(actual: string, expected: string): boolean {
  const a = Buffer.from(actual);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Same-origin JSON + a custom header prevents browser CSRF without exposing tokens.
export function requireSameOrigin(origin: string): RequestHandler {
  return (req, res, next) => {
    if (req.get("origin") !== origin || req.get("x-portfolio-csrf") !== "1" || !req.is("application/json")) {
      res.status(403).json({ message: "Refresh the editor and try again from this website." });
      return;
    }
    next();
  };
}

function rateLimiter(): RequestHandler {
  const attempts = new Map<string, { count: number; reset: number }>();
  return (req, res, next) => {
    const now = Date.now();
    for (const [key, value] of Array.from(attempts)) if (value.reset <= now) attempts.delete(key);
    const key = req.ip ?? "unknown";
    if (!attempts.has(key) && attempts.size >= 1024) {
      res.status(429).json({ message: "Too many sign-in attempts. Please try again later." });
      return;
    }
    const entry = attempts.get(key) ?? { count: 0, reset: now + 15 * 60 * 1000 };
    entry.count++;
    attempts.set(key, entry);
    if (entry.count > 10) {
      res.setHeader("Retry-After", Math.ceil((entry.reset - now) / 1000));
      res.status(429).json({ message: "Too many sign-in attempts. Try again in 15 minutes." });
      return;
    }
    next();
  };
}

async function signIn(req: Request) {
  await new Promise<void>((resolve, reject) => req.session.regenerate(error => error ? reject(error) : resolve()));
  req.session.owner = { expiresAt: Date.now() + SESSION_MS };
  await new Promise<void>((resolve, reject) => req.session.save(error => error ? reject(error) : resolve()));
}

// Dependencies are explicit so auth can be tested without touching the live database.
export function installOwnerAuth(app: Express, config: AuthConfig, credentials: OwnerCredentials, store: Store) {
  const secure = new URL(config.origin).protocol === "https:";
  const cookieName = secure ? "__Host-portfolio.sid" : "portfolio.sid";
  app.set("trust proxy", 1);
  app.use("/api", session({
    name: cookieName,
    secret: config.sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure, sameSite: "strict", path: "/", maxAge: SESSION_MS },
  }));
  app.use("/api/auth", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
  });
  app.get("/api/login", (_req, res) => res.redirect("/admin"));
  app.get("/api/logout", (_req, res) => res.redirect("/admin"));
  app.get("/api/auth/user", isAuthenticated, (_req, res) => res.json(OWNER));

  app.get("/api/auth/status", async (_req, res, next) => {
    try {
      res.json({ configured: true, setupRequired: !(await credentials.getHash()) });
    } catch (error) { next(error); }
  });

  const originGuard = requireSameOrigin(config.origin);
  const limit = rateLimiter();
  let hashing = false;
  const passwordWork: RequestHandler = (_req, res, next) => {
    if (hashing) {
      res.status(429).json({ message: "Sign-in is busy. Please try again in a moment." });
      return;
    }
    hashing = true;
    next();
  };

  app.post("/api/auth/setup", originGuard, limit, passwordWork, async (req, res, next) => {
    try {
      const token = typeof req.body?.token === "string" ? req.body.token : "";
      const digest = createHash("sha256").update(token).digest("hex");
      if (!config.setupTokenHash || !config.setupExpiresAt || Date.now() >= config.setupExpiresAt ||
          !secureEqual(digest, config.setupTokenHash) || await credentials.getHash()) {
        res.status(403).json({ message: "This setup link is invalid, expired, or already used." });
        return;
      }
      if (!validPassword(req.body?.password)) {
        res.status(400).json({ message: "Choose a password between 15 and 128 characters." });
        return;
      }
      // Atomic insert protects against two concurrent setup requests.
      if (!await credentials.initialize(await hashPassword(req.body.password))) {
        res.status(409).json({ message: "The owner password has already been set. Please sign in." });
        return;
      }
      await signIn(req);
      res.status(201).json(OWNER);
    } catch (error) { next(error); } finally { hashing = false; }
  });

  app.post("/api/auth/login", originGuard, limit, passwordWork, async (req, res, next) => {
    try {
      const hash = await credentials.getHash();
      if (!hash || !validPassword(req.body?.password) || !await verifyPassword(req.body.password, hash)) {
        res.status(401).json({ message: "That password didn't match. Please try again." });
        return;
      }
      await signIn(req);
      res.json(OWNER);
    } catch (error) { next(error); } finally { hashing = false; }
  });

  app.post("/api/auth/logout", originGuard, (req, res, next) => {
    req.session.destroy(error => {
      if (error) { next(error); return; }
      res.clearCookie(cookieName, { httpOnly: true, secure, sameSite: "strict", path: "/" });
      res.json({ success: true });
    });
  });

  app.use("/api/blog", (req, res, next) => {
    // Blog responses depend on the owner session and must never enter shared caches.
    res.setHeader("Cache-Control", "private, no-store");
    if (["GET", "HEAD", "OPTIONS"].includes(req.method)) { next(); return; }
    isAuthenticated(req, res, error => {
      if (error) { next(error); return; }
      originGuard(req, res, next);
    });
  });
}

export async function setupAuth(app: Express) {
  const secret = process.env.SESSION_SECRET ?? "";
  const originValue = process.env.APP_ORIGIN ?? "";
  let origin: URL | undefined;
  try { origin = new URL(originValue); } catch { /* fail closed below */ }
  if (secret.length < 43 || !origin || origin.origin !== originValue ||
      (process.env.NODE_ENV === "production" && origin.protocol !== "https:")) {
    console.warn("Owner authentication is unavailable: configure APP_ORIGIN and a random SESSION_SECRET.");
    app.get("/api/auth/status", (_req, res) => res.json({ configured: false, setupRequired: false }));
    app.get("/api/auth/user", isAuthenticated);
    app.get(["/api/login", "/api/logout"], (_req, res) => res.redirect("/admin"));
    return;
  }

  const { pool } = await import("./db");
  // Additive, idempotent migration. Existing users, sessions and posts are preserved.
  await pool.query(`CREATE TABLE IF NOT EXISTS portfolio_admin (
    singleton boolean PRIMARY KEY DEFAULT true CHECK (singleton = true),
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  const credentials: OwnerCredentials = {
    async getHash() {
      const result = await pool.query("SELECT password_hash FROM portfolio_admin WHERE singleton = true");
      return result.rows[0]?.password_hash;
    },
    async initialize(hash) {
      const result = await pool.query("INSERT INTO portfolio_admin (singleton, password_hash) VALUES (true, $1) ON CONFLICT DO NOTHING RETURNING singleton", [hash]);
      return result.rows.length === 1;
    },
  };
  const PgStore = connectPg(session);
  installOwnerAuth(app, {
    origin: origin.origin,
    sessionSecret: secret,
    setupTokenHash: process.env.ADMIN_SETUP_TOKEN_SHA256,
    setupExpiresAt: Date.parse(process.env.ADMIN_SETUP_EXPIRES_AT ?? ""),
  }, credentials, new PgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: "sessions",
    ttl: SESSION_MS / 1000,
  }));
}
