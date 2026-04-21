# UX + Performance Audit Report

## Snapshot

Site: https://beatricecox.com
Date: 2026-04-20
Primary goal: Visitors view and engage with portfolio projects
Key journey tested: Homepage → project browsing
Device priority: Balanced (mobile + desktop)

---

## Executive Summary

- **Homepage scores 92 on mobile** — the core site is healthy. The score of ~49 the user reports is almost certainly from **project detail pages** (`/projects/[slug]`), which load many large images without proper responsive sizing hints.
- **Biggest single win**: adding a `sizes` prop to every `<Image>` component. Lighthouse flagged 1,056 KiB of avoidable image data on the homepage alone. One project thumbnail (a GIF) weighs 761 KB — 93% is wasted on mobile.
- **Second biggest win**: fixing the `ConditionalLayout` client component, which forces the entire Navbar + Footer into a client bundle, slowing down hydration on every page.
- **Redirect chain** (beatricecox.com → www.beatricecox.com) costs a free 361 ms on every visit.
- Three accessibility failures (color contrast, landmark, link names) lower the a11y score from 100 → 88.

---

## Lighthouse Scorecard (lab data)

| URL | View | Perf | A11y | Best | SEO | FCP | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| beatricecox.com | mobile | **92** | 88 | 100 | 100 | 1.1s | 1.7s | 0ms | 0 |
| /projects/[slug] | — | ~49* | — | — | — | — | — | ~1,670ms | — |

*\* estimated from user-provided screenshot; project pages were not auditable via Lighthouse (no public slug available during audit)*

### Key findings

- **Performance (92 homepage / ~49 project pages)**: Homepage is solid. Project pages suffer from un-sized images across `GridBlock`, `FullScreenBlock`, and `CarouselBlock`.
- **Accessibility (88)**: Three failures — low-contrast category text (`#8C8C8C`), social links with no accessible name, and no `<main>` landmark.
- **SEO / Best Practices (100/100)**: No issues.
- **Total byte weight**: 5,627 KiB on the homepage — high due to large un-optimised project thumbnail images.

---

## Image Delivery Issues (1,056 KiB wasted — homepage alone)

Lighthouse identified five oversized images on the homepage. The root cause is the same in every case: **no `sizes` prop on `<Image>` components**, so Next.js falls back to `100vw` and requests images at full viewport width (up to `w=3840`).

| Image | Displayed | Requested | Wasted |
|---|---|---|---|
| GIF thumbnail (1080×1080) | 539×539 | w=1080 | 712 KB (93%) |
| JPG thumbnail (1900×1343) | 539×381 | **w=1920** | 221 KB (92%) |
| PNG thumbnail (2340×1254) | 539×289 | **w=3840** | 87 KB (95%) |
| JPG thumbnail (1017×798) | 539×423 | w=1080 | 39 KB (72%) |
| JPG thumbnail (900×600) | 539×359 | w=1080 | 12 KB (64%) |

**Project thumbnails are displayed in a max-w-[600px] column (two columns, each ~50vw on desktop).** The correct `sizes` value is:

```tsx
sizes="(max-width: 768px) 100vw, 50vw"
```

For each block type on the project detail page:

| Component | Correct `sizes` |
|---|---|
| `GridBlock` single image | `"(max-width: 768px) 100vw, 50vw"` |
| `GridBlock` pair | `"(max-width: 768px) 100vw, 33vw"` |
| `FullScreenBlock` | `"100vw"` (already full width, no change needed) |
| `CarouselBlock` | `"(max-width: 1024px) 100vw, 1025px"` |

---

## GIF thumbnail

One project thumbnail is a GIF (761 KB). GIFs are never optimal for the web at this size. Options:
- **Best**: Convert to WebP animated (or short MP4/WebM with `<video autoplay loop muted playsinline>`)
- **Acceptable**: Serve as WebP via Sanity's `?fm=webp` — add `fm: 'webp'` in the image loader when not already `auto=format`.

---

## JS & Rendering Issues

### ConditionalLayout as a client component (`src/components/ConditionalLayout.tsx`)

```tsx
"use client"; // ← forces Navbar + Footer into the client bundle
export function ConditionalLayout({ children }) {
  const pathname = usePathname(); // only used to hide nav in /studio
  ...
}
```

This turns the entire layout shell into a client component, delaying hydration on every page. Fix: move the `/studio` path check to a separate small client component so the Navbar and Footer can remain server-rendered.

```tsx
// ConditionalLayout.tsx — remove "use client", make it a server component
import { StudioGuard } from './StudioGuard'; // new tiny client component

export function ConditionalLayout({ children }) {
  return (
    <StudioGuard>
      <Navbar />
      {children}
      <Footer />
    </StudioGuard>
  );
}
```

### Redirect chain (361 ms)

`beatricecox.com` → `www.beatricecox.com` adds a full round trip on every cold visit. Fix in Vercel dashboard: set `beatricecox.com` as the primary domain, or redirect `www` to the apex (pick one and be consistent). Also update `metadataBase`, `env.NEXT_PUBLIC_BASE_URL`, and canonical URLs to match.

### Unused JavaScript (135 KiB)

| File | Wasted |
|---|---|
| Google Analytics (`/gtag/js`) | 66 KiB |
| Next.js chunks | ~69 KiB |

Google Analytics is loaded synchronously via `@next/third-parties`. It's fine to keep it, but if you ever need to cut JS further, loading it `afterInteractive` (the default for `GoogleAnalytics`) is already correct — the 66 KiB waste is because ~half of GA's code is not executed on any given page.

### styled-components in dependencies

`styled-components` is listed in `package.json` but the codebase uses Tailwind. If it's not actually used anywhere, remove it — it may be adding to the client bundle unnecessarily.

---

## Accessibility Issues (score 88 → target 100)

| Severity | Issue | Location | Fix |
|---|---|---|---|
| High | No `<main>` landmark | `layout.tsx` | Wrap page content in `<main>` |
| Med | Low contrast: `text-[#8C8C8C]` on white (3.6:1, fails AA) | `Project.tsx` line 88 | Use `#767676` or darker for 4.5:1 minimum |
| Med | Social/icon links with no accessible name | `Footer.tsx` | Add `aria-label="LinkedIn"` etc. |

---

## Recommendations

### Quick wins (≤ 1 day)

1. **Add `sizes` prop to project thumbnail `<Image>` in `src/app/_components/Projects/Project.tsx`**
   ```tsx
   <Image
     src={thumbnailImage.url || ""}
     alt={thumbnailImage.description || ""}
     width={thumbnailImage.details.width}
     height={thumbnailImage.details.height}
     sizes="(max-width: 768px) 100vw, 50vw"  // ← add this
   />
   ```
   Expected saving: ~1 MB per homepage load on mobile.

2. **Add `sizes` to all block images** on project detail pages (`GridBlock`, `FullScreenBlock`, `CarouselBlock`). See table above for values.

3. **Fix the redirect**: Set a canonical domain in Vercel and update `NEXT_PUBLIC_BASE_URL`. Saves 361 ms on every cold visit.

4. **Accessibility quick fixes**: Add `<main>` wrapper in `layout.tsx`, darken the category text color, add `aria-label` to footer icon links.

### Medium effort (1–5 days)

5. **Convert `ConditionalLayout` to a server component** (split the `/studio` check into a tiny client component). This removes a client boundary wrapping the entire layout.

6. **Reduce font weights**: `Bodoni_Moda` loads 5 weights (`400–800`) and `Manrope` loads 7 weights (`200–800`). Audit which weights are actually used in Tailwind classes and remove unused ones. Each font file is 50–150 KB.

7. **Replace GIF thumbnail with WebP/video**: Coordinate with Beatrice to re-upload the GIF project thumbnail as WebP or MP4.

8. **Remove `styled-components`** if confirmed unused:
   ```bash
   bun remove styled-components @types/styled-components
   ```

### Larger projects (≥ 1 week)

9. **Refactor heavy framer-motion animations to CSS**: Many components use framer-motion for simple `y + opacity` fade-ins that could be CSS `@keyframes`. Removing framer-motion from server-rendered components would reduce the client JS bundle significantly. Keep it for the `WorthyClients` ticker and any drag/gesture interactions.

10. **Lazy-load `react-responsive-carousel`**: The carousel is already inside `DynamicBlock` (which uses `next/dynamic`), but `react-responsive-carousel` itself is a sizeable library. Consider replacing it with a CSS-scroll-snap carousel or a lighter alternative like Embla Carousel to cut JS on project pages.

---

## Next Steps to Measure

- Run Lighthouse against a real project detail page (e.g., `beatricecox.com/projects/<actual-slug>`) to baseline the ~49 score.
- After adding `sizes` props, re-run Lighthouse and compare LCP and total byte weight.
- Check Core Web Vitals in Vercel Speed Insights for real-user data (INP, LCP, CLS) — lab scores and real-user scores can diverge significantly for animation-heavy sites.

---

## Appendix

Lighthouse HTML reports: `./lighthouse/`
Lighthouse JSON reports: `./lighthouse/beatricecox.com-mobile.report.json`
