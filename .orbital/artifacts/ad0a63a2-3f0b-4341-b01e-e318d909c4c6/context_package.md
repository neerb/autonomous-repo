# Context Package: Three.js Minimal Starter Project

## Codebase References

### Existing Project Structure
The repository currently contains a partially implemented Three.js starter with the following files:

- **`package.json`** (root) — Defines project metadata, dependencies, and npm scripts. Already configured with `"type": "module"` for ESM support, `three@^0.160.0`, `vite@^5.0.0`, and a `dev` script pointing to `vite`. Node.js engine requirement set to `>=18.0.0`.

- **`index.html`** (root) — HTML entry point expected by Vite. Current state unknown but must exist to serve as the container for the Three.js canvas.

- **`src/main.js`** — Primary JavaScript module for scene initialization and render loop. Current state unknown but this is where all Three.js logic must reside under the 100-line constraint.

- **`src/style.css`** — Stylesheet for viewport configuration. Must eliminate default body margins, set canvas to 100vw/100vh, and prevent scrollbars.

- **`README.md`** — Currently contains only "# autonomous-repo" and "Testing purposes". Should be preserved as-is per constraints (no documentation requirements specified in Intent).

### Files to Create or Modify
All four primary files (`index.html`, `src/main.js`, `src/style.css`, `package.json`) may need creation or modification. The `package.json` already exists with correct structure but other files' current states are unverified.

### Files to Preserve
- **`.orbital/artifacts/`** — Contains prior orbit artifacts. Must not be modified or removed.
- **`README.md`** — Existing content should remain unchanged unless explicitly updating project documentation (not a requirement).
- **`.git/`** and `.gitignore` (if present) — Version control metadata must be preserved.

## Architecture Context

### Project Topology
This is a **greenfield browser-based rendering application** with no server-side logic, database, or API layer. The entire system consists of:

1. **Static HTML entry point** (`index.html`) that loads the JavaScript module
2. **ES module script** (`src/main.js`) that initializes Three.js and starts the render loop
3. **Global stylesheet** (`src/style.css`) that configures the viewport
4. **Vite dev server** that serves assets, handles HMR, and transpiles ES modules for the browser

### Data Flow
```
Browser Load
    ↓
index.html parsed
    ↓
<script type="module" src="/src/main.js"> loaded
    ↓
Three.js imports resolved by Vite
    ↓
Scene/Camera/Renderer instantiated
    ↓
requestAnimationFrame loop starts
    ↓
Cube rotation + OrbitControls updates every frame
    ↓
WebGLRenderer draws to canvas
```

No external data sources, no state persistence, no network requests. The application is entirely self-contained and stateless.

### Infrastructure Constraints
- **Browser Environment:** WebGL 2.0 required (Chrome 56+, Firefox 51+, Safari 15+). No fallback to WebGL 1.0 or canvas 2D.
- **Build Tool:** Vite handles module resolution, HMR, and serves `index.html` from project root. Vite expects `index.html` at root level (not inside `src/` or `public/`).
- **Module System:** ES modules only (`"type": "module"` in `package.json`). No CommonJS, no UMD bundles.
- **No Configuration Files:** Vite runs with zero config. No `vite.config.js`, no Babel, no PostCSS setup.

### Service Boundaries
Single-boundary system: everything runs in the browser's main thread. No workers, no service workers, no backend services. The only external dependency is the Vite dev server during development.

## Pattern Library

### Three.js Initialization Pattern (Standard Practice)
```javascript
// 1. Scene creation
const scene = new THREE.Scene();

// 2. Camera setup with FOV, aspect ratio, near/far planes
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. Renderer with canvas and options
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);

// 4. Geometry + Material + Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. Lights (AmbientLight + DirectionalLight for StandardMaterial)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 6. OrbitControls
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
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

### HTML Structure Pattern (Vite + Three.js)
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

Note: No `<canvas>` element in HTML — Three.js creates and appends it via `document.body.appendChild(renderer.domElement)`.

### CSS Reset Pattern (Full Viewport Canvas)
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

canvas {
  display: block;
}
```

### Import Path Convention (Three.js ESM)
- Core library: `import * as THREE from 'three';`
- OrbitControls: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';`

Do NOT use `/addons/` path (deprecated), `/examples/js/` (non-ESM), or CDN links.

## Prior Orbit References

### Previous Orbit Artifacts in Repository
The `.orbital/artifacts/` directory contains three prior orbit sequences:

1. **`301f1e8d-e7c8-4301-800b-08068adb2568/`** — Intent, Context, Proposal documents (no verification or code generation artifacts)
2. **`a6b4c09a-283b-48f1-9386-68f4ef295656/`** — Intent, Context, Proposal documents (no verification or code generation artifacts)
3. **`c71c2625-0f6b-441c-a24b-a5d187d1ae16/`** — Complete orbit with Intent, Context, Proposal, Verification Protocol, Code Generation, and Test Results

### Relevant Learnings from Prior Orbits
While the specific content of these artifacts is not accessible in the current context, their presence indicates:

- **Project Already Initialized:** The `package.json` structure matches the requirements (ESM modules, correct dependencies, dev script configured)
- **Vite Configuration Working:** Prior orbits likely validated that `npm run dev` launches successfully
- **File Structure Established:** The presence of `index.html`, `src/main.js`, and `src/style.css` in the repository root suggests prior orbits created these files

**Key Uncertainty:** The current functional state of these files is unknown. They may be:
- Empty placeholders
- Partially implemented (missing OrbitControls, incorrect lighting, etc.)
- Fully implemented but requiring updates to meet the Intent's specific requirements

The Proposal Record must account for both scenarios: building from scratch if files are empty, or correcting/completing existing implementations.

### Pattern Consistency with Prior Work
Given that prior orbits exist in this repository, the implementation should maintain consistency with any established patterns. However, since this is explicitly a "minimal starter" with no framework dependencies, and the constraints prohibit additional complexity, there is little risk of pattern divergence.

## Risk Assessment

### Risk 1: OrbitControls Import Path Error
**Likelihood:** Medium  
**Impact:** High (dev server starts but controls don't work, no console error in some browsers)  
**Scenario:** Using wrong import path like `three/addons/controls/OrbitControls.js` (deprecated) or `three/examples/js/controls/OrbitControls.js` (non-ESM) causes runtime failures.  
**Mitigation:** Use exact path `three/examples/jsm/controls/OrbitControls.js` and verify import in Proposal. Document this in code comments as a common error point.

### Risk 2: MeshStandardMaterial Renders Black Without Lights
**Likelihood:** Medium  
**Impact:** Medium (cube visible but appears as black silhouette, violating acceptance criteria)  
**Scenario:** If lights are missing or misconfigured, `MeshStandardMaterial` defaults to black because it requires lighting to compute surface appearance.  
**Mitigation:** Ensure both `AmbientLight` (base illumination) and `DirectionalLight` (directional shading) are added to scene before first render. Use light intensities of 0.5 and 0.8 respectively to ensure visible depth.

### Risk 3: Window Resize Breaks Canvas Dimensions
**Likelihood:** Low  
**Impact:** Medium (canvas doesn't fill viewport after resize, poor UX)  
**Scenario:** Forgetting to update both camera aspect ratio (`camera.aspect`) and renderer size (`renderer.setSize`) causes stretched or clipped rendering.  
**Mitigation:** Implement resize handler that updates both properties and calls `camera.updateProjectionMatrix()`. Test by manually resizing browser window.

### Risk 4: requestAnimationFrame Loop Not Started
**Likelihood:** Low  
**Impact:** High (cube visible but static, violates core acceptance criteria)  
**Scenario:** Defining `animate()` function but forgetting to invoke it initially means the loop never starts.  
**Mitigation:** Call `animate()` immediately after function definition. This is a one-line footgun that's easy to miss in minimal code.

### Risk 5: Code Exceeds 100-Line Constraint
**Likelihood:** Medium  
**Impact:** Medium (violates explicit constraint, requires refactoring)  
**Scenario:** Adding comments, error handling, or verbose variable names pushes `src/main.js` over 100 lines.  
**Mitigation:** Count lines during implementation. Prioritize terse but readable code. Use single-line imports where possible (`import * as THREE from 'three';` vs multiline destructuring). Limit comments to critical "why" explanations.

### Risk 6: Vite HMR Breaks Three.js Context
**Likelihood:** Low  
**Impact:** Low (dev experience degradation but not a blocker)  
**Scenario:** Hot module replacement causes Three.js to initialize multiple WebGL contexts without disposing old ones, leading to memory leaks during development.  
**Mitigation:** Accept this as a known limitation of HMR with WebGL (manual page refresh may be needed for JS changes). Document in Verification Protocol that HMR works for CSS but may require refresh for JS.

### Risk 7: Missing Antialias Causes Jagged Edges
**Likelihood:** Low  
**Impact:** Low (visual quality issue but not a functional failure)  
**Scenario:** Forgetting `antialias: true` in `WebGLRenderer` options results in blocky, aliased cube edges.  
**Mitigation:** Include `{ antialias: true }` in renderer initialization. This is optional but significantly improves visual quality at negligible performance cost for a single cube.

### Risk 8: CSS Not Loaded Before Canvas Creation
**Likelihood:** Very Low  
**Impact:** Low (brief FOUC, violates "no white flashes" acceptance criterion)  
**Scenario:** If `src/main.js` executes before `src/style.css` loads, there's a frame where default body margins cause white borders.  
**Mitigation:** Link CSS in `<head>` (blocking) and JS in `<body>` (non-blocking). Vite handles this correctly by default, but verify load order in Verification Protocol.

### Security Considerations
**None applicable.** This is a local development environment with no user input, no network requests, no data persistence, and no authentication. WebGL itself has sandboxed security model in browsers. No XSS, CSRF, or injection risks exist in this scope.