# Portfolio project context

Nick Gattuso’s portfolio uses React, TypeScript, Vite, Tailwind, and an Express API. Render hosts the app; Neon stores blog posts and private owner authentication data. Read README.md for local setup, authentication, and deployment details.

## Content and interface

- Preserve the owner-reviewed career history in `client/src/data/experiences.ts` and project details in `client/src/data/projects.ts`. Do not invent dates, metrics, technology stacks, or personal authorship.
- Nick is President of Collect Software and a founding team member and Head of Engineering at Somethings. Collect’s presidency start date is unconfirmed; list it as current until the owner supplies a date.
- Use `RomanHero.tsx` for the hero. SpaceX content and its unused rocket animation were intentionally removed.
- Recollect AI replaces Everybody Polls. Reuse the original project artwork already stored in `client/public/images/projects/`.
- `client/src/data/blog-posts-seed.ts` contains old, incomplete outlines only. Do not seed or publish them automatically. Actual post content and publication status are managed in the database-backed owner editor.
- Preserve mobile layouts, keyboard navigation, accessible controls, and private-draft handling.
- Prefer existing shadcn/ui components, Tailwind utilities, and the established section/component structure.

## Validation and deployment

- Use Node.js 22 or newer and `npm ci --include=dev`.
- Run `npm run check`, `npm test`, and `npm run build`. Tests use isolated in-memory data, not production Neon.
- Create feature branches and PRs targeting `main`; merge after the `build-and-test` check passes. Production deploys from `main` through Render’s connected GitHub provider after CI passes. Do not push directly to `main` or manually deploy feature branches.
- Keep secrets out of Git, PRs, logs, and chat. Do not copy production credentials into CI.
- Keep the free Render compute plan and existing Neon database unless the owner requests infrastructure changes.
