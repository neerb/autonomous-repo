# Context Package: Subtle Interaction + Scene Polish

## Codebase References

### Primary Modification Surface
- **`src/main.js`**: Core scene setup and animation loop. Currently contains scene initialization, geometry creation, lighting, OrbitControls setup, and render loop. This file must be modified to add shadow configuration, ground plane geometry, sphere orbital motion, diamond rotation axis change, and mouse event handler. Current line count must be verified before modifications to ensure 100-line budget.

### Supporting Files (Read-Only)
- **`index.html`**: Entry point that mounts the canvas. No modifications needed—shadows and interaction are handled entirely in JavaScript.
- **`src/style.css`**: Viewport styling for full-screen canvas. No modifications needed unless ground plane visibility requires tweaking (unlikely).
- **`package.json`**: Dependency manifest. Confirms Three.js v0.160.0 is available—no new packages required for shadows or mouse interaction.

### Artifact History
- **`.orbital/artifacts/2e6b889d-24a5-4428-baf6-4494433a3cae/`**: Orbit 1 artifacts establishing initial project structure with rotating cube, basic lighting, and OrbitControls.
- **`.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/`**: Orbit 2 artifacts adding diamond (OctahedronGeometry) and sphere (SphereGeometry) with MeshStandardMaterial. These objects are the foundation for this orbit's shadow casting and animation enhancements.

## Architecture Context

### Scene Graph Structure
The current Three.js scene follows a flat hierarchy with all geometries and lights added directly to the root scene object:

```
Scene
├── PerspectiveCamera (positioned to view center)
├── AmbientLight (provides base illumination)
├── DirectionalLight (primary light source, positioned above/front of scene)
├── Cube (BoxGeometry with MeshStandardMaterial, rotating on X/Y axes)
├── Diamond (OctahedronGeometry with MeshStandardMaterial, currently static)
└── Sphere (SphereGeometry with MeshStandardMaterial, currently static)
```

**This orbit extends the graph**:
- Adds `PlaneGeometry` ground plane as a new child of Scene
- Configures `renderer.shadowMap` properties (global state, not scene graph)
- Configures `DirectionalLight.shadow` camera and resolution (property of existing light)
- Sets `castShadow` on cube, diamond, sphere meshes (boolean flags on existing objects)
- Sets `receiveShadow` on ground plane mesh

### Render Loop Architecture
The current animation loop structure in `src/main.js`:

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Object rotation updates (cube.rotation.x/y += delta)
  
  controls.update(); // OrbitControls update
  renderer.render(scene, camera);
}
```

**This orbit modifies the loop**:
- Adds sphere position updates using `Math.sin(elapsedTime)` and `Math.cos(elapsedTime)` for orbital motion
- Adds diamond rotation on Z-axis (or alternative axis distinct from cube's X/Y)
- Integrates light target position updates based on stored mouse coordinates
- Must preserve existing cube rotation and controls.update() call

### Event Handler Integration
OrbitControls already attaches `pointerdown`, `pointermove`, and `pointerup` listeners to the canvas for camera manipulation. The new mouse interaction must:

- Use a separate event listener (likely `window.addEventListener('mousemove', ...)` or `pointermove` on the renderer DOM element)
- Normalize mouse coordinates to [-1, 1] range for consistent light target positioning
- Avoid interfering with OrbitControls drag detection (controls only respond to pointer events with buttons pressed)

### Shadow Rendering Pipeline
Three.js shadow implementation requires:

1. **Renderer configuration**: `renderer.shadowMap.enabled = true` and `renderer.shadowMap.type = THREE.PCFSoftShadowMap`
2. **Light configuration**: `directionalLight.castShadow = true`, plus shadow camera properties (left, right, top, bottom, near, far) and `shadow.mapSize` for resolution
3. **Object flags**: `castShadow = true` on meshes that cast, `receiveShadow = true` on meshes that receive
4. **Material compatibility**: MeshStandardMaterial (already in use) supports shadows; MeshBasicMaterial would not

Shadow maps are rendered in a separate pass before the main render, using the light's perspective. Performance cost scales with shadow map resolution and number of shadow-casting lights.

## Pattern Library

### Geometry Creation Pattern
Established in Orbit 1 and extended in Orbit 2:

```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x... });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

**For ground plane**: Use `PlaneGeometry(width, height)`, rotate to lie flat (`plane.rotation.x = -Math.PI / 2`), position below objects (`plane.position.y = -2` or similar), use dark color (e.g., `0x0a0a0f`).

### Lighting Setup Pattern
Current implementation:

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```

**Shadow extension**:
```javascript
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
// ... additional shadow camera bounds
```

### Animation Loop Pattern
Time-based animations use `clock.getElapsedTime()` for smooth, frame-rate-independent motion:

```javascript
const clock = new THREE.Clock();

function animate() {
  const elapsedTime = clock.getElapsedTime();
  
  cube.rotation.x = elapsedTime * 0.5;
  cube.rotation.y = elapsedTime * 0.3;
  
  // ... other animations
}
```

**For sphere orbit**: `sphere.position.x = Math.cos(elapsedTime * speed) * radius`, `sphere.position.z = Math.sin(elapsedTime * speed) * radius`.

### Naming Conventions
- Geometry variables: lowercase descriptive names (`cube`, `diamond`, `sphere`, `groundPlane`)
- Lights: `ambientLight`, `directionalLight` (camelCase, descriptive)
- Utility objects: `scene`, `camera`, `renderer`, `controls`, `clock`
- Constants: inline numeric literals (no named constants used in current codebase)

## Prior Orbit References

### Orbit 1: Initial Scene Setup (2e6b889d-24a5-4428-baf6-4494433a3cae)
**What was established**:
- Vite build configuration with `npm run dev` script
- Basic Three.js scene with PerspectiveCamera (FOV 75, aspect ratio, near/far planes)
- WebGLRenderer with dark background (`0x1a1a2e`)
- Window resize handler updating camera aspect ratio and renderer size
- OrbitControls imported from `three/examples/jsm/controls/OrbitControls.js`
- Single rotating cube with MeshStandardMaterial
- AmbientLight + DirectionalLight setup

**Relevant patterns for this orbit**:
- Renderer initialized with `antialias: true` for smooth edges (compatible with shadow maps)
- Camera positioned at `(0, 0, 5)` looking at scene center—ground plane must be positioned to remain in view
- Window resize handler already exists—no need to add resize logic for shadows

### Orbit 2: Multi-Geometry Scene (feb8e410-9390-453a-b597-a92938a16631)
**What was added**:
- Diamond geometry using `OctahedronGeometry(1, 0)` with MeshStandardMaterial (color not specified in artifacts, likely distinct from cube)
- Sphere geometry using `SphereGeometry(0.7, 32, 32)` with MeshStandardMaterial
- Positioning strategy: Objects spaced horizontally or in a cluster to avoid overlap (exact positions not specified, but should be preserved)

**Key insight**: Diamond and sphere are already MeshStandardMaterial, which is shadow-compatible. No material changes needed—only add `castShadow = true` flags.

**What this orbit must preserve**:
- Exact positions of diamond and sphere so shadows fall naturally on ground plane
- Cube's existing X/Y rotation animation (do not modify or remove)
- Material properties (colors, roughness, metalness if set)

### Lessons from Prior Orbits
- **100-line constraint is tight**: Orbit 1 likely used 60–70 lines for basic setup. Orbit 2 added ~10–15 lines for two geometries. This orbit adds ground plane (~5 lines), shadow config (~10 lines), sphere orbit (~3 lines), diamond rotation (~1 line), mouse handler (~5 lines) = ~24 new lines. Total budget check critical.
- **OrbitControls integration works**: No reported conflicts in prior orbits. Mouse handler should be safe as long as it doesn't preventDefault on pointer events.
- **Dark aesthetic is established**: All lighting and materials calibrated for low-key rendering. Ground plane must not introduce bright reflections.

## Risk Assessment

### Risk: Exceeding 100-Line JavaScript Budget
**Severity**: High (constraint violation = orbit failure)

**Scenario**: Adding shadow configuration, ground plane, orbital motion, and mouse handler exceeds the line limit, especially if current `src/main.js` is already near capacity.

**Indicators**:
- Current line count unknown from artifacts (file content not provided)
- Shadow setup requires ~10 lines (renderer config, light config, camera bounds, resolution)
- Ground plane requires ~5 lines (geometry, material, rotation, position, scene.add)
- Animations require ~5 lines (sphere orbit, diamond rotation)
- Mouse handler requires ~7 lines (event listener, normalization, light target update)
- Total new code: ~27 lines

**Mitigation**:
- Count lines in current `src/main.js` before implementation
- Use terse but readable syntax (single-line object configurations where clear)
- Combine related operations: `directionalLight.shadow.mapSize.set(1024, 1024)` instead of two lines
- Eliminate unnecessary whitespace or comments
- If over budget, prioritize: shadows > sphere orbit > mouse interaction > diamond rotation

### Risk: Shadow Performance Degradation
**Severity**: Medium (violates 60fps constraint)

**Scenario**: Shadow map resolution set too high (2048×2048 or 4096×4096) or shadow camera frustum too large causes frame drops on mid-range hardware.

**Indicators**:
- Renderer must compute shadow map every frame for moving objects
- Large shadow camera frustum (e.g., -50 to +50 on all axes) increases shadow map area, reducing effective resolution
- Three shadow-casting objects may triple shadow map render cost

**Mitigation**:
- Use 1024×1024 shadow map resolution (target from Intent) as balance of quality and performance
- Tightly fit shadow camera frustum around scene bounds (estimate from object positions: cube at origin, diamond/sphere within ±3 units, ground plane at y=-2)
- Set shadow camera bounds to approximately -10 to +10 on X/Z, -2 to +10 on Y
- Use `PCFSoftShadowMap` (target from Intent) which is more expensive than `BasicShadowMap` but acceptable for 3 objects
- Test on throttled browser DevTools to simulate mid-range hardware

### Risk: Mouse Handler Conflicts with OrbitControls
**Severity**: Medium (degrades UX, violates constraint to preserve controls)

**Scenario**: Mouse move handler prevents OrbitControls drag operation, or OrbitControls drag triggers unwanted light shifts.

**Indicators**:
- OrbitControls listens to `pointerdown`, `pointermove`, `pointerup` on canvas
- If mouse handler uses same events with `preventDefault()`, controls break
- If mouse handler responds to all pointer moves, light shifts during camera drag

**Mitigation**:
- Use `mousemove` event instead of `pointermove` (OrbitControls uses pointer events, less likely to conflict)
- Do NOT call `preventDefault()` or `stopPropagation()` in mouse handler
- Optionally check `controls.enabled` or store a flag if OrbitControls is actively dragging (advanced, may exceed line budget)
- Test: Drag to rotate camera, verify light doesn't jitter or controls feel sluggish

### Risk: Sphere Orbital Path Looks Mechanical or Drifts
**Severity**: Low (aesthetic issue, not functional failure)

**Scenario**: Sphere orbit uses a simple circular path that feels artificial, or accumulated floating-point error causes position drift over time.

**Indicators**:
- Pure circular orbit (`x = cos(t)`, `z = sin(t)`) is mathematically perfect but may lack organic feel
- `elapsedTime` grows unbounded; after hours, floating-point precision degrades (unlikely in practice, but theoretically possible)

**Mitigation**:
- Use a radius of 3–5 units and slow speed (0.2–0.3 radians/second) as specified in Intent target
- Consider slight Y-axis variation for elliptical path (stretch goal): `y = Math.sin(elapsedTime * speed) * 0.5` for gentle wave
- Orbit parameters stable for typical viewing sessions (minutes to hours)—no mitigation needed for drift unless scene runs for days

### Risk: Ground Plane Visibility Issues
**Severity**: Low (visual degradation, not breakage)

**Scenario**: Ground plane too small (shadows clipped), too large (dominates scene), or color clashes with background.

**Indicators**:
- Shadows cast outside ground plane bounds are not visible
- Ground plane edges visible in frame create hard lines that break immersion
- Light-colored ground plane (e.g., 0x404040) too bright for dark aesthetic

**Mitigation**:
- Size ground plane at 20×20 units (large enough to catch shadows from objects within ±10 units)
- Position at y=-2 or lower (below objects, in view when camera looks slightly down)
- Use very dark color: `0x0a0a0f` (Intent target) or `0x050505`
- Set `material.roughness = 1` to eliminate specular highlights

### Risk: Shadow Artifacts or Aliasing
**Severity**: Low (visual quality issue)

**Scenario**: Shadow edges appear pixelated, shadow acne (surface self-shadowing), or Peter Panning (shadows detached from objects).

**Indicators**:
- 1024×1024 resolution may show aliasing on large ground plane
- `shadow.bias` not set can cause shadow acne on curved surfaces (sphere)
- Shadow camera near/far planes misconfigured

**Mitigation**:
- Accept 1024×1024 as acceptable quality given performance budget (Intent target)
- Add `directionalLight.shadow.bias = -0.001` if shadow acne appears (1 extra line)
- Set shadow camera `near = 0.5`, `far = 50` to encompass all objects with margin
- Test shadow appearance with camera at different OrbitControls angles

### Risk: Code Readability Degradation Under Line Budget Pressure
**Severity**: Low (maintenance issue, not functional failure)

**Scenario**: Compressing code to meet 100-line limit produces cryptic one-liners or removes necessary comments.

**Indicators**:
- Chained method calls or multi-statement lines reduce clarity
- Variable names abbreviated beyond recognition (e.g., `gp` for ground plane)
- Future modifications difficult without understanding compressed logic

**Mitigation**:
- Prioritize clarity where lines allow; compress only when necessary
- Use descriptive variable names even in tight budget: `groundPlane` over `gp`
- Group related operations logically even if combined on one line (e.g., `directionalLight.shadow.mapSize.set(1024, 1024)`)
- Accept that 100-line constraint inherently limits documentation—code should be self-explanatory