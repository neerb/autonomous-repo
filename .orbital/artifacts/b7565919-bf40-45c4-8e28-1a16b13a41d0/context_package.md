# Context Package: Three.js Minimal Starter Project

## Codebase References

### Existing Files to Modify

**`package.json` (root)**
- Current state: Already contains `three@^0.160.0`, `vite@^5.0.0`, and `dev` script
- Required changes: None — file already matches Intent requirements
- Note: `"type": "module"` enables ES6 imports without file extensions

**`index.html` (root)**
- Current state: Exists but content unknown
- Required changes: Must load `src/main.js` as ES module and reference `src/style.css`
- Expected structure: Minimal HTML5 boilerplate with `<div id="app">` or direct `<canvas>` mount point

**`src/main.js` (root/src/)**
- Current state: Exists but content unknown
- Required changes: Complete rewrite to implement scene, camera, renderer, lights, cube, controls, animation loop
- Line budget: Must stay under 100 lines (excluding blank lines and comments per Intent acceptance criteria)

**`src/style.css` (root/src/)**
- Current state: Exists but content unknown
- Required changes: Must implement full-viewport canvas with zero margin/padding/overflow
- Critical CSS rules: `body { margin: 0; }`, `canvas { display: block; width: 100vw; height: 100vh; }`

### Files Not to Touch

**`.orbital/artifacts/**`
- Contains ORBITAL system metadata — do not modify or reference in application code
- These files exist in the repository but are not part of the Three.js starter project

**`README.md` (root)**
- Currently contains placeholder text "Testing purposes"
- Out of scope for this orbit — Intent does not require documentation updates

## Architecture Context

### Build System Integration

**Vite ES Module Resolution:**
- Vite automatically resolves `import * as THREE from 'three'` to `node_modules/three/build/three.module.js`
- OrbitControls must be imported from Three.js examples: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- No Vite configuration file (`vite.config.js`) required — defaults are sufficient for this project

**Module Execution Context:**
- `package.json` specifies `"type": "module"` — all `.js` files treated as ES modules
- `index.html` must load `src/main.js` with `<script type="module">`
- No CommonJS (`require()`) syntax allowed

### Three.js Scene Graph Structure

**Required Object Hierarchy:**
```
Scene (root)
├── PerspectiveCamera (positioned to view origin)
├── AmbientLight (provides base illumination)
├── DirectionalLight (creates shadows/contrast on cube faces)
└── Mesh
    ├── BoxGeometry (cube shape)
    └── MeshStandardMaterial (responds to lights)
```

**Coordinate System:**
- Three.js uses right-handed coordinate system (X right, Y up, Z toward viewer)
- Camera must be positioned on positive Z axis (e.g., `camera.position.z = 5`) to see objects at origin
- OrbitControls default target is `(0, 0, 0)` — matches cube center position

### Rendering Pipeline

**WebGLRenderer Configuration:**
- Must call `renderer.setSize(window.innerWidth, window.innerHeight)` on init and resize
- Must call `renderer.setPixelRatio(window.devicePixelRatio)` for sharp rendering on high-DPI displays
- Background color set via `renderer.setClearColor(0x1a1a2e)` per Intent visual requirements
- Renderer must append its canvas to `document.body` or mount to existing element

**Animation Loop Pattern:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update object rotations
  // Update controls (if controls.update() needed)
  renderer.render(scene, camera);
}
```

### Window Lifecycle Management

**Resize Handling:**
- Must attach `window.addEventListener('resize', ...)` to update camera aspect ratio and renderer size
- Camera aspect must recalculate: `camera.aspect = window.innerWidth / window.innerHeight`
- Must call `camera.updateProjectionMatrix()` after aspect change
- Vite hot module replacement (HMR) will preserve event listeners during development

## Pattern Library

### Three.js Import Conventions

**Core Library Import:**
```javascript
import * as THREE from 'three';
// Access as THREE.Scene(), THREE.PerspectiveCamera(), etc.
```

**Named Imports from Examples:**
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Note: Full path with .js extension required for Vite compatibility
```

### Functional Programming Pattern

**Intent Constraint: No Classes**
- All code must use functional declarations: `function init() { ... }` or `const init = () => { ... }`
- Scene setup, object creation, and event handlers should be standalone functions or inline code
- OrbitControls is a class internally but consumed as: `const controls = new OrbitControls(camera, renderer.domElement)`

### Variable Scoping Strategy

**Module-Level Scope:**
```javascript
// Top-level variables for objects that persist across animation frames
let scene, camera, renderer, cube, controls;

function init() {
  scene = new THREE.Scene();
  // ...
}
```

**Function-Level Scope:**
- Geometry, material, and light objects can be const within init function if not accessed in animate loop
- Only objects modified in `animate()` (cube rotation) need module-level scope

### Minimal CSS Reset Pattern

**Full-Viewport Canvas (standard pattern for Three.js demos):**
```css
body {
  margin: 0;
  overflow: hidden; /* Prevents scrollbars during resize */
}

canvas {
  display: block; /* Removes inline element spacing */
}
```

### HTML5 Module Loading Pattern

**Standard Vite Entry Point:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="/src/style.css">
  <title>Three.js Starter</title>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

## Prior Orbit References

### Orbit History Analysis

**Repository State:**
- `.orbital/artifacts/` contains 6 prior orbit artifact sets (UUIDs: 301f1e8d, 7e840ae3, a6b4c09a, ad0a63a2, b7565919, c71c2625)
- Most recent complete orbit: `c71c2625` (contains all 4 artifacts including verification_protocol.md and test_results.md)
- No prior orbits directly relate to Three.js or Vite — all appear to be ORBITAL system meta-work

**Relevant Insights:**
- This repository has been used for ORBITAL testing/demonstration purposes (per README.md)
- No established architectural patterns or code conventions to inherit from prior orbits
- Current `package.json` and file structure suggest a prior incomplete attempt at the Three.js starter (dependencies exist but `index.html`, `src/main.js`, `src/style.css` content unverified)

**Lessons from Repository State:**
- Existing `package.json` matches Intent requirements exactly — suggests prior human or AI setup
- Presence of `src/` directory indicates correct project structure already scaffolded
- No conflicting dependencies (no React, Vue, TypeScript configs) — clean slate for vanilla JS implementation

### Related Technology Patterns

**Three.js r160 Specifics:**
- Version 0.160.0 (December 2023 release) uses modern ES6 module exports
- `OrbitControls` in r160 requires manual `controls.update()` call in animation loop if `enableDamping` enabled
- `MeshStandardMaterial` in r160 defaults to `color: 0xffffff`, `roughness: 1`, `metalness: 0`

**Vite 5.0 Behavior:**
- Default dev server port: 5173
- Automatically opens browser on `npm run dev` (configurable via `vite.config.js` but not needed here)
- HMR enabled by default for `.js` and `.css` files
- No build step required for development — serves ES modules directly with on-demand transformation

## Risk Assessment

### Technical Risks

**Risk: OrbitControls Import Path Failure**
- **Likelihood:** Medium — Three.js examples path changed between versions, documentation inconsistent
- **Impact:** High — Application will not load, blocking all acceptance criteria
- **Mitigation:** Use exact path `'three/examples/jsm/controls/OrbitControls.js'` verified for Three.js r160+
- **Detection:** Vite dev server will show 404 error in browser console if path incorrect

**Risk: Line Count Exceeds 100 Lines**
- **Likelihood:** Medium — Required features (scene, camera, renderer, 2 lights, cube, controls, resize handler, animation loop) push boundaries
- **Impact:** Medium — Violates Intent acceptance criteria but code will function
- **Mitigation:** Inline variable declarations, eliminate unnecessary comments, use compact arrow functions
- **Detection:** Manual count excluding blank lines and comments per Intent definition

**Risk: Animation Performance Below 60fps**
- **Likelihood:** Low on target hardware, Medium on low-end devices
- **Impact:** Low — Intent accepts frame drops on low-end hardware if renderer functional
- **Mitigation:** Simple geometry (BoxGeometry with default segments), no textures, no complex materials
- **Detection:** Browser DevTools Performance tab or `stats.js` library (not included in this project)

**Risk: Canvas Rendering Issues on Initial Load**
- **Likelihood:** Low — Standard Three.js pattern is well-tested
- **Impact:** High — Black screen violates Intent acceptance criterion
- **Mitigation:** Ensure `renderer.setSize()` called before first render, camera positioned on positive Z axis
- **Detection:** Visual inspection in browser, check WebGL context creation in console

### Dependency Risks

**Risk: Three.js Version Incompatibility**
- **Likelihood:** Low — r160 is stable release from December 2023
- **Impact:** Medium — API changes could break OrbitControls or renderer methods
- **Mitigation:** Use caret range `^0.160.0` to allow patch updates but lock minor version
- **Detection:** `npm install` warnings or runtime errors during development

**Risk: Vite Version Breaking Changes**
- **Likelihood:** Low — Vite 5.0 stable, default config sufficient for this project
- **Impact:** Medium — Dev server may fail to start or serve incorrect MIME types
- **Mitigation:** Use caret range `^5.0.0`, no custom configuration to minimize surface area
- **Detection:** `npm run dev` fails with error message

**Risk: Node.js Version Below 18.0.0**
- **Likelihood:** Medium — Developers may have older Node installed
- **Impact:** High — Vite 5.0 requires Node 18+, `npm install` will fail
- **Mitigation:** `package.json` already specifies `"engines": { "node": ">=18.0.0" }`
- **Detection:** npm will warn on `npm install` if Node version incompatible

### Scope Risks

**Risk: Feature Creep Beyond Intent Constraints**
- **Likelihood:** Low — Intent is explicit about non-goals (no TypeScript, no frameworks, no asset loading)
- **Impact:** Medium — Adds complexity that violates "under 100 lines" constraint
- **Mitigation:** Strict adherence to Intent acceptance boundaries, avoid "nice-to-have" additions
- **Detection:** Code review against Intent constraints section

**Risk: Over-Engineering Visual Parameters**
- **Likelihood:** Medium — Temptation to tune lighting, camera FOV, rotation speed beyond requirements
- **Impact:** Low — Intent accepts default Three.js parameters if they produce visible contrast
- **Mitigation:** Use reasonable defaults (camera FOV 75, position z=5, rotation speed 0.01), avoid premature optimization
- **Detection:** Visual inspection confirms cube is visible and distinguishable per Intent

### Integration Risks

**Risk: Existing File Content Conflicts**
- **Likelihood:** Medium — `index.html`, `src/main.js`, `src/style.css` exist but content unknown
- **Impact:** Medium — May contain partial implementation or conflicting code
- **Mitigation:** Treat all files as complete rewrites, do not assume any existing implementation is correct
- **Detection:** Verify current file state before proposing changes in Proposal Record phase

**Risk: ORBITAL Artifact Pollution**
- **Likelihood:** Low — `.orbital/` directory clearly separate from application code
- **Impact:** Low — No functional impact but could confuse repository structure understanding
- **Mitigation:** Explicitly exclude `.orbital/` from all application file operations
- **Detection:** Repository structure audit shows no imports or references to `.orbital/` in application code