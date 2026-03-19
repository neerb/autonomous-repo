# Subtle Interaction + Scene Polish

## Desired Outcome

When this orbit completes, the Three.js starter scene will feel alive and tactile. Users will observe continuous, coordinated motion across all objects (cube, diamond, sphere), creating a sense of choreography rather than isolated animations. The scene will respond subtly to mouse movement through reactive lighting, making the environment feel aware of the user's presence. Shadows will ground the objects in space, adding depth and realism without visual clutter. The result is a polished, interactive 3D experience that demonstrates professional-grade scene composition while remaining accessible to developers studying the codebase.

## Constraints

**Codebase Boundaries:**
- All logic must remain in `src/main.js` — no new files or modules
- Total JavaScript must not exceed 100 lines
- No additional npm dependencies beyond `three` and `vite`
- No postprocessing, shaders, or effect composer patterns
- Vanilla JavaScript only — no frameworks, no TypeScript

**Technical Limits:**
- OrbitControls must remain functional and unobstructed by new interactions
- Window resize handling must continue to work correctly
- Dark background aesthetic (0x1a1a2e) must be preserved
- Performance must remain smooth on mid-range hardware (60fps target)

**Interaction Design:**
- Mouse interaction must be subtle and non-intrusive
- Users should not be distracted from observing the scene
- Shadow rendering must not create harsh visual artifacts

**Non-Goals:**
- No new geometric shapes beyond a simple ground plane
- No particle systems or complex effects
- No audio or haptic feedback
- No UI overlays or text elements

## Acceptance Boundaries

**Continuous Motion (Required):**
- Diamond rotates on Y-axis at a different speed than cube's X/Y rotation (measurable difference of at least 30% in angular velocity)
- Sphere orbits the scene center on a circular path with radius between 2-4 units
- Sphere completes one full orbit every 8-12 seconds
- All animations use `requestAnimationFrame` with delta time for frame-rate independence

**Mouse Interaction (Required):**
- DirectionalLight direction or intensity responds to mouse X/Y position
- Light change is smooth and interpolated (no jittery direct mapping)
- Effect is noticeable but not dramatic — intensity variation of 20-40%, or direction shift of 15-30 degrees
- Interaction does not interfere with OrbitControls camera dragging

**Shadow Rendering (Required):**
- `renderer.shadowMap.enabled = true` is set
- Cube, diamond, and sphere all have `castShadow = true`
- Ground plane has `receiveShadow = true` and is positioned below objects
- Shadows are soft (PCFSoftShadowMap or equivalent)
- Ground plane is dark and blends with background (not visually dominant)

**Code Quality (Required):**
- Total lines in `main.js` ≤ 100
- No console errors or warnings in browser
- Smooth performance (≥55fps) on laptop with integrated graphics
- Resize handling continues to work correctly

**Acceptable Variations:**
- Orbit radius for sphere: 2-4 units (optimal: ~3)
- Orbit duration: 8-12 seconds (optimal: ~10)
- Light intensity variation: 20-40% (optimal: ~30%)
- Ground plane size: 10-20 units (optimal: ~15)
- Shadow map resolution: 1024-2048 (optimal: 1024 for performance)

**Unacceptable Outcomes:**
- Adding any npm dependencies beyond existing `three` and `vite`
- Breaking OrbitControls functionality
- Performance drops below 50fps on mid-range hardware
- Shadows causing visual artifacts (acne, peter-panning, aliasing)
- Mouse interaction causing camera control conflicts

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit operates at Tier 2 because it modifies an existing, functioning scene with new runtime behaviors (animation paths, mouse interactions, shadow rendering) that introduce moderate implementation risk:

- **Blast Radius:** Changes are confined to a single file (`src/main.js`) in a starter project with no production usage. Failure would not impact live users or data.

- **Technical Complexity:** Shadow configuration and mouse interaction introduce edge cases (shadow artifacts, input conflicts with OrbitControls) that require validation beyond automated checks.

- **Non-Determinism:** Mouse-based light manipulation and animation timing create emergent behavior that should be visually inspected for quality and smoothness.

- **Line Budget Risk:** The 100-line constraint is tight. Adding three new features (motion, interaction, shadows) requires careful code organization that automated tests cannot fully validate.

**Why Not Tier 1:** The cumulative risk of animation path bugs, shadow rendering issues, and mouse interaction conflicts warrants human review of the visual output and performance profile.

**Why Not Tier 3:** The changes are non-destructive (additive features), have no security implications, and operate in a sandboxed starter project. The scope is well-defined and the codebase is simple enough to reason about confidently.

## Dependencies

**Codebase Context:**
- Existing `src/main.js` must contain: scene setup, cube with rotation animation, OrbitControls, AmbientLight, DirectionalLight, and window resize handling
- `index.html` and `src/style.css` must remain unchanged
- `package.json` must already include `three` and `vite` dependencies

**Three.js Features:**
- `THREE.OrbitControls` from `three/examples/jsm/controls/OrbitControls.js` (already imported)
- `THREE.WebGLRenderer.shadowMap` API for shadow configuration
- `THREE.Object3D.castShadow` and `receiveShadow` properties
- `THREE.PCFSoftShadowMap` or equivalent shadow map type

**External Dependencies:**
- Mouse move events via `window.addEventListener('mousemove', callback)`
- Browser's `requestAnimationFrame` API for delta-time calculations

**No Prior Orbits:**
This is the first enhancement orbit for the starter project. No prior ORBITAL artifacts exist.

**Assumptions:**
- The existing scene contains exactly three objects: cube, diamond, and sphere (as referenced in the intent description)
- OrbitControls are already functional and properly initialized
- The renderer already handles window resize events