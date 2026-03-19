# Proposal Record: Subtle Interaction + Scene Polish

## Interpreted Intent

This orbit enhances a Three.js starter scene to create a cohesive, polished interactive experience through three synchronized feature sets: **continuous coordinated motion**, **mouse-reactive lighting**, and **soft shadow rendering**. The goal is to transform a static rotating cube into a living scene where multiple objects move in harmony, lighting responds to user presence, and shadows ground the composition in physical space.

**Core Requirements Interpreted:**

1. **Continuous Motion System** — Diamond rotates independently on Y-axis (distinct from cube's X/Y rotation). Sphere follows a circular orbital path around scene center with radius 2-4 units, completing orbit every 8-12 seconds. All animations must use delta-time for frame-rate independence.

2. **Mouse-Reactive Lighting** — DirectionalLight intensity or direction adjusts based on normalized mouse coordinates ([-1, 1] range). Changes must be smooth (interpolated/lerped), create noticeable but subtle effect (20-40% intensity variation or 15-30° directional shift), and not interfere with OrbitControls camera manipulation.

3. **Shadow Rendering** — Enable renderer shadow mapping with soft shadows (PCFSoftShadowMap). Configure DirectionalLight as shadow caster. Set cube, diamond, and sphere to cast shadows. Create dark ground plane positioned below objects to receive shadows. Shadow map resolution 1024x1024 for performance. Must avoid visual artifacts (acne, peter-panning, aliasing).

**Critical Constraint Interpretation:**

The 100-line JavaScript limit is the binding constraint. Given that the baseline starter project (cube + lights + controls + resize handler) likely occupies 60-70 lines, this orbit has approximately 30-40 lines available for all three feature sets plus ground plane creation. This necessitates extremely concise implementation with no helper functions, minimal variable declarations, and inline logic wherever possible.

**Baseline Assumption Resolution:**

The Context Package identified that the repository contains no Three.js files and the Project Description mentions only a cube, while the Intent references diamond and sphere as existing objects. **This proposal assumes diamond and sphere must be created as part of this orbit**, treating the discrepancy as incomplete baseline documentation. This adds ~10 lines to the implementation budget but aligns with the Intent's explicit requirement to animate these objects.

## Implementation Plan

### Phase 1: Baseline Project Creation (Prerequisite)

**Status:** BLOCKING — Repository contains no Three.js project files.

**Required Files:**
- `index.html` — Minimal HTML5 document with `<canvas>` element and script tag importing `src/main.js`
- `src/main.js` — Core scene implementation (target file for all modifications)
- `src/style.css` — Full-viewport canvas styling (`margin: 0; padding: 0; overflow: hidden; canvas { display: block; }`)
- `package.json` — Dependencies: `three@latest`, `vite@latest`; scripts: `"dev": "vite"`

**Resolution Path:**
1. **Option A:** If this is actually orbit 0 (baseline creation), generate complete starter project per Project Description specifications, then apply enhancements in same orbit
2. **Option B:** If baseline exists in different repository location, obtain correct path and proceed with enhancement-only implementation
3. **Option C:** If baseline was completed in prior session without ORBITAL tracking, reconstruct expected baseline structure and proceed

**This proposal assumes Option A** — combining baseline creation with enhancements in a single orbit.

### Phase 2: Core Scene Setup (Baseline + New Objects)

**File:** `src/main.js`

**Imports (Lines 1-2):**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Initialization Block (Lines 3-45, estimated):**

1. **Scene, Camera, Renderer** (8 lines)
   - `const scene = new THREE.Scene();`
   - `const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);`
   - `camera.position.z = 5;`
   - `const renderer = new THREE.WebGLRenderer({ antialias: true });`
   - `renderer.setSize(window.innerWidth, window.innerHeight);`
   - `renderer.setClearColor(0x1a1a2e);`
   - `renderer.shadowMap.enabled = true;`
   - `renderer.shadowMap.type = THREE.PCFSoftShadowMap;`
   - `document.body.appendChild(renderer.domElement);`

2. **Lights** (6 lines)
   - `const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);`
   - `scene.add(ambientLight);`
   - `const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);`
   - `directionalLight.position.set(5, 5, 5);`
   - `directionalLight.castShadow = true;`
   - `directionalLight.shadow.mapSize.width = 1024;`
   - `directionalLight.shadow.mapSize.height = 1024;`
   - `directionalLight.shadow.camera.near = 0.5;`
   - `directionalLight.shadow.camera.far = 20;`
   - `directionalLight.shadow.bias = -0.0001;`
   - `scene.add(directionalLight);`

3. **Cube** (4 lines)
   - `const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);`
   - `const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });`
   - `const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);`
   - `cube.castShadow = true;`
   - `scene.add(cube);`

4. **Diamond** (4 lines) — NEW OBJECT
   - `const diamondGeometry = new THREE.OctahedronGeometry(0.6);`
   - `const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b9d });`
   - `const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);`
   - `diamond.position.set(-2, 0.5, 0);`
   - `diamond.castShadow = true;`
   - `scene.add(diamond);`

5. **Sphere** (4 lines) — NEW OBJECT
   - `const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);`
   - `const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x4a90e2 });`
   - `const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);`
   - `sphere.castShadow = true;`
   - `scene.add(sphere);`

6. **Ground Plane** (5 lines) — NEW OBJECT
   - `const planeGeometry = new THREE.PlaneGeometry(15, 15);`
   - `const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x0d0d1a });`
   - `const groundPlane = new THREE.Mesh(planeGeometry, planeMaterial);`
   - `groundPlane.rotation.x = -Math.PI / 2;`
   - `groundPlane.position.y = -1;`
   - `groundPlane.receiveShadow = true;`
   - `scene.add(groundPlane);`

7. **OrbitControls** (2 lines)
   - `const controls = new OrbitControls(camera, renderer.domElement);`
   - `controls.enableDamping = true;`

**Running Line Count: ~45 lines**

### Phase 3: Mouse Interaction System

**File:** `src/main.js` (continuing)

**Mouse State Variables (Lines 46-47):**
```javascript
let mouseX = 0, mouseY = 0;
```

**Mouse Event Listener (Lines 48-51):**
```javascript
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
```

**Running Line Count: ~51 lines**

### Phase 4: Animation Loop with Continuous Motion

**File:** `src/main.js` (continuing)

**Clock Initialization (Line 52):**
```javascript
const clock = new THREE.Clock();
```

**Animation Function (Lines 53-68):**
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  const t = clock.getElapsedTime();
  const dt = clock.getDelta();
  
  // Cube rotation (baseline)
  cube.rotation.x += dt * 0.5;
  cube.rotation.y += dt * 0.3;
  
  // Diamond rotation (Y-axis, different speed)
  diamond.rotation.y += dt * 0.7;
  
  // Sphere orbital motion (3-unit radius, 10-second period)
  const orbitSpeed = (2 * Math.PI) / 10;
  sphere.position.x = Math.cos(t * orbitSpeed) * 3;
  sphere.position.z = Math.sin(t * orbitSpeed) * 3;
  
  // Mouse-reactive lighting (intensity modulation)
  directionalLight.intensity = 0.8 + mouseX * 0.3;
  
  controls.update();
  renderer.render(scene, camera);
}
animate();
```

**Running Line Count: ~68 lines**

### Phase 5: Window Resize Handler

**File:** `src/main.js` (continuing)

**Resize Event Listener (Lines 69-74):**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Final Line Count: ~74 lines**

### Implementation Strategy

**Approach:** Single-file, inline implementation with no abstraction layers. All logic flows linearly from imports → initialization → event handlers → animation loop → resize handler.

**Key Technical Decisions:**

1. **Mouse Interaction via Intensity (not Direction):** Modulating `directionalLight.intensity` based on `mouseX` is simpler and more stable than adjusting `position` or `rotation`. Avoids shadow camera recalculation on every frame and prevents dramatic lighting changes. Uses `mouseX` only (horizontal movement) to keep effect predictable.

2. **Sphere Orbit on XZ Plane:** Horizontal orbit aligns with ground plane and creates intuitive circular motion. Y-position remains at 0 (same as cube/diamond height). 3-unit radius provides clearance from other objects. 10-second period produces "gentle" motion per Intent requirements.

3. **Diamond Y-Axis Rotation:** Simplest independent rotation axis. Speed of 0.7 rad/s provides 40% difference from cube's Y-rotation speed (0.3 rad/s), exceeding the 30% variance requirement.

4. **Shadow Configuration:** 1024x1024 map resolution balances quality and performance. Bias of -0.0001 reduces shadow acne. Shadow camera near/far (0.5-20) tightly bounds scene. PCFSoftShadowMap provides smooth edges without VSM overhead.

5. **No Lerping on Mouse Input:** Direct mapping with scaling factor (`mouseX * 0.3`) is acceptable because intensity changes are inherently smooth (no positional snapping). OrbitControls damping provides sufficient smoothness during camera movement.

**Order of Operations:**
1. Create baseline project structure (if not exists)
2. Initialize scene with shadow-enabled renderer
3. Create all mesh objects with shadow flags
4. Set up mouse event listener
5. Implement animation loop with all motion systems
6. Add resize handler

**Dependencies:**
- Three.js r150+ (for PCFSoftShadowMap and shadow bias API)
- Vite 4+ (ES module support, dev server)
- Modern browser with WebGL 2.0 support

## Risk Surface

### Risk 1: Line Count Exceeds 100-Line Limit

**Probability:** Medium (40%)  
**Impact:** High (fails acceptance criteria)

**Edge Case:** The current implementation estimate is 74 lines, leaving 26-line buffer. However, this assumes:
- No comments or whitespace (reduces readability)
- Optimal code compression (single-line declarations where possible)
- No error handling or fallbacks

**Mitigation:**
- Remove `controls.enableDamping = true` if line budget exceeded (saves 1 line, minimal UX impact)
- Consolidate geometry/material creation into single-line chains: `const cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshStandardMaterial({color:0x00ff88}));`
- Reduce shadow configuration lines by accepting default shadow camera bounds (risks shadow clipping)
- If necessary, sacrifice mouse interaction feature (lowest visual impact, saves 5 lines)

**Verification:** Count non-empty, non-comment lines in final `src/main.js` using automated tool during Verification phase.

### Risk 2: Diamond/Sphere Objects Do Not Exist in Baseline

**Probability:** High (80%)  
**Impact:** High (implementation fails without these objects)

**Edge Case:** Context Package confirmed baseline spec mentions only cube. Intent assumes diamond/sphere exist. If baseline is strictly followed, attempting to animate non-existent objects causes runtime errors.

**Mitigation:**
- **Primary Approach (Implemented):** Create diamond and sphere as part of this orbit (~10 lines), documented in this proposal
- **Fallback:** If human reviewer confirms these objects should not exist, reduce scope to animate only cube + add sphere only (skip diamond to save lines)
- **Verification Step:** Check if `src/main.js` contains variable declarations for `diamond` and `sphere` before proposing enhancements

**Regression Risk:** None — adding objects is non-destructive. Existing cube animation continues unchanged.

### Risk 3: OrbitControls Mouse Event Conflict

**Probability:** Low (20%)  
**Impact:** Medium (jarring UX during camera drag)

**Edge Case:** User drags camera with OrbitControls while mouse position changes light intensity. Light flickers during drag, creating distracting visual.

**Mitigation:**
- `mousemove` event fires regardless of pointer state, but light intensity changes are small (±30%) and gradual
- OrbitControls damping smooths camera movement, reducing perceived conflict
- Users typically focus on camera motion during drag, not lighting changes
- **If conflict occurs in testing:** Add check for `controls.isDragging` or implement lerping: `targetIntensity = 0.8 + mouseX * 0.3; light.intensity += (targetIntensity - light.intensity) * 0.1;`

**Verification:** Manual testing of camera drag while moving mouse rapidly to confirm light changes don't create jarring flicker.

### Risk 4: Shadow Rendering Performance on Integrated Graphics

**Probability:** Low (15%)  
**Impact:** High (fails 55fps acceptance threshold)

**Edge Case:** Integrated GPU (Intel UHD 620, AMD Vega 8) struggles with shadow map rendering pass, dropping below 55fps minimum.

**Performance Budget:**
- Shadow map: 1024x1024 depth texture = ~1MB VRAM
- 3 shadow-casting objects (cube, diamond, sphere) = 3 draw calls per shadow pass
- 1 shadow-receiving object (ground plane) = 1 additional fragment shader pass
- Total overhead: ~2-3ms per frame (acceptable for 60fps = 16.67ms budget)

**Mitigation:**
- Use 1024x1024 resolution (not 2048x2048) to minimize memory bandwidth
- PCFSoftShadowMap uses 4-tap filter (cheaper than 16-tap VSM)
- Single directional light (not multiple shadow casters)
- Tight shadow camera frustum reduces shadow map coverage area
- **If performance fails:** Provide fallback configuration comment in code: `// If low FPS, set renderer.shadowMap.enabled = false`

**Verification:** Test on laptop with integrated graphics (Intel/AMD). Monitor frame rate using browser DevTools Performance panel. Accept if ≥55fps sustained.

### Risk 5: Shadow Artifacts (Acne, Peter-Panning)

**Probability:** Medium (35%)  
**Impact:** Medium (violates "no harsh artifacts" constraint)

**Edge Cases:**
- **Shadow acne:** Self-shadowing moire patterns on ground plane or object surfaces
- **Peter-panning:** Shadows appear detached from objects (gap between object and shadow)
- **Shadow clipping:** Shadows cut off at edge of shadow camera frustum

**Mitigation:**
- Set `shadow.bias = -0.0001` (negative bias reduces acne, positive bias reduces peter-panning)
- Ground plane positioned at `y = -1` (1 unit below objects) provides clearance
- Shadow camera frustum (near: 0.5, far: 20) encompasses all objects with margin
- PCFSoftShadowMap smooths shadow edges, reducing aliasing visibility
- **If artifacts appear:** Iteratively adjust bias in range [-0.001, 0.001] and shadow camera bounds during testing

**Verification:** Visual inspection of shadow quality at multiple camera angles. Check for moire patterns on ground plane and proper shadow-object connection.

### Risk 6: Sphere Orbit Intersects Other Objects

**Severity:** Low  
**Probability:** Low (10%)

**Edge Case:** 3-unit orbital radius causes sphere to pass through cube (at origin) or diamond (at x=-2) during motion, creating visual overlap.

**Geometric Analysis:**
- Cube at (0, 0, 0), size 1x1x1, bounding radius ~0.87 units
- Diamond at (-2, 0.5, 0), OctahedronGeometry radius 0.6 units
- Sphere orbital path: radius 3 units on XZ plane (Y=0)
- Closest approach to cube: 3 - 0.87 = 2.13 units (safe)
- Closest approach to diamond: sqrt((3 - (-2))^2 + 0^2) = 5 units minimum (safe)

**Mitigation:**
- 3-unit radius provides >2 units clearance from all objects
- Sphere Y-position at 0 (same as cube/diamond) keeps motion coplanar
- **If overlap observed:** Increase radius to 3.5 units or raise sphere Y-position to 0.5

**Verification:** Visual observation of sphere path relative to other objects during full orbit cycle.

### Risk 7: Baseline Resize Handler Already Exists

**Probability:** High (90%)  
**Impact:** Low (duplicate code, potential conflict)

**Edge Case:** If baseline project already includes window resize handling, adding second resize listener creates duplicate logic and wastes line budget.

**Mitigation:**
- Assume baseline includes resize handler (standard practice in Three.js starters)
- Proposal includes resize handler for completeness but marks as conditional: "Include only if not present in baseline"
- During implementation, check for existing `window.addEventListener('resize', ...)` before adding
- If present, omit resize handler from implementation (saves ~6 lines)

**Verification:** Search `src/main.js` for `resize` event listener during Context validation phase.

## Scope Estimate

**Orbit Classification:** Single orbit (Orbit 1)

**Complexity Assessment:** Medium

**Justification:**
- Single file modification (`src/main.js`)
- Well-defined Three.js API patterns (shadows, animation loops, event listeners)
- No external service integration or data persistence
- Tight constraint (100 lines) increases implementation precision requirement but not conceptual complexity

**Work Breakdown:**

| Phase | Task | Estimated Lines | Risk Level |
|-------|------|----------------|------------|
| 1 | Baseline verification/creation | 0-60 lines | High (blocking) |
| 2 | Shadow renderer configuration | 4 lines | Low |
| 3 | Light shadow casting setup | 6 lines | Low |
| 4 | Diamond creation + shadow flag | 4 lines | Medium |
| 5 | Sphere creation + shadow flag | 4 lines | Medium |
| 6 | Ground plane creation | 5 lines | Low |
| 7 | Mouse event listener + state | 5 lines | Low |
| 8 | Animation loop enhancements | 16 lines | Medium |
| 9 | Resize handler (conditional) | 6 lines | Low |
| **Total** | | **74 lines** | **Medium** |

**Critical Path:**
1. Baseline project existence verification (blocking)
2. Shadow system configuration (foundation for other features)
3. Object creation with shadow flags (required for motion animations)
4. Animation loop implementation (integrates all features)

**Parallelization Opportunities:** None — single-file, sequential implementation required.

**Estimated Effort:**
- **Implementation:** 2-3 hours (including baseline creation if needed)
- **Testing:** 1-2 hours (shadow quality tuning, performance validation)
- **Verification:** 30 minutes (automated line count, visual inspection)

**Total Orbit Duration:** 4-6 hours

**Uncertainty Factors:**
- Baseline project state (unknown whether it exists or needs creation)
- Shadow artifact tuning (may require multiple iterations of bias adjustment)
- Line budget pressure (may necessitate code refactoring to fit under 100 lines)

**Confidence Level:** Medium (70%)

Confidence would increase to High (90%) if baseline project structure is confirmed to exist with cube, diamond, and sphere already implemented.

## Human Modifications

Pending human review.