# Context Package: Subtle Interaction + Scene Polish with Minimal Menu

## Codebase References

### Primary Implementation Surface

**`src/main.js`** — Core scene logic and animation loop  
Current responsibilities based on prior orbit:
- Three.js scene initialization (`Scene`, `PerspectiveCamera`, `WebGLRenderer`)
- Three geometric objects: cube, diamond (likely `OctahedronGeometry`), sphere
- Two light sources: `AmbientLight` and `DirectionalLight`
- `OrbitControls` for camera manipulation
- `requestAnimationFrame` loop with rotation logic for objects
- Window resize handler

This file will receive all new functionality: shadow configuration, mouse interaction listener, orbital motion calculations, and ground plane geometry.

**`index.html`** — Document entry point  
Must contain:
- Canvas element (target for WebGLRenderer)
- Link to `src/main.js` as ES module
- Location for new minimal menu HTML structure

**`src/style.css`** — Visual styling  
Current rules:
- Full viewport canvas (`width: 100vw; height: 100vh`)
- Zero margin/padding on body
- Will receive new menu overlay styles (positioning, transparency, contrast)

**`package.json`** — Dependency manifest  
Locked dependencies:
- `three@^0.160.0` — Provides all required Three.js APIs
- `vite@^5.0.0` — Dev server with HMR

### Three.js API Surface Areas

**Shadow System (from `three` v0.160.0):**
- `WebGLRenderer.shadowMap.enabled = true`
- `WebGLRenderer.shadowMap.type = THREE.PCFSoftShadowMap`
- `DirectionalLight.castShadow = true`
- `Mesh.castShadow = true` (for cube, diamond, sphere)
- `Mesh.receiveShadow = true` (for ground plane)

**Geometry Primitives:**
- `PlaneGeometry` for ground plane (recommended: 30x30 units to exceed minimum 20x20)
- Existing: `BoxGeometry` (cube), `OctahedronGeometry` (diamond), `SphereGeometry`

**Material System:**
- `MeshStandardMaterial` already in use (physically-based, supports shadows)
- Ground plane should use same material type with dark, low-roughness settings

**Controls:**
- `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js`
- Must remain unmodified and functional after changes

## Architecture Context

### Rendering Pipeline

**Current Flow:**
1. Vite serves `index.html` → loads `src/main.js` as ES module
2. `main.js` creates WebGLRenderer attached to canvas in DOM
3. Scene graph contains camera, lights, and three mesh objects
4. Animation loop runs via `requestAnimationFrame`, updating rotations and rendering frame
5. OrbitControls intercepts mouse/touch events for camera manipulation

**Enhanced Flow (Post-Orbit):**
1. Renderer shadow map enabled during initialization
2. Ground plane added to scene graph with `receiveShadow = true`
3. All mesh objects set `castShadow = true`
4. Animation loop extended with:
   - Independent rotation logic for diamond (different axis than cube)
   - Orbital position calculation for sphere using `Math.sin`/`Math.cos`
   - Mouse position tracking converted to light property updates
5. Menu HTML inserted into `index.html` DOM, styled via CSS overlay

### Data Flow Constraints

**No External Data:**
- All state lives in `main.js` closure scope (scene objects, animation parameters)
- No localStorage, sessionStorage, or network calls
- Date stamp "March 19, 2026" hardcoded in HTML

**Mouse Interaction Flow:**
```
Browser mousemove event → Event listener in main.js → 
Normalize coordinates to [-1, 1] → 
Apply to DirectionalLight.position or .intensity → 
Next frame renders with updated lighting
```

### Performance Architecture

**Rendering Budget:**
- Target: 60fps (16.67ms per frame)
- Shadow map generation adds ~2-4ms on integrated GPU
- Animation calculations (rotation, orbital motion) negligible (<0.5ms)
- Mouse event throttling not required given simplicity of calculation

**Memory Footprint:**
- Current scene: ~3 geometries, 2 lights, minimal
- Added: 1 PlaneGeometry (ground), 1 mousemove listener
- Total scene objects: <10 (well within single-digit thousands threshold)

### Integration Points

**DOM Integration:**
- Canvas rendered by Three.js (existing)
- Menu overlay in regular HTML/CSS positioned absolutely over canvas
- No interaction between 3D scene and menu (separate layers)

**Build System:**
- Vite handles ES module imports from `node_modules/three`
- No build configuration changes required
- HMR will work for `main.js` and `style.css` edits during development

## Pattern Library

### Code Organization Pattern

**From Prior Orbit (Orbit 1):**
- Single-file architecture: all logic in `src/main.js`
- No classes or complex abstractions — functional style with closures
- Variables declared with `const` where possible
- Imports at top: `import * as THREE from 'three'` and `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`

### Naming Conventions

**Scene Objects:**
- Geometry primitives: lowercase descriptive names (`cube`, `diamond`, `sphere`)
- Lights: `ambientLight`, `directionalLight` (camelCase)
- Scene infrastructure: `scene`, `camera`, `renderer`, `controls`

**Suggested Additions:**
- Ground plane: `groundPlane` or `floor`
- Animation time tracker: `clock` (Three.js `Clock` object pattern)
- Mouse position: `mouseX`, `mouseY` (normalized coordinates)

### Animation Pattern

**Existing (from Orbit 1):**
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // Similar for diamond and sphere
  
  controls.update();
  renderer.render(scene, camera);
}
```

**Expected Enhancement:**
- Diamond rotation on different axis (e.g., `.z` and `.x` instead of `.x` and `.y`)
- Sphere position calculated via trigonometry for orbital motion
- Light property update based on mouse position before render

### Resize Handling Pattern

**Current Implementation:**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

Must remain intact — no modifications to this handler.

### Material Instantiation Pattern

**Existing Standard:**
```javascript
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
```

**Ground Plane Recommendation:**
```javascript
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0f,  // Very dark, slightly blue-tinted
  roughness: 0.8,
  metalness: 0.2
});
```

### CSS Overlay Pattern

**Menu Implementation:**
- Absolute positioning in top-left or top-right corner
- `position: absolute; top: 20px; left: 20px;`
- Semi-transparent background: `background: rgba(0, 0, 0, 0.5);`
- White or light text with sufficient contrast
- Padding for readability: `padding: 10px 15px;`
- `z-index` higher than canvas (typically `z-index: 10;`)

## Prior Orbit References

### Orbit 1: Initial Three.js Scene Setup

**Orbit ID:** `feb8e410-9390-453a-b597-a92938a16631`

**Artifacts Available:**
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/intent_document.md`
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/context_package.md`
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/proposal_record.md`
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/code_generation.md`
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/test_results.md`

**What Orbit 1 Delivered:**
- Functional Vite + Three.js project structure
- PerspectiveCamera positioned to view scene center
- WebGLRenderer with dark background (0x1a1a2e)
- Three geometric objects (cube, diamond, sphere) with rotation animations
- AmbientLight + DirectionalLight illumination
- OrbitControls for mouse-based camera control
- Full viewport canvas with window resize handling
- All code under 100 lines in `src/main.js`

**Current State Assumptions:**
This orbit begins with a working scene where:
- All three objects are visible and rotating
- Camera can be controlled via mouse drag (OrbitControls)
- Lighting illuminates objects uniformly
- No shadows, no mouse interaction beyond OrbitControls, no menu

**Lessons from Orbit 1:**
- 100-line constraint is achievable for this scope
- MeshStandardMaterial works well with the lighting setup
- Dark background aesthetic established and effective
- No performance issues reported in test results

### Other Prior Orbits (Not Directly Related)

**Orbit 2e6b889d, 7cac94ca, db5c7d22:**
- Different trajectory artifacts, not relevant to Three.js scene implementation
- No code or pattern overlap

## Risk Assessment

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Exceeding 100-line budget** | Medium | High | Pre-calculate line allocation: ~10 lines for shadows, ~15 for orbital motion, ~10 for mouse interaction, ~5 for ground plane, ~10 for menu CSS reference. Use compact syntax (ternaries, chained assignments). |
| **Shadow performance degradation** | Low | Medium | Use `PCFSoftShadowMap` (lower quality than `PCFSoftShadowMap` but faster). Set `DirectionalLight.shadow.mapSize` to 1024×1024 max (not 2048). Test on Intel UHD 620 benchmark. |
| **Mouse interaction conflicts with OrbitControls** | Medium | Medium | Normalize mouse coordinates to [-1, 1] range. Only modify light properties, not camera. OrbitControls listens to specific mouse events (drag, wheel) that won't overlap with passive `mousemove`. |
| **Ground plane visible edges** | Low | Low | Set PlaneGeometry to 30×30 units (50% buffer over 20×20 minimum). Position at `y = -3` to stay below objects. Rotate to horizontal (`rotation.x = -Math.PI / 2`). |
| **Menu obscuring scene** | Low | Low | Position in corner with max 10% viewport coverage. Use `pointer-events: none` on non-interactive elements to allow OrbitControls passthrough. |
| **Inconsistent motion timing** | Low | Medium | Use `THREE.Clock` for delta-time calculations instead of fixed increments. Ensures consistent speed across varying frame rates. |

### Performance Risks

**Shadow Map Overhead:**
- DirectionalLight shadow map generation runs once per light per frame
- With 3 shadow-casting objects + 1 receiver, complexity is minimal
- Risk: Older integrated GPUs (Intel HD 4000) may drop to 50fps
- Mitigation: Accept graceful degradation on very old hardware; target hardware (UHD 620, 2017+) handles this trivially

**Mouse Event Frequency:**
- `mousemove` fires at ~60Hz or higher
- Risk: Excessive garbage collection from repeated object allocations in listener
- Mitigation: Reuse variables for normalized coordinates; avoid creating new objects in hot path

### Visual/UX Risks

**Shadow Visibility:**
- Risk: Default DirectionalLight angle may not produce visible shadows
- Mitigation: Position light at angle that casts shadows toward camera (e.g., `position.set(5, 10, 7.5)`)

**Mouse Interaction Too Subtle:**
- Risk: Light changes imperceptible to user
- Mitigation: Scale mouse coordinates by 2-3× for light position offset; validate visibility during manual testing phase

**Menu Readability:**
- Risk: Low contrast against dark background or scene elements
- Mitigation: Semi-opaque dark background on menu (`rgba(0,0,0,0.7)`), white text, minimum 16px font size

### Regression Risks

**OrbitControls Breakage:**
- Risk: Mouse event listener interferes with control drag detection
- Mitigation: Use `addEventListener('mousemove', ...)` without `preventDefault()`. OrbitControls uses `pointerdown`/`pointermove`, different event chain.

**Resize Handler Override:**
- Risk: Adding new window listeners could duplicate or conflict
- Mitigation: Only add `mousemove` listener; do not modify existing `resize` listener

**Existing Animation Disruption:**
- Risk: Changing rotation logic breaks cube animation
- Mitigation: Leave cube rotation untouched (`.x += 0.01`, `.y += 0.01`). Only modify diamond and sphere.

### Security Considerations

**No Security Risks:**
- Client-side only, no user input processing
- No external data fetching or storage
- No eval, innerHTML, or dynamic script generation
- Hardcoded date string in HTML (no injection vector)

### Deployment Risks

**Build Process:**
- Risk: None — no changes to `package.json` or Vite configuration
- Existing `npm run dev` workflow unchanged

**Browser Compatibility:**
- Risk: WebGL shadow support requires WebGL 1.0 with extensions or WebGL 2.0
- Mitigation: Modern browsers (Chrome 56+, Firefox 51+, Safari 12+, Edge 79+) all support. Project already requires WebGL for Three.js.