# Context Package: Three.js Interactive 3D Scene Starter

## Codebase References

### Files to Create

| File Path | Purpose | Status |
|-----------|---------|--------|
| `index.html` | HTML entry point with canvas mount target | Does not exist |
| `src/main.js` | Three.js scene initialization and render loop | Does not exist |
| `src/style.css` | Full-viewport canvas styling with reset | Does not exist |

### Files to Modify

| File Path | Current State | Required Changes |
|-----------|---------------|------------------|
| `package.json` | Contains correct dependencies (`three@^0.160.0`, `vite@^5.0.0`) and dev script | Already compliant — no changes needed |
| `README.md` | Generic placeholder text | Should be updated with project setup instructions |

### Repository Structure Analysis

The repository is currently a greenfield Three.js project with only ORBITAL metadata (`.orbital/artifacts/`) and basic infrastructure files. The `package.json` already declares the correct dependencies and module type (`"type": "module"`), indicating ES modules support. No conflicting framework dependencies exist.

**Critical observation**: `index.html`, `src/main.js`, and `src/style.css` files appear in the repository structure but their contents are not provided. These files likely exist as empty placeholders or contain placeholder content that needs to be replaced with functional code.

## Architecture Context

### Project Structure Pattern

This follows the **Vite vanilla JavaScript template** pattern:

```
project-root/
├── index.html          # Entry point with <script type="module">
├── package.json        # Already configured with ES modules
├── src/
│   ├── main.js        # Application entry, imported by index.html
│   └── style.css      # Imported by main.js
└── .orbital/          # ORBITAL metadata (do not modify)
```

### Build System Integration

**Vite Development Server**:
- Serves `index.html` as the root document
- Transforms ES module imports on-the-fly
- Injects HMR client automatically
- Resolves `node_modules` imports (e.g., `import * as THREE from 'three'`)
- Default port: `5173`

**Module Resolution**:
- Three.js core: `import * as THREE from 'three'`
- OrbitControls addon: `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'` (standard Three.js r160+ path)
- No bundler configuration required — Vite handles this transparently

### Rendering Architecture

**Three.js Scene Graph**:
```
Scene
├── PerspectiveCamera (positioned for cube visibility)
├── AmbientLight (global illumination)
├── DirectionalLight (directional shadow/highlight)
└── Mesh
    ├── BoxGeometry
    └── MeshStandardMaterial (requires lighting to be visible)
```

**Render Loop Pattern**:
- Use `requestAnimationFrame` for 60fps targeting
- Update mesh rotation properties each frame
- Call `controls.update()` if damping is enabled
- Invoke `renderer.render(scene, camera)`

**Responsive Handling**:
- Listen to `window.resize` event
- Update `camera.aspect` ratio
- Call `camera.updateProjectionMatrix()`
- Update `renderer.setSize(window.innerWidth, window.innerHeight)`
- Set `renderer.setPixelRatio(window.devicePixelRatio)` for high-DPI displays

## Pattern Library

### Three.js Initialization Pattern (Standard Boilerplate)

**Renderer Setup**:
```javascript
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
```

**Scene Background**:
```javascript
scene.background = new THREE.Color(0x1a1a2e);
```

**Camera Positioning** (for centered cube visibility):
```javascript
const camera = new THREE.PerspectiveCamera(
  75,                                    // FOV
  window.innerWidth / window.innerHeight, // aspect
  0.1,                                   // near plane
  1000                                   // far plane
);
camera.position.z = 5; // Position to see unit cube at origin
```

**Lighting Setup** (for MeshStandardMaterial):
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft fill
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // key light
directionalLight.position.set(5, 5, 5);
```

**OrbitControls Integration**:
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // smooth camera motion (optional)
controls.dampingFactor = 0.05;
```

### CSS Viewport Reset Pattern

Standard pattern for full-screen canvas applications:
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden; /* prevent scrollbars */
}

canvas {
  display: block; /* removes inline spacing */
}
```

### HTML Module Script Pattern

Vite expects this structure in `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Starter</title>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Critical**: No `<canvas>` element in HTML — the renderer creates and appends it dynamically.

### Animation Loop Pattern

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update rotations
  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.01;
  
  // Update controls if damping enabled
  controls.update();
  
  // Render scene
  renderer.render(scene, camera);
}
animate();
```

## Prior Orbit References

### Completed Orbits in Repository

The `.orbital/artifacts/` directory contains 6 prior orbit UUID directories, indicating previous ORBITAL work has been executed. However, none of these artifacts appear to relate to Three.js or 3D graphics work:

- **301f1e8d**: Intent, context, proposal (no verification or code generation)
- **7e840ae3**: Intent, context, proposal (no verification or code generation)
- **a6b4c09a**: Intent, context, proposal (no verification or code generation)
- **ad0a63a2**: Intent, context, proposal (no verification or code generation)
- **b7565919**: Full orbit with verification and test results
- **c71c2625**: Full orbit with verification and test results

**Key takeaway**: This is the first Three.js-related orbit. No prior patterns or decisions to inherit. The existing `package.json` with correct dependencies suggests prior orbits may have set up the project structure but did not implement the actual scene code.

### Lessons from Package Configuration

The `package.json` is already properly configured with:
- `"type": "module"` — enables ES module syntax
- `"engines": { "node": ">=18.0.0" }` — enforces Node version compatibility
- Exact dev script command: `"dev": "vite"`

This suggests a pattern of **explicit dependency management** has been established. The proposal should maintain this standard.

## Risk Assessment

### Dependency Version Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Three.js 0.160.x has breaking API changes from documented patterns | Medium | Low | Use official Three.js r160 documentation for import paths; OrbitControls moved to `/addons/` subdirectory |
| Vite 5.0 has different default behavior than 4.x | Low | Low | Already specified in `devDependencies`; behavior is stable |
| `node_modules` not installed when user clones repo | High | High | Document `npm install` as first step in README |

### Browser Compatibility Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Safari may not support WebGL 2 on older macOS versions | Medium | Medium | Three.js automatically falls back to WebGL 1; no action needed |
| Mobile browsers may struggle with 60fps rendering | Medium | Medium | Intent explicitly excludes mobile optimization; acceptable tradeoff |
| High-DPI displays (Retina) may render at wrong resolution | Low | Medium | Include `renderer.setPixelRatio(window.devicePixelRatio)` in setup |

### Code Structure Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| JavaScript exceeds 100-line constraint | High | Medium | Use concise variable names; avoid unnecessary comments; inline simple operations |
| Missing `type="module"` in HTML script tag | High | Low | Verify `<script type="module">` in `index.html` |
| Renderer canvas not appended to DOM | Critical | Low | Explicitly call `document.body.appendChild(renderer.domElement)` |
| Animation loop calls itself infinitely without throttling | Medium | Low | `requestAnimationFrame` throttles automatically; no additional logic needed |
| Window resize listener not removed on cleanup | Low | Very Low | Not critical for this starter project; no SPA navigation to worry about |

### Performance Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Renderer does not respect device pixel ratio on high-DPI screens | Medium | Medium | Call `setPixelRatio` explicitly |
| OrbitControls damping causes extra render cycles | Low | Low | Document this tradeoff; damping is optional enhancement |
| No framerate throttling if monitor exceeds 60Hz | Low | Low | `requestAnimationFrame` syncs to display refresh; acceptable |
| Memory leak from not disposing geometry/material | Low | Very Low | Not relevant for single static cube; document for future enhancement |

### Build System Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Vite dev server fails to start due to port conflict | Medium | Low | Document default port `5173` in README; Vite auto-increments if blocked |
| CSS not imported causes unstyled canvas | High | Medium | Ensure `import './style.css'` at top of `main.js` |
| Incorrect relative path in HTML script tag | Critical | Low | Use `/src/main.js` (root-relative) not `./src/main.js` |

### Security Considerations

**No significant security risks** for this orbit:
- No user input processing
- No external API calls
- No authentication or data storage
- No dynamic code execution
- Static asset serving only (Vite dev server)

The only concern is standard dependency supply chain risk, which is mitigated by using stable, widely-adopted packages (Three.js and Vite).