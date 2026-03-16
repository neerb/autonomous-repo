# Context Package: Three.js Minimal Starter Project

## Codebase References

### Files to Create
| File Path | Purpose | Current State |
|-----------|---------|---------------|
| `./index.html` | HTML entry point that mounts the Three.js canvas | Does not exist — must be created |
| `./src/main.js` | Scene initialization, render loop, and event handlers | Does not exist — must be created |
| `./src/style.css` | CSS reset and full-viewport canvas styling | Does not exist — must be created |
| `./package.json` | Dependency declarations and npm scripts | **Exists** — requires validation against Intent requirements |

### Files to Preserve
| File Path | Purpose | Action Required |
|-----------|---------|-----------------|
| `./README.md` | Project description | No modification — contains minimal placeholder text |
| `./.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/*` | ORBITAL metadata from prior orbit | No modification — do not touch |

### Existing `package.json` Analysis
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

**Validation Status:**
- ✅ `"type": "module"` — enables ES6 imports in Node.js context (required for Vite)
- ✅ `"scripts.dev": "vite"` — matches Intent requirement for dev script
- ✅ `"dependencies.three": "^0.160.0"` — meets Intent requirement for latest stable
- ✅ `"devDependencies.vite": "^5.0.0"` — meets Intent requirement
- ✅ `"engines.node": ">=18.0.0"` — satisfies Vite 5.x requirement

**Conclusion:** Existing `package.json` is compliant with all Intent constraints. No modifications required.

### Repository Root Structure
```
/                          (repository root)
├── .orbital/              (ORBITAL system metadata — do not modify)
├── README.md              (minimal placeholder)
├── package.json           (✅ compliant, no changes needed)
├── index.html             (❌ missing — must create)
└── src/
    ├── main.js            (❌ missing — must create)
    └── style.css          (❌ missing — must create)
```

**Directory Creation:** The `src/` directory does not currently exist. Must be created before writing `main.js` and `style.css`.

## Architecture Context

### Project Type: Greenfield Static Site
This is a **net-new project initialization** with no legacy code, no migration constraints, and no existing architecture to preserve. The architecture is intentionally minimal to serve as a learning foundation.

### Build System: Vite Zero-Config Pattern
**Vite's Default Behavior (relevant to this orbit):**
- **Entry Point Discovery:** Vite automatically serves `index.html` at the root as the entry point when running `vite` (or `npm run dev`)
- **Module Resolution:** Resolves bare module specifiers (e.g., `import * as THREE from 'three'`) to `node_modules/` without requiring import maps or config files
- **HMR Boundary:** Changes to `.js` files in `src/` trigger hot module replacement without full page reload
- **CSS Injection:** Imported CSS files are injected as `<style>` tags in development mode
- **No Build Output:** Dev mode runs an in-memory server — no `dist/` folder until production build

**Critical Vite + Three.js Integration Point:**
Three.js 0.160.0+ uses ES6 modules with the following import structure:
```javascript
import * as THREE from 'three';                           // Core library
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';  // Addons
```

Vite resolves both paths correctly because:
1. `package.json` contains `"type": "module"` (enables ES6 in Node.js context)
2. Three.js `package.json` includes proper `"exports"` field mapping `/examples/jsm/*` paths

**Consequence:** No `vite.config.js` file is needed. Any configuration beyond defaults would violate the Intent constraint "Must use Vite's default configuration without custom plugins or config files."

### Runtime Environment: Browser WebGL Context
**Target Platform:** Modern web browsers with WebGL 2.0 support (95%+ of desktop/mobile browsers as of 2024)

**Key Browser APIs Used:**
- **WebGL 2.0:** Three.js `WebGLRenderer` requires WebGL context for GPU-accelerated 3D rendering
- **`requestAnimationFrame`:** Syncs render loop to browser's repaint cycle (typically 60Hz on most displays)
- **`window.innerWidth` / `window.innerHeight`:** Queried for initial canvas size and on resize events
- **`window.addEventListener('resize', ...)`:** Handles viewport dimension changes

**No Server-Side Rendering:** This is a client-only application. All Three.js code executes in the browser. Vite dev server only serves static files and handles HMR websocket connections.

### Data Flow: Single-Direction Render Pipeline
```
User Input (mouse drag)
  ↓
OrbitControls updates camera position
  ↓
requestAnimationFrame callback
  ↓
Update cube rotation (mesh.rotation.x += delta, mesh.rotation.y += delta)
  ↓
renderer.render(scene, camera)
  ↓
GPU renders frame to <canvas> element
  ↓
Browser composites canvas to viewport
```

**No State Management:** No Redux, Zustand, or observables. All state lives in Three.js object properties (e.g., `mesh.rotation`, `camera.position`).

**No Network Requests:** Scene initializes synchronously from in-memory geometry. No XHR, no fetch, no WebSocket (aside from Vite's HMR connection in dev mode).

### Scene Graph Structure
Three.js uses a hierarchical scene graph pattern:
```
Scene (root container)
├── PerspectiveCamera (viewing frustum)
├── Mesh (cube)
│   ├── BoxGeometry (vertex positions)
│   └── MeshStandardMaterial (surface properties)
├── AmbientLight (uniform illumination)
└── DirectionalLight (directional illumination)
```

**OrbitControls Side Effect:** Attached to camera but not part of scene graph. Modifies `camera.position` and `camera.rotation` properties in response to mouse events.

## Pattern Library

### HTML Entry Point Pattern
**Standard Vite + Three.js HTML Structure:**
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

**Key Points:**
- `<link rel="stylesheet" href="/src/style.css">` — Vite resolves this path relative to project root
- `<script type="module" src="/src/main.js">` — Enables ES6 imports in browser
- `<canvas id="app"></canvas>` — Manual canvas element (Three.js will attach renderer to this via `document.querySelector()`)

**Anti-Pattern to Avoid:** Do not let Three.js auto-create the canvas via `renderer.domElement` without a mount point. This makes CSS styling harder and violates the "full-viewport canvas" requirement.

### CSS Reset Pattern for Full-Viewport Canvas
**Required CSS to eliminate scrollbars and whitespace:**
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

**Why Each Rule Matters:**
- `* { margin: 0; padding: 0; }` — Removes default browser margins (especially on `<body>`)
- `overflow: hidden` on `html, body` — Prevents scrollbars if content overflows
- `display: block` on `#app` — Canvas elements are inline by default, which adds 4px descender space
- `width: 100%; height: 100%` on all elements — Ensures canvas fills viewport without gaps

**Anti-Pattern to Avoid:** Using `position: fixed` on canvas. This works but breaks document flow and can cause issues with future UI overlays.

### Three.js Initialization Pattern
**Standard Setup Sequence (must occur in this order):**
```javascript
// 1. Create scene (container for all 3D objects)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 2. Create camera (defines viewing frustum)
const camera = new THREE.PerspectiveCamera(
  75,                                  // FOV in degrees
  window.innerWidth / window.innerHeight,  // Aspect ratio
  0.1,                                 // Near clipping plane
  1000                                 // Far clipping plane
);
camera.position.z = 5;

// 3. Create renderer (manages WebGL context)
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#app') 
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 4. Add geometry + material = mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Add lights (required for MeshStandardMaterial to be visible)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 6. Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

// 7. Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

// 8. Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Critical Ordering Dependencies:**
- Scene must exist before adding objects to it
- Camera must exist before passing to `renderer.render()`
- Renderer must be created before OrbitControls (controls need `renderer.domElement`)
- Lights must be added to scene before rendering (otherwise MeshStandardMaterial renders black)
- `camera.updateProjectionMatrix()` must be called after changing `camera.aspect`

### OrbitControls Integration Pattern
**Import Path (Three.js 0.160.0+):**
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Instantiation:**
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Optional: smooth camera movement
```

**Animation Loop Integration:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update();  // Required if enableDamping is true
  renderer.render(scene, camera);
}
```

**Common Mistake:** Forgetting to call `controls.update()` in the animation loop. This breaks damping and can cause camera drift.

### Line Count Optimization Patterns
To stay under 100 lines, apply these techniques:
1. **No Comments:** Omit inline comments (code should be self-documenting via naming)
2. **Compact Initialization:** Combine related operations (e.g., `scene.background = new THREE.Color(0x1a1a2e)` on same line as scene creation)
3. **Single-Line Function Calls:** Use newlines only for logical grouping, not per-argument formatting
4. **No Helper Functions:** Inline all logic into main scope and animation loop
5. **No Error Handling:** Assume happy path (no try/catch blocks)

**Example of Compact Style:**
```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```

## Prior Orbit References

### Orbit 1 Context (UUID: c71c2625-0f6b-441c-a24b-a5d187d1ae16)
**Artifacts Present:**
- `intent_document.md`
- `context_package.md`
- `proposal_record.md`
- `verification_protocol.md`
- `code_generation.md`
- `test_results.md`

**Status:** Orbit 1 appears to be complete (all 6 expected artifacts exist). However, the current state of the repository root shows:
- ✅ `package.json` exists and is properly configured
- ❌ `index.html` does not exist
- ❌ `src/main.js` does not exist
- ❌ `src/style.css` does not exist

**Inference:** Orbit 1 likely generated the `package.json` but did not generate the HTML/JS/CSS implementation files, OR those files were generated but not committed/pushed to the repository. The `.orbital/artifacts/` folder contains metadata and possibly generated code in `code_generation.md`, but the working tree does not reflect those files.

**Implication for Current Orbit:** This is effectively a fresh implementation. Do not assume any file content exists beyond `package.json`. Treat `index.html`, `src/main.js`, and `src/style.css` as net-new file creation tasks.

### No Other Orbits
The repository contains only artifacts from orbit `c71c2625-0f6b-441c-a24b-a5d187d1ae16`. No prior attempts to implement Three.js scenes, no legacy rendering code, no deprecated patterns to avoid.

## Risk Assessment

### Risk 1: OrbitControls Import Path Incompatibility
**Severity:** High  
**Likelihood:** Medium

**Description:**  
Three.js 0.160.0+ moved addon modules from `/examples/js/` to `/examples/jsm/`. Using the old path (`three/examples/js/controls/OrbitControls`) will cause a runtime module resolution error:
```
Failed to resolve module specifier "three/examples/js/controls/OrbitControls"
```

**Impact:**
- Scene renders without camera controls (cube visible but not interactive)
- Browser console shows module load failure
- Violates Intent acceptance criterion "Zero JavaScript errors in browser console"

**Mitigation:**
- Use exact import path: `three/examples/jsm/controls/OrbitControls.js` (note `.js` extension)
- Verify against Three.js 0.160.0+ documentation at threejs.org
- Test import in browser dev tools before finalizing code

**Detection:**
Browser console will show `ERR_MODULE_NOT_FOUND` or similar if path is incorrect.

---

### Risk 2: Missing `controls.update()` in Animation Loop
**Severity:** Medium  
**Likelihood:** High

**Description:**  
OrbitControls requires `controls.update()` to be called in the animation loop if damping is enabled (common UX pattern for smooth camera movement). Forgetting this call causes:
- Camera controls to feel "sticky" or unresponsive
- Camera position to drift after mouse release
- Potential memory leaks from uncleared event listeners

**Impact:**
- Degrades user experience (violates Intent "smooth, interactive 3D scene")
- Does not cause runtime errors (silent failure)
- May pass automated tests but fail human validation

**Mitigation:**
- Always call `controls.update()` before `renderer.render()` in animation loop
- Set `controls.enableDamping = true` explicitly to make requirement visible in code

**Detection:**
Human tester will notice camera controls feel "snappy" or "jerky" instead of smooth.

---

### Risk 3: CSS Overflow Causing Scrollbars
**Severity:** Medium  
**Likelihood:** Medium

**Description:**  
If CSS reset is incomplete, the browser may add:
- Default 8px margin on `<body>` (creates small scrollable area)
- Inline canvas element with 4px descender space (causes vertical scrollbar)
- Browser-specific padding on `<html>` element

**Impact:**
- Violates Intent acceptance criterion "Canvas coverage: 3D canvas must fill 100% of viewport width and height with no scrollbars"
- Visible scrollbars in viewport
- Canvas dimensions do not match `window.innerWidth/innerHeight`

**Mitigation:**
- Use universal selector reset: `* { margin: 0; padding: 0; }`
- Set `overflow: hidden` on `html, body`
- Set `display: block` on `#app` canvas element
- Test in multiple browsers (Chrome, Firefox, Safari) as default margins vary

**Detection:**
Visual inspection: if scrollbars appear, CSS reset is incomplete.

---

### Risk 4: Aspect Ratio Not Updated on Window Resize
**Severity:** High  
**Likelihood:** Low

**Description:**  
If the resize event handler does not call `camera.updateProjectionMatrix()` after changing `camera.aspect`, the camera's projection matrix becomes stale. This causes:
- 3D scene to appear stretched or squashed after resize
- Cube appears as a rectangular prism instead of a cube
- Violates Intent acceptance criterion "Window resize: Canvas reflows to new viewport dimensions without distortion"

**Impact:**
- Breaks visual fidelity on any viewport size change (maximizing window, responsive testing, device rotation on mobile)
- Obvious visual bug (cube looks wrong)

**Mitigation:**
- Always call `camera.updateProjectionMatrix()` after modifying `camera.aspect`
- Follow exact pattern:
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();  // Critical line
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Detection:**
Resize browser window — if cube appears distorted (not a perfect cube), projection matrix was not updated.

---

### Risk 5: Line Count Exceeding 100 Lines in `src/main.js`
**Severity:** Low  
**Likelihood:** Medium

**Description:**  
Intent constraint "Keep it under 100 lines of JS total" is a hard limit. Exceeding this violates a MUST Pass acceptance criterion. Common causes:
- Adding comments or docstrings
- Verbose variable names or whitespace padding
- Helper functions for repeated logic
- Multiple event listeners with long callback bodies

**Impact:**
- Fails code quality acceptance gate
- Requires refactoring to trim lines
- May force removal of useful comments or readability improvements

**Mitigation:**
- Count lines continuously during implementation
- Use compact coding style (no comments, minimal whitespace, single-line statements where readable)
- Inline all logic (no helper functions)
- Test that wc -l src/main.js returns ≤ 100

**Detection:**
Automated line count check: `wc -l src/main.js` or equivalent.

---

### Risk 6: MeshStandardMaterial Rendering Black (Missing Lights)
**Severity:** High  
**Likelihood:** Medium

**Description:**  
`MeshStandardMaterial` is a physically-based material that requires lights to be visible. If lights are not added to the scene (or added after the first render), the cube will appear as a black silhouette. This is different from `MeshBasicMaterial`, which ignores lights.

**Impact:**
- Violates Intent visual requirement "Cube material: MeshStandardMaterial with visible light reflections"
- Scene renders but cube is not visible (looks like a rendering failure)
- Common mistake for developers familiar with older Three.js materials

**Mitigation:**
- Add both `AmbientLight` (base illumination) and `DirectionalLight` (directional highlights) to scene before first render
- Use moderate intensity values (0.5 for each light is a safe starting point)
- Position `DirectionalLight` away from origin (e.g., `(5, 5, 5)`) to create visible shading gradient

**Detection:**
Visual inspection: cube should show color gradients from light to dark. If entire cube is same flat color, lights are missing or misconfigured.

---

### Risk 7: Vite Dev Server Port Conflict
**Severity:** Low  
**Likelihood:** Low

**Description:**  
Vite defaults to port 5173. If another process is using this port, `npm run dev` will either:
- Fail with "EADDRINUSE" error
- Automatically select next available port (5174, 5175, etc.)

**Impact:**
- Developer confusion if port changes unexpectedly
- Does not affect runtime behavior (only affects dev server startup)
- No impact on production build

**Mitigation:**
- Document that default port is 5173 (no action needed in code)
- Vite automatically handles port conflicts by incrementing port number
- No configuration needed (accepting default behavior aligns with "no config files" constraint)

**Detection:**
Terminal output will show "Local: http://localhost:5173" or incremented port if conflict exists.