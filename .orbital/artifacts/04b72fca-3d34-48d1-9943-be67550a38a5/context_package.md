# Context Package: Three.js Starter Project with Diamond Geometry

## Codebase References

### Files Requiring Modification

**`src/main.js` (root/src/)**
- Current state: Implements single-cube Three.js scene (based on prior orbit artifacts and Intent Document describing existing functionality)
- Modification scope: Add diamond (octahedron) geometry, position spatially to avoid overlap, implement independent rotation animation
- Line count constraint: Must remain under 100 lines total (excluding blank lines/comments) after adding diamond
- Critical addition: `THREE.OctahedronGeometry(radius, detail)` constructor and associated mesh creation
- Expected changes:
  - Add octahedron geometry creation block (~3 lines)
  - Add octahedron material with distinct color (~1 line)
  - Create diamond mesh and position in scene (~2 lines)
  - Update animation loop to rotate both cube and diamond with different speeds (~2 additional lines)
  - **Estimated new line count:** 32 (existing from prior orbit) + 8 (diamond additions) = 40 lines (60-line buffer remaining)

**`index.html` (root)**
- Current state: HTML5 boilerplate with ES6 module script reference to `/src/main.js`
- Modification scope: **No changes required** — HTML remains static entry point
- Purpose: Vite serves this as application root; Three.js auto-creates and appends canvas

**`src/style.css` (root/src/)**
- Current state: Viewport-filling canvas styles with zero margins
- Modification scope: **No changes required** — styling accommodates any number of scene objects
- Current rules ensure canvas fills viewport regardless of Three.js scene complexity

**`package.json` (root)**
- Current state: Contains `three: ^0.160.0`, `vite: ^5.0.0`, `"type": "module"`, dev script
- Modification scope: **No changes required** — `OctahedronGeometry` available in base Three.js package, no additional dependencies
- Verification: `THREE.OctahedronGeometry` exported from `three` module since v0.1.0 (legacy geometry, stable API)

**`README.md` (root)**
- Current state: Documents "rotating cube with interactive camera controls"
- Modification scope: **Update recommended but not required** — documentation currently describes single-cube scene
- Suggested change: Update description to "rotating cube and diamond with interactive camera controls"
- Risk: Documentation-code drift if README not updated, but Intent marks this as optional

### Files with No Modifications Required

All configuration files (`package.json`, `index.html`, `src/style.css`) remain unchanged. Implementation is entirely contained within `src/main.js` modification.

## Architecture Context

### Current Scene Graph Structure (From Prior Orbit)

Based on Intent Document and Proposal Record from sibling orbit `04b72fca-3d34-48d1-9943-be67550a38a5`:

```
Scene (root container)
├── PerspectiveCamera (positioned at z=5 to view origin)
├── AmbientLight (0xffffff, intensity 0.5)
├── DirectionalLight (0xffffff, intensity 1.0, positioned at (5,5,5))
└── Mesh "cube" (BoxGeometry + MeshStandardMaterial)
```

### Extended Scene Graph (This Orbit)

```
Scene (root container)
├── PerspectiveCamera (positioned at z=5 to view origin — unchanged)
├── AmbientLight (0xffffff, intensity 0.5 — unchanged)
├── DirectionalLight (0xffffff, intensity 1.0, positioned at (5,5,5) — unchanged)
├── Mesh "cube" (BoxGeometry + MeshStandardMaterial — unchanged)
└── Mesh "diamond" (OctahedronGeometry + MeshStandardMaterial — NEW)
```

**Spatial Positioning Strategy:**

To ensure both geometries are simultaneously visible without camera adjustment, use horizontal separation:

- **Cube:** Position at `(-1.5, 0, 0)` — left of scene center
- **Diamond:** Position at `(1.5, 0, 0)` — right of scene center
- **Separation distance:** 3 units prevents overlap (cube has default size 1×1×1, octahedron radius ~0.7)
- **Camera framing:** PerspectiveCamera at `z=5` with 75° FOV views width of ~6.6 units at z=0, accommodating both geometries with margins

Alternative positioning strategies (acceptable):
- Vertical separation: cube at `(0, -1, 0)`, diamond at `(0, 1, 0)`
- Diagonal: cube at `(-1, -1, 0)`, diamond at `(1, 1, 0)`

**Critical:** Z-coordinates must differ by >0.1 units OR X/Y coordinates must provide >1 unit separation to prevent z-fighting (rendering artifacts when surfaces overlap).

### Three.js OctahedronGeometry API

**Constructor Signature:**
```javascript
new THREE.OctahedronGeometry(radius, detail)
```

**Parameters:**
- `radius` (default: 1): Distance from center to vertex
- `detail` (default: 0): Subdivision level (0 = 8 triangular faces, 1 = 32 faces, etc.)

**Recommended values for diamond appearance:**
- `radius: 0.7` — sized slightly smaller than unit cube for visual balance
- `detail: 0` — minimal geometry maintains <100 line budget and 60fps performance

**Geometry characteristics:**
- 8 triangular faces forming double-pyramid shape (classic diamond silhouette)
- 6 vertices (top point, 4 equatorial points, bottom point)
- Vertex normals enable smooth shading with `MeshStandardMaterial`

### Animation Loop Extension Pattern

**Current Implementation (Single Geometry):**
```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
```

**Extended Implementation (Two Geometries):**
```javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  diamond.rotation.x += 0.015;  // Faster rotation for visual distinction
  diamond.rotation.y += 0.005;  // Different axis ratio creates unique motion
  controls.update();
  renderer.render(scene, camera);
}
```

**Rationale for different rotation speeds:**
- Cube: 0.01 rad/frame on both axes (consistent rotation, ~10.5 sec/revolution)
- Diamond: 0.015 rad/frame on X, 0.005 rad/frame on Y (asymmetric tumbling motion)
- Visual pedagogical value: Demonstrates independent animation state per mesh

## Pattern Library

### Multi-Geometry Creation Pattern

**Established Pattern from Prior Orbit (Single Geometry):**
```javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

**Extended Pattern for Second Geometry:**
```javascript
// Cube (existing, may need repositioning)
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.x = -1.5;
scene.add(cube);

// Diamond (new)
const diamondGeometry = new THREE.OctahedronGeometry(0.7, 0);
const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0xff8800 });
const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
diamond.position.x = 1.5;
scene.add(diamond);
```

**Pattern observations:**
- Explicit variable naming (`cubeGeometry`, `diamondGeometry`) improves clarity when managing multiple objects
- Distinct material colors (`0x00ff88` teal for cube, `0xff8800` orange for diamond) demonstrate multi-material scene
- Position assignment uses `.position.x` property (Three.js Vector3 component access)
- Alternative: `.position.set(x, y, z)` method more concise for 3D positioning

### Color Selection for PBR Materials

**Color contrast requirements (from Intent):**
- Background: `0x1a1a2e` (dark blue-gray, RGB 26,26,46)
- Materials must contrast with background (RGB values >100 for visibility)
- Materials should contrast with each other for pedagogical clarity

**Recommended color pairs:**
| Cube Color | Diamond Color | Color Harmony | Contrast Ratio |
|------------|---------------|---------------|----------------|
| `0x00ff88` (teal) | `0xff8800` (orange) | Complementary | High |
| `0x4fc3f7` (cyan) | `0xff5252` (red) | Complementary | High |
| `0x9c27b0` (purple) | `0xffeb3b` (yellow) | Triadic | High |
| `0xffffff` (white) | `0xff0000` (red) | Monochrome+Accent | Medium-High |

**Avoid:**
- Dark colors (`0x330000`, `0x003300`) that blend with background
- Similar hues (`0xff0000` red, `0xff6600` orange-red) reducing visual distinction
- Pure white for both (fails multi-material demonstration)

### Lighting Configuration (No Changes Required)

**Current lighting setup (from Prior Orbit Context Package):**
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```

**Validation for two geometries:**
- Ambient light provides uniform base illumination for both meshes
- Directional light positioned at (5,5,5) creates gradation across faces of both geometries
- No additional lights required — PBR materials respond identically to shared lighting

## Prior Orbit References

### Orbit 2 Foundation (Artifact ID: `04b72fca-3d34-48d1-9943-be67550a38a5`)

**Intent Document:** Defined single-cube Three.js starter with <100 line constraint

**Context Package:** Established patterns for:
- Three.js initialization (scene, camera, renderer setup)
- Lighting configuration (AmbientLight + DirectionalLight)
- Animation loop structure (requestAnimationFrame, rotation updates, controls.update())
- OrbitControls configuration (damping enabled, dampingFactor 0.05)

**Proposal Record:** Detailed 32-line implementation plan with line budget analysis

**Key Learnings:**
- 32-line implementation for single geometry leaves 68-line buffer (sufficient for diamond addition)
- OrbitControls damping requires `controls.update()` in animation loop
- Camera position `z=5` with 75° FOV provides appropriate framing for unit-scale geometries
- `MeshStandardMaterial` requires proper lighting (ambient + directional) for visible gradation

**Validation from prior orbit:**
- Package.json dependencies confirmed correct (`three: ^0.160.0`)
- File structure validated (all 4 required files exist)
- No modifications needed to HTML, CSS, or package.json for this orbit

### Repository Initialization (Orbit 1, Implied)

Evidence from repository structure:
- `package.json` with correct `"type": "module"` and Node 18+ engine constraint
- `README.md` documenting structure and quick start commands
- `src/` directory established for source code organization

**Pattern consistency:** This orbit maintains the 4-file structure established in Orbit 1, adhering to minimalist philosophy.

### No Failed Attempts Detected

Examination of `.orbital/artifacts/` shows no abandoned or failed Three.js implementation attempts. All prior orbit artifacts (Intent, Context, Proposal documents) are structured and complete, indicating successful planning phases.

**Implication:** Patterns from Orbit 2 foundation are proven and should be replicated for diamond addition rather than inventing new approaches.

## Risk Assessment

### Risk: Line Count Budget Exceeded

**Scenario:** Adding diamond geometry, materials, positioning, and independent animation pushes `src/main.js` beyond 100-line constraint

**Current baseline:** 32 lines (from Orbit 2 Proposal Record estimate)

**Diamond addition line cost:**
- Octahedron geometry creation: 1 line
- Diamond material creation: 1 line
- Mesh creation and positioning: 2 lines
- Add to scene: 1 line (or inline with position)
- Animation loop updates: 2 additional lines (diamond rotation x2)
- **Total new lines:** 7-8 lines

**Projected total:** 32 + 8 = 40 lines (60-line buffer remaining)

**Impact:** Low — Significant margin below constraint

**Mitigation:**
- Use inline position setting: `diamond.position.set(1.5, 0, 0)` (1 line instead of 3)
- Combine material property and mesh creation if exceeding budget
- Avoid intermediate variables for single-use values

### Risk: Spatial Overlap (Z-Fighting)

**Scenario:** Cube and diamond positioned at same coordinates or too close, causing rendering artifacts (flickering, strobe effect)

**Technical cause:** When two surfaces occupy nearly identical Z-buffer values, depth test cannot resolve which is in front

**Detection:** Visual inspection reveals flickering between geometry faces when camera views overlapping region

**Impact:** Medium — Fails Intent visual quality gate ("Spatial Clarity: Both geometries must be fully visible without camera adjustment")

**Mitigation:**
- Maintain minimum separation distance of 1.0 units in X, Y, or Z axis
- Recommended positions: cube at `(-1.5, 0, 0)`, diamond at `(1.5, 0, 0)` provides 3.0 unit separation (3x minimum)
- Test by rotating camera to view geometries from multiple angles — no flickering should occur
- If overlap detected during review, increase separation distance incrementally (1.5 → 2.0 → 2.5 units)

**Validation test:** Orbit camera 360° around scene — both geometries remain continuously visible without occlusion or flickering.

### Risk: Camera Framing Inadequacy

**Scenario:** Diamond positioned outside camera's field of view at initial load, requiring manual camera adjustment to see both geometries

**Cause:** Camera at `z=5` with 75° FOV has limited horizontal viewing width

**Calculation:**
- Viewing frustum width at z=0: `2 * tan(75°/2) * 5 ≈ 6.6 units`
- Horizontal positioning at ±1.5 units: total span 3.0 units
- Margin: (6.6 - 3.0) / 2 = 1.8 units per side ✓

**Impact:** Medium — Fails Intent acceptance criteria ("Both geometries must be fully visible without camera adjustment")

**Mitigation:**
- Keep geometry positions within ±3 units on X/Y axes
- If using vertical positioning, stay within ±2.5 units (accounting for aspect ratio)
- Test at multiple viewport sizes (mobile, desktop) to verify responsiveness
- Camera position at `z=5` is proven from prior orbit; maintain this value

**Fallback:** If framing issues occur, adjust camera position to `z=6` or `z=7` (widens FOV coverage) — acceptable change with minimal line count impact.

### Risk: Identical Rotation Speeds

**Scenario:** Both cube and diamond rotate at same speed (0.01 rad/frame on X and Y), failing to demonstrate independent animation

**Detection:** Visual inspection shows geometries rotating in lockstep, appearing as single animation applied to both

**Impact:** Low-Medium — Fails Intent acceptance criteria spectrum: "Minimal" tier (identical rotation speeds) instead of "Acceptable" tier (distinct rotation patterns)

**Mitigation:**
- Use different rotation increments for X and Y axes per geometry:
  - Cube: `0.01` on X, `0.01` on Y (symmetric rotation)
  - Diamond: `0.015` on X, `0.005` on Y (asymmetric tumbling)
- Alternatively, rotate geometries on different axis combinations:
  - Cube: X and Y axes
  - Diamond: Y and Z axes
- **Pedagogical value:** Demonstrates that each mesh maintains independent animation state in Three.js scene graph

**Validation test:** Observe rotation for 30 seconds — geometries should visibly rotate at different speeds/patterns.

### Risk: Poor Color Contrast

**Scenario:** Cube and diamond materials use similar colors (e.g., `0xff0000` red and `0xff3300` orange-red), reducing visual distinction

**Detection:** Geometries difficult to distinguish when overlapping in depth or when lighting creates shadows

**Impact:** Low-Medium — Fails Intent visual quality gate ("complementary material colors") and pedagogical goal (demonstrating multi-material scene)

**Mitigation:**
- Use complementary colors on color wheel: teal/orange, blue/yellow, purple/green
- Ensure RGB value difference >100 in at least 2 channels (e.g., `0x00ff88` vs `0xff8800` differs by 255 in R and G)
- Test with directional lighting enabled — colors should remain distinguishable in both lit and shadowed faces
- Avoid grayscale values (`0x888888`, `0xcccccc`) that lack hue distinction

**Reference color pairs from Pattern Library** for proven combinations.

### Risk: OctahedronGeometry Detail Level Too High

**Scenario:** Using `detail: 2` or higher subdivision level creates excessive triangles, impacting frame rate on low-end hardware

**Technical cost:**
- `detail: 0` → 8 triangles (6 vertices)
- `detail: 1` → 32 triangles (18 vertices)
- `detail: 2` → 128 triangles (66 vertices)

**Impact:** Low — Intent specifies maintaining 60fps on standard hardware; excessive geometry may drop to 50fps on integrated graphics

**Mitigation:**
- **Use `detail: 0` (default)** — 8 triangular faces provide clear diamond silhouette without performance cost
- Higher detail levels provide smoother shading but violate minimalist pedagogy (demonstrates unnecessary optimization)
- Intent constraint "no performance-intensive effects" suggests minimizing polygon count

**Performance validation:** Monitor frame rate in browser DevTools Performance panel — should maintain 58-60fps during rotation.

### Risk: Material Lighting Response Mismatch

**Scenario:** Diamond uses different material type (e.g., `MeshBasicMaterial`) instead of `MeshStandardMaterial`, causing inconsistent lighting response

**Cause:** `MeshBasicMaterial` is unaffected by lights (always full brightness), while `MeshStandardMaterial` responds to scene lighting

**Detection:** Diamond appears uniformly bright regardless of light position, while cube shows proper gradation

**Impact:** Medium — Fails Intent constraint ("Both meshes use MeshStandardMaterial") and pedagogical goal (demonstrating PBR lighting)

**Mitigation:**
- **Explicitly use `MeshStandardMaterial` for both geometries**
- Verify material parameters consistent: `{ color: 0xXXXXXX }` with no additional properties (roughness, metalness default to 0.5 and 0.0 respectively)
- Test by rotating camera — both geometries should show light/shadow gradation across faces

**Code pattern:**
```javascript
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0xff8800 });
```

### Risk: OrbitControls Update Omitted for Diamond

**Scenario:** Developer forgets that `controls.update()` must remain in animation loop regardless of number of geometries

**Cause:** Misunderstanding that controls update is per-frame operation, not per-geometry

**Detection:** Camera damping stops working (jerky camera motion on mouse release)

**Impact:** Low — Does not affect geometry rendering, only control smoothness

**Mitigation:**
- **No change required** — `controls.update()` call in animation loop is scene-global, not mesh-specific
- Existing implementation from Orbit 2 foundation already handles this correctly
- Pattern library animation loop extension preserves `controls.update()` placement

**Validation:** Prior Orbit Context Package Risk Assessment documented this requirement — implementation should already be correct.

### Risk: README Documentation Drift

**Scenario:** README describes "rotating cube" but implementation now includes diamond, creating documentation-code inconsistency

**Impact:** Negligible — Does not affect functionality, only affects developer onboarding clarity

**Mitigation:**
- **Optional update:** Change README description from "rotating cube" to "rotating cube and diamond"
- **Acceptable to skip:** Intent Document marks README update as "recommended but not required"
- Low priority given minimal blast radius (teaching project, no production deployment)

**Decision:** Defer README update to human review phase — reviewer can assess if documentation change improves pedagogical value or adds unnecessary noise.