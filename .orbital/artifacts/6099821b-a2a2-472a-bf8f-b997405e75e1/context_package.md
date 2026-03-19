# Context Package: Three.js Starter Project

## Codebase References

### Files to Create

| File Path | Purpose | Current State |
|-----------|---------|---------------|
| `index.html` | HTML entry point that loads the Vite dev server and mounts the canvas | Does not exist |
| `src/main.js` | Three.js scene initialization, animation loop, and event handlers | Does not exist |
| `src/style.css` | CSS reset and full-viewport canvas styling | Does not exist |

### Files to Modify

| File Path | Purpose | Current State | Required Changes |
|-----------|---------|---------------|------------------|
| `package.json` | Dependency and script definitions | Exists with correct structure | Already correct — verify `"type": "module"`, `dev` script, and dependency versions match Intent constraints |
| `README.md` | Project documentation | Exists with correct content | Already correct — no changes needed |

### Repository Structure Analysis

The repository currently contains:
- Root-level `package.json` with Three.js 0.160.0 and Vite 5.0.0 already configured
- Root-level `README.md` with correct documentation
- Root-level `index.html` placeholder
- `src/` directory with `main.js` and `style.css` placeholders
- `.orbital/artifacts/` directory containing previous orbit documentation (not relevant to this greenfield implementation)

**Critical Observation:** The file structure already exists but files contain placeholder or incomplete content. This orbit must populate these files with functional code that meets the Intent Document's 100-line constraint and visual requirements.

## Architecture Context

### System Architecture

This is a **client-side only** application with no backend services, API integrations, or data persistence. The architecture consists of:

```
Browser Environment
├── index.html (entry point)
│   └── <script type="module" src="/src/main.js">
│
├── Vite Dev Server (localhost:5173)
│   ├── ES Module transformation
│   ├── Hot Module Replacement (HMR)
│   └── Static file serving
│
└── Three.js Runtime
    ├── WebGLRenderer (canvas output)
    ├── Scene (container for 3D objects)
    ├── PerspectiveCamera (viewpoint)
    ├── Geometry + Material → Mesh
    ├── Lighting (Ambient + Directional)
    └── OrbitControls (user input handler)
```

### Data Flow

1. **Initialization Sequence:**
   - Browser loads `index.html`
   - Vite injects module loader and resolves `src/main.js`
   - `main.js` imports Three.js core and OrbitControls from `node_modules/three`
   - Scene, camera, renderer, lights, and geometry are instantiated
   - Renderer appends `<canvas>` element to DOM
   - OrbitControls binds mouse event listeners to canvas

2. **Render Loop:**
   - `requestAnimationFrame` schedules next frame at 60fps
   - Cube rotation values increment by 0.01 radians on X and Y axes
   - OrbitControls updates camera matrix if user input detected
   - Renderer draws scene from camera perspective to canvas
   - Loop repeats indefinitely

3. **Resize Handling:**
   - Window `resize` event listener triggers callback
   - Camera aspect ratio recalculated from `window.innerWidth / innerHeight`
   - Camera projection matrix updated via `camera.updateProjectionMatrix()`
   - Renderer size updated via `renderer.setSize(window.innerWidth, window.innerHeight)`

### Infrastructure Constraints

- **No build output:** Development mode only — no `dist/` folder, no production bundles
- **Single HTML file:** No routing, no multi-page architecture
- **No state management:** All state lives in Three.js objects (mesh rotation, camera position)
- **No environment variables:** Configuration is hardcoded (canvas background color, camera FOV, cube size)
- **ES Module imports only:** No CommonJS `require()`, no UMD bundles

### Integration Points

This project has **zero external integrations**:
- No REST APIs
- No WebSockets
- No localStorage or IndexedDB
- No analytics or telemetry
- No CDN dependencies (Three.js served from `node_modules`)

## Pattern Library

### Import Patterns

**Approved:**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Rationale:** Three.js r160+ uses ES modules. The `OrbitControls` class is not part of the core bundle and must be imported from the examples directory. The `.js` extension is required for Vite to resolve the module correctly.

**Not Approved:**
```javascript
// ❌ No default import — Three.js exports named namespace
import THREE from 'three';

// ❌ No addons path — use examples/jsm
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

### Initialization Patterns

**Scene Setup Order:**
1. Scene instantiation (`new THREE.Scene()`)
2. Camera instantiation with FOV, aspect ratio, near/far planes
3. Renderer instantiation with `antialias: true` and `setClearColor()`
4. Renderer canvas appended to `document.body`
5. Lights added to scene
6. Geometry and material combined into mesh, added to scene
7. OrbitControls instantiated with camera and renderer DOM element
8. Resize listener attached to `window`
9. Animation loop initiated with `requestAnimationFrame`

**Rationale:** This order ensures the renderer's DOM element exists before OrbitControls tries to bind event listeners. Camera must exist before OrbitControls constructor is called.

### Naming Conventions

| Entity Type | Convention | Example |
|-------------|------------|---------|
| Scene object | `scene` | `const scene = new THREE.Scene();` |
| Camera | `camera` | `const camera = new THREE.PerspectiveCamera(...);` |
| Renderer | `renderer` | `const renderer = new THREE.WebGLRenderer(...);` |
| Mesh | Descriptive noun | `const cube = new THREE.Mesh(...);` |
| Lights | Type + purpose | `const ambientLight = new THREE.AmbientLight(...);` |
| Controls | `controls` | `const controls = new OrbitControls(...);` |
| Animation function | `animate` | `function animate() { ... }` |

### Code Style Standards

- **No semicolons** — The existing `package.json` does not include ESLint, so follow JavaScript automatic semicolon insertion (ASI) conventions
- **Single quotes for strings** — Consistent with Vite defaults
- **Const by default** — Use `const` unless reassignment is required
- **Arrow functions for callbacks** — `window.addEventListener('resize', () => { ... })`
- **Explicit return in one-liners** — Avoid implicit returns for clarity in animation loops

### CSS Reset Pattern

The `src/style.css` file must eliminate default browser margins and ensure the canvas fills the viewport:

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
- `margin: 0; padding: 0;` eliminates default 8px body margin in most browsers
- `overflow: hidden;` prevents scrollbars from appearing during resize flicker
- `canvas { display: block; }` removes 3-4px whitespace below inline canvas elements

## Prior Orbit References

### Orbit Analysis

The repository contains artifact directories for previous orbits, but **none are relevant to this greenfield Three.js implementation**. The `.orbital/artifacts/` directories contain context packages, intent documents, and proposal records for unrelated work.

**Key Finding:** No prior Three.js code exists in this repository. There is no existing scene setup, no established Three.js patterns, and no legacy code to refactor or integrate with.

### Lessons from Repository History

1. **File structure is already established:** The `package.json`, `README.md`, and `src/` directory structure already exist. The orbit must populate these files, not create the directory structure from scratch.

2. **Dependency versions are pre-selected:** The `package.json` already specifies `three@^0.160.0` and `vite@^5.0.0`. The implementation must work with these exact versions, not upgrade or modify them.

3. **Documentation expectations:** The existing `README.md` sets a precedent for concise, example-driven documentation with a Quick Start section and explicit browser requirements. Any additions should match this tone.

### Anti-Patterns to Avoid

Based on the repository structure and Intent constraints:

- **Do not create a `vite.config.js` file** — The Intent explicitly prohibits additional configuration files
- **Do not add TypeScript or JSX support** — The constraint is vanilla JavaScript only
- **Do not create subdirectories under `src/`** — The structure must remain flat with only `main.js` and `style.css`
- **Do not add npm scripts beyond `dev`** — No `build`, `preview`, or `test` scripts are required for this starter project

## Risk Assessment

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **OrbitControls import path incorrect** | Medium | High — Controls will not initialize, camera will be static | Verify exact path `three/examples/jsm/controls/OrbitControls.js` with `.js` extension. Test import resolution before full implementation. |
| **Canvas does not fill viewport** | Low | Medium — White margins visible, fails visual acceptance | Use CSS reset with `margin: 0; padding: 0; overflow: hidden;` and `canvas { display: block; }`. Set renderer size to `window.innerWidth, window.innerHeight` in both initialization and resize handler. |
| **Animation frame rate below 60fps** | Low | Medium — Fails performance acceptance | Use lightweight geometry (`BoxGeometry(1, 1, 1)`) and minimal lights (2 total). Avoid shadows, post-processing, or complex materials. Profile with Chrome DevTools Performance tab. |
| **Window resize causes aspect ratio distortion** | Medium | High — Cube appears stretched, camera frustum incorrect | Recalculate `camera.aspect = window.innerWidth / window.innerHeight` and call `camera.updateProjectionMatrix()` in resize handler. Update renderer size simultaneously. |
| **WebGL context loss on low-end hardware** | Low | High — Black screen, no error recovery | Three.js handles context loss internally. Ensure renderer is instantiated with `{ antialias: true }` to enable WebGL 2.0 fallback. Document browser requirements (WebGL 2.0 support) in README. |

### Code Quality Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Exceeding 100-line constraint** | Medium | High — Fails Intent acceptance criteria | Count lines excluding comments and blank lines. Use concise variable names (`scene`, `camera`, `renderer`). Inline geometry and material instantiation. Combine related operations (e.g., `renderer.setSize()` and `renderer.setPixelRatio()` on consecutive lines). |
| **Unreadable code due to brevity** | Medium | Medium — Violates "Code is self-documenting" ideal acceptance | Use descriptive variable names even if verbose (`directionalLight` vs `light2`). Add whitespace to separate logical blocks (initialization, lighting, geometry, animation loop). Include 2-3 strategic comments for non-obvious operations (e.g., why camera is positioned at Z=5). |
| **Missing error handling** | Low | Low — Dev experience suffers but functionality intact | Vite provides clear console errors for import failures. Three.js logs WebGL warnings to console. No custom error handling needed for MVP. |

### Integration Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Node.js version incompatibility** | Low | High — `npm install` fails | `package.json` already specifies `"engines": { "node": ">=18.0.0" }`. Vite 5.x requires Node 18+. No additional version checks needed. |
| **Three.js version mismatch** | Low | Medium — OrbitControls API changes between versions | Pin to exact version `0.160.0` (already done). Do not use `^0.160.0` range if API stability is critical. Verify OrbitControls constructor signature: `new OrbitControls(camera, renderer.domElement)`. |
| **Port 5173 already in use** | Low | Low — Dev server fails to start | Vite automatically tries next available port. Document expected URL `http://localhost:5173` but note alternative ports may be used. |

### Security Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Malicious npm package substitution** | Very Low | High — Supply chain attack | Use `package-lock.json` to lock dependency versions. Verify Three.js package integrity with npm audit. No user input or external data sources exist in this project, eliminating XSS/injection vectors. |
| **Prototype pollution via dependencies** | Very Low | Medium — Runtime exploits | Three.js and Vite are widely used, actively maintained packages. No known prototype pollution vulnerabilities in specified versions. Run `npm audit` as part of verification protocol. |

### Performance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **High-DPI displays cause pixel ratio issues** | Medium | Low — Canvas appears blurry on Retina displays | Call `renderer.setPixelRatio(window.devicePixelRatio)` during initialization. This doubles pixel resolution on 2x displays but maintains 60fps on target hardware (2020+ laptops have sufficient GPU power). |
| **Memory leak from animation loop** | Very Low | High — Browser tab becomes unresponsive over time | Use `requestAnimationFrame` (not `setInterval`). Browser automatically pauses loop when tab is inactive. No manual cleanup needed for this single-page, single-scene application. |
| **OrbitControls damping causes frame drops** | Low | Medium — Camera movement feels laggy | Enable damping with `controls.enableDamping = true` and `controls.dampingFactor = 0.05`. Call `controls.update()` in animation loop. Test on target hardware (2020+ laptop) to verify 60fps maintained during interaction. |

### Deployment Risks

**Not Applicable:** The Intent explicitly lists "Production builds or deployment configuration" as a non-goal. This project runs in development mode only via `npm run dev`. No build, minification, or hosting considerations are required.