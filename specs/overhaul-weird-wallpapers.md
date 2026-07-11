# Overhaul — Lancecore Weird Wallpapers

## Objective

"Lancecore — Weird Wallpapers for your Phone" is a single-page Cloudinary-backed phone-wallpaper gallery forked from Vercel's image-gallery starter. Overhaul it into its own original thing — full visual/layout redesign that keeps the monochrome-grunge + glitch identity — and expand the glitch effect so it fires **ambiently on random images (not just on hover)** so touch/mobile users see it too. Add per-wallpaper detail pages for sharing/download. Overhaul **in place**: stay on Next.js 15 Pages Router + JavaScript + Tailwind v4 + Cloudinary + Netlify (no framework migration).

## Requirements

1. **Full homepage redesign** — new hero + grid/interaction treatment so it no longer reads as the stock Cloudinary starter, while retaining the identity: black background, asphalt texture, zinc/stone grays, uppercase `tracking-widest` type, lightning-bolt logo.
2. **Ambient glitch system** — random glitches auto-fire on random images at random intervals on **all devices** with no interaction. Desktop **also** keeps hover-to-glitch. Logo keeps its constant glitch.
3. **`prefers-reduced-motion: reduce` disables the ambient auto-glitch** (hover remains — it is user-initiated).
4. **Per-image glitch control** — each gallery image owns its **own** `useGlitch` instance (extract a `GlitchImage` component); the current single shared `hoverGlitch.ref` reused across every image cannot target one image programmatically.
5. **Wallpaper detail pages** — a stable route per wallpaper keyed on Cloudinary `public_id`, pre-rendered via `getStaticPaths` + `getStaticProps`. Shows a large preview, a working **Download** button (Cloudinary `fl_attachment`), per-wallpaper `<title>` + `og:image`, and back-to-gallery nav.
6. **Thumbnails link to the detail page** (replacing the current direct link to the raw Cloudinary URL).
7. **Shared data layer** — extract the Cloudinary folder search + `blurDataURL` mapping (currently inline in `index.js` `getStaticProps`) into `lib/cloudinary.js`, used by both the gallery and detail pages.
8. **De-monolith `index.js`** — split hero/credits/gallery into components (`Hero`, `Footer`, gallery grid, `GlitchImage`).
9. **Delete template leftovers** — `pages/api/hello.js`, the committed `build/` directory, the unused `.grid-areas`/`.grid-area-*` CSS and undefined `shadow-highlight` class (remove usages too).
10. **Meta/social** — add default `og:image` + `og:title` (currently missing) plus per-wallpaper OG on detail pages. Preserve favicons, Google Analytics, and brand links (Lance Boer → lanceboer.com; Stand Up For Bastards → bastards.tumblr.com).

## Out of Scope

- App Router or TypeScript migration.
- Changing the image host away from Cloudinary.
- Collections/categories/search/filter, CMS, upload UI, user accounts.
- Changing the fundamental purpose — it stays a wallpaper gallery.

## Constraints

- **Stack frozen:** Next.js 15 Pages Router, JavaScript, Tailwind v4 (config-less), React 19, Cloudinary (`next-cloudinary` `CldImage`), Netlify (`CI='' npm run build`, publish `.next`).
- Cloudinary env vars required at build (`CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET/FOLDER`); build-time fetch, up to 400 images.
- `react-powerglitch` stays the glitch engine (no GSAP/canvas). Reuse existing slice/shake config.
- **Performance:** ambient glitch must be viewport-gated (IntersectionObserver) with low concurrency so ~400 images stay cheap.
- Accessibility: reduced-motion honored; Download button keyboard-accessible; images keep `alt` (default `"Weird Wallpaper"`).
- `next.config.mjs` uses `images.unoptimized:true, loader:"imgix"`; `CldImage` uses Cloudinary's own loader — verify detail-page images render.

## Edge Cases

- **`prefers-reduced-motion: reduce`** → ambient scheduler does not start; hover still works.
- **Empty Cloudinary folder** → gallery shows an empty state (no crash); `getStaticPaths` returns `[]`.
- **Image missing `context.alt`** → falls back to `"Weird Wallpaper"`.
- **~400 images** → viewport-gated so only a handful animate; each glitch is a brief one-shot blip.
- **`public_id` contains slashes** → detail route handles it via catch-all `pages/w/[...id].js` (or URL-encode).
- **Unknown `public_id` at detail route** → `getStaticPaths` `fallback: false` (404).
- **Download on iOS Safari** → `fl_attachment` may open inline on iOS; acceptable known limitation.

## Definition of Done

- [ ] `npm run build` succeeds and `npm run lint` passes; `npm run dev` runs the site.
- [ ] Homepage no longer visually resembles the stock Cloudinary starter while keeping the black/grunge/glitch identity.
- [ ] On a touch/mobile view (hover disabled), glitches visibly fire on random images over time **without any interaction**.
- [ ] On desktop, hovering an image still glitches it **and** ambient random glitches also occur.
- [ ] With `prefers-reduced-motion: reduce`, ambient auto-glitch does not run.
- [ ] Clicking a thumbnail navigates to a stable per-wallpaper URL; that page shows the wallpaper, a working Download button, and correct per-wallpaper `<title>`/`og:image`.
- [ ] `pages/api/hello.js`, committed `build/`, and the `.grid-areas`/`shadow-highlight` dead code are gone with no dangling references.
- [ ] Cloudinary fetch logic exists once in `lib/cloudinary.js`, consumed by both gallery and detail pages.
