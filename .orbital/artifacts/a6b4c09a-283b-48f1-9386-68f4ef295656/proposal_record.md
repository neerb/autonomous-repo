# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit validates and potentially regenerates the Three.js starter project implementation files to ensure strict compliance with the Intent Document's acceptance boundaries. Based on Context Package analysis, orbit c71c2625 previously generated all 4 required files (`package.json`, `index.html`, `src/main.js`, `src/style.css`), but this orbit (a6b4c09a) is running again, indicating potential non-compliance issues.

**Core Objective:**
Create a minimal, functional Three.js demonstration that a developer can clone and run in under 30 seconds, seeing a rotating 3D cube with interactive camera controls. The implementation must be so simple that it serves as a learning reference, not a production framework.

**Critical Success Factors:**
- **Zero Configuration Beyond package.json:** Leverage Vite's defaults completely — no `vite.config.js`, no build scripts, no custom plugins
- **Extreme Code Economy:** Stay well under 100 lines in `src/main.js` (current target: ~40 lines for 60% headroom)
- **Pixel-Perfect Viewport Coverage:** No scrollbars at any window size, canvas fills 100% of viewport with no gaps or overflow
- **Correct Three.js 0.160.0+ API Usage:** Use `/examples/jsm/` import paths (not deprecated `/examples/js/`), include `.js` extensions for ES6 module resolution
- **Physically-Based Rendering:** Use `MeshStandardMaterial` with proper lighting (not `MeshBasicMaterial`) to demonstrate realistic shading
- **Smooth Interactive Controls:** OrbitControls with damping enabled for fluid camera movement, not jerky snapping

**Implementation Strategy:**
Since files already exist in the repository (from orbit c71c2625), this orbit will:
1. **Read existing file contents** to determine compliance with Intent acceptance boundaries
2. **Validate against 28+ specific criteria** from Intent and Context documents
3. **Overwrite only non-compliant files** with correct implementations
4. **Preserve compliant files** to minimize unnecessary filesystem mutations

**Key Technical Constraints Acknowledged:**
- Vite's zero-config mode requires `"type": "module"` in `package.json` and `type="module"` in HTML script tag for ES6 import resolution
- Three.js `PerspectiveCamera` projection matrix must be updated after changing aspect ratio via `camera.updateProjectionMatrix()`
- `MeshStandardMaterial` renders black without lights in scene (requires both `AmbientLight` and `DirectionalLight`)
- OrbitControls with damping requires `controls.update()` in animation loop before `renderer.render()`
- CSS reset requires universal selector (`*`), full-height chain (`html, body`), and canvas display override (`#app { display: block; }`)

## Implementation Plan

### Phase 1: File Validation and Compliance Audit

**Step 1.1: Read Existing Files**
Read contents of:
- `./package.json` (already confirmed compliant in Context Package — skip validation)
- `./index.html`
- `./src/main.js`
- `./src/style.css`

**Step 1.2: Validate Against Acceptance Boundaries**

**`index.html` Validation Checklist:**
- [ ] DOCTYPE declaration present (`<!DOCTYPE html>`)
- [ ] `<html lang="en">` attribute set
- [ ] `<meta charset="UTF-8">` tag present
- [ ] `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present
- [ ] `<title>` tag contains descriptive text
- [ ] `<link rel="stylesheet" href="/src/style.css">` in `<head>`
- [ ] `<canvas id="app"></canvas>` in `<body>`
- [ ] `<script type="module" src="/src/main.js"></script>` in `<body>` after canvas
- [ ] No additional elements (keep minimal)

**`src/main.js` Validation Checklist:**
- [ ] Line count ≤ 100 (use `wc -l` or equivalent)
- [ ] Import Three.js core: `import * as THREE from 'three';`
- [ ] Import OrbitControls: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';` (note `/jsm/` path and `.js` extension)
- [ ] Scene created with background `0x1a1a2e`
- [ ] PerspectiveCamera with FOV between 45-75° (suggest 75°)
- [ ] Camera positioned at Z=5 or similar (frames cube with margin)
- [ ] WebGLRenderer attached to `document.querySelector('#app')`
- [ ] Renderer size set to `window.innerWidth`, `window.innerHeight`
- [ ] Renderer pixel ratio set to `window.devicePixelRatio`
- [ ] BoxGeometry(1, 1, 1) created
- [ ] MeshStandardMaterial created (not MeshBasicMaterial)
- [ ] Mesh created from geometry + material and added to scene
- [ ] AmbientLight added to scene with intensity ~0.5
- [ ] DirectionalLight added to scene with intensity ~0.5, positioned at (5, 5, 5) or similar
- [ ] OrbitControls instantiated with camera and renderer.domElement
- [ ] `controls.enableDamping = true` set
- [ ] Animation function defined using `requestAnimationFrame`
- [ ] Cube rotation on X axis (`cube.rotation.x += delta`)
- [ ] Cube rotation on Y axis (`cube.rotation.y += delta`)
- [ ] `controls.update()` called in animation loop
- [ ] `renderer.render(scene, camera)` called in animation loop
- [ ] Window resize event listener registered
- [ ] Resize handler updates `camera.aspect` to new ratio
- [ ] Resize handler calls `camera.updateProjectionMatrix()`
- [ ] Resize handler calls `renderer.setSize()` with new dimensions

**`src/style.css` Validation Checklist:**
- [ ] Universal selector reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- [ ] Full-height HTML/body: `html, body { width: 100%; height: 100%; overflow: hidden; }`
- [ ] Canvas display override: `#app { display: block; width: 100%; height: 100%; }`
- [ ] No extra rules beyond these 3 selectors (keep minimal)

**Step 1.3: Compliance Decision Matrix**

| File | Validation Result | Action |
|------|-------------------|--------|
| `package.json` | Already confirmed compliant (Context Package) | **Preserve** — no write operation |
| `index.html` | All checklist items pass | **Preserve** existing file |
| `index.html` | Any checklist item fails | **Overwrite** with canonical implementation |
| `src/main.js` | All checklist items pass AND line count ≤ 100 | **Preserve** existing file |
| `src/main.js` | Any checklist item fails OR line count > 100 | **Overwrite** with canonical implementation |
| `src/style.css` | All checklist items pass | **Preserve** existing file |
| `src/style.css` | Any checklist item fails | **Overwrite** with canonical implementation |

### Phase 2: File Generation (Conditional Based on Phase 1)

**Step 2.1: Generate `index.html` (If Non-Compliant)**

**File:** `./index.html`

**Implementation:**
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

**Total Lines:** 12 (well within reasonable HTML length)

**Key Decisions:**
- `<canvas id="app">` provides explicit mount point for CSS targeting and JS query
- CSS loaded in `<head>` ensures styles applied before JS executes
- Script loaded at end of `<body>` ensures DOM (canvas) exists before JS queries it
- `type="module"` on script tag enables ES6 imports in browser

---

**Step 2.2: Generate `src/style.css` (If Non-Compliant)**

**File:** `./src/style.css`

**Implementation:**
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

**Total Lines:** 15

**Rationale for Each Rule:**
- Universal selector eliminates browser defaults (8px body margin in Chrome/Firefox)
- Full-height chain on `html, body` required because they don't default to 100% viewport
- `overflow: hidden` prevents scrollbars if canvas dimensions slightly exceed viewport
- `display: block` on canvas eliminates 4px inline-element descender space
- `width: 100%; height: 100%` on canvas inherits full dimensions from body

---

**Step 2.3: Generate `src/main.js` (If Non-Compliant)**

**File:** `./src/main.js`

**Implementation (Estimated 40 lines):**

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#app') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Line Count Analysis:**
- Imports: 2 lines
- Scene setup: 2 lines
- Camera setup: 2 lines
- Renderer setup: 3 lines
- Geometry + material + mesh: 3 lines
- Ambient light: 2 lines
- Directional light: 3 lines
- Controls: 2 lines
- Animation loop: 8 lines (includes function declaration, body, and call)
- Resize handler: 5 lines
- Blank lines (section separators): 8 lines
- **Total: 40 lines** (60% under 100-line budget)

**Critical Implementation Details:**

1. **OrbitControls Import Path:** Uses `three/examples/jsm/controls/OrbitControls.js` (Three.js 0.160.0+ path with `.js` extension)

2. **Scene Background:** `0x1a1a2e` hex color (dark blue-gray per Intent requirement)

3. **Camera FOV:** 75° (within Intent's 45-75° acceptable range, provides standard perspective)

4. **Camera Position:** Z=5 frames 1x1x1 cube with margin (cube vertices at ±0.5, camera FOV captures full cube plus space)

5. **Renderer Pixel Ratio:** `window.devicePixelRatio` prevents blurriness on high-DPI displays (Retina, 4K)

6. **Material Type:** `MeshStandardMaterial` (physically-based, requires lights) not `MeshBasicMaterial` (unlit)

7. **Cube Color:** `0x00ff00` (bright green) for high contrast against dark background and visibility of shading gradients

8. **Light Intensities:** Both 0.5 (total 1.0 combined) provides balanced illumination without overexposure

9. **Directional Light Position:** (5, 5, 5) creates visible shading gradient across cube faces (not flat lighting)

10. **Controls Damping:** Enabled for smooth camera interpolation (requires `controls.update()` in loop)

11. **Rotation Speed:** 0.01 radians/frame ≈ 0.57°/frame ≈ 34°/second at 60fps (visible but not dizzying)

12. **Rotation Axes:** Both X and Y axes rotate simultaneously per Intent requirement

13. **Control Update Sequence:** `controls.update()` called BEFORE `renderer.render()` to apply camera changes in current frame

14. **Resize Handler Sequence:** Update aspect → update projection matrix → resize renderer (order critical)

### Phase 3: Post-Generation Validation

**Step 3.1: Automated Checks**

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Line count | `wc -l src/main.js` | ≤ 100 |
| File count | `ls -1 | wc -l` (root) + `ls -1 src/ | wc -l` | 4 total (index.html, package.json, src/main.js, src/style.css) |
| Import syntax | `grep -c "^import " src/main.js` | 2 (Three.js core + OrbitControls) |
| No console.log | `grep -c "console.log" src/main.js` | 0 |

**Step 3.2: Manual Validation Protocol**

These checks require human execution (Tier 2 supervision requirement):

1. **Dev Server Startup:**
   - Run `npm install` (if `node_modules/` missing)
   - Run `npm run dev`
   - Verify terminal shows `Local: http://localhost:5173` or incremented port
   - Verify no error messages in terminal

2. **Visual Rendering:**
   - Open browser to `http://localhost:5173`
   - Confirm rotating green cube visible within 2 seconds
   - Confirm dark blue-gray background (not black, not white)
   - Confirm cube shows shading gradient (light/dark faces, not flat color)

3. **Interactive Controls:**
   - Click and drag mouse across canvas
   - Confirm camera orbits around cube smoothly (no jerky snapping)
   - Release mouse, confirm camera stops smoothly (no excessive drift)

4. **Viewport Coverage:**
   - Inspect viewport edges for any white gaps or borders
   - Check for horizontal scrollbar (should be absent)
   - Check for vertical scrollbar (should be absent)

5. **Responsive Behavior:**
   - Resize browser window (drag corner, maximize, restore)
   - Confirm canvas reflows to new dimensions immediately
   - Confirm cube maintains 1:1:1 proportions (not stretched/squashed)

6. **Console Errors:**
   - Open browser DevTools console
   - Confirm zero JavaScript errors during 60 seconds of operation
   - Confirm zero warnings related to Three.js or OrbitControls

### Phase 4: Execution Order and Dependencies

**Dependency Graph:**
```
package.json (already compliant)
  ↓
src/ directory (must exist)
  ↓
┌─────────────┬──────────────┬──────────────┐
│ index.html  │ src/main.js  │ src/style.css│
└─────────────┴──────────────┴──────────────┘
       ↓              ↓              ↓
  (references)   (imports)      (styles)
       ↓              ↓              ↓
  HTML loads → JS executes → CSS applies
```

**File Write Sequence:**
1. Check if `src/` directory exists; create if missing
2. Validate existing `index.html` → overwrite if non-compliant
3. Validate existing `src/style.css` → overwrite if non-compliant
4. Validate existing `src/main.js` → overwrite if non-compliant
5. `package.json` not written (already compliant per Context Package)

**Runtime Initialization Sequence (Inside Browser):**
1. Browser loads `index.html`
2. Browser parses `<link rel="stylesheet" href="/src/style.css">` → fetches CSS from Vite
3. Browser applies CSS rules to `<canvas id="app">`
4. Browser parses `<script type="module" src="/src/main.js">` → fetches JS from Vite
5. Browser parses ES6 imports → fetches `three` and `three/examples/jsm/controls/OrbitControls.js` from node_modules/
6. Browser executes `main.js`:
   - Creates WebGL context from `#app` canvas
   - Initializes scene, camera, renderer, geometry, lights, controls
   - Starts `animate()` loop via `requestAnimationFrame`
7. GPU renders frames at ~60fps
8. OrbitControls listens for mouse events on canvas
9. Window resize listener updates camera/renderer on viewport changes

## Risk Surface

### Risk 1: Existing Files Are Compliant But Orbit Reruns Anyway
**Probability:** Medium  
**Impact:** Low (unnecessary file overwrites, no functional impact)

**Scenario:**
Phase 1 validation passes for all files, but ORBITAL system triggers orbit a6b4c09a despite orbit c71c2625 completing successfully.

**Root Causes:**
- Human explicitly requested re-execution for verification purposes
- ORBITAL metadata inconsistency (orbit status not properly marked complete)
- Repository state diverged from ORBITAL tracking (files manually edited post-orbit)

**Consequence:**
If all files pass validation, this orbit will preserve them (no overwrites). Total file writes: 0. Human supervision will confirm files are correct.

**Mitigation:**
- Phase 1 validation checklist explicitly compares existing files against 28+ compliance criteria
- Preserve files that pass all checks to minimize filesystem churn
- Document in code_generation.md which files were preserved vs. overwritten

---

### Risk 2: Line Count in `main.js` Approaches 100-Line Limit
**Probability:** Very Low (current estimate: 40 lines)  
**Impact:** Low (requires minor refactoring)

**Trigger Conditions:**
- Adding verbose comments for educational purposes
- Implementing helper functions for readability
- Expanding whitespace between logical sections
- Multi-line formatting of function arguments

**Current Headroom:** 60 lines (60% under budget)

**Mitigation Strategy:**
- Strict no-comments policy (code self-documents via clear naming)
- No helper functions (inline all logic in main scope)
- Minimal whitespace (1 blank line between sections maximum)
- Compact but readable formatting (single-line constructors where arguments fit)

**Rollback Plan:**
If line count exceeds 100:
1. Remove all section separator blank lines (saves 8 lines → 32 total)
2. Combine scene setup into single line: `const scene = new THREE.Scene(); scene.background = new THREE.Color(0x1a1a2e);` (saves 1 line)
3. Still have massive headroom (32 lines vs. 100-line budget)

---

### Risk 3: OrbitControls Import Path Fails in Browser
**Probability:** Low (correct path in implementation)  
**Impact:** High (controls non-functional, console error, violates acceptance criteria)

**Failure Signature:**
```
Failed to resolve module specifier "three/examples/jsm/controls/OrbitControls.js"
```

**Root Cause Validation:**
- Implementation uses `three/examples/jsm/controls/OrbitControls.js` (correct for Three.js 0.160.0+)
- Includes `.js` file extension (required for Vite's ES module resolution)
- Three.js `package.json` exports `/examples/jsm/*` paths via `"exports"` field

**Mitigation:**
- Hardcode correct path in Step 2.3 implementation
- Phase 3 manual validation will catch import errors via browser console inspection
- If error occurs, validate Three.js version in `package.json` is ≥0.160.0

**Detection:**
Browser console will show module resolution error immediately on page load (before any rendering).

---

### Risk 4: CSS Reset Incomplete → Scrollbars Appear
**Probability:** Low (canonical CSS in Step 2.2)  
**Impact:** Medium (violates acceptance criterion, obvious visual defect)

**Failure Modes:**

| Missing Rule | Visual Defect |
|--------------|---------------|
| `* { margin: 0; }` | 8px white border, both scrollbars |
| `overflow: hidden` | 1-2px overflow triggers scrollbars |
| `#app { display: block; }` | 4px vertical gap, vertical scrollbar |

**Mitigation:**
- Step 2.2 implementation includes all 3 required selectors from Pattern Library
- Phase 3.2 manual validation (step 4) explicitly checks for scrollbars
- Test at multiple window sizes (narrow, wide, tall, square)

**Detection:**
Visual inspection: any scrollbar (horizontal or vertical) indicates CSS reset failure.

---

### Risk 5: MeshStandardMaterial Renders Black
**Probability:** Very Low (lights explicitly added in Step 2.3)  
**Impact:** High (cube invisible, looks like rendering failure)

**Root Cause:**
`MeshStandardMaterial` requires lights in scene to be visible. Without lights, material absorbs all light (renders black).

**Mitigation in Implementation:**
- Step 2.3 adds `AmbientLight` (intensity 0.5) for base illumination
- Step 2.3 adds `DirectionalLight` (intensity 0.5, position 5,5,5) for directional shading
- Both lights added to scene BEFORE `animate()` function call
- Total light intensity: 1.0 (sufficient for visible color and shading)

**Detection:**
Phase 3.2 manual validation (step 2) confirms cube shows color gradient (not flat black).

---

### Risk 6: Window Resize Distorts Cube Aspect Ratio
**Probability:** Low (correct sequence in Step 2.3)  
**Impact:** High (obvious visual bug on resize)

**Technical Requirement:**
After window resize, must update both:
1. `camera.aspect` (new width/height ratio)
2. `camera.updateProjectionMatrix()` (recompute projection matrix using new aspect)

**Implementation Sequence:**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;  // Step 1
  camera.updateProjectionMatrix();                          // Step 2 (critical)
  renderer.setSize(window.innerWidth, window.innerHeight);  // Step 3
});
```

**Why This Order Matters:**
- Projection matrix caches aspect ratio during computation
- Changing `camera.aspect` without calling `updateProjectionMatrix()` leaves matrix stale
- Stale matrix uses old aspect ratio → cube appears stretched/squashed

**Mitigation:**
- Step 2.3 implementation includes correct 3-line sequence
- Phase 3.2 manual validation (step 5) explicitly tests resize behavior

**Detection:**
Resize browser window → cube should remain 1:1:1 proportions (perfect cube, not rectangular).

---

### Risk 7: `controls.update()` Missing from Animation Loop
**Probability:** Very Low (explicitly included in Step 2.3)  
**Impact:** Medium (controls feel jerky, violates UX requirement)

**Technical Requirement:**
OrbitControls with `enableDamping = true` requires `controls.update()` every frame to interpolate camera position smoothly.

**Implementation:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();              // Required for damping
  renderer.render(scene, camera);
}
```

**Why This Matters:**
- Damping creates smooth camera movement by interpolating over multiple frames
- Without `update()`, camera "snaps" to position instead of smoothly following mouse
- Violates Intent requirement for "smooth, interactive 3D scene"

**Mitigation:**
- Step 2.3 includes `controls.update()` before `renderer.render()` in animation loop
- Phase 3.2 manual validation (step 3) tests camera movement smoothness

**Detection:**
Mouse drag should produce fluid camera orbit. If movement feels "snappy" or "sticky", `update()` is missing.

---

### Risk 8: Vite Dev Server Fails to Start
**Probability:** Very Low  
**Impact:** Low (blocks manual testing only, does not affect code correctness)

**Common Causes:**

| Cause | Error | Resolution |
|-------|-------|------------|
| Port 5173 in use | `EADDRINUSE` | Vite auto-increments to 5174, 5175, etc. |
| Missing `node_modules/` | `Cannot find module 'vite'` | Run `npm install` |
| Node.js < 18.0.0 | Version error | Upgrade Node.js (enforced by `"engines"` field) |

**Mitigation:**
- `package.json` includes `"engines": { "node": ">=18.0.0" }` to enforce minimum version
- Vite handles port conflicts gracefully (logs new port to console)
- Phase 3.1 includes `npm install` step before `npm run dev`

**Detection:**
Terminal output should show:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Scope Estimate

### Orbit Count: 1 (Single-Orbit Completion)

This orbit completes the entire implementation in one execution phase. No follow-up orbits required.

**Rationale:**
- All 4 files can be validated/generated in single pass
- No external API integrations requiring iterative testing
- No complex multi-step migrations
- Deterministic execution (no async operations, no network requests)

### Complexity Assessment: Low

**Codebase Surface:**
- Files to validate/generate: 3 (index.html, src/main.js, src/style.css)
- Files to preserve: 1 (package.json — already compliant)
- Total lines of code: ~67 (12 HTML + 15 CSS + 40 JS)
- External dependencies: 2 (Three.js, Vite — already declared in package.json)
- Integration points: 1 (Vite dev server → HTML → JS imports → Three.js)

**Risk Profile:**
- Security surface: None (no user input, no network requests, no file system access beyond dev server)
- Data persistence: None (no database, no localStorage, no cookies)
- Service dependencies: None (no backend APIs, no third-party services)
- Browser compatibility: High (WebGL 2.0 supported in 95%+ of modern browsers)

**Testing Requirements:**
- Automated checks: 4 (line count, file count, import syntax, no debug code)
- Manual checks: 6 (rendering, controls, viewport, resize, console errors, visual fidelity)
- Total validation time: ~3-5 minutes (human supervision)

**Complexity Factors:**
| Factor | Rating | Justification |
|--------|--------|---------------|
| Code volume | Very Low | ~67 total lines across 3 files |
| Logic complexity | Very Low | No conditionals, loops, or algorithms (imperative setup + render loop) |
| Dependency management | Low | 2 dependencies, both stable and well-documented |
| Integration complexity | Very Low | Single integration point (Vite → Three.js) |
| Testing complexity | Low | 10 total checks (4 automated, 6 manual) |
| **Overall Complexity** | **Low** | Minimal risk, high confidence in success |

### Work Phase Breakdown

**Phase 1: File Validation (Estimated: 30 seconds)**
- Read 3 existing files (index.html, src/main.js, src/style.css)
- Execute 28+ validation checks across all files
- Determine compliance status for each file
- Generate compliance report for human review

**Phase 2: Conditional File Generation (Estimated: 10 seconds)**
- Write only non-compliant files (0-3 files depending on validation results)
- If all files compliant: 0 write operations
- If all files non-compliant: 3 write operations (~67 lines total)
- File write operations are atomic (no partial failures)

**Phase 3: Post-Generation Validation (Estimated: 10 seconds automated + 3-5 minutes manual)**

**Automated Checks (10 seconds):**
- Line count verification
- File count verification
- Import syntax verification
- Debug code detection

**Manual Checks (3-5 minutes):**
- Dev server startup (npm install + npm run dev)
- Visual rendering confirmation (cube visible, correct colors, shading)
- Interactive controls testing (mouse drag, smooth movement)
- Viewport coverage inspection (no scrollbars, no gaps)
- Responsive behavior testing (window resize, aspect ratio maintained)
- Console error monitoring (zero errors during 60 seconds)

**Total Estimated Time:**
- Generation: 40 seconds (Phase 1 + Phase 2)
- Automated validation: 10 seconds (Phase 3 automated)
- Human supervision: 3-5 minutes (Phase 3 manual)
- **End-to-End: ~6 minutes** from orbit start to human approval

**Confidence Level: High (95%)**

**Success Probability Breakdown:**
- Code generation success: 99% (deterministic template-based generation)
- Dependency resolution success: 98% (Three.js and Vite are stable, well-maintained packages)
- Vite dev server startup: 95% (assumes Node.js 18+ installed, port 5173 available or auto-increment)
- Visual rendering success: 97% (standard Three.js patterns, no exotic features)
- Interactive controls success: 96% (OrbitControls is mature, well-tested addon)

**Failure Modes (Low Probability):**
- Three.js version mismatch causing import path errors (mitigated by hardcoded 0.160.0+ path)
- Browser WebGL context creation failure (mitigated by modern browser requirement in Intent)
- CSS specificity conflicts (mitigated by minimal, scoped CSS with no external stylesheets)

**Rollback Strategy:**
If orbit fails validation, human can:
1. Review generated files in `.orbital/artifacts/a6b4c09a-283b-48f1-9386-68f4ef295656/code_generation.md`
2. Manually edit non-compliant files
3. Re-run `npm run dev` for immediate validation
4. Worst case: delete generated files and revert to orbit c71c2625 state

## Human Modifications

Pending human review.