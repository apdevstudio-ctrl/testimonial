# TestiFlow Frontend

Next.js application for [testiflow.site](https://testiflow.site) — dashboard, marketing, public walls, embeds, and API routes.

## Documentation

| Document | Description |
|----------|-------------|
| [../README.md](../README.md) | Product overview & all features |
| [../INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) | Full integration guide (copy-paste examples) |
| `/integration-guide` | In-app integration guide (when running) |
| `/docs` | Online documentation |

## Setup

```bash
npm install
cp .env.example .env.local
# Fill MONGODB_URI, JWT_SECRET, Lemon Squeezy keys, etc.
npm run dev
```

Dashboard: `http://localhost:3001`

## Build

```bash
npm run build:script   # from repo root — copies embed to public/script.js
npm run build
```

## Key routes

| Route | Purpose |
|-------|---------|
| `/dashboard` | Sites list |
| `/sites/[siteId]` | Embed Studio, config, analytics |
| `/w/[slug]` | Public Wall of Love |
| `/embed/w/[siteId]` | Iframe wall |
| `/integration-guide` | Integration docs UI |
| `/docs/*` | Documentation |

## Environment

See `.env.example` for all variables.
