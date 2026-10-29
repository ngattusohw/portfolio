import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";
import test from "node:test";
import express from "express";
import session from "express-session";
import { installOwnerAuth, hasAdminSession, setupAuth } from "../server/auth";
import { hashPassword, verifyPassword } from "../server/passwords";

// All state below is isolated in memory. These tests never connect to Neon.
process.env.DATABASE_URL = "postgresql://test:test@localhost/test";
const { registerRoutes } = await import("../server/routes");
const { storage } = await import("../server/storage");

test("owner setup, sessions, draft CRUD and cross-site protection", async () => {
  let passwordHash: string | undefined;
  const password = randomBytes(24).toString("base64url");
  const token = randomBytes(32).toString("base64url");
  const posts: any[] = [{ id: 1, slug: "original-post", title: "Original post", content: "untouched", status: "published" }];
  storage.getAllBlogPosts = async (_limit, _offset, _tag, includeDrafts) => posts.filter(post => includeDrafts || post.status === "published");
  storage.getBlogPostBySlug = async slug => posts.find(post => post.slug === slug);
  storage.getBlogPost = async id => posts.find(post => post.id === id);
  storage.getBlogMediaForPost = async () => [];
  storage.createBlogPost = async post => { const saved = { ...post, id: 2 }; posts.push(saved); return saved as any; };
  storage.updateBlogPost = async (id, values) => { const post = posts.find(post => post.id === id); if (post) Object.assign(post, values); return post; };
  storage.deleteBlogPost = async id => { const index = posts.findIndex(post => post.id === id); if (index < 0) return false; posts.splice(index, 1); return true; };
  const store = new session.MemoryStore();
  const app = express();
  app.use(express.json());
  const canonical = "https://portfolio.example";
  const server = await registerRoutes(app, async app => installOwnerAuth(app, {
    origin: canonical,
    sessionSecret: randomBytes(32).toString("base64url"),
    setupTokenHash: createHash("sha256").update(token).digest("hex"),
    setupExpiresAt: Date.now() + 60_000,
  }, {
    async getHash() { return passwordHash; },
    async initialize(hash) { if (passwordHash) return false; passwordHash = hash; return true; },
  }, store));
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${(server.address() as any).port}`;
  const headers = { "Content-Type": "application/json", Origin: canonical, "X-Portfolio-CSRF": "1", "X-Forwarded-Proto": "https" };
  let cookie = "";
  const request = (path: string, method = "GET", body?: unknown, overrides: Record<string, string> = {}) => fetch(origin + path, {
    method, headers: { ...headers, ...(cookie ? { Cookie: cookie } : {}), ...overrides }, body: method === "GET" ? undefined : JSON.stringify(body ?? {}), redirect: "manual",
  });
  try {
    assert.equal((await request("/api/auth/user")).status, 401);
    assert.equal((await request("/api/blog", "POST", {})).status, 401);
    assert.equal((await request("/api/auth/setup", "POST", { token: "invalid", password })).status, 403);
    assert.equal((await request("/api/auth/setup", "POST", { token, password: "short" })).status, 400);
    assert.equal((await request("/api/auth/setup", "POST", { token, password }, { Origin: "https://attacker.example" })).status, 403);
    assert.equal((await request("/api/auth/setup", "POST", { token, password }, { "X-Portfolio-CSRF": "" })).status, 403);
    const setup = await request("/api/auth/setup", "POST", { token, password });
    assert.equal(setup.status, 201);
    const setCookie = setup.headers.get("set-cookie")!;
    assert.match(setCookie, /__Host-portfolio.sid=/);
    assert.match(setCookie, /HttpOnly/);
    assert.match(setCookie, /Secure/);
    assert.match(setCookie, /SameSite=Strict/);
    assert.doesNotMatch(setCookie, /Domain=/i);
    cookie = setCookie.split(";")[0];
    assert.notEqual(passwordHash, password);
    assert.equal(await verifyPassword(password, passwordHash!), true);
    assert.deepEqual(await (await request("/api/auth/user")).json(), { id: "owner", username: "Nick", role: "owner" });
    assert.equal((await request("/api/auth/setup", "POST", { token, password })).status, 403, "Setup key cannot be reused");
    assert.deepEqual(await (await request("/api/auth/status")).json(), { configured: true, setupRequired: false });
    const draft = { title: "A private draft", slug: "a-private-draft", summary: "A draft for integration testing", content: "Private draft content that is long enough to pass the validation schema.", status: "draft", thumbnail_url: null, tags: ["testing"] };
    assert.equal((await request("/api/blog", "POST", draft, { Origin: "https://attacker.example" })).status, 403);
    assert.equal((await request("/api/blog", "POST", draft, { "X-Portfolio-CSRF": "" })).status, 403);
    assert.equal((await request("/api/blog", "POST", draft)).status, 201);
    assert.equal((await (await request("/api/blog")).json()).posts.length, 2);
    assert.match((await request("/api/blog")).headers.get("cache-control")!, /no-store/);
    const anonymous = await fetch(origin + "/api/blog?includeDrafts=true");
    assert.equal((await anonymous.json()).posts.length, 1);
    assert.equal((await fetch(origin + "/api/blog/a-private-draft")).status, 404);
    assert.equal((await fetch(origin + "/api/blog/2/media")).status, 404);
    assert.equal((await request("/api/blog/a-private-draft")).status, 200);
    assert.equal((await request("/api/blog/2", "PUT", { title: "An edited draft", thumbnail_url: null })).status, 200);
    assert.equal(posts[1].title, "An edited draft");
    assert.equal((await request("/api/blog/2", "PUT", { status: "published" })).status, 200);
    assert.equal((await fetch(origin + "/api/blog/a-private-draft")).status, 200);
    assert.equal((await request("/api/blog/2", "DELETE")).status, 200);
    assert.equal(posts.length, 1);
    assert.equal(posts[0].content, "untouched");
    const oldCookie = cookie;
    assert.equal((await request("/api/auth/logout", "POST")).status, 200);
    assert.equal((await request("/api/auth/user")).status, 401);
    assert.equal((await request("/api/blog", "POST", draft)).status, 401);
    assert.equal((await request("/api/auth/login", "POST", { password: "wrong password long enough" })).status, 401);
    const login = await request("/api/auth/login", "POST", { password });
    assert.equal(login.status, 200);
    cookie = login.headers.get("set-cookie")!.split(";")[0];
    assert.notEqual(cookie, oldCookie, "Login regenerates session identifier");
    assert.equal((await request("/api/auth/user")).status, 200);
    assert.equal(hasAdminSession({ session: { owner: { expiresAt: Date.now() - 1 } } } as any), false);
    assert.equal(hasAdminSession({ session: { owner: { expiresAt: "invalid" } } } as any), false);
    assert.equal(hasAdminSession({} as any), false);
    for (let i = 0; i < 12; i++) await request("/api/auth/login", "POST", { password: "incorrect long password" });
    assert.equal((await request("/api/auth/login", "POST", { password })).status, 429);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
    store.clear();
  }
});

test("password hashing uses independent salts and rejects malformed hashes", async () => {
  const password = "a randomly chosen test passphrase";
  const a = await hashPassword(password);
  const b = await hashPassword(password);
  assert.notEqual(a, b);
  assert.equal(await verifyPassword(password, a), true);
  assert.equal(await verifyPassword("another long passphrase", a), false);
  assert.equal(await verifyPassword(password, "replit-auth-placeholder"), false);
});

test("missing auth configuration fails closed while public routes remain available", async () => {
  const oldSecret = process.env.SESSION_SECRET;
  const oldOrigin = process.env.APP_ORIGIN;
  delete process.env.SESSION_SECRET;
  delete process.env.APP_ORIGIN;
  const app = express();
  app.use(express.json());
  const server = await registerRoutes(app, setupAuth);
  await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${(server.address() as any).port}`;
  try {
    assert.equal((await fetch(origin + "/api/health")).status, 200);
    assert.equal((await fetch(origin + "/api/auth/user")).status, 401);
    assert.deepEqual(await (await fetch(origin + "/api/auth/status")).json(), { configured: false, setupRequired: false });
    for (const [path, method] of [["/api/blog", "POST"], ["/api/blog/1", "PUT"], ["/api/blog/1", "DELETE"], ["/api/blog/1/media", "POST"], ["/api/blog/media/1", "PUT"], ["/api/blog/media/1", "DELETE"]]) {
      assert.equal((await fetch(origin + path, { method })).status, 401);
    }
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
    if (oldSecret === undefined) delete process.env.SESSION_SECRET; else process.env.SESSION_SECRET = oldSecret;
    if (oldOrigin === undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN = oldOrigin;
  }
});

test("expired setup links cannot initialize an owner password", async () => {
  const app = express();
  app.use(express.json());
  const store = new session.MemoryStore();
  let initialized = false;
  installOwnerAuth(app, { origin: "https://portfolio.example", sessionSecret: randomBytes(32).toString("base64url"), setupTokenHash: createHash("sha256").update("test").digest("hex"), setupExpiresAt: Date.now() - 1 }, {
    async getHash() { return undefined; },
    async initialize() { initialized = true; return true; },
  }, store);
  const server = app.listen(0, "127.0.0.1");
  await new Promise<void>(resolve => server.once("listening", resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as any).port}/api/auth/setup`, { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://portfolio.example", "X-Portfolio-CSRF": "1" }, body: JSON.stringify({ token: "test", password: "a valid long test passphrase" }) });
    assert.equal(response.status, 403);
    assert.equal(initialized, false);
  } finally {
    await new Promise<void>(resolve => server.close(() => resolve()));
    store.clear();
  }
});
