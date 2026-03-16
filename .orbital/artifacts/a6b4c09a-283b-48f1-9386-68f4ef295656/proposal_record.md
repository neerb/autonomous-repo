# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit validates the Three.js starter project implementation from orbit c71c2625 against the Intent Document's 28+ acceptance criteria, then conditionally regenerates only non-compliant files. The goal is to ensure the repository contains a working, minimal Three.js demo that meets all functional, visual, and performance requirements while minimizing unnecessary filesystem mutations.

**Core Validation Objectives:**
- **Read existing files** (`index.html`, `src/main.js`, `src/style.css`) from orbit c71c2625
- **Apply 28+ validation checks** covering HTML structure, JavaScript correctness, CSS completeness, and Three.js API usage
- **Preserve compliant files** to avoid unnecessary regeneration
- **Regenerate only non-compliant files** with canonical implementations that pass all checks

**Success Criteria:**
- Developer runs `npm install && npm run dev` and sees rotating cube within 30 seconds
- Canvas fills 100% of viewport with no scrollbars at any window size
- Mouse drag smoothly orbits camera around cube
- Window resize maintains cube aspect ratio without distortion
- Browser console shows zero JavaScript errors during operation
- `src/main.js` contains ≤100 lines of code

**Key Technical Requirements:**
- OrbitControls import uses Three.js 0.160.0+ path (`/examples/jsm/controls/OrbitControls.js`)
- CSS reset includes universal selector, full-height chain, and canvas display override
- Scene uses `MeshStandardMaterial` with both `AmbientLight` and `DirectionalLight`
- Animation loop includes `controls.update()` before `renderer.render()`
- Resize handler includes `camera.updateProjectionMatrix()` after updating aspect ratio

**Validation Strategy:**
Rather than blindly regenerating all files like orbit c71c2625 might have done, this orbit intelligently:
1. Reads each file to determine actual content
2. Compares against canonical patterns from Context Package
3. Preserves files that pass all validation checks
4. Regenerates only files with detected non-compliance

## Implementation Plan

### Phase 1: File Reading and Validation (Estimated: 45 seconds)

**Step 1.1: Validate `package.json` (Read-Only)**

**Action:** Read `./package.json` and verify compliance

**Expected Content:**
```json
{
  "name": "threejs-starter",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite"
  },
  "dependencies": {
    "three": "^0.160.0"
  },
  "devDependencies": {
    "vite": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Validation Checks:**
- [ ] `"type": "module"` present
- [ ] `"scripts.dev": "vite"` present
- [ ] `"dependencies.three"` is `^0.160.0` or higher
- [ ] `"devDependencies.vite"` is `^5.0.0` or higher
- [ ] `"engines.node"` is `>=18.0.0`

**Decision:**
- ✅ All checks pass → **Preserve file** (no write operation)
- ❌ Any check fails → This should not happen (Context Package confirms compliance) — escalate to human review

---

**Step 1.2: Validate `index.html`**

**Action:** Read `./index.html` and apply 9 validation checks

**Validation Checklist:**

| Check # | Criterion | Pass Condition |
|---------|-----------|----------------|
| 1 | DOCTYPE declaration | Line starts with `<!DOCTYPE html>` |
| 2 | HTML lang attribute | `<html lang="en">` present |
| 3 | UTF-8 charset | `<meta charset="UTF-8">` in `<head>` |
| 4 | Viewport meta tag | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` in `<head>` |
| 5 | Title tag | `<title>` tag present with any content |
| 6 | CSS link | `<link rel="stylesheet" href="/src/style.css">` in `<head>` |
| 7 | Canvas element | `<canvas id="app"></canvas>` in `<body>` |
| 8 | Script tag | `<script type="module" src="/src/main.js"></script>` in `<body>` |
| 9 | Minimal structure | No extra elements beyond required structure |

**Decision Logic:**
```
if all 9 checks pass:
  preserve ./index.html
else:
  regenerate ./index.html with canonical structure
```

**Canonical Structure (If Regeneration Required):**
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

---

**Step 1.3: Validate `src/style.css`**

**Action:** Read `./src/style.css` and apply 3 validation checks

**Validation Checklist:**

| Check # | Criterion | Pass Condition |
|---------|-----------|----------------|
| 1 | Universal reset | `* { margin: 0; padding: 0; box-sizing: border-box; }` present |
| 2 | Full-height chain | `html, body { width: 100%; height: 100%; overflow: hidden; }` present |
| 3 | Canvas override | `#app { display: block; width: 100%; height: 100%; }` present |

**Validation Method:**
- Parse CSS or use regex to detect each required rule
- Check for presence of all 3 selectors with correct properties
- Tolerate minor whitespace/formatting differences

**Decision Logic:**
```
if all 3 rules present with correct properties:
  preserve ./src/style.css
else:
  regenerate ./src/style.css with canonical structure
```

**Canonical Structure (If Regeneration Required):**
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

---

**Step 1.4: Validate `src/main.js`**

**Action:** Read `./src/main.js` and apply 24 validation checks

**Validation Checklist:**

| Check # | Category | Criterion | Pass Condition |
|---------|----------|-----------|----------------|
| 1 | Code Quality | Line count | ≤ 100 lines (including whitespace) |
| 2 | Imports | Three.js core | `import * as THREE from 'three';` present |
| 3 | Imports | OrbitControls path | `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';` (note `/jsm/` and `.js`) |
| 4 | Scene | Background color | `scene.background = new THREE.Color(0x1a1a2e)` or equivalent |
| 5 | Camera | Type | `PerspectiveCamera` instantiated |
| 6 | Camera | FOV | First argument between 45-75 |
| 7 | Camera | Position | `camera.position.z` set to non-zero value (suggest 5) |
| 8 | Renderer | Canvas attachment | `new THREE.WebGLRenderer({ canvas: document.querySelector('#app') })` |
| 9 | Renderer | Size | `renderer.setSize(window.innerWidth, window.innerHeight)` called |
| 10 | Renderer | Pixel ratio | `renderer.setPixelRatio(window.devicePixelRatio)` called |
| 11 | Geometry | Type | `BoxGeometry(1, 1, 1)` or equivalent cube |
| 12 | Material | Type | `MeshStandardMaterial` (not `MeshBasicMaterial`) |
| 13 | Mesh | Creation | `Mesh` created from geometry + material |
| 14 | Mesh | Added to scene | `scene.add(cube)` or equivalent |
| 15 | Lights | Ambient | `AmbientLight` instantiated and added to scene |
| 16 | Lights | Directional | `DirectionalLight` instantiated and added to scene |
| 17 | Lights | Directional position | `directionalLight.position.set(...)` with non-zero coords |
| 18 | Controls | Instantiation | `OrbitControls` instantiated with camera and renderer.domElement |
| 19 | Controls | Damping | `controls.enableDamping = true` set |
| 20 | Animation | requestAnimationFrame | `requestAnimationFrame(animate)` called in function |
| 21 | Animation | Cube rotation X | `cube.rotation.x +=` some delta in animation loop |
| 22 | Animation | Cube rotation Y | `cube.rotation.y +=` some delta in animation loop |
| 23 | Animation | Controls update | `controls.update()` called in animation loop |
| 24 | Animation | Render call | `renderer.render(scene, camera)` called in animation loop |
| 25 | Resize | Event listener | `window.addEventListener('resize', ...)` present |
| 26 | Resize | Aspect update | `camera.aspect = window.innerWidth / window.innerHeight` in handler |
| 27 | Resize | Projection matrix | `camera.updateProjectionMatrix()` called in handler |
| 28 | Resize | Renderer size | `renderer.setSize(window.innerWidth, window.innerHeight)` in handler |

**Decision Logic:**
```
if all 28 checks pass:
  preserve ./src/main.js
else:
  regenerate ./src/main.js with canonical implementation
```

**Canonical Implementation (If Regeneration Required):**

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

**Line Count:** 40 lines (60% under 100-line budget)

### Phase 2: Conditional File Regeneration (Estimated: 15 seconds)

**File Write Operations:**

| File | Condition | Action |
|------|-----------|--------|
| `./package.json` | N/A | **No write** — already validated as compliant |
| `./index.html` | Failed any of 9 checks in Step 1.2 | **Write** canonical 12-line HTML |
| `./src/style.css` | Failed any of 3 checks in Step 1.3 | **Write** canonical 15-line CSS |
| `./src/main.js` | Failed any of 28 checks in Step 1.4 | **Write** canonical 40-line JavaScript |

**Write Sequence:**
1. If `src/` directory does not exist, create it before writing `main.js` or `style.css`
2. Write files in any order (no dependencies between them)
3. Use atomic file write operations (write to temp file, then move)

**Logging Requirements:**
For each file, log:
- Validation result (PASS/FAIL)
- If FAIL: specific check(s) that failed
- Action taken (PRESERVED or REGENERATED)

### Phase 3: Post-Generation Validation (Estimated: 5 seconds automated + 3-5 minutes human)

**Automated Checks:**

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Line count | `wc -l src/main.js` | ≤ 100 |
| File count | Count files in root and `src/` | Exactly 4: `index.html`, `package.json`, `src/main.js`, `src/style.css` |
| No debug code | `grep -c "console.log" src/main.js` | 0 |
| Import syntax | `grep -c "^import " src/main.js` | 2 (Three.js core + OrbitControls) |

**Human Validation Protocol (Tier 2 Supervision):**

**3.1: Dev Server Startup**
- Run `npm install` (if `node_modules/` missing or stale)
- Run `npm run dev`
- Expected: Terminal shows `Local: http://localhost:5173` within 5 seconds
- Expected: No error messages in terminal output

**3.2: Visual Rendering**
- Open browser to `http://localhost:5173`
- Expected: Rotating green cube visible within 2 seconds
- Expected: Dark blue-gray background (not black, not white)
- Expected: Cube shows shading gradient (light/dark faces, not flat color)

**3.3: Interactive Controls**
- Click and drag mouse across canvas
- Expected: Camera orbits around cube smoothly (no jerky snapping)
- Release mouse
- Expected: Camera stops smoothly (no excessive drift)

**3.4: Viewport Coverage**
- Inspect viewport edges for white gaps or borders
- Expected: Canvas touches all 4 edges of viewport
- Expected: No horizontal scrollbar at any window width
- Expected: No vertical scrollbar at any window height

**3.5: Responsive Behavior**
- Resize browser window (drag corner, maximize, restore)
- Expected: Canvas immediately reflows to new dimensions
- Expected: Cube maintains 1:1:1 proportions (not stretched/squashed)

**3.6: Console Errors**
- Open browser DevTools console
- Let scene run for 60 seconds
- Expected: Zero JavaScript errors
- Expected: Zero warnings related to Three.js or OrbitControls

### Phase 4: Execution Dependencies

**Dependency Graph:**
```
package.json (validated, not written)
  ↓
src/ directory (must exist)
  ↓
┌─────────────┬──────────────┬──────────────┐
│ index.html  │ src/main.js  │ src/style.css│
│ (validate)  │ (validate)   │ (validate)   │
└─────────────┴──────────────┴──────────────┘
       ↓              ↓              ↓
   [decision]     [decision]     [decision]
       ↓              ↓              ↓
  preserve or    preserve or    preserve or
  regenerate     regenerate     regenerate
```

**Critical Ordering:**
1. Validate `package.json` first (confirms dependencies exist)
2. Create `src/` directory if missing (required for `main.js` and `style.css`)
3. Validate and conditionally write `index.html`, `src/main.js`, `src/style.css` in parallel (no dependencies)
4. Run automated checks after all writes complete
5. Human executes manual validation protocol

**Runtime Initialization (After Files Written):**
```
Human runs: npm install (if needed)
Human runs: npm run dev
  ↓
Vite dev server starts
  ↓
Browser loads index.html
  ↓
HTML loads style.css
HTML loads main.js as ES6 module
  ↓
main.js imports Three.js modules
  ↓
WebGL context created
Scene initialized
Animation loop starts
  ↓
Human validates rendering, controls, viewport, resize, console
```

## Risk Surface

### Risk 1: All Files Compliant — Zero Regeneration
**Probability:** Medium (30-40%)  
**Impact:** Minimal (optimal outcome, no file writes)

**Scenario:**
Orbit c71c2625 generated perfectly compliant files. All 28+ validation checks pass. No files need regeneration.

**Expected Outcome:**
- Phase 1 completes with all checks passing
- Phase 2 skipped (no writes)
- Phase 3 automated checks pass
- Phase 3 human validation confirms working demo

**Mitigation:**
None needed — this is the ideal outcome. Code generation artifact should clearly document that no files were regenerated.

---

### Risk 2: OrbitControls Path Uses Deprecated Format
**Probability:** Medium (40-50%)  
**Impact:** High (controls non-functional, console error)

**Failure Signature:**
Validation Step 1.4, Check #3 fails:
```javascript
// ❌ Found in src/main.js (deprecated)
import { OrbitControls } from 'three/examples/js/controls/OrbitControls';
```

**Browser Console Error:**
```
Failed to resolve module specifier "three/examples/js/controls/OrbitControls"
```

**Mitigation:**
- Validation detects deprecated path
- Triggers regeneration of `src/main.js` with correct path:
  ```javascript
  // ✅ Correct (Three.js 0.160.0+)
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  ```

**Detection:**
- Automated check in Phase 1
- Human validation in Phase 3.6 (console errors)

---

### Risk 3: CSS Reset Missing `overflow: hidden`
**Probability:** Low (20-30%)  
**Impact:** Medium (scrollbars appear, violates acceptance criterion)

**Failure Signature:**
Validation Step 1.3, Check #2 fails:
```css
/* ❌ Missing overflow: hidden */
html, body {
  width: 100%;
  height: 100%;
  /* overflow: hidden; ← MISSING */
}
```

**Visual Impact:**
1-2px scrollable area triggers horizontal and/or vertical scrollbars

**Mitigation:**
- Validation detects missing `overflow: hidden`
- Triggers regeneration of `src/style.css` with complete reset
- Human validation in Phase 3.4 confirms no scrollbars

**Detection:**
- Automated check in Phase 1
- Human visual inspection in Phase 3.4

---

### Risk 4: Missing `camera.updateProjectionMatrix()` in Resize Handler
**Probability:** Low (20-30%)  
**Impact:** High (cube distorts on resize, obvious visual bug)

**Failure Signature:**
Validation Step 1.4, Check #27 fails:
```javascript
// ❌ Missing projection matrix update
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix(); ← MISSING
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Visual Impact:**
Resize browser window → cube stretches/squashes instead of maintaining 1:1:1 proportions

**Mitigation:**
- Validation detects missing `updateProjectionMatrix()` call
- Triggers regeneration of `src/main.js` with correct resize handler
- Human validation in Phase 3.5 tests resize behavior

**Detection:**
- Automated check in Phase 1 (regex search for method call in resize handler)
- Human resize test in Phase 3.5

---

### Risk 5: Missing `controls.update()` in Animation Loop
**Probability:** Low (20-30%)  
**Impact:** Medium (controls feel jerky, degrades UX)

**Failure Signature:**
Validation Step 1.4, Check #23 fails:
```javascript
// ❌ Missing controls.update()
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // controls.update(); ← MISSING
  renderer.render(scene, camera);
}
```

**UX Impact:**
Camera movement feels "snappy" or "sticky" instead of smooth damped interpolation

**Mitigation:**
- Validation detects missing `controls.update()` call in animation loop
- Triggers regeneration of `src/main.js` with correct loop
- Human validation in Phase 3.3 tests camera smoothness

**Detection:**
- Automated check in Phase 1 (search for `controls.update()` between `requestAnimationFrame` and `renderer.render`)
- Human interaction test in Phase 3.3

---

### Risk 6: Line Count Exceeds 100 Lines
**Probability:** Very Low (10-15%)  
**Impact:** Low (violates code quality gate)

**Failure Signature:**
Validation Step 1.4, Check #1 fails:
```bash
wc -l src/main.js
# Output: 127 src/main.js ← OVER BUDGET
```

**Root Causes:**
- Verbose comments explaining each step
- Helper functions for scene initialization
- Excessive whitespace between statements

**Mitigation:**
- Validation detects line count > 100
- Triggers regeneration with canonical 40-line implementation (no comments, minimal whitespace)

**Detection:**
- Automated check in Phase 1 (simple line count)
- Automated check in Phase 3 (reconfirm after regeneration)

---

### Risk 7: MeshStandardMaterial Without Lights
**Probability:** Very Low (5-10%)  
**Impact:** High (cube renders black, looks like rendering failure)

**Failure Signature:**
Validation Step 1.4, Checks #15 or #16 fail:
```javascript
// ❌ Missing lights
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Missing: AmbientLight and DirectionalLight
```

**Visual Impact:**
Cube appears as black silhouette instead of lit green cube with shading

**Mitigation:**
- Validation detects missing `AmbientLight` or `DirectionalLight` instantiation
- Triggers regeneration of `src/main.js` with both lights
- Human validation in Phase 3.2 confirms cube shows shading gradient

**Detection:**
- Automated check in Phase 1 (search for `new THREE.AmbientLight` and `new THREE.DirectionalLight`)
- Human visual inspection in Phase 3.2

---

### Risk 8: False Positive in Validation Logic
**Probability:** Low (15-20%)  
**Impact:** Medium (compliant file unnecessarily regenerated)

**Scenario:**
Validation logic has bug or is too strict. Marks compliant file as non-compliant due to minor formatting difference (e.g., different whitespace, equivalent but different code).

**Example:**
```javascript
// Orbit c71c2625 wrote (functionally equivalent):
camera.position.set(0, 0, 5);

// Validation expects exact pattern:
camera.position.z = 5;

// Validator incorrectly fails check, triggers regeneration
```

**Mitigation:**
- Validation checks focus on functional requirements, not exact code patterns
- Use AST parsing or flexible regex where possible
- Human pre-execution review of validation criteria
- Human post-execution review compares regenerated files against originals

**Detection:**
- Human reviews validation decisions in code generation artifact
- Human compares file diffs to confirm regeneration was necessary

## Scope Estimate

### Orbit Count: 1 (Single-Orbit Completion)

This orbit completes all validation and conditional regeneration in one execution phase.

**Rationale:**
- Validation is deterministic (no iterative refinement needed)
- Regeneration uses canonical implementations (no trial-and-error)
- All 4 files can be validated in single pass
- No external API calls or async operations

### Complexity Assessment: Low-Medium

**Low Complexity Factors:**
- Small codebase (4 files, ~67 total lines)
- No external APIs or databases
- No migration or data transformation
- Deterministic validation criteria
- Well-defined canonical implementations

**Medium Complexity Factors:**
- 28+ validation checks across 3 files (more complex than simple generation)
- Conditional logic (preserve vs. regenerate for each file)
- Multiple validation methods (regex, line count, AST parsing, manual inspection)
- Human supervision required (Tier 2 trust tier)

**Overall Complexity:** Low-Medium

### Work Phase Breakdown

**Phase 1: File Validation (45 seconds)**
- Read 4 files from filesystem
- Apply 28+ validation checks
- Generate compliance report for each file
- Determine which files need regeneration

**Phase 2: Conditional Regeneration (15 seconds)**
- Create `src/` directory if missing
- Write 0-3 files based on validation results
- Best case: 0 writes (all compliant)
- Worst case: 3 writes (regenerate `index.html`, `src/main.js`, `src/style.css`)

**Phase 3: Automated Validation (5 seconds)**
- Line count check
- File count check
- Import syntax check
- Debug code detection

**Phase 4: Human Validation (3-5 minutes)**
- Dev server startup test
- Visual rendering test
- Interactive controls test
- Viewport coverage inspection
- Responsive resize test
- Console error monitoring

**Total Time Budget:**
- Automated execution: 65 seconds (Phase 1 + Phase 2 + Phase 3)
- Human supervision: 3-5 minutes (Phase 4)
- **End-to-End: ~6 minutes** from orbit start to human approval

### Confidence Level: High (90%)

**Success Probability Breakdown:**
- File reading success: 99% (standard filesystem operations)
- Validation logic correctness: 90% (well-defined checks, some edge case risk)
- Regeneration success: 98% (canonical implementations tested in prior orbit)
- Dev server startup: 95% (assumes Node.js 18+ and no port conflicts)
- Visual rendering success: 97% (canonical Three.js patterns)
- Interactive controls success: 96% (OrbitControls is mature library)

**Failure Modes:**
- Validation logic bug causes false positive/negative (15-20% probability per file, mitigated by human review)
- Three.js version mismatch (< 5% probability, mitigated by hardcoded 0.160.0+ checks)
- Browser WebGL failure (< 3% probability, mitigated by modern browser requirement)

**Mitigation Strategies:**
- Human pre-execution review confirms validation criteria are correct
- Human post-execution review confirms preservation/regeneration decisions were correct
- Detailed logging of validation results for debugging
- Worst case: human manually edits files if validation logic is incorrect

## Human Modifications

Pending human review.