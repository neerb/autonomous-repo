# Context Package: Three.js Starter Project

## Codebase References

### Current Repository State
The repository `neerb/autonomous-repo` contains only a single file:
- `README.md` — Generic placeholder content ("Testing purposes")

### Files to Create
This orbit will create a new project structure at the repository root:

| File Path | Purpose | Size Constraint |
|-----------|---------|-----------------|
| `index.html` | HTML entry point with canvas element | ~15-20 lines |
| `src/main.js` | Three.js scene initialization and render loop | ≤100 lines (enforced) |
| `src/style.css` | Global canvas styling for full-viewport layout | ~10-15 lines |
| `package.json` | npm dependencies and dev script configuration | ~20-25 lines |

### No Existing Dependencies
The repository has no `package.json`, no build tooling, and no existing JavaScript modules. This is a complete greenfield initialization with zero legacy code to preserve or integrate.

### Repository Structure After Orbit
```
autonomous-repo/
├── README.md (existing, unchanged)
├── index.html (new)
├── package.json (new)
├── src/
│   ├── main.js (new)
│   └── style.css (new)
└── node_modules/ (gitignored, created by npm install)
```

## Architecture Context

### Project Type: Standalone Frontend Prototype
This is an isolated learning template with no backend integration, no data persistence, and no external service calls. The architecture is intentionally minimal:

**Execution Flow:**
1. Browser loads `index.html`
2. Vite dev server resolves ES module imports from `src/main.js`
3. Three.js library instantiates WebGL context on canvas element
4. `requestAnimationFrame` drives render loop at monitor refresh rate
5. User interactions (mouse drag, scroll) update camera via OrbitControls
6. Window resize events trigger canvas and camera aspect ratio recalculation

### Technology Stack Rationale

| Technology | Version Constraint | Justification |
|------------|-------------------|---------------|
| **Vite** | 5.x+ | Zero-config dev server with native ES modules, HMR without bundling overhead |
| **Three.js** | Latest stable (r160+) | Industry-standard WebGL abstraction, mature API, extensive documentation |
| **Vanilla JavaScript** | ES2020+ (async/await, modules) | No transpilation step, direct browser execution, minimal cognitive load |

### Constraint-Driven Design Decisions

**100-Line Budget Enforcement:**
- No abstraction layers (no `Scene` class, no separate `Renderer` module)
- Inline geometry and material creation
- Single animation function (no RAF wrapper utilities)
- Window resize handler must be concise (no debouncing, direct DOM queries)

**No Configuration Files:**
- Vite uses defaults (`index.html` at root auto-detected)
- No `vite.config.js` unless Three.js examples imports require alias mapping
- No `.gitignore` generation (out of scope, assumes developer has global ignore for `node_modules/`)

**Browser-Native Patterns:**
- ES6 module imports (`import * as THREE from 'three'`)
- No polyfills or fallbacks (WebGL 2.0 assumed available)
- Direct DOM manipulation (`document.body.appendChild(renderer.domElement)`)

### Infrastructure Assumptions
- **Local development only**: No production build, no CDN hosting, no deployment pipeline
- **Single-user environment**: No concurrency concerns, no state synchronization
- **Modern browser target**: Chrome/Firefox/Safari released within last 2 years
- **Localhost-only networking**: Vite dev server binds to `127.0.0.1:5173`

## Pattern Library

### Three.js Initialization Pattern (Post-R150)
The Three.js API has stabilized since version r150 with consistent patterns:

**Scene Setup:**
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

**OrbitControls Import (Critical):**
Three.js r150+ moved examples to ESM. Correct import path:
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```
**Common Error:** Using `three/addons/controls/OrbitControls.js` (r160+ path) vs `three/examples/jsm/controls/OrbitControls.js` (legacy path). Check Three.js version in generated `package.json`.

### Lighting Pattern for MeshStandardMaterial
`MeshStandardMaterial` requires physically-based rendering (PBR) lighting:

**Minimum Light Setup:**
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft fill light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // Key light
directionalLight.position.set(5, 5, 5);
scene.add(ambientLight, directionalLight);
```

**Rationale:**
- `AmbientLight` prevents pure black shadows (unrealistic without indirect lighting)
- `DirectionalLight` creates shading gradients (required for acceptance boundary: "clear shading gradients")
- Position `(5, 5, 5)` ensures light hits top and side faces of cube at origin

### Animation Loop Pattern
Standard requestAnimationFrame pattern for continuous rendering:

```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update(); // Required for OrbitControls damping
  renderer.render(scene, camera);
}
animate();
```

**Critical Details:**
- `controls.update()` must be called before `renderer.render()` when damping enabled
- Rotation increments determine speed (0.01 rad/frame ≈ 10 seconds per rotation at 60 FPS)
- No need to track delta time for basic rotation (acceptable jitter at varying frame rates)

### Responsive Canvas Pattern
Vite + Three.js projects use direct DOM event listeners:

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Pattern Constraint:** No debouncing (violates 100-line budget), acceptable minor performance cost on rapid resize.

### CSS Reset for Canvas
Full-viewport canvas requires zero-margin body:

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

**Rationale:**
- `overflow: hidden` prevents scrollbars during resize flicker
- `canvas { display: block }` removes default inline spacing (4px bottom gap)

## Prior Orbit References

### No Prior Orbits
This is Orbit 1 in a new trajectory with zero prior history. The repository contains only a placeholder `README.md`.

### Relevant Historical Context (External)
While this specific codebase has no prior work, the Three.js ecosystem has common migration issues:

**Three.js r150 → r160+ Breaking Changes:**
- OrbitControls moved from `examples/jsm/` to `addons/` in r160
- `WebGLRenderer.outputEncoding` deprecated in favor of `WebGLRenderer.outputColorSpace` (r152+)
- `Geometry` class fully removed (r125+, replaced by `BufferGeometry`)

**Vite 4.x → 5.x Changes:**
- Default port changed from 3000 to 5173 (Intent Document correctly specifies 5173)
- Node 18+ required (Vite 5.0+ dropped Node 14/16 support)

**Mitigation:** Use `"three": "^0.160.0"` and `"vite": "^5.0.0"` in `package.json` to lock to stable, compatible versions.

## Risk Assessment

### Critical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **OrbitControls import path error** | High | Blocks camera interaction (critical acceptance boundary failure) | Use Three.js r160+ path: `three/addons/controls/OrbitControls.js` if version ≥ r160, else `three/examples/jsm/controls/OrbitControls.js`. Verify import in proposal phase. |
| **Vite fails to resolve Three.js modules** | Medium | Dev server crashes, no visual output | Ensure `package.json` includes `"type": "module"` if needed. Vite 5.x handles Three.js ESM by default. |
| **Canvas not appending to DOM** | Low | Blank page despite console showing no errors | Verify `document.body.appendChild(renderer.domElement)` executes after DOM loaded, or use `<script type="module">` in HTML. |
| **100-line budget violation** | Medium | Fails acceptance boundary, requires refactor | Count lines excluding comments/blanks during proposal phase. Prioritize inline logic over helper functions. |

### Performance Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Resize handler thrashing** | Low | Brief FPS drop during window drag | Acceptable per Intent non-goals. No debouncing required. Monitor if FPS drops below 50 during resize. |
| **OrbitControls damping overhead** | Low | Unnecessary per-frame matrix updates | Disable damping (`controls.enableDamping = false`) to save 2-3 FPS. Re-enable if "smooth" interaction desired. |
| **Antialiasing cost on high-DPI displays** | Low | 40-50 FPS on 4K Retina displays | Accept per Intent threshold (50+ FPS acceptable). Document in README if user encounters lag. |

### Visual Quality Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Lighting too dark/bright** | Medium | Cube faces lack visible shading gradients | Tune `AmbientLight` intensity (0.3-0.6 range) and `DirectionalLight` intensity (0.7-1.0 range). Test on both dark/light mode displays. |
| **Background color mismatch** | Low | Fails `0x1a1a2e` specification | Set `renderer.setClearColor(0x1a1a2e)` explicitly. Do not rely on CSS `background-color` (canvas may not fill viewport during resize). |
| **Cube too small/large in frame** | Medium | Violates 20-60% viewport fill acceptance boundary | Position camera at `z = 5` (standard for unit cube). Adjust camera FOV (45-75 degrees) if needed. |

### Dependency Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Three.js major version breaking change** | Low (within orbit timeframe) | Import errors, API signature changes | Lock to specific minor version in `package.json`: `"three": "~0.160.0"` (tilde allows patch updates only). |
| **Vite security vulnerability** | Low | `npm install` shows audit warnings | Accept if warnings are non-critical (XSS in dev server acceptable for local-only use). Document in README if persistent. |
| **Node version incompatibility** | Low | `npm install` fails with engine error | Specify `"engines": { "node": ">=18.0.0" }` in `package.json`. Intent already requires Node 18+. |

### Scope Creep Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Temptation to add texture/HDRI** | Medium | Violates non-goal: "asset loading excluded" | Explicitly reject any texture imports. Cube must use solid color material (`color: 0x00ff00` or similar). |
| **Adding stats.js or FPS counter** | Medium | Violates non-goal: "no UI overlays" | Reject. Performance validation must occur during verification phase via browser DevTools. |
| **Including production build script** | Low | Violates non-goal: "no deployment configuration" | `package.json` must contain only `"dev": "vite"`. No `build` or `preview` scripts. |

### Verification Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Line count ambiguity** | High | Unclear if comments/blanks count toward 100-line budget | Define in proposal: exclude blank lines and single-line comments. Multi-line comments count as 1 line per physical line. |
| **"Realistic lighting" subjectivity** | High | Human supervisor may reject despite technical correctness | Proposal must specify exact light intensities and positions. Verification protocol must include screenshot checklist. |
| **FPS measurement inconsistency** | Medium | Different devices report different frame rates | Verification protocol must specify test device (M1 MacBook Air) and browser (Chrome 120+). Accept 50+ FPS threshold. |