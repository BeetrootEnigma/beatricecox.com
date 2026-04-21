# CLAUDE.md

## Project Overview

This is a **Next.js** (v16) website for **Beatrice Duguid Cox**, a remote based graphic designer . The site is deployed on **Vercel**.

## Runtime & Package Manager

This project uses **Bun** as its package manager and runtime. All commands should be run with `bun`.

## Available Skills

Skills provide reusable implementation guidelines. Agents reference them rather than duplicating their content.

| Skill                          | Purpose                               |
| ------------------------------ | ------------------------------------- |
| `/vercel-react-best-practices` | React/Next.js performance patterns    |
| `/vercel-composition-patterns` | Component composition and API design  |
| `/frontend-design`             | Distinctive, production-grade UI      |
| `/web-design-guidelines`       | Accessibility and UX best practices   |
| `/simplify`                    | Post-implementation complexity review |

## Package Management

- Always use `bun` for dependency installation and updates in this repo.
- Do not use `npm`, `pnpm`, or `yarn` to add or update packages unless the user explicitly asks for a different tool.
- When adding or updating dependencies, pin them to the latest available version at the time of the change.
- Prefer `bun add <package>@latest` and `bun add -d <package>@latest` so the resolved version is explicitly pinned in `package.json`, unless the user explicitly requests a specific version.

## Conventions

- **Server Actions**: Use Next.js server actions where possible for server-side operations. They live under `src/actions/`.
- **Page-local components**: Each page that needs local components should have a `_components/` folder inside its route directory. These components are only used by that specific page.
- **Shared components**: Components reused across multiple pages live in `src/components/`.
- **Library integrations**: Anything that interacts with external libraries (API clients, database, utilities) lives under `src/lib/`.

## Projects

Projects are handled through Sanity CMS deloyed at `/studio`

## Deployment

The site is deployed on **Vercel**.
