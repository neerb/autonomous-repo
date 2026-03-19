# Subtle Interaction + Scene Polish

## Desired Outcome

When this orbit completes, the Three.js scene will feel tactile and responsive to user presence. The scene will exhibit continuous, organic motion across all three objects (cube, diamond, sphere), respond subtly to mouse movement through dynamic lighting, and display soft shadows that ground the objects in a shared space. Users opening the page will perceive a cohesive, living scene rather than a static demonstration, without performance degradation or visual clutter.

**Date Context:** As of March 19, 2026, this enhancement aligns with modern web graphics expectations where lightweight interactivity is standard for portfolio and demonstration projects.

**User Impact:**
- Portfolio viewers spend more time engaging with the scene due to responsive feedback
- The scene communicates technical sophistication through smooth animation and shadows
- Mouse interaction provides immediate visual feedback, creating a sense of direct manipulation

## Constraints

**Technical Boundaries:**
- No additional npm dependencies beyond existing `three` and `vite`
- No postprocessing effects or shader modifications
- All logic remains in `src/main.js`
- Total JavaScript must not exceed 100 lines
- Preserve existing OrbitControls and window resize handling
- Maintain dark background aesthetic (0x1a1a2e)

**Performance Requirements:**
- Must maintain 60fps on mid-range devices (2020+ hardware)
- Shadow rendering must not exceed 5ms per frame
- Mouse interaction must have imperceptible latency (<16ms response time)

**Architectural Limits:**
- No refactoring of existing scene setup pattern
- Existing objects (cube, diamond, sphere) must retain their current materials and geometries
- The ground plane must be visually subordinate — not a focal element

**Non-Goals:**
- No audio or sound effects
- No additional 3D objects beyond the ground plane
- No UI overlays or text elements
- No touch gesture support beyond what OrbitControls provides

## Acceptance Boundaries

### Motion & Animation
**Required:**
- Diamond rotates on Y-axis (different from cube's X+Y rotation)
- Sphere orbits center point in a circular path (radius: 2-3 units, period: 5-8 seconds)
- All animations run continuously without stuttering

**Acceptable Range:**
- Diamond rotation speed: 0.001 - 0.005 rad/frame
- Sphere orbit radius: 2.0 - 3.5 units
- Sphere orbit period: 4 - 10 seconds

### Light Interaction
**Required:**
- Mouse movement modifies DirectionalLight intensity or position
- Effect is perceptible but not jarring (smooth, damped response)
- Interaction does not interfere with OrbitControls

**Acceptable Range:**
- Light intensity variation: 0.3 - 1.2 (never fully dark)
- Light position shift: within 5 units of original position
- Damping factor: 0.05 - 0.15 (higher = smoother)

### Shadow System
**Required:**
- Renderer shadow map enabled (type: PCFSoftShadowMap)
- Cube, diamond, and sphere cast shadows
- Ground plane receives shadows
- Ground plane is dark, low-contrast, and does not distract from objects

**Acceptable Range:**
- Ground plane size: 10x10 to 20x20 units
- Ground plane color: 0x0a0a0a to 0x2a2a2a
- Shadow map resolution: 1024 to 2048 (balance quality vs performance)

### Code Quality
**Hard Limits:**
- JavaScript line count: ≤ 100 lines (excluding whitespace)
- No linting errors with standard ESLint rules
- No console errors or warnings in browser DevTools

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**
This orbit operates on an existing, functional codebase with clear acceptance boundaries. The blast radius is contained (only affects visual presentation, no data or architecture changes), but the 100-line constraint creates risk of quality degradation through over-optimization. Shadows and mouse interaction introduce performance considerations that require validation on target hardware.

**Tier 2 is appropriate because:**
- Changes are reversible (version controlled, no data migration)
- Acceptance criteria are measurable through visual inspection and performance profiling
- Domain expertise (Three.js rendering) is well-understood but requires human judgment for aesthetic balance
- Risk exists that line count constraint forces removal of defensive error handling

**Why not Tier 1:** The aesthetic quality of "subtle" interaction is subjective and requires human review. Performance impact of shadows varies by device.

**Why not Tier 3:** No security implications, no external integrations, no user data, no breaking changes to public API.

## Dependencies

**Prior Orbits:**
- Orbit 1 (2e6b889d): Established base Three.js scene structure — `src/main.js`, `index.html`, `src/style.css`
- Orbit 2 (7cac94ca): Added diamond and sphere geometries that this orbit will animate

**Technical Dependencies:**
- Three.js v0.160.0 (must support `PCFSoftShadowMap`, `OrbitControls`, `PlaneGeometry`)
- Vite dev server for hot module reloading during development
- Browser support for WebGL 1.0 (minimum)

**Codebase Surface:**
- `src/main.js`: Scene setup, camera, renderer, lights, objects, animation loop (lines 1-85 approx)
- `package.json`: Confirmed no additional dependencies required
- `src/style.css`: No changes required (canvas already full-viewport)

**External Systems:**
None. This orbit is self-contained within the local development environment.

**Assumed State:**
The codebase at completion of Orbit 2 contains a rotating cube, static diamond, and static sphere with `MeshStandardMaterial`, plus `AmbientLight`, `DirectionalLight`, and functional `OrbitControls`.