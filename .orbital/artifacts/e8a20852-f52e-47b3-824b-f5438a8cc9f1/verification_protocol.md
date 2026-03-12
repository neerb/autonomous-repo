# Verification Protocol — Create Basic Web App Framework with React

**Protocol ID:** VP-ORB-1-1
**Generated:** 2025-02-17
**Intent:** Create Basic Web App Framework with React (Orbit 1)
**Proposal:** PROP-ORB-1-1

---

## Automated Gates

| ID | Traces To | Check | Tool | Expected | Blocking |
|----|-----------|-------|------|----------|----------|
| AG-01 | `npm install && npm run dev` launches development server without errors | Installation and dev server startup completes successfully | Manual execution: `npm install && npm run dev` in repository root | Exit code 0 for install, dev server starts and outputs localhost URL, no error messages in terminal | Yes |
| AG-02 | Browser console shows zero runtime errors during navigation between routes | No JavaScript errors logged during route navigation | Browser DevTools Console — navigate Home → Settings → Home | Zero errors, zero warnings related to application code (ignore browser extension noise) | Yes |
| AG-03 | Repository includes `.gitignore` excluding `node_modules` and build artifacts | .gitignore file exists and excludes critical directories | File existence check + content verification: `.gitignore` contains `node_modules/`, `dist/`, `.env*` | All three patterns present in file | Yes |
| AG-04 | Development server supports hot module replacement for code changes | HMR updates browser without full page reload | Manual test: Start dev server, modify `src/pages/Home.jsx` content, observe browser | Browser updates content without full page reload (URL stays same, no network request for index.html) | No |

---

## Human Verification Points

| ID | Traces To | Check | Method | Assessed By |
|----|-----------|-------|--------|-------------|
| HV-01 | Navigating to `http://localhost:[PORT]` renders a Home page with visible content | Home page renders successfully with meaningful content | Open browser to dev server URL, visually verify Home page displays text/content (not blank or error) | Verification Engineer |
| HV-02 | A UI mechanism allows navigation to Settings page | Navigation UI exists and functions correctly | Identify navigation component (header/sidebar), click Settings link, verify URL changes to `/settings` and page content changes | Verification Engineer |
| HV-03 | Settings page renders distinct content from Home page | Settings page has different content than Home page | Compare visual content of Home vs Settings — different heading, different body text or components | Verification Engineer |
| HV-04 | Navigation UI component persists across route changes | Navigation remains visible when switching routes | Navigate Home → Settings → Home, verify navigation UI stays in same location and doesn't disappear/re-render visually | Verification Engineer |
| HV-05 | Home and Settings pages have semantic HTML structure (`<main>`, `<nav>`, headings) | Semantic HTML elements used correctly | Open browser DevTools Elements panel, inspect Home and Settings pages, verify `<main>` wraps page content, `<nav>` wraps navigation links, each page has `<h1>` heading | Verification Engineer |
| HV-06 | Repository includes a README section documenting how to start the application | README.md contains setup instructions | Open README.md, verify it includes section explaining how to install dependencies and start dev server (commands visible) | Verification Engineer |
| HV-07 | Application uses React Router or equivalent routing library | React Router (or equivalent) used for routing, not manual window.location | Review `package.json` dependencies for `react-router-dom`, review `App.jsx` for `<BrowserRouter>`, `<Routes>`, `<Route>` components | System Architect |
| HV-08 | Lighthouse Accessibility score ≥ 90 for both routes | Accessibility baseline meets target threshold | Run Lighthouse audit in Chrome DevTools on Home and Settings pages, verify Accessibility score ≥ 90 for both | Verification Engineer |
| HV-09 | Keyboard navigation works — Tab through links, Enter to activate | Navigation is keyboard-accessible | Use Tab key to focus navigation links, verify focus indicator visible, press Enter to navigate, verify route changes | Verification Engineer |
| HV-10 | Component file organization follows proposed structure | Files located in correct directories per proposal | Verify `src/pages/` contains Home.jsx and Settings.jsx, `src/components/` contains Navigation.jsx, styles in `src/styles/` or co-located | System Architect |

---

## Intent Traceability

| Acceptance Criterion | Covered By |
|---------------------|------------|
| `npm install && npm run dev` launches a development server without errors | AG-01 |
| Navigating to `http://localhost:[PORT]` renders a Home page with visible content | HV-01 |
| A UI mechanism (link, button, nav menu) allows navigation to Settings page | HV-02 |
| Settings page renders distinct content from Home page | HV-03 |
| Browser console shows zero runtime errors during navigation between routes | AG-02 |
| Repository includes a README section documenting how to start the application | HV-06 |
| Application uses React Router (or equivalent routing library) rather than manual route handling | HV-07 |
| Navigation UI component (header/sidebar) persists across route changes | HV-04 |
| Home and Settings pages have semantic HTML structure (`<main>`, `<nav>`, headings) | HV-05 |
| Development server supports hot module replacement for code changes | AG-04 |
| Repository includes `.gitignore` excluding `node_modules` and build artifacts | AG-03 |
| Lighthouse Accessibility score ≥ 90 for both routes | HV-08, HV-09 |

**Orphan checks:** None

**Uncovered criteria:** None (all minimal viable and target acceptance criteria have corresponding verification checks)

**Note on Stretch Goals:** Stretch acceptance criteria (interactive Settings component, deep-linking, TypeScript, unit tests) are intentionally not covered in this verification protocol. Per the proposal, the recommended scope is Target acceptance level. If stretch goals are pursued, this protocol must be updated with additional verification checks before those features are implemented.

---

## Escape Criteria

| Failure Mode | Action | Owner |
|-------------|--------|-------|
| `npm install` fails — dependency resolution error or network issue | re-orbit — investigate dependency conflict, check npm registry access, verify Node.js version compatibility; if unresolvable, escalate to System Architect for tooling decision review | AI Agent → System Architect |
| Dev server fails to start — port conflict or Vite configuration error | re-orbit — identify port conflict (try different port), review `vite.config.js` for syntax errors; if configuration issue is foundational, escalate | AI Agent → System Architect |
| Browser console shows runtime errors during navigation | re-orbit — debug JavaScript errors, verify React Router configuration, check component imports; this is a blocking gate, must be resolved | AI Agent |
| HMR does not work — full page reload required for changes | re-orbit — verify Vite HMR configuration, check if file types are supported for HMR; non-blocking but degrades developer experience significantly, should be fixed | AI Agent |
| Navigation UI does not persist across routes (HV-04 fails) | re-orbit — architectural issue with routing setup; Navigation component must be outside `<Routes>`, review component hierarchy | AI Agent → System Architect |
| Lighthouse Accessibility score < 90 (HV-08 fails) | re-orbit — review Lighthouse report for specific failures (missing alt text, contrast issues, missing ARIA labels), fix issues, re-run audit; this is a target criterion and must pass | AI Agent |
| Keyboard navigation broken (HV-09 fails) | re-orbit — accessibility-critical; verify `<Link>` components are used (not `<div onClick>`), check focus styles are not disabled, test with screen reader if available | AI Agent → Verification Engineer |
| Semantic HTML missing (HV-05 fails) | re-orbit — add `<main>`, `<nav>`, `<h1>` elements to components; semantic structure is target criterion and affects accessibility score | AI Agent |
| React Router not used, manual routing detected (HV-07 fails) | escalate — architectural decision violation; using manual routing contradicts target acceptance and creates technical debt; requires System Architect review to either approve manual approach with justification or mandate re-implementation | System Architect |
| File organization does not match proposed structure (HV-10 fails) | re-orbit — move files to correct directories per proposal (pages to `src/pages/`, components to `src/components/`); organizational precedent is critical for future orbits | AI Agent |
| README.md lacks setup instructions (HV-06 fails) | re-orbit — add "Getting Started" section to README with install and dev server commands; minimal viable criterion, must pass | AI Agent |