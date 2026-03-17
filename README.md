# AngularFinanceTracker

A personal finance tracker built as a learning project to explore the Angular framework.

## Tech stack

| Layer            | Technology                          |
| ---------------- | ----------------------------------- |
| Framework        | Angular 21 (standalone)             |
| State management | NgRx Signal Store (`@ngrx/signals`) |
| Styling          | Tailwind CSS v4 + SCSS              |
| Charts           | Chart.js via ng2-charts             |
| Package manager  | pnpm                                |
| Language         | TypeScript                          |

## Features

- **Dashboard** — spending summary, category breakdown chart, budget progress overview
- **Transactions** — log income and expense transactions, filter by category and date
- **Budgets** — set monthly spending limits per category, track progress in real time
- **Settings** — manage categories with custom names, colors, and icons

All data is persisted to `localStorage` — no backend required.

## Angular concepts covered

- Standalone components and `bootstrapApplication()`
- Angular Router with lazy-loaded routes
- NgRx Signal Store — `signalStore()`, `withState()`, `withComputed()`, `withMethods()`
- Reactive Forms — `FormBuilder`, `FormGroup`, `Validators`
- Dependency Injection with `inject()`
- Signal-based component inputs/outputs (`input()` / `output()`)
- Angular 17 control flow (`@if`, `@for`)

## Getting started

### Prerequisites

- Node.js v18.19+ or v20+
- pnpm

### Install

```bash
pnpm install
```

### Dev server

```bash
ng serve --open
```

Open [http://localhost:4200](http://localhost:4200).

### Build

```bash
# Development
ng build

# Production
ng build --configuration=production
```

### Lint

```bash
ng lint
```
