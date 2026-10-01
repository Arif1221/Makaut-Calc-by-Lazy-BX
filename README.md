# MAKAUT Ledger

A lightweight, client-side MAKAUT academic calculator for SGPA, CGPA, YGPA, DGPA, GPA/percentage conversion, and subject-wise SGPA.

## Why this version is static

MAKAUT Ledger does not need a server for its core calculator functionality. Everything runs in the browser using:

- HTML for structure
- CSS for layout and responsive behavior
- Vanilla JavaScript for calculations and UI state
- `localStorage` for saving work in the current browser

There is no React app, router, backend, database, authentication system, or build step.

## Features

- Regular B.Tech mode: Sem 1–8
- Lateral-entry B.Tech mode: Sem 3–8
- Credit-weighted CGPA
- Year-wise YGPA
- Final DGPA using the configured MAKAUT-style weighting
- GPA → percentage conversion
- Percentage → GPA conversion
- Subject-wise SGPA calculator
- Known-credit reference values
- Sample data and reset controls
- Copy result and print result
- Dark/light theme
- Browser-local persistence
- Responsive mobile/tablet/desktop layout
- No horizontal scrolling on narrow layouts
- Reduced-motion support

## Formulas used

### CGPA

`CGPA = Σ(SGPA × Credits) / Σ(Credits)`

### YGPA

`YGPA = Σ(SGPA × Credits) / Σ(Credits)` for the semesters in that academic year.

### Regular B.Tech DGPA

`DGPA = (Y1 + Y2 + 1.5×Y3 + 1.5×Y4) / 5`

### Lateral-entry B.Tech DGPA

`DGPA = (Y2 + 1.5×Y3 + 1.5×Y4) / 4`

### GPA → percentage

`Percentage = (GPA − 0.75) × 10`

The implemented range is GPA 0.75–10.

### Percentage → GPA

`GPA = Percentage / 10 + 0.75`

The implemented range is 0–92.50%.

## Data persistence

The app stores calculator state in browser `localStorage` under:

`makaut-ledger-v1`

Saved data includes the selected programme, semester entries, known-credit values, and subject rows.

No calculator data is intentionally sent to a project backend.

## Running locally

No package installation is required.

The simplest option is to open `index.html` directly in a modern browser.

For a local static server, for example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Deployment

Because the project is static, it can be deployed to any static hosting service, including:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages

Upload the project files and use `index.html` as the entry page.

## Project structure

```text
MAKAUT-Ledger/
├── index.html      # Complete application
└── README.md       # Project documentation
```

The current distribution intentionally keeps the application self-contained in one HTML file so it can be copied, hosted, or opened directly without a toolchain.

## Browser support

Designed for current Chromium-based browsers, Firefox, and Safari with support for standard features such as:

- CSS Grid/Flexbox
- `dialog`
- `localStorage`
- `Intl`/standard JavaScript APIs

## Important notes

This is an independent student utility and is not affiliated with MAKAUT. For formal applications or official academic records, follow the receiving organisation's requirements and verify current university rules.

The calculator's formulas, grade-point table, semester-credit references, and wording are part of the application source and should be reviewed whenever MAKAUT publishes a newer official rule or notice.

## Development notes

The application deliberately prioritizes:

1. Small footprint
2. Fast initial load
3. No unnecessary runtime dependencies
4. Offline-capable core behavior
5. Touch-friendly controls
6. Dense information layout without sacrificing readability
7. Simple maintenance and deployment


## SEO and discoverability

This static build includes:

- A descriptive, search-focused page title and meta description
- `robots` directives allowing indexing
- Open Graph and Twitter Card metadata
- `SoftwareApplication` structured data
- Semantic primary heading (`h1`) and topical on-page copy
- Stable local favicon and Apple touch icon
- A web app manifest
- `robots.txt` that permits crawling

### Canonical URL and sitemap

The production hostname is intentionally not hard-coded because it depends on the final Vercel domain or custom domain. After choosing the final URL, add a self-referential `rel="canonical"` tag and create a sitemap containing that exact canonical URL. Google recommends keeping canonical signals and sitemap URLs aligned.

After deployment, verify the homepage in Google Search Console using URL Inspection and submit the production sitemap when available.


## UI refinement pass

The current version uses a two-level mobile header so the Regular/Lateral switch and utility controls remain readable without overlap. The mobile result summary is presented as a larger, structured sticky summary with clearly separated Percentage, Progress, and DGPA values.

Desktop sizing stays compact instead of scaling every control upward on larger screens. Utility labels remain icon-only until the viewport has enough room, and nested cards use lighter borders to reduce visual clutter.
