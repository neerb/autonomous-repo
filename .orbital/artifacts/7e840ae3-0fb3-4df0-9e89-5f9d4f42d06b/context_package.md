# Context Package: Three.js Starter Project

## Codebase References

### Existing Files Requiring Modification

**`/package.json`**
- **Current state**: Already contains correct dependencies (`three: ^0.160.0`, `vite: ^5.0.0`) and dev script (`"dev": "vite"`)
- **Status**: Compliant with Intent requirements — no modifications needed
- **Module type**: Already set to `"type": "module"` for ES module support
- **Node version constraint**: Already specifies `"engines": {"node": ">=18.0.0"}`

**`/README.md`**
- **Current state**: Minimal placeholder ("Testing purposes")
- **Action required**: Should be updated to include setup instructions and project description for learning resource intent
- **Suggested content**: Installation steps (`npm install`), dev server launch (`npm run dev`), and brief description of what the starter demonstrates

### Files to Create

**`/index.html`**
- **Purpose**: HTML entry point for Vite dev server
- **Requirements**: Must include `<script type="module" src="/src/main.js"></script>` to load ES module
- **Canvas element**: Should either contain `<canvas id="canvas"></canvas>` for explicit targeting, or let Three.js create and append to body
- **Viewport meta**: Must include `<meta name="viewport" content="width=device-width, initial-scale=1.0">` for mobile responsiveness

**`/src/main.js`**
- **Purpose**: Three.js scene initialization, render loop, and animation logic
- **Import pattern**: Must use named imports from `three` package (e.g., `import { Scene, PerspectiveCamera, WebGLRenderer } from 'three'`)
- **OrbitControls import**: Must use `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- **Line count budget**: 80-100 lines (excluding imports and blank lines)

**`/src/style.css`**
- **Purpose**: Remove default margins/padding and make canvas fill viewport
- **Required rules**: `body { margin: 0; padding: 0; overflow: hidden; }` and `canvas { display: block; }`
- **Specificity constraint**: No `!important` declarations allowed per acceptance boundaries

### Repository Structure Analysis

**Current state**: Repository already contains the exact target file structure:
```
/
├── index.html (exists, needs content validation)
├── package.json (exists, compliant)
├── src/
│   ├── main.js (exists, needs content validation)
│   └── style.css (exists, needs content validation)
```

**Risk**: Existing files may contain partial implementations or conflicting code that must be replaced entirely to meet acceptance boundaries.

## Architecture Context

### Build System Architecture

**Vite Configuration**
- **Default behavior**: Vite requires no config file for basic HTML/JS/CSS projects
- **Entry point**: Vite serves `/index.html` at dev server root and resolves module imports automatically
- **Hot Module Replacement**: Enabled by default — changes to JS/CSS will hot-reload without full page refresh
- **Port**: Defaults to `localhost:5173` unless port is occupied

**Module Resolution**
- **Three.js imports**: Vite resolves `'three'` from `node_modules/three/build/three.module.js`
- **OrbitControls path**: Must use full path `three/examples/jsm/controls/OrbitControls.js` — not available in main three export
- **No bundler config needed**: Vite handles ES module transformation and dependency resolution out of the box

### Three.js Scene Architecture

**Initialization Sequence**
1. Create `Scene` instance
2. Create `PerspectiveCamera` with FOV, aspect ratio, near/far clipping planes
3. Create `WebGLRenderer` with antialiasing and canvas target
4. Add lights to scene (AmbientLight + DirectionalLight)
5. Create geometry (BoxGeometry) and material (MeshStandardMaterial)
6. Create mesh from geometry + material, add to scene
7. Initialize OrbitControls with camera and renderer's DOM element
8. Set renderer size to window dimensions
9. Start render loop with requestAnimationFrame

**Coordinate System**
- **Origin**: Center of scene at (0, 0, 0)
- **Camera positioning**: Must be positioned away from origin to view cube (e.g., z=5)
- **Cube size**: Default BoxGeometry dimensions (1x1x1) sufficient for visibility at camera distance

**Lighting Model**
- **AmbientLight**: Provides base illumination without direction (prevents completely black faces)
- **DirectionalLight**: Simulates sun-like lighting from infinite distance, creates shadows/highlights on cube faces
- **MeshStandardMaterial requirement**: Requires lighting to be visible — uses physically-based rendering (PBR)

### Render Loop Architecture

**Animation Pattern**
```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update logic (rotation)
  // Render scene
}
```

**Timing considerations**
- `requestAnimationFrame` synchronizes with display refresh rate (typically 60Hz)
- Rotation increments should be small (e.g., 0.01 radians/frame) for smooth visual motion
- No deltaTime calculation needed for simple rotation demo

**Window Resize Handling**
- Must update camera aspect ratio: `camera.aspect = window.innerWidth / window.innerHeight`
- Must call `camera.updateProjectionMatrix()` after aspect change
- Must update renderer size: `renderer.setSize(window.innerWidth, window.innerHeight)`
- Attach resize handler: `window.addEventListener('resize', onWindowResize)`

## Pattern Library

### Three.js Import Conventions (Modern)

**Correct pattern for Three.js ≥ 0.160.0:**
```javascript
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Deprecated pattern to avoid:**
```javascript
import * as THREE from 'three'; // Violates Intent constraint on named imports
```

### Camera Setup Pattern

**Standard PerspectiveCamera initialization:**
```javascript
const camera = new PerspectiveCamera(
  75,                                    // FOV in degrees
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1,                                   // Near clipping plane
  1000                                   // Far clipping plane
);
camera.position.z = 5; // Position camera away from origin
```

### Renderer Setup Pattern

**WebGLRenderer with antialiasing:**
```javascript
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

**Scene background color:**
```javascript
scene.background = new Color(0x1a1a2e); // Dark blue-grey per Intent
```

### Material and Geometry Pattern

**Cube with PBR material:**
```javascript
const geometry = new BoxGeometry(1, 1, 1); // Default 1x1x1 cube
const material = new MeshStandardMaterial({ color: 0x00ff00 }); // Example: green
const cube = new Mesh(geometry, material);
scene.add(cube);
```

### Lighting Pattern

**Two-light setup for dimensional visibility:**
```javascript
const ambientLight = new AmbientLight(0xffffff, 0.5); // Soft white fill
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.8); // Strong white key light
directionalLight.position.set(5, 5, 5); // Position above and to side
scene.add(directionalLight);
```

### OrbitControls Pattern

**Standard initialization:**
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
// Optional: controls.enableDamping = true for smooth motion
```

### CSS Reset Pattern

**Full-viewport canvas:**
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

## Prior Orbit References

### Historical Context

**Repository Evidence**
- **`.orbital/artifacts/` directory**: Contains artifacts from 4 prior orbits (IDs: 301f1e8d, a6b4c09a, ad0a63a2, c71c2625)
- **Most recent orbit (c71c2625)**: Completed full ORBITAL cycle including code generation, verification protocol, and test results
- **Pattern observation**: Repository demonstrates successful prior use of ORBITAL methodology with complete artifact trails

### Orbit c71c2625 Analysis

**Artifact completion status:**
- ✅ Intent Document
- ✅ Context Package
- ✅ Proposal Record
- ✅ Code Generation
- ✅ Verification Protocol
- ✅ Test Results

**Inference**: The repository maintainer is familiar with ORBITAL workflow and expects complete artifact documentation. This orbit should maintain similar documentation rigor.

### No Direct Technical Precedent

**Finding**: None of the prior orbits appear to involve Three.js or 3D graphics work based on artifact file names.

**Implication**: No existing patterns or conventions from prior orbits apply to this greenfield Three.js implementation. Standard Three.js community best practices should be followed.

### Repository Philosophy

**From existing package.json structure:**
- Preference for minimal configuration (no vite.config.js despite Vite usage)
- Semantic versioning with caret ranges (e.g., `^0.160.0`)
- Explicit Node.js version constraints via engines field
- ES modules as default via `"type": "module"`

**Consistency requirement**: New implementation should maintain this minimalist philosophy — no unnecessary config files or dependencies.

## Risk Assessment

### Build System Risks

**Risk: Vite version incompatibility**
- **Likelihood**: Low (Vite 5.x stable, well-documented)
- **Impact**: Medium (dev server fails to start, blocking immediate testing)
- **Mitigation**: Vite 5.0.0 specified in package.json is stable release from Dec 2023, widely tested
- **Fallback**: Version constraint allows patch updates (`^5.0.0`) for bug fixes

**Risk: Module resolution failure for OrbitControls**
- **Likelihood**: Medium (common mistake using wrong import path)
- **Impact**: High (controls non-functional, violates acceptance boundary)
- **Mitigation**: Use exact path `three/examples/jsm/controls/OrbitControls.js` — not `three/addons/` (deprecated in r150+)
- **Validation**: Import path must resolve without 404 in browser dev tools

### Three.js API Risks

**Risk: Breaking API changes in Three.js 0.160.x patch versions**
- **Likelihood**: Very low (semantic versioning respected)
- **Impact**: Medium (scene fails to render correctly)
- **Mitigation**: Package.json pins to `^0.160.0` which allows patches but not minor version bumps
- **Monitoring**: If Three.js >0.161 is released, it won't auto-install due to caret constraint

**Risk: MeshStandardMaterial appears black without proper lighting**
- **Likelihood**: Medium (common beginner mistake)
- **Impact**: Medium (cube not visible, fails acceptance boundary)
- **Mitigation**: Ensure both AmbientLight and DirectionalLight are added to scene with sufficient intensity
- **Validation**: Cube faces should show gradient from light to shadow, not solid black

### Performance Risks

**Risk: Animation frame rate drops below 30fps threshold**
- **Likelihood**: Low (simple scene with one cube)
- **Impact**: Medium (fails performance acceptance boundary)
- **Mitigation**: Single cube with basic materials is well within WebGL 1.0 capabilities
- **Edge case**: Older integrated graphics (Intel HD 4000 era) may struggle — acceptable given 4-year-old laptop specification in Intent

**Risk: Memory leak from unreleased animation loop**
- **Likelihood**: Low (requestAnimationFrame automatically managed by browser)
- **Impact**: High (fails 5-minute stability test in acceptance boundaries)
- **Mitigation**: Standard requestAnimationFrame pattern doesn't require manual cleanup unless animation is stopped
- **Note**: No need for cancelAnimationFrame in this starter (runs indefinitely)

### Code Quality Risks

**Risk: Line count exceeds 100-line budget**
- **Likelihood**: Medium (feature creep during implementation)
- **Impact**: High (automatic rejection per failure conditions)
- **Mitigation**: Prioritize initialization and render loop — exclude comments from line count
- **Validation**: Use `grep -v "^s*$" src/main.js | grep -v "^s*//" | wc -l` to count non-blank, non-comment lines

**Risk: Wildcard import used instead of named imports**
- **Likelihood**: Medium (common pattern in older Three.js examples)
- **Impact**: Medium (violates code quality metric in acceptance boundaries)
- **Mitigation**: Explicitly list all needed Three.js classes in import statement
- **Example violation**: `import * as THREE from 'three'; const scene = new THREE.Scene();`

### Browser Compatibility Risks

**Risk: WebGL not supported in target browser**
- **Likelihood**: Very low (WebGL 1.0 supported since IE11, Chrome 9, Firefox 4)
- **Impact**: Critical (scene won't render at all)
- **Mitigation**: No mitigation needed — Intent specifies "modern web browser" which implies WebGL support
- **Detection**: Three.js automatically logs WebGL context errors to console

**Risk: ES modules not supported in browser**
- **Likelihood**: Very low (ES modules supported in all browsers from 2018+)
- **Impact**: Critical (script won't execute)
- **Mitigation**: Intent explicitly requires modern browser, no need for transpilation to ES5
- **Note**: `<script type="module">` syntax required in index.html

### Operational Risks

**Risk: Existing file content conflicts with new implementation**
- **Likelihood**: High (index.html, src/main.js, src/style.css already exist)
- **Impact**: Medium (partial implementation may cause confusion)
- **Mitigation**: Generate complete file contents, explicitly communicate that existing files must be replaced entirely
- **Verification**: Proposal Record must clarify which files are full replacements vs. modifications

**Risk: Cube rotation speed too fast or too slow**
- **Likelihood**: Medium (subjective visual preference)
- **Impact**: Low (does not violate hard acceptance boundaries, only "target quality")
- **Mitigation**: Use rotation increments of ~0.01 radians/frame as starting point
- **Tuning**: Supervised tier allows human adjustment after initial implementation

**Risk: Camera position provides poor initial view of cube**
- **Likelihood**: Medium (no specific position specified in Intent)
- **Impact**: Low (aesthetic issue, not functional failure)
- **Mitigation**: Position camera at z=5 for 1x1x1 cube provides good view angle
- **Alternative**: Position at (x=3, y=3, z=5) for angled view showing three faces simultaneously