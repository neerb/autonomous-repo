# Context Package: Subtle Interaction + Scene Polish with Date Display

## Codebase References

### Primary Modification Target

**`src/main.js`**
- Current entry point for all Three.js scene logic
- Contains scene initialization, geometry creation, lighting, camera setup, and animation loop
- Must remain under 100 lines after modifications
- Expected to contain cube, diamond, and sphere geometries from Orbit 1
- Already imports from `three` package and sets up OrbitControls
- Handles window resize events and requestAnimationFrame loop

### Supporting Files

**`index.html`**
- HTML entry point that mounts the Vite application
- Loads `src/main.js` as ES module
- May require `<meta charset="utf-8">` tag if text rendering encounters character encoding issues
- No modifications expected unless font loading requires script tags

**`src/style.css`**
- Contains full-viewport canvas styling with zero margin/padding
- Preserved unchanged per constraints
- Ensures renderer fills browser window without scrollbars

**`package.json`**
- Defines project dependencies: `three@^0.160.0` (Three.js library)
- Dev dependency: `vite@^5.0.0` (bundler and dev server)
- Includes `"dev": "vite"` script for local development
- `"type": "module"` enables ES6 import/export syntax
- No new packages can be added per constraints

### Artifact References

**`.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/`**
- Prior orbit artifacts for the initial Three.js starter setup (Orbit 1)
- Contains intent, context, proposal, code generation, and test results from baseline implementation
- Reference to understand existing scene structure before enhancements

## Architecture Context

### Scene Graph Structure

The Three.js scene follows a hierarchical object graph pattern:

```
Scene (root)
├── PerspectiveCamera (positioned to view origin)
├── AmbientLight (global illumination)
├── DirectionalLight (primary light source, target for mouse interaction)
├── Cube (BoxGeometry + MeshStandardMaterial)
├── Diamond (OctahedronGeometry + MeshStandardMaterial, assumed from Orbit 1)
├── Sphere (SphereGeometry + MeshStandardMaterial, assumed from Orbit 1)
└── [NEW] Ground Plane (PlaneGeometry + MeshStandardMaterial)
```

### Rendering Pipeline

1. **Initialization Phase:** Scene, camera, renderer, and geometry objects created synchronously
2. **Event Binding:** Window resize listener attached, OrbitControls initialized
3. **Animation Loop:** `requestAnimationFrame` recursively calls render function
4. **Per-Frame Updates:** Object rotations/positions updated, controls updated, scene rendered

### Shadow System Architecture

Three.js shadows operate via shadow mapping:
- Renderer must enable `shadowMap.enabled = true`
- Shadow map type (e.g., `PCFSoftShadowMap`) determines quality/softness
- Each light can cast shadows (`castShadow: true`) with configurable shadow camera frustum
- Geometry must opt-in to shadow casting (`castShadow`) and/or receiving (`receiveShadow`)
- Shadow resolution set via `light.shadow.mapSize` (width/height)

### Mouse Interaction Data Flow

Proposed pattern for reactive lighting:
1. `mousemove` event listener captures normalized mouse coordinates (0-1 range)
2. Coordinates mapped to light direction or intensity parameters
3. Smooth interpolation (lerp) applied to prevent jitter
4. Light properties updated in animation loop, not directly in event handler (decoupled for performance)

### Text Rendering Options

**Option 1: TextGeometry (3D Mesh)**
- Requires `FontLoader` to load JSON font data asynchronously
- Creates extruded 3D text geometry that integrates with scene lighting/shadows
- Font files typically hosted on CDN (e.g., Three.js examples fonts)
- Higher polygon count but fully integrated 3D object

**Option 2: Sprite + Canvas Texture (2D Billboard)**
- Uses HTML5 Canvas API to rasterize text into texture
- Applied to `Sprite` object that always faces camera
- Lower performance cost, no async font loading required
- Does not receive scene lighting (always fully lit)
- Recommended for line-count constraints and simplicity

### Performance Considerations

- Single-file architecture limits code splitting opportunities
- All objects render every frame (no culling or LOD system)
- Shadow maps regenerate each frame (performance bottleneck if resolution too high)
- Target 60fps assumes 16.67ms frame budget
- OrbitControls damping disabled to minimize overhead

## Pattern Library

### Import Conventions

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
```

Namespace imports preferred for core Three.js, named imports for examples/addons.

### Geometry Initialization Pattern

Existing code expected to follow:
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xcolor });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

Material type is `MeshStandardMaterial` for PBR lighting compatibility.

### Animation Loop Structure

```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update object transforms
  // Update controls
  renderer.render(scene, camera);
}
animate();
```

Loop kicked off once at module execution, recursively schedules itself.

### Resize Handling Pattern

```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

Camera aspect ratio and renderer dimensions synchronized on window resize.

### Naming Conventions

- Scene objects: lowercase descriptive names (`cube`, `sphere`, `ground`)
- Lights: descriptive type names (`ambientLight`, `directionalLight`)
- Global state: camelCase (`renderer`, `camera`, `scene`)
- Constants: UPPER_SNAKE_CASE if used (though rare in this codebase)

### Color Specification

Hexadecimal color literals: `0x1a1a2e` (background), `0xffffff` (lights), `0x404040` (materials).

### Code Density Optimizations

To meet 100-line constraint, expected techniques:
- Chaining method calls where semantically clear
- Inline object property assignments
- Avoiding intermediate variables for single-use values
- Grouping related initialization (all geometry in sequence, all lights together)

## Prior Orbit References

### Orbit 1: Initial Three.js Starter Setup

**Orbit ID:** `feb8e410-9390-453a-b597-a92938a16631`

**Completed Scope:**
- Vite project structure with `index.html`, `src/main.js`, `src/style.css`
- Scene with rotating cube on X and Y axes
- PerspectiveCamera positioned at `z: 5` (assumed based on typical Three.js starter patterns)
- WebGLRenderer with dark background (`0x1a1a2e`)
- AmbientLight and DirectionalLight for illumination
- OrbitControls for interactive camera manipulation
- Window resize handling
- Successfully met <100 line constraint

**Assumptions from Orbit 1:**
- Diamond (OctahedronGeometry) and sphere (SphereGeometry) added per trajectory description
- All three geometries use `MeshStandardMaterial` for consistency
- DirectionalLight positioned above/to side of origin to create visible shading
- OrbitControls target set to origin (0, 0, 0)

**Known Working Patterns:**
- Single-file architecture proved viable for feature scope
- Vite hot module replacement works without configuration
- OrbitControls import path `three/examples/jsm/controls/OrbitControls` resolves correctly
- MeshStandardMaterial responds to both ambient and directional lighting

**Gaps to Address in Orbit 2:**
- No shadow system implemented (renderer shadows disabled by default)
- No mouse interaction beyond OrbitControls
- Static lighting (no dynamic light behavior)
- Objects rotate but do not translate (no orbital motion for sphere)
- No text or date display

### Re-orbit Context

This orbit is a re-orbit from `feb8e410-9390-453a-b597-a92938a16631` with added requirement: "add todays date 3/19/2026". This date value is explicitly provided and should be rendered as-is without interpretation as a dynamic timestamp.

## Risk Assessment

### Line Count Budget Exhaustion

**Risk:** Adding shadow system (2-4 lines), mouse interaction (4-6 lines), sphere orbit motion (2-3 lines), and text rendering (8-12 lines) may exceed 100-line limit when combined with existing scene setup.

**Indicators:**
- TextGeometry with FontLoader requires async loading wrapper (5+ lines alone)
- Shadow configuration across multiple objects adds property assignments
- Mouse interpolation state requires additional variables

**Mitigation:**
- Prioritize sprite-based text over TextGeometry to eliminate font loading overhead
- Inline shadow property assignments directly in geometry constructors where possible
- Use single `mousemove` listener that updates shared interpolation target
- Combine rotation and orbit updates in single animation loop pass
- Consider removing comments if present in existing code

**Fallback:** If line limit cannot be met, propose removing date display feature or simplifying mouse interaction to intensity-only changes (no position interpolation).

### Shadow Rendering Performance

**Risk:** Shadow map generation for three casting objects plus ground plane receiver may drop frame rate below 60fps target, especially with high shadow resolution.

**Indicators:**
- Shadow map resolution above 1024x1024
- Large ground plane geometry (>20x20 units)
- DirectionalLight shadow camera frustum too large (generates oversized shadow map)

**Mitigation:**
- Set shadow map resolution to 512x512 or 1024x1024 maximum
- Limit ground plane to 15x15 units (adequate for visible shadow area)
- Configure DirectionalLight shadow camera with tight near/far planes
- Use `THREE.PCFSoftShadowMap` (optimized soft shadows) rather than `VSMShadowMap`

**Detection:** Performance profiling in browser dev tools should show frame times consistently under 16ms during animation loop.

### Mouse Interaction Conflicts with OrbitControls

**Risk:** `mousemove` event listener for light control may interfere with OrbitControls drag behavior, causing erratic camera movement or light updates during camera rotation.

**Indicators:**
- Light position jitters when user drags to rotate camera
- Camera rotation stops responding smoothly during mouse movement
- Event bubbling causes double updates

**Mitigation:**
- Do NOT call `event.preventDefault()` or `event.stopPropagation()` in mousemove handler
- Apply light position updates using smooth interpolation (lerp factor 0.05-0.1) to dampen rapid changes
- Store target light position separately from actual position, update actual position incrementally each frame
- OrbitControls operates on `mousedown`/`mousemove`/`mouseup` sequence; light updates on pure `mousemove` should coexist

**Testing:** Verify camera rotation (click-drag) remains smooth while mouse hovers over canvas without clicking.

### Text Rendering Legibility

**Risk:** 3D text may be too small, incorrectly positioned (occluded by geometry or off-screen), or have insufficient contrast against dark background.

**Indicators:**
- Text positioned at origin gets obscured by rotating objects
- Text size too small to read at default camera distance
- Light color text on dark background lacks sufficient luminance difference

**Mitigation:**
- Position text in corner of viewport using screen-space offset calculations (e.g., top-right: camera position + offset vector)
- Use sprite-based text with white color (`0xffffff`) or light gray (`0xcccccc`)
- Scale sprite to at least 1-2 units in scene space for visibility
- Position text along camera's view direction at fixed distance (billboard effect)

**Fallback:** If 3D integration proves complex within line budget, propose HTML overlay positioned with CSS (violates "not as HTML overlay" constraint but provides clear alternative).

### Sphere Orbit Motion Calculations

**Risk:** Incorrect trigonometric calculations for circular orbit may result in elliptical paths, static position, or unpredictable movement.

**Indicators:**
- Sphere moves but does not complete closed circular path
- Orbit speed too fast (dizzying) or too slow (imperceptible)
- Orbit radius too small (collides with other objects) or too large (exits camera view)

**Mitigation:**
- Use parametric circle equations: `x = radius * Math.cos(time)`, `z = radius * Math.sin(time)`
- Increment time parameter by small constant each frame (e.g., `time += 0.01`)
- Set radius to 3 units (midpoint of 2-4 unit acceptable range)
- Keep Y position constant (sphere orbits on XZ plane at origin height)

**Validation:** Visually confirm sphere returns to starting position after full orbit cycle (approximately 628 frames at 0.01 increment per frame).

### DirectionalLight Shadow Camera Frustum

**Risk:** Default shadow camera frustum may be too narrow or improperly positioned, causing shadows to be clipped or not visible on ground plane.

**Indicators:**
- Shadows appear only partially or cut off abruptly
- Ground plane receives no shadows despite `receiveShadow: true`
- Console warnings about shadow camera frustum

**Mitigation:**
- Explicitly configure `directionalLight.shadow.camera` properties:
  - `left`, `right`, `top`, `bottom` to frame scene bounds (e.g., -10 to 10)
  - `near` and `far` to bracket scene depth (e.g., 0.5 to 50)
- Position DirectionalLight at sufficient height and distance to illuminate all objects
- Call `directionalLight.shadow.camera.updateProjectionMatrix()` after configuration

**Debugging:** Use `CameraHelper` temporarily to visualize shadow camera frustum (remove before final line count check).

### Ground Plane Visual Dominance

**Risk:** Ground plane may be too bright, too large, or too prominently colored, disrupting minimal aesthetic and drawing attention away from primary geometries.

**Indicators:**
- Ground plane more visually prominent than cube/diamond/sphere
- Shadows too faint to be perceptible against ground color
- Ground edges visible at screen boundaries (breaks infinite plane illusion)

**Mitigation:**
- Use very dark material color for ground (e.g., `0x0a0a0a` or `0x1a1a1a`, slightly lighter than background)
- Set material `roughness: 1.0` to minimize specular reflections
- Size ground plane large enough to catch shadows but not extend beyond camera view at default position
- Consider slight rotation (e.g., -Math.PI / 2 on X axis) to orient plane horizontally

**Validation:** Shadows should be clearly visible but ground plane should recede into background perceptually.