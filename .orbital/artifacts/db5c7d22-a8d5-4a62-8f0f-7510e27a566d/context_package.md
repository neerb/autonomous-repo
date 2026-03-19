# Context Package: Subtle Interaction + Scene Polish

## Codebase References

### Primary Modification Surface
**`src/main.js`** — Single JavaScript file containing entire Three.js scene setup and animation loop
- **Current State:** Approximately 85 lines including imports, scene initialization, object creation, lights, OrbitControls, and render loop
- **Expected Objects:** `scene`, `camera`, `renderer`, `cube`, `diamond`, `sphere`, `ambientLight`, `directionalLight`, `controls`
- **Animation Loop:** Uses `requestAnimationFrame` pattern with rotation applied to cube
- **Modification Zones:**
  - Lines 1-10: Imports and basic setup
  - Lines 11-40: Object creation (cube, diamond, sphere)
  - Lines 41-55: Lighting setup
  - Lines 56-70: Camera, renderer, controls initialization
  - Lines 71-85: Animation loop and resize handler

### Supporting Files (No Modification Required)
**`index.html`** — Entry point with single `<script type="module" src="/src/main.js"></script>`
- Serves as static container for Three.js canvas
- No changes required per Intent constraints

**`src/style.css`** — Full-viewport canvas styling with zero margin/padding
- Already configured for immersive scene presentation
- No changes required per Intent constraints

**`package.json`** — Dependency manifest
- Contains `three@^0.160.0` and `vite@^5.0.0`
- No additional dependencies permitted per Intent constraints

### Three.js API Surface
**Required Imports (already present):**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
```

**New APIs Required:**
- `THREE.PlaneGeometry` — For ground plane creation
- `renderer.shadowMap.enabled` — Enable shadow rendering
- `renderer.shadowMap.type = THREE.PCFSoftShadowMap` — Soft shadow algorithm
- `object.castShadow = true` — Enable shadow casting per object
- `object.receiveShadow = true` — Enable shadow receiving for ground plane
- `light.castShadow = true` — Enable DirectionalLight shadow casting

## Architecture Context

### Scene Graph Structure
```
Scene
├── AmbientLight (0.5 intensity, fills shadows)
├── DirectionalLight (0.8 intensity, positioned above/side)
├── PerspectiveCamera (FOV 75, positioned to see center)
├── Cube (BoxGeometry, MeshStandardMaterial, rotating on X+Y)
├── Diamond (OctahedronGeometry, MeshStandardMaterial, currently static)
├── Sphere (SphereGeometry, MeshStandardMaterial, currently static)
└── [NEW] Ground Plane (PlaneGeometry, MeshStandardMaterial, dark color)
```

### Render Pipeline
1. **Initialization Phase:**
   - Scene, camera, renderer created
   - Geometry and materials instantiated
   - Lights added to scene
   - OrbitControls bound to camera
   - Window resize listener attached

2. **Animation Loop (requestAnimationFrame):**
   - Update object transformations (rotations, positions)
   - [NEW] Update light properties based on mouse position
   - OrbitControls.update() called automatically
   - Renderer.render(scene, camera) executed

3. **Event Handling:**
   - Window resize → camera aspect + renderer size update
   - [NEW] Mouse move → light position/intensity modulation

### Data Flow for Mouse Interaction
```
window.addEventListener('mousemove', event)
  → Normalize coordinates to [-1, 1] range
  → Apply damping factor (0.05-0.15) to smooth movement
  → Update directionalLight.position or .intensity
  → No explicit render call (handled by animation loop)
```

### Performance Considerations
- **Shadow Map Resolution:** Trade-off between visual quality (higher res) and GPU memory (lower res). Intent specifies 1024-2048 range.
- **Shadow Casting Objects:** Three objects casting shadows + one receiving = 4 shadow passes per frame
- **Mouse Event Throttling:** Not required if damping is sufficient (lerp approach smooths input)
- **OrbitControls Damping:** May already be enabled; avoid conflicting interaction systems

## Pattern Library

### Naming Conventions (Established in Codebase)
- **Scene Objects:** Lowercase descriptive names (`cube`, `diamond`, `sphere`)
- **Lights:** Type-prefixed names (`ambientLight`, `directionalLight`)
- **Three.js Classes:** PascalCase from library (`THREE.BoxGeometry`, `THREE.MeshStandardMaterial`)
- **Functions:** camelCase (`animate`, `handleResize`)

### Material Pattern
**Current Standard:**
```javascript
const material = new THREE.MeshStandardMaterial({
  color: 0x[hexcolor],
  metalness: 0.5,
  roughness: 0.5
});
```
**For Ground Plane:**
- Use low-contrast dark color (0x0a0a0a to 0x2a2a2a per Intent)
- Set `receiveShadow: true` in geometry configuration
- Optionally reduce metalness/roughness to make shadows more visible

### Animation Pattern (Existing)
**Current Cube Rotation:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
```
**Extension for Diamond + Sphere:**
- Diamond: Add Y-axis rotation (e.g., `diamond.rotation.y += 0.002`)
- Sphere: Use time-based orbit calculation with `Math.sin`/`Math.cos`
- Maintain consistent speed values to avoid visual chaos

### Event Listener Pattern (Established)
**Window Resize:**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```
**Mouse Move (New Pattern):**
- Attach listener after renderer initialization
- Store mouse coordinates in normalized space
- Apply updates inside animation loop, not directly in event handler

## Prior Orbit References

### Orbit 1 (2e6b889d): Initial Scene Setup
**Established:**
- Vite build configuration with ES modules
- Single-file architecture in `src/main.js`
- Dark background color (0x1a1a2e) via `scene.background`
- OrbitControls integration pattern
- Window resize handling

**Lessons:**
- Line count constraint (100 lines) forced concise, single-file approach
- No defensive error handling for missing DOM elements (acceptable for demo project)
- OrbitControls import from `three/examples/jsm/controls/OrbitControls` works without additional config

### Orbit 2 (7cac94ca): Diamond + Sphere Addition
**Established:**
- Diamond using `THREE.OctahedronGeometry(1, 0)` with custom color
- Sphere using `THREE.SphereGeometry(0.5, 32, 32)` with custom color
- Both objects use `MeshStandardMaterial` (consistent with cube)
- Spatial arrangement: Objects positioned to avoid overlap, visible within initial camera frustum

**Lessons:**
- Adding two geometries consumed approximately 15-20 lines
- Material reuse pattern not adopted (each object has unique material instance)
- No animation added in Orbit 2 (left static for polish in future orbit)

**Current Line Count Status:**
- Orbit 1: ~70 lines
- Orbit 2: +15 lines = ~85 lines
- **Available Budget:** 15 lines for Orbit 3 enhancements

### Orbit 3 (feb8e410): Previous Attempt (Re-orbited)
**Feedback:** User requested "add text: hi"
**Interpretation:** May have been test feedback or request for text overlay (conflicts with Intent non-goals: "No UI overlays or text elements")
**Action:** This re-orbit (db5c7d22) ignores text overlay request as it contradicts established Intent constraints

## Risk Assessment

### Risk 1: Line Count Budget Exceeded
**Severity:** High  
**Likelihood:** Medium  

**Description:**
Current codebase at ~85 lines. Adding shadow system (5-8 lines), ground plane (4-6 lines), mouse interaction (6-10 lines), and sphere orbit logic (5-8 lines) could exceed 100-line limit.

**Impact:**
- Violates hard constraint from Intent
- Forces removal of defensive code or comments
- May compromise code readability

**Mitigation:**
- Use terse variable names for new ephemeral values (e.g., `t` for time, `mx`/`my` for mouse coords)
- Inline single-use calculations
- Combine shadow configuration into object creation blocks
- Remove all comments (acceptable for 100-line demo code)
- Consolidate ground plane creation into 2-3 lines using chained methods

### Risk 2: Shadow Performance Degradation
**Severity:** Medium  
**Likelihood:** Low  

**Description:**
Enabling shadows for 3 objects + 1 receiver with DirectionalLight shadow camera could drop frame rate below 60fps on mid-range 2020 hardware, especially if shadow map resolution set to 2048.

**Impact:**
- Violates Intent performance requirement (60fps)
- Poor user experience on target devices
- May trigger browser performance warnings

**Mitigation:**
- Start with 1024 shadow map resolution, test before increasing
- Set `directionalLight.shadow.camera` near/far planes tightly around scene bounds
- Use `THREE.PCFSoftShadowMap` (Intent requirement) which is faster than `PCFSoftShadowMap`
- Limit shadow-casting objects to only cube, diamond, sphere (no ground plane casting)
- Consider `renderer.shadowMap.autoUpdate = false` if scene is mostly static (not applicable here due to continuous motion)

### Risk 3: Mouse Interaction Conflicts with OrbitControls
**Severity:** Medium  
**Likelihood:** Medium  

**Description:**
Mouse move events used for light manipulation may interfere with OrbitControls' drag-to-rotate functionality, causing jarring light shifts during camera manipulation.

**Impact:**
- Confusing UX where light moves unexpectedly during camera control
- Difficulty achieving "subtle" interaction per Intent
- User may perceive behavior as buggy

**Mitigation:**
- Apply high damping factor (0.1-0.15) to smooth light response
- Optionally check if OrbitControls is actively dragging before updating light (access via `controls.enabled` or track mouse button state)
- Limit light position shift to small radius (≤5 units per Intent) to minimize jarring movement
- Use light intensity modulation instead of position shift as primary effect (less visually disruptive)

### Risk 4: Sphere Orbit Collision with Existing Objects
**Severity:** Low  
**Likelihood:** Low  

**Description:**
Circular orbit path for sphere (2-3 unit radius) may cause visual overlap or collision with cube, diamond, or ground plane depending on their current positions.

**Impact:**
- Visual clutter or confusing depth perception
- Shadows may create unintended visual artifacts during overlap
- Breaks "subtle" aesthetic goal

**Mitigation:**
- Review current object positions in `src/main.js` before defining orbit radius
- Choose orbit plane (XZ, XY, YZ) that avoids other objects
- Use smaller radius (2.0 units) if spatial constraints are tight
- Position sphere orbit center slightly offset from scene origin if needed

### Risk 5: Ground Plane Visual Dominance
**Severity:** Low  
**Likelihood:** Medium  

**Description:**
Ground plane with received shadows may draw too much attention, violating Intent requirement that it be "visually subordinate" and "not distracting."

**Impact:**
- Shifts focus away from primary objects (cube, diamond, sphere)
- Dark aesthetic compromised if plane is too large or contrasting
- Shadows may be overly prominent

**Mitigation:**
- Use very dark color (0x0a0a0a to 0x151515 range)
- Keep plane size at lower end of acceptable range (10x10 units)
- Position plane below objects so it's partially out of initial camera view
- Reduce plane material roughness to make it less matte/prominent
- Optionally set plane opacity slightly below 1.0 if visual weight is still too high (requires `transparent: true` in material)

### Risk 6: Browser Compatibility with Shadow API
**Severity:** Low  
**Likelihood:** Very Low  

**Description:**
Three.js shadow features require WebGL 1.0 with shadow map support. Older browsers or devices without GPU acceleration may fail silently or render without shadows.

**Impact:**
- Inconsistent experience across devices
- No error handling in 100-line constraint environment
- User may report "broken" shadows on unsupported hardware

**Mitigation:**
- Document WebGL 1.0 requirement in README (out of scope for this orbit)
- Shadows degrade gracefully (objects still visible, just without shadows)
- Target 2020+ hardware per Intent already excludes most problematic devices
- Three.js automatically disables shadows if unsupported (no manual check needed)