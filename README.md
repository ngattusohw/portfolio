# Nick Gattuso's portfolio

React/Vite frontend and Express API, hosted on Render with PostgreSQL on Neon.

## Run locally

Use Node.js 22 or newer, `npm ci`, and a private root `.env` containing `DATABASE_URL`.
Run `npm run dev` and visit http://localhost:5001. The public site works without admin configuration.

`npm run check`, `npm test`, and `npm run build` validate types, isolated auth/editor tests, and the production build. Tests use in-memory data and never connect to Neon.

## Write a blog post

Open https://nickgattuso.com/admin and sign in with the owner password. Choose **New post**, write Markdown, and **Save draft**. Drafts and their media are visible only to your signed-in owner session. Use **Preview Markdown** to check formatting, then choose **Published** and save when ready. You can edit, unpublish, or delete posts from the same editor.

Blank thumbnails are supported. Tags are comma-separated. URL slugs use lowercase letters, numbers, and hyphens. The first publication date is preserved when a post is edited or republished.

## Owner authentication

Render's service-level environment settings are the source of truth. Keep secrets out of Git:

- `DATABASE_URL`: existing Neon connection string.
- `APP_ORIGIN`: `https://nickgattuso.com` in production, or the exact local origin during development.
- `SESSION_SECRET`: a fresh, cryptographically random value containing at least 32 bytes of entropy (43+ base64url characters).
- `ADMIN_SETUP_TOKEN_SHA256`: SHA-256 digest of a separate random 32-byte setup token.
- `ADMIN_SETUP_EXPIRES_AT`: an ISO timestamp limiting the setup link's lifetime.

A private, expiring `/admin#setup=...` link lets the owner choose the password personally. Its token is removed from browser history immediately, is never sent in a query string, and is accepted only until the singleton owner credential is initialized. The server stores a salted scrypt hash in `portfolio_admin`; it never stores the password. This additive table is created automatically without changing existing posts or legacy users.

Sessions use the existing PostgreSQL `sessions` table and expire after seven days. Production cookies are host-only, Secure, HttpOnly, and SameSite=Strict. Admin writes require the configured origin, JSON, and the custom request header. No public registration or email delivery is configured.

The setup link stops working after the password is saved. To recover a lost password, a trusted database administrator must remove the singleton row from `portfolio_admin`, rotate `SESSION_SECRET` to revoke existing sessions, and generate a new setup token/digest/expiry. Do not remove legacy users, existing posts, or the database. Only perform that recovery when the owner requests it.

## Deploy

The Render service uses branch `codex/render-portfolio`, build command `npm ci --include=dev && npm run build`, start command `npm start`, and health path `/api/health`. It uses the free web instance and keeps the database on Neon.

This service was created from a public repository URL, so Render requires a manual deployment after pushing code. Check for an in-progress deployment before triggering one. Domain aliases redirect to https://nickgattuso.com, preserving the path and query string.
