# Verification Protocol — INT-001: Create Basic Web App Framework with React

**Protocol ID:** VP-INT-001-1  
**Generated:** 2024-01-XX  
**Intent:** INT-001  
**Proposal:** PROP-INT-001-1

---

## Automated Gates

| ID | Traces To | Check | Tool | Expected | Blocking |
|----|-----------|-------|------|----------|----------|
| AG-01 | Application builds without errors using `npm run build` or equivalent | Production build completes successfully with exit code 0 | `npm run build` from repository root | Build completes, `dist/` or `build/` directory created with `index.html` and bundled JS assets | Yes |
| AG-02 | Development server starts successfully and serves content on localhost | Dev server starts and responds to HTTP requests | `npm run dev` (or equivalent), then `curl http://localhost:5173/` (adjust port) | Server returns HTTP 200, HTML content includes `<div id="root">` or equivalent mount point | Yes |
| AG-03 | Browser console shows zero critical errors on route access | Console error check on Home route load | Manual inspection: Open dev tools console, navigate to `/`, check for errors | Zero errors or warnings logged to console (info logs acceptable) | Yes |
| AG-04 | Browser console shows zero critical errors on route access | Console error check on Settings route load | Manual inspection: Navigate to `/settings`, check console | Zero errors or warnings logged to console | Yes |
| AG-05 | `.gitignore` excludes `node_modules/`, build artifacts, and environment files | `.gitignore` file exists and contains required patterns | `cat .gitignore` — verify presence of `node_modules/`, `dist/`, `build/`, `.env*` entries | File exists with all required exclusions | Yes |
| AG-06 | Repository Integrity: Must not modify `.orbital/` directory structure | `.orbital/` directory unchanged | `git diff --exit-code .orbital/` | Exit code 0 (no changes detected) | Yes |
| AG-07 | Repository Integrity: Must not modify `README.md` content | `README.md` unchanged | `git diff --exit-code README.md` | Exit code 0, content remains "Testing purposes" | Yes |
| AG-08 | No critical npm dependency vulnerabilities | Dependency security audit | `npm audit --audit-level=high` | Zero high or critical vulnerabilities (moderate/low acceptable for MVP) | No |
| AG-09 | Production bundle size reasonable for minimal SPA | Bundle size check | `ls -lh dist/assets/*.js` (or `build/static/js/*.js`) and calculate gzipped size | Main bundle gzipped size <200KB | No |

---

## Human Verification Points

| ID | Traces To | Check | Method | Assessed By |
|----|-----------|-------|--------|-------------|
| HV-01 | Both `/` (Home) and `/settings` routes render distinct content when accessed directly via URL | Verify direct URL access to both routes works without 404 errors | Manual test: (1) Start dev server, (2) Enter `http://localhost:5173/` in browser address bar, verify Home content renders, (3) Enter `http://localhost:5173/settings` directly in address bar, verify Settings content renders | System Architect |
| HV-02 | At least one visual difference between Home and Settings routes is observable | Verify visual distinction between routes | Manual inspection: Navigate to Home, observe heading/content; navigate to Settings, confirm different heading/content visible | System Architect |
| HV-03 | Navigation between routes functions without full page reload (SPA behavior confirmed) | Verify client-side navigation with network monitoring | Manual test: Open browser dev tools Network tab, navigate from Home to Settings via navigation link, confirm no document reload request (only XHR/fetch if data loading, but none expected for MVP) | System Architect |
| HV-04 | Browser back/forward buttons work correctly (Target State criterion) | Verify browser history API integration | Manual test: (1) Navigate Home → Settings via nav link, (2) Click browser back button, confirm return to Home without reload, (3) Click forward button, confirm return to Settings | System Architect |
| HV-05 | Navigation component present and functional on both routes (Target State criterion) | Verify shared navigation component renders and links work | Manual inspection: Confirm navigation (nav bar or menu) visible on Home and Settings pages, links are clickable and styled distinctly from body text | System Architect |
| HV-06 | Basic HTML semantics applied (Target State criterion) | Review heading hierarchy and semantic elements | Code review: Inspect `Home.jsx`, `Settings.jsx`, `Navigation.jsx` for proper `<nav>`, `<main>`, heading tags (`<h1>`, `<h2>`) in logical order | System Architect |
| HV-07 | Responsive layout adapts to mobile viewport (Target State criterion) | Verify 320px width rendering | Manual test: Open browser dev tools, set viewport to 320px width, navigate to both routes, confirm content is readable and navigation is accessible (no horizontal scroll or overlapping elements) | System Architect |
| HV-08 | Architecture accommodates future route additions without refactoring (Extensibility Requirement constraint) | Review routing implementation for extensibility | Code review: Examine `App.jsx` route definitions, confirm adding a third route (e.g., `/about`) requires only: (1) Create `About.jsx` component, (2) Add `<Route path="/about" element={<About />} />` to existing `Routes`, (3) Add link to Navigation component. No structural refactoring required. | System Architect |
| HV-09 | Framework choice (Vite/CRA), React Router version, and directory structure align with team constraints and deployment targets | Validate architectural decisions against project context | Architecture review: Confirm proposal rationale for build tool, routing library, and folder structure documented. Human reviewer must approve choices based on team expertise, deployment environment, and long-term maintenance philosophy. | System Architect |
| HV-10 | Development environment runnable on standard Node.js LTS without specialized tooling | Verify setup simplicity | Manual test: Clone repository in clean environment, run `npm install` then `npm run dev`, confirm application runs without additional configuration or global tool installations | System Architect |

---

## Intent Traceability

| Acceptance Criterion | Covered By |
|---------------------|------------|
| Application builds without errors using `npm run build` or equivalent | AG-01 |
| Development server starts successfully and serves content on localhost | AG-02 |
| Both `/` (Home) and `/settings` routes render distinct content when accessed directly via URL | HV-01 |
| Navigation between routes functions without full page reload (SPA behavior confirmed) | HV-03 |
| Browser console shows zero critical errors on route access | AG-03, AG-04 |
| At least one visual difference between Home and Settings routes is observable | HV-02 |
| Page load time <2 seconds on 3G connection simulation (Target State) | *(Deferred to future orbit — no tooling for 3G simulation in MVP)* |
| All routes accessible via browser back/forward buttons (Target State) | HV-04 |
| Navigation component (nav bar or menu) present and functional on both routes (Target State) | HV-05 |
| Basic HTML semantics applied (Target State) | HV-06 |
| Responsive layout that adapts to mobile viewport (320px width minimum) (Target State) | HV-07 |
| Must use React as the UI library (constraint) | *(Verified by presence of `react` and `react-dom` in `package.json` dependencies)* |
| Exactly two routes required at completion (constraint) | *(Verified by HV-01 and code review confirming only `/` and `/settings` routes defined)* |
| Must not modify or remove `.orbital/` directory structure or `README.md` (constraint) | AG-06, AG-07 |
| Solution must be runnable on standard Node.js LTS versions without specialized tooling (constraint) | HV-10 |
| Architecture must accommodate future route additions without structural refactoring (constraint) | HV-08 |

**Orphan checks:** None  
**Uncovered criteria:**
- **"Page load time <2 seconds on 3G connection simulation"** — Deferred to future orbit. No automated 3G throttling tooling included in MVP. Lighthouse audit (stretch goal) would measure this, but not blocking for Tier 2 approval.
- **Stretch goals** (route transitions, 404 route, Lighthouse ≥90, test coverage) — Explicitly marked as not required for approval in Intent Document.

---

## Escape Criteria

| Failure Mode | Action | Owner |
|-------------|--------|-------|
| Build fails (AG-01) — syntax errors, missing dependencies, config issues | re-orbit — Fix errors and re-run build. If dependency conflicts unresolvable, escalate to System Architect to re-evaluate tool choices. | AI Agent → System Architect (if architectural) |
| Dev server fails to start (AG-02) — port conflicts, missing config, runtime errors | re-orbit — Resolve port conflict or configuration error and restart. Document resolution in orbit log. | AI Agent |
| Console errors on route load (AG-03, AG-04) — React warnings, router errors, uncaught exceptions | re-orbit — Fix errors at source. Critical errors (uncaught exceptions) are blocking; React warnings acceptable if non-breaking. | AI Agent |
| `.orbital/` or `README.md` modified (AG-06, AG-07) — accidental edit during implementation | rollback — Revert changes to protected files via `git checkout`. Re-run verification to confirm clean state. | AI Agent |
| npm audit finds high/critical vulnerabilities (AG-08) — dependency security issues | re-orbit — Update vulnerable packages to patched versions if available. If no patch exists and vulnerability is in dev dependency (not runtime), document as known issue and proceed (non-blocking gate). | AI Agent |
| Bundle size exceeds 200KB gzipped (AG-09) — oversized dependencies or poor code splitting | re-orbit — Profile bundle with build tool analyzer, remove unnecessary dependencies or enable code splitting. Non-blocking for Tier 2 but must be addressed before production deployment. | AI Agent |
| Direct URL access to routes fails (HV-01) — server returns 404 for `/settings` | re-orbit — Vite dev server should handle SPA routing automatically. If failing, check server config. Document deployment requirement for production (server must serve `index.html` for all routes). | System Architect |
| Routes not visually distinct (HV-02) — identical content between Home and Settings | re-orbit — Update content or styling to create clear visual difference (different heading, color, layout element). | AI Agent |
| Full page reload detected on navigation (HV-03) — using `<a href>` instead of `<Link>` | re-orbit — Replace anchor tags with React Router `Link` components in Navigation. Re-test with network monitor. | AI Agent |
| Browser back/forward buttons broken (HV-04) — routing library not configured correctly | re-orbit — Verify `BrowserRouter` wraps app correctly. Test with simple navigation flow to isolate issue. | AI Agent |
| Navigation component missing or non-functional (HV-05) — links don't navigate or component not rendered | re-orbit — Ensure Navigation component imported and rendered in both page components. Verify links use correct `to` prop syntax. | AI Agent |
| HTML semantics incorrect (HV-06) — improper heading hierarchy or missing semantic tags | re-orbit — Refactor components to use semantic HTML. Non-blocking but must be addressed for accessibility compliance in future orbits. | AI Agent |
| 320px viewport layout broken (HV-07) — horizontal scroll or overlapping elements on mobile | re-orbit — Add responsive CSS (media queries or flexible units). Test across mobile viewport sizes. | AI Agent |
| Architecture not extensible (HV-08) — adding third route requires refactoring | modify-intent — If routing structure is fundamentally rigid, proposal assumptions were incorrect. Escalate to re-evaluate routing library choice or restructure route definitions. | System Architect |
| Architectural decisions misaligned with team/deployment constraints (HV-09) — wrong build tool for deployment target or team expertise | modify-intent — If human reviewer identifies fundamental mismatch (e.g., Vite chosen but team requires Webpack, or deployment environment doesn't support SPA routing), proposal must be revised. | System Architect |
| Setup not runnable on standard Node.js (HV-10) — requires global tools or non-LTS Node version | re-orbit — Remove global tool dependencies or update to use npx for tooling. Ensure `package.json` engines field specifies compatible Node version. | AI Agent |