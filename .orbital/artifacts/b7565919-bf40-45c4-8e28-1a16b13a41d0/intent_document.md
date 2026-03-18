# Three.js Minimal Starter Project

## Desired Outcome

Developers can immediately start building 3D web experiences by cloning this repository and running a single command (`npm run dev`). The project demonstrates core Three.js concepts (scene, camera, lighting, geometry, materials, controls) through a working example that renders in under 2 seconds on modern browsers. The codebase serves as a learning reference that new developers can understand in one read-through, with no framework abstractions or build complexity obscuring the fundamentals.

## Constraints

**Technology Boundaries:**
- Vite as the only build tool — no webpack, rollup, or custom bundlers
- Vanilla JavaScript (ES6+) only — no TypeScript, JSX, or transpilation beyond Vite defaults
- Three.js as the sole runtime dependency — no helper libraries, UI frameworks, or utility packages
- OrbitControls from Three.js examples — no custom camera control implementations

**Code Size Limits:**
- `src/main.js` must remain under 100 lines including comments
- Total project size (excluding node_modules) must not exceed 10KB
- No code splitting or lazy loading — single entry point only

**Visual Requirements:**
- Canvas must fill 100% of viewport with no scrollbars or overflow
- Background color must be dark (`0x1a1a2e` or similar dark hex)
- Scene must be visible immediately on load with no loading states or spinners
- Animation must run at 60fps on devices capable of hardware acceleration

**Architecture Restrictions:**
- No global state management patterns — all variables scoped to module or function
- No class-based architecture — functional programming patterns only
- No external asset loading (textures, models, fonts) — procedural geometry only
- No build-time code generation or preprocessor macros

**Non-Goals:**
- Production optimization (tree-shaking, minification) beyond Vite defaults
- Cross-browser support for IE11 or legacy browsers
- Mobile-specific touch controls or responsive breakpoints
- Accessibility features (ARIA, keyboard navigation, screen reader support)
- Error handling or fallback for WebGL unavailability

## Acceptance Boundaries

**Functional Completeness:**
- ✅ Mandatory: Running `npm install && npm run dev` opens a browser window showing a rotating cube
- ✅ Mandatory: Mouse drag rotates camera view around the cube (OrbitControls)
- ✅ Mandatory: Window resize maintains full-viewport canvas without distortion
- ✅ Mandatory: Cube rotates continuously on both X and Y axes without user input
- ⚠️ Acceptable: Animation frame drops below 60fps on low-end hardware if WebGL renderer is functional

**Code Quality:**
- ✅ Mandatory: `src/main.js` is under 100 lines (blank lines and comments excluded from count)
- ✅ Mandatory: No ESLint errors with standard ES6+ rules
- ✅ Mandatory: All imported Three.js modules are from the installed `three` package (no CDN links)
- ⚠️ Acceptable: Inline comments are minimal — code readability through naming is preferred over documentation

**Visual Standards:**
- ✅ Mandatory: Cube is centered in viewport on initial load
- ✅ Mandatory: Lighting makes cube faces distinguishable (no pure silhouette)
- ✅ Mandatory: Canvas has no white borders, margins, or padding
- ⚠️ Acceptable: Cube material uses Three.js default parameters if they produce visible contrast
- ❌ Unacceptable: Scene is empty, black screen with no visible geometry

**Dependency Integrity:**
- ✅ Mandatory: `package.json` specifies exact or caret ranges for `three` and `vite`
- ✅ Mandatory: `npm install` completes without peer dependency warnings
- ✅ Mandatory: Node.js version requirement documented in `package.json` engines field
- ⚠️ Acceptable: Three.js version is not the absolute latest if a stable release from the last 3 months is used

**Project Structure:**
- ✅ Mandatory: Exactly 4 files in repository root or src: `index.html`, `package.json`, `src/main.js`, `src/style.css`
- ✅ Mandatory: `index.html` loads `src/main.js` as ES module
- ✅ Mandatory: `src/style.css` referenced in `index.html` with proper MIME type handling
- ❌ Unacceptable: Additional configuration files beyond Vite defaults (`.eslintrc`, `tsconfig.json`, etc.)

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit qualifies for Tier 2 due to moderate blast radius within a bounded greenfield context:

- **Low Architectural Risk:** No existing codebase to destabilize — this is a net-new project with no integration points
- **Constrained Scope:** Hard limits on file count (<5 files) and line count (<100 lines) naturally bound the solution space
- **Deterministic Requirements:** Acceptance criteria are objectively measurable (file count, line count, rendering behavior)
- **Standard Technology Stack:** Vite and Three.js are industry-standard tools with well-known behavior patterns

However, Tier 1 (Autonomous) is inappropriate because:

- **Visual Verification Required:** The "rotating cube with correct lighting" requirement cannot be validated through static code analysis alone — human visual inspection confirms the scene renders as intended
- **Greenfield Unknowns:** Without an existing codebase to reference, the AI must make subjective decisions about camera positioning, rotation speed, and lighting intensity that affect user experience
- **Dependency Version Selection:** Choosing compatible versions of Three.js and Vite requires understanding of ecosystem stability that may require human judgment

Tier 3 (Gated) is excessive because:

- **Isolated Blast Radius:** Failure cannot corrupt data, break production services, or affect other systems
- **Reversible Changes:** All changes are git-committable file creations with no destructive operations
- **Low Stakes:** This is a learning starter project, not a production application with user traffic

## Dependencies

**External Dependencies:**
- Three.js library (latest stable version from npm registry)
- Vite development server (v5.x or compatible)
- Node.js runtime (≥18.0.0) with npm package manager
- Modern browser with WebGL 1.0 support (Chrome 90+, Firefox 88+, Safari 15+, Edge 90+)

**Prior Orbit Dependencies:**
- None — this is an independent greenfield project with no trajectory history

**Environmental Requirements:**
- Git repository initialized at project root (for version control of the 4 files)
- Local filesystem write permissions for `npm install` to create `node_modules/`
- Network access to npm registry for dependency installation
- Available port 5173 (Vite default) or auto-assigned alternative for dev server

**Assumed Knowledge:**
- User has Node.js and npm already installed on their development machine
- User understands how to run `npm install` and `npm run dev` in a terminal
- User has a modern browser installed for viewing the dev server output