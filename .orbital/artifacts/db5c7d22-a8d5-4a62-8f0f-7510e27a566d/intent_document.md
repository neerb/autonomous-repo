# Subtle Interaction + Scene Polish

## Desired Outcome

The Three.js scene transforms from a static demonstration into a living, reactive environment that responds to user presence. When a developer or stakeholder views the scene, they experience:

- **Continuous ambient motion**: The diamond rotates on a distinct axis from the cube, and the sphere orbits the center point in a slow, hypnotic path
- **Light responsiveness**: Mouse movement subtly shifts the directional light's orientation or intensity, creating a sense that the scene "notices" the viewer
- **Depth through shadows**: Soft shadows ground the geometric objects in space, with a dark ground plane catching cast shadows without disrupting the minimalist aesthetic

This enhancement proves the scene is production-ready for interactive applications while maintaining the under-100-line constraint and vanilla JavaScript architecture.

**Success looks like**: A viewer moving their mouse across the viewport sees the lighting shift gently, the sphere traces a visible orbital path over 10–15 seconds, and shadows provide spatial cues without performance degradation. The scene feels tactile and alive, not static.

## Constraints

### Technical Boundaries
- **No new dependencies**: Shadows and interaction must use Three.js built-in capabilities only
- **100-line JavaScript limit**: All logic must remain in `src/main.js` under 100 lines total
- **No frameworks or postprocessing**: Plain JavaScript only, no shader effects or postprocessing pipelines
- **Preserve existing functionality**: OrbitControls, window resize handling, and current rotation animations must remain intact

### Design Boundaries
- **Dark aesthetic preservation**: Ground plane and shadows must not introduce bright surfaces or clash with the 0x1a1a2e background
- **Subtlety requirement**: Hover interaction should be perceptible but not jarring—light shifts should feel like ambient changes, not spotlight tracking
- **Performance budget**: Shadows must not drop frame rate below 60fps on a mid-range laptop (2020+ hardware)

### Non-Goals
- Complex physics or collision detection
- Multi-object hover states or click handlers
- Advanced lighting techniques (HDRI, area lights, light probes)
- Custom geometry or texture mapping

## Acceptance Boundaries

### Motion Implementation
- **Minimum acceptable**: Diamond rotates on at least one axis different from the cube's X/Y rotation. Sphere position changes over time in a circular or elliptical path.
- **Target**: Diamond rotates on Z-axis at a slower rate than cube. Sphere completes a smooth orbital path with radius 3–5 units in 12–15 seconds.
- **Stretch**: Sphere orbit includes slight Y-axis variation (elliptical path) for additional depth.

### Hover Interaction
- **Minimum acceptable**: Mouse movement triggers a measurable change in either directional light intensity or orientation within 16ms (one frame at 60fps).
- **Target**: Directional light target position shifts smoothly based on normalized mouse coordinates, with light following cursor position with slight damping/lag for organic feel.
- **Stretch**: Light intensity also varies subtly (±10–20%) based on distance from viewport center.

### Shadow Quality
- **Minimum acceptable**: Renderer has `shadowMap.enabled = true`. Cube, diamond, and sphere have `castShadow = true`. A ground plane mesh has `receiveShadow = true` and is visible below objects.
- **Target**: Shadows are soft (PCFSoftShadowMap), ground plane is dark (e.g., 0x0a0a0f) and large enough to catch all cast shadows, shadow resolution is 1024×1024 or higher.
- **Stretch**: Shadow camera frustum is optimized to minimize artifacts, with no visible shadow map boundaries or pixelation.

### Code Quality
- **Non-negotiable**: Total JavaScript remains ≤100 lines in `src/main.js`. No external files or modules introduced.
- **Target**: Code remains readable with clear variable names and logical grouping (setup, animation loop, event handlers).

### Visual Coherence
- **Minimum acceptable**: Ground plane does not visually conflict with existing background color. Shadows are visible but not harsh.
- **Target**: Scene maintains dark, minimalist aesthetic. New elements feel intentional, not tacked-on.

## Trust Tier Assignment

**Assigned Tier**: Tier 2 (Supervised)

**Rationale**:

This orbit operates on an existing, functional codebase with strict constraints (100-line limit, vanilla JavaScript). The changes introduce:

1. **Shadow rendering**: Moderate complexity, potential for performance impact if misconfigured
2. **Mouse interaction**: Event handler logic that could interfere with OrbitControls or introduce subtle bugs
3. **Orbital motion math**: Trigonometry for sphere orbit that could miscalculate or drift

**Why not Tier 1 (Autonomous)**:
- Shadow map configuration has multiple quality/performance tradeoffs requiring judgment
- Mouse interaction must coexist with OrbitControls without conflict—risk of subtle UX bugs
- The 100-line constraint is tight, requiring careful implementation choices that AI might not optimize correctly on first attempt

**Why not Tier 3 (Gated)**:
- Blast radius is contained to a development prototype, not production infrastructure
- No data handling, authentication, or security surface area
- Rollback is trivial (git revert), and failures are immediately visible (scene breaks or looks wrong)

**Supervision needs**: Code review to verify shadow performance, test mouse interaction edge cases (viewport boundaries, OrbitControls conflicts), and confirm line count compliance.

## Dependencies

### Prior Orbits
- **Orbit 1** (2e6b889d-24a5-4428-baf6-4494433a3cae): Established the base Three.js project structure with Vite, scene setup, and OrbitControls. This orbit extends that foundation without modifying package.json or project structure.
- **Orbit 2** (feb8e410-9390-453a-b597-a92938a16631): Added diamond and sphere geometries with MeshStandardMaterial. This orbit animates those objects and adds shadows—requires those objects to exist with correct material types.

### Technical Dependencies
- **Three.js shadowMap**: Scene must use WebGLRenderer with `shadowMap.enabled = true`. DirectionalLight must have `castShadow = true` and properly configured shadow camera.
- **OrbitControls**: Existing controls must remain functional. Mouse move handlers must not interfere with control drag events (likely requires checking mouse button state or using `pointermove` instead of `mousemove`).
- **requestAnimationFrame loop**: Sphere orbit and hover effects must integrate into existing animation loop without creating competing RAF calls.

### External Systems
- None. This is a self-contained frontend demo with no API calls, database connections, or external services.

### Data Dependencies
- **Scene graph state**: Requires references to `directionalLight`, `sphere`, `diamond`, and `cube` objects created in prior orbit. Implementation must ensure these references are accessible in animation loop scope.

### Delivery Date Context
As of **March 19, 2026**, this enhancement aligns with the trajectory to build a polished Three.js demo. No external deadlines, but maintaining momentum suggests completing within the current development session.