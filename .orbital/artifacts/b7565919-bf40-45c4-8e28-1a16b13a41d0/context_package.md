# Context Package: Add Diamond Geometry to Three.js Starter Scene

## Codebase References

### Files to Modify

**`src/main.js` (root/src/)**
- **Current state:** Contains working Three.js scene with rotating cube from Orbit 2
- **Expected structure from Orbit 2:**
  - Module-level imports: `THREE` from 'three', `OrbitControls` from examples
  - Module-level variables: `scene`, `camera`, `renderer`, `cube`, `controls`
  - `init()` function: Scene setup, camera config, renderer setup, cube creation, lighting, controls
  - `animate()` function: Animation loop with cube rotation updates
  - `onWindowResize()` function: Handles viewport resize
  - Event listener attachment and initialization calls
- **Required changes:** Add diamond geometry creation in `init()`, add diamond position offset, add diamond rotation in `animate()`
- **Line budget:** Currently ~87 lines (from Orbit 2 Proposal); must stay under 100 lines after diamond addition

### Files NOT to Modify

**`index.html` (root)**
- HTML5 boilerplate loading `src/main.js` as ES module and `src/style.css`
- No changes needed — diamond addition is purely JavaScript code

**`src/style.css` (root/src/)**
- Full-viewport canvas CSS rules
- No changes needed — canvas behavior unchanged by adding geometry

**`package.json` (root)**
- Already contains `three@^0.160.0` and `vite@^5.0.0`
- No changes needed — `OctahedronGeometry` is part of Three.js core, no new dependencies

**`.orbital/artifacts/**`
- ORBITAL system metadata — do not reference or modify

**`README.md` (root)**
- Placeholder text "Testing purposes"
- Out of scope for this orbit

### Three.js API References

**`THREE.OctahedronGeometry`**
- Constructor signature: `new THREE.OctahedronGeometry(radius, detail)`
- Default radius: 1 (if omitted, creates unit octahedron)
- Default detail: 0 (basic octahedron with 8 triangular faces)
- Available in Three.js r160 core — no special import needed beyond `import * as THREE from 'three'`
- Geometry type: `BufferGeometry` compatible with `THREE.Mesh`

**`THREE.Mesh` positioning**
- Property: `mesh.position.x`, `mesh.position.y`, `mesh.position.z`
- Default position: `(0, 0, 0)` (scene origin)
- Typical pattern for horizontal separation: `cube.position.x = -1.5; diamond.position.x = 1.5;`

**`scene.add()` method**
- Accepts any `Object3D` instance (including `Mesh`)
- Multiple meshes can be added to same scene — all share lighting and camera
- Order of addition does not affect rendering order (determined by depth buffer)

## Architecture Context

### Scene Graph Structure (Existing from Orbit 2)

```
Scene (root)
├── PerspectiveCamera (position z=5, looking at origin)
├── AmbientLight (intensity 0.5, provides base illumination)
├── DirectionalLight (intensity 0.8, position (5,5,5), creates contrast)
└── Mesh (cube)
    ├── BoxGeometry (1×1×1)
    └── MeshStandardMaterial (color 0x00ff00, green)
```

### Scene Graph Structure (After Diamond Addition)

```
Scene (root)
├── PerspectiveCamera (position z=5, looking at origin)
├── AmbientLight (intensity 0.5, provides base illumination)
├── DirectionalLight (intensity 0.8, position (5,5,5), creates contrast)
├── Mesh (cube)
│   ├── BoxGeometry (1×1×1)
│   └── MeshStandardMaterial (color 0x00ff00, green)
└── Mesh (diamond)
    ├── OctahedronGeometry (radius 1)
    └── MeshStandardMaterial (color TBD — can share cube material or use new color)
```

### Camera Framing Considerations

**Current Camera Setup:**
- FOV: 75 degrees (wide-angle perspective)
- Position: `z = 5` units from origin
- Looking at: `(0, 0, 0)` (scene origin via OrbitControls default target)
- Aspect ratio: `window.innerWidth / window.innerHeight`

**Framing Both Shapes:**
- With cube at origin `(0, 0, 0)`, camera at `z = 5` frames single unit cube comfortably
- Adding diamond requires offset positioning: cube at `x = -1.5`, diamond at `x = 1.5` (3 units total width)
- At FOV 75 and distance 5, horizontal view frustum width ≈ 7.5 units at z=0 plane
- Both shapes at ±1.5 x-offset fit within frame with margin for rotation

**Alternative Positioning Strategy:**
- Keep cube at origin `(0, 0, 0)`, place diamond at `x = 2.5` (right side only)
- Requires camera to reframe or slightly pull back to `z = 6` to fit both shapes
- Intent specifies "next to" without mandating centered arrangement — either approach valid

### Rendering Pipeline Integration

**Animation Loop Execution:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Existing cube rotation
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // NEW: Diamond rotation (same or different speeds acceptable)
  diamond.rotation.x += 0.01;
  diamond.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}
```

**Lighting Behavior:**
- Existing `AmbientLight` and `DirectionalLight` automatically illuminate all meshes in scene
- No per-mesh lighting setup needed — diamond inherits scene lighting
- `MeshStandardMaterial` on both shapes responds to lights identically (PBR material)

### OrbitControls Interaction

**Current Behavior:**
- Controls attached to camera, targets scene origin `(0, 0, 0)`
- Mouse drag orbits camera around target point
- All meshes in scene rotate relative to camera (appears as camera orbiting entire scene)

**Behavior with Diamond Addition:**
- No controls changes needed — camera continues orbiting entire scene
- If shapes are positioned symmetrically (cube at x=-1.5, diamond at x=1.5), orbit center remains at origin
- If shapes are positioned asymmetrically (cube at origin, diamond at x=2.5), orbit center shifts — may require `controls.target.set()` adjustment

## Pattern Library

### Geometry Creation Pattern (Established in Orbit 2)

**Cube Creation (Existing):**
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

**Diamond Creation (New, Following Same Pattern):**
```javascript
const diamondGeometry = new THREE.OctahedronGeometry(1, 0);
const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff }); // Example: cyan
diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
diamond.position.x = 1.5; // Position to right of cube
scene.add(diamond);
```

**Alternative: Shared Material Pattern (Line Budget Optimization):**
```javascript
// Reuse cube material to save lines
diamond = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
diamond.position.x = 1.5;
scene.add(diamond);
```

### Variable Scoping Pattern (Established in Orbit 2)

**Module-Level Variables:**
```javascript
let scene, camera, renderer, cube, controls;
// NEW: Add diamond to module scope if modified in animate()
let scene, camera, renderer, cube, diamond, controls;
```

**Rationale:**
- Variables accessed across functions (`init()` and `animate()`) require module-level scope
- Geometry and material instances can remain function-scoped in `init()` if not accessed elsewhere
- Diamond mesh must be module-level to access in `animate()` for rotation updates

### Naming Conventions (Established)

**Mesh Variables:**
- Lowercase, descriptive names: `cube`, `diamond` (not `cubeMesh`, `diamondMesh`)
- Geometry variables: Descriptive suffix pattern: `geometry`, `diamondGeometry`
- Material variables: Descriptive suffix pattern: `material`, `diamondMaterial`

**Function Names:**
- Imperative verbs: `init()`, `animate()`, `onWindowResize()`
- No class-based methods — standalone functions only

### Positioning Pattern

**Horizontal Separation:**
```javascript
// Symmetric positioning (both equidistant from origin)
cube.position.x = -1.5;
diamond.position.x = 1.5;

// Alternative: Asymmetric positioning (cube at origin)
// cube.position.x = 0; // Default, can omit
diamond.position.x = 2.5;
```

**Vertical Alignment:**
- Keep both shapes at `y = 0` (default) — centered vertically in viewport
- No z-axis offset needed — both at `z = 0` (origin depth)

### Animation Update Pattern (Established)

**Rotation Updates:**
```javascript
// Existing cube rotation
cube.rotation.x += 0.01;
cube.rotation.y += 0.01;

// NEW: Diamond rotation (can consolidate if same speed)
diamond.rotation.x += 0.01;
diamond.rotation.y += 0.01;
```

**Line Budget Optimization:**
- If rotation speeds are identical, no need to vary — use same increment
- Could consolidate into loop if more shapes added (but premature for 2 shapes)

## Prior Orbit References

### Orbit 2: Three.js Minimal Starter Project

**Status:** Completed (assumed based on Intent dependency reference)

**Artifacts Created:**
- `.orbital/artifacts/b7565919-bf40-45c4-8e28-1a16b13a41d0/intent_document.md`
- `.orbital/artifacts/b7565919-bf40-45c4-8e28-1a16b13a41d0/context_package.md`
- `.orbital/artifacts/b7565919-bf40-45c4-8e28-1a16b13a41d0/proposal_record.md`
- `.orbital/artifacts/b7565919-bf40-45c4-8e28-1a16b13a41d0/verification_protocol.md`

**Key Implementation Details from Orbit 2:**
- Scene setup: `THREE.Scene()` instantiation
- Camera: `PerspectiveCamera(75, aspect, 0.1, 1000)` at `z = 5`
- Renderer: `WebGLRenderer({ antialias: true })` with dark background `0x1a1a2e`
- Cube: `BoxGeometry(1, 1, 1)` with `MeshStandardMaterial({ color: 0x00ff00 })`
- Lighting: `AmbientLight(0xffffff, 0.5)` + `DirectionalLight(0xffffff, 0.8)` at position `(5, 5, 5)`
- Controls: `OrbitControls(camera, renderer.domElement)`
- Animation: `requestAnimationFrame(animate)` with cube rotation `+= 0.01` on X and Y axes
- Resize handling: `onWindowResize()` updates camera aspect ratio and renderer size

**Line Count Status:**
- Target: Under 100 lines (excluding blanks and comments)
- Orbit 2 Proposal estimated: 87 lines of actual code
- Current buffer: ~13 lines available for diamond addition

**Lessons Learned:**
- Functional programming pattern successfully maintained (no classes beyond Three.js constructors)
- OrbitControls import path: `'three/examples/jsm/controls/OrbitControls.js'` (with `.js` extension)
- Compact variable declarations saved lines: `let scene, camera, renderer, cube, controls;`
- Inline geometry/material creation in `init()` avoided unnecessary module-level variables

**What Worked:**
- Single camera at `z = 5` framed unit cube effectively
- Green cube color (`0x00ff00`) provided high contrast against dark background
- Rotation speed `0.01` radians/frame produced smooth, visible motion
- Lighting setup (ambient + directional) created clear face differentiation

**Potential Issues to Avoid:**
- Adding diamond without adjusting camera framing could clip geometry
- Creating separate material for diamond adds 1 line — consider material reuse
- Adding diamond variable to module scope adds 1 word to declaration line (minimal impact)

### Earlier Orbits (Non-Relevant)

**Orbits 301f1e8d, 7e840ae3, a6b4c09a, ad0a63a2, c71c2625:**
- All appear to be ORBITAL system meta-work or testing (based on artifact presence)
- No Three.js, Vite, or graphics-related content
- No architectural patterns to inherit from these orbits

## Risk Assessment

### Technical Risks

**Risk 1: Line Count Budget Violation**

**Context:** Adding diamond geometry, positioning, and rotation to `src/main.js` pushes against 100-line constraint

**Likelihood:** Medium — Orbit 2 used ~87 lines; adding diamond requires minimum 4-6 lines:
- Module variable declaration: +1 word to existing line (`let scene, camera, renderer, cube, diamond, controls;`)
- Geometry creation: +1 line (`const diamondGeometry = new THREE.OctahedronGeometry();`)
- Material creation or reuse: +0-1 lines (0 if reusing cube material, 1 if new material)
- Mesh creation: +1 line (`diamond = new THREE.Mesh(diamondGeometry, material);`)
- Positioning: +1 line (`diamond.position.x = 1.5;`)
- Scene addition: +1 line (`scene.add(diamond);`)
- Rotation updates: +2 lines (in `animate()` function)
- **Total new lines: 6-8 lines, bringing total to 93-95 lines**

**Impact:** Low — Violates acceptance criterion but code remains functional; human review required

**Mitigation:**
- Consolidate diamond creation: `diamond = new THREE.Mesh(new THREE.OctahedronGeometry(), material);` (saves 1 line)
- Reuse cube material instead of creating separate material (saves 1 line)
- Inline positioning: `(diamond = new THREE.Mesh(...)).position.x = 1.5;` (saves 1 line, reduces readability)
- Cube positioning: If cube stays at origin, no positioning line needed for cube

**Detection:** Automated line count gate (AG-5 from Orbit 2 Verification Protocol)

---

**Risk 2: Camera Framing Insufficient for Both Shapes**

**Context:** Current camera at `z = 5` with FOV 75 frames single unit cube; adding diamond at x=1.5 offset may clip or require pan

**Likelihood:** Low — FOV 75 at distance 5 provides ~7.5 units horizontal view frustum width; shapes at ±1.5 x-offset (3 units total) fit comfortably

**Impact:** High — Violates mandatory acceptance criterion "Both shapes are visible in initial viewport without camera adjustment"

**Mitigation:**
- Symmetric positioning: `cube.position.x = -1.5; diamond.position.x = 1.5;` (3 units total width)
- Verify both shapes visible: Horizontal frustum at z=0 plane = `2 * tan(FOV/2) * distance = 2 * tan(37.5°) * 5 ≈ 7.7 units`
- Alternative: Pull camera back to `z = 6` if shapes appear too large (increases view frustum to ~9.2 units)
- Test with extreme case: If diamond uses default radius 1, largest extent at x=1.5 is x=2.5 (within 7.7-unit frustum)

**Detection:** Human visual inspection (HV-1 from Orbit 2 Verification Protocol)

---

**Risk 3: Diamond Material Color Indistinguishable from Cube**

**Context:** If diamond reuses cube material (green, `0x00ff00`), both shapes appear identical in color

**Likelihood:** Low — Intent acceptance boundary allows same color: "Diamond uses same material color as cube (both green) if color differentiation not needed for learning value"

**Impact:** Low — Acceptable per Intent, but reduces educational value of showing multiple geometries

**Mitigation:**
- Primary: Use distinct color for diamond (e.g., cyan `0x00ffff`, magenta `0xff00ff`, blue `0x0000ff`)
- Adds 1 line for separate material creation
- Trade-off: Line budget vs. visual clarity — prioritize clarity given educational context
- Human reviewer decides if color differentiation improves learning value enough to justify extra line

**Detection:** Human visual inspection (HV-1 and HV-6 from Orbit 2 Verification Protocol)

---

**Risk 4: Diamond Geometry Not Recognizable as Octahedron**

**Context:** `OctahedronGeometry` default radius 1 creates small octahedron; depending on lighting angle, may not appear diamond-shaped

**Likelihood:** Low — Existing lighting setup (ambient + directional from (5,5,5)) illuminates multiple faces; octahedron's 8 triangular faces provide geometric variety

**Impact:** Medium — Violates mandatory acceptance criterion "Diamond shape is geometrically distinct from cube (octahedron with visible triangular faces)"

**Mitigation:**
- Use default `OctahedronGeometry(1, 0)` — 8 faces provide clear contrast to cube's 6 faces
- Rotation on X and Y axes (same as cube) ensures multiple faces visible over time
- Existing DirectionalLight from (5,5,5) creates face contrast via angle of incidence
- If diamond appears too similar, increase detail: `OctahedronGeometry(1, 1)` subdivides faces (adds visual complexity)

**Detection:** Human visual inspection (HV-1 from Orbit 2 Verification Protocol)

---

**Risk 5: Shapes Overlap or Intersect in Initial View**

**Context:** If positioning calculation incorrect, shapes could overlap at origin or during rotation

**Likelihood:** Low — Explicit positioning on X axis (`cube.position.x = -1.5; diamond.position.x = 1.5;`) with 3-unit separation prevents overlap

**Impact:** High — Violates unacceptable acceptance boundary "Shapes overlap or intersect in initial view"

**Mitigation:**
- Minimum separation: Cube extends ±0.5 units from center (1×1×1 size); diamond extends ±1 unit from center (radius 1)
- At x=-1.5 and x=1.5, closest edges are at x=-1.0 (cube right face) and x=0.5 (diamond left face) — 1.5 units separation
- During rotation, shapes may appear closer due to perspective but won't physically intersect
- Visual inspection confirms gap visible throughout rotation cycle

**Detection:** Human visual inspection (HV-1 from Orbit 2 Verification Protocol)

---

**Risk 6: Performance Degradation from Second Mesh**

**Context:** Adding second mesh doubles geometry rendering workload

**Likelihood:** Low — Both geometries are simple primitives (cube 12 triangles, octahedron 8 triangles = 20 triangles total)

**Impact:** Low — Intent acceptance boundary allows frame drops on low-end hardware; modern hardware renders 20 triangles trivially

**Mitigation:**
- Both meshes use simple geometries with low polygon count
- No textures, no shadows, no post-processing — minimal rendering overhead
- MeshStandardMaterial is more expensive than MeshBasicMaterial but still performant for 2 meshes
- If performance issue detected, fallback: Use MeshBasicMaterial instead (not recommended, reduces lighting realism)

**Detection:** Human visual inspection with DevTools Performance tab (HV-2 from Orbit 2 Verification Protocol)

---

### Scope Risks

**Risk 7: Feature Creep — Adding Shadow Casting Between Shapes**

**Context:** Temptation to enable shadows to show interaction between shapes

**Likelihood:** Medium — Shadows are common Three.js demo feature; may seem like natural addition

**Impact:** Medium — Violates "Non-Goals" constraint: "Shadow casting between shapes"

**Mitigation:**
- Explicit non-goal in Intent Document — do not enable shadows
- Shadow setup requires 4+ lines: `renderer.shadowMap.enabled = true;`, `light.castShadow = true;`, `mesh.castShadow = true;`, `mesh.receiveShadow = true;`
- Violates line budget and scope constraint
- If human reviewer requests shadows, escalate to new orbit (out of current scope)

**Detection:** Code review against Intent constraints section

---

**Risk 8: Asymmetric Positioning Requires OrbitControls Target Adjustment**

**Context:** If cube stays at origin (x=0) and diamond at x=2.5, scene center shifts; orbit target may feel off-center

**Likelihood:** Low — Symmetric positioning (±1.5) is cleaner and avoids this issue

**Impact:** Low — OrbitControls default target at (0,0,0) still functional but feels asymmetric

**Mitigation:**
- Prefer symmetric positioning: `cube.position.x = -1.5; diamond.position.x = 1.5;`
- If asymmetric positioning chosen, add `controls.target.set(1.25, 0, 0);` to center orbit between shapes
- Adds 1 line to line budget
- Human reviewer decides if asymmetric positioning provides value

**Detection:** Human visual inspection of OrbitControls behavior (HV-3 from Orbit 2 Verification Protocol)

---

**Risk 9: Diamond Rotation Speed Different from Cube Creates Visual Confusion**

**Context:** Using different rotation speeds for diamond (e.g., faster or slower than cube) adds variety but may distract

**Likelihood:** Low — Intent acceptance boundary accepts same rotation speed: "Diamond uses same rotation speed as cube"

**Impact:** Low — Acceptable per Intent; different speeds are non-goal

**Mitigation:**
- Use same rotation increment: `diamond.rotation.x += 0.01; diamond.rotation.y += 0.01;` (matches cube)
- Simplest implementation; no decision-making required
- If human reviewer requests variation, can adjust in re-orbit (2 characters to change: `0.01` to `0.02`)

**Detection:** Human visual inspection (HV-2 from Orbit 2 Verification Protocol)

---

### Integration Risks

**Risk 10: Existing Orbit 2 Code Structure Unknown**

**Context:** Orbit 2 completed but actual `src/main.js` content not provided in entity context

**Likelihood:** High — Repository file listing shows `src/main.js` exists but content not shown

**Impact:** Medium — Proposal may assume incorrect code structure, causing merge conflicts or rework

**Mitigation:**
- Assume code structure matches Orbit 2 Proposal Record (87 lines, functional pattern)
- Verify actual file content before implementation (read `src/main.js` first)
- If structure differs significantly, adapt proposal to match actual code patterns
- Priority: Maintain existing patterns over introducing new patterns (consistency)

**Detection:** File inspection during implementation phase (Proposal Record "Execution Sequence" step 1)

---

**Risk 11: Cube Positioned at Origin in Orbit 2 Implementation**

**Context:** If Orbit 2 left cube at default position (0,0,0), adding symmetric positioning requires moving cube

**Likelihood:** High — Orbit 2 Proposal did not specify cube positioning (default position assumed)

**Impact:** Low — Adding `cube.position.x = -1.5;` is 1 line; fits within line budget

**Mitigation:**
- Check cube current position in `src/main.js`
- If cube at origin, add positioning line: `cube.position.x = -1.5;`
- If cube already positioned elsewhere, adjust diamond position to maintain separation
- Symmetric positioning preferred for visual balance

**Detection:** File inspection during implementation phase