# Context Package: Three.js Minimal Starter Project

## Codebase References

### Files Currently Present
| File Path | Purpose | Status | Action Required |
|-----------|---------|--------|-----------------|
| `./package.json` | npm dependencies and scripts | ✅ Exists and compliant | **No modification** — already contains correct Three.js ^0.160.0, Vite ^5.0.0, "type": "module", and "dev": "vite" script |
| `./README.md` | Project documentation | ✅ Exists (minimal) | **Preserve** — contains "Testing purposes" placeholder |
| `./index.html` | HTML entry point | ✅ Exists | **Validate and potentially overwrite** — must verify compliance with Intent requirements |
| `./src/main.js` | Three.js scene implementation | ✅ Exists | **Validate and potentially overwrite** — must verify ≤100 lines, correct imports, complete scene |
| `./src/style.css` | Viewport CSS reset | ✅ Exists | **Validate and potentially overwrite** — must verify full-viewport coverage without scrollbars |

### ORBITAL Metadata (Do Not Touch)
| Directory Path | Purpose |
|----------------|---------|
| `./.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/*` | Prior orbit artifacts (6 files: intent, context, proposal, verification, code_generation, test_results) |
| `./.orbital/artifacts/a6b4c09a-283b-48f1-9386-68f4ef295656/*` | Current orbit artifacts in progress (3 files so far: intent, context, proposal) |

**Critical Constraint:** Do not read, modify, or delete any files under `.orbital/`. These are system metadata managed by the ORBITAL framework.

### Existing `package.json` Validation

**Current Content:**
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

**Compliance Check Against Intent:**
- ✅ `"type": "module"` — Enables ES6 imports in Node.js context (required for Vite + Three.js)
- ✅ `"scripts.dev": "vite"` — Matches Intent requirement for dev script
- ✅ `"dependencies.three": "^0.160.0"` — Meets Intent requirement for latest stable Three.js
- ✅ `"devDependencies.vite": "^5.0.0"` — Meets Intent requirement for Vite 5.x
- ✅ `"engines.node": ">=18.0.0"` — Enforces Vite 5.x runtime requirement

**Conclusion:** Existing `package.json` is fully compliant with Intent constraints. **No modifications required.**

### Files Requiring Validation/Generation

Based on repository structure showing `index.html`, `src/main.js`, and `src/style.css` already exist (likely from orbit c71c2625), this orbit must:

1. **Read existing files** to verify compliance with Intent Document acceptance boundaries
2. **Overwrite non-compliant files** with correct implementations
3. **Preserve compliant files** to avoid unnecessary churn

**Validation Checklist for Existing Files:**

**`./index.html`:**
- [ ] Contains `<canvas id="app">` element
- [ ] Links to `/src/style.css` via `<link>` tag
- [ ] Imports `/src/main.js` as ES6 module (`type="module"`)
- [ ] Includes proper `<meta charset>` and `<meta name="viewport">` tags

**`./src/main.js`:**
- [ ] Line count ≤ 100 (including whitespace and comments)
- [ ] Imports Three.js core: `import * as THREE from 'three'`
- [ ] Imports OrbitControls: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- [ ] Creates scene with background color `0x1a1a2e`
- [ ] Creates `PerspectiveCamera` with FOV 45-75°, positioned at Z=5 or similar
- [ ] Creates `WebGLRenderer` attached to `#app` canvas
- [ ] Creates `BoxGeometry` + `MeshStandardMaterial` → `Mesh`
- [ ] Adds `AmbientLight` and `DirectionalLight` to scene
- [ ] Initializes `OrbitControls` with damping enabled
- [ ] Animation loop using `requestAnimationFrame` that rotates cube on X and Y axes
- [ ] Window resize handler updating camera aspect ratio and renderer size

**`./src/style.css`:**
- [ ] Universal selector reset: `* { margin: 0; padding: 0; box-sizing: border-box; }`
- [ ] Full-height chain: `html, body { width: 100%; height: 100%; overflow: hidden; }`
- [ ] Canvas full-viewport: `#app { display: block; width: 100%; height: 100%; }`

## Architecture Context

### Project Type: Minimal Static Site with Client-Side 3D Rendering

This is a **greenfield demonstration project** with no backend, no database, no user authentication, and no persistent state. The entire application runs in the browser using WebGL for GPU-accelerated 3D rendering.

**Architectural Simplicity by Design:**
- No server-side rendering (SSR) or static site generation (SSG)
- No API endpoints or network requests (except Vite HMR websocket in dev mode)
- No routing (single-page, single-scene application)
- No state management libraries (all state lives in Three.js object properties)

### Build System: Vite Zero-Config Mode

**Vite's Role in This Architecture:**
- **Development Server:** Serves `index.html` from root, resolves ES6 imports to `node_modules/`
- **Hot Module Replacement (HMR):** Injects code changes without full page reload
- **Module Resolution:** Translates bare specifiers (`'three'`) to file paths (`node_modules/three/build/three.module.js`)
- **No Build Step for Dev:** All code runs directly in browser with native ES6 module support

**Critical Integration Point:**
Vite's default behavior depends on:
1. `package.json` containing `"type": "module"` (enables ES6 in Node.js context for config files)
2. HTML script tag using `type="module"` (enables ES6 imports in browser)
3. Three.js package exporting ES6 modules via `"exports"` field in its `package.json`

**Why No Config File Is Needed:**
- Vite auto-discovers `index.html` at root as entry point
- Vite's default `node_modules/` resolution handles Three.js imports correctly
- No custom plugins, optimizations, or build transformations required

**Consequence:** Intent constraint "Must use Vite's default configuration without custom plugins or config files" is architecturally sound — this project genuinely needs zero configuration beyond `package.json`.

### Runtime Environment: Browser WebGL 2.0 Context

**Execution Pipeline:**
```
Browser loads index.html
  ↓
Parse HTML → discover <script type="module" src="/src/main.js">
  ↓
Browser fetches /src/main.js from Vite dev server
  ↓
Browser parses ES6 imports → fetches 'three' and 'three/examples/jsm/controls/OrbitControls.js'
  ↓
Vite resolves imports to node_modules/ files
  ↓
Browser executes main.js:
  - Creates WebGL context from <canvas id="app">
  - Initializes Three.js Scene, Camera, Renderer
  - Starts requestAnimationFrame loop
  ↓
GPU renders frames at ~60fps
  ↓
OrbitControls listens for mouse events on canvas
  ↓
Window resize events trigger camera/renderer updates
```

**No Server-Side Execution:**
All JavaScript executes in the browser. Vite's dev server only serves static files and provides HMR websocket.

### Data Flow: Single-Direction Render Loop

**Scene Graph Structure (Three.js Pattern):**
```
Scene (root container)
├── PerspectiveCamera (viewing frustum definition)
├── Mesh (cube)
│   ├── BoxGeometry (vertex data: 8 corners, 12 triangles)
│   └── MeshStandardMaterial (physically-based surface shader)
├── AmbientLight (uniform illumination from all directions)
└── DirectionalLight (parallel rays from specific direction)
```

**Animation Loop (Imperative Update Pattern):**
```javascript
function animate() {
  requestAnimationFrame(animate);        // Schedule next frame
  cube.rotation.x += 0.01;               // Mutate object state
  cube.rotation.y += 0.01;               // Mutate object state
  controls.update();                     // Let OrbitControls update camera
  renderer.render(scene, camera);        // GPU renders current state
}
```

**No Reactive Framework:**
Unlike React (declarative UI updates) or Vue (reactive data binding), Three.js uses imperative mutation. You directly modify object properties (e.g., `cube.rotation.x`) and call `renderer.render()` to reflect changes.

**Event-Driven Interactions:**
- **Mouse Drag:** OrbitControls internally listens to `mousemove`, `mousedown`, `mouseup` events on `renderer.domElement` (the canvas)
- **Window Resize:** Explicit event listener updates camera aspect ratio and renderer dimensions

### Performance Characteristics

**Target Frame Rate:** 60fps (16.67ms per frame)

**Frame Budget Breakdown:**
- JavaScript execution (rotation updates, controls): ~1ms
- Three.js scene graph traversal: ~2ms
- WebGL draw calls (single cube = 1 draw call): ~5ms
- GPU rasterization and compositing: ~8ms
- **Total: ~16ms** (fits within 60fps budget with margin)

**Memory Profile:**
- Three.js core library: ~15MB heap
- Scene graph (1 mesh, 2 lights, 1 camera): ~2MB
- WebGL context and buffers: ~10MB GPU memory
- **Total: ~27MB** (well within modern browser limits)

**Why This Stays Under 60fps:**
- Single draw call (one mesh)
- No shadow maps (Intent non-goal)
- No post-processing effects
- Static geometry (no vertex updates per frame)

## Pattern Library

### HTML Entry Point Pattern (Vite + Three.js Standard)

**Canonical Structure:**
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

**Key Design Decisions:**
- **`<canvas id="app">`:** Explicit mount point (not auto-created by Three.js) for CSS control
- **`/src/style.css` path:** Vite resolves paths relative to project root in dev mode
- **`type="module"` on script tag:** Enables ES6 imports in browser without bundler preprocessing
- **CSS loaded before JS:** Ensures styles applied before Three.js queries DOM for canvas

**Anti-Patterns to Avoid:**
- ❌ Letting Three.js auto-create canvas via `document.body.appendChild(renderer.domElement)` — breaks CSS full-viewport layout
- ❌ Using `<script src="...">` without `type="module"` — blocks ES6 import syntax
- ❌ Inline styles in HTML — violates separation of concerns, makes CSS changes harder

### CSS Reset Pattern for Full-Viewport Canvas

**Required Rules (Order Matters):**
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

**Why Each Rule Is Critical:**

1. **Universal Selector Reset (`*`)**
   - Removes browser default margins (especially `<body>`'s 8px margin in Chrome/Firefox)
   - Removes default padding (e.g., on `<ul>`, `<ol>`, `<p>` if added later)
   - Sets `box-sizing: border-box` to include padding/border in width/height calculations

2. **Full-Height Chain (`html, body`)**
   - Sets both `html` and `body` to 100% viewport dimensions (they don't default to full height)
   - `overflow: hidden` prevents scrollbars if content exceeds viewport (critical for canvas)

3. **Canvas Display Override (`#app`)**
   - `display: block` eliminates 4px inline-element descender space (canvas is inline by default)
   - `width: 100%; height: 100%` inherits full dimensions from `body`

**What Happens If Any Rule Is Missing:**

| Missing Rule | Visual Bug |
|--------------|------------|
| `* { margin: 0; }` | 8px white border around canvas (from body margin) |
| `overflow: hidden` | Scrollbars appear (canvas slightly larger than viewport) |
| `#app { display: block; }` | 4px vertical gap below canvas (inline descender space) |
| `html, body { height: 100%; }` | Canvas collapses to 0px height (no explicit height set) |

### Three.js Initialization Pattern (Strict Ordering)

**Mandatory Sequence (Cannot Reorder):**

```javascript
// 1. Scene (container for all 3D objects)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 2. Camera (defines viewing frustum)
const camera = new THREE.PerspectiveCamera(
  75,                                  // FOV (degrees)
  window.innerWidth / window.innerHeight,  // Aspect ratio
  0.1,                                 // Near clipping plane
  1000                                 // Far clipping plane
);
camera.position.z = 5;

// 3. Renderer (manages WebGL context)
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#app') 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 4. Geometry + Material = Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Lights (MUST be added before first render)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 6. OrbitControls (requires renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 7. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 8. Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Why This Order Cannot Change:**

| Dependency | Reason |
|------------|--------|
| Scene before objects | Cannot call `scene.add(cube)` if scene doesn't exist |
| Renderer before OrbitControls | OrbitControls constructor needs `renderer.domElement` (canvas reference) |
| Lights before animate() | MeshStandardMaterial renders black without lights in scene |
| camera.updateProjectionMatrix() after aspect change | Projection matrix caches aspect ratio — must recompute after change |

**Common Mistakes That Break This Pattern:**
- ❌ Creating OrbitControls before renderer → `TypeError: Cannot read property 'domElement' of undefined`
- ❌ Forgetting to add lights to scene → Cube renders as black silhouette
- ❌ Changing `camera.aspect` without calling `updateProjectionMatrix()` → Cube distorts on resize

### OrbitControls Integration Pattern (Three.js 0.160.0+)

**Correct Import Path (Breaking Change in 0.160.0):**
```javascript
// ✅ Correct (Three.js 0.160.0+)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ❌ Deprecated (pre-0.160.0, will fail)
import { OrbitControls } from 'three/examples/js/controls/OrbitControls';
```

**Path Change History:**
- Three.js < 0.160.0: Addons lived in `/examples/js/` as UMD modules
- Three.js ≥ 0.160.0: Addons moved to `/examples/jsm/` as ES6 modules
- **Critical:** Must include `.js` file extension for Vite's module resolution

**Standard Initialization:**
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

**Animation Loop Integration:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update();  // Required if enableDamping is true
  renderer.render(scene, camera);
}
```

**Why `controls.update()` Is Required:**
- Damping creates smooth camera movement by interpolating position over multiple frames
- Without `update()`, damping doesn't interpolate → camera feels "sticky"
- Must be called **before** `renderer.render()` to apply camera changes in current frame

### Line Count Optimization Pattern (Intent Constraint: ≤100 Lines)

**Techniques to Stay Under Budget:**

1. **No Comments:** Code should be self-documenting via variable names
   ```javascript
   // ❌ Verbose (3 lines)
   // Create a new scene to hold 3D objects
   const scene = new THREE.Scene();
   
   // ✅ Compact (1 line)
   const scene = new THREE.Scene();
   ```

2. **Combine Related Operations:**
   ```javascript
   // ❌ Verbose (2 lines)
   const scene = new THREE.Scene();
   scene.background = new THREE.Color(0x1a1a2e);
   
   // ✅ Could be 1 line, but 2 lines is more readable here (acceptable tradeoff)
   ```

3. **Single-Line Function Calls (Where Readable):**
   ```javascript
   // ✅ Readable single-line
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   
   // ❌ Over-optimized (hurts readability)
   const camera=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000);
   ```

4. **Minimal Whitespace (1 Blank Line Between Sections):**
   ```javascript
   // Section 1: Scene setup
   const scene = new THREE.Scene();
   scene.background = new THREE.Color(0x1a1a2e);
   
   // Section 2: Camera setup (1 blank line separator)
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   ```

5. **No Helper Functions (Inline Everything):**
   ```javascript
   // ❌ Adds lines for function definition
   function initScene() { ... }
   function initCamera() { ... }
   
   // ✅ Inline in main scope
   const scene = new THREE.Scene();
   const camera = new THREE.PerspectiveCamera(...);
   ```

**Estimated Line Budget:**
- Imports: 2 lines
- Scene + background: 2 lines
- Camera setup: 2 lines
- Renderer setup: 3 lines
- Geometry + material + mesh: 4 lines
- Lights: 5 lines
- OrbitControls: 2 lines
- Animation loop: 7 lines
- Resize handler: 5 lines
- Section separators (blank lines): 8 lines
- **Total: ~40 lines** (60% under 100-line budget)

## Prior Orbit References

### Orbit c71c2625-0f6b-441c-a24b-a5d187d1ae16 (Previous Attempt)

**Artifacts Generated:**
- `intent_document.md`
- `context_package.md`
- `proposal_record.md`
- `verification_protocol.md`
- `code_generation.md`
- `test_results.md`

**Status:** Complete artifact set (6/6 documents present)

**Repository State After Orbit c71c2625:**
- ✅ `package.json` created with correct dependencies and scripts
- ✅ `index.html` appears to exist in repository structure
- ✅ `src/main.js` appears to exist in repository structure
- ✅ `src/style.css` appears to exist in repository structure

**Inference:**
Orbit c71c2625 successfully generated all 4 required files. However, current orbit (a6b4c09a) is running again, suggesting either:
1. Files were not committed/pushed properly after c71c2625
2. Files were generated but do not meet Intent acceptance criteria
3. Human review identified issues requiring regeneration

**Key Learnings from Prior Orbit (Based on Artifact Presence):**
- `code_generation.md` exists → code was generated programmatically
- `test_results.md` exists → some form of validation was attempted
- `verification_protocol.md` exists → acceptance criteria were defined

**Action for Current Orbit:**
Since files already exist in repository structure, this orbit should:
1. Read existing files to determine compliance with Intent
2. Overwrite only non-compliant files
3. Preserve compliant files to avoid unnecessary changes

### Orbit a6b4c09a-283b-48f1-9386-68f4ef295656 (Current Orbit)

**Artifacts Generated So Far:**
- `intent_document.md` ✅
- `context_package.md` ✅ (this document)
- `proposal_record.md` ✅

**Remaining Artifacts:**
- `verification_protocol.md` (next phase)
- `code_generation.md` (execution phase)
- `test_results.md` (validation phase)

**Orbit Trajectory:**
This is the second orbit attempting to implement the same Three.js starter project specification. The goal remains identical to orbit c71c2625, but execution may differ based on lessons learned.

### No Other Related Orbits

Repository contains no other ORBITAL artifacts. This is the full orbit history for this project.

## Risk Assessment

### Risk 1: OrbitControls Import Path Incompatibility
**Severity:** High  
**Probability:** Low (if using Three.js 0.160.0+)  
**Impact:** Runtime module resolution error, controls non-functional

**Technical Root Cause:**
Three.js 0.160.0 moved addon modules from `/examples/js/` to `/examples/jsm/` and converted them from UMD to ES6 modules. Import paths changed:
- Old: `'three/examples/js/controls/OrbitControls'` (no `.js` extension)
- New: `'three/examples/jsm/controls/OrbitControls.js'` (with `.js` extension)

**Failure Mode:**
```javascript
// If using old path:
import { OrbitControls } from 'three/examples/js/controls/OrbitControls';

// Browser console error:
Failed to resolve module specifier "three/examples/js/controls/OrbitControls". 
Relative references must start with either "/", "./", or "../".
```

**Mitigation Strategy:**
- Use exact path: `three/examples/jsm/controls/OrbitControls.js`
- Include `.js` file extension (required for Vite's ES module resolution)
- Verify against Three.js 0.160.0+ documentation at threejs.org

**Detection Method:**
- Browser console will show `ERR_MODULE_NOT_FOUND` or similar if path is incorrect
- Visual test: mouse drag should rotate camera without console errors

**Rollback Plan:**
If import fails, temporarily inline basic camera controls (adds ~15 lines to `main.js`, still under 100-line budget).

---

### Risk 2: Missing `controls.update()` in Animation Loop
**Severity:** Medium  
**Probability:** Medium  
**Impact:** Camera controls feel "sticky" or unresponsive, degrades UX

**Technical Root Cause:**
OrbitControls with `enableDamping = true` requires `controls.update()` to be called every frame to interpolate camera position smoothly. Without it:
- Damping calculations don't execute
- Camera position updates only on mouse events (not every frame)
- Results in jerky, non-smooth camera movement

**Failure Mode:**
```javascript
// Damping enabled but update() missing:
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // ← Requires update() every frame

function animate() {
  requestAnimationFrame(animate);
  // controls.update();  ← MISSING
  renderer.render(scene, camera);
}
```

**User Experience Impact:**
- Mouse drag works but camera "snaps" instead of smoothly following
- Camera continues drifting after mouse release (momentum feels wrong)
- Violates Intent requirement for "smooth, interactive 3D scene"

**Mitigation Strategy:**
- Always call `controls.update()` before `renderer.render()` in animation loop
- Make damping explicit in code: `controls.enableDamping = true;` (not default)
- Sequence: rotate cube → update controls → render scene

**Detection Method:**
Manual testing: drag mouse to rotate camera. If movement feels "snappy" or "jerky" instead of smooth, `update()` is missing.

**Rollback Plan:**
If UX is poor, disable damping: `controls.enableDamping = false;` (eliminates need for `update()` call, but less smooth).

---

### Risk 3: CSS Reset Incomplete → Scrollbars Appear
**Severity:** Medium  
**Probability:** Medium  
**Impact:** Violates "no scrollbars" acceptance criterion, obvious visual defect

**Technical Root Cause:**
Browsers apply default styles that create scrollable overflow:
- Chrome/Firefox: `body { margin: 8px; }`
- Canvas elements: `display: inline;` (creates 4px descender space)
- HTML/body: No explicit height (collapses to content size)

**Failure Scenarios:**

| Missing CSS Rule | Visual Bug |
|------------------|------------|
| No `* { margin: 0; }` | 8px white border around canvas, both scrollbars appear |
| No `overflow: hidden` | Tiny scrollable area (1-2px) triggers scrollbars |
| No `#app { display: block; }` | 4px vertical gap below canvas, vertical scrollbar appears |
| No `height: 100%` on html/body | Canvas height collapses to 0px (invisible) |

**Mitigation Strategy:**
- Use complete CSS reset from Pattern Library (universal selector + full-height chain)
- Test in multiple browsers (Chrome, Firefox, Safari) as default margins vary
- Validate that `document.documentElement.scrollHeight === window.innerHeight` (no overflow)

**Detection Method:**
Visual inspection: open in browser at various window sizes, check for any scrollbars (horizontal or vertical).

**Rollback Plan:**
If scrollbars persist, use nuclear option: `#app { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; }` (guaranteed full-viewport but breaks document flow).

---

### Risk 4: Aspect Ratio Not Updated on Window Resize
**Severity:** High  
**Probability:** Low  
**Impact:** Cube appears distorted (stretched/squashed) after resizing window

**Technical Root Cause:**
Three.js `PerspectiveCamera` caches projection matrix based on aspect ratio. If window resizes:
1. Canvas dimensions change (`renderer.setSize()` updates this)
2. Camera aspect ratio must change to match new canvas shape
3. **Critical:** Projection matrix must be recomputed via `camera.updateProjectionMatrix()`

**Failure Mode:**
```javascript
// Aspect updated but projection matrix not recomputed:
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();  ← MISSING
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Visual Impact:**
- Resize browser window (drag corner, maximize, restore)
- Cube no longer appears as a cube (stretched into rectangular prism)
- Violates Intent acceptance criterion "Canvas reflows without distortion"

**Mitigation Strategy:**
- Always call `camera.updateProjectionMatrix()` immediately after updating `camera.aspect`
- Sequence: update aspect → update matrix → resize renderer
- Test by resizing window to extreme aspect ratios (wide, tall)

**Detection Method:**
Resize browser window and visually confirm cube maintains 1:1:1 proportions (perfect cube, not stretched).

**Rollback Plan:**
If distortion occurs, verify `updateProjectionMatrix()` is present and sequenced correctly in resize handler.

---

### Risk 5: MeshStandardMaterial Renders Black (Missing Lights)
**Severity:** High  
**Probability:** Low (lights explicitly added in pattern)  
**Impact:** Cube invisible or appears as black silhouette, looks like rendering failure

**Technical Root Cause:**
`MeshStandardMaterial` is a physically-based material that simulates real-world lighting. It requires lights in the scene to be visible:
- Without lights: Material absorbs all light (renders black)
- With lights: Material reflects light based on surface properties (visible color/shading)

This differs from `MeshBasicMaterial`, which ignores lights and always renders at full color.

**Failure Mode:**
```javascript
// Cube created but no lights in scene:
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// scene.add(ambientLight);     ← MISSING
// scene.add(directionalLight); ← MISSING

renderer.render(scene, camera);  // Cube renders black
```

**Visual Impact:**
- Scene renders (no errors)
- Canvas shows dark background (correct)
- Cube is completely black (incorrect — should be green with shading)

**Mitigation Strategy:**
- Add both `AmbientLight` (base illumination) and `DirectionalLight` (directional highlights)
- Light intensity: 0.5 each (total 1.0 combined)
- Position directional light away from origin: `(5, 5, 5)` creates visible shading gradient
- Add lights to scene BEFORE calling `animate()` function

**Detection Method:**
Visual inspection: cube should show color gradient from light to dark faces. If entire cube is same flat black, lights are missing.

**Rollback Plan:**
If cube is black, temporarily switch to `MeshBasicMaterial({ color: 0x00ff00 })` for debugging (ignores lights, always visible).

---

### Risk 6: Line Count Exceeds 100 Lines in `src/main.js`
**Severity:** Low  
**Probability:** Low (current estimate: ~40 lines)  
**Impact:** Violates code quality acceptance criterion, requires refactoring

**Technical Root Cause:**
Verbose coding practices:
- Inline comments explaining each step
- Helper functions for repeated logic
- Excessive whitespace between statements
- Multi-line function call formatting

**Failure Mode:**
```javascript
// Verbose style (150+ lines):

// Initialize the Three.js scene
const scene = new THREE.Scene();

// Set the background color to dark blue-gray
scene.background = new THREE.Color(0x1a1a2e);

// Create a perspective camera
const camera = new THREE.PerspectiveCamera(
  75,                              // Field of view
  window.innerWidth / window.innerHeight,  // Aspect ratio
  0.1,                             // Near clipping plane
  1000                             // Far clipping plane
);

// ... (pattern continues for all setup code)
```

**Current Line Budget:**
- Implementation code: ~33 lines
- Section separators (blank lines): ~8 lines
- **Total: ~41 lines** (59% under budget)

**Mitigation Strategy:**
- No inline comments (code is self-documenting)
- No helper functions (inline all logic)
- Minimal whitespace (1 blank line between sections only)
- Compact but readable function calls

**Detection Method:**
Automated line count: `wc -l src/main.js` must return ≤ 100.

**Rollback Plan:**
If approaching limit:
1. Remove all section separator blank lines (saves ~8 lines)
2. Combine related single-line statements (saves ~5 lines)
3. Still have 72% headroom before hitting 100-line limit

---

### Risk 7: Vite Dev Server Fails to Start
**Severity:** Low  
**Probability:** Very Low  
**Impact:** Blocks manual testing, does not affect production build

**Technical Root Causes:**
- Port 5173 already in use by another process
- Missing `node_modules/` (requires `npm install`)
- Node.js version < 18.0.0 (Vite 5.x requirement)
- Corrupted package-lock.json or node_modules

**Failure Modes:**

| Cause | Error Message | Fix |
|-------|---------------|-----|
| Port in use | `EADDRINUSE: address already in use :::5173` | Vite auto-increments to 5174, 5175, etc. |
| Missing dependencies | `Cannot find module 'vite'` | Run `npm install` |
| Old Node.js | `Error: Node.js version 16.x is not supported` | Upgrade to Node.js 18+ |

**Mitigation Strategy:**
- `package.json` already includes `"engines": { "node": ">=18.0.0" }` to enforce runtime version
- Vite handles port conflicts automatically (increments port number, logs to console)
- Document that `npm install` is required before `npm run dev` (standard practice)

**Detection Method:**
Run `npm run dev` and verify terminal output shows:
```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Rollback Plan:**
If server fails:
1. Check Node.js version: `node --version` (must be ≥18.0.0)
2. Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`
3. Kill conflicting process on port 5173 (or let Vite use alternate port)