# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit initializes a minimal Three.js project from scratch with zero framework overhead. The goal is to produce a working 3D scene that a developer can run in under 30 seconds after cloning, demonstrating core Three.js capabilities (geometry, materials, lighting, camera controls) without abstraction layers.

**Core Requirements Understood:**
- Create exactly 3 new files: `index.html`, `src/main.js`, `src/style.css` (the existing `package.json` is already compliant)
- `src/main.js` must be ≤ 100 lines total, including whitespace
- Use Vite's zero-config mode — no `vite.config.js` or custom plugins
- Import Three.js core and OrbitControls addon using ES6 module syntax with correct 0.160.0+ paths
- Render a single rotating cube with `MeshStandardMaterial` (requires lighting to be visible)
- Enable mouse-drag camera controls via OrbitControls
- Canvas must fill 100% of viewport with no scrollbars (requires precise CSS reset)
- Scene background must be dark blue-gray (`0x1a1a2e`)
- Handle window resize without distorting cube aspect ratio

**Key Constraints Acknowledged:**
- No TypeScript, no frameworks, no build config files
- No shadows, post-processing, or GUI controls (keep it minimal)
- Animation loop must use `requestAnimationFrame` (not timers)
- OrbitControls import path must use `/examples/jsm/` (not deprecated `/examples/js/`)

**Success Criteria Interpreted:**
- Visual confirmation: cube rotates smoothly, responds to mouse drag, maintains aspect ratio on resize
- Technical confirmation: zero console errors, ≤ 100 lines in `main.js`, 4 files total
- Performance confirmation: maintains ≥ 55fps on reference hardware

## Implementation Plan

### Phase 1: File Creation and Directory Structure

**Step 1.1: Create `src/` Directory**
- Check if `./src/` exists using filesystem API
- If not present, create directory before writing JS/CSS files
- **Risk Mitigation:** Attempting to write `src/main.js` before directory exists will fail with ENOENT error

**Step 1.2: Validate Existing `package.json`**
- Read `./package.json` and parse JSON
- Verify presence of required fields:
  - `"type": "module"` (enables ES6 imports)
  - `"scripts.dev": "vite"` (dev command)
  - `"dependencies.three": "^0.160.0"` (Three.js core)
  - `"devDependencies.vite": "^5.0.0"` (build tool)
- **Decision Point:** Context Package confirms existing `package.json` is compliant — no modifications needed
- **Action:** Skip `package.json` write operation to avoid unnecessary file system mutation

### Phase 2: HTML Entry Point Implementation

**File:** `./index.html`

**Implementation Strategy:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Starter</title>
  <link rel="stylesheet" href="/src/style.css">
</head>
<body>
  <canvas id="app"></canvas>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Key Decisions:**
- Use `<canvas id="app">` as explicit mount point (not renderer auto-creation) for CSS control
- Link CSS before script to ensure styles load before Three.js initializes
- Use `type="module"` on script tag to enable ES6 imports in browser context
- Path `/src/style.css` resolves correctly via Vite's dev server (serves from project root)

**Dependencies:**
- None — this is the entry point that Vite discovers automatically

### Phase 3: CSS Reset and Viewport Styling

**File:** `./src/style.css`

**Implementation Strategy:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

#app {
  display: block;
  width: 100%;
  height: 100%;
}
```

**Key Decisions:**
- Universal selector reset (`*`) removes default browser margins/padding (especially critical for `<body>`'s 8px margin)
- `overflow: hidden` on `html, body` prevents scrollbars from appearing if content overflows
- `display: block` on canvas eliminates 4px inline-element descender space
- `width: 100%; height: 100%` chain ensures canvas fills viewport without gaps
- Total lines: 15 (well within budget, no optimization needed)

**Validation Logic:**
After implementation, visual inspection will confirm:
- No horizontal scrollbar at any viewport width
- No vertical scrollbar at any viewport height
- Canvas edges touch viewport edges with no gaps

### Phase 4: Three.js Scene Implementation

**File:** `./src/main.js`

**Implementation Strategy (Estimated 45-50 lines):**

**Section 1: Imports (2 lines)**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```
- **Critical Path Decision:** Use `/examples/jsm/` path (not deprecated `/examples/js/`)
- **Risk Mitigation:** `.js` extension is required for Vite module resolution

**Section 2: Scene and Camera Setup (5 lines)**
```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```
- **FOV Choice:** 75° provides standard perspective (within Intent's 45-75° acceptable range)
- **Camera Distance:** Z=5 frames cube with margin (cube is 1x1x1 at origin)
- **Background Color:** `0x1a1a2e` matches Intent requirement exactly

**Section 3: Renderer Setup (3 lines)**
```javascript
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#app') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
```
- **Canvas Mount:** Attach to existing `#app` element (not auto-create)
- **Pixel Ratio:** Respects device pixel density (prevents blurriness on retina displays)

**Section 4: Geometry and Material (4 lines)**
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```
- **Material Choice:** `MeshStandardMaterial` (not Basic) per Intent requirement
- **Color:** Bright green (`0x00ff00`) for visibility against dark background
- **Dimensions:** 1x1x1 cube fits camera FOV at Z=5

**Section 5: Lighting (4 lines)**
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```
- **Ambient Light:** Intensity 0.5 provides base illumination (prevents black faces)
- **Directional Light:** Intensity 0.5 at (5,5,5) creates visible shading gradient
- **Risk Mitigation:** Two lights required for MeshStandardMaterial to show depth

**Section 6: OrbitControls (2 lines)**
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
```
- **Damping Enabled:** Provides smooth camera movement (better UX)
- **Requires `controls.update()` in animation loop** (documented in next section)

**Section 7: Animation Loop (7 lines)**
```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
```
- **Rotation Speed:** 0.01 radians/frame ≈ 0.57°/frame at 60fps (visible but not dizzying)
- **Both Axes:** Rotates on X and Y simultaneously per Intent requirement
- **Control Update:** Required for damping to work (Context Risk #2 mitigation)

**Section 8: Resize Handler (5 lines)**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```
- **Aspect Ratio Update:** Prevents cube distortion on window resize
- **Projection Matrix:** MUST be updated after changing `camera.aspect` (Context Risk #4 mitigation)

**Total Line Count Calculation:**
- Imports: 2
- Scene setup: 5
- Renderer: 3
- Geometry/Material: 4
- Lighting: 5
- Controls: 2
- Animation loop: 7
- Resize handler: 5
- **Grand Total: 33 lines** (well within 100-line constraint)

**Whitespace Strategy:**
- Add 1 blank line between logical sections (8 sections = 7 blank lines)
- **Adjusted Total: 40 lines** (still 60% under budget)

### Phase 5: Execution Order and Dependencies

**File Write Sequence:**
1. Create `src/` directory (if not exists)
2. Write `./index.html` (no dependencies)
3. Write `./src/style.css` (no dependencies)
4. Write `./src/main.js` (depends on HTML structure for `#app` query)

**Runtime Initialization Sequence (within `main.js`):**
1. Import modules (Three.js core, OrbitControls)
2. Initialize scene and set background
3. Create camera with aspect ratio
4. Create renderer attached to `#app` canvas
5. Create geometry + material → mesh → add to scene
6. Add lights to scene (BEFORE first render)
7. Initialize OrbitControls (AFTER renderer exists)
8. Start animation loop
9. Register resize event listener

**Critical Ordering Dependencies:**
- Lights must be added to scene before first `renderer.render()` call (else cube renders black)
- OrbitControls requires `renderer.domElement` (must instantiate renderer first)
- Resize handler must call `camera.updateProjectionMatrix()` after updating aspect ratio

## Risk Surface

### Risk 1: OrbitControls Import Path Failure
**Probability:** Low (mitigated by Context Package research)  
**Impact:** High (scene renders but controls don't work, console errors)

**Root Cause:**  
Three.js 0.160.0+ changed addon paths from `/examples/js/` to `/examples/jsm/`.

**Mitigation Applied:**
- Use exact path: `three/examples/jsm/controls/OrbitControls.js`
- Include `.js` extension (required for Vite's ES module resolution)
- Cross-reference against Three.js 0.160.0 official documentation

**Detection Method:**
- Browser console will show `ERR_MODULE_NOT_FOUND` if path is incorrect
- Visual test: mouse drag should rotate camera (no console errors)

**Rollback Plan:**
If import fails, fallback to inline controls implementation (adds ~10 lines to `main.js`).

---

### Risk 2: CSS Reset Incomplete — Scrollbars Appear
**Probability:** Low (pattern well-established in Context)  
**Impact:** Medium (violates acceptance criterion, obvious visual defect)

**Root Cause:**
Browser default styles (8px body margin, inline canvas descender space, overflow behavior).

**Mitigation Applied:**
- Universal selector reset: `* { margin: 0; padding: 0; }`
- Explicit overflow control: `overflow: hidden` on `html, body`
- Canvas display override: `display: block` on `#app`
- Full-height chain: `width: 100%; height: 100%` on `html`, `body`, `#app`

**Detection Method:**
- Visual inspection: open in browser, check for any scrollbars
- Resize window to various dimensions (scrollbars should never appear)
- Test in Chrome, Firefox, Safari (different default margins)

**Rollback Plan:**
If scrollbars appear, add `position: fixed; top: 0; left: 0;` to `#app` (less ideal but guaranteed full-viewport).

---

### Risk 3: MeshStandardMaterial Renders Black
**Probability:** Low (lights explicitly added before render)  
**Impact:** High (cube invisible, looks like render failure)

**Root Cause:**
`MeshStandardMaterial` requires lights to be visible (unlike `MeshBasicMaterial`).

**Mitigation Applied:**
- Add `AmbientLight` at intensity 0.5 (uniform base illumination)
- Add `DirectionalLight` at intensity 0.5, position (5,5,5) (creates shading gradient)
- Both lights added to scene BEFORE calling `animate()` function

**Detection Method:**
- Visual inspection: cube should show color gradient from light to dark faces
- If cube is solid black silhouette, lights are missing or misconfigured

**Rollback Plan:**
If lights fail, temporarily switch to `MeshBasicMaterial` for debugging (ignores lights, always visible).

---

### Risk 4: Line Count Exceeds 100 Lines
**Probability:** Very Low (current estimate: 40 lines)  
**Impact:** Low (violates code quality gate)

**Root Cause:**
Verbose coding style, comments, helper functions, excessive whitespace.

**Mitigation Applied:**
- No inline comments (code is self-documenting)
- No helper functions (all logic inlined)
- Minimal whitespace (1 blank line between sections only)
- Compact initialization (multiple operations per line where readable)

**Current Line Budget:**
- Implementation: 33 lines
- Whitespace (section breaks): 7 lines
- **Total: 40 lines (60% headroom)**

**Detection Method:**
Automated line count: `wc -l src/main.js` must return ≤ 100.

**Rollback Plan:**
If approaching limit, remove whitespace between sections (reduces to 33 lines).

---

### Risk 5: Window Resize Distorts Cube Aspect Ratio
**Probability:** Very Low (resize handler includes projection matrix update)  
**Impact:** High (obvious visual defect on resize)

**Root Cause:**
Forgetting to call `camera.updateProjectionMatrix()` after changing `camera.aspect`.

**Mitigation Applied:**
- Resize event listener updates `camera.aspect` to new window ratio
- **Critical line:** `camera.updateProjectionMatrix()` called immediately after aspect change
- Renderer size updated to match new window dimensions

**Detection Method:**
- Resize browser window (drag corner, maximize, restore)
- Cube should remain a perfect cube (not stretched into rectangle)

**Rollback Plan:**
If distortion occurs, verify projection matrix update is present and sequenced correctly.

---

### Risk 6: Controls Feel "Sticky" or Unresponsive
**Probability:** Low (damping enabled + update called in loop)  
**Impact:** Medium (degrades UX, violates "smooth interaction" requirement)

**Root Cause:**
Missing `controls.update()` in animation loop (required when damping is enabled).

**Mitigation Applied:**
- Set `controls.enableDamping = true` explicitly
- Call `controls.update()` in animation loop BEFORE `renderer.render()`

**Detection Method:**
- Manual testing: drag mouse to rotate camera
- Camera movement should be smooth, not jerky or delayed

**Rollback Plan:**
If controls feel sticky, verify `controls.update()` is present in loop and sequenced before render.

---

### Risk 7: Vite Dev Server Fails to Start
**Probability:** Very Low (dependencies already installed, package.json compliant)  
**Impact:** Medium (blocks testing, does not affect production)

**Root Cause:**
- Port 5173 already in use (Vite will auto-increment)
- Missing `node_modules/` (requires `npm install`)
- Node.js version < 18.0.0 (Vite 5.x requirement)

**Mitigation Applied:**
- `package.json` already exists with correct dependencies
- `"engines.node": ">=18.0.0"` enforces runtime requirement
- Vite handles port conflicts automatically (increments to 5174, 5175, etc.)

**Detection Method:**
- Run `npm run dev` and verify terminal output shows `Local: http://localhost:5173`
- Browser should open to dev server (or user navigates manually)

**Rollback Plan:**
If server fails to start, check Node.js version (`node --version`) and run `npm install` if `node_modules/` is missing.

## Scope Estimate

### Orbit Count: 1
This is a single-orbit implementation. All 3 files can be generated in one execution phase with no intermediate review gates.

### Complexity Assessment: Low
- **Codebase Surface:** 3 new files, 0 modifications (existing `package.json` is compliant)
- **Line Count:** ~40 lines JS, ~15 lines CSS, ~12 lines HTML = ~67 total lines
- **External Dependencies:** 2 (Three.js, Vite) — both already declared in `package.json`
- **Integration Points:** 1 (Vite dev server → HTML → JS imports → Three.js)
- **Risk Surface:** 7 identified risks, all with concrete mitigations

**Rationale for Low Complexity:**
- No existing code to refactor or preserve
- No API contracts to maintain
- No database migrations or data transformations
- No multi-service coordination
- Deterministic execution (no async operations, no network requests)

### Work Phases

**Phase 1: File Generation (Estimated: 30 seconds)**
- Create `src/` directory
- Write `index.html` (12 lines)
- Write `src/style.css` (15 lines)
- Write `src/main.js` (40 lines)
- Total: 67 lines across 3 files

**Phase 2: Dependency Installation (Estimated: 20-60 seconds)**
- User runs `npm install` (downloads Three.js + Vite from npm registry)
- ~50MB download (Three.js ~15MB, Vite ~35MB with dependencies)
- Speed depends on network latency

**Phase 3: Dev Server Startup (Estimated: 2-5 seconds)**
- User runs `npm run dev`
- Vite starts dev server on port 5173
- Browser opens to `http://localhost:5173`

**Phase 4: Visual Validation (Estimated: 10-15 seconds)**
- Human observer confirms:
  - Rotating cube visible
  - Mouse drag rotates camera
  - Window resize maintains aspect ratio
  - No console errors
  - No scrollbars

**Total Time Budget:**
- Generation: 30 seconds
- Install: 60 seconds (first-time)
- Startup + validation: 20 seconds
- **End-to-End: ~110 seconds (~2 minutes)**

**Acceptance Criterion Alignment:**
Intent requires "cube visible within 2 seconds of `npm run dev`" — Vite's dev server startup (~2-5 seconds) meets this threshold. First-time `npm install` is excluded from the 2-second timer (standard practice for dependency setup).

### Resource Requirements

**Compute:**
- File generation: Negligible (< 1MB memory, < 1 second CPU)
- Vite dev server: ~100MB RAM, minimal CPU (serves static files)
- Browser rendering: ~50-100MB RAM, GPU-accelerated (WebGL context)

**Storage:**
- Generated files: ~2KB total (HTML + CSS + JS)
- Dependencies: ~50MB (node_modules/ after npm install)

**Network:**
- Dependency download: ~50MB (one-time, cached locally)
- Dev server: No external requests (localhost only)

### Confidence Level: High

**Success Indicators:**
- All 4 files exist in repository after generation
- `wc -l src/main.js` returns ≤ 100
- `npm run dev` starts without errors
- Browser renders rotating cube with interactive camera controls
- Zero console errors during 60 seconds of operation

**Failure Modes (Low Probability):**
- Import path typo (caught by browser console)
- CSS reset incomplete (caught by visual inspection)
- Line count exceeds budget (caught by automated check)

All failure modes have concrete detection methods and rollback plans documented in Risk Surface section.

## Human Modifications

Pending human review.