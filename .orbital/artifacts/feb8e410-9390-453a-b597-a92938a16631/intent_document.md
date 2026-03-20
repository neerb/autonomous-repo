# Subtle Interaction + Scene Polish

## Desired Outcome

When this orbit completes, users will experience a Three.js scene that feels responsive and alive. The existing geometric objects (cube, diamond, sphere) will exhibit distinct, continuous motion patterns that create visual interest without distraction. Mouse movement will provide subtle feedback through dynamic lighting, making the scene feel interactive rather than static. Soft shadows will add depth and spatial grounding, anchoring the objects in a unified 3D space. The overall effect should be a polished, tactile experience that demonstrates sophisticated 3D interaction within a minimal codebase.

Success means the scene transitions from a basic technical demonstration to an engaging visual experience that users want to explore and interact with, while maintaining the project's core philosophy of simplicity and clarity.

## Constraints

### Technical Boundaries
- **No new dependencies:** The project must remain at `three` + `vite` only. No postprocessing libraries, animation frameworks, or helper utilities beyond what Three.js provides
- **Code budget:** All JavaScript logic must fit within 100 lines in `src/main.js`, including the new motion, interaction, and shadow logic
- **File structure:** Changes must be limited to `src/main.js`. No modifications to `index.html`, `package.json`, or `src/style.css`
- **Browser compatibility:** Must function in modern evergreen browsers without polyfills or fallbacks

### Performance Requirements
- **Frame rate:** Maintain 60fps on mid-range hardware (2019+ laptops with integrated graphics)
- **Shadow performance:** Shadow map resolution should not exceed 1024x1024 to ensure smooth rendering
- **Event handling:** Mouse move events must be throttled or use built-in browser optimizations to prevent jank

### Visual Integrity
- **Dark aesthetic:** Preserve the existing `0x1a1a2e` background color and overall dark mood
- **Non-intrusive ground plane:** Shadow receiver must be subtle—either a dark plane or circular platform that doesn't compete visually with the primary objects
- **Light balance:** The interactive light shifts should enhance without overwhelming the existing ambient + directional lighting setup

### Behavioral Constraints
- **OrbitControls preservation:** User camera control must remain fully functional and feel responsive
- **Resize handling:** Window resize behavior must continue working correctly with shadow rendering enabled
- **Motion profiles:** Object animations should be smooth and deterministic (no random jitter or unpredictable behavior)

## Acceptance Boundaries

### Motion System
**Minimum Acceptable:**
- Diamond rotates on at least one axis different from the cube's X/Y rotation
- Sphere moves in a circular path around the origin with visible motion

**Target:**
- Diamond rotates on Y and Z axes at speeds distinct from cube rotation (e.g., half or quarter speed)
- Sphere orbits at radius 3-5 units with a period of 5-10 seconds, maintaining consistent distance from center

**Stretch:**
- Motion curves use sine/cosine functions for natural easing rather than linear interpolation
- Diamond and sphere motion phases are offset to create visual rhythm

### Interactive Lighting
**Minimum Acceptable:**
- Directional light direction changes noticeably when mouse moves across viewport
- Effect is frame-rate independent and doesn't cause visual stutter

**Target:**
- Light direction responds smoothly to normalized mouse coordinates (-1 to 1 range)
- Light intensity varies subtly (±20%) based on mouse position or movement speed
- Effect creates clear visual feedback without being distracting

**Stretch:**
- Light color temperature shifts slightly (warmer/cooler) based on interaction
- Smooth interpolation between light states to avoid jarring transitions

### Shadow Quality
**Minimum Acceptable:**
- Renderer shadow mapping is enabled
- All three objects (cube, diamond, sphere) cast visible shadows
- A ground plane or platform receives shadows without z-fighting or visual artifacts

**Target:**
- Shadow edges are soft but defined (bias and normalBias configured to eliminate acne)
- Shadow map size balances quality and performance (512-1024 resolution)
- Ground plane is textured or colored to complement the dark theme (e.g., `0x0a0a0f`)

**Stretch:**
- Shadow camera frustum is optimized to capture all objects without excess padding
- Ambient occlusion effect visible where objects meet the ground plane

### Code Quality
**Minimum Acceptable:**
- Total line count in `src/main.js` does not exceed 100 lines
- No runtime errors or console warnings
- Code remains readable with appropriate variable names

**Target:**
- Animation logic grouped into clear update functions
- Mouse event handling uses efficient patterns (no unnecessary closures or state)
- Shadow configuration is explicit and commented for future maintainers

**Stretch:**
- Code structure demonstrates functional programming principles where applicable
- Magic numbers are extracted to named constants at the top of the file

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit warrants supervised execution due to several domain-specific risks that require human validation before merging:

1. **Performance Impact:** Enabling shadows and adding mouse event listeners introduces render and event loop overhead. While the constraints specify 60fps targets, actual performance on varying hardware requires human verification with profiling tools.

2. **Visual Aesthetics:** The "subtle and non-distracting" requirement for shadows and the "tactile feel" for interactions are subjective quality judgments. An AI can implement technical specifications, but a human must validate whether the visual result aligns with the project's design intent.

3. **Code Budget Pressure:** Adding three distinct feature sets (motion, interaction, shadows) within the existing 100-line budget creates risk of rushed or overly terse code. Human review ensures the implementation remains maintainable rather than optimizing solely for brevity.

4. **Integration Surface:** The changes touch core render loop logic, lighting configuration, and event handling simultaneously. While the blast radius is limited to one file, the interaction between these systems creates edge cases (e.g., shadow updates during rapid mouse movement) that benefit from human testing.

Tier 1 (Autonomous) would be inappropriate because visual quality gates cannot be automated effectively. Tier 3 (Gated) is unnecessarily restrictive given the limited scope and low risk of data corruption or security issues.

## Dependencies

### Codebase Dependencies
- **Existing Scene Setup:** This orbit extends the current `src/main.js` implementation, which must contain:
  - A functioning render loop with `requestAnimationFrame`
  - Three geometry objects instantiated (cube, diamond, sphere) with materials
  - A configured `DirectionalLight` that can be modified
  - OrbitControls properly initialized and updating in the animation loop

- **Renderer Configuration:** The existing `WebGLRenderer` instance must be accessible for enabling shadow mapping. If the renderer is created in a closure or IIFE without proper scope, refactoring may be necessary.

### External Dependencies
- **Three.js Version:** The implementation assumes Three.js ^0.160.0 as specified in `package.json`. Shadow API and geometry methods must align with this version.

- **Browser APIs:** Mouse move event handling depends on standard `mousemove` event support and `clientX/clientY` properties for coordinate normalization.

### Prior Orbit References
This is Orbit 1 of the trajectory "Three.js starter project." It builds directly on the initial scaffold created in Orbit 0 (the base project setup with cube, camera, lights, and controls). No other orbits are dependencies, but the success of this orbit assumes Orbit 0 produced a working baseline scene.

### Optional Dependencies
- **Development Tools:** While not required for functionality, human reviewers should have access to browser DevTools performance profiling to validate the 60fps constraint.