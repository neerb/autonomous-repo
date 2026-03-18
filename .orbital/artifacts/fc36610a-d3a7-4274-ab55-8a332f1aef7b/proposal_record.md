# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit addresses **verification and potential correction** of an existing Three.js starter project that appears to be implemented but requires validation against strict acceptance criteria. The repository contains four core files (`index.html`, `package.json`, `src/main.js`, `src/style.css`) and a `README.md` that claim to meet the requirements, but the actual implementation has not been inspected.

**Core requirement:** A single-page 3D web application using Three.js r160+ and Vite 5.x that renders a rotating cube with interactive camera controls. The implementation must be minimal (under 100 lines in `src/main.js`), use vanilla JavaScript with ES modules, and provide immediate visual feedback for learning purposes.

**Key constraint interpretation:**
- "Under 100 lines" means ≤100 lines in `src/main.js` including blank lines and comments per Intent Acceptance Boundaries
- "Dark background 0x1a1a2e" is a specific hex color requirement, not a suggestion
- "MeshStandardMaterial" specifically (not MeshBasicMaterial or MeshPhongMaterial) because it requires lighting to demonstrate proper scene setup
- OrbitControls must use the exact path `three/examples/jsm/controls/OrbitControls.js` with `.js` extension for Vite module resolution

**What success means:**
A developer can execute `npm install && npm run dev`, see a lit cube rotating smoothly at ~60 FPS, and immediately understand how to modify the scene by reading `src/main.js`. Hot module reload must work for rapid experimentation.

**Ambiguity resolution:**
- Camera FOV: Will use 75° (Three.js convention, within 45-75° range specified)
- Camera position: Will use `(0, 0, 5)` for a cube of size 1 (standard practice)
- Lighting intensities: AmbientLight at 0.5, DirectionalLight at 1.0 positioned at `(5, 5, 5)` for clear face differentiation
- Rotation speed: 0.01 radians per frame (~0.57° per frame at 60 FPS = full rotation in ~10.5 seconds)
- OrbitControls damping: Enabled with factor 0.05 for smooth, responsive feel

## Implementation Plan

### Phase 1: File Inspection and Gap Analysis

**Action:** Read actual content of existing files to determine current state vs. requirements.

**Files to inspect:**
1. `./index.html` — Verify HTML5 structure, charset/viewport meta tags, correct script module import
2. `./src/main.js` — Count lines, verify Three.js initialization sequence, check import paths
3. `./src/style.css` — Verify CSS reset and full-viewport styling
4. `./package.json` — Already inspected, matches requirements exactly

**Validation criteria:**
- Line count in `src/main.js` using `wc -l` (must be ≤100)
- OrbitControls import uses exact path `three/examples/jsm/controls/OrbitControls.js`
- Scene background set to `0x1a1a2e`
- PerspectiveCamera FOV between 45-75°
- Exactly one AmbientLight and one DirectionalLight
- Rotation updates on both `.rotation.x` and `.rotation.y`
- Window resize handler updates `camera.aspect` and calls `camera.updateProjectionMatrix()`

### Phase 2: Implementation or Correction

**Scenario A: Files are incomplete or incorrect**

If inspection reveals missing or non-compliant implementation:

**File: `./index.html`**
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
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Rationale:**
- No `<canvas>` element — Three.js `renderer.domElement` creates and appends it
- Vite serves root-relative paths (`/src/style.css`, `/src/main.js`)
- `type="module"` enables ES6 import syntax

**File: `./src/style.css`**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

canvas {
  display: block;
}
```

**Rationale:**
- Universal selector reset eliminates default browser spacing
- `overflow: hidden` prevents scrollbars when canvas is 100vw × 100vh
- `canvas { display: block; }` eliminates inline element bottom margin artifact

**File: `./src/main.js`**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Line count:** 56 lines (well under 100-line limit)

**Rationale for each section:**
- **Scene setup (lines 4-5):** Dark background per requirement
- **Camera (lines 8-14):** 75° FOV (mid-range for desktop viewing), position Z=5 (cube at origin is comfortably visible)
- **Renderer (lines 17-19):** Antialiasing enabled per requirement, canvas fills viewport
- **Cube (lines 22-25):** BoxGeometry at origin, MeshStandardMaterial (requires lighting), bright green color for visibility
- **Lights (lines 28-33):** Exactly one ambient (0.5 intensity for soft base lighting) and one directional (1.0 intensity from upper-right for face differentiation)
- **Controls (lines 36-38):** OrbitControls with damping for smooth interaction
- **Animation (lines 41-50):** requestAnimationFrame loop, rotation on X and Y axes (0.01 rad/frame), controls update, render call
- **Resize (lines 53-57):** Updates aspect ratio and projection matrix, resizes renderer

**Scenario B: Files are correct**

If inspection confirms full compliance:
- No file modifications needed
- Proceed directly to Phase 3 (Verification)
- Document "No changes required" in execution log

### Phase 3: Functional Verification

**Manual testing sequence:**

1. **Install dependencies:**
   ```bash
   npm install
   ```
   Expected: Clean install, no errors, `node_modules/` populated

2. **Start dev server:**
   ```bash
   npm run dev
   ```
   Expected: Vite starts on `http://localhost:5173`, opens browser automatically

3. **Visual inspection:**
   - Dark blue-gray background visible (0x1a1a2e)
   - Green cube centered in viewport
   - Cube rotating smoothly on both axes
   - Cube faces show brightness variation (not flat)
   - No scrollbars on page

4. **Interaction testing:**
   - Left-click drag: Camera orbits around cube
   - Right-click drag: Camera pans (cube moves in viewport)
   - Scroll wheel: Camera zooms (cube appears larger/smaller)
   - All interactions feel smooth with damping

5. **Resize testing:**
   - Resize browser window to various dimensions
   - Canvas fills viewport without letterboxing
   - Cube remains centered and proportional

6. **HMR testing:**
   - Edit `src/main.js`: Change `cube.rotation.x += 0.01` to `cube.rotation.x += 0.02`
   - Save file
   - Expected: Browser updates without full reload, rotation speed doubles

7. **Line count verification:**
   ```bash
   wc -l src/main.js
   ```
   Expected: Output ≤100

8. **Performance validation:**
   - Open browser DevTools Performance tab
   - Record 5 seconds of animation
   - Expected: Steady 60 FPS, no dropped frames, frame time ~16ms

### Phase 4: Documentation Validation

**Verify `README.md` accuracy:**
- Quick start instructions match actual commands
- Controls documentation matches OrbitControls behavior
- File structure listing is accurate
- Requirements (Node 18+, WebGL) are correct

**If discrepancies found:** Update README.md to match actual implementation.

### Phase 5: Dependency Audit

**Security check:**
```bash
npm audit
```
Expected: No vulnerabilities (Three.js r160 and Vite 5.0 are recent stable releases)

**Version validation:**
```bash
node --version  # Must be ≥18.0.0
npm list three  # Should show 0.160.x
npm list vite   # Should show 5.x.x
```

## Risk Surface

### Implementation Risks

**Risk: OrbitControls import path fails in Vite**
- **Probability:** Low (pattern is well-documented)
- **Impact:** High (controls won't load, build fails)
- **Detection:** Browser console error "Failed to resolve module specifier"
- **Mitigation:** Use exact path `three/examples/jsm/controls/OrbitControls.js` with `.js` extension. Vite requires explicit extensions for subpath imports.
- **Fallback:** If error occurs, verify Three.js version exports this path (some older versions use `/examples/js/`)

**Risk: Line count creeps above 100 during corrections**
- **Probability:** Low (current proposal is 56 lines)
- **Impact:** Medium (fails acceptance criteria)
- **Detection:** Automated line counter in verification
- **Mitigation:** Aggressive code density — eliminate unnecessary blank lines, combine variable declarations where readable. Current implementation has 44-line buffer.
- **Fallback:** Remove inline comments (can document in README instead)

**Risk: Lighting insufficient — cube appears dark or flat**
- **Probability:** Medium (common Three.js beginner mistake)
- **Impact:** Medium (fails "clear brightness differentiation" criterion)
- **Detection:** Visual inspection during Phase 3
- **Mitigation:** Use proven intensity values: ambient 0.5, directional 1.0. Position directional light at (5, 5, 5) for clear angle.
- **Fallback:** Increase directional light intensity to 1.5 if faces still too similar

**Risk: Camera position causes cube to be clipped or tiny**
- **Probability:** Low (Z=5 for size-1 cube is standard)
- **Impact:** Medium (fails "comfortable viewing distance" criterion)
- **Detection:** Visual inspection — cube should occupy ~30% of viewport height
- **Mitigation:** Camera at (0, 0, 5), cube at origin (0, 0, 0), FOV 75° gives good framing
- **Fallback:** Adjust camera.position.z to 4 (closer) or 6 (farther) based on visual feedback

**Risk: Window resize causes canvas distortion**
- **Probability:** Medium (forgetting `updateProjectionMatrix()` is common)
- **Impact:** High (fails critical acceptance criterion)
- **Detection:** Resize browser window during testing — cube should remain proportional
- **Mitigation:** Resize handler must call three operations: update `camera.aspect`, call `camera.updateProjectionMatrix()`, call `renderer.setSize()`
- **Fallback:** None — this is mandatory for correct behavior

### Performance Risks

**Risk: Animation stutters on mid-range hardware**
- **Probability:** Very Low (single cube is trivial to render)
- **Impact:** Medium (fails 60 FPS requirement)
- **Detection:** DevTools Performance profiler
- **Mitigation:** No textures, no shadows, single mesh. Modern integrated GPUs handle this easily.
- **Fallback:** Disable antialiasing if needed (though this violates Intent requirement)

**Risk: HMR causes memory leaks**
- **Probability:** Low (Vite handles this for most cases)
- **Impact:** Low (development only, not production)
- **Detection:** DevTools Memory profiler over multiple HMR cycles
- **Mitigation:** Vite's HMR automatically disposes old modules. Three.js objects are garbage-collected when dereferenced.
- **Fallback:** Full page reload if leak detected (acceptable for development)

### Verification Risks

**Risk: Subjective visual assessment varies between reviewers**
- **Probability:** High (no objective measurement for "looks right")
- **Impact:** Medium (inconsistent acceptance decisions)
- **Detection:** Multiple reviewers give conflicting pass/fail
- **Mitigation:** Define concrete thresholds in Verification Protocol: cube occupies 25-35% viewport height, faces show >20% brightness difference, rotation completes in 9-12 seconds
- **Fallback:** Use screenshot comparison against reference image

**Risk: Browser WebGL support unavailable in test environment**
- **Probability:** Low (modern browsers all support WebGL 2.0)
- **Impact:** High (cannot verify scene rendering)
- **Detection:** Console error "WebGL context lost" or blank canvas
- **Mitigation:** Test in Chrome 90+, Firefox 88+, or Safari 14+ per Intent requirements
- **Fallback:** Document as environment configuration issue, not implementation failure

### Educational Risks

**Risk: Code is too terse to be instructional**
- **Probability:** Low (56 lines with clear structure)
- **Impact:** Medium (defeats learning purpose)
- **Detection:** Human review — "I don't understand what this does"
- **Mitigation:** Use descriptive variable names (`cube` not `c`, `ambientLight` not `al`), preserve logical grouping with blank lines, add 1-2 word inline comments for non-obvious operations
- **Fallback:** Move explanatory comments to README if line budget tight

**Risk: Implementation uses deprecated APIs**
- **Probability:** Low (Three.js r160 is recent)
- **Impact:** Medium (teaches incorrect patterns)
- **Detection:** Three.js console warnings about deprecated features
- **Mitigation:** Verify against Three.js r160 documentation: `BoxGeometry` (not deprecated `CubeGeometry`), `MeshStandardMaterial` (current standard), `PerspectiveCamera` (stable API)
- **Fallback:** Update to current APIs if warnings appear

## Scope Estimate

### Complexity Assessment: **LOW**

This is a **greenfield verification and potential correction orbit** with minimal technical complexity:

- **No architectural decisions:** File structure and pattern are predetermined
- **No integration points:** Standalone client application, no APIs or databases
- **Well-documented domain:** Three.js initialization is thoroughly documented with abundant examples
- **Small surface area:** 4 files totaling ~150 lines of code
- **No data transformations:** Static scene, no dynamic content loading

**Complexity drivers:**
- 100-line constraint requires careful code organization (mitigated by current 56-line implementation)
- Visual verification requires human judgment (mitigated by concrete thresholds)
- HMR testing is manual (acceptable for Tier 2 supervised orbit)

### Orbit Count: **1 orbit (this orbit)**

**Rationale:**
All work fits within a single orbit:
- Phase 1 (Inspection): ~5 minutes
- Phase 2 (Correction if needed): ~15 minutes
- Phase 3 (Verification): ~20 minutes
- Phase 4 (Documentation): ~5 minutes
- Phase 5 (Audit): ~5 minutes
- **Total: ~50 minutes human time**

No dependencies on external teams, no approval gates beyond Tier 2 human review, no infrastructure provisioning.

### Work Breakdown

| Phase | Description | Duration | Automation | Human Oversight |
|-------|-------------|----------|------------|-----------------|
| **1. Inspection** | Read existing files, count lines, verify structure | 5 min | Fully automated | Review findings |
| **2. Implementation** | Create/modify files to match specification | 15 min | AI-generated code | Code review |
| **3. Functional Test** | Install, run, interact, measure performance | 20 min | Manual testing | Primary verification |
| **4. Documentation** | Verify README accuracy | 5 min | Automated comparison | Approve changes |
| **5. Audit** | npm audit, version checks | 5 min | Fully automated | Review report |
| **Total** | **End-to-end orbit completion** | **50 min** | **~40% automated** | **~60% human** |

**Automation opportunities:**
- Line counting: `wc -l src/main.js`
- Dependency audit: `npm audit`
- File structure validation: Script to check file existence and paths
- Performance profiling: Puppeteer script to measure FPS (not implemented but feasible)

**Manual requirements:**
- Visual inspection of rendered scene (no automated alternative for "looks right")
- Interaction testing (mouse drag, zoom, pan)
- HMR behavior validation
- Subjective code quality assessment (readability, pedagogy)

### Confidence Level: **HIGH (90%)**

**Why high confidence:**
1. **Existing implementation present:** Repository already contains matching file structure and `package.json` — likely partially or fully complete
2. **Simple requirements:** Single rotating cube is "Hello World" level complexity for Three.js
3. **No unknowns:** All APIs are stable, documented, widely used
4. **No external dependencies:** Self-contained client application
5. **Prior art available:** Thousands of similar Three.js starter examples exist

**10% uncertainty factors:**
- Current file content hasn't been inspected (might have breaking bugs)
- Human visual verification introduces subjectivity
- HMR edge cases might exist with Three.js WebGL contexts
- Performance on specific "mid-range hardware" (Intel Iris Xe, M1 base) not yet validated

### Success Criteria Mapping

Mapping Intent acceptance criteria to implementation phases:

| Acceptance Criterion | Implementation Phase | Verification Method |
|---------------------|---------------------|---------------------|
| npm install completes | Phase 3 Step 1 | Exit code 0 |
| vite starts on :5173 | Phase 3 Step 2 | HTTP 200 response |
| Cube visible and lit | Phase 3 Step 3 | Visual inspection |
| Rotation on X and Y | Phase 3 Step 3 | Visual inspection (motion) |
| Controls respond | Phase 3 Step 4 | Manual interaction |
| Window resize works | Phase 3 Step 5 | Manual resize test |
| Line count ≤100 | Phase 3 Step 7 | `wc -l` command |
| Only three + vite deps | Phase 5 | `npm list --depth=0` |
| Background 0x1a1a2e | Phase 3 Step 3 | Visual inspection (dark blue-gray) |
| HMR works | Phase 3 Step 6 | Edit file, observe no full reload |
| 60 FPS performance | Phase 3 Step 8 | DevTools Performance tab |

All critical criteria have explicit verification steps.

## Human Modifications

Pending human review.