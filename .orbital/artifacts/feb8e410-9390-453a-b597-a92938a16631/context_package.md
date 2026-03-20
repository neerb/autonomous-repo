# Context Package: Subtle Interaction + Scene Polish

## Codebase References

### Primary Modification Surface
- **`src/main.js`** — The sole JavaScript file containing all scene setup, animation loop, and event handling logic. This file must remain under 100 lines while accommodating new motion systems, mouse interaction, and shadow configuration. Current structure assumed based on project constraints:
  - Scene, camera, renderer initialization
  - Geometry instantiation (cube, diamond, sphere) with `MeshStandardMaterial`
  - Lighting setup (`AmbientLight` + `DirectionalLight`)
  - OrbitControls initialization
  - Animation loop using `requestAnimationFrame`
  - Window resize handler

### Static Resources (Read-Only)
- **`index.html`** — Entry point mounting the canvas. No modifications permitted per Intent constraints
- **`src/style.css`** — Full-viewport canvas styling with zero margin/padding. No modifications permitted
- **`package.json`** — Dependency manifest locked to `three@^0.160.0` and `vite@^5.0.0`. No modifications permitted

### Dependency Surface
- **Three.js ^0.160.0** — Core 3D library providing:
  - `THREE.WebGLRenderer` with shadow mapping capabilities (`shadowMap.enabled`, `shadowMap.type`)
  - Geometry primitives (BoxGeometry, OctahedronGeometry/custom diamond, SphereGeometry)
  - `MeshStandardMaterial` supporting `castShadow` and `receiveShadow` properties
  - `DirectionalLight` with configurable position, intensity, and shadow camera
  - `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js`
  - Math utilities (`THREE.MathUtils`, `Vector3`, trigonometric helpers)

### Interaction Points
- **Browser APIs:**
  - `window.addEventListener('mousemove', handler)` for light interaction
  - `window.addEventListener('resize', handler)` existing resize logic must coexist with shadow updates
  - `requestAnimationFrame(callback)` for render loop continuation

## Architecture Context

### Scene Graph Structure
The existing Three.js scene follows a flat hierarchy:
```
Scene
├── PerspectiveCamera (positioned to view origin)
├── AmbientLight (base illumination)
├── DirectionalLight (primary light source, modifiable)
├── Cube (BoxGeometry + MeshStandardMaterial, rotating on X/Y)
├── Diamond (assumed OctahedronGeometry or similar)
├── Sphere (SphereGeometry)
└── OrbitControls (attached to camera, updates each frame)
```

This orbit extends the graph with:
```
Scene (modifications)
├── DirectionalLight (shadow casting enabled, interactive position/intensity)
├── Cube (castShadow: true)
├── Diamond (castShadow: true, independent rotation)
├── Sphere (castShadow: true, orbital motion)
└── Ground Plane (NEW: receiveShadow: true, dark material)
```

### Render Pipeline
Current pipeline (inferred):
1. OrbitControls update camera based on user input
2. Object transformations (cube rotation)
3. Render scene to canvas

Enhanced pipeline for this orbit:
1. **Motion Update Phase:** Update diamond rotation, sphere orbit position based on elapsed time
2. **Interaction Phase:** Process mouse coordinates, update light direction/intensity
3. OrbitControls update (unchanged)
4. **Shadow Update Phase:** Renderer computes shadow maps for DirectionalLight
5. Render scene to canvas with shadows

### Data Flow
- **Animation Loop State:** Time-based animation requires either:
  - `Date.now()` or `performance.now()` for frame-independent motion
  - Accumulated delta time between frames
- **Mouse State:** Normalized coordinates (-1 to 1) derived from `event.clientX/Y` and viewport dimensions
- **Light State:** DirectionalLight position vector updated per frame based on mouse input
- **Shadow State:** Shadow camera frustum configured once during initialization, shadow maps regenerated each frame automatically

### Performance Constraints
- **Shadow Rendering Cost:** DirectionalLight shadow mapping adds:
  - Pre-render pass for shadow depth buffer (1 pass per light)
  - Fragment shader overhead for shadow sampling in main render
  - Target: Keep shadow map at 512x512 or 1024x1024 to stay within 60fps budget
- **Event Throttling:** `mousemove` fires at monitor refresh rate (60-144Hz). Direct DOM updates acceptable since we're only updating JavaScript state, not triggering layout recalculation
- **Geometry Complexity:** Ground plane should use `PlaneGeometry` with minimal segments (1x1 or 2x2) to avoid tessellation overhead

## Pattern Library

### Three.js Conventions
Based on project constraints and Three.js ^0.160.0 best practices:

**Initialization Pattern:**
```javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```

**Material Configuration:**
```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0xhexcode,
  metalness: 0.0-1.0,
  roughness: 0.0-1.0
});
```

**Shadow Enabling Pattern (Three.js standard):**
```javascript
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft edges

// Light
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;

// Objects
mesh.castShadow = true;    // Casts shadow
mesh.receiveShadow = true; // Receives shadow
```

### Animation Loop Structure
Standard pattern in `src/main.js`:
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update transformations
  controls.update();
  
  renderer.render(scene, camera);
}
animate();
```

Enhanced pattern for this orbit:
```javascript
function animate(time) {
  requestAnimationFrame(animate);
  
  // Time-based motion updates
  // Mouse-based light updates
  
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

### Naming Conventions
- **Geometry objects:** Lowercase descriptive names (`cube`, `diamond`, `sphere`, `ground`)
- **Three.js instances:** PascalCase constructors (`new THREE.Scene()`)
- **Constants:** UPPER_SNAKE_CASE for configuration values
- **Functions:** camelCase (`animate`, `onWindowResize`)

### Color Scheme
- **Background:** `0x1a1a2e` (dark blue-gray, established)
- **Ground plane:** Should use similar dark palette (suggested `0x0a0a0f` in Intent, or `0x1a1a2e` for consistency)
- **Materials:** Existing objects likely use mid-tone colors to contrast with dark background

## Prior Orbit References

### Orbit 0: Initial Three.js Scaffold
**Status:** Completed (assumed, as this is Orbit 1)

**Established:**
- Working Vite development server (`npm run dev` script)
- Full-viewport canvas with proper CSS reset (`src/style.css`)
- Basic scene with cube, diamond, sphere geometries
- Lighting: 1 AmbientLight + 1 DirectionalLight
- Camera positioned to view origin
- OrbitControls for user interaction
- Window resize handler maintaining aspect ratio
- Animation loop rotating cube on X and Y axes

**Patterns Introduced:**
- Single-file architecture in `src/main.js`
- No TypeScript, no build-time transpilation beyond Vite's ES module handling
- Direct DOM manipulation (`document.body.appendChild`)
- Frame-based animation using `requestAnimationFrame`

**Unknowns from Orbit 0:**
- Exact camera position and field of view values
- Specific sizes and positions of diamond and sphere (scale, position.set())
- Whether diamond and sphere currently have any animation (Intent implies only cube rotates currently)
- Current DirectionalLight position and intensity values
- Whether the scene uses `Scene.background` or relies on CSS for the dark background

**Relevance to Current Orbit:**
This orbit directly extends Orbit 0's render loop and lighting configuration. The animation function signature may need modification to accept a timestamp parameter if not already present. The DirectionalLight object must be stored in a variable accessible to both initialization and animation loop scopes.

### No Other Prior Orbits
This is the second orbit in the trajectory. No parallel or conflicting changes exist.

## Risk Assessment

### Performance Risks

**Risk: Shadow rendering degrades frame rate below 60fps**
- **Likelihood:** Medium — Shadow mapping is GPU-intensive, especially on integrated graphics
- **Impact:** High — Violates core acceptance criteria, degrades user experience
- **Mitigation:**
  - Start with 512x512 shadow map resolution, only increase to 1024x1024 if visual quality insufficient
  - Use `THREE.PCFSoftShadowMap` (moderate quality) rather than `THREE.PCFSoftShadowMap` or VSM variants
  - Set tight shadow camera frustum bounds to minimize rendered area
  - Test on target hardware (2019+ laptop with integrated graphics) before finalizing

**Risk: Mouse move event handler causes jank**
- **Likelihood:** Low — Modern browsers optimize `mousemove` well, and we're only updating JavaScript state
- **Impact:** Medium — Creates stutter in light interaction, poor tactile feel
- **Mitigation:**
  - Avoid DOM reads (layout thrashing) inside event handler
  - Update light state directly without intermediate object creation
  - Consider throttling to every other frame if issues arise (check `requestAnimationFrame` timestamp)

**Risk: Orbit animation calculations cause frame drops**
- **Likelihood:** Low — Trigonometric functions are fast on modern CPUs
- **Impact:** Low — Minor visual stutter
- **Mitigation:**
  - Use `Math.sin` and `Math.cos` for sphere orbit rather than vector transformations
  - Pre-calculate orbit radius and speed constants
  - Avoid creating new Vector3 instances per frame

### Code Quality Risks

**Risk: Exceeding 100-line budget forces unreadable code**
- **Likelihood:** High — Adding 3 feature sets (motion, interaction, shadows) in limited space
- **Impact:** High — Violates constraints, creates maintenance burden
- **Mitigation:**
  - Remove any unnecessary comments or whitespace
  - Combine related initialization (e.g., shadow config with light creation)
  - Use concise but clear variable names (`dirLight` vs `directionalLight`)
  - Inline single-use helper functions
  - If approaching limit: prioritize shadow and motion features over stretch goals like light color temperature

**Risk: Loss of OrbitControls functionality**
- **Likelihood:** Low — OrbitControls is isolated from new features
- **Impact:** High — Violates behavioral constraint
- **Mitigation:**
  - Do not modify camera or controls instances
  - Ensure `controls.update()` remains in animation loop
  - Test camera interaction after implementing mouse-based light changes

### Visual Quality Risks

**Risk: Ground plane is visually distracting**
- **Likelihood:** Medium — Plane size, position, and material affect prominence
- **Impact:** Medium — Fails "non-intrusive" requirement
- **Mitigation:**
  - Use dark material matching or darker than background (`0x0a0a0f`)
  - Position below objects (y = -2 to -3) so it's visible but not dominant
  - Use large PlaneGeometry (20x20 or more) to avoid visible edges
  - Set low metalness (0.1) and high roughness (0.9) for matte appearance

**Risk: Interactive lighting is too aggressive or too subtle**
- **Likelihood:** Medium — Subjective judgment, requires iteration
- **Impact:** Medium — Fails "tactile feel" vs "not distracting" balance
- **Mitigation:**
  - Implement smooth interpolation (lerp) between light states rather than instant updates
  - Use normalized mouse coordinates with dampening factor (multiply by 0.3-0.5)
  - Set intensity range conservatively (base intensity ±20%, not ±50%)
  - Test with slow mouse movement first, then rapid movement

**Risk: Shadow acne or peter-panning artifacts**
- **Likelihood:** Medium — Common shadow mapping issues
- **Impact:** Medium — Reduces visual polish
- **Mitigation:**
  - Configure `light.shadow.bias` (typically -0.0001 to -0.001)
  - Set `light.shadow.normalBias` (typically 0 to 0.02)
  - Ensure ground plane is far enough from objects to avoid z-fighting
  - Use `renderer.shadowMap.type = THREE.PCFSoftShadowMap` for softer edges that hide artifacts

### Integration Risks

**Risk: Window resize breaks shadow rendering**
- **Likelihood:** Low — Shadow maps are independent of canvas size
- **Impact:** Low — Temporary visual glitch until next resize
- **Mitigation:**
  - Verify shadow map resolution is set in pixels, not relative to canvas size
  - Ensure existing resize handler updates camera aspect ratio and renderer size only
  - No shadow-specific resize logic should be necessary

**Risk: Three.js version incompatibility**
- **Likelihood:** Very Low — Using stable API from 0.160.0
- **Impact:** High — Runtime errors, broken shadows
- **Mitigation:**
  - Verify shadow API matches Three.js r160 documentation
  - `castShadow`, `receiveShadow`, `shadowMap.enabled` stable since r90+
  - OrbitControls import path unchanged in 0.160.0