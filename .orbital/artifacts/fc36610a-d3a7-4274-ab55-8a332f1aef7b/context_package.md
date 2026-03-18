# Context Package: Three.js Minimal Starter Project

## Codebase References

### Existing Files (Repository Root)

**README.md**
- Current content: Project overview with quick start, controls documentation, structure summary, and requirements
- Status: Appears complete but may need verification against actual implementation
- Path: `./README.md`

**package.json**
- Current content: Package manifest with `"type": "module"`, `dev` script invoking `vite`, dependencies on `three@^0.160.0` and `vite@^5.0.0`
- Node engine constraint: `>=18.0.0`
- Status: Matches Intent Document requirements exactly
- Path: `./package.json`

**index.html**
- Current status: File exists in repository root
- Expected content: HTML5 document with viewport meta tag, script tag importing `src/main.js` as module
- Path: `./index.html`

**src/main.js**
- Current status: File exists in `src/` directory
- Expected content: Three.js scene initialization, animation loop, OrbitControls setup
- Constraint: Must be ≤100 lines including whitespace and comments
- Path: `./src/main.js`

**src/style.css**
- Current status: File exists in `src/` directory
- Expected content: CSS reset (margin/padding/overflow), full-viewport canvas styling
- Path: `./src/style.css`

### Files Not Referenced But Present

**.orbital/artifacts/**
- Contains prior orbit artifacts (intents, contexts, proposals, verifications) for other trajectories
- Paths: `.orbital/artifacts/{uuid}/` directories with markdown documents
- Relevance: Historical reference only — no code dependencies on prior orbits
- Notable: Repository has executed orbits `301f1e8d`, `7e840ae3`, `a692196d`, `a6b4c09a`, `ad0a63a2`, `b7565919`, `c71c2625`

### Critical Import Paths

Three.js ES modules in this project use the following import pattern:

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Key points:**
- `three` resolves to `node_modules/three/build/three.module.js` via package.json `"type": "module"`
- OrbitControls must use full path including `/examples/jsm/` and `.js` extension
- Vite handles module resolution without explicit configuration
- No need for `vite.config.js` — implicit defaults work for this pattern

## Architecture Context

### Project Structure Pattern

This is a **minimal vanilla JavaScript + Vite** project with no framework abstraction. Architecture follows a flat file structure:

```
repository-root/
├── index.html          # Entry point (Vite serves this implicitly)
├── package.json        # Dependency manifest
├── src/
│   ├── main.js         # Three.js scene logic
│   └── style.css       # Global styles
└── README.md           # Documentation
```

**Vite's role:**
- Development server with HMR (Hot Module Replacement)
- ES module resolution (transforms `import 'three'` to `node_modules` path)
- Serves `index.html` at root with `<script type="module">` support
- No build step required for development — serves source files directly

### Data Flow (Render Pipeline)

1. **Initialization (page load):**
   - Browser loads `index.html`
   - HTML imports `src/main.js` as ES module
   - `main.js` imports Three.js core and OrbitControls
   - Scene, camera, renderer, lights, geometry, material, mesh created
   - OrbitControls attached to camera
   - Window resize listener registered

2. **Animation Loop (requestAnimationFrame):**
   - `animate()` function calls itself recursively via `requestAnimationFrame`
   - Each frame: mesh rotation updated (`.rotation.x += delta`, `.rotation.y += delta`)
   - OrbitControls update (`.update()` method)
   - Renderer draws scene from camera perspective

3. **User Interaction:**
   - Mouse events captured by OrbitControls
   - Left-drag: Rotates camera (modifies camera position/quaternion)
   - Right-drag: Pans camera (modifies camera position)
   - Scroll: Zooms (modifies camera position along look vector)
   - Changes reflected in next render frame

### Service Boundaries

**No backend services.** This is a client-only static site with:
- No API calls
- No data persistence
- No authentication
- No external resource loading (textures, models)

**Browser APIs used:**
- WebGL 2.0 (via Three.js WebGLRenderer)
- requestAnimationFrame (animation timing)
- window resize events (responsive canvas)
- Mouse/wheel events (OrbitControls)

### Infrastructure Constraints

**Development environment:**
- Localhost only (no deployment configuration)
- Port: 5173 (Vite default)
- No CORS issues (no cross-origin requests)

**Runtime constraints:**
- JavaScript execution must complete within 100ms of page load to avoid "long task" warnings
- Render loop must maintain 16.67ms frame time (60 FPS) target
- WebGL context creation must succeed (graceful failure not required per Intent)

## Pattern Library

### Three.js Initialization Pattern

Standard sequence observed in Three.js tutorials and examples:

```javascript
// 1. Scene container
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

// 2. Camera (PerspectiveCamera preferred for 3D scenes)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(x, y, z);

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Geometry + Material + Mesh
const geometry = new THREE.BoxGeometry(width, height, depth);
const material = new THREE.MeshStandardMaterial({ color: 0xhex });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 5. Lights
const ambientLight = new THREE.AmbientLight(0xffffff, intensity);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, intensity);
directionalLight.position.set(x, y, z);
scene.add(directionalLight);

// 6. Controls
const controls = new OrbitControls(camera, renderer.domElement);

// 7. Animation loop
function animate() {
  requestAnimationFrame(animate);
  mesh.rotation.x += delta;
  mesh.rotation.y += delta;
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

### CSS Reset Pattern

For full-viewport canvas without scrollbars:

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

### Vite HTML Pattern

Minimal `index.html` for Vite + Three.js:

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

**Key points:**
- No `<canvas>` tag — Three.js creates it
- Link CSS with absolute path `/src/style.css` (Vite resolves this)
- Script tag must have `type="module"` for ES6 imports

### Naming Conventions

Observed in existing `package.json`:
- Package name: `threejs-starter` (lowercase, hyphenated)
- Script names: `dev` (not `start` or `serve`)
- Variable naming in JS: camelCase for objects (e.g., `ambientLight`, `directionalLight`)
- Three.js classes: PascalCase per library convention (e.g., `THREE.Scene`)

## Prior Orbit References

### No Direct Predecessors

This is the **first orbit** for the Three.js starter trajectory. No prior orbits modified or touched this codebase domain.

### Relevant Patterns from Repository History

Examining `.orbital/artifacts/` reveals:

**Orbit a692196d (with code_generation.md):**
- Had a `code_generation.md` artifact suggesting automated code creation
- Also had `test_results.md` indicating testing phase
- Pattern: Orbits may include automated code generation and verification steps

**Orbit b7565919 and c71c2625 (complete lifecycle):**
- Both have full artifact sets: intent → context → proposal → verification → code generation → test results
- Pattern: Successful orbits progress through all 6 phases
- Implication: This orbit should follow the same progression

**Common artifact structure:**
- All artifacts stored in `.orbital/artifacts/{uuid}/`
- Consistent naming: `intent_document.md`, `context_package.md`, `proposal_record.md`, `verification_protocol.md`
- Pattern: Artifact naming and structure are standardized

### Lessons from Repository State

**Existing implementation matches Intent:**
- `package.json` shows `"type": "module"` — correct for ES6 imports
- `README.md` references 100-line constraint explicitly
- File structure (`index.html`, `src/main.js`, `src/style.css`) matches Intent exactly

**Potential issue:**
- Files already exist in repository — orbit may be about **verification** rather than creation
- Current `README.md` claims "Three.js scene setup (< 100 lines)" but we haven't inspected `src/main.js` content
- Risk: Implementation may not match Intent Document constraints

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **OrbitControls import path incorrect** | Medium | High | Verify exact path `three/examples/jsm/controls/OrbitControls.js` with `.js` extension. Vite requires explicit extensions for non-package imports. |
| **Line count exceeds 100** | Medium | Medium | Aggressive terseness required. Risk of over-optimization making code unreadable. Use line counter in verification. |
| **WebGL not available in browser** | Low | High | No graceful fallback per Intent "Non-Goals". Document browser requirements in README. Could fail verification if tested on old browser. |
| **Window resize causes canvas distortion** | Medium | Medium | Must update both `camera.aspect` and `renderer.setSize()`. Forgetting `camera.updateProjectionMatrix()` causes distortion. |
| **HMR breaks Three.js context** | Low | Medium | Three.js creates global WebGL context. HMR may orphan old contexts without cleanup. Requires testing HMR specifically. |
| **Scene too dark (lighting insufficient)** | Medium | Low | MeshStandardMaterial requires adequate lighting. If ambient+directional intensities too low, cube appears black. |
| **Cube off-center or clipped** | Low | Medium | Camera position/FOV misconfiguration. Need correct `camera.position.z` distance relative to cube size. |

### Performance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Frame rate drops below 60 FPS** | Low | Medium | Single cube is trivial for modern GPUs. Risk only on integrated graphics. Verify on Intel Iris Xe or M1 base per Intent. |
| **Antialiasing causes performance hit** | Low | Low | `antialias: true` in WebGLRenderer has minimal overhead for simple scene. Document as non-negotiable per Intent. |
| **Memory leak in animation loop** | Low | High | If OrbitControls or renderer not disposed on HMR, memory leaks accumulate. Vite HMR needs manual cleanup for WebGL contexts. |

### Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Malicious code in dependencies** | Low | Medium | Using stable, widely-audited Three.js release (^0.160.0). No other dependencies. Run `npm audit` as verification gate. |
| **XSS via user input** | None | None | No user input mechanism. Static scene only. Not applicable. |

### Verification Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Subjective "looks right" failures** | High | Medium | Intent requires human visual inspection. Different reviewers may have different standards for "comfortable viewing distance" or "clear brightness differentiation". Document concrete thresholds in Verification Protocol (e.g., cube occupies 20-40% of viewport height). |
| **Automated line counter includes blank lines** | Medium | Low | Intent explicitly states "including whitespace and comments". Use `wc -l` for consistency, not code-only counters. |
| **Browser environment not reproducible** | Medium | Medium | Verification requires specific browser versions (Chrome 90+, Firefox 88+, Safari 14+). Document exact test environment. |

### Educational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Code uses deprecated Three.js APIs** | Low | High | Three.js r160 is recent but APIs do evolve. Verify against current Three.js documentation. Avoid `.geometry` (deprecated) vs `.BufferGeometry` patterns. |
| **Poor code pedagogy** | Medium | Medium | Over-terseness to meet 100-line limit may harm readability. Balance brevity with instructional clarity. Each major setup step should be self-evident. |
| **Missing critical concepts** | Low | Medium | Intent Non-Goals explicitly exclude shadows, textures, post-processing. Learner may assume these are "too advanced" when they're just out of scope. README should clarify this is minimal, not complete. |

### Dependency Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Three.js version mismatch** | Low | Low | Package.json specifies `^0.160.0`. Caret allows patches but not breaking changes. Risk of minor API changes in patch versions. Lock file (`package-lock.json`) should pin exact version. |
| **Vite version incompatibility** | Low | Medium | Vite 5.x requires Node 18+. Package.json engines field enforces this. Risk if CI/CD uses older Node. |
| **npm registry unavailable** | Low | High | `npm install` fails if registry down. No local fallback. Could block verification. Mitigation: Use cached dependencies if available. |

### Rollback Strategy

**No rollback needed** — this is a greenfield project. If implementation fails verification:
1. Delete generated files
2. Re-run orbit with adjusted parameters
3. No risk to existing production systems

**If files already exist** (current repository state suggests this):
1. Git reset to pre-orbit commit
2. Review what went wrong in verification
3. Adjust Intent or Proposal based on failure mode