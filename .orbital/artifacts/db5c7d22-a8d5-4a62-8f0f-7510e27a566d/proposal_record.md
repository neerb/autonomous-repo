# Proposal Record: Subtle Interaction + Scene Polish

## Interpreted Intent

This orbit enhances the existing Three.js demo scene with three layers of polish that transform it from a static technical showcase into an expressive, interactive experience. The enhancements add life through differentiated motion (cube rotates on X/Y axes, diamond rotates on Y/Z axes, sphere orbits the origin), environmental awareness through mouse-reactive lighting (DirectionalLight position responds to cursor movement), and spatial grounding through soft shadow rendering (all three objects cast shadows onto a dark ground plane). The implementation must remain within the 100-line constraint of `src/main.js`, avoid adding dependencies, preserve existing OrbitControls functionality, and maintain the dark aesthetic (background 0x1a1a2e, ground plane 0x0a0a0a). The outcome is a polished demonstration piece that feels tactile and responsive while maintaining vanilla JavaScript simplicity and 60fps performance on modern browsers.

## Implementation Plan

### Phase 1: Shadow System Configuration

**File:** `src/main.js`

**Modifications to Renderer Initialization:**
Add shadow map configuration immediately after renderer creation, before any geometry setup:
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

**Modifications to DirectionalLight:**
Enable shadow casting on the existing DirectionalLight and configure shadow camera frustum:
```javascript
directionalLight.castShadow = true;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
```

**Modifications to Existing Meshes:**
Enable shadow casting on cube, diamond, and sphere objects immediately after their creation:
```javascript
cube.castShadow = true;
diamond.castShadow = true;
sphere.castShadow = true;
```

**Ground Plane Creation:**
Add a new PlaneGeometry mesh positioned below the scene to receive shadows:
```javascript
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x0a0a0a })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
ground.receiveShadow = true;
scene.add(ground);
```

**Line Budget Impact:** +8 lines (renderer config: 2, light config: 5, ground plane: 6, mesh shadows: 3, compacted to ~8 via multi-statement lines)

### Phase 2: Motion Differentiation

**File:** `src/main.js`

**Diamond Rotation:**
Add rotation update in the animation loop on Y and Z axes to contrast with cube's X/Y rotation:
```javascript
diamond.rotation.y += 0.005;
diamond.rotation.z += 0.005;
```

**Sphere Orbital Motion:**
Add circular orbital path calculation using time-based trigonometry in the animation loop:
```javascript
const t = Date.now() * 0.0001;
sphere.position.set(Math.cos(t) * 4, 0, Math.sin(t) * 4);
```

**Line Budget Impact:** +3 lines (diamond: 2, sphere: 2, combined with time variable: 3)

### Phase 3: Mouse Interaction System

**File:** `src/main.js`

**Mouse Position Tracking:**
Add module-scope variables to store normalized mouse coordinates and attach mousemove listener:
```javascript
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
```

**Light Response in Animation Loop:**
Apply smoothed light position updates based on mouse coordinates:
```javascript
directionalLight.position.x += (mouseX * 5 - directionalLight.position.x) * 0.05;
directionalLight.position.y += (mouseY * 5 + 3 - directionalLight.position.y) * 0.05;
```

**Line Budget Impact:** +5 lines (variables: 1, listener: 4, light update: 2, compacted to 5)

### File Structure

**Modified Files:**
- `src/main.js` — All implementation changes occur in this single file

**Unchanged Files:**
- `index.html` — No modifications required
- `src/style.css` — No modifications required
- `package.json` — No modifications required

### Dependencies

**Existing Imports (No Changes):**
- `three` — Core library
- `three/addons/controls/OrbitControls.js` — Camera controls

**No New Dependencies Required**

### Implementation Order

1. **Shadow Configuration** — Modify renderer and light setup in initialization section
2. **Ground Plane Addition** — Insert ground plane geometry creation after existing mesh setup
3. **Mesh Shadow Properties** — Add `castShadow = true` to cube, diamond, sphere after their creation
4. **Mouse Tracking** — Add mouse position variables and event listener at module scope
5. **Animation Loop Updates** — Add diamond rotation, sphere orbital motion, and light response inside animate function
6. **Line Count Verification** — Compress whitespace and optimize syntax to achieve ≤100 lines

### Code Structure Assumptions

Based on standard Three.js patterns and project requirements, the current `src/main.js` structure is assumed to be:

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
// [shadow config additions here]

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// [shadow config additions here]

const cube = new THREE.Mesh(/* ... */);
const diamond = new THREE.Mesh(/* ... */);
const sphere = new THREE.Mesh(/* ... */);
// [shadow property additions here]
// [ground plane addition here]

const controls = new OrbitControls(camera, renderer.domElement);

// [mouse tracking additions here]

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  // [motion and light updates here]
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => { /* ... */ });

animate();
```

### Line Budget Reconciliation

**Estimated Current State (Orbit 2):** ~70-75 lines
**Additions for This Orbit:** ~16 lines of new functionality
**Optimization Required:** Compress to achieve ≤100 total lines

**Compression Strategies:**
- Remove blank lines between related statements
- Use comma operators for variable declarations: `let mouseX=0,mouseY=0;`
- Combine property assignments: `ground.rotation.x=-Math.PI/2,ground.position.y=-2,ground.receiveShadow=true;`
- Inline single-use constants
- Remove all comments

**Target:** 85-95 lines after compression

## Risk Surface

### Risk 1: Line Count Budget Violation

**Severity:** High  
**Probability:** Medium

**Scenario:** Adding 16 lines of new code to an unknown baseline could exceed 100-line limit if Orbit 2 consumed more than 84 lines.

**Mitigation:**
- Pre-execution audit: Read current `src/main.js` to establish exact line count before implementation
- Aggressive whitespace removal and syntax compression
- Multi-statement lines using comma operators where semantically safe
- If budget is exceeded after implementation, remove ground plane (least critical feature) to recover 6 lines

**Validation:** Line count check in verification protocol must be hard gate

### Risk 2: Shadow Rendering Artifacts

**Severity:** Medium  
**Probability:** Medium

**Scenario:** Shadow acne (surface self-shadowing), peter-panning (shadows disconnected from objects), or harsh shadow edges degrade visual quality.

**Mitigation:**
- `PCFSoftShadowMap` provides automatic shadow softening without additional code
- Ground plane positioned at y=-2 creates 2-unit clearance from objects at y=0, preventing z-fighting
- DirectionalLight shadow camera configured with ±10 unit frustum provides adequate coverage for scene scale
- If artifacts appear, add `directionalLight.shadow.bias = -0.001` (cost: 1 line)

**Validation:** Visual inspection during human review checkpoint (Tier 2 supervision)

### Risk 3: Mouse Interaction Conflicts with OrbitControls

**Severity:** Medium  
**Probability:** Low

**Scenario:** Mouse tracking interferes with OrbitControls drag detection, causing camera control issues or visual stuttering during interaction.

**Mitigation:**
- Mouse position stored in module variables, not directly applied to light
- Light updates occur in animation loop using lerp factor (0.05), providing smooth interpolation
- No `preventDefault()` or `stopPropagation()` on mousemove events
- OrbitControls processes mouse events independently through its own internal handlers

**Validation:** Test camera rotation during mouse movement in verification protocol

### Risk 4: Sphere Orbital Motion Frame Rate Dependency

**Severity:** Low  
**Probability:** Low

**Scenario:** Using frame-based time (`Date.now()`) for orbital motion could create inconsistent speed across different refresh rates or during frame drops.

**Mitigation:**
- `Date.now() * 0.0001` uses wall-clock time, not frame count, ensuring consistent orbital period regardless of frame rate
- Multiplier of 0.0001 produces orbit period of ~63 seconds (2π / 0.0001 seconds), fitting 15-30 second target with adjusted constant
- Adjust multiplier to 0.0002 for ~31 second orbit or 0.00025 for ~25 second orbit if needed

**Validation:** Time one full sphere orbit during manual testing

### Risk 5: Ground Plane Visibility

**Severity:** Low  
**Probability:** Medium

**Scenario:** Dark ground plane (0x0a0a0a) against dark background (0x1a1a2e) may be nearly invisible, reducing shadow visibility.

**Mitigation:**
- Shadows cast onto ground plane create contrast even with low-contrast materials
- AmbientLight (0.4 intensity) provides base illumination that makes shadows visible
- Ground plane positioned at y=-2 creates spatial separation from background
- If visibility is insufficient, lighten ground plane to 0x1a1a1a (cost: 0 lines, config change only)

**Validation:** Shadow visibility check in verification protocol

### Risk 6: Diamond Geometry Assumptions

**Severity:** Medium  
**Probability:** High

**Scenario:** Implementation assumes diamond object exists and is accessible by variable name `diamond`, but actual implementation may use different naming or structure.

**Mitigation:**
- Standard Three.js pattern suggests lowercase descriptive names are likely
- If variable name differs, search codebase for geometry creation patterns (e.g., `OctahedronGeometry`, `ConeGeometry`)
- Proposal explicitly states assumption; human review (Tier 2) will catch naming mismatches before execution
- Fallback: If diamond variable doesn't exist, apply rotation to any second mesh object in scene

**Validation:** Variable name verification during code review phase

### Risk 7: Light Position Overflow

**Severity:** Low  
**Probability:** Very Low

**Scenario:** Continuous mouse-driven light position updates accumulate numerical error over time, causing position values to become extreme or invalid.

**Mitigation:**
- Lerp formula `current + (target - current) * 0.05` is numerically stable and self-correcting
- Mouse coordinates normalized to ±1 range, multiplied by 5 for light position, produces bounded output (±5 range)
- Light Y position formula includes `+ 3` offset to keep light above scene even at mouseY=-1
- No accumulation occurs; each frame recalculates from current mouse position

**Validation:** Extended runtime test (5+ minutes of continuous mouse movement)

## Scope Estimate

### Complexity Assessment

**Overall Complexity:** Low to Medium

**Technical Complexity Factors:**
- Shadow system configuration: Low (standard Three.js API, well-documented)
- Orbital motion mathematics: Low (basic trigonometry, single-line implementation)
- Mouse interaction: Medium (coordinate normalization, smooth interpolation, potential OrbitControls interaction)
- Line budget constraint: Medium (requires careful code organization and compression)

**Integration Complexity:** Low (single-file modification, no dependency changes, no architectural refactoring)

### Orbit Breakdown

**This Implementation:** Single Orbit (Orbit 3)

All features are implemented atomically in one modification session to `src/main.js`. The enhancements are interdependent (e.g., shadows require ground plane, light interaction enhances shadow visibility) and low-risk enough to bundle.

**No Additional Orbits Required**

### Work Phases

| Phase | Description | Estimated Duration | Verification |
|-------|-------------|-------------------|--------------|
| **Code Audit** | Read current `src/main.js`, establish line count baseline, identify variable names | 5 minutes | Line count documented, object names confirmed |
| **Shadow Implementation** | Add renderer config, light config, mesh properties, ground plane | 10 minutes | Scene renders with visible shadows |
| **Motion Implementation** | Add diamond rotation, sphere orbital motion in animation loop | 5 minutes | All three objects have distinct motion |
| **Interaction Implementation** | Add mouse tracking variables, event listener, light response | 10 minutes | Light responds to mouse movement |
| **Compression** | Remove whitespace, compress syntax to achieve ≤100 lines | 10 minutes | Line count ≤100, code remains functional |
| **Manual Testing** | Visual inspection, OrbitControls check, shadow quality assessment | 10 minutes | All acceptance criteria met |
| **Total** | — | **50 minutes** | Ready for human review |

### Risk-Adjusted Estimate

**Best Case:** 45 minutes (current codebase is well-structured, no syntax issues, first implementation meets all criteria)

**Expected Case:** 60 minutes (minor adjustments needed for shadow bias or line count compression)

**Worst Case:** 90 minutes (shadow artifacts require iteration, OrbitControls conflict needs debugging, or aggressive refactoring required to meet line budget)

### Success Criteria

Implementation is complete when:
1. `src/main.js` contains ≤100 lines
2. Scene renders at 60fps with soft shadows visible on ground plane
3. Cube rotates on X/Y, diamond rotates on Y/Z, sphere orbits at radius ~4 units
4. Mouse movement smoothly adjusts DirectionalLight position
5. OrbitControls remain fully functional
6. No console errors during runtime
7. Window resize continues to work correctly

## Human Modifications

Pending human review.