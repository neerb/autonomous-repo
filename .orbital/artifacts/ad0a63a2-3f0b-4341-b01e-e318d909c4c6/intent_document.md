# Three.js Minimal Starter Project

## Desired Outcome

A developer can clone this repository, run `npm install && npm run dev`, and immediately see a rotating 3D cube in their browser with working mouse controls. The project serves as a reference implementation for starting new Three.js experiments without framework overhead — a 5-minute path from empty directory to working 3D scene.

When complete, the project demonstrates:
- Instant feedback loop (Vite hot reload under 100ms)
- Zero configuration required — works out of the box
- Clear separation between HTML structure, visual styles, and 3D scene logic
- Responsive viewport that adapts to browser resize without manual intervention
- Interactive camera controls that feel natural to users familiar with 3D software

This becomes the template for rapid prototyping of 3D visualizations, learning exercises, and proof-of-concept demonstrations where setup friction is the primary barrier to starting work.

## Constraints

**Technology Boundaries:**
- Vanilla JavaScript only — no transpilation, no JSX, no TypeScript
- Three.js version ^0.160.0 or later
- Vite as build tool — no webpack, parcel, or custom bundlers
- Node.js >=18.0.0 (ESM native support required)

**Code Volume:**
- `src/main.js` must remain under 100 lines total (including imports and whitespace)
- No code splitting or multiple JavaScript modules
- Single CSS file for all styling

**Architecture Restrictions:**
- No UI frameworks (React, Vue, Svelte, Angular)
- No state management libraries
- No CSS preprocessors or utility frameworks (Sass, Tailwind, etc.)
- No additional Three.js addons beyond OrbitControls (no postprocessing, loaders, or helpers)

**Visual Specifications:**
- Canvas background color: `0x1a1a2e` (dark blue-grey)
- Cube material: MeshStandardMaterial (requires lighting to be visible)
- Lighting: Exactly one AmbientLight and one DirectionalLight
- Rotation: Continuous on both X and Y axes
- Viewport: Full browser window (100vw × 100vh) with no scrollbars

**Non-Goals:**
- Production optimization (minification, tree-shaking tuning, asset optimization)
- Cross-browser compatibility testing beyond modern evergreen browsers
- Mobile touch controls or responsive breakpoints
- Accessibility enhancements (ARIA labels, keyboard navigation)
- Loading states, error boundaries, or progressive enhancement

## Acceptance Boundaries

**Functional Completeness:**
- ✅ **Full Success:** All scene elements render on first load; cube rotates smoothly at 60fps; OrbitControls respond within 16ms of mouse input; window resize triggers canvas dimension update without page refresh
- ⚠️ **Acceptable:** Cube visible and rotating; controls functional but may feel slightly laggy on 4K displays; resize requires manual page refresh
- ❌ **Insufficient:** Cube not visible, controls unresponsive, or console errors on page load

**Code Quality:**
- ✅ **Full Success:** `src/main.js` is 80–100 lines; every line serves a clear purpose; variable names are semantic (camera, scene, renderer, not a, b, c); comments explain "why" not "what"
- ⚠️ **Acceptable:** 100–120 lines with minor redundancy; variable names are clear; minimal comments
- ❌ **Insufficient:** Over 120 lines, unclear naming, or missing critical setup steps

**Developer Experience:**
- ✅ **Full Success:** `npm install` completes in under 30 seconds on broadband; `npm run dev` starts server in under 2 seconds; Vite displays "ready" message with localhost URL; hot reload works for CSS and JS changes
- ⚠️ **Acceptable:** Install or startup takes up to 60 seconds; hot reload works for CSS but requires manual refresh for JS
- ❌ **Insufficient:** Install fails, dev server doesn't start, or Vite errors prevent hot reload

**Visual Correctness:**
- ✅ **Full Success:** Cube is centered in viewport; lighting reveals cube faces with clear depth perception; background is dark blue-grey; no white flashes or FOUC (flash of unstyled content)
- ⚠️ **Acceptable:** Cube visible but slightly off-center; lighting functional but flat; background correct
- ❌ **Insufficient:** Cube not centered, lighting absent (cube appears black), or wrong background color

**Performance:**
- ✅ **Full Success:** Maintains 60fps on a 2019 MacBook Pro (or equivalent); frame time under 16.67ms; no memory leaks after 5 minutes of interaction
- ⚠️ **Acceptable:** Drops to 50–55fps during rapid camera movement; frame time occasionally spikes to 20ms
- ❌ **Insufficient:** Sustained below 45fps or visible stuttering during rotation

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit creates a new project from scratch with no existing codebase integration risk. The scope is deliberately minimal (4 files, under 200 total lines) and the technology stack is stable and well-documented. However, Tier 2 is appropriate because:

1. **Low but Non-Zero Blast Radius:** This becomes a template that future work may build upon. Errors in project structure (incorrect Vite config, wrong Three.js import paths) could waste time if propagated to derived projects.

2. **Educational Use Case:** If used as a learning resource, mistakes in lighting setup or camera positioning could teach incorrect patterns to developers new to Three.js.

3. **Single Verification Point:** The artifact is binary — it either runs or doesn't — with no iterative refinement path. Human review ensures the output matches expectations before it becomes a reference implementation.

4. **No Data or Security Risk:** No persistence layer, no user data, no authentication, no external API calls. Pure rendering logic.

A human should verify that (a) the dev server starts successfully, (b) the cube is visible and rotating, (c) OrbitControls work as expected, and (d) the code is clean enough to serve as a teaching example. This review takes under 2 minutes but prevents low-quality artifacts from becoming templates.

## Dependencies

**External Dependencies:**
- `three` (NPM package) — Provides core 3D rendering library and OrbitControls
- `vite` (NPM package) — Development server and module bundler
- Node.js runtime (>=18.0.0) — Required for ESM support and Vite execution

**Development Environment Requirements:**
- NPM or Yarn package manager
- Modern browser with WebGL 2.0 support (Chrome 56+, Firefox 51+, Safari 15+)
- Local filesystem write permissions for `node_modules` and Vite cache

**No Internal Dependencies:**
- This is the first orbit in a new trajectory
- No prior artifacts to reference
- No existing codebase to integrate with
- Repository starts empty except for potential `.git` and `.gitignore`

**Implicit Knowledge Dependencies:**
- Understanding that Vite expects `index.html` at project root (not inside `src/`)
- Knowing that Three.js OrbitControls must be imported from `three/examples/jsm/controls/OrbitControls.js`
- Awareness that `requestAnimationFrame` is the idiomatic way to drive Three.js render loops (not `setInterval`)