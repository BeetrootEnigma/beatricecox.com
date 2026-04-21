# beatricecox.com

This is the website for https://beatricecox.com — a web designer based in London.

## Prerequisites

- [Bun](https://bun.sh/) (version compatible with this repo’s lockfile; Bun 1.1+ is a reasonable baseline)

## Getting started

1. Copy [`.env.template`](.env.template) to `.env` and fill in every value for your environment (Sanity, preview token, cookie secret, public URLs, etc.).

2. Install dependencies:

   ```bash
   bun install
   ```

3. Run the dev server:

   ```bash
   bun run dev
   ```

   The app serves at [http://localhost:3000](http://localhost:3000).

Other useful scripts: `bun run build`, `bun run lint`, `bun run typecheck`, `bun run format`.

## Deploy on Vercel

The site is deployed on Vercel; pushes to the default production branch trigger deployments.
