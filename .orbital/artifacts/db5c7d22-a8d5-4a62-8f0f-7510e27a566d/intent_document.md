# Subtle Interaction + Scene Polish (Choreographed Motion)

## Desired Outcome

The Three.js scene transforms from a static demonstration into a living, breathing interactive experience. Users perceive the scene as dynamic and responsive: shapes move in coordinated patterns that feel intentional rather than random, lighting responds subtly to mouse position creating a sense of connection between user action and scene state, and soft shadows ground the objects in space. The enhanced scene maintains its minimalist aesthetic while demonstrating that simple geometric primitives can create engaging visual experiences through thoughtful motion design and interaction.

**Success looks like:** A visitor moves their mouse across the canvas and immediately perceives that the scene is responding. The objects move in harmonious patterns — the diamond spinning on a different axis than the cube, the sphere tracing a gentle orbital path — creating visual interest without distraction. Shadows reinforce the spatial relationships between objects and make the scene feel more physically grounded. The interaction is discovered naturally without instruction, and the motion patterns feel purposeful rather than chaotic.

## Constraints

### Technical Boundaries
- **No new dependencies**: Three.js and existing libraries only — no postprocessing libraries, no animation frameworks, no particle systems
- **Code budget**: All enhancements must fit within the existing `src/main.js` file and remain under 100 lines of JavaScript total
- **Performance floor**: Maintain 60fps on mid-range devices (no complex shadow calculations, no raymarching, no expensive per-frame operations)
- **Vanilla JavaScript only**: No frameworks, no build-time transforms beyond Vite's defaults

### Design Boundaries
- **Aesthetic preservation**: Dark background (0x1a1a2e) must remain; added elements should be subtle and avoid bright colors or harsh contrasts
- **Minimal geometry**: Ground plane for shadows is permitted, but no additional decorative meshes, no skyboxes, no complex shadow receivers
- **Interaction subtlety**: Mouse-driven effects should enhance rather than dominate — no dramatic camera movements, no disorienting light flashes

### Functional Boundaries
- **Preserve existing behavior**: OrbitControls must continue to function normally; window resize handling must remain intact; initial camera position and scene composition should not change
- **No framework coupling**: Solution should not require refactoring toward any particular pattern (MVC, component-based, etc.)

### Non-Goals
- Advanced lighting systems (HDR, image-based lighting, light probes)
- Physics simulation or collision detection
- Post-processing effects (bloom, depth of field, motion blur)
- Sound integration or data visualization features
- Multi-scene management or scene transitions

## Acceptance Boundaries

### Motion Choreography
- **Diamond rotation**: Rotates on a visibly different axis than the cube (e.g., if cube rotates on X/Y, diamond should rotate on Y/Z or Z/X) at a speed that creates visual distinction without competing for attention
- **Sphere orbital motion**: Traces a circular path around the scene center with radius between 2-4 units, completing one orbit every 10-15 seconds, height should vary slightly (±0.5 units) to add depth
- **Coordination**: All three objects should move simultaneously without frame drops; motion should feel synchronized rather than random

### Mouse Interaction
- **Light response**: Directional light position or intensity shifts based on mouse position within the canvas bounds (not globally)
- **Response speed**: Light changes should be smoothed (lerped) over 3-5 frames to avoid jittery motion
- **Boundary behavior**: Effect should gracefully handle edge cases (mouse leaving canvas, rapid movement, touch devices)
- **Threshold**: Light shift magnitude should be noticeable when moving mouse from corner to corner but subtle enough to not feel distracting

### Shadow Quality
- **Renderer configuration**: Shadows enabled with appropriate shadow map size (1024x1024 or 2048x2048)
- **Shadow casters**: Cube, diamond, and sphere all cast shadows
- **Shadow receiver**: Ground plane present (PlaneGeometry or similar, positioned below objects, dark material matching aesthetic)
- **Visual quality**: Shadows should be soft-edged (not harsh pixel boundaries) and update in real-time with motion
- **Performance**: Shadow rendering must not drop framerate below 60fps on target hardware

### Integration Quality
- **Code organization**: New logic integrated logically within existing structure (motion in animation loop, setup in initialization)
- **No regressions**: All orbit 1 and orbit 2 features (rotating cube, multiple shapes, lighting) continue to function
- **Maintainability**: Code remains readable with clear variable names; no clever hacks that obscure intent

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**
This orbit introduces multiple interacting systems (shadow rendering, coordinated animation timing, mouse-driven state changes) that could degrade user experience if implemented poorly. Specific risks include:

- **Performance degradation**: Shadow calculations and per-frame light updates could drop framerate, especially on lower-end devices or when combined with OrbitControls interaction
- **Motion design failure**: Poorly tuned animation speeds or radius values could make the scene feel chaotic rather than choreographed
- **Interaction coupling bugs**: Mouse event handlers might interfere with OrbitControls or fail to clean up properly

The blast radius is moderate: incorrect implementation won't break the build or corrupt data, but could result in a scene that's less engaging than the current state (negative user value). Manual review is warranted to verify:

1. Motion patterns feel intentional and harmonious
2. Mouse interaction enhances rather than distracts
3. Performance remains acceptable across device profiles
4. Shadow quality matches aesthetic expectations

After successful review of this orbit's implementation patterns, similar visual enhancement orbits could potentially move to Tier 1 autonomy.

## Dependencies

### Prior Orbits
- **Orbit 1** (Initial scene setup): This orbit depends on the foundational scene structure — camera, renderer, lights, animation loop, OrbitControls, and window resize handling must be in place and functional
- **Orbit 2** (Additional shapes): This orbit extends motion to the diamond and sphere shapes introduced in orbit 2; those geometries must exist and be accessible in the scene graph

### External Systems
- **Three.js shadow system**: Relies on Three.js built-in shadow mapping (requires `renderer.shadowMap.enabled`, light shadow properties, and `castShadow`/`receiveShadow` flags)
- **Browser APIs**: 
  - `requestAnimationFrame` for animation loop (already in use)
  - `mousemove` event for interaction tracking (new dependency)
  - `window.devicePixelRatio` for shadow map sizing considerations

### Data Dependencies
- **Scene graph structure**: Requires references to cube, diamond, sphere, directionalLight, and camera objects in a scope accessible to the animation loop
- **Time tracking**: May need to track elapsed time or frame delta for consistent orbital motion speed across different refresh rates

### Known Risks
- **Mouse event handler lifecycle**: If not properly managed, event listeners could accumulate on hot reload during development (Vite HMR); cleanup or guard logic may be necessary
- **OrbitControls conflict**: Mouse position tracking for light effects runs parallel to OrbitControls' own mouse handling; implementation must ensure they don't interfere
- **Shadow map resolution scaling**: Fixed shadow map sizes may look poor on high-DPI displays unless adjusted for `window.devicePixelRatio`