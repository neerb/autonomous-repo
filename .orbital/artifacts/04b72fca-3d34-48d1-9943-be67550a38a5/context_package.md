# Context Package: Three.js Starter Project

## Codebase References

### Existing Files Requiring Modification

**`package.json` (root)**
- Current state: Contains correct dependencies (`three: ^0.160.0`, `vite: ^5.0.0`) and dev script
- Modification scope: No changes required — already meets Intent specification
- Critical fields: `"type": "module"` enables ES6 imports, `"engines"` enforces Node 18+

**`README.md` (root)**
- Current state: Documentation exists but describes functionality not yet implemented in code
- Modification scope: Update if implementation deviates from documented behavior (controls, structure)
- Risk: Documentation-code drift if implementation changes OrbitControls configuration

**`index.html` (root)**
- Current state: File exists but content unknown from provided context
- Required structure: HTML5 boilerplate with `<script type="module" src="/src/main.js"></script>` and `<canvas>` or auto-created by Three.js
- Vite requirement: Must reference `/src/main.js` as ES6 module, not traditional `<script src>`

**`src/main.js` (root/src/)**
- Current state: File exists but implementation unknown from provided context
- Required scope: Complete Three.js scene initialization, render loop, OrbitControls setup
- Line count enforcement: Must not exceed 100 lines (excluding blank lines/comments) per Intent constraint
- Critical imports: `three` core exports and `three/examples/jsm/controls/OrbitControls.js`

**`src/style.css` (root/src/)**
- Current state: File exists but content unknown from provided context
- Required rules: `body { margin: 0; padding: 0; overflow: hidden; }` and `canvas { display: block; width: 100vw; height: 100vh; }`
- Purpose: Eliminate default browser margins and ensure canvas fills viewport without scrollbars

### File Creation Requirements

No new files are required — all 4 mandated files already exist in the repository structure. Implementation focuses on ensuring content correctness rather than file scaffolding.

## Architecture Context

### Project Structure Pattern

This is a **client-only web application** with no backend services, following the Vite default directory convention:

```
/                     # Repository root
├── index.html        # Vite entry point (served at /)
├── package.json      # NPM manifest
├── src/              # Source code directory
│   ├── main.js       # Application entry (ES6 module)
│   └── style.css     # Global styles (imported in main.js)
└── .vite/            # Auto-generated build cache (gitignored)
```

### Vite Module Resolution

- **ES6 Module Imports:** Vite natively resolves `import * from 'three'` to `node_modules/three/build/three.module.js`
- **Subpath Imports:** Three.js examples like OrbitControls use deep imports: `three/examples/jsm/controls/OrbitControls.js`
- **No Build Step in Development:** Vite serves modules directly via HTTP/2, transpiling on-the-fly
- **HMR Boundary:** Changes to `.js` or `.css` files trigger hot module replacement without full page reload

### Three.js Scene Graph Architecture

The implementation must establish this object hierarchy:

```
Scene (root container)
├── PerspectiveCamera (positioned to view origin)
├── AmbientLight (global illumination)
├── DirectionalLight (casts shadows, positioned above/side)
└── Mesh (cube geometry + standard material)
```

**Data Flow:**
1. Initialization phase creates all scene objects and configures renderer
2. Window resize handler recalculates camera aspect ratio and renderer size
3. Animation loop (recursive `requestAnimationFrame`) updates mesh rotation and renders frame
4. OrbitControls intercepts mouse events and updates camera transform

### Browser Rendering Pipeline Integration

- **WebGL Context:** `WebGLRenderer` creates GPU rendering context on `<canvas>` element
- **Frame Timing:** `requestAnimationFrame` synchronizes with browser's 60Hz refresh (or display rate)
- **Resize Events:** `window.addEventListener('resize', ...)` triggers responsive adjustments
- **Input Handling:** OrbitControls uses Pointer Events API for cross-device compatibility

## Pattern Library

### Three.js Initialization Pattern (Standard Approach)

**Scene Setup:**
```javascript
import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
```

**Camera Configuration:**
```javascript
const camera = new THREE.PerspectiveCamera(
  75,                                    // FOV in degrees
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                   // Near clipping plane
  1000                                   // Far clipping plane
);
camera.position.z = 5; // Position to view origin
```

**Renderer Initialization:**
```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

### Lighting Pattern for PBR Materials

`MeshStandardMaterial` requires physically-based lighting setup:

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft fill light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Primary light
directionalLight.position.set(5, 5, 5); // Upper-right quadrant
scene.add(directionalLight);
```

**Rationale:** Ambient light prevents pure black shadows (0.5 intensity provides subtle fill). Directional light positioned at (5,5,5) creates visible gradation across cube faces.

### Animation Loop Pattern

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update phase
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  controls.update(); // Required for damping/auto-rotation
  
  // Render phase
  renderer.render(scene, camera);
}
animate(); // Start loop
```

**Critical:** `controls.update()` must be called before `renderer.render()` each frame.

### Responsive Resize Handler Pattern

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix(); // Required after aspect change
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### OrbitControls Configuration

```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth momentum
controls.dampingFactor = 0.05;  // Inertia strength
```

## Prior Orbit References

### Repository Initialization (Orbit 1, Implied)

The presence of `package.json`, `README.md`, and `src/` directory indicates a prior orbit established the project scaffold. Evidence:

- **Package.json:** Already contains correct `three: ^0.160.0` and `vite: ^5.0.0` with `"type": "module"`
- **README.md:** Documents functionality in future tense ("rotating cube with interactive camera controls"), suggesting specification created before implementation
- **Directory Structure:** `src/` directory exists, indicating intentional source code organization

**Lessons for This Orbit:**
- Do not modify `package.json` dependencies — versions already correctly specified
- README serves as specification reference, not implementation documentation
- File scaffolding is complete; focus on content correctness

### No Prior Three.js Orbits Detected

Examination of `.orbital/artifacts/` shows no prior Three.js implementation attempts. All artifact directories contain ORBITAL methodology documents (intent, context, proposal, verification) but no evidence of WebGL or 3D rendering work.

This is the **first orbit touching 3D graphics** in the repository, meaning:
- No established patterns for Three.js initialization exist
- No reusable utility functions (camera setup, lighting rigs) are available
- No prior performance benchmarks or optimization decisions to reference

## Risk Assessment

### Risk: Three.js Version Drift

**Description:** Three.js releases new minor versions monthly. The Intent specifies `^0.160.0`, which permits any `0.x.x` version. OrbitControls import paths changed in v0.150.0.

**Impact:** Medium — Incorrect import path causes runtime failure with obscure error message

**Mitigation:**
- Verify current Three.js version in `package.json` is `^0.160.0` (confirmed in codebase reference)
- Use canonical OrbitControls import: `three/examples/jsm/controls/OrbitControls.js` (correct for v0.150.0+)
- Do NOT use deprecated `three/examples/js/controls/OrbitControls` (UMD format, removed in v0.150.0)

### Risk: 100-Line Budget Exceeded

**Description:** The Intent mandates `src/main.js` must not exceed 100 lines. Implementing all requirements (scene, camera, renderer, lights, geometry, controls, resize handler, animation loop) risks exceeding limit if verbose coding style is used.

**Impact:** Low-Medium — Does not affect functionality but violates pedagogical constraint (Tier 2 requires human review for teaching quality)

**Mitigation:**
- Count only non-blank, non-comment lines
- Use compact initialization (e.g., inline position setting: `light.position.set(5,5,5)`)
- Group related operations (create geometry and material on same line if under 80 chars)
- Avoid unnecessary intermediate variables (pass `new THREE.Color(0x1a1a2e)` directly to `scene.background`)

**Line Count Estimate:**
- Imports: 2 lines
- Scene setup: 3 lines (scene, background, renderer)
- Camera: 3 lines (creation, position, configuration)
- Lights: 4 lines (2 lights × 2 lines each)
- Geometry: 4 lines (geometry, material, mesh, add to scene)
- Controls: 3 lines (creation, damping config)
- Resize handler: 5 lines (event listener + 3 updates)
- Animation loop: 8 lines (function declaration, RAF, updates, render)
- **Total Estimate:** ~32 lines (well under budget)

### Risk: WebGL Unavailability

**Description:** Older browsers or devices without GPU drivers cannot create WebGL context. `WebGLRenderer` constructor throws exception.

**Impact:** High — Complete application failure with no graceful degradation

**Mitigation:**
- Intent specifies "Modern browsers with native ES6 module and WebGL support" — no fallback required
- Acceptable behavior: Let Three.js throw native error, which will appear in browser console
- Do NOT add try-catch or feature detection (adds lines, violates simplicity constraint)
- User responsibility: Ensure compatible browser (per README requirements)

### Risk: Performance Degradation on Low-End Hardware

**Description:** Continuous `requestAnimationFrame` loop with mesh rotation and OrbitControls updates may drop below 60fps on integrated graphics.

**Impact:** Low — Acceptable per Intent ("Maintain 60fps on standard hardware")

**Mitigation:**
- Use `antialias: true` in `WebGLRenderer` (smooths edges but adds GPU cost)
- Keep scene minimal (1 mesh, 2 lights, no shadows)
- Rotation increment of 0.01 radians per frame provides smooth motion without forcing complex calculations
- No additional performance monitoring required (violates 100-line constraint)

### Risk: CSS Specificity Conflict

**Description:** If `src/style.css` rules have insufficient specificity, external CSS or browser defaults may override viewport-filling styles.

**Impact:** Medium — Canvas may not fill screen, leaving white margins or scrollbars

**Mitigation:**
- Use element selectors with high specificity: `body { margin: 0; }` and `canvas { display: block; }`
- Set `overflow: hidden` on body to prevent scroll bars during window resize race conditions
- Import CSS in `main.js` with `import './style.css'` (Vite injects as `<style>` tag in `<head>`)

### Risk: OrbitControls Damping Without Update

**Description:** Enabling `controls.enableDamping = true` requires calling `controls.update()` in animation loop. Forgetting this results in jerky, non-smooth camera motion.

**Impact:** Medium — Fails "Ideal" acceptance criteria for smooth inertia

**Mitigation:**
- **Always call `controls.update()` before `renderer.render()`** in animation loop
- Document this pattern in code comment: `// Required for damping`
- Test by dragging camera and releasing — should coast smoothly to stop

### Risk: Window Resize Race Condition

**Description:** Rapid window resize events (e.g., dragging browser corner) can queue multiple resize handlers before renderer finishes updating.

**Impact:** Low — Visual flicker during resize, resolved once resizing stops

**Mitigation:**
- Accept immediate resize behavior (meets "Acceptable" criteria: "Instant resize with maintained aspect ratio")
- Debouncing would require additional code (lodash.debounce or custom implementation), violating 100-line constraint
- Intent's "Ideal" criteria (debounced resize) is optional enhancement, not requirement

### Risk: Dark Background Color Misinterpretation

**Description:** Intent specifies `0x1a1a2e` as example dark color but uses phrase "or similar hex value."

**Impact:** Negligible — Acceptable color range is dark (RGB < 50 per Intent)

**Mitigation:**
- Use exact `0x1a1a2e` (RGB: 26, 26, 46) to match Intent example
- Verify contrast with default lighting: white cube faces should be clearly visible
- Color value converts to `new THREE.Color(0x1a1a2e)` in Three.js (hex literal, not string)