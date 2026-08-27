# MAKAUT Ledger

A focused SGPA, CGPA, YGPA, and DGPA calculator for MAKAUT B.Tech
students, supporting both **Regular** and **Lateral Entry** programs.

The interface is designed around a compact academic-ledger concept
rather than a conventional calculator/dashboard UI.

> **Disclaimer:** MAKAUT Ledger is an independent student utility and is
> not affiliated with or endorsed by MAKAUT.

## Features

-   Calculate semester **SGPA** and overall **CGPA**
-   Calculate yearly **YGPA**
-   Calculate final **DGPA**
-   Supports:
    -   **Regular B.Tech** --- 8 semesters
    -   **Lateral Entry** --- semesters 3--8
-   Credit-weighted calculations
-   Pre-filled known credits for the supported IT curriculum
-   Separate Regular/Lateral modes
-   Light and dark themes
-   Theme preference persisted locally
-   Responsive layout for desktop and mobile
-   Built-in result gauge and percentage conversion
-   Local-first state management; no account is required for normal
    calculator use

## Design

MAKAUT Ledger uses an editorial/ledger-inspired visual language:

-   Serif display typography for academic/document character
-   Compact form controls
-   Year-based semester grouping
-   Persistent calculation summary
-   Warm paper-like light theme
-   Deep, restrained dark theme
-   Minimal visual hierarchy without unnecessary dashboard elements

The theme toggle changes only the visual presentation; it does not alter
the calculator's content, layout structure, or calculation logic.

## Tech Stack

-   **React 19**
-   **TypeScript**
-   **Vite**
-   **TanStack Router / Start**
-   **Tailwind CSS v4**
-   **Zustand**
-   **Radix UI**
-   **Lucide React**
-   **Zod**
-   **Playwright**
-   **ESLint + Prettier**

## Project Structure

``` text
src/
├── components/
│   ├── calc/
│   │   ├── app-header.tsx       # Header, program selector, theme toggle
│   │   ├── ledger-app.tsx       # Main application shell and theme state
│   │   ├── reference-sheet.tsx  # Reference/rules information
│   │   ├── result-gauge.tsx     # CGPA result visualization
│   │   ├── semester-ledger.tsx  # Semester input interface
│   │   └── workbench.tsx        # Main calculator workspace
│   └── ui/                      # Reusable UI primitives
├── lib/
│   └── calc/
│       ├── core.ts              # Calculation logic and academic rules
│       ├── store.ts             # Calculator state
│       └── core.test.ts         # Calculation tests
├── routes/
│   ├── __root.tsx
│   └── index.tsx
└── styles.css                   # Global styles and theme tokens
```

## Calculation Model

The calculator uses credit-weighted results.

For a set of semester results:

``` text
CGPA = Σ(SGPA × Semester Credits) / Σ(Semester Credits)
```

The application also derives yearly and final academic results according
to the selected **Regular** or **Lateral Entry** program structure.

The calculation implementation is kept separately from the UI in:

``` text
src/lib/calc/core.ts
```

This makes the academic logic easier to test and maintain independently
of the interface.

## Running the Project

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Create a production build:

``` bash
npm run build
```

Preview the production build:

``` bash
npm run preview
```

## Quality Checks

Type checking:

``` bash
npm run typecheck
```

Linting:

``` bash
npm run lint
```

Tests:

``` bash
npm test
```

Formatting:

``` bash
npm run format
```

## Theme

The application defaults to dark mode.

The theme toggle is implemented in the application header and controlled
by the main calculator shell. The selected theme is stored in browser
`localStorage` under:

``` text
makaut-ledger-theme
```

Supported values:

``` text
dark
light
```

## Screenshots

Example screenshots are included in the `screenshots/` directory.

They cover the main calculator, Regular and Lateral modes, filled
examples, and supporting reference/workbench views.

## Data & Privacy

The calculator is designed as a local-first student utility.

-   Calculator state is stored locally.
-   No account is required for calculating results.
-   No personal student data needs to be sent to a server for the core
    calculator functionality.
-   Theme preference is stored locally in the browser.

## Contributing

When modifying the project:

1.  Keep calculation logic separate from presentation.
2.  Preserve the Regular/Lateral distinction.
3.  Add or update tests when changing calculation rules.
4.  Avoid changing the established layout unless the change is
    intentional.
5.  Keep both desktop and mobile layouts usable.
6.  Maintain accessible labels and controls.
7.  Run type checking, linting, and tests before committing.

## License

No license has currently been specified for this project.

If this repository is intended for public distribution, add an explicit
license before accepting or distributing third-party contributions.
