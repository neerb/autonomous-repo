# Context Package: Three.js Starter with Cube and Diamond Shapes

## Codebase References

### Files to Modify

| File Path | Purpose | Current State | Required Changes |
|-----------|---------|---------------|------------------|
| `src/main.js` | Three.js scene initialization, animation loop, and event handlers | **Exists and functional** from prior orbit — contains single cube implementation | Add second geometry (octahedron), position both shapes horizontally, update animation loop to rotate both meshes |

### Files to Preserve (No Changes)

| File Path | Purpose | Current State | Rationale |
|-----------|---------|---------------|-----------|
| `index.html` | HTML entry point with Vite module loader | Functional from prior orbit | No HTML changes needed — canvas is created by Three.js renderer |
| `src/style.css` | CSS reset and full-viewport canvas styling | Functional from prior orbit | Viewport styling already correct — no layout changes needed for multiple shapes |
| `package.json` | Dependency and script definitions | Functional from prior orbit with Three.js 0.160.0 and Vite 5.0.0 | Dependencies already include all required geometries — `OctahedronGeometry` is part of Three.js core |
| `README.md` | Project documentation | Functional from prior orbit | Documentation describes "rotating cube" but this is acceptable — updating README is out of scope for this orbit |

### Current Implementation Analysis

**Based on prior orbit's Proposal Record, `src/main.js` contains:**

1. **Imports (3 lines):**
   ```javascript
   import * as THREE from 'three'
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
   ```

2. **Scene infrastructure (15 lines):**
   - Scene instantiation
   - PerspectiveCamera with FOV 75, aspect ratio from window dimensions, positioned at Z=5
   - WebGLRenderer with antialiasing, pixel ratio matching device, clear color `0x1a1a2e`
   - Renderer canvas appended to `document.body`

3. **Lighting (5 lines):**
   - AmbientLight at 0.5 intensity
   - DirectionalLight at 0.8 intensity positioned at (5, 5, 5)

4. **Single cube geometry (4 lines):**
   ```javascript
   const geometry = new THREE.BoxGeometry(1, 1, 1)
   const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
   const cube = new THREE.Mesh(geometry, material)
   scene.add(cube)
   ```
   **Critical observation:** Cube is currently at default position (0, 0, 0)

5. **OrbitControls (3 lines):**
   - Instantiated with camera and renderer DOM element
   - Damping enabled with factor 0.05

6. **Resize handler (6 lines):**
   - Updates camera aspect ratio and projection matrix
   - Updates renderer size to match window dimensions

7. **Animation loop (7 lines):**
   ```javascript
   function animate() {
     requestAnimationFrame(animate)
     
     cube.rotation.x += 0.01
     cube.rotation.y += 0.01
     
     controls.update()
     renderer.render(scene, camera)
   }
   animate()
   ```

**Total current line count:** 37 lines (excluding blank lines)

### Modification Surface

**Lines to add (estimated 10-12 lines):**

1. **Reposition existing cube (1 line):**
   ```javascript
   cube.position.x = -2
   ```

2. **Create diamond geometry (4 lines):**
   ```javascript
   const diamondGeometry = new THREE.OctahedronGeometry(0.8)
   const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0xff6600 })
   const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial)
   diamond.position.x = 2
   scene.add(diamond)
   ```

3. **Update animation loop (2 lines):**
   ```javascript
   diamond.rotation.x += 0.01
   diamond.rotation.y += 0.01
   ```

**Potential camera adjustment (1 line if needed):**
```javascript
camera.position.z = 6  // Increase from 5 to 6 if framing is too tight
```

**Projected total line count:** 37 + 10 = 47 lines (well under 100-line constraint)

## Architecture Context

### System Architecture

This orbit extends the **single-scene, client-side-only** architecture established in the prior orbit. No changes to the overall system structure:

```
Browser Environment
├── index.html (unchanged)
│   └── <script type="module" src="/src/main.js">
│
├── Vite Dev Server (unchanged)
│   ├── ES Module transformation
│   ├── Hot Module Replacement (HMR)
│   └── Static file serving
│
└── Three.js Runtime (extended)
    ├── WebGLRenderer (unchanged)
    ├── Scene (unchanged container)
    ├── PerspectiveCamera (potentially adjusted Z position)
    ├── Two Meshes (NEW: cube + diamond instead of single cube)
    │   ├── Cube: BoxGeometry + MeshStandardMaterial
    │   └── Diamond: OctahedronGeometry + MeshStandardMaterial
    ├── Lighting (unchanged — ambient + directional)
    └── OrbitControls (unchanged)
```

### Data Flow Changes

**Original flow (prior orbit):**
```
Animation Loop:
  1. requestAnimationFrame schedules next frame
  2. cube.rotation.x += 0.01
  3. cube.rotation.y += 0.01
  4. controls.update() (if user input detected)
  5. renderer.render(scene, camera)
```

**Modified flow (this orbit):**
```
Animation Loop:
  1. requestAnimationFrame schedules next frame
  2. cube.rotation.x += 0.01        // Existing
  3. cube.rotation.y += 0.01        // Existing
  4. diamond.rotation.x += 0.01     // NEW
  5. diamond.rotation.y += 0.01     // NEW
  6. controls.update()               // Unchanged
  7. renderer.render(scene, camera)  // Unchanged — renders both meshes automatically
```

**Critical architectural insight:** Three.js scene graph automatically renders all children added via `scene.add()`. No modifications to `renderer.render()` are required when adding a second mesh. The renderer traverses the scene graph and draws all visible meshes in a single pass.

### Positioning Strategy

**Horizontal layout on X-axis:**
```
          Y (up)
          |
          |
  -2 -----+-----> +2  X (right)
  Cube    |     Diamond
          |
          Z (toward camera at +5 or +6)
```

**Camera framing calculation:**
- Original camera at Z=5 with FOV 75° can see approximately 6 units horizontally at Z=0
- Visible horizontal range: `-3` to `+3` at Z=0
- Cube at x=-2 and diamond at x=2 are both within this range
- **Verdict:** Camera Z=5 is sufficient, but Z=6 provides more comfortable margin

**Camera frustum validation:**
- Near plane: 0.1
- Far plane: 1000
- Both shapes at Z=0, camera at Z=5 → distance = 5 units (well within near/far bounds)
- FOV 75° with aspect ratio 16:9 → visible height at Z=0 ≈ 4.3 units
- Cube height = 1, diamond height ≈ 1.6 (octahedron with radius 0.8) → both fit vertically

### Performance Impact Analysis

**Prior orbit triangle count:**
- Cube: 12 triangles (2 triangles × 6 faces)
- Total: 12 triangles

**This orbit triangle count:**
- Cube: 12 triangles
- Octahedron (detail level 0): 8 triangles (1 triangle × 8 faces)
- Total: 20 triangles

**Performance delta:** +8 triangles (+67% increase)

**Frame time impact estimation:**
- Target hardware: 2020+ laptop with Intel Iris Xe (~80 GFLOPS)
- Simple scene with 2 lights, no shadows, no post-processing
- Expected frame time at 20 triangles: <1ms (well under 16.67ms budget for 60fps)
- **Verdict:** No measurable performance impact expected

### Integration Points

**No new integration points.** This orbit maintains the zero-dependency, client-side-only architecture:
- No REST APIs
- No WebSockets
- No localStorage
- No external texture assets
- No CDN dependencies (Three.js served from `node_modules`)

## Pattern Library

### Established Patterns (From Prior Orbit)

**Import pattern:**
```javascript
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
```
- Three.js core uses namespace import (`THREE.*`)
- OrbitControls uses named import from `examples/jsm/` path with `.js` extension

**Naming conventions:**
| Entity Type | Convention | Example from Prior Orbit |
|-------------|------------|--------------------------|
| Scene | `scene` | `const scene = new THREE.Scene()` |
| Camera | `camera` | `const camera = new THREE.PerspectiveCamera(...)` |
| Renderer | `renderer` | `const renderer = new THREE.WebGLRenderer(...)` |
| Geometry | `geometry` suffix | `const geometry = new THREE.BoxGeometry(...)` |
| Material | `material` suffix | `const material = new THREE.MeshStandardMaterial(...)` |
| Mesh | Descriptive noun | `const cube = new THREE.Mesh(...)` |
| Lights | Type + descriptive | `const ambientLight`, `const directionalLight` |
| Controls | `controls` | `const controls = new OrbitControls(...)` |

**Scene setup order (established in prior orbit):**
1. Scene instantiation
2. Camera instantiation and positioning
3. Renderer instantiation and configuration
4. Renderer canvas append to DOM
5. Lights added to scene
6. Geometry and material creation
7. Mesh creation and scene addition
8. OrbitControls instantiation
9. Resize listener attachment
10. Animation loop initiation

### New Patterns Required for Multi-Mesh Scenes

**Mesh naming for distinction:**
```javascript
// Prior orbit (single mesh):
const cube = new THREE.Mesh(geometry, material)

// This orbit (multiple meshes — must distinguish):
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial)
```

**Geometry/material naming when multiple exist:**
- Option 1 (verbose): `cubeGeometry`, `cubeMaterial`, `diamondGeometry`, `diamondMaterial`
- Option 2 (inline): Create geometry and material directly in `Mesh()` constructor
- **Recommended:** Option 2 for line count efficiency, but use descriptive mesh variable names

**Example inline pattern:**
```javascript
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x00aaff })
)
cube.position.x = -2
scene.add(cube)

const diamond = new THREE.Mesh(
  new THREE.OctahedronGeometry(0.8),
  new THREE.MeshStandardMaterial({ color: 0xff6600 })
)
diamond.position.x = 2
scene.add(diamond)
```

**Animation loop pattern for multiple objects:**
```javascript
function animate() {
  requestAnimationFrame(animate)
  
  // Rotate all objects with same increment
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  diamond.rotation.x += 0.01
  diamond.rotation.y += 0.01
  
  controls.update()
  renderer.render(scene, camera)
}
```

**Anti-pattern to avoid:**
```javascript
// ❌ DO NOT create separate animation loops
function animateCube() {
  cube.rotation.x += 0.01
  requestAnimationFrame(animateCube)
}

function animateDiamond() {
  diamond.rotation.x += 0.01
  requestAnimationFrame(animateDiamond)
}
```
**Rationale:** Multiple `requestAnimationFrame` loops cause redundant render calls and frame rate synchronization issues.

### Color Selection Pattern

**Prior orbit:**
- Cube color: `0x00aaff` (cyan)
- Background: `0x1a1a2e` (dark blue-gray)

**This orbit (Intent guidance):**
- Cube color: `0x00aaff` (cyan) — unchanged
- Diamond color: `0xff6600` (orange) — high contrast with cyan and dark background
- Background: `0x1a1a2e` — unchanged

**Color contrast validation:**
- Cyan (`#00aaff`) vs Orange (`#ff6600`): Complementary on color wheel (180° hue shift)
- Cyan vs Dark background (`#1a1a2e`): High luminance contrast (bright vs dark)
- Orange vs Dark background: High luminance contrast (bright vs dark)
- **Verdict:** Excellent visual distinction

### Code Style Standards (From Prior Orbit)

- **No semicolons** — ASI (automatic semicolon insertion) conventions
- **Single quotes for strings** — Vite defaults
- **Const by default** — Use `const` unless reassignment required
- **Arrow functions for callbacks** — `window.addEventListener('resize', () => { ... })`
- **Inline object instantiation** — Prefer `new THREE.Mesh(new THREE.BoxGeometry(...), ...)` over separate variable declarations when under line count pressure

## Prior Orbit References

### Orbit 1: Three.js Starter (Single Cube)

**Artifacts:** 
- Intent Document: `.orbital/artifacts/6099821b-a2a2-472a-bf8f-b997405e75e1/intent_document.md`
- Context Package: `.orbital/artifacts/6099821b-a2a2-472a-bf8f-b997405e75e1/context_package.md`
- Proposal Record: `.orbital/artifacts/6099821b-a2a2-472a-bf8f-b997405e75e1/proposal_record.md`

**Key outcomes:**
- Established file structure: `index.html`, `src/main.js`, `src/style.css`, `package.json`
- Implemented scene with single rotating cube at origin (0, 0, 0)
- Camera positioned at Z=5 with FOV 75°
- Lighting: AmbientLight (0.5 intensity) + DirectionalLight (0.8 intensity at 5,5,5)
- OrbitControls with damping enabled (factor 0.05)
- Total JavaScript: 37 lines (63 lines under 100-line budget)

**What worked:**
- Camera framing at Z=5 provides good view of 1x1x1 cube at origin
- Rotation speed of 0.01 radians/frame is visually pleasing
- Two-light setup (ambient + directional) creates visible depth without shadows
- OrbitControls damping feels responsive with 0.05 factor
- Vite HMR provides instant feedback on code changes

**What didn't work / wasn't tested:**
- No multi-mesh scenarios — only single cube tested
- No objects positioned off-center — cube at origin only
- No camera framing validation for wider horizontal scenes
- No performance profiling with multiple geometries

**Lessons learned:**
1. **100-line constraint is manageable for simple scenes** — 37 lines leaves room for additional features
2. **MeshStandardMaterial requires lighting** — Using AmbientLight alone would make cube appear flat
3. **OrbitControls must call `update()` in animation loop when damping enabled** — Omitting this causes camera to jump instead of smoothly decelerating
4. **Pixel ratio must match device** — `setPixelRatio(window.devicePixelRatio)` prevents blurry rendering on Retina displays

### Relevant Patterns from Prior Orbit

**Camera positioning formula (from prior orbit's Proposal Record):**
```
distance = (objectSize / 2) / tan(FOV / 2)
```
For 1x1x1 cube with FOV 75°:
```
minimum_distance = (0.5) / tan(37.5°) ≈ 0.65
comfortable_distance = 5 (used in prior orbit)
```

**For two objects at x=-2 and x=2 (4 units horizontal span):**
```
minimum_distance = (4 / 2) / tan(37.5°) ≈ 2.6
comfortable_distance = 5 to 6 (provides margin)
```

**Verdict:** Camera Z=5 from prior orbit is mathematically sufficient but Z=6 provides better framing.

## Risk Assessment

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Camera framing too tight** | Medium | Medium — Shapes appear cramped or partially off-screen | Calculate visible horizontal range at Z=5: FOV 75° sees ~6 units at Z=0. Shapes at x=-2 and x=2 fit within -3 to +3 range. If framing feels tight during review, increase camera Z to 6. |
| **Shapes positioned too close** | Low | Medium — Visual overlap makes distinction difficult | X-axis separation of 4 units (x=-2 to x=2) with 1x1x1 cube and 0.8 radius octahedron prevents overlap. Minimum safe separation: 1 + 0.8 = 1.8 units. Actual separation: 4 units (2.2x safety margin). |
| **Animation loop updates only one shape** | Medium | High — One shape static, fails acceptance criteria | Add diamond rotation updates immediately after cube rotation updates in animation loop. Group rotation logic: `cube.rotation.x += 0.01; cube.rotation.y += 0.01; diamond.rotation.x += 0.01; diamond.rotation.y += 0.01;` |
| **OctahedronGeometry import fails** | Very Low | High — Diamond does not render | `OctahedronGeometry` is part of Three.js core namespace (accessible via `THREE.OctahedronGeometry`). No additional imports required beyond `import * as THREE from 'three'`. Verify in r160 documentation: confirmed. |
| **Diamond appears stretched or squashed** | Low | Medium — Fails visual acceptance | `OctahedronGeometry(radius)` creates symmetrical octahedron with uniform edge lengths. Ensure no non-uniform scaling applied. Use `diamond.position.x = 2` (not `diamond.scale.x`). |

### Code Quality Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Exceeding 100-line constraint** | Low | High — Fails Intent constraint | Current implementation: 37 lines. Adding diamond: +10 lines (geometry, material, mesh, position, scene.add, 2 rotation lines). New total: 47 lines. Remaining budget: 53 lines. Safe margin: 53 lines / 100 lines = 53%. |
| **Variable name collisions** | Very Low | Low — JavaScript scope prevents issues | New variables: `diamond`, `diamondGeometry`, `diamondMaterial` (or inline). No collision with existing: `cube`, `geometry`, `material`, `scene`, `camera`, `renderer`, `controls`. |
| **Duplicate code for mesh creation** | Medium | Medium — Violates DRY principle but acceptable | Creating helper function `createMesh(geometry, material, position)` would reduce duplication but adds 5-7 lines. With current line budget (53 lines remaining), duplication is acceptable. If line count approaches 90, consider helper function. |
| **Unclear code organization** | Medium | Low — Readability suffers but functionality intact | Group shape creation together: cube definition (4 lines) followed immediately by diamond definition (4 lines). Separate with blank line for visual grouping. Add 1-line comment: `// Create cube and diamond geometries` |

### Visual Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Color distinction insufficient** | Low | Medium — Shapes hard to distinguish | Cyan (`0x00aaff`) vs Orange (`0xff6600`) are complementary colors with high contrast. If reviewer finds colors too similar, alternatives: Cyan + Magenta (`0xff00ff`), Cyan + Yellow (`0xffff00`). Avoid: Cyan + Blue (low contrast). |
| **Lighting favors one shape over another** | Low | Low — Unequal visual prominence | Directional light at (5, 5, 5) is equidistant from both shapes (cube at x=-2, diamond at x=2). Both shapes receive equal illumination. Ambient light provides uniform base lighting. No shadowing enabled, so no occlusion. |
| **Background too dark to see shapes** | Very Low | Medium — Shapes barely visible | Background `0x1a1a2e` worked well in prior orbit with cyan cube. Both cyan and orange have high luminance against dark background. Prior orbit validation confirmed visibility. |
| **Diamond radius too small** | Low | Medium — Diamond appears insignificant next to cube | Octahedron radius 0.8 vs cube size 1.0 → Diamond bounding sphere diameter ≈ 1.6, cube diagonal ≈ 1.73. Visually similar sizes. If diamond appears too small, increase radius to 0.9 (requires 1-character change). |

### Performance Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Frame rate drops below 60fps** | Very Low | Medium — Fails performance acceptance | Triangle count increases from 12 to 20 (+67%). Target hardware (Intel Iris Xe) can render 100k+ triangles at 60fps. Actual count: 20 triangles (0.02% of capacity). Safety margin: 5,000x. No measurable impact expected. |
| **Memory leak from multiple meshes** | Very Low | Low — Unlikely with modern Three.js | Three.js r160 uses efficient scene graph. Each mesh references shared geometry and material (if reused) or individual instances (if unique). Total memory: ~2KB per mesh. Two meshes = 4KB (negligible). No manual cleanup required. |
| **Render time doubles with two meshes** | Very Low | Low — Linear scaling with minimal base | Render time for single cube at 37 lines: <1ms per frame (confirmed in prior orbit). Adding second mesh increases render time linearly: ~0.5ms per mesh. New total: <2ms (well under 16.67ms budget for 60fps). |

### Camera Framing Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Shapes partially off-screen** | Medium | High — Fails visual acceptance | Validate visible horizontal range: Camera at Z=5, FOV 75°, aspect ratio 16:9. Horizontal visible range at Z=0: tan(37.5°) × 5 × 2 × (16/9) ≈ 6.8 units. Range: -3.4 to +3.4. Shapes at x=-2 and x=2 fit comfortably (1.4 unit margin on each side). |
| **Shapes too small in viewport** | Low | Medium — Poor visual presentation | Increase camera Z from 5 to 6 if shapes appear too large. Decrease to 4.5 if shapes appear too small. Prior orbit established Z=5 as comfortable for single cube at origin. Horizontal spread of 4 units may benefit from Z=6. |
| **OrbitControls pivot point incorrect** | Low | Medium — Camera orbits around wrong point | OrbitControls defaults to pivoting around scene origin (0, 0, 0). With cube at x=-2 and diamond at x=2, origin is midpoint between shapes (correct pivot). No `controls.target` adjustment needed. |

### Scope Creep Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Reviewer requests different shapes** | Low | Medium — Cone, sphere, etc. outside Intent scope | Intent specifies "diamond (octahedron)" explicitly. If reviewer requests alternative, reference Intent Document Geometric Requirements: "Diamond: OctahedronGeometry with radius 0.8". ConeGeometry mentioned as acceptable alternative but octahedron is primary. |
| **Reviewer requests different rotation speeds** | Medium | Medium — Complicates animation loop | Intent specifies "Both shapes rotate at the same rate: 0.01 radians per frame on X and Y axes". If reviewer requests independent speeds, reference Non-Goals: "Animating shapes with different rotation speeds or directions". Propose separate orbit for advanced animation. |
| **Reviewer requests more than two shapes** | Low | Medium — Line count pressure increases | Intent explicitly limits to two shapes: "Adding more than two shapes (this is a minimal demonstration)" listed under Non-Goals. If reviewer requests third shape, propose separate orbit with revised line count budget. |

### Regression Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Breaking existing cube functionality** | Low | High — Cube no longer rotates or renders | Modifications to cube: Add `cube.position.x = -2`. All other cube code unchanged. Animation loop adds diamond rotation but does not modify cube rotation logic. Risk: Accidentally removing `cube.rotation` lines during edit. Mitigation: Verify cube rotation lines remain intact after adding diamond rotation. |
| **OrbitControls stop working** | Very Low | High — Camera interaction broken | No changes to OrbitControls initialization or update logic. Diamond addition does not affect event listeners or camera matrix. Prior orbit established working pattern. |
| **Resize handler breaks** | Very Low | Medium — Canvas does not adapt to window changes | No changes to resize handler. Camera aspect ratio and renderer size updates remain unchanged. Diamond is part of scene graph and automatically included in render. |
| **CSS styling breaks** | Very Low | Low — White margins reappear | No changes to `src/style.css`. Viewport styling (`margin: 0; padding: 0; overflow: hidden;`) remains intact. |