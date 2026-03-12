# Verification Protocol: Initial React Web Framework and Foundation

## Automated Gates

### Gate 1: Dependency Installation
**Test:** Clean dependency installation
**Command:** 
```bash
rm -rf node_modules package-lock.json
npm install
```
**Expected Output:**
- Exit code 0
- `package-lock.json` created
- `node_modules/` directory populated
- No error messages in output
- No `WARN` messages about missing peer dependencies

**Pass Criteria:** Installation completes without errors in under 2 minutes on standard broadband connection.

---

### Gate 2: Development Server Startup
**Test:** Dev server starts and binds to port
**Command:**
```bash
npm run dev
```
**Expected Output:**
- Exit code 0 (server running, not exited)
- Console output includes: `Local: http://localhost:5173/` (or next available port)
- Console output includes: `ready in [time]ms`
- No error stack traces in console
- Server responds to HTTP requests within 3 seconds

**Pass Criteria:** Server starts successfully and remains running. Browser can access `http://localhost:5173` and receives HTML response.

---

### Gate 3: Build Success
**Test:** Production build completes
**Command:**
```bash
npm run build
```
**Expected Output:**
- Exit code 0
- `dist/` directory created
- `dist/index.html` exists
- `dist/assets/` directory contains bundled JS and CSS files
- Console output shows build completion with file sizes
- No error or warning messages about missing modules

**Pass Criteria:** Build completes in under 30 seconds. Generated bundle size under 500KB for initial load.

---

### Gate 4: File Structure Compliance
**Test:** Required files and directories exist at correct paths
**Command:**
```bash
test -f package.json && 
test -f index.html && 
test -f vite.config.js && 
test -f README.md && 
test -f .gitignore && 
test -d src && 
test -d src/components && 
test -d src/pages && 
test -f src/App.jsx && 
test -f src/main.jsx && 
test -f src/App.css && 
test -f src/index.css && 
test -f src/components/Navigation.jsx && 
test -f src/pages/Home.jsx && 
test -f src/pages/Settings.jsx
```
**Expected Output:** Exit code 0 (all files exist)

**Pass Criteria:** All required files present at specified paths. No extraneous template files (e.g., `src/assets/react.svg`, `src/App.test.jsx`) remaining.

---

### Gate 5: Dependency Audit
**Test:** No high or critical security vulnerabilities
**Command:**
```bash
npm audit --audit-level=high
```
**Expected Output:**
- Exit code 0
- Message: `found 0 vulnerabilities` or only low/moderate severity findings
- No high or critical CVEs listed

**Pass Criteria:** Zero high or critical vulnerabilities. Moderate and low vulnerabilities documented with mitigation plan or accepted risk.

---

### Gate 6: Git Ignore Verification
**Test:** Build artifacts and dependencies excluded from git
**Command:**
```bash
npm run build && 
git status --porcelain | grep -E "node_modules|dist|.DS_Store|.vscode|.idea"
```
**Expected Output:** Empty output (no matches) or exit code 1 from grep (no matches found)

**Pass Criteria:** None of the following appear in `git status` after build: `node_modules/`, `dist/`, `.DS_Store`, `.vscode/`, `.idea/`

---

### Gate 7: Package.json Validation
**Test:** Required scripts and dependencies present
**Command:**
```bash
cat package.json | jq -e '.scripts.dev and .scripts.build and .scripts.preview' && 
cat package.json | jq -e '.dependencies.react and .dependencies["react-dom"] and .dependencies["react-router-dom"]' && 
cat package.json | jq -e '.devDependencies.vite'
```
**Expected Output:** Exit code 0 for all three jq checks

**Pass Criteria:** 
- Scripts exist: `dev`, `build`, `preview`
- Dependencies include: `react` (18.x), `react-dom` (18.x), `react-router-dom` (6.x)
- Dev dependencies include: `vite` (5.x or latest)

---

### Gate 8: ESLint (Stretch Goal - Optional)
**Test:** Code passes linting rules
**Command:**
```bash
npm run lint
```
**Expected Output:**
- Exit code 0
- No error messages
- Warnings acceptable if documented

**Pass Criteria:** If ESLint is configured (stretch goal), all `.jsx` files pass linting with zero errors. Warnings documented in verification report.

**Note:** This gate is **optional** for minimum and target outcomes. Required only if stretch outcome was achieved.

---

## Human Verification Points

### Verification Point 1: Home Route Functionality
**Inspector Action:**
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:5173/`
3. Observe page content

**Verification Checklist:**
- [ ] Page loads without console errors (check browser DevTools Console)
- [ ] Page displays text "Home Page" or similar identifier in an `<h1>` element
- [ ] Navigation header/component visible at top of page
- [ ] Navigation contains links to "Home" and "Settings"
- [ ] Page includes welcome message or content specific to Home route
- [ ] No broken images or missing assets (404s in Network tab)

**Pass Criteria:** All checklist items confirmed. Page renders correctly and navigation is visible.

**Intent Traceability:** Maps to Intent "Minimum Viable Outcome" → "Home route (/) renders a distinct page with text 'Home Page' or similar identifier"

---

### Verification Point 2: Settings Route Functionality
**Inspector Action:**
1. In browser at `http://localhost:5173/`, click "Settings" link in navigation
2. Alternatively, navigate directly to `http://localhost:5173/settings`
3. Observe page content

**Verification Checklist:**
- [ ] URL changes to `/settings` in address bar
- [ ] Page displays text "Settings Page" or similar identifier in an `<h1>` element
- [ ] Navigation component remains visible (persistent across routes)
- [ ] Page content distinct from Home page
- [ ] Browser back button returns to Home page
- [ ] No full-page reload occurs (SPA behavior preserved)

**Target Outcome Enhancement:**
- [ ] Settings page includes structured content (e.g., settings panels or sections)
- [ ] Component composition demonstrated (nested elements with semantic structure)

**Pass Criteria:** All minimum checklist items confirmed. Target outcome items assessed for target/stretch tier evaluation.

**Intent Traceability:** Maps to Intent "Minimum Viable Outcome" → "Settings route (/settings) renders a distinct page" and "Target Outcome" → "Settings page includes placeholder content that demonstrates component composition"

---

### Verification Point 3: Navigation Interaction
**Inspector Action:**
1. Start at Home route
2. Click Settings link
3. Click Home link
4. Manually enter `http://localhost:5173/settings` in address bar
5. Click browser back button

**Verification Checklist:**
- [ ] All navigation links are clickable
- [ ] Clicking navigation links changes route without page reload
- [ ] Active route is visually clear (user knows which page they're on)
- [ ] Direct URL navigation to `/` and `/settings` works
- [ ] Browser back/forward buttons work correctly
- [ ] No JavaScript errors in console during navigation

**Target Outcome Enhancement:**
- [ ] Navigation component styled as a header with clear visual hierarchy
- [ ] Links have hover states or visual feedback

**Pass Criteria:** All navigation mechanisms function correctly. No broken states or console errors.

**Intent Traceability:** Maps to Intent "Minimum Viable Outcome" → "Navigation between routes works via browser URL changes and UI controls"

---

### Verification Point 4: 404 Route Handling
**Inspector Action:**
1. Navigate to `http://localhost:5173/nonexistent-page`
2. Navigate to `http://localhost:5173/invalid/nested/route`
3. Observe behavior

**Verification Checklist:**
- [ ] Invalid routes display a 404 or "Page Not Found" message
- [ ] Navigation component still visible on 404 page
- [ ] User can navigate back to valid routes from 404 page
- [ ] No console errors or unhandled exceptions
- [ ] 404 page has semantic content (not blank or generic error)

**Pass Criteria:** Invalid routes handled gracefully with user-friendly 404 page. Required for **target outcome**.

**Intent Traceability:** Maps to Intent "Target Outcome" → "404/Not Found route handles invalid paths gracefully"

---

### Verification Point 5: Styling and Layout
**Inspector Action:**
1. View Home and Settings pages in browser
2. Open browser DevTools and inspect CSS
3. Resize browser window to mobile width (< 768px)
4. Observe layout behavior

**Verification Checklist:**
- [ ] Basic CSS applied (not unstyled HTML)
- [ ] Layout includes distinct visual regions (header/nav, content area)
- [ ] Typography is readable (not default browser serif)
- [ ] Spacing and padding applied to content
- [ ] Navigation visually distinct from page content
- [ ] Color scheme consistent across pages

**Target Outcome Enhancement:**
- [ ] Layout centered or constrained to readable width
- [ ] CSS demonstrates use of flexbox or grid for layout

**Stretch Outcome Enhancement:**
- [ ] Layout responsive on mobile (< 768px) and desktop (> 768px)
- [ ] Navigation adapts to mobile viewport (stacks or collapses)
- [ ] No horizontal scroll on narrow viewports

**Pass Criteria:** Application has intentional styling (not browser defaults). Layout demonstrates CSS structure. Responsive behavior assessed for stretch tier.

**Intent Traceability:** Maps to Intent "Target Outcome" → "Basic CSS applied to demonstrate layout" and "Stretch Outcome" → "Basic responsive layout that works on mobile and desktop viewports"

---

### Verification Point 6: README Documentation Quality
**Inspector Action:**
1. Open `README.md` in GitHub or text editor
2. Follow installation instructions in a fresh environment (or use mental walkthrough)
3. Verify completeness and clarity

**Verification Checklist:**
- [ ] Prerequisites section exists with Node.js version requirement
- [ ] Installation steps provided (clone, install commands)
- [ ] Dev server start command documented (`npm run dev` or similar)
- [ ] Expected outcome described (port, what to see in browser)
- [ ] README content is project-specific (not generic boilerplate)
- [ ] No broken markdown formatting

**Target Outcome Enhancement:**
- [ ] Project structure documented (directory tree or description)
- [ ] Architecture section explains build tool and routing choices
- [ ] Available npm scripts documented

**Stretch Outcome Enhancement:**
- [ ] Routes documented with descriptions
- [ ] Contributing guidelines or future roadmap mentioned

**Pass Criteria:** README enables a new contributor to run the application without external assistance. Target/stretch enhancements assessed for tier evaluation.

**Intent Traceability:** Maps to Intent "Minimum Viable Outcome" → "README.md updated with clear instructions" and "Target Outcome" → "README includes brief architecture description"

---

### Verification Point 7: Code Quality and Conventions
**Inspector Action:**
1. Review source code in `src/` directory
2. Check component structure and naming
3. Assess adherence to declared patterns

**Verification Checklist:**
- [ ] All React components are functional (no class components)
- [ ] Component files use PascalCase naming (`Home.jsx`, `Navigation.jsx`)
- [ ] Components in appropriate directories (`src/pages/` for routes, `src/components/` for reusable)
- [ ] Import statements follow convention (React/third-party, then internal)
- [ ] No unused variables or imports (no commented-out code blocks)
- [ ] CSS class names semantic and component-scoped
- [ ] JSX properly formatted and readable

**Stretch Outcome Enhancement:**
- [ ] ESLint configuration exists and passes
- [ ] Prettier configuration exists for consistent formatting
- [ ] Code follows established style guide (documented in config files)

**Pass Criteria:** Code demonstrates React best practices and follows patterns documented in Context Package. No obvious anti-patterns or code smells.

**Intent Traceability:** Maps to Intent "Constraints" → "Must follow standard React project conventions" and "Stretch Outcome" → "ESLint and Prettier configuration files present"

---

### Verification Point 8: Hot Module Replacement (HMR)
**Inspector Action:**
1. Start dev server: `npm run dev`
2. Open browser to running application
3. Edit `src/pages/Home.jsx` (change text content)
4. Save file
5. Observe browser behavior

**Verification Checklist:**
- [ ] Browser updates without full page reload
- [ ] Changes visible within 1-2 seconds of saving
- [ ] Console shows HMR update message (optional, Vite-specific)
- [ ] Application state preserved during update (if any state exists)
- [ ] No console errors during HMR update

**Pass Criteria:** HMR functions correctly. Developer can see changes immediately without manual browser refresh.

**Intent Traceability:** Maps to Intent "Constraints" → "Must support hot module replacement for development efficiency"

---

### Verification Point 9: Production Build Quality
**Inspector Action:**
1. Run production build: `npm run build`
2. Run preview server: `npm run preview`
3. Open browser to preview server URL
4. Test all routes and navigation

**Verification Checklist:**
- [ ] Production build completes successfully
- [ ] Preview server starts and serves built application
- [ ] All routes function identically to dev server
- [ ] Navigation works correctly in production build
- [ ] No console errors specific to production build
- [ ] Assets load correctly (no 404s in Network tab)

**Pass Criteria:** Production build produces a functional application identical in behavior to dev mode.

**Intent Traceability:** Maps to Intent "Constraints" → "Must use a standard, well-supported build tool" (validates build tooling works end-to-end)

---

## Intent Traceability

### Minimum Viable Outcome Coverage

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|----------------------|
| `npm install` completes without errors | Automated | Gate 1: Dependency Installation |
| Development server starts successfully with one command | Automated | Gate 2: Development Server Startup |
| Home route (/) renders a distinct page with text "Home Page" | Human | VP 1: Home Route Functionality |
| Settings route (/settings) renders a distinct page with text "Settings Page" | Human | VP 2: Settings Route Functionality |
| Navigation between routes works via browser URL changes and UI controls | Human | VP 3: Navigation Interaction |
| README.md updated with clear instructions: prerequisites, installation steps, how to start dev server | Human | VP 6: README Documentation Quality |

**Coverage Status:** 6/6 minimum criteria covered (100%)

---

### Target Outcome Coverage

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|----------------------|
| Navigation component/header visible on both pages with clickable links | Human | VP 1, VP 2: Navigation component presence |
| Basic CSS applied to demonstrate layout | Human | VP 5: Styling and Layout |
| Project structure follows community conventions (src/, components/, pages/ directories) | Automated + Human | Gate 4: File Structure + VP 7: Code Quality |
| README includes brief architecture description | Human | VP 6: Architecture section check |
| 404/Not Found route handles invalid paths gracefully | Human | VP 4: 404 Route Handling |

**Coverage Status:** 5/5 target criteria covered (100%)

---

### Stretch Outcome Coverage

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|----------------------|
| Settings page includes placeholder content demonstrating component composition | Human | VP 2: Settings component structure |
| Home page includes welcome message referencing project name | Human | VP 1: Home page content check |
| ESLint and Prettier configuration files present with sensible defaults | Automated (optional) + Human | Gate 8: ESLint (optional) + VP 7: Config file presence |
| Package.json includes scripts for common tasks (dev, build, lint) | Automated | Gate 7: Package.json validation |
| Basic responsive layout that works on mobile and desktop viewports | Human | VP 5: Responsive behavior |

**Coverage Status:** 5/5 stretch criteria covered (100%)

---

### Constraint Validation

| Constraint | Verification Method | Gate/Point Reference |
|-----------|---------------------|----------------------|
| Must use React 18+ | Automated | Gate 7: Package.json dependency check |
| Must use standard build tool (Vite, CRA, Next.js) | Automated | Gate 2, 3: Build and dev server functionality |
| Must use React Router v6+ | Automated | Gate 7: Package.json dependency check |
| Must use npm or yarn (documented) | Human | VP 6: README specifies package manager |
| Client-side rendered (no SSR) | Human | VP 9: Production build serves static files |
| No unused dependencies or boilerplate files | Automated + Human | Gate 4: File structure + VP 7: Code review |
| Functional components with hooks (no class components) | Human | VP 7: Code quality check |
| Must work on Node.js LTS (18.x or 20.x) | Automated | Gate 1: Installation with Node LTS |
| Must start with single command | Automated | Gate 2: `npm run dev` starts server |
| Must support hot module replacement | Human | VP 8: HMR functionality |

**Coverage Status:** 10/10 constraints validated (100%)

---

### Non-Goal Verification (Scope Compliance)

The following should **NOT** be present in the delivered orbit:

- [ ] **No API integration or data fetching** — VP 7: Code review confirms no fetch/axios calls
- [ ] **No testing infrastructure** — Gate 4: No test files (`.test.jsx`, `.spec.jsx`) present
- [ ] **No CI/CD configuration** — Gate 4: No `.github/workflows/`, `.gitlab-ci.yml`, etc.
- [ ] **No deployment configuration** — Gate 4: No `netlify.toml`, `vercel.json`, Docker files
- [ ] **No authentication/authorization** — VP 7: Code review confirms no auth logic
- [ ] **No backend services** — Gate 4: No `server/`, `api/`, or backend code

**Pass Criteria:** None of the non-goals are present. Orbit remains focused on frontend foundation only.

---

## Escape Criteria

### Re-Orbit Conditions

The orbit must be re-executed if any of the following conditions occur:

**Critical Failure (Immediate Re-Orbit Required):**
- Gate 1 (Dependency Installation) fails — dependencies cannot be installed
- Gate 2 (Development Server Startup) fails — server does not start
- VP 1 or VP 2 (Route Functionality) fails — core routes do not render
- VP 3 (Navigation Interaction) fails — routing is broken

**Action:** Reset repository to pre-orbit state. Re-execute implementation plan from Phase 1. Document root cause and mitigation in Proposal modifications.

---

**Major Failure (Re-Orbit After Mitigation Attempt):**
- Gate 3 (Build Success) fails — production build broken
- Gate 4 (File Structure Compliance) fails — wrong directory structure
- Gate 6 (Git Ignore Verification) fails — build artifacts committed
- VP 6 (README Documentation) fails — installation instructions incorrect

**Action:** 
1. Attempt targeted fix within current orbit (1-2 hour window)
2. If fix unsuccessful or introduces new failures, re-orbit
3. Document issue in verification report
4. Update Proposal with corrected implementation steps

---

**Minor Failure (Fix in Place, No Re-Orbit):**
- Gate 5 (Dependency Audit) shows moderate vulnerabilities — document and accept risk or patch
- Gate 8 (ESLint) fails (stretch goal only) — ESLint is optional, failure does not block orbit completion
- VP 5 (Styling) partially fails — basic CSS present but not polished, acceptable for minimum outcome
- VP 7 (Code Quality) has minor issues — small refactoring acceptable without re-orbit

**Action:**
1. Document findings in verification report
2. Apply fixes directly if impact is isolated (< 30 minutes)
3. Create follow-up orbit for non-critical improvements if needed
4. Orbit can proceed to completion with documented deviations

---

### Escalation Triggers

**Escalate to Human Review (Trust Tier 2 Requirement):**
- Any critical or major failure occurs during automated gates
- Architectural decisions in implementation deviate from Proposal (build tool choice, routing pattern)
- Scope creep detected (features added beyond intent constraints)
- Time estimate exceeded by >50% (indicates misunderstanding or technical blocker)

**Escalation Process:**
1. Halt orbit execution
2. Generate verification report with failure details
3. Request human review via ORBITAL control plane
4. Await approval to re-orbit or proceed with modifications

---

**Escalate to Project Lead:**
- Re-orbit required more than once for same orbit
- Fundamental architectural issue discovered that affects trajectory viability
- External dependency failure (npm registry unavailable, Node.js compatibility issue)
- Security vulnerability (high/critical) discovered in required dependencies

**Escalation Process:**
1. Document issue with technical details and impact assessment
2. Propose alternative approaches or trajectory modifications
3. Request project lead decision on orbit continuation or trajectory pivot

---

### Rollback Procedures

**Scenario 1: Orbit Fails Verification, Repository State Unclear**

**Procedure:**
1. Create rollback branch: `git checkout -b rollback/orbit-1`
2. Reset to pre-orbit commit: `git reset --hard <pre-orbit-sha>`
3. Verify clean state: `npm install && npm run dev` (should fail or show pre-orbit state)
4. Document rollback in orbit log
5. Re-orbit from clean state

**Verification:** Repository matches state before orbit began. No orphaned files or configuration.

---

**Scenario 2: Partial Success, Some Components Functional**

**Procedure:**
1. Identify working components via verification point testing
2. Create preservation branch: `git checkout -b preserve/orbit-1-partial`
3. Cherry-pick successful commits to new implementation branch
4. Re-implement failed components
5. Run full verification protocol on integrated result

**Verification:** All verification points pass on final integrated branch.

---

**Scenario 3: Dependency Conflict Blocks Progress**

**Procedure:**
1. Document conflicting dependencies and error messages
2. Check if issue is environmental (Node version, npm cache)
3. Clear cache: `npm cache clean --force`
4. Remove lock file: `rm package-lock.json`
5. Retry installation: `npm install`
6. If persistent, escalate to project lead for dependency substitution approval

**Verification:** Gate 1 (Dependency Installation) passes after mitigation.

---

### Success Criteria Summary

**Orbit Succeeds If:**
- All automated gates (1-7) pass (Gate 8 optional for stretch)
- All minimum viable outcome verification points (VP 1-3, VP 6 minimum criteria) pass
- At least 4 of 5 target outcome criteria pass
- No critical failures or unresolved major failures
- README tested and confirmed functional by human reviewer
- Code merged to main branch after human approval (Trust Tier 2)

**Orbit Outcome Tiers:**
- **Minimum:** Gates 1-6 pass + VP 1, 2, 3, 6 (minimum) pass
- **Target:** Minimum + VP 4, 5, 6 (target), 7 pass
- **Stretch:** Target + VP 2 (stretch), 5 (stretch), 6 (stretch), 7 (stretch), Gate 8 pass

**Final Approval:** Human reviewer signs off on verification report. Orbit marked complete in ORBITAL system.