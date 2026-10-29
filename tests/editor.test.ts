import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, apiRequest } from "../client/src/lib/queryClient.ts";
import { blogPostSchema } from "../shared/schema.ts";

const post = {
  title: "A private test post",
  slug: "a-private-test-post",
  summary: "A test summary for the blog listing.",
  content: "A Markdown post body that is long enough to satisfy the minimum content length.",
};
const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

test("posts default to drafts and allow clearing an optional thumbnail", () => {
  assert.equal(blogPostSchema.parse(post).status, "draft");
  assert.equal(blogPostSchema.parse({ ...post, thumbnail_url: null }).thumbnail_url, null);
  assert.deepEqual(blogPostSchema.partial().parse({ thumbnail_url: null }), { thumbnail_url: null });
  assert.equal(blogPostSchema.parse({ ...post, thumbnail_url: "https://example.com/image.jpg" }).thumbnail_url, "https://example.com/image.jpg");
});

test("post validation rejects unsupported visibility, invalid images, and unsafe slugs", () => {
  assert.equal(blogPostSchema.safeParse({ ...post, status: "public" }).success, false);
  assert.equal(blogPostSchema.safeParse({ ...post, thumbnail_url: "not-a-url" }).success, false);
  for (const slug of ["With-Capitals", "has/slash", "two--hyphens", "-leading", "trailing-", "space slug"]) {
    assert.equal(blogPostSchema.safeParse({ ...post, slug }).success, false, slug);
  }
  assert.equal(blogPostSchema.safeParse({ ...post, slug: "setting-up-your-mac" }).success, true);
});

test("API writes include JSON, session credentials, and the required CSRF header", async t => {
  let sent: RequestInit | undefined;
  const originalHeaders = new Headers({ "X-Example": "keep", "X-Portfolio-CSRF": "0" });
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    sent = options;
    return jsonResponse({ success: true });
  });
  const result = await apiRequest<{ success: boolean }>("/api/blog", {
    method: "post", body: JSON.stringify(post), headers: originalHeaders, credentials: "omit", redirect: "follow",
  });
  assert.deepEqual(result, { success: true });
  assert.equal(sent?.method, "POST");
  assert.equal(sent?.credentials, "include");
  assert.equal(sent?.redirect, "error");
  assert.equal(new Headers(sent?.headers).get("Content-Type"), "application/json");
  assert.equal(new Headers(sent?.headers).get("X-Portfolio-CSRF"), "1");
  assert.equal(new Headers(sent?.headers).get("X-Example"), "keep");
  assert.equal(originalHeaders.get("X-Portfolio-CSRF"), "0");
});

test("bodyless DELETE requests still satisfy the JSON CSRF guard", async t => {
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert.equal(options.body, "{}");
    assert.equal(new Headers(options.headers).get("Content-Type"), "application/json");
    assert.equal(new Headers(options.headers).get("X-Portfolio-CSRF"), "1");
    return new Response(null, { status: 204 });
  });
  assert.equal(await apiRequest("/api/blog/99", { method: "DELETE" }), undefined);
});

test("API requests cannot forward credentials or CSRF headers to an external URL", async t => {
  const fetchMock = t.mock.method(globalThis, "fetch", async () => jsonResponse({}));
  for (const url of ["https://example.com/api/blog", "//example.com/api/blog", "/api\\example.com/blog", "/admin"]) {
    await assert.rejects(apiRequest(url), /local \/api\//);
  }
  assert.equal(fetchMock.mock.callCount(), 0);
});

test("API reads parse JSON without adding a write header", async t => {
  t.mock.method(globalThis, "fetch", async (_url: unknown, options: RequestInit) => {
    assert.equal(new Headers(options.headers).has("X-Portfolio-CSRF"), false);
    assert.equal(options.body, undefined);
    return jsonResponse({ posts: [] });
  });
  assert.deepEqual(await apiRequest("/api/blog"), { posts: [] });
});

test("API failures expose a useful message and status instead of treating errors as data", async t => {
  t.mock.method(globalThis, "fetch", async () => jsonResponse({ message: "Your session expired." }, 401));
  await assert.rejects(apiRequest("/api/blog"), (error: unknown) => (
    error instanceof ApiError && error.status === 401 && error.message === "Your session expired."
  ));
});

test("an unexpected HTML response cannot be mistaken for saved post data", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("<html>Unexpected page</html>", {
    headers: { "Content-Type": "text/html" },
  }));
  await assert.rejects(apiRequest("/api/blog"), /unexpected response/);
});
