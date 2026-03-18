# Context Package: Three.js Minimal Starter Project

## Codebase References

### Existing Files

The repository currently contains a partial implementation that must be evaluated and potentially replaced:

| File Path | Current State | Required Action |
|-----------|---------------|-----------------|
| `package.json` | Exists with correct dependencies (three ^0.160.0, vite ^5.0.0) and dev script | Verify compliance with Intent constraints; update if needed |
| `index.html` | Exists but content unknown | Must contain HTML5 boilerplate, script tag importing `/src/main.js` as ES module, and mount point for Three.js canvas |
| `src/main.js` | Exists but content unknown | Must contain complete Three.js scene setup under 100 lines |
| `src/style.css` | Exists but content unknown | Must reset body/html margins, set canvas to full viewport |
| `README.md` | Contains only "Testing purposes" placeholder | Should be updated with project description, setup instructions, and tech stack documentation |

### Files Not Present (Expected)

- `node_modules/` — Will be created by `npm install`
- `package-lock.json` — Will be created by npm on first install
- `.gitignore` — Recommended but not required by Intent; should exclude `node_modules/` and `dist/` if created

### Three.js Module Imports

The implementation must use ES module imports from the Three.js package:

```javascript
// Core Three.js imports (all from 'three' package)
import * as THREE from 'three';
// OR selective imports:
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from 'three';

// OrbitControls import (from examples subdirectory)
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Critical Path Note:** OrbitControls is not in the main Three.js export but in `three/examples/jsm/` subdirectory. This path must be exact.

### Vite Module Resolution

Vite resolves bare module specifiers (`'three'`) automatically when packages are installed in `node_modules/`. No additional configuration or import maps are required. The `"type": "module"` field in `package.json` enables ES module syntax throughout the project.

## Architecture Context

### Project Structure Pattern

This is a **flat Vite project** with minimal directory nesting:

```
/
├── index.html          # Entry point (must be at root for Vite)
├── package.json        # Dependencies and scripts
├── src/
│   ├── main.js        # Three.js scene initialization
│   └── style.css      # Global styles
└── README.md          # Documentation
```

**Rationale:** Vite expects `index.html` at the project root by default. The `src/` directory is a conventional location for source files but not required by Vite. This structure minimizes cognitive overhead for beginners.

### Build Tool: Vite Architecture

Vite operates in two modes relevant to this project:

1. **Development Mode** (`npm run dev`):
   - Serves `index.html` from the root directory
   - Transforms ES modules on-demand (no bundling)
   - Provides hot module replacement (HMR) for CSS and JS
   - Default port: 5173
   - Automatically resolves `node_modules/` imports

2. **Production Mode** (not required by Intent):
   - `npm run build` would create optimized bundle
   - Not included in `package.json` scripts per Intent constraints

**Key Vite Behavior:** Script tags with `type="module"` trigger Vite's ES module transformation pipeline. Vite intercepts imports and rewrites bare specifiers to full paths.

### Three.js Scene Graph Architecture

The implementation must follow Three.js's standard initialization pattern:

```
Scene (container)
├── Mesh (cube)
│   ├── Geometry (BoxGeometry)
│   └── Material (MeshStandardMaterial)
├── AmbientLight
├── DirectionalLight
└── Camera (PerspectiveCamera)

Renderer (WebGLRenderer)
└── renders Scene from Camera's perspective

OrbitControls
└── manipulates Camera based on user input
```

**Critical Relationships:**
- The Renderer must be given the Scene and Camera to render
- OrbitControls must be given the Camera and the Renderer's DOM element
- MeshStandardMaterial requires lights to be visible (PBR-based)
- The animation loop must call both `renderer.render()` and `controls.update()`

### Data Flow

1. **Initialization Phase:**
   - Create Scene, Camera, Renderer
   - Create and add Mesh (cube) to Scene
   - Create and add Lights to Scene
   - Initialize OrbitControls
   - Append Renderer's canvas to DOM

2. **Animation Loop:**
   - Update cube rotation (`.rotation.x += delta`, `.rotation.y += delta`)
   - Update OrbitControls (`.update()`)
   - Render scene (`.render(scene, camera)`)
   - Schedule next frame (`requestAnimationFrame`)

3. **Resize Handling:**
   - Listen to `window.resize` event
   - Update camera aspect ratio
   - Update camera projection matrix
   - Update renderer size

## Pattern Library

### Established Patterns in Similar Three.js Projects

While this repository is being initialized, standard Three.js community patterns apply:

#### Module Import Pattern

```javascript
// Preferred: Named imports for tree-shaking
import { Scene, PerspectiveCamera, WebGLRenderer } from 'three';

// Acceptable: Namespace import for compact code
import * as THREE from 'three';
// Then: new THREE.Scene(), etc.
```

For this 100-line constraint project, namespace import (`* as THREE`) is recommended to reduce line count.

#### Scene Initialization Pattern

```javascript
// Standard Three.js initialization order:
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Configure renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);

// Position camera
camera.position.z = 5; // Or similar offset
```

#### Animation Loop Pattern

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update logic
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  controls.update();
  
  // Render
  renderer.render(scene, camera);
}

animate();
```

#### Resize Handler Pattern

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### CSS Reset Pattern

Standard full-viewport canvas pattern:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden; /* Prevent scrollbars */
}

canvas {
  display: block; /* Removes inline spacing */
}
```

### HTML Entry Point Pattern

Minimal HTML5 structure for Vite + Three.js:

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

**Key Details:**
- Script tag must have `type="module"` for ES modules
- Vite resolves `/src/main.js` from project root
- No explicit canvas element — Three.js creates and appends it

## Prior Orbit References

### Orbit #1 Context (Inferred from Artifact Directory)

The `.orbital/artifacts/` directory contains 5 previous orbit artifact sets:

| Orbit ID | Artifacts Present | Inference |
|----------|-------------------|-----------|
| `c71c2625-0f6b-441c-a24b-a5d187d1ae16` | Complete (Intent, Context, Proposal, Verification, Code Generation, Test Results) | Fully executed orbit with verification |
| `301f1e8d-e7c8-4301-800b-08068adb2568` | Partial (Intent, Context, Proposal) | Orbit reached proposal phase but not verified |
| `7e840ae3-0fb3-4df0-9e89-5f9d4f42d06b` | Partial (Intent, Context, Proposal) | Orbit reached proposal phase but not verified |
| `a6b4c09a-283b-48f1-9386-68f4ef295656` | Partial (Intent, Context, Proposal) | Orbit reached proposal phase but not verified |
| `ad0a63a2-3f0b-4341-b01e-e318d909c4c6` | Partial (Intent, Context, Proposal) | Orbit reached proposal phase but not verified |

**Analysis:** Only one orbit (`c71c2625...`) completed full execution cycle including code generation and testing. The other four orbits were abandoned after the proposal phase. This suggests:

1. Prior attempts may have encountered issues during execution
2. Verification standards may be high, causing iterative refinement
3. The current repository state may reflect partial implementation from abandoned orbits

**Lesson for This Orbit:** The existing `package.json` with correct dependencies suggests a prior orbit successfully completed dependency setup. However, the implementation files (`index.html`, `src/main.js`, `src/style.css`) may be in unknown states and should be validated against Intent requirements rather than assumed correct.

### No Direct Technical Lineage

This orbit (#2) is described as a "greenfield initialization" in the Intent Document's Dependencies section. While the repository contains files and prior orbit artifacts, there is no explicit dependency on prior orbits' technical decisions.

## Risk Assessment

### High-Risk Areas

#### 1. Module Resolution Failures

**Risk:** OrbitControls import path incorrect or Three.js version mismatch causing module not found errors.

**Symptoms:**
- `Failed to resolve module specifier "three/examples/jsm/controls/OrbitControls.js"`
- `Cannot find module 'three/addons/controls/OrbitControls.js'` (old path)

**Likelihood:** Medium (Three.js changed OrbitControls path in recent versions)

**Mitigation:**
- Verify Three.js version ≥ 0.160.0 uses `three/examples/jsm/` path
- Test import immediately after implementation
- Fallback: Use `three/addons/` path if version is 0.168.0+

#### 2. WebGL Capability Detection

**Risk:** Code assumes WebGL is available but user's browser/hardware doesn't support it.

**Symptoms:**
- Black screen with no error message
- `WebGL: CONTEXT_LOST_WEBGL` console error
- Silent failure on integrated graphics or old browsers

**Likelihood:** Low (most modern browsers support WebGL 1.0)

**Impact:** High (complete application failure with poor user feedback)

**Mitigation:**
- Intent requires "graceful WebGL capability detection" for Target quality tier
- Implementation should check `WebGLRenderer` instantiation success
- Consider: `try/catch` around renderer creation with informative error message

#### 3. Aspect Ratio Distortion on Resize

**Risk:** Camera aspect ratio not updated correctly on window resize, causing stretched/squashed rendering.

**Symptoms:**
- Cube appears elongated or compressed after window resize
- Scene looks correct on initial load but breaks on resize

**Likelihood:** Medium (common mistake in Three.js tutorials)

**Impact:** Medium (visual quality issue, not functional failure)

**Mitigation:**
- Ensure resize handler updates both `camera.aspect` and calls `camera.updateProjectionMatrix()`
- Test on multiple window sizes and aspect ratios
- Intent's Target tier requires "immediate resize with correct aspect ratio"

#### 4. Performance Degradation

**Risk:** Animation loop doesn't maintain 60 FPS due to inefficient render calls or controls updates.

**Symptoms:**
- Stuttering or janky rotation
- FPS drops on lower-end hardware
- High CPU usage in browser task manager

**Likelihood:** Low (single cube is minimal scene)

**Impact:** Medium (affects pedagogical value and user experience)

**Mitigation:**
- Call `controls.update()` only if controls have damping enabled (they shouldn't for this minimal example)
- Avoid redundant re-renders or object creation in animation loop
- Intent specifies 60 FPS on mid-range hardware as Target tier

### Medium-Risk Areas

#### 5. CSS Specificity Conflicts

**Risk:** Canvas doesn't fill viewport due to CSS not properly resetting browser defaults.

**Symptoms:**
- White margins around canvas
- Scrollbars appearing
- Canvas not responsive to window resize

**Likelihood:** Medium (requires proper CSS reset)

**Impact:** Low (visual issue, easily debugged)

**Mitigation:**
- Reset `margin` and `padding` on `*`, `html`, and `body`
- Set `overflow: hidden` on body to prevent scrollbars
- Set `display: block` on canvas to remove inline element spacing

#### 6. Vite Server Configuration

**Risk:** Vite dev server doesn't start due to port conflicts or missing dependencies.

**Symptoms:**
- `EADDRINUSE` error (port 5173 already in use)
- `npm run dev` hangs or fails
- Browser doesn't open automatically

**Likelihood:** Low (Vite handles port conflicts with fallback)

**Impact:** Low (blocks local development but easily resolved)

**Mitigation:**
- Vite automatically tries alternative ports if 5173 is occupied
- Ensure `package.json` script is exactly `"dev": "vite"` (no additional flags)
- Intent specifies Target tier: "Opens browser automatically to correct localhost port"

### Low-Risk Areas

#### 7. Lighting Configuration

**Risk:** Lights positioned incorrectly causing cube to be too dark or washed out.

**Symptoms:**
- Cube barely visible against dark background
- Cube appears flat with no shading
- Over-exposed white cube with no depth

**Likelihood:** Low (standard lighting patterns well-documented)

**Impact:** Medium (affects visual quality and pedagogical value)

**Mitigation:**
- Use standard AmbientLight (color: 0xffffff, intensity: 0.5)
- Use standard DirectionalLight (color: 0xffffff, intensity: 0.8, position: [5, 5, 5])
- Intent's Target tier requires "lighting shows form and dimension clearly"

#### 8. Line Count Constraint Violation

**Risk:** Implementation exceeds 100-line constraint in `src/main.js`.

**Symptoms:**
- Code includes verbose error handling or comments that inflate line count
- Multiple initialization functions instead of inline setup

**Likelihood:** Low (single cube scene is naturally compact)

**Impact:** Low (violates constraint but doesn't affect functionality)

**Mitigation:**
- Use namespace import (`import * as THREE`) to reduce import lines
- Combine related operations on single lines where readable
- Intent specifies Minimum tier: < 100 lines, Target tier: < 80 lines, Ideal tier: < 60 lines

### Security Considerations

**No significant security risks identified** for this orbit:

- No user input processing (OrbitControls operates on mouse events but doesn't execute arbitrary code)
- No network requests beyond npm package installation
- No DOM manipulation beyond appending renderer canvas
- No eval() or dynamic code execution
- Dependencies (Three.js, Vite) are well-established open-source projects with active security maintenance

**Standard supply chain security applies:**
- Verify `package-lock.json` integrity after `npm install`
- Use npm audit to check for known vulnerabilities in dependencies
- Pin dependency versions with `^` semver range (already specified in `package.json`)