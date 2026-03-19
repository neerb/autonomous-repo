# Add Diamond Geometry to Three.js Starter Scene

## Desired Outcome

Developers viewing the Three.js starter project see two distinct 3D shapes rotating side-by-side: the existing green cube and a new diamond (octahedron) positioned next to it. This demonstrates multiple geometry types in a single scene, showing learners how to instantiate and position different Three.js primitives. The visual variety reinforces the concept that scenes can contain multiple meshes with different geometries while sharing the same lighting and camera system.

## Constraints

**Technology Boundaries:**
- Vite + vanilla JavaScript + Three.js stack remains unchanged — no additional libraries
- No TypeScript, frameworks, or external asset loading
- Diamond geometry must use Three.js built-in `OctahedronGeometry` (procedural, no model files)
- OrbitControls behavior applies to both shapes (single camera orbits entire scene)

**Code Size Limits:**
- `src/main.js` must remain under 100 lines including comments (same constraint as before)
- Adding diamond geometry requires removing or consolidating other code to stay within budget
- Total project size (excluding node_modules) must not exceed 10KB

**Visual Requirements:**
- Diamond shape must be visibly distinct from cube (different geometry, potentially different color)
- Both shapes must be positioned "next to" each other (horizontal separation along X axis)
- Both shapes must be visible simultaneously in initial camera view (no need to pan to see second shape)
- Background color remains dark (`0x1a1a2e` or similar)
- Canvas continues to fill 100% of viewport

**Positioning Specifics:**
- "Next to the square" means positioned along the X axis with visible separation (e.g., cube at x=-1.5, diamond at x=1.5)
- Both shapes should be equidistant from scene origin to maintain visual balance
- Camera position and FOV must frame both shapes without clipping or extreme distance

**Animation Requirements:**
- Both shapes must rotate continuously (same or different rotation speeds acceptable)
- Rotation can be on X and Y axes (matching existing cube behavior) or independent axes
- Animation must run at 60fps on capable hardware (same performance requirement)

**Architecture Restrictions:**
- Continue functional programming patterns — no class-based architecture
- Module or function-level variable scoping only
- No global state management
- Diamond mesh requires module-level scope if modified in animation loop

**Non-Goals:**
- Custom diamond geometry with specific proportions — Three.js `OctahedronGeometry` defaults are acceptable
- Collision detection or physics between shapes
- Individual controls for each shape (OrbitControls affects entire camera, not per-object)
- Shadow casting between shapes
- Different materials per shape (acceptable but not required — both can use MeshStandardMaterial)

## Acceptance Boundaries

**Functional Completeness:**
- ✅ Mandatory: Running `npm install && npm run dev` shows both cube and diamond rotating
- ✅ Mandatory: Diamond shape is geometrically distinct from cube (octahedron with visible triangular faces)
- ✅ Mandatory: Both shapes are visible in initial viewport without camera adjustment
- ✅ Mandatory: Both shapes positioned horizontally adjacent with visible gap between them
- ✅ Mandatory: Mouse drag (OrbitControls) rotates camera around both shapes simultaneously
- ✅ Mandatory: Window resize maintains full-viewport canvas with both shapes visible
- ⚠️ Acceptable: Diamond uses same rotation speed as cube (0.01 radians/frame on X and Y)
- ⚠️ Acceptable: Diamond uses same material color as cube (both green) if color differentiation not needed for learning value
- ⚠️ Acceptable: Diamond positioned at default distance from origin if both shapes remain clearly visible

**Code Quality:**
- ✅ Mandatory: `src/main.js` remains under 100 lines (blank lines and comments excluded from count)
- ✅ Mandatory: Diamond geometry created with Three.js built-in `OctahedronGeometry` constructor
- ✅ Mandatory: Diamond mesh added to scene graph via `scene.add(diamondMesh)`
- ✅ Mandatory: No ESLint errors with standard ES6+ rules
- ⚠️ Acceptable: Diamond shares same material instance as cube (memory optimization) or has separate material
- ⚠️ Acceptable: Diamond rotation handled in same animation loop update block as cube

**Visual Standards:**
- ✅ Mandatory: Both shapes centered vertically in viewport on initial load
- ✅ Mandatory: Lighting illuminates both shapes (no pure silhouette on either geometry)
- ✅ Mandatory: Horizontal spacing between shapes is sufficient to distinguish them (minimum 1 unit separation)
- ✅ Mandatory: Camera FOV and position frame both shapes without requiring zoom or pan
- ⚠️ Acceptable: Diamond appears smaller or larger than cube due to geometry defaults (OctahedronGeometry radius vs BoxGeometry size)
- ⚠️ Acceptable: Diamond positioned left or right of cube (either x=-1.5 or x=1.5) as long as separation is clear
- ❌ Unacceptable: Shapes overlap or intersect in initial view
- ❌ Unacceptable: Diamond not visible in initial viewport (requires camera adjustment to see)

**Dependency Integrity:**
- ✅ Mandatory: No new npm dependencies added beyond existing `three` and `vite`
- ✅ Mandatory: `OctahedronGeometry` imported from `three` package (already available, no separate import needed)
- ✅ Mandatory: `package.json` unchanged from prior orbit state

**Project Structure:**
- ✅ Mandatory: Only `src/main.js` modified — `index.html`, `src/style.css`, `package.json` remain unchanged
- ✅ Mandatory: No additional files created beyond existing 4-file structure
- ✅ Mandatory: Diamond mesh initialization occurs in existing `init()` function

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit maintains Tier 2 classification due to consistent risk profile with the original starter project:

- **Low Architectural Risk:** Additive change only — adds second mesh to existing scene without modifying cube, camera, lights, or controls
- **Constrained Scope:** Single geometry addition with explicit positioning requirement
- **Bounded Complexity:** Three.js `OctahedronGeometry` is a standard primitive with well-known behavior
- **Line Budget Pressure:** 100-line constraint requires careful implementation to fit diamond geometry without bloating codebase

However, Tier 1 (Autonomous) remains inappropriate because:

- **Visual Verification Required:** Human must confirm "next to the square" positioning is aesthetically balanced and both shapes frame correctly in viewport
- **Positioning Subjectivity:** AI must make judgment calls on exact X-axis separation distance and whether shapes need different colors for clarity
- **Line Count Risk:** Adding geometry pushes against 100-line budget; human review ensures implementation stays within constraint without sacrificing readability

Tier 3 (Gated) remains excessive because:

- **Minimal Blast Radius:** Adding a second mesh cannot corrupt existing cube, break animation loop, or destabilize scene graph
- **Reversible Change:** Pure addition with no destructive edits to existing geometry
- **Low Stakes:** Educational starter project with no production dependencies

**Risk Elevation Factors Not Present:**
- No removal of existing functionality (cube remains unchanged)
- No changes to camera, lighting, or controls (diamond integrates into existing setup)
- No new external dependencies or API integrations

## Dependencies

**Prior Orbit Dependencies:**
- **Orbit 2 (Three.js Starter):** This orbit extends the completed starter project; diamond geometry builds on existing scene infrastructure
- Required artifacts from Orbit 2:
  - Scene graph with camera, renderer, lights already configured
  - Animation loop (`animate()` function) already rendering scene
  - OrbitControls already attached to camera
  - Module-level variables (`scene`, `camera`, `renderer`) already declared

**External Dependencies:**
- Three.js library (`^0.160.0`) — same version as Orbit 2, no upgrade required
- Vite development server (`^5.0.0`) — same version, no changes
- Node.js runtime (≥18.0.0) — same requirement
- Modern browser with WebGL 1.0 support — same requirement

**Technical Dependencies:**
- `THREE.OctahedronGeometry` constructor available in Three.js core (no examples import needed)
- Existing `scene.add()` method for adding diamond mesh to scene graph
- Existing lighting setup (AmbientLight + DirectionalLight) will illuminate diamond automatically
- Existing animation loop will render diamond without modifications to `renderer.render()` call

**Environmental Requirements:**
- Same development environment as Orbit 2 (Node 18+, npm, modern browser)
- No new filesystem permissions or network access required
- No new port allocations (Vite continues on port 5173 or assigned alternative)

**Assumed State:**
- Orbit 2 verification passed (existing cube renders correctly)
- `src/main.js` currently under 100 lines with buffer for additions
- Scene, camera, renderer, and controls fully functional from Orbit 2

**No Dependencies On:**
- External 3D models or texture files (diamond is procedural geometry)
- Physics engines or collision detection libraries
- Additional Three.js helper libraries or utilities
- User input beyond existing OrbitControls (no keyboard or touch controls for diamond)