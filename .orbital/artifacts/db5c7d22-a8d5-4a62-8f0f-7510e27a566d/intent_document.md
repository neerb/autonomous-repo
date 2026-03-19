# Subtle Interaction + Scene Polish

## Desired Outcome

When a developer or viewer opens the Three.js scene in their browser on March 19, 2026, they experience a living, tactile environment instead of a static demonstration. The scene communicates depth and responsiveness through three distinct motion layers: the cube continues its existing rotation, the diamond rotates on a different axis creating visual counterpoint, and the sphere traces a gentle orbital path around the center. Mouse movement creates a subtle reactive quality as lighting responds to cursor position, making the scene feel aware of the user's presence. Soft shadows ground all objects in space, with a dark, unobtrusive plane catching shadow projections and reinforcing the scene's three-dimensional structure. The enhancement transforms the starter project from a technical proof-of-concept into an expressive, polished demonstration piece while maintaining its minimal footprint and vanilla JavaScript architecture.

## Constraints

**Technical Stack**
- No additional npm dependencies beyond the existing `three` and `vite` packages
- No postprocessing effects, shaders, or render passes
- All interaction and animation logic remains in `src/main.js`
- No TypeScript, frameworks, or build step changes
- Preserve the existing OrbitControls functionality without interference

**Code Budget**
- Total JavaScript in `src/main.js` must remain under 100 lines
- No new JavaScript files or modules
- Comments and whitespace count toward the 100-line limit

**Performance**
- Maintain 60fps on modern desktop browsers (Chrome, Firefox, Safari)
- Shadow rendering must not introduce visible frame drops
- Mouse tracking must use RAF-throttled updates, not raw mousemove events

**Visual Continuity**
- Preserve the dark background color (0x1a1a2e)
- Maintain the existing cube, diamond, and sphere geometry
- Lighting changes must be subtle — no dramatic intensity shifts or color changes
- Ground plane must be dark and low-contrast to avoid visual distraction

**Architecture**
- Window resize handling must continue to work correctly
- OrbitControls must remain the primary camera interaction method
- Scene setup order must not break existing rendering pipeline

## Acceptance Boundaries

**Motion Quality**
- **Minimum:** Cube rotates on its original axes, diamond rotates on at least one different axis, sphere position changes over time
- **Target:** Diamond rotation is visually distinct from cube (different axis combination), sphere completes one full orbit in 15-30 seconds at a radius of 3-5 units
- **Ideal:** All three motion systems feel harmonious and intentional, with easing or variation that makes movement organic rather than mechanical

**Light Interaction**
- **Minimum:** DirectionalLight position or intensity responds to mouse cursor position somewhere in the viewport
- **Target:** Light response is smooth (no jitter), with a noticeable but non-distracting effect on scene appearance, using normalized mouse coordinates
- **Ideal:** Light direction shifts create a sense of the scene being "explored" by the cursor, with subtle highlighting that draws attention to geometry edges

**Shadow Implementation**
- **Minimum:** Renderer has `shadowMap.enabled = true`, at least one object casts shadows, ground plane receives shadows
- **Target:** All three objects (cube, diamond, sphere) cast shadows onto a ground plane positioned below y=0, shadows are visible and correctly positioned, ground plane is dark (e.g., 0x0a0a0a) and does not compete with background
- **Ideal:** Shadow softness (via `shadowMap.type`) and light shadow camera settings create believable depth, ground plane size and position feel natural, no shadow acne or peter-panning artifacts

**Code Efficiency**
- **Minimum:** Total line count in `src/main.js` is ≤100 lines
- **Target:** Code remains readable with logical grouping (setup, animation, interaction), no excessive cleverness or golfing
- **Ideal:** Implementation demonstrates clean patterns that could be extended by other developers without refactoring

**Cross-System Coherence**
- **Minimum:** OrbitControls continue to function, window resize still works, scene renders without console errors
- **Target:** Mouse interaction does not interfere with OrbitControls dragging, all new features activate correctly on page load
- **Ideal:** The enhancement feels integrated rather than bolted-on, with no perceptible initialization flicker or setup delays

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**  
This orbit modifies the core animation loop and renderer configuration in a small codebase with no test coverage. While the blast radius is limited (a demo project with no production users), the 100-line constraint creates pressure to optimize aggressively, which increases the risk of subtle bugs in event handling or render cycle timing. Shadow configuration often introduces visual artifacts that require iteration to resolve, and mouse interaction can conflict with OrbitControls if not implemented carefully. The lack of existing patterns for interaction in the codebase means the implementation establishes new conventions. Supervised execution allows verification that shadows render correctly, motion feels intentional, and OrbitControls remain unaffected before committing. A human checkpoint prevents merging code that technically meets requirements but produces jarring visual results or introduces frame rate issues.

## Dependencies

**Prior Orbit Context**  
This orbit builds directly on Orbit 2 (commit `feb8e410-9390-453a-b597-a92938a16631`), which added the diamond and sphere geometry. The existing scene state includes:
- A rotating cube with MeshStandardMaterial
- A diamond (likely created via geometry manipulation)
- A sphere (added as a third object)
- OrbitControls already initialized and active
- AmbientLight and DirectionalLight in the scene
- A render loop using `requestAnimationFrame`

**External Systems**  
- Three.js OrbitControls module (already imported via `three/addons/controls/OrbitControls.js`)
- Browser window resize event handling (already implemented)

**Data Dependencies**  
- Scene graph structure from prior orbit (references to `cube`, `diamond`, `sphere` objects must be accessible in animation loop)
- Existing light references (DirectionalLight must be accessible for mouse interaction)

**Assumptions**  
- The current codebase is functional and renders correctly as of March 19, 2026
- Vite dev server is the primary development environment
- No external CSS or HTML changes are required (all polish is scene-level)