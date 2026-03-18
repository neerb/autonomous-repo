# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit delivers a functional Three.js educational starter project that eliminates all complexity between a developer and working 3D code. The primary success metric is cognitive accessibility: a developer with zero Three.js experience should understand the entire codebase in under 10 minutes of reading `src/main.js`.

The Intent prioritizes learning value over production readiness. The 100-line JavaScript budget forces architectural minimalism — no abstractions, no helper functions, no configuration layers. Every line must directly contribute to rendering the 3D scene or handling browser events.

The rotating cube serves as a proof-of-concept demonstrating the core Three.js rendering pipeline: scene graph construction, camera positioning, lighting setup, material responsiveness, animation loops, and interactive controls. The visual outcome (a clearly lit, continuously rotating cube with mouse-controlled camera) provides immediate feedback that the WebGL stack is functioning correctly.

Critical constraints understood:
- **No framework scaffolding** — Vite's default behavior is sufficient; no React/Vue rendering layer
- **No TypeScript transpilation** — Pure ES6+ JavaScript only, leveraging `"type": "module"` in package.json
- **No external assets** — BoxGeometry generates cube procedurally; no texture loading or model parsing
- **Functional-only architecture** — Variables scoped to module or function level; no class definitions beyond Three.js constructors

The existing `package.json` already satisfies all dependency requirements (`three@^0.160.0`, `vite@^5.0.0`, `dev` script, Node >=18 engine constraint). This orbit focuses exclusively on implementing the four application files that compose the user-facing starter project.

## Implementation Plan

### File Operations

**Operation 1: Rewrite `index.html` (root directory)**

Current state: File exists but content unknown; assuming needs complete replacement.

Target content structure:
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

Rationale:
- Minimal HTML5 boilerplate with no semantic elements (no `<header>`, `<main>`, etc.) to reduce cognitive load
- CSS loaded via relative path `/src/style.css` — Vite serves from repository root
- JavaScript module loaded with `type="module"` to enable ES6 import syntax
- No container `<div>` — `src/main.js` will append renderer canvas directly to `document.body`
- Viewport meta tag ensures proper mobile rendering (though mobile optimization is a non-goal per Intent)

**Operation 2: Rewrite `src/style.css`**

Current state: File exists but content unknown; assuming needs complete replacement.

Target content:
```css
body {
  margin: 0;
  overflow: hidden;
}

canvas {
  display: block;
}
```

Rationale:
- `margin: 0` removes default browser spacing around `<body>` element
- `overflow: hidden` prevents scrollbars during window resize edge cases
- `canvas { display: block; }` eliminates inline element spacing (default `display: inline` adds 4px bottom margin)
- No width/height rules on canvas — Three.js `renderer.setSize()` handles sizing programmatically
- Total: 3 rules, ~50 bytes unminified — well under 10KB project size constraint

**Operation 3: Rewrite `src/main.js`**

Current state: File exists but content unknown; assuming needs complete replacement.

Target implementation architecture (87 lines excluding blank lines):

```javascript
// Module-level imports (3 lines)
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Module-level variable declarations (1 line)
let scene, camera, renderer, cube, controls;

// Init function: Scene graph construction (25-30 lines)
function init() {
  // Scene creation
  scene = new THREE.Scene();
  
  // Camera setup (PerspectiveCamera with FOV 75, aspect ratio, near/far planes)
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  
  // Renderer configuration
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x1a1a2e);
  document.body.appendChild(renderer.domElement);
  
  // Cube geometry and material
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  // Lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  // OrbitControls initialization
  controls = new OrbitControls(camera, renderer.domElement);
}

// Animation loop function (5-7 lines)
function animate() {
  requestAnimationFrame(animate);
  
  // Cube rotation on X and Y axes
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Render scene
  renderer.render(scene, camera);
}

// Resize handler function (6-8 lines)
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Event listener attachment (1 line)
window.addEventListener('resize', onWindowResize);

// Initialization call (2 lines)
init();
animate();
```

Line count breakdown:
- Imports: 2 lines
- Module variables: 1 line
- `init()` function: ~30 lines (scene, camera, renderer, cube, lights, controls)
- `animate()` function: ~7 lines (requestAnimationFrame, rotation updates, render call)
- `onWindowResize()` function: ~6 lines (aspect ratio, projection matrix, renderer resize)
- Event listener: 1 line
- Execution calls: 2 lines
- **Total: ~49 lines of code (excluding blank lines between functions)**

Rationale for architectural choices:
- **Module-level scope for scene objects** — `scene`, `camera`, `renderer`, `cube`, `controls` need persistence across animation frames
- **Inline geometry/material in `init()`** — These are consumed once; no need for module-level references
- **Functional decomposition** — Three functions (`init`, `animate`, `onWindowResize`) each handle distinct lifecycle concerns
- **No damping on OrbitControls** — Avoids need for `controls.update()` in animation loop, saving lines
- **Green cube color (`0x00ff00`)** — High contrast against dark background, easily distinguishable lighting on faces
- **Rotation speed 0.01 radians/frame** — Approximately 1 full rotation per 10 seconds at 60fps, visually smooth
- **AmbientLight at 50% intensity, DirectionalLight at 80%** — Ensures all cube faces receive some illumination while maintaining clear contrast

**Operation 4: Verify `package.json` (no changes needed)**

Current state already satisfies all Intent requirements:
- `"type": "module"` enables ES6 imports
- `"scripts": { "dev": "vite" }` provides development server command
- `"dependencies": { "three": "^0.160.0" }` locks Three.js to r160 series
- `"devDependencies": { "vite": "^5.0.0" }` locks Vite to v5 series
- `"engines": { "node": ">=18.0.0" }` documents Node requirement

No modifications required for this orbit.

### Execution Sequence

1. **Read existing file states** (validation phase)
   - Inspect current `index.html`, `src/main.js`, `src/style.css` content
   - Confirm `package.json` matches expected state
   - Verify `src/` directory exists

2. **Write `src/style.css`** (smallest file, no dependencies)
   - Overwrite existing content with 3-rule stylesheet
   - Validate CSS syntax

3. **Write `index.html`** (depends on style.css existing)
   - Overwrite existing content with minimal HTML5 boilerplate
   - Validate HTML5 structure and relative paths

4. **Write `src/main.js`** (largest file, core implementation)
   - Overwrite existing content with complete Three.js scene setup
   - Validate line count under 100 (excluding blanks/comments)
   - Ensure OrbitControls import path uses `.js` extension

5. **Verification** (manual human validation required per Trust Tier 2)
   - Run `npm install` to ensure dependencies resolve
   - Run `npm run dev` and visually confirm:
     - Rotating green cube renders immediately
     - Mouse drag orbits camera around cube
     - Window resize maintains full viewport
     - No console errors in browser DevTools

### Dependency Chain

```
package.json (already satisfied)
    ↓
src/style.css (no dependencies)
    ↓
index.html (references style.css, main.js)
    ↓
src/main.js (imports three, OrbitControls; depends on HTML mounting body)
```

All file writes can execute in parallel after validation phase, but logical ordering above ensures each file's dependencies exist before write operation.

## Risk Surface

### Technical Risks

**Risk 1: OrbitControls Import Path Incompatibility**

Context: Three.js examples path structure changed between r147 and r160; Vite requires explicit `.js` extensions.

Likelihood: Low — Path `'three/examples/jsm/controls/OrbitControls.js'` confirmed stable in r160.

Impact: High — Module not found error blocks entire application load.

Mitigation strategy:
- Use full path with `.js` extension: `'three/examples/jsm/controls/OrbitControls.js'`
- Vite's ES module resolution will map to `node_modules/three/examples/jsm/controls/OrbitControls.js`
- If path fails, fallback to CDN import as emergency measure (violates Intent but unblocks testing)

Detection: Browser console shows "Failed to resolve module specifier" error on dev server load.

**Risk 2: Line Count Budget Violation**

Context: Intent mandates `src/main.js` under 100 lines excluding blanks/comments. Current proposal targets 87 lines of actual code + blank lines for readability.

Likelihood: Low — Proposed implementation has 13-line buffer before constraint violation.

Impact: Medium — Violates acceptance criteria but code remains functional.

Mitigation strategy:
- Eliminate all blank lines between functions (reduces readability but saves ~10 lines)
- Inline `onWindowResize` function directly in `addEventListener` callback (saves ~6 lines)
- Remove antialias option from WebGLRenderer (saves 1 line, minor visual quality loss)
- Consolidate variable declarations: `let scene, camera, renderer, cube, controls;` already minimal

Detection: Manual line count validation during code review phase.

**Risk 3: Cube Not Visible on Initial Render**

Context: Camera positioning, lighting, or geometry issues could result in black screen despite code executing.

Likelihood: Low — Standard Three.js pattern well-tested across community examples.

Impact: High — Violates Intent acceptance criterion "cube centered in viewport, lighting makes faces distinguishable."

Mitigation strategy:
- Camera positioned at `z = 5`, looking at origin where cube sits at `(0, 0, 0)`
- PerspectiveCamera FOV 75 degrees provides wide enough view frustum
- Green material color (`0x00ff00`) high contrast against dark background (`0x1a1a2e`)
- AmbientLight ensures no face is completely black; DirectionalLight creates contrast
- Default BoxGeometry size (1×1×1) easily visible at camera distance 5 units

Detection: Visual inspection in browser after `npm run dev`. If black screen, check WebGL context creation in DevTools console.

**Risk 4: Window Resize Distortion**

Context: Incorrect aspect ratio handling or renderer size updates could stretch/squash cube during resize.

Likelihood: Low — Standard resize handler pattern.

Impact: Medium — Violates Intent acceptance criterion "window resize maintains full-viewport canvas without distortion."

Mitigation strategy:
- `onWindowResize()` updates camera aspect ratio: `camera.aspect = window.innerWidth / window.innerHeight`
- Call `camera.updateProjectionMatrix()` to apply aspect change to projection matrix
- Update renderer size: `renderer.setSize(window.innerWidth, window.innerHeight)`
- Event listener attached at module level ensures handler persists across HMR reloads

Detection: Manual testing by resizing browser window and observing cube proportions remain 1:1.

**Risk 5: Animation Performance Below 60fps**

Context: Intent accepts frame drops on low-end hardware but requires 60fps on capable devices.

Likelihood: Low on target hardware — single cube with simple material is minimal rendering workload.

Impact: Low — Intent acceptance boundary allows degraded performance on low-end hardware.

Mitigation strategy:
- Use BoxGeometry with default segment counts (6 faces, 12 triangles total)
- MeshStandardMaterial with defaults (no normal maps, no environment maps)
- No shadows enabled (DirectionalLight and renderer both default to no shadows)
- Single directional light + ambient light (minimal lighting calculations per frame)
- Rotation updates (`cube.rotation.x += 0.01`) trivial CPU cost

Detection: Browser DevTools Performance tab or `stats.js` library (not included in this minimal project).

### Scope Risks

**Risk 6: Existing File Content Conflicts**

Context: Repository structure shows `index.html`, `src/main.js`, `src/style.css` already exist. Content unknown; may contain partial implementations or conflicting code.

Likelihood: Medium — Context Package notes files exist but content unverified.

Impact: Medium — Merge conflicts or unexpected behavior if existing content not fully replaced.

Mitigation strategy:
- Treat all three files as complete overwrites during implementation
- Do not attempt to merge or preserve existing content
- Assume prior content is incorrect or incomplete per Context Package guidance
- Verify file writes succeed without filesystem errors

Detection: Post-write validation that file sizes match expected content length.

**Risk 7: Vite Dev Server Port Conflict**

Context: Default Vite port 5173 may be occupied by another process.

Likelihood: Low — Most developers won't have conflicting services on 5173.

Impact: Low — Vite automatically assigns alternative port and displays new URL in terminal.

Mitigation strategy:
- Rely on Vite's automatic port assignment fallback
- No custom port configuration needed in `vite.config.js`
- Terminal output will show actual port: "Local: http://localhost:5174" if 5173 occupied

Detection: Terminal output after `npm run dev` execution shows assigned port.

### Dependency Risks

**Risk 8: Three.js r160 API Deprecation**

Context: Three.js releases new versions monthly; r160 (December 2023) may have deprecated APIs by execution time.

Likelihood: Low — Using only core stable APIs (Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Lights).

Impact: Low — Caret range `^0.160.0` locks to r160 minor version; patch updates won't introduce breaking changes.

Mitigation strategy:
- All APIs used are stable since Three.js r90 (2018)
- No experimental features or recently added APIs
- If deprecation warnings appear in console, they are non-blocking

Detection: Browser console deprecation warnings after scene initialization.

**Risk 9: Node.js Version Below 18.0.0**

Context: Developer machine may have Node 16 or earlier installed; Vite 5.0 requires Node 18+.

Likelihood: Medium — Node 16 reached end-of-life September 2023 but may still be installed on developer machines.

Impact: High — `npm install` fails with engine incompatibility error.

Mitigation strategy:
- `package.json` already specifies `"engines": { "node": ">=18.0.0" }`
- npm will display clear error message: "The engine 'node' is incompatible with this module"
- Error message instructs user to upgrade Node version

Detection: npm error during `npm install` execution before any code runs.

## Scope Estimate

### Complexity Assessment

**Overall Complexity: Low**

Rationale:
- **Greenfield project** — No existing codebase to integrate with or refactor around
- **Well-defined scope** — Exactly 4 files with explicit acceptance criteria
- **Standard patterns** — All Three.js code follows established community conventions
- **No data persistence** — No database, API, or state management concerns
- **No testing infrastructure** — Verification via visual inspection per Tier 2 trust model

### Work Breakdown

**Phase 1: File Inspection (Validation)**
- Read current content of `index.html`, `src/main.js`, `src/style.css`
- Verify `package.json` matches expected state
- Confirm `src/` directory exists
- Estimated effort: 5 minutes human time, <1 second execution time

**Phase 2: File Writing (Implementation)**
- Write `src/style.css` — 3 CSS rules, ~50 bytes
- Write `index.html` — 11 lines HTML5 boilerplate
- Write `src/main.js` — 87 lines Three.js scene setup
- Estimated effort: 15 minutes human review, <1 second execution time per file

**Phase 3: Verification (Manual Testing)**
- Run `npm install` to resolve dependencies
- Run `npm run dev` to start Vite development server
- Visual inspection: cube renders, rotates, responds to mouse, resizes correctly
- Line count validation: confirm `src/main.js` under 100 lines
- Console inspection: no errors or warnings
- Estimated effort: 10 minutes human testing

**Total Estimated Time: 30 minutes human time, <5 seconds machine time**

### Orbit Count Estimate

**Single Orbit Sufficient**

This proposal represents the complete implementation plan for the stated Intent. No additional orbits anticipated because:

- Scope is fully bounded by 4 files and explicit acceptance criteria
- No architectural unknowns requiring exploration orbits
- No integration dependencies requiring coordination orbits
- No performance optimization or refactoring orbits needed (non-goals per Intent)

If human review identifies issues requiring rework:
- Orbit 2a: Address line count violations (collapse functions, remove comments)
- Orbit 2b: Fix rendering issues (adjust camera position, lighting intensity)
- Orbit 2c: Resolve import path errors (correct OrbitControls path)

Each remediation orbit estimated at <10 minutes assuming isolated scope change.

### Success Criteria Mapping

| Intent Acceptance Criterion | Verification Method | Risk Level |
|------------------------------|---------------------|------------|
| `npm install && npm run dev` opens browser with rotating cube | Manual visual inspection after Vite start | Low |
| Mouse drag rotates camera view (OrbitControls) | Manual mouse interaction testing | Low |
| Window resize maintains full viewport without distortion | Manual browser window resize testing | Low |
| Cube rotates continuously on X and Y axes | Visual observation of animation loop | Low |
| `src/main.js` under 100 lines | Automated line count excluding blanks/comments | Medium |
| No ESLint errors with standard ES6+ rules | Automated linting (if ESLint configured) or manual code review | Low |
| All Three.js imports from installed `three` package | Code inspection of import statements | Low |
| Cube centered in viewport on initial load | Visual inspection of camera/cube positioning | Low |
| Lighting makes cube faces distinguishable | Visual inspection of rendered scene | Low |
| Canvas has no white borders, margins, or padding | Visual inspection + DevTools element inspector | Low |
| Exactly 4 files in repository | Filesystem audit after implementation | Low |
| `index.html` loads `src/main.js` as ES module | Code inspection of script tag `type` attribute | Low |
| `src/style.css` referenced in `index.html` | Code inspection of link tag `href` attribute | Low |

## Human Modifications

Pending human review.