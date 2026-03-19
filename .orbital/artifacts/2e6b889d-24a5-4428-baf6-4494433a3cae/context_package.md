# Context Package: Subtle Interaction + Scene Polish

## Codebase References

**Critical Assessment: Repository Structure Mismatch**

The provided repository structure shows only two files in the `neerb/autonomous-repo` repository:
- `README.md` — Contains only "# autonomous-repo
Testing purposes"
- `yuh.go` — Not provided in file contents

**Expected Files (per Intent Dependencies):**
- `index.html` — Entry point for the Three.js application
- `src/main.js` — Scene setup, render loop, and all animation logic
- `src/style.css` — Full-viewport canvas styling
- `package.json` — Dependencies (`three`, `vite`) and dev script

**Status:** The target Three.js project does not exist in the repository at the current path. This orbit cannot proceed without the baseline starter project in place.

**Resolution Required:**
Either the repository path is incorrect, or this is orbit 0 (creating the starter project) being misclassified as orbit 1 (enhancing an existing scene). The Intent Document references "existing Three.js scene" with cube, diamond, and sphere, but no such code exists in the provided repository structure.

**Assumed File Paths (if baseline exists in different location or will be created):**
- `index.html` — HTML entry point with canvas element
- `src/main.js` — **PRIMARY MODIFICATION TARGET** — All new code goes here
- `src/style.css` — No modifications required (per Intent constraints)
- `package.json` — No modifications required (dependencies already present)

**Three.js Imports (expected in `src/main.js`):**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

## Architecture Context

**Scene Graph Structure (Assumed Baseline):**

```
Scene (THREE.Scene)
├── PerspectiveCamera
├── AmbientLight
├── DirectionalLight
├── Cube (THREE.Mesh with BoxGeometry + MeshStandardMaterial)
├── Diamond (THREE.Mesh — geometry unknown, assumed OctahedronGeometry or similar)
└── Sphere (THREE.Mesh with SphereGeometry + MeshStandardMaterial)
```

**New Elements to Add:**
```
Scene
├── [existing objects...]
├── DirectionalLight (modify for shadow casting)
└── GroundPlane (THREE.Mesh with PlaneGeometry + MeshStandardMaterial)
    └── receiveShadow: true
```

**Rendering Pipeline:**
1. **Initialization Phase** — Scene, camera, renderer, lights, geometries created once
2. **Animation Loop** — `requestAnimationFrame` callback updates object transforms and re-renders
3. **Event Handlers** — Window resize and mouse move listeners update state

**Data Flow for New Features:**

**Continuous Motion:**
- Animation loop tracks elapsed time via `clock.getElapsedTime()` or delta time accumulation
- Diamond rotation: `diamond.rotation.y += deltaTime * rotationSpeed`
- Sphere orbit: `sphere.position.x = Math.cos(time) * radius`, `sphere.position.z = Math.sin(time) * radius`

**Mouse Interaction:**
- `mousemove` event listener captures `event.clientX` and `event.clientY`
- Normalize coordinates to [-1, 1] range: `(clientX / window.innerWidth) * 2 - 1`
- Map to light properties with smoothing (lerp or exponential decay)
- Update `directionalLight.intensity` or `directionalLight.position`

**Shadow Rendering:**
- Renderer configuration: `renderer.shadowMap.enabled = true`, `renderer.shadowMap.type = THREE.PCFSoftShadowMap`
- Light configuration: `directionalLight.castShadow = true`, set `shadow.mapSize`, `shadow.camera` frustum
- Object configuration: Set `castShadow = true` on cube, diamond, sphere; `receiveShadow = true` on ground plane

**Performance Constraints:**
- Target: 60fps on mid-range hardware (integrated graphics)
- Shadow map resolution: 1024x1024 (balance quality vs performance)
- Single directional light for shadows (additional shadow-casting lights multiply draw calls)
- No shadow camera helpers or debug geometry in production code

## Pattern Library

**Code Organization Pattern (Inferred from Project Constraints):**

Given the 100-line limit and vanilla JS requirement, the expected pattern is:

1. **Global Declarations** — Scene, camera, renderer, controls, objects, lights
2. **Initialization Function** — `init()` or inline setup at top level
3. **Animation Function** — `animate()` or `render()` called recursively via `requestAnimationFrame`
4. **Event Handlers** — Window resize and mouse move as named functions or inline

**Naming Conventions (Standard Three.js Community):**
- `scene`, `camera`, `renderer` — Lowercase for singleton instances
- `cube`, `diamond`, `sphere`, `groundPlane` — Descriptive mesh names
- `ambientLight`, `directionalLight` — Lowercase camelCase for lights
- `controls` — OrbitControls instance

**Material Pattern (MeshStandardMaterial Required):**
```javascript
const material = new THREE.MeshStandardMaterial({ color: 0xHEXCODE });
```
- All objects must use `MeshStandardMaterial` (or `MeshPhysicalMaterial`) for shadow interaction
- `MeshBasicMaterial` does not respond to lights or cast/receive shadows

**Geometry Disposal Pattern (Not Required for Starter):**
- Static scene with no dynamic object creation — no need for `.dispose()` calls
- If resizing or rebuilding geometries, proper disposal would be required

**Shadow Configuration Pattern (Three.js Standard):**
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

mesh.castShadow = true;
groundPlane.receiveShadow = true;
```

**Animation Timing Pattern (Frame-Rate Independence):**
```javascript
const clock = new THREE.Clock();

function animate() {
  const deltaTime = clock.getDelta();
  // Use deltaTime for all animations
  cube.rotation.x += deltaTime * speed;
  requestAnimationFrame(animate);
}
```

**Mouse Interaction Pattern (Normalized Coordinates):**
```javascript
let mouseX = 0, mouseY = 0;

window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// In animation loop:
light.intensity = baseIntensity + mouseX * variationRange;
```

## Prior Orbit References

**No Prior Orbits Exist**

This is the first enhancement orbit for the Three.js starter project. The baseline project (orbit 0) was presumably completed prior to this orbit, but no ORBITAL artifacts exist for reference.

**Expected Baseline State (Orbit 0 Deliverables):**
- Single rotating cube with X and Y axis rotation
- Dark background (0x1a1a2e) set via `renderer.setClearColor()`
- OrbitControls attached to camera and updated in animation loop
- Window resize handler that updates camera aspect ratio and renderer size
- AmbientLight + DirectionalLight illuminating the scene
- Vite dev server running on `npm run dev`

**Unknown Baselines (Require Verification):**
- **Cube rotation speed** — Not specified; new animations must be noticeably different (30%+ variance per Intent)
- **Camera position** — Assumed to be positioned back from origin (e.g., `z = 5`) to view scene
- **Light configuration** — Positions, intensities, and colors of existing AmbientLight and DirectionalLight
- **Scene scale** — Size of cube and spacing expectations for new objects

**Lessons from Project Constraints:**
- 100-line limit enforces brevity — no helper functions, minimal abstraction
- Vanilla JS constraint means no build-time optimizations or tree-shaking beyond Vite's defaults
- No TypeScript means no type safety for Three.js API calls (common source of runtime errors)

## Risk Assessment

### Risk 1: Baseline Project Does Not Exist

**Severity:** Critical  
**Likelihood:** High (repository shows no Three.js files)

**Description:**  
The repository structure provided (`README.md`, `yuh.go`) does not contain the expected Three.js starter project files. The Intent Document assumes an existing scene with cube, diamond, and sphere, but these do not exist in `neerb/autonomous-repo`.

**Impact:**
- Orbit cannot proceed without baseline codebase
- Proposal Record will reference non-existent files
- Verification Protocol cannot test against actual code

**Mitigation:**
- Verify correct repository path or branch
- If baseline needs to be created, this should be orbit 0, not orbit 1
- Request clarification on whether diamond and sphere exist (Intent references them, but Project Description mentions only a cube)

### Risk 2: Line Budget Violation (100-Line Constraint)

**Severity:** High  
**Likelihood:** Medium

**Description:**  
Adding three feature sets (continuous motion, mouse interaction, shadow rendering) to an already-functioning scene pushes against the 100-line limit. The baseline scene likely occupies 60-75 lines, leaving 25-40 lines for:
- Diamond Y-axis rotation logic
- Sphere orbital motion (trig calculations)
- Mouse event listener and coordinate normalization
- Light response to mouse input
- Shadow configuration (renderer, light, 4+ objects)
- Ground plane creation and material setup

**Impact:**
- May require removal of comments or formatting to fit
- Could force code compression that reduces readability
- Might necessitate cutting one feature to stay under limit

**Mitigation:**
- Prioritize features: shadows (highest visual impact), motion, then mouse interaction
- Use minimal variable names for new additions (sacrifice clarity for brevity)
- Consolidate initialization code where possible
- Accept risk that educational value (code readability) may decrease

### Risk 3: OrbitControls Event Conflict

**Severity:** Medium  
**Likelihood:** Medium

**Description:**  
OrbitControls already listen to mouse events (`mousedown`, `mousemove`, `mouseup`) for camera manipulation. Adding a separate `mousemove` listener for light interaction could create conflicts:
- Both handlers fire on same event
- Mouse position updates affect light even during camera drag
- User cannot distinguish between "I'm moving the camera" and "I'm adjusting the light"

**Impact:**
- Jarring visual experience during camera orbiting
- Light may flicker or jitter during drag operations
- Violates Intent constraint: "does not interfere with OrbitControls"

**Mitigation:**
- Use mouse position only when OrbitControls are not actively dragging
- Check `controls.enabled` state or add flag tracking pointer interaction
- Apply smoothing/lerping to light changes (reduces jitter during rapid mouse movement)
- Alternative: Use `mousemove` only when pointer is NOT down (no drag in progress)

### Risk 4: Shadow Rendering Performance

**Severity:** Medium  
**Likelihood:** Low

**Description:**  
Enabling shadows increases GPU workload:
- Shadow map rendering pass for each shadow-casting light
- Additional depth texture storage (1024x1024 = 1MB per shadow map)
- Fragment shader complexity increases for receiving surfaces

On integrated graphics (Intel UHD, AMD Vega), this could drop frame rate below the 55fps acceptance threshold.

**Impact:**
- Fails performance acceptance criterion
- Scene becomes unusable on target hardware
- May require reducing shadow quality or disabling feature

**Mitigation:**
- Use lowest acceptable shadow map resolution (1024x1024, not 2048x2048)
- Use `PCFSoftShadowMap` (balanced quality/performance), not `VSMShadowMap` (expensive)
- Limit shadow camera frustum to tightly fit scene (reduces render area)
- Ensure only one light casts shadows (DirectionalLight, not AmbientLight)
- Test on integrated graphics early; if fails, document trade-off for reviewer

### Risk 5: Shadow Artifacts (Acne, Peter-Panning)

**Severity:** Medium  
**Likelihood:** Medium

**Description:**  
Shadow rendering commonly produces visual artifacts:
- **Shadow acne:** Self-shadowing moire patterns on surfaces
- **Peter-panning:** Objects appear detached from their shadows
- **Aliasing:** Jagged shadow edges despite soft shadow map type

These occur due to depth bias misconfiguration or insufficient shadow camera bounds.

**Impact:**
- Violates Intent constraint: "must not create harsh visual artifacts"
- Shadows look unprofessional or distracting
- May require iterative tuning (increases implementation time)

**Mitigation:**
- Set `directionalLight.shadow.bias = -0.0001` to reduce acne (adjust if artifacts appear)
- Position shadow camera to fully encompass scene with minimal extra space
- Set `shadow.camera.near` and `.far` to tightly bound scene depth range
- Use `normalBias` (Three.js r151+) as alternative to traditional bias
- Ground plane should be positioned below object origins (y = -1 or similar) to avoid z-fighting

### Risk 6: Sphere Orbit Path Assumptions

**Severity:** Low  
**Likelihood:** Medium

**Description:**  
The Intent specifies "small radius, slow speed" but does not define:
- Orbital plane (XZ horizontal, XY vertical, or angled?)
- Starting position (sphere may already be positioned in scene)
- Collision with other objects during orbit

If the sphere's orbital path intersects the cube or diamond, visual overlap occurs.

**Impact:**
- Sphere may clip through other geometry (breaks immersion)
- Orbit may look cramped if radius is too small relative to object sizes
- Animation may not be "gentle" if speed is too fast for the radius

**Mitigation:**
- Assume horizontal orbit in XZ plane (most common pattern, aligns with ground plane)
- Use radius of 3 units (middle of 2-4 range) as safe starting point
- Set initial sphere position on orbit path (`x = radius, z = 0`) to avoid snap-in
- Calculate angular velocity from desired period: `angularSpeed = (2 * Math.PI) / periodSeconds`
- Verify orbit path visually during Verification phase; adjust radius if overlap occurs

### Risk 7: Missing Objects (Diamond, Sphere)

**Severity:** High  
**Likelihood:** High

**Description:**  
The Project Description (baseline requirements) specifies "a single rotating cube" only. The Intent Document references diamond and sphere as existing objects. This discrepancy suggests:
- Either the baseline was expanded beyond original spec (orbit between project creation and this orbit)
- Or the Intent incorrectly assumes objects that don't exist

**Impact:**
- Proposal may plan animations for non-existent objects
- Implementation will fail when attempting to reference `diamond` or `sphere` variables
- Line count budget is different if these objects need to be created

**Mitigation:**
- Treat diamond and sphere as NEW objects to be created in this orbit (adds ~8-10 lines)
- Adjust line budget expectations: baseline ~70 lines + new features + 2 objects = tight fit
- Alternative: Request clarification on whether these objects exist; if not, reduce scope (e.g., animate only cube + sphere, skip diamond)
- Document assumption in Proposal Record: "If diamond/sphere do not exist, they will be created as part of this orbit"