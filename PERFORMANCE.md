# Performance Optimizations — KetoHub Recipe App

> Written: 2026-02-25

## Summary

The homepage was slow because of a combination of **unnecessary re-renders**, **redundant network requests**, **bloated JS bundles**, **un-optimized images**, and a **globally-applied CSS transition** that forced the browser to track compositing layers for every single DOM element. Below is a full audit and the fix applied for each issue.

---

## 1. Data Fetching & Caching (`providers.tsx`, `hooks/useRecipes.ts`, `services/api.ts`)

### Problem

React Query was configured with short cache lifetimes in two places:

- **Per-hook overrides**: `staleTime: 3600 * 1000` and `gcTime: 24 * 3600 * 1000`
- **HTTP fetch**: `next: { revalidate: 3600 }` causing Next.js to invalidate cached responses every hour

Since this is a **static public API that never changes**, every hour the app would silently re-fetch the entire recipe + category dataset and discard perfectly valid cached data. Over 12 hours of usage, that's 12 wasted API calls against a rate-limited endpoint.

There was also an architectural issue: `TrendingRecipes` and `FeaturedMacrosSection` both called `useRecipes()` independently. While React Query deduplicates in-flight requests, this pattern is fragile if the `queryKey` were ever to diverge.

### Fix

```ts
// providers.tsx — global defaults
new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // data is never considered stale
      gcTime: Infinity, // data stays in memory for the session lifetime
    },
  },
});
```

```ts
// api.ts — HTTP layer
fetch(url, { cache: "force-cache" }); // removed next: { revalidate: 3600 }
```

- **Result**: Data is fetched **exactly once per session**. Navigating between pages, opening/closing the modal, switching filters — none of these trigger re-fetches.
- Removed per-hook `staleTime`/`gcTime` overrides since the global config handles it.

---

## 2. Lazy-Loading Below-the-Fold Sections (`app/page.tsx`)

### Problem

The homepage imported all 6 sections eagerly:

```tsx
import FeaturedMacrosSection from "@/app/containers/FeaturedMacrosSection";
import Community from "@/app/containers/Community";
import Newsletter from "@/app/containers/Newsletter";
```

These sections are **never visible on initial page load** — they require scrolling. Yet their JS was included in the initial bundle and parsed/executed before the hero even appeared.

### Fix

```tsx
// dynamic imports with ssr: false for purely below-fold sections
const FeaturedMacrosSection = dynamic(
  () => import("@/app/containers/FeaturedMacrosSection"),
  { ssr: false },
);
const Community = dynamic(() => import("@/app/containers/Community"), {
  ssr: false,
});
const Newsletter = dynamic(() => import("@/app/containers/Newsletter"), {
  ssr: false,
});
```

- **Result**: The initial JS bundle is smaller. These chunks are split into separate files and only loaded when the browser has spare time (or when needed).

---

## 3. `RecipeCard` Re-renders & Modal Bundle Size (`components/RecipeCard.tsx`)

This was the **biggest single-component problem** since RecipeCard is rendered 6–12 times on the homepage.

### Problems

| Issue                                                       | Impact                                                                                |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| No `React.memo`                                             | Every parent state change (e.g. scroll arrow visibility) re-renders all visible cards |
| `RecipeDetails` imported eagerly                            | The entire modal + headlessui Dialog code bundled into every card's chunk             |
| `calculateTotalTime()` recalculated inline                  | Function body re-runs on every render                                                 |
| `getChefHatCount()` recalculated inline                     | Same issue                                                                            |
| Two SVG image files (`like-icon.svg`, `like-icon-fill.svg`) | Two HTTP requests per wishlist icon pair, across 6–12 cards                           |
| `toggleWishlist` recreated each render                      | Causes child re-renders if callback is passed down                                    |
| No responsive `sizes` on `<Image>`                          | Next.js served oversized images to mobile                                             |

### Fix

```tsx
// Memoize the entire component
const RecipeCard = React.memo(({ recipe }) => {
  // Stable handlers with useCallback
  const openModal = useCallback(() => { ... }, [recipe]);
  const closeModal = useCallback(() => { ... }, []);
  const toggleWishlist = useCallback((e) => { ... }, [isWishlisted, recipe.id]);

  // Memoized derived values
  const totalTime = useMemo(() => ..., [recipe.cook_time_in_minutes, recipe.prep_time_in_minutes]);
  const chefHatCount = useMemo(() => getChefHatCount(recipe.difficulty), [recipe.difficulty]);

  return (
    <div onClick={openModal}>
      <Image
        sizes="(max-width: 768px) 49vw, (max-width: 1200px) 33vw, 25vw" // ← proper sizing
        loading="lazy"
        ...
      />

      {/* Inline SVG replaces two HTTP-fetched image files */}
      {isWishlisted ? <svg fill="#FC0000">...</svg> : <svg fill="none">...</svg>}

      {/* Modal only in DOM after first open, lazy bundle loaded on click */}
      {selectedRecipe && (
        <Suspense fallback={null}>
          <RecipeDetails ... />   {/* ← lazy import */}
        </Suspense>
      )}
    </div>
  );
});
```

- **Result**: Cards only re-render when their own `recipe` prop changes. The modal bundle is deferred until a user actually clicks a card.

---

## 4. `Categories` — Scroll Handler & Memoization (`containers/Categories.tsx`)

### Problems

1. **Passive vs. active scroll listener**: The scroll handler was added without `{ passive: true }`. Non-passive listeners block the browser's scroll thread on mobile (it has to wait to see if `preventDefault()` is called).
2. **No `useCallback`**: `handleScroll`, `scrollLeft`, `scrollRight` were recreated on every render.
3. **All category items re-rendered on scroll**: Every time the user scrolled, `showLeftIcon`/`showRightIcon` state changed, causing all `n` category `<Link>` items to re-render even though their data hadn't changed.

### Fix

```tsx
// Extracted as memoized sub-component
const CategoryItem = memo(({ category }) => <Link ...>...</Link>);

// Passive listener — browser can optimise scroll independently
el.addEventListener("scroll", handleScroll, { passive: true });

// Stable handler references
const handleScroll = useCallback(() => { ... }, []);
const scrollLeft = useCallback(() => { ... }, []);
const scrollRight = useCallback(() => { ... }, []);
```

- **Result**: Scroll events are processed on the compositor thread. Category items only re-render if the `category` prop changes, not during scroll.

---

## 5. Global CSS Transition (`globals.css`)

### Problem

```css
/* Before */
* {
  transition: background-color 0.3s ease-in; /* ← applied to EVERY element */
}
```

Applying `transition` to `*` tells the browser to track compositing layers for **every single DOM element** on every page. This is expensive during painting and prevents certain browser paint optimisations.

### Fix

Removed the global rule entirely. The specific `transition` declarations that actually matter are kept where they belong:

```css
/* After — only where needed */
.category-item {
  transition: background-color 0.2s ease-in;
}
/* Tailwind's transition-colors on individual components handles the rest */
```

---

## 6. Image Optimisation (`next.config.mjs`)

### Problem

```js
// Before — minimal config
images: {
  domains: ["s3.us-west-004.backblazeb2.com"];
}
```

- No `formats` specified → Next.js served JPEG/PNG instead of AVIF/WebP
- No `minimumCacheTTL` → optimised images weren't cached long enough
- `domains` is the deprecated API (replaced by `remotePatterns`)
- No `deviceSizes`/`imageSizes` → image optimizer had to guess appropriate breakpoints

### Fix

```js
images: {
  remotePatterns: [{ protocol: "https", hostname: "s3.us-west-004.backblazeb2.com", pathname: "/**" }],
  formats: ["image/avif", "image/webp"],    // serve modern, smaller formats
  minimumCacheTTL: 3600,                     // cache optimised images for 1hr+
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [80, 150, 180, 200, 256],      // matches the actual sizes used
},
```

---

## 7. Font Loading (`app/layout.tsx`)

### Problem

The `Manrope` custom font was declared in `globals.css` via `@font-face` but had **no preload hint** in the HTML `<head>`. The browser had to download the CSS, parse it, discover the font reference, and only then start downloading the font — adding a full RT to the critical path.

### Fix

```html
<link
  rel="preload"
  href="/fonts/Manrope-VariableFont_wght.ttf"
  as="font"
  type="font/ttf"
  crossorigin="anonymous"
/>
```

- **Result**: The font download starts in parallel with the HTML parse (no extra round trip). Combined with the existing `font-display: swap`, text renders immediately in the system font and swaps once the custom font is ready.

---

## 8. ReactQueryDevtools in Production (`providers.tsx`)

### Problem

`ReactQueryDevtools` was unconditionally imported and rendered, adding ~100kb+ of debug tooling to every user's browser.

### Fix

```tsx
{
  process.env.NODE_ENV === "development" && <DevtoolsComponent />;
}

// DevtoolsComponent uses require() so it's tree-shaken from production builds
function DevtoolsComponent() {
  const { ReactQueryDevtools } = require("@tanstack/react-query-devtools");
  return <ReactQueryDevtools initialIsOpen={false} />;
}
```

---

## 9. `useMemo` for Derived Arrays (`TrendingRecipes.tsx`, `FeaturedMacrosSection.tsx`)

### Problem

```tsx
// Before — recomputed on every render
const trendingRecipes = recipes.slice(0, 6);
const highProteinRecipes = recipes
  .filter((r) => r.protein_in_grams > 20)
  .slice(0, 6);
```

With `recipes` being a static array (never changes after initial load), these computations run on every render trigger — including parent re-renders from unrelated state.

### Fix

```tsx
const trendingRecipes = useMemo(() => recipes.slice(0, 6), [recipes]);
const highProteinRecipes = useMemo(
  () => recipes.filter((r) => r.protein_in_grams > 20).slice(0, 6),
  [recipes],
);
```

---

## Summary Table

| #   | What                                         | Fix                                                          | Main Metric Affected                   |
| --- | -------------------------------------------- | ------------------------------------------------------------ | -------------------------------------- |
| 1   | API data re-fetched hourly                   | `staleTime: Infinity`, `gcTime: Infinity`, no revalidation   | API quota usage, network waterfall     |
| 2   | Below-fold sections in initial bundle        | `next/dynamic` lazy imports                                  | Time to Interactive (TTI), bundle size |
| 3   | RecipeCard re-renders + modal bundle         | `React.memo`, `useCallback`, `useMemo`, lazy `RecipeDetails` | CPU during scrolling, bundle size      |
| 4   | Category scroll performance                  | `memo(CategoryItem)`, passive listener, `useCallback`        | Mobile scroll jank (INP)               |
| 5   | Global `transition: background-color` on `*` | Removed, kept only where needed                              | Paint time, compositing cost           |
| 6   | No image format or cache config              | AVIF/WebP formats, `remotePatterns`, cache TTL, `sizes`      | LCP, bandwidth                         |
| 7   | Font not preloaded                           | `<link rel="preload">` in `<head>`                           | LCP, FOUT                              |
| 8   | DevTools in production bundle                | Conditional + dynamic require                                | JS parse time in production            |
| 9   | Array `.filter()/.slice()` every render      | `useMemo`                                                    | CPU during re-renders                  |
