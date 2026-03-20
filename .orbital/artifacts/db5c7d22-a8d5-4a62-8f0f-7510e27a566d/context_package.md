# Context Package: Subtle Interaction + Scene Polish (Choreographed Motion)

## Codebase References

### Primary Implementation Surface
- **`src/main.js`** — Single source file containing entire scene setup, animation loop, and event handlers. All orbit 3 enhancements will be implemented here.

### Supporting Files
- **`index.html`** — HTML entry point that mounts the canvas element. Should not require modification unless canvas attributes need adjustment for shadow rendering.
- **`src/style.css`** — Global styles ensuring full-viewport canvas. No changes anticipated for this orbit.
- **`package.json`** — Declares Three.js v0.160.0 dependency. Version is recent enough to support all required shadow features without upgrades.

### External Dependencies
- **`three` (v0.160.0)** — Core rendering library
  - `THREE.Scene` — Current scene graph container
  - `THREE.PerspectiveCamera` — Active camera (already positioned and configured)
  - `THREE.WebGLRenderer` — Current renderer instance (requires shadow map enablement)
  - `THREE.DirectionalLight` — Light source that will cast shadows and respond to mouse interaction
  - `THREE.AmbientLight` — Ambient illumination (no changes needed)
  - `OrbitControls` (from `three/examples/jsm/controls/OrbitControls.js`) — Camera control system that must not conflict with new mouse tracking
  - Geometry constructors: `BoxGeometry`, `OctahedronGeometry`, `SphereGeometry`, `PlaneGeometry` (new)
  - Material constructors: `MeshStandardMaterial` (supports shadow casting/receiving)

### Current Scene Graph Structure
Based on prior orbits, `src/main.js` contains references to:
- `scene` — THREE.Scene instance
- `camera` — PerspectiveCamera positioned to view scene center
- `renderer` — WebGLRenderer configured for dark background (0x1a1a2e)
- `cube` — BoxGeometry mesh (currently rotating on X/Y axes)
- `diamond` — OctahedronGeometry mesh (introduced in orbit 2, currently static)
- `sphere` — SphereGeometry mesh (introduced in orbit 2, currently static)
- `ambientLight` — AmbientLight instance
- `directionalLight` — DirectionalLight instance (position/intensity will be mouse-controlled)
- `controls` — OrbitControls instance

All mesh objects use `MeshStandardMaterial` which inherently supports shadow casting and receiving via boolean flags.

## Architecture Context

### Execution Model
This is a single-file, imperative rendering application with no formal architecture layers. Code organization follows a simple initialization-then-loop pattern:

1. **Initialization block** — Scene setup, geometry creation, light configuration, renderer initialization
2. **Event handler registration** — Window resize listener (already present), mouse movement listener (new)
3. **Animation loop** — `requestAnimationFrame` callback that updates object transforms and renders each frame

### Data Flow
No external data sources or state management systems. All state is held in closure-scoped variables within `src/main.js`:
- Object positions/rotations updated imperatively in animation loop
- Mouse position tracked in closure-scoped variables updated by event listeners
- Time tracking (if needed for consistent animation speeds) calculated from `performance.now()` or frame deltas

### Rendering Pipeline
Current pipeline: Scene graph traversal → material evaluation → rasterization → screen buffer

With shadows enabled, pipeline becomes: Scene graph traversal → shadow map generation (from light's perspective) → material evaluation with shadow sampling → rasterization → screen buffer

**Performance impact:** Shadow mapping adds a pre-pass that renders the scene from the light's POV. With three shadow-casting objects and one receiver (ground plane), this is minimal overhead on modern GPUs but measurable on integrated graphics.

### Integration Constraints
- **No module system beyond ES6 imports** — Three.js imports use ES module syntax; all application logic is in global scope or closures
- **No build-time code generation** — Vite serves files with minimal transformation
- **Hot module reload awareness** — Event listeners must either check for duplicate registration or accept that listeners may accumulate during development HMR cycles (low-risk given single-file structure)

### Browser Environment Assumptions
- **requestAnimationFrame availability** — Already in use; standard across all modern browsers
- **Mouse event support** — `mousemove` event is well-supported; touch device fallback not required per intent constraints
- **WebGL 1.0 baseline** — Three.js renderer requires WebGL; shadow mapping supported in WebGL 1.0 with shadow map extensions (universally available)

## Pattern Library

### Naming Conventions
Current codebase uses:
- **Lowercase with camelCase** for variables: `ambientLight`, `directionalLight`, `cube`, `sphere`
- **THREE namespace prefix** for Three.js constructors: `new THREE.Scene()`, `new THREE.BoxGeometry()`
- **Descriptive geometry names** reflecting visual shape: `cube`, `diamond` (octahedron), `sphere`

New elements should follow:
- Ground plane: `ground` or `groundPlane`
- Mouse tracking variables: `mouseX`, `mouseY` (normalized to -1 to 1 range is Three.js convention)
- Time tracking: `time` or `elapsedTime`

### Object Creation Pattern
Geometry + Material → Mesh → Scene addition:
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

Material configuration for existing objects uses inline object literals with color properties.

### Animation Loop Structure
Current pattern (established in orbit 1, continued in orbit 2):
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Update transforms
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Render
  renderer.render(scene, camera);
}
animate();
```

New orbit should extend this with:
- Diamond rotation on different axes
- Sphere position updates (orbital motion)
- Light position/intensity updates (mouse-driven)

### Event Handler Pattern
Existing resize handler:
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

Mouse handler should follow similar pattern: arrow function with state updates.

### Material Configuration
Existing materials use `MeshStandardMaterial` which responds to both ambient and directional lighting. Current color palette appears to use distinct hues for each shape (cube, diamond, sphere each have unique colors based on orbit 2 context).

For ground plane, material should:
- Use dark color matching background aesthetic (0x1a1a2e or darker)
- Set `receiveShadow: true` in material constructor or via property assignment
- Consider `roughness: 0.8` to avoid reflective appearance

## Prior Orbit References

### Orbit 1: Initial Scene Setup
**Artifact location:** `.orbital/artifacts/2e6b889d-24a5-4428-baf6-4494433a3cae/`

**Established patterns:**
- Dark background color: `renderer.setClearColor(0x1a1a2e)`
- Camera position likely at `(0, 0, 5)` or similar to view center
- Cube rotation speed: `0.01` radians per frame on both X and Y axes
- Window resize handling attached directly to window object
- OrbitControls instantiation: `new OrbitControls(camera, renderer.domElement)`

**Key decisions:**
- Single file implementation approach validated
- Full-viewport canvas with CSS reset in `style.css`
- Animation loop using `requestAnimationFrame` without delta time tracking (may need to add for consistent orbital speed)

### Orbit 2: Additional Shapes
**Artifact location:** `.orbital/artifacts/7cac94ca-f4e2-4aa5-b32d-cefe62c01f06/`

**Additions:**
- Diamond geometry: `OctahedronGeometry` (exact size unknown but likely radius 1-2 units)
- Sphere geometry: `SphereGeometry` (similar size range)
- Spatial positioning: Objects likely positioned with sufficient separation to avoid overlap (e.g., cube at origin, diamond offset on X, sphere offset on Z)

**What worked:**
- Adding multiple geometries to scene graph without performance impact
- `MeshStandardMaterial` provides good visual quality for all shapes with existing lighting

**What to preserve:**
- Object positioning should remain stable; new motion should be rotations and orbital paths that don't permanently relocate objects far from initial positions
- Existing cube rotation behavior must continue unchanged

### Unexecuted Intent: Orbit 3 (Prior Attempt)
**Artifact location:** `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/`

This orbit was re-orbited with feedback "make the shapes dance", suggesting the prior attempt may have been too subtle or static. Current regeneration should emphasize:
- More pronounced motion patterns (while staying within "subtle" design boundaries)
- Ensure all three objects have distinct, visible movement
- Motion should feel choreographed and rhythmic rather than random drift

## Risk Assessment

### Performance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Shadow rendering drops framerate below 60fps on integrated GPUs | Medium | High | Use 1024x1024 shadow map size (lower than 2048x2048 upper bound); test on target hardware; set `renderer.shadowMap.type = THREE.PCFSoftShadowMap` for quality vs. `THREE.BasicShadowMap` for performance if needed |
| Per-frame light position updates cause jitter or dropped frames | Low | Medium | Use lerp (linear interpolation) over 3-5 frames to smooth transitions; avoid recalculating shadow maps every frame by setting `directionalLight.shadow.needsUpdate = false` after initial setup |
| Sphere orbital motion calculation uses expensive trigonometry per frame | Low | Low | Cache `Math.sin` and `Math.cos` calls or use time-based incremental angle updates; modern JS engines optimize math operations well |
| OrbitControls + mouse tracking both read mouse events simultaneously | Medium | Medium | Ensure mouse tracking only reads position without calling `preventDefault()` or `stopPropagation()`; OrbitControls listens to different events (mousedown/wheel) so conflict is unlikely |

### Code Quality Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Exceeding 100-line budget with all new features | High | Medium | Prioritize concise variable names and avoid unnecessary abstractions; combine related setup into single statements where readable; count lines early and iterate |
| Mouse event listener accumulates on HMR hot reload | Medium | Low | Accept behavior as development-only issue, or add guard: `if (!window.__mouseListenerAttached) { addEventListener...; window.__mouseListenerAttached = true; }` |
| Global scope pollution with tracking variables | Low | Low | Use `let` declarations within module scope; variables are already scoped to `main.js` module |
| Hard-coded magic numbers reduce maintainability | Medium | Low | Add brief inline comments for key values (orbital radius, rotation speeds, lerp factors) explaining their purpose |

### Functional Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Orbital motion paths cause sphere to clip through other objects | Low | Low | Choose orbital radius (2-4 units) larger than object bounding boxes; validate initial positions from orbit 2 context |
| Mouse-driven light changes feel disorienting or distracting | Medium | High | Limit light position offset magnitude to ±1 unit; use smooth lerp transitions; test across full canvas area |
| Shadows appear harsh or pixelated | Medium | Medium | Use `PCFSoftShadowMap` shadow type; ensure shadow camera frustum properly bounds all shadow-casting objects; adjust `directionalLight.shadow.camera` near/far/left/right if needed |
| Ground plane visually distracts from shapes | Low | Medium | Position plane at y = -2 or below object bases; use very dark color (0x0a0a0f, darker than background); keep plane size minimal (10x10 or smaller) |
| Motion patterns feel random rather than choreographed | Medium | High | Use related but distinct rotation speeds (e.g., 0.01 for cube, 0.015 for diamond, 0.008 for sphere orbit); ensure speeds are not exact multiples to avoid phase-locking |

### Regression Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OrbitControls stop functioning after mouse tracking added | Low | High | Test camera manipulation immediately after implementation; ensure no `event.preventDefault()` in mouse handler |
| Window resize handling breaks | Low | High | Do not modify existing resize listener; verify renderer and camera updates still occur |
| Cube rotation speed changes unintentionally | Low | Medium | Preserve exact `cube.rotation.x += 0.01` and `cube.rotation.y += 0.01` statements from prior orbit |
| Scene background color changes | Low | Low | Do not modify `renderer.setClearColor()` call; verify dark aesthetic maintained |

### Shadow-Specific Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Shadow map resolution too low for high-DPI displays | Medium | Low | Multiply shadow map size by `Math.min(window.devicePixelRatio, 2)` to scale up on retina displays without excessive memory use on ultra-high-DPI |
| Directional light shadow camera frustum doesn't cover scene | Medium | Medium | Calculate scene bounds or manually set `directionalLight.shadow.camera.left/right/top/bottom` to -10, 10 (or similar) to ensure coverage; add `directionalLight.shadow.camera.updateProjectionMatrix()` after changes |
| Shadow acne (self-shadowing artifacts) | Low | Low | Set `directionalLight.shadow.bias = -0.001` if artifacts appear (negative bias reduces acne but can cause peter-panning) |
| Ground plane shadows appear too sharp for "soft shadow" requirement | Medium | Medium | Verify `renderer.shadowMap.type = THREE.PCFSoftShadowMap` (Percentage Closer Filtering); if still too sharp, increase shadow map size to 2048x2048 |

### Browser Compatibility Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebGL shadow extensions unavailable on very old devices | Very Low | Low | Accept as acceptable degradation; Three.js gracefully handles missing shadow support by not rendering shadows |
| Mouse position normalization incorrect in fullscreen mode | Low | Low | Use `event.clientX / window.innerWidth` formula (already standard pattern); test in fullscreen if time permits |
| Performance on mobile devices with mouse simulation | Low | Medium | Intent explicitly excludes touch device requirements; graceful degradation acceptable |