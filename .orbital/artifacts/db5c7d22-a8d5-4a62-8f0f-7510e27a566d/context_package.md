# Context Package: Subtle Interaction + Scene Polish

## Codebase References

### Primary Modification Surface
- **`src/main.js`** — The sole JavaScript file containing scene setup, animation loop, and all Three.js logic. This is the only file requiring modification for this orbit.

### Supporting Files (Read-Only)
- **`index.html`** — HTML entry point that mounts the Three.js canvas. No modifications needed.
- **`src/style.css`** — Defines full-viewport canvas styling. No modifications needed.
- **`package.json`** — Defines dependencies (`three@^0.160.0`, `vite@^5.0.0`) and dev script. No modifications needed.

### External Module Dependencies
- **`three`** — Core Three.js library (version 0.160.0)
- **`three/addons/controls/OrbitControls.js`** — Camera controls module, already imported in prior orbit

### Current State Assessment
The codebase artifact structure shows prior orbits at commits `2e6b889d`, `7cac94ca`, `db5c7d22`, and `feb8e410`. The Intent Document explicitly references `feb8e410-9390-453a-b597-a92938a16631` as the immediate predecessor, indicating that Orbit 2 added diamond and sphere geometry to the original single-cube scene.

**Critical Gap:** `src/main.js` content is not provided in the repository files. Implementation must infer structure from prior orbit artifacts and project requirements.

## Architecture Context

### Scene Graph Structure
Based on project requirements and prior orbit context, the current scene graph follows this hierarchy:

```
Scene
├── PerspectiveCamera (positioned to view center)
├── AmbientLight
├── DirectionalLight
├── Cube (BoxGeometry + MeshStandardMaterial, rotating)
├── Diamond (geometry type unknown, added in Orbit 2)
└── Sphere (SphereGeometry + MeshStandardMaterial, added in Orbit 2)
```

### Render Pipeline
1. **Initialization:** Scene, camera, renderer, lights, geometry created in module scope
2. **Controls Setup:** OrbitControls instantiated with camera and renderer DOM element
3. **Resize Handler:** Window resize listener updates camera aspect ratio and renderer size
4. **Animation Loop:** `requestAnimationFrame` drives continuous rendering
   - Updates object rotations
   - Updates OrbitControls
   - Renders scene with camera

### Event Flow
- **Window Resize:** Passive listener → updates camera + renderer → no explicit re-render (handled by animation loop)
- **Mouse Input (OrbitControls):** Internal event handling by OrbitControls module → camera transformation → visible in next frame
- **New Requirement (Mouse Tracking):** Must add `mousemove` listener → store normalized coordinates → apply in animation loop

### Performance Considerations
- **Single Scene/Camera/Renderer:** No multi-pass rendering or scene switching
- **Material Limitations:** MeshStandardMaterial requires lighting to be visible, benefits from shadow rendering
- **No Asset Loading:** All geometry is procedural (no texture/model loading delays)
- **Vite Dev Server:** Hot module replacement for development, no production build optimization needed for this orbit

## Pattern Library

### Naming Conventions
Based on Three.js community standards and project requirements:
- **Scene Objects:** Lowercase descriptive names (`cube`, `diamond`, `sphere`, `groundPlane`)
- **Three.js Classes:** PascalCase as per library convention (`PerspectiveCamera`, `WebGLRenderer`, `MeshStandardMaterial`)
- **Functions:** camelCase (`animate`, `handleResize`)

### Geometry Creation Pattern
Standard Three.js object creation follows this pattern:
```javascript
const geometry = new THREE.BoxGeometry(params);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(x, y, z);
scene.add(mesh);
```

### Animation Loop Pattern
```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update object transforms
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

### Resize Handler Pattern
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

### Light Configuration Pattern
- **AmbientLight:** Low intensity (typically 0.3-0.5) for base illumination
- **DirectionalLight:** Higher intensity (0.8-1.0) for primary light source, positioned above and to the side

### Material Configuration
All objects use `MeshStandardMaterial` to support lighting and shadows. Standard properties:
- `color`: Hex color value
- `metalness`: 0-1 (defaults to 0.5)
- `roughness`: 0-1 (defaults to 0.5)

## Prior Orbit References

### Orbit 1: Initial Scaffold (Commit `2e6b889d`)
**Scope:** Created the minimal Three.js starter with single rotating cube

**Established Patterns:**
- Single-file architecture in `src/main.js`
- Dark background color (0x1a1a2e)
- OrbitControls for camera interaction
- Window resize handling
- `requestAnimationFrame` animation loop

**Artifacts Available:**
- `.orbital/artifacts/2e6b889d-24a5-4428-baf6-4494433a3cae/code_generation.md`
- Context, intent, and proposal documents for reference

### Orbit 2: Multi-Object Scene (Commit `feb8e410`)
**Scope:** Added diamond and sphere geometry to create visual variety

**Key Changes:**
- Added diamond geometry (implementation method unknown)
- Added sphere geometry
- Maintained single-file architecture
- Preserved cube rotation behavior
- Stayed within 100-line constraint

**Artifacts Available:**
- `.orbital/artifacts/feb8e410-9390-453a-b597-a92938a16631/code_generation.md`
- Test results available for verification of prior implementation

**Unknown Details:**
- Exact diamond geometry construction (ConeGeometry? OctahedronGeometry? Custom vertices?)
- Object positioning in 3D space
- Whether objects are currently static or have any motion beyond cube rotation
- Current line count in `src/main.js`

### Orbit 3 (Current): Interaction + Polish
This orbit builds on Orbit 2's multi-object scene by adding motion differentiation, mouse interaction, and shadow rendering.

## Risk Assessment

### Risk 1: Line Count Budget Violation
**Likelihood:** High  
**Impact:** Blocks orbit completion

**Details:**  
Adding shadow configuration (renderer, light, meshes), mouse tracking, orbital motion, and ground plane geometry will add 15-25 lines of code. If Orbit 2 already consumed 85+ lines, the budget will be exceeded.

**Mitigations:**
- Remove all comments and collapse whitespace where possible
- Use single-letter variable names for mouse coordinates and time tracking
- Combine initialization steps (e.g., `scene.add(mesh.castShadow=mesh.receiveShadow=true,mesh)` anti-pattern)
- Request line count audit from Orbit 2 artifacts before implementation
- Consider multi-statement lines for geometry creation: `const g=new THREE.PlaneGeometry(20,20),m=new THREE.MeshStandardMaterial({color:0x0a0a0a}),p=new THREE.Mesh(g,m);`

### Risk 2: Shadow Rendering Artifacts
**Likelihood:** Medium  
**Impact:** Visual quality fails acceptance criteria

**Details:**
Shadow acne (self-shadowing artifacts), peter-panning (shadows detached from objects), or overly sharp/soft shadows can occur if:
- DirectionalLight shadow camera frustum is incorrectly sized
- Shadow bias values are not tuned
- Shadow map resolution is too low
- Ground plane is too close to object bases

**Mitigations:**
- Set `renderer.shadowMap.type = THREE.PCFSoftShadowMap` for soft shadows
- Position ground plane at y=-2 or lower to avoid z-fighting
- Use DirectionalLight shadow camera configuration: `light.shadow.camera.left/right/top/bottom = -10, 10` for adequate coverage
- Set shadow bias: `light.shadow.bias = -0.001` if acne appears

### Risk 3: Mouse Interaction Conflicts with OrbitControls
**Likelihood:** Medium  
**Impact:** User experience degrades; OrbitControls becomes unresponsive

**Details:**
If mouse tracking directly modifies light position on every `mousemove` event, it may interfere with OrbitControls' drag detection or create visual stuttering when user is rotating the camera.

**Mitigations:**
- Store mouse position in variables updated by `mousemove` listener
- Apply light transformations only in animation loop using stored coordinates
- Use normalized device coordinates (NDC) ranging from -1 to 1
- Apply smoothing/lerping to light position changes: `light.position.x += (targetX - light.position.x) * 0.1`
- Do not call `event.preventDefault()` or `event.stopPropagation()` on mouse events

### Risk 4: Performance Degradation from Shadow Rendering
**Likelihood:** Low  
**Impact:** Frame rate drops below 60fps on target hardware

**Details:**
Shadow map generation adds a rendering pass per shadow-casting light. With three objects casting shadows and one DirectionalLight, the performance impact should be minimal on modern hardware, but older devices or integrated GPUs may struggle.

**Mitigations:**
- Use default shadow map resolution (512x512) rather than higher values
- Limit shadow casting to DirectionalLight only (do not enable shadows on AmbientLight)
- Set `renderer.shadowMap.autoUpdate = true` (default) to avoid manual updates
- Ground plane should be simple (PlaneGeometry with minimal segments, not complex mesh)

### Risk 5: Sphere Orbital Motion Implementation Complexity
**Likelihood:** Medium  
**Impact:** Code becomes verbose, exceeding line budget or creating maintenance burden

**Details:**
Circular orbital motion requires trigonometric calculations (Math.sin/cos with time-based parameter). Implementing this cleanly while maintaining readability and staying within line budget requires careful structuring.

**Mitigations:**
- Use elapsed time from `performance.now()` or `Date.now()` divided by a constant (e.g., `t=Date.now()*0.0001`)
- Apply motion in animation loop: `sphere.position.set(Math.cos(t)*4, 0, Math.sin(t)*4)`
- Orbit radius of 3-5 units fits acceptance criteria for "small radius"
- Orbit period of 15-30 seconds achieved with time multiplier of ~0.0001 to 0.0002

### Risk 6: Diamond Rotation Axis Selection
**Likelihood:** Low  
**Impact:** Visual distinction from cube rotation is insufficient

**Details:**
If the diamond's rotation axis is too similar to the cube's (e.g., both rotating primarily on Y axis), the visual counterpoint described in the Intent will not be achieved.

**Mitigations:**
- Cube currently rotates on X and Y axes (per original requirements)
- Diamond should rotate on Y and Z axes, or Z axis only, to create clear visual difference
- Use different rotation speeds: if cube is `+=0.01` per frame, diamond should be `+=0.005` or `+=0.015` for temporal variation

### Risk 7: Unknown Initial State from Orbit 2
**Likelihood:** High  
**Impact:** Implementation makes incorrect assumptions about existing code

**Details:**
Without access to `src/main.js` content, the exact structure of diamond geometry, object positions, variable names, and current line count are unknown. This creates risk of implementation that doesn't integrate cleanly.

**Mitigations:**
- Proposal should explicitly state assumptions about current code structure
- Request code review before execution if Tier 2 supervision allows
- Use Three.js standard patterns that will integrate regardless of specific implementation details
- Test execution should validate that all referenced objects (cube, diamond, sphere) exist in scene