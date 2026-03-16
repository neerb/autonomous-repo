# Proposal Record: Three.js Starter Project

## Interpreted Intent

The developer requires a zero-configuration Three.js learning template that eliminates initial setup friction. Upon cloning the repository and executing two commands (`npm install && npm run dev`), a browser window at `http://localhost:5173` must display a 3D scene featuring:

- A continuously rotating cube (dual-axis rotation on X and Y)
- Physically-based lighting creating visible shading gradients on cube faces
- Full-viewport canvas with dark blue-grey background (`0x1a1a2e`)
- Mouse-driven camera control via OrbitControls
- Automatic responsive behavior on window resize

This is explicitly NOT a production-ready application framework. The intent prioritizes:
1. **Immediate visual feedback** — Developer sees working 3D within seconds of starting dev server
2. **Minimal cognitive load** — No TypeScript configuration, no build setup, no framework abstractions
3. **Code readability** — 100-line budget forces clarity over abstraction
4. **Teaching value** — Every line must serve as an example of correct Three.js patterns

The project serves as a "Hello World" for 3D graphics, where the equivalent of `console.log("Hello")` is a rotating, lit, interactive cube.

## Implementation Plan

### File Creation Sequence

#### 1. `package.json` (Create First)
**Purpose:** Define project dependencies and dev script  
**Location:** Repository root  
**Content Structure:**
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

**Implementation Details:**
- `"type": "module"` enables ES6 imports without Vite config
- Three.js locked to `^0.160.0` (caret allows minor/patch updates, prevents breaking changes)
- Vite locked to `^5.0.0` for Node 18+ compatibility
- Single script: `"dev": "vite"` (no build/preview scripts per non-goals)
- `engines` field enforces Node 18+ requirement at install time

**Line Count:** 15 lines (within 20-25 line target)

#### 2. `src/style.css` (Create Second)
**Purpose:** Full-viewport canvas with zero margins  
**Location:** `src/style.css`  
**Content Structure:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

canvas {
  display: block;
}
```

**Implementation Details:**
- Universal selector reset removes browser default spacing
- `overflow: hidden` prevents scrollbars during resize transitions
- `canvas { display: block }` eliminates inline element 4px bottom gap
- No explicit `width: 100vw; height: 100vh` — canvas sized by renderer in JS

**Line Count:** 12 lines (within 10-15 line target)

#### 3. `index.html` (Create Third)
**Purpose:** HTML entry point with module script import  
**Location:** Repository root  
**Content Structure:**
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

**Implementation Details:**
- No `<canvas>` element — Three.js renderer creates and appends dynamically
- `<script type="module">` enables ES6 imports without Vite config
- CSS link uses absolute path `/src/style.css` (Vite resolves from root)
- `viewport` meta tag ensures proper mobile scaling (even though mobile not priority)
- Empty `<body>` — all DOM manipulation in `main.js`

**Line Count:** 11 lines (within 15-20 line target)

#### 4. `src/main.js` (Create Last, Most Critical)
**Purpose:** Three.js scene setup and render loop  
**Location:** `src/main.js`  
**Line Count Target:** ≤100 lines (excluding blanks and single-line comments)

**Logical Structure (6 sections):**

##### Section 1: Imports (3 lines)
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```
- Import path uses `three/addons/` (Three.js r160+ standard)
- Wildcard import `* as THREE` for namespace consistency
- OrbitControls from addons (NOT `examples/jsm/` legacy path)

##### Section 2: Scene, Camera, Renderer Setup (8 lines)
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);
```
- **Camera FOV:** 75 degrees (standard for interactive 3D, balances perspective distortion)
- **Camera position:** `z = 5` (places cube filling ~40% of viewport for unit cube at origin)
- **Near/far planes:** 0.1 to 1000 (standard range, prevents z-fighting and far clip issues)
- **Antialias:** Enabled (Intent requirement: "sharp corners, not jagged")
- **Clear color:** `0x1a1a2e` (exact Intent specification)

##### Section 3: Lighting (5 lines)
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(ambientLight);
scene.add(directionalLight);
```
- **AmbientLight intensity:** 0.5 (fills shadows, prevents pure black faces)
- **DirectionalLight intensity:** 0.8 (key light, creates shading gradients)
- **DirectionalLight position:** `(5, 5, 5)` (top-right-front, illuminates 3 visible faces of cube)
- Two separate `scene.add()` calls for clarity (no chained add within budget)

##### Section 4: Cube Geometry (6 lines)
```javascript
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```
- **BoxGeometry size:** 2x2x2 (unit cube scaled for visibility)
- **Material:** `MeshStandardMaterial` (Intent requirement, requires lighting for shading)
- **Color:** `0x00ff00` (green, arbitrary choice for visibility against dark background)
- Material does NOT specify `roughness` or `metalness` (defaults: 1.0 and 0.0 respectively)

##### Section 5: OrbitControls (3 lines)
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = false;
```
- Damping disabled (saves per-frame matrix updates, acceptable interaction quality)
- No `controls.update()` needed in animate loop when damping disabled
- If human review requests smoother interaction, re-enable damping and add `controls.update()` in animate function

##### Section 6: Animation Loop (9 lines)
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
animate();
```
- **Rotation speed:** 0.01 radians per frame (≈9.5 seconds per full rotation at 60 FPS, within 8-12 second target)
- No delta time calculation (acceptable frame rate variance for learning template)
- `controls.update()` omitted (damping disabled)

##### Section 7: Window Resize Handler (8 lines)
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```
- Direct event listener (no debouncing, acceptable per Intent non-goals)
- `camera.updateProjectionMatrix()` MUST follow aspect ratio change (common error if omitted)
- `renderer.setSize()` updates canvas dimensions and internal rendering buffer

**Total Line Count Calculation:**
- Imports: 2 lines
- Scene setup: 8 lines
- Lighting: 5 lines
- Cube: 4 lines
- Controls: 2 lines
- Animation: 8 lines
- Resize: 6 lines
- **Total executable lines:** 35 lines
- **With blank lines for readability:** ~45-50 lines (well under 100-line budget)

### Dependency Resolution Strategy

**npm Install Execution:**
1. `npm install` reads `package.json`
2. Fetches `three@^0.160.0` (latest patch within 0.160.x)
3. Fetches `vite@^5.0.0` (latest patch within 5.0.x or 5.x.x)
4. Generates `package-lock.json` (locks exact versions for reproducibility)
5. Populates `node_modules/` with transitive dependencies

**Expected Install Time:** 15-30 seconds on broadband connection

**Vite Dev Server Startup:**
1. `npm run dev` executes `vite` binary from `node_modules/.bin/`
2. Vite scans for `index.html` at repository root (auto-detected)
3. Dev server binds to `http://localhost:5173` (Vite 5.x default)
4. Hot Module Replacement (HMR) watches `src/main.js` and `src/style.css`
5. Browser auto-opens or displays URL in terminal

**Expected Startup Time:** 1-3 seconds (Vite cold start on modern machine)

### File System Operations

```
Operation Sequence:
1. CREATE package.json (root)
2. CREATE src/ directory
3. CREATE src/style.css
4. CREATE src/main.js
5. CREATE index.html (root)
6. PRESERVE README.md (no modifications)
```

**No Deletions:** Existing `README.md` remains unchanged (out of scope for this orbit)

**No .gitignore Creation:** Assumes developer has global Git ignore or will add manually (Intent specifies exactly 4 files)

## Risk Surface

### Critical Implementation Risks

#### Risk 1: OrbitControls Import Path Version Mismatch
**Scenario:** Three.js version installed differs from proposal assumption  
**Impact:** `Module not found` error, camera interaction broken  
**Likelihood:** Medium (npm may resolve to r161+ with `^0.160.0` constraint)

**Mitigation:**
- Use `three/addons/controls/OrbitControls.js` (r160+ standard path)
- If import fails, verification protocol must test fallback: `three/examples/jsm/controls/OrbitControls.js`
- Proposal explicitly documents version assumption for human reviewer to validate

**Detection:** Console error `Failed to resolve module specifier` during dev server startup

#### Risk 2: 100-Line Budget Ambiguity
**Scenario:** Human reviewer counts lines differently than proposal  
**Impact:** Acceptance boundary failure despite functional code  
**Likelihood:** High (no objective standard for comment/blank line exclusion)

**Mitigation:**
- **Counting Rule Definition:** Exclude blank lines (zero non-whitespace characters) and single-line comments (`// comment`)
- Multi-line comments (`/* ... */`) count as 1 line per physical line
- Import statements count as executable lines
- Total proposal estimate: 35 executable lines (65-line safety margin)

**Detection:** Line count verification gate in Verification Protocol

#### Risk 3: Background Color Not Rendering
**Scenario:** CSS `background-color` set instead of Three.js `setClearColor()`  
**Impact:** Canvas shows white/transparent background during resize flicker  
**Likelihood:** Low (proposal specifies `renderer.setClearColor()`)

**Mitigation:**
- Explicit `renderer.setClearColor(0x1a1a2e)` in scene setup
- Do NOT rely on CSS body background (canvas is overlay layer)
- Verification protocol includes visual inspection of background during window resize

**Detection:** Visual inspection during resize shows white flashes

#### Risk 4: Camera Aspect Ratio Distortion on Resize
**Scenario:** `camera.updateProjectionMatrix()` omitted from resize handler  
**Impact:** Cube stretches/squashes on window resize  
**Likelihood:** Medium (common Three.js beginner error)

**Mitigation:**
- Proposal includes `camera.updateProjectionMatrix()` explicitly
- Verification protocol tests resize at multiple aspect ratios (16:9, 21:9, 1:1)
- Human reviewer must drag window corner and observe cube shape consistency

**Detection:** Cube appears elliptical instead of cubic after resize

### Performance Risks

#### Risk 5: Resize Handler Performance Degradation
**Scenario:** Rapid window resizing triggers hundreds of resize events per second  
**Impact:** Frame rate drops below 50 FPS during resize  
**Likelihood:** Low (modern browsers throttle resize events)

**Mitigation:**
- Accept per Intent non-goals: "No debouncing required"
- Resize handler is 4 operations (aspect calculation, matrix update, renderer resize, implicit render)
- Modern GPUs handle resize cost < 5ms per event
- If FPS drops below 50, verification protocol escalates to human decision

**Detection:** Browser DevTools performance panel during window drag

#### Risk 6: OrbitControls Damping Overhead
**Scenario:** Damping enabled causes unnecessary per-frame matrix calculations  
**Impact:** 2-3 FPS loss (negligible but measurable)  
**Likelihood:** N/A (proposal disables damping explicitly)

**Mitigation:**
- `controls.enableDamping = false` in proposal
- If human reviewer prefers smoother interaction, re-enable and add `controls.update()` to animate loop
- Document trade-off: damping = smoother rotation, no damping = 2-3 FPS gain

**Detection:** FPS counter comparison (damping on vs off)

### Visual Quality Risks

#### Risk 7: Lighting Intensity Produces Invisible Shading
**Scenario:** AmbientLight too bright (≥0.8) washes out DirectionalLight gradients  
**Impact:** Fails "clear shading gradients" acceptance boundary  
**Likelihood:** Low (proposal uses 0.5 ambient, 0.8 directional)

**Mitigation:**
- Specific intensity values in proposal: `AmbientLight(0xffffff, 0.5)` and `DirectionalLight(0xffffff, 0.8)`
- Ratio maintains visible contrast (ambient fills shadows but doesn't overpower key light)
- Verification protocol includes screenshot comparison against reference image

**Detection:** Human visual inspection of cube face brightness variation

#### Risk 8: Cube Size vs Camera Distance Mismatch
**Scenario:** Camera at `z = 5` with 2x2x2 cube produces <20% or >60% viewport fill  
**Impact:** Fails "cube fills 20-60% of viewport" acceptance boundary  
**Likelihood:** Low (proposal uses standard Three.js defaults)

**Mitigation:**
- Camera FOV 75° + distance 5 + cube size 2 = ~35% viewport fill (within 30-50% ideal range)
- Verification protocol measures diagonal coverage via screenshot pixel analysis
- If out of range, adjust camera z-position (not cube scale, to maintain unit cube reference)

**Detection:** Visual estimation or pixel measurement of cube bounding box

### Dependency Risks

#### Risk 9: npm Registry Outage During Install
**Scenario:** `npm install` fails due to registry.npmjs.org unavailable  
**Impact:** Cannot complete orbit, blocks all downstream verification  
**Likelihood:** Very Low (npmjs.com 99.9% uptime)

**Mitigation:**
- Accept temporary failure (retry after 5-15 minutes)
- No fallback CDN strategy (violates Intent dependency minimalism)
- Verification protocol includes retry instructions for transient failures

**Detection:** npm error `ENOTFOUND registry.npmjs.org`

#### Risk 10: Three.js r161+ Breaking Import Path Change
**Scenario:** npm installs Three.js r161 which deprecates `addons/` path  
**Impact:** OrbitControls import fails  
**Likelihood:** Low within orbit timeframe (r160 stable as of Dec 2023)

**Mitigation:**
- Lock to `^0.160.0` (caret prevents major version bump)
- Verification protocol tests actual installed version (`npm list three`)
- If r161+ installed, update import path in verification phase

**Detection:** Module resolution error in browser console

### Scope Boundary Risks

#### Risk 11: Temptation to Add Performance Monitoring
**Scenario:** Developer requests stats.js integration during review  
**Impact:** Violates non-goal "no UI overlays"  
**Likelihood:** Medium (common request for learning templates)

**Mitigation:**
- Proposal explicitly rejects stats.js per Intent non-goals
- Performance validation occurs via browser DevTools (external to codebase)
- Human reviewer must enforce scope boundary if requested

**Detection:** Review feedback requesting FPS counter

#### Risk 12: Request for TypeScript Migration
**Scenario:** Human reviewer suggests converting to `.ts` for "better DX"  
**Impact:** Violates constraint "no TypeScript"  
**Likelihood:** Low (Intent explicitly forbids TypeScript)

**Mitigation:**
- Proposal reiterates vanilla JavaScript constraint
- TypeScript adds `tsconfig.json`, `vite.config.ts`, type declarations (violates 4-file structure)
- Human reviewer must reject scope expansion

**Detection:** Review feedback mentioning TypeScript

## Scope Estimate

### Orbit Count
**Single Orbit (This Proposal):** All 4 files created in one execution phase

**Rationale:**
- Zero dependencies on external systems (no API calls, no database setup)
- No sequential ordering constraints (files can be created in parallel or any order)
- No integration testing across multiple modules (single `main.js` entry point)
- Verification can occur immediately after file creation (no build step beyond Vite startup)

### Complexity Assessment

**File-Level Complexity:**

| File | Lines | Complexity | Risk Level |
|------|-------|------------|------------|
| `package.json` | 15 | Trivial | Low (JSON schema validation, no logic) |
| `src/style.css` | 12 | Trivial | Low (declarative styles, no specificity conflicts) |
| `index.html` | 11 | Trivial | Low (static markup, no dynamic content) |
| `src/main.js` | ~45 | Low-Moderate | Medium (Three.js API usage, event handlers) |

**Overall Complexity:** Low
- Total code volume: ~85 lines across 4 files
- No custom algorithms (standard Three.js initialization patterns)
- No state management (single scene state)
- No error handling required (fail-fast acceptable for learning template)

**Complexity Drivers:**
1. Three.js API surface area (8 classes, 20+ method calls)
2. OrbitControls import path version sensitivity
3. Window resize handler coordination (camera + renderer updates)
4. Line count budget enforcement (requires careful measurement)

### Work Phase Breakdown

#### Phase 1: File Generation (Automated)
**Duration:** < 1 second  
**Operations:**
- Write `package.json` to disk
- Create `src/` directory
- Write `src/style.css` to disk
- Write `src/main.js` to disk
- Write `index.html` to disk

**Success Criteria:** All 4 files exist with correct content

#### Phase 2: Dependency Installation (Human-Triggered)
**Duration:** 15-30 seconds  
**Operations:**
- Execute `npm install` in repository root
- npm fetches Three.js and Vite packages
- Generate `package-lock.json`
- Populate `node_modules/`

**Success Criteria:** `npm install` exits with code 0, no error messages

#### Phase 3: Dev Server Startup (Human-Triggered)
**Duration:** 1-3 seconds  
**Operations:**
- Execute `npm run dev`
- Vite starts dev server on port 5173
- Browser opens or displays URL

**Success Criteria:** Terminal shows "Local: http://localhost:5173/"

#### Phase 4: Visual Verification (Human-Executed)
**Duration:** 2-5 minutes  
**Operations:**
- Open browser to `http://localhost:5173`
- Observe rotating cube
- Test mouse drag interaction
- Resize window and observe responsive behavior
- Verify background color matches `0x1a1a2e`

**Success Criteria:** All acceptance boundaries met (see Verification Protocol)

### Estimated Total Orbit Duration
**Automated Steps:** < 2 seconds  
**Human Steps:** 3-6 minutes (install + verify)  
**Total:** ~5-8 minutes from orbit start to verification complete

**Assumptions:**
- Broadband internet connection (15 Mbps+)
- Modern development machine (M1 MacBook Air or equivalent)
- No npm cache misses
- No concurrent port 5173 usage

## Human Modifications

Pending human review.