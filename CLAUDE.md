This project is SocialConnect (fork of Postiz), a social media automation tool for SaaS founders.

**Product Direction:** Social media on autopilot for bootstrapped SaaS founders (2–20 person teams) who'd rather build than post. Done-with-you automation that feels human—turn 10 hours of content work into 10 minutes of approvals.

You can find things like:
- Schedule posts — compose and queue posts for 28+ social channels, with per-provider customisation and delay controls
- Calendar view — drag-and-drop calendar to visualise, reschedule, and manage all upcoming and past posts
- Analytics — per-channel performance dashboards with engagement metrics (likes, shares, impressions, etc.)
- Team management — invite members, assign roles, and collaborate across organisations with permission controls
- Media library — upload, browse, and reuse images/videos across posts; supports local and cloud (Cloudflare R2) storage
- AI agent chat — generate post copy, hashtags, and content ideas via an integrated AI assistant
- Integrations / OAuth — connect and manage social accounts through provider-specific OAuth flows
- Billing & subscriptions — Stripe-powered plans with usage limits and self-service billing management
- Browser extension — quickly share and schedule content from any webpage
- SDK (@postiz/node) — programmatic access for external tools to create and manage posts via API

Core features:
- Schedule posts — compose and queue posts for 28+ social channels
- Calendar view — drag-and-drop calendar to manage all posts
- Analytics — per-channel performance dashboards
- AI content generation — posts in founder's voice with human-in-loop approval
- SaaS-specific templates — build-in-public, product updates, milestone celebrations
- Autopilot scheduling — platform-optimized posting times
- Team management — invite members and collaborate

This project is a monorepo with a root only package.json of dependencies.
Made with PNPM.
We have 3 important folders

- apps/backend - this is where the API code is (NESTJS)
- apps/orchestrator - this is temporal, it's for background jobs (NESTJS) it contains all the workflows and activities
- apps/frontend - this is the code of the frontend (Vite ReactJS)
- /libraries contains a lot of services shared between backend and orchestrator and frontend components.

We are using only pnpm, don't use any other dependency manager.
Never install frontend components from npmjs, focus on writing native components.

The project uses tailwind 3, before writing any component look at:
- /apps/frontend/src/app/colors.scss
- /apps/frontend/src/app/global.scss
- /apps/frontend/tailwind.config.js

All the --color-custom* are deprecated, don't use them.

And check other components in the system before to get the right design.

When working on the backend we need to pass the 3 layers:
Controller >> Service >> Repository (no shortcuts)
In some cases we will have
Controller >> Mananger >> Service >> Repository.

Most of the server logic should be inside of libs/server.
The backend repository is mostly used to write controller, and import files from libs.server.

For the frontend follow this:
- Many of the UI components lives in /apps/frontend/src/components/ui
- Routing is in /apps/frontend/src/app
- Components are in /apps/frontend/src/components
- always use SWR to fetch stuff, and use "useFetch" hook from /libraries/helpers/src/utils/custom.fetch.tsx

When using SWR, each one have to be in a seperate hook and must comply with react-hooks/rules-of-hooks, never put eslint-disable-next-line on it.

It means that this is valid:
const useCommunity = () => {
   return useSWR....
}

This is not valid:
const useCommunity = () => {
  return {
    communities: () => useSWR<CommunitiesListResponse>("communities", getCommunities),
    providers: () => useSWR<ProvidersListResponse>("providers", getProviders),
  };
}

- Linting of the project can run only from the root.
- Use only pnpm.


# Below are the architecture diagrams for the project, only diagrams no extra text:

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SOCIALCONNECT MONOREPO                             │
│                          (pnpm workspace, TypeScript)                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐   ┌──────────────────┐   ┌────────────────────────────┐  │
│  │  apps/frontend│   │  apps/backend    │   │  apps/orchestrator         │  │
│  │  (Next.js 14) │   │  (NestJS API)    │   │  (NestJS + Temporal)       │  │
│  │  Port: 4200   │   │  Port: 3000      │   │  Background Jobs           │  │
│  └──────┬───────┘   └────────┬─────────┘   └────────────┬───────────────┘  │
│         │                    │                           │                  │
│         │    HTTP/REST       │     Temporal Workflows    │                  │
│         └───────────────────>┤◄──────────────────────────┘                  │
│                              │                                              │
│  ┌───────────────────────────┴───────────────────────────────────────────┐  │
│  │                     libraries/ (Shared Code)                          │  │
│  │  ┌─────────────────────┐ ┌──────────────────┐ ┌───────────────────┐  │  │
│  │  │ nestjs-libraries    │ │ react-shared-libs │ │ helpers           │  │  │
│  │  │ (Backend + Orch)    │ │ (Frontend)        │ │ (All apps)        │  │  │
│  │  └─────────────────────┘ └──────────────────┘ └───────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │  apps/extension   │  │  apps/sdk         │                               │
│  │  (Browser Ext)    │  │  (@socialconnect) │                               │
│  └──────────────────┘  └──────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                           │
         ▼                    ▼                           ▼
┌──────────────┐   ┌──────────────────┐   ┌──────────────────────────┐
│  PostgreSQL  │   │  Redis 7.2       │   │  Temporal Server         │
│  17          │   │  Cache/Sessions  │   │  + Temporal PostgreSQL   │
└──────────────┘   └──────────────────┘   │  + Elasticsearch        │
                                          └──────────────────────────┘
```

## Backend Request Flow

```
                    ┌──────────────────────────────────────────┐
                    │            apps/backend                   │
                    │                                          │
  HTTP Request ────►│  Controller (apps/backend/src/api/routes)│
                    │       │                                  │
                    │       ▼                                  │
                    │  [Manager] (optional orchestration layer)│
                    │       │                                  │
                    │       ▼                                  │
                    │  Service (libraries/nestjs-libraries)    │
                    │       │                                  │
                    │       ▼                                  │
                    │  Repository (Prisma ORM)                 │
                    │       │                                  │
                    └───────┼──────────────────────────────────┘
                            ▼
                    ┌──────────────┐
                    │  PostgreSQL  │
                    └──────────────┘
```

## Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    apps/frontend (Next.js 14)                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  src/app/ (Next.js App Router)                        │  │
│  │  ├── (app)/(site)/ ── Authenticated Routes            │  │
│  │  │   ├── launches/    (Post Scheduling + Calendar)    │  │
│  │  │   ├── analytics/   (Dashboard)                     │  │
│  │  │   ├── media/       (Media Library)                 │  │
│  │  │   ├── settings/    (User Settings)                 │  │
│  │  │   ├── billing/     (Subscriptions)                 │  │
│  │  │   └── agents/      (AI Chat)                       │  │
│  │  ├── auth/            (Login / Register)              │  │
│  │  └── integrations/    (OAuth Flows)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  src/components/                                      │  │
│  │  ├── ui/           (Shared UI: buttons, inputs, etc.) │  │
│  │  ├── launches/     (Calendar, Post Editor)            │  │
│  │  ├── new-launch/   (Post Creator per provider)        │  │
│  │  ├── analytics/    (Charts, Tables)                   │  │
│  │  └── settings/     (Settings Forms)                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  Data Fetching: SWR hooks ──► useFetch() ──► Backend API   │
│  State: Zustand  │  Forms: React Hook Form + Yup           │
└─────────────────────────────────────────────────────────────┘
```

## Orchestrator Workflows (Temporal)

```
┌──────────────────────────────────────────────────────────────┐
│                   apps/orchestrator                           │
│                                                              │
│  Workflows (src/workflows/)          Activities              │
│  ┌────────────────────────┐     ┌──────────────────────┐    │
│  │ post.workflow.v1.0.1   │────►│ post.activity        │    │
│  │ (Publish scheduled     │     │ (Send to 28+ social  │    │
│  │  posts at right time)  │     │  media providers)    │    │
│  ├────────────────────────┤     ├──────────────────────┤    │
│  │ autopost.workflow      │────►│ autopost.activity    │    │
│  ├────────────────────────┤     ├──────────────────────┤    │
│  │ refresh.token.workflow │────►│ integrations.activity│    │
│  ├────────────────────────┤     ├──────────────────────┤    │
│  │ send.email.workflow    │────►│ email.activity       │    │
│  ├────────────────────────┤     └──────────────────────┘    │
│  │ digest.email.workflow  │                                  │
│  ├────────────────────────┤     Signals                     │
│  │ streak.workflow        │     ┌──────────────────────┐    │
│  ├────────────────────────┤     │ Workflow signals for  │    │
│  │ missing.post.workflow  │     │ real-time control     │    │
│  └────────────────────────┘     └──────────────────────┘    │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
              ┌──────────────────────┐
              │  Temporal Server     │
              │  (Durable Execution) │
              └──────────────────────┘
```

## Shared Libraries Detail

```
libraries/
├── nestjs-libraries/                (Backend + Orchestrator shared code)
│   ├── database/prisma/
│   │   └── schema.prisma            (30+ Prisma models)
│   │
│   ├── integrations/social/         (28+ social media providers)
│   │   ├── social.abstract.ts       (Base class for all providers)
│   │   ├── integration.manager.ts   (Provider orchestration)
│   │   ├── x.provider.ts
│   │   ├── facebook.provider.ts
│   │   ├── instagram.provider.ts
│   │   ├── linkedin.provider.ts
│   │   ├── youtube.provider.ts
│   │   ├── tiktok.provider.ts
│   │   ├── bluesky.provider.ts
│   │   └── ... (20+ more providers)
│   │
│   ├── database/                    (Repository + Service per entity)
│   │   ├── posts/                   *.repository.ts + *.service.ts
│   │   ├── integrations/
│   │   ├── organizations/
│   │   ├── users/
│   │   ├── media/
│   │   ├── subscriptions/
│   │   └── ...
│   │
│   └── services/                    (Cross-cutting services)
│       ├── stripe.service.ts
│       ├── email.service.ts
│       ├── agent/ (Mastra AI)
│       ├── upload/ (Local, Cloudflare R2)
│       ├── short-linking/ (Dub, Kutt)
│       └── videos/ (Veo3, image slides)
│
├── react-shared-libraries/          (Frontend shared code)
│   ├── form/                        (Input, Button, Select, etc.)
│   ├── translation/                 (i18n: 16 languages)
│   └── helpers/                     (React hooks, upload, media)
│
└── helpers/                         (All apps shared utilities)
    ├── auth/                        (Auth utilities)
    ├── utils/custom.fetch.tsx       (SWR fetch hook)
    └── configuration/               (Config validation)
```

## Post Scheduling Flow (End-to-End)

```
 User creates post            Backend persists           Orchestrator schedules
 in Calendar UI               to PostgreSQL              via Temporal
┌──────────────┐         ┌──────────────────┐       ┌──────────────────────┐
│  Frontend    │  POST   │  Backend         │       │  Orchestrator        │
│  (Post       │────────►│  PostsController │       │                      │
│   Editor)    │         │       │          │       │  post.workflow       │
└──────────────┘         │       ▼          │       │       │              │
                         │  PostsService    │       │       ▼              │
                         │       │          │  ────►│  post.activity       │
                         │       ▼          │       │       │              │
                         │  PostsRepository │       │       ▼              │
                         │       │          │       │  IntegrationManager  │
                         │       ▼          │       │       │              │
                         │  PostgreSQL      │       │       ▼              │
                         └──────────────────┘       │  x.provider.ts      │
                                                    │  linkedin.provider   │
                                                    │  instagram.provider  │
                                                    │  ... (28+ channels)  │
                                                    └──────────────────────┘
                                                            │
                                                            ▼
                                                    Social Media APIs
                                                    (X, LinkedIn, FB,
                                                     IG, TikTok, ...)
```

## Infrastructure (Docker Compose)

```
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Stack                        │
│                                                                 │
│  ┌─────────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │  socialconnect   │  │  PostgreSQL │  │  Redis 7.2         │  │
│  │  (All-in-one     │  │  17         │  │  Cache / Sessions  │  │
│  │   App Container) │  │  Port: 5432 │  │  Port: 6379        │  │
│  └─────────────────┘  └─────────────┘  └────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Temporal Stack                                         │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌────────────────┐  │    │
│  │  │ temporal      │ │ temporal-db  │ │ temporal-ui    │  │    │
│  │  │ (Server)      │ │ (PG 16)     │ │ (Port: 8080)  │  │    │
│  │  └──────────────┘ └──────────────┘ └────────────────┘  │    │
│  │  ┌──────────────────────┐                               │    │
│  │  │ temporal-elasticsearch│                               │    │
│  │  └──────────────────────┘                               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```