# Portfolio Project - Claude Context

## Owner
**Nick Gattuso III** - Founding Team, Head of Engineering at Somethings

## Current Role (IMPORTANT - Featured prominently)
**Head of Engineering at Somethings** (https://somethings.com)
- AI-enabled, HIPAA-compliant teen mental health platform
- Raised **$19.2M Series A** (Feb 2026) - led by Catalio Capital, with General Catalyst & Tusk Ventures
- **11,000+ teens** supported across 200+ schools and 250+ community organizations
- **65% reduction in depression**, 60% reduction in suicidal ideation among participants
- **1,100x user growth** in past year
- Press: MobiHealthNews, Yahoo Finance, Behavioral Health Business, AlleyWatch, PR Newswire

## Other Projects
- **kAI** (https://joinkai.app) - Engineer - AI engineering agent for Slack, automates bug investigation and PRs
- **Watchpoint** (https://watchpoint.dev) - Engineer - Application monitoring platform
- **Life Skills Software** (https://lifeskills.software) - Co-Founder - Educational games for special needs students, won UPitchNJ 2019
- **What Did You Get Done** - Creator - Productivity tracking app
- **Everybody Polls** - Creator - Real-time polling platform
- **aCrossMinistry** - Creator - Faith-based community platform

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon serverless) + Drizzle ORM
- **State Management**: TanStack React Query
- **Animations**: Framer Motion + custom CSS animations

## Project Structure
```
portfolio/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── sections/       # Page sections (Hero, About, Projects, etc.)
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   └── layout/         # Header, Footer
│   │   ├── data/
│   │   │   ├── projects.ts     # Project data (featuredProject + projects array)
│   │   │   ├── experiences.ts  # Work experience timeline
│   │   │   └── blog-posts-seed.ts  # Blog post outlines for seeding
│   │   ├── hooks/              # Custom React hooks
│   │   └── pages/              # Route pages (Home, Blog, BlogPost, Admin)
│   └── index.html
├── server/                     # Express backend
│   ├── routes.ts               # API endpoints (/api/blog, /api/contact)
│   ├── storage.ts              # Database operations (Drizzle)
│   └── index.ts                # Server entry
├── shared/                     # Shared types and schemas
│   └── schema.ts               # Drizzle schema + Zod validation
├── .claude/                    # Claude Code settings
│   └── settings.json
└── CLAUDE.md                   # This file
```

## Commands
```bash
npm install      # Install dependencies
npm run dev      # Start dev server (requires DATABASE_URL)
npm run build    # Build for production
npm run start    # Run production build
npm run check    # TypeScript type checking
npm run db:push  # Push database schema changes
```

## Environment Variables
```bash
DATABASE_URL=    # Neon PostgreSQL connection string (required)
```

## Key Files to Know

### Data Files
- `client/src/data/projects.ts` - **featuredProject** (Somethings) + **projects** array
- `client/src/data/experiences.ts` - Work experience timeline data
- `client/src/data/blog-posts-seed.ts` - Blog post outlines (5 posts ready to seed)

### Section Components
- `client/src/components/sections/HeroSection.tsx` - Hero with stats, Somethings highlight
- `client/src/components/sections/AboutSection.tsx` - Bio with code-style visual
- `client/src/components/sections/ProjectsSection.tsx` - Featured project + grid
- `client/src/components/sections/ExperienceSection.tsx` - Timeline
- `client/src/components/sections/BlogSection.tsx` - Latest 3 posts
- `client/src/components/sections/ContactSection.tsx` - Contact form

### Styling
- `client/src/index.css` - Global styles, animations, glass-morphism, gradients
- `tailwind.config.ts` - Theme colors, custom animations

### Database Schema
- `shared/schema.ts` - Tables: users, sessions, contact_messages, blog_posts, blog_media

## Design System

### Colors (CSS Variables in index.css)
- **Primary**: Blue (220 90% 50%) - buttons, links, accents
- **Secondary**: Orange (16 100% 55%) - CTAs, highlights
- **Accent**: Cyan (168 100% 45%) - code, badges

### Custom CSS Classes
- `.gradient-text` - Animated gradient text
- `.glass` / `.glass-dark` - Glass-morphism effect
- `.neon-glow` / `.neon-text` - Neon glow effects
- `.mesh-gradient` - Multi-color mesh background
- `.hover-lift` - Hover animation with shadow
- `.animate-gradient` - Background gradient animation
- `.animate-shimmer` - Shimmer loading effect

### Animation Classes
- `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-left`, `.animate-slide-right`
- `.animate-scale-in`, `.animate-glow`, `.animate-float`
- `.animate-pulse-slow`, `.animate-border-glow`

## Blog System
- Full CRUD via `/api/blog` endpoints (auth required for write)
- Markdown content with react-markdown + remark-gfm
- Media attachments (images, videos, YouTube, Vimeo)
- Admin panel at `/admin` route (Alt+Shift+A shortcut)
- Draft/Published status workflow

## API Endpoints
```
GET  /api/blog              # List posts (public)
GET  /api/blog/:slug        # Get post by slug (public)
POST /api/blog              # Create post (auth)
PUT  /api/blog/:id          # Update post (auth)
DELETE /api/blog/:id        # Delete post (auth)
POST /api/contact           # Submit contact form (public)
GET  /api/auth/user         # Get current user (auth)
```

## Conventions
1. Use shadcn/ui components from `client/src/components/ui/`
2. Prefer Tailwind utility classes over custom CSS
3. Use Framer Motion for complex animations
4. Keep section components in `client/src/components/sections/`
5. Featured project (Somethings) should always be most prominent
6. Stats to highlight: $19.2M Series A, 11,000+ teens, 65% depression reduction, 1,100x growth

## Notes for Future Sessions
- The SpaceX section has been removed (was not relevant)
- Blog posts are in draft status - need to be seeded via admin panel
- TypeScript has some pre-existing errors in Admin.tsx, BlogSection.tsx (not blocking)
- Dev server requires DATABASE_URL to run fully
- Preview server can run with `npx vite preview` after `npm run build`
