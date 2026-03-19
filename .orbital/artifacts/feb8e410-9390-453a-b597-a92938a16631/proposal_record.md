# Proposal Record: Subtle Interaction + Scene Polish

## Interpreted Intent

This orbit enhances the existing Three.js starter scene with three distinct enhancement layers while maintaining the minimalist philosophy and 100-line code budget:

1. **Differentiated Object Motion**: Transform the static diamond and sphere into animated elements with unique motion profiles. The diamond will rotate on Y and Z axes (distinct from the cube's X/Y rotation), while the sphere will orbit the scene origin in a circular path. These motions should feel organic and continuous, using time-based animation to ensure frame-rate independence.

2. **Interactive Lighting**: Create a responsive connection between user input and scene illumination. As the mouse moves across the viewport, the DirectionalLight's position and/or intensity will shift subtly, providing tactile feedback without overwhelming the scene. The effect should be smooth and natural, using normalized viewport coordinates to drive light parameters.

3. **Shadow-Based Depth**: Add spatial grounding through soft shadow rendering. All three geometric objects (cube, diamond, sphere) will cast shadows onto a newly introduced ground plane positioned below the scene. The ground plane must be visually recessive—dark colored and large enough to feel like an environment rather than another geometric primitive.

The core constraint is achieving these enhancements within the existing 100-line JavaScript budget in `src/main.js` without adding dependencies or modifying other project files. Performance must remain at 60fps on mid-range hardware, requiring careful shadow map resolution selection and efficient event handling.

The intent prioritizes **polish over features**: if line count pressure forces trade-offs, core functionality (motion, shadows, basic interaction) takes precedence over stretch goals (light color temperature shifts, advanced easing curves).

## Implementation Plan

### File Modifications

**`src/main.js` (complete rewrite within 100-line budget)**

The implementation will restructure the existing file into these logical sections:

#### Section 1: Imports and Configuration (Lines 1-3)
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const ORBIT_RADIUS = 4, ORBIT_SPEED = 0.0003, MOUSE_INFLUENCE = 0.4;
```

Configuration constants consolidate magic numbers for sphere orbit parameters and mouse interaction sensitivity.

#### Section 2: Scene Initialization (Lines 4-12)
- Create scene with dark background: `scene.background = new THREE.Color(0x1a1a2e)`
- Initialize PerspectiveCamera (FOV 75, aspect ratio from window, near 0.1, far 1000)
- Position camera at (0, 3, 8) to view scene from elevated angle
- Create WebGLRenderer with antialias enabled
- Enable shadow mapping: `renderer.shadowMap.enabled = true` and `renderer.shadowMap.type = THREE.PCFSoftShadowMap`
- Set renderer size to window dimensions and append to DOM

#### Section 3: Lighting Setup (Lines 13-18)
- **AmbientLight**: `new THREE.AmbientLight(0x404040, 0.5)` — low-intensity base illumination
- **DirectionalLight**: Store in variable `dirLight` for animation loop access
  - Initial position: (5, 10, 7.5) — elevated and offset for shadow angle
  - Intensity: 1.0 (base, will vary ±20% with mouse interaction)
  - Enable shadow casting: `dirLight.castShadow = true`
  - Configure shadow properties:
    - `shadow.mapSize`: 1024x1024 (balances quality and performance)
    - `shadow.camera.near`: 0.5
    - `shadow.camera.far`: 50
    - `shadow.camera.left/right/top/bottom`: -15 to 15 (captures all objects)
    - `shadow.bias`: -0.0005 (prevents shadow acne)

#### Section 4: Geometry Creation (Lines 19-32)
- **Cube**: `BoxGeometry(2, 2, 2)` with `MeshStandardMaterial({ color: 0x4fc3f7 })`
  - `castShadow = true`
  - Will continue existing X/Y rotation in animation loop
  
- **Diamond**: `OctahedronGeometry(1.5)` with `MeshStandardMaterial({ color: 0xff4081 })`
  - Position: (-4, 0, 0) — left of center
  - `castShadow = true`
  - Will rotate on Y and Z axes at 0.0005 and 0.0003 radians/frame
  
- **Sphere**: `SphereGeometry(1, 32, 32)` with `MeshStandardMaterial({ color: 0x9c27b0 })`
  - Initial position: (ORBIT_RADIUS, 0, 0) — starting point of circular orbit
  - `castShadow = true`
  - Will orbit using parametric circle: `x = r*cos(t), z = r*sin(t)`
  
- **Ground Plane**: `PlaneGeometry(30, 30)` with `MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.9, metalness: 0.1 })`
  - Rotate -90° on X axis to make horizontal
  - Position: (0, -3, 0) — below objects
  - `receiveShadow = true`
  - Large size (30x30) ensures no visible edges in default view

#### Section 5: OrbitControls (Lines 33-34)
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
```
Preserve existing pattern with damping for smooth interaction.

#### Section 6: Mouse Interaction Handler (Lines 35-39)
```javascript
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
```
Normalize mouse coordinates to [-1, 1] range. Store in closure variables for animation loop access. Negated Y for standard 3D coordinate system (positive Y = up).

#### Section 7: Window Resize Handler (Lines 40-45)
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```
Standard resize pattern—no shadow-specific logic needed as shadow maps use absolute pixel dimensions.

#### Section 8: Animation Loop (Lines 46-58)
```javascript
function animate(time = 0) {
  requestAnimationFrame(animate);
  
  // Existing cube rotation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Diamond rotation (Y and Z axes, slower)
  diamond.rotation.y += 0.005;
  diamond.rotation.z += 0.003;
  
  // Sphere orbital motion
  const t = time * ORBIT_SPEED;
  sphere.position.x = Math.cos(t) * ORBIT_RADIUS;
  sphere.position.z = Math.sin(t) * ORBIT_RADIUS;
  
  // Interactive lighting
  dirLight.position.x = 5 + mouseX * MOUSE_INFLUENCE * 3;
  dirLight.position.z = 7.5 + mouseY * MOUSE_INFLUENCE * 3;
  dirLight.intensity = 1.0 + mouseY * 0.2;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

**Time-based motion**: The `time` parameter from `requestAnimationFrame` provides milliseconds since page load. Multiplied by `ORBIT_SPEED` to create smooth, frame-independent circular motion.

**Diamond rotation**: Uses larger increments than orbit calculations (0.005 and 0.003 radians/frame) for visible but slower rotation compared to cube.

**Interactive light**: Maps mouse X to lateral position shift (±1.2 units), mouse Y to depth shift and intensity variation (0.8 to 1.2 range). The `MOUSE_INFLUENCE` constant (0.4) dampens the effect for subtlety.

### Implementation Order

1. **Phase 1**: Add shadow configuration to renderer and DirectionalLight (renderer initialization, light setup sections)
2. **Phase 2**: Enable `castShadow` on all three existing objects, create ground plane with `receiveShadow`
3. **Phase 3**: Add mouse event listener and closure variables
4. **Phase 4**: Modify animation loop to accept `time` parameter and add diamond rotation
5. **Phase 5**: Implement sphere orbital motion using trigonometric positioning
6. **Phase 6**: Add interactive lighting updates using mouse state
7. **Phase 7**: Line count optimization pass—remove comments, consolidate where possible

### Line Count Breakdown

| Section | Lines | Notes |
|---------|-------|-------|
| Imports & constants | 3 | Consolidated configuration |
| Scene initialization | 9 | Renderer + shadow enable |
| Lighting setup | 6 | Ambient + directional with shadow config |
| Geometry (4 objects) | 14 | Cube, diamond, sphere, ground with materials |
| OrbitControls | 2 | Existing pattern preserved |
| Mouse handler | 5 | Event listener + normalization |
| Resize handler | 6 | Existing pattern preserved |
| Animation loop | 13 | Motion updates + light interaction |
| **Total** | **58** | **42-line buffer for formatting** |

Estimated final line count: 65-75 lines (well under 100-line limit with readability maintained).

### Dependencies

**No new dependencies required.** All functionality uses:
- Three.js core (`THREE.Scene`, `THREE.WebGLRenderer`, geometries, materials, lights)
- Three.js examples (`OrbitControls`)
- Native JavaScript (`Math.sin`, `Math.cos`, `window.addEventListener`, `requestAnimationFrame`)

### Testing Strategy

**Visual validation checkpoints:**
1. Ground plane visible and dark—not competing with objects
2. All three objects cast visible shadows on ground
3. Shadow edges soft but defined (no harsh aliasing)
4. Diamond rotates visibly on different axes than cube
5. Sphere moves in smooth circle around origin
6. Mouse movement causes noticeable but subtle light shifts
7. OrbitControls remain responsive during interaction

**Performance validation:**
- Open DevTools Performance profiler
- Record 10-second interaction session with mouse movement and camera rotation
- Verify frame time stays below 16.67ms (60fps threshold)
- Check for dropped frames during simultaneous interaction and object motion

## Risk Surface

### Critical Risks

**Risk 1: Line count exceeds 100 during implementation**
- **Trigger**: Combining all features pushes total beyond budget even after optimization
- **Impact**: Violates core constraint, requires feature reduction
- **Mitigation**: Current estimate shows 35-40 line buffer. If exceeded during implementation:
  - Remove diamond rotation (save ~2 lines), revert to static diamond
  - Reduce light interaction to position-only (no intensity variation, save ~1 line)
  - Consolidate geometry creation using loops if multiple objects share properties
- **Fallback**: Prioritize shadows + sphere motion over diamond rotation + light intensity

**Risk 2: Shadow map resolution causes performance degradation**
- **Trigger**: 1024x1024 shadow map drops frame rate below 60fps on integrated graphics
- **Impact**: Fails performance acceptance criteria
- **Mitigation**: 
  - Start with 1024x1024 as proposed
  - If performance testing shows <60fps, reduce to 512x512
  - Shadow quality will remain acceptable due to `PCFSoftShadowMap` filtering
- **Detection**: Performance profiler will show GPU time spike during shadow pass

**Risk 3: Shadow artifacts (acne, peter-panning) visible**
- **Trigger**: Default bias settings cause shadow rendering issues
- **Impact**: Reduces visual polish, may require iteration
- **Mitigation**:
  - Proposed `shadow.bias = -0.0005` based on typical DirectionalLight values
  - If acne appears: decrease bias to -0.001 or -0.002
  - If peter-panning (shadows detached from objects): increase bias toward 0
  - Add `shadow.normalBias = 0.01` if surface-angle artifacts persist
- **Detection**: Visual inspection during testing phase

### Medium Risks

**Risk 4: Ground plane too prominent or too subtle**
- **Trigger**: Size, position, or color choices make plane either distracting or invisible
- **Impact**: Fails visual balance requirement
- **Mitigation**:
  - Proposed: 30x30 size, y=-3 position, `0x0a0a0f` color (nearly black)
  - If too prominent: darken to `0x050508` or reduce size to 25x25
  - If too subtle: increase roughness to 1.0 or add slight specular with lower metalness
- **Detection**: Human review during Tier 2 validation

**Risk 5: Mouse interaction too aggressive or unnoticeable**
- **Trigger**: `MOUSE_INFLUENCE` constant (0.4) results in over/under-reactive lighting
- **Impact**: Fails "tactile feel" vs "not distracting" balance
- **Mitigation**:
  - Proposed multiplier: 0.4 (conservative start)
  - If too subtle: increase to 0.6-0.8
  - If too aggressive: decrease to 0.2-0.3
  - Intensity variation (±20%) may need adjustment to ±10% or ±30%
- **Detection**: Human testing with slow and rapid mouse movements

**Risk 6: Sphere orbit speed imperceptible or nauseating**
- **Trigger**: `ORBIT_SPEED = 0.0003` too slow/fast for desired 5-10 second period
- **Impact**: Fails motion acceptance criteria
- **Mitigation**:
  - Proposed: 0.0003 radians/millisecond → ~10.5 second full orbit (2π / 0.0003 / 1000)
  - If too slow: increase to 0.0005 (6.3 second period)
  - If too fast: decrease to 0.0002 (15.7 second period)
- **Detection**: Time full orbit with stopwatch during testing

### Low Risks

**Risk 7: OrbitControls conflict with mouse interaction**
- **Trigger**: Mouse movement intended for light interaction triggers camera rotation
- **Impact**: Confusing user experience
- **Likelihood**: Very low—OrbitControls requires click-drag, mouse movement alone doesn't trigger controls
- **Mitigation**: No action needed; interaction modes are naturally separated
- **Detection**: Test camera rotation and light interaction independently

**Risk 8: Window resize causes shadow frustum mismatch**
- **Trigger**: Shadow camera bounds don't scale with viewport aspect ratio
- **Impact**: Objects outside shadow frustum cast no shadows after resize
- **Likelihood**: Very low—shadow camera uses absolute world-space bounds (-15 to 15), independent of viewport
- **Mitigation**: No resize-specific logic needed for shadows
- **Detection**: Resize window to extreme aspect ratios and verify shadows persist

**Risk 9: Three.js API changes between 0.160.0 and current**
- **Trigger**: Project upgrades Three.js version, breaking shadow API
- **Impact**: Runtime errors or non-functional shadows
- **Likelihood**: Very low—API stable since r90, project locked to 0.160.0
- **Mitigation**: No action needed for this orbit; future upgrades should reference Three.js migration guides
- **Detection**: Automated testing would catch breaking changes

## Scope Estimate

### Complexity Assessment

**Overall Complexity**: Medium-Low

This orbit involves well-established Three.js patterns (shadow mapping, event handling, animation loop modifications) within a constrained environment. The primary complexity driver is the 100-line budget, which requires careful code organization rather than algorithmically complex logic.

**Complexity Breakdown by Feature:**

| Feature | Complexity | Rationale |
|---------|-----------|-----------|
| Shadow Rendering | Low | Standard Three.js shadow API with established configuration patterns |
| Diamond Rotation | Trivial | Simple rotation increment in animation loop |
| Sphere Orbital Motion | Low | Parametric circle using `Math.sin/cos`, frame-independent timing |
| Interactive Lighting | Low-Medium | Coordinate normalization + vector math, requires tuning for feel |
| Code Budget Management | Medium | Requires optimization and potential feature trade-offs |

**Technical Unknowns:**
- Exact current line count in `src/main.js` (cannot verify without file content)
- Whether existing code uses `animate(time)` signature or needs modification
- Current DirectionalLight variable scope (function-local vs module-level)

### Work Phases

**Phase 1: Core Implementation** (Estimated: 60-90 minutes)
- Modify renderer and light for shadow support
- Add ground plane geometry with shadow receiving
- Enable `castShadow` on existing objects
- Implement diamond rotation and sphere orbit motion
- Add mouse event listener and coordinate normalization

**Phase 2: Interactive Lighting** (Estimated: 30-45 minutes)
- Integrate mouse state into animation loop
- Implement light position and intensity updates
- Initial parameter tuning (MOUSE_INFLUENCE constant)

**Phase 3: Optimization** (Estimated: 30-60 minutes)
- Line count audit and reduction
- Remove unnecessary whitespace and comments
- Consolidate initialization where possible
- Verify no runtime errors or console warnings

**Phase 4: Testing and Tuning** (Estimated: 45-90 minutes)
- Visual validation of all acceptance criteria
- Performance profiling (60fps verification)
- Parameter adjustment (orbit speed, mouse influence, shadow bias)
- Cross-browser testing (Chrome, Firefox, Safari)

**Total Estimated Effort**: 2.5-4.5 hours of focused development time

### Orbit Count

**Single Orbit**: All features can be implemented in one cohesive pass within `src/main.js`. The features are tightly coupled (shadows require light configuration, interaction requires animation loop access, motion requires timing infrastructure) and don't benefit from staged delivery.

**No Sub-Orbits**: The scope is small enough and the file surface limited enough that breaking into multiple orbits would create more coordination overhead than value.

### Success Criteria Mapping

| Acceptance Boundary | Implementation Element | Verification Method |
|---------------------|----------------------|---------------------|
| Diamond rotates on Y/Z axes | `diamond.rotation.y/z += ...` in animate() | Visual inspection of rotation axes |
| Sphere orbits at 3-5 unit radius | `ORBIT_RADIUS = 4` constant | Measure distance from origin in DevTools |
| Light responds to mouse | `dirLight.position.x/z = ... mouseX/Y ...` | Move mouse, observe light shift |
| Shadows enabled and visible | `renderer.shadowMap.enabled = true`, `castShadow` properties | Visual confirmation on ground plane |
| 60fps on mid-range hardware | Performance profiler frame time <16.67ms | DevTools Performance panel |
| <100 lines in main.js | Final line count | `wc -l src/main.js` |

## Human Modifications

Pending human review.