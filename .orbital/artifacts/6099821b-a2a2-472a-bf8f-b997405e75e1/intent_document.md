# Three.js Starter with Cube and Diamond Shapes

## Desired Outcome

A developer can see two distinct 3D shapes rotating simultaneously in a Three.js scene — a cube and a diamond (octahedron). Upon running `npm install && npm run dev`, the browser displays both geometries side-by-side with independent rotations, demonstrating how to manage multiple meshes in a single scene while maintaining the minimal starter project philosophy.

When complete:
- The scene contains two clearly visible 3D objects: a cube on the left and a diamond shape on the right
- Both shapes rotate continuously on X and Y axes at the same speed
- Each shape has distinct visual characteristics (different colors or materials) to make them easily distinguishable
- The camera is positioned to view both shapes in a single frame without panning
- Interactive OrbitControls allow the user to examine both shapes from any angle
- The development environment remains under 100 lines of JavaScript with instant hot-reload

## Constraints

### Technical Stack
- **Build tool:** Vite only — no Webpack, Rollup, or custom bundlers
- **Language:** Vanilla JavaScript (ES6+ modules) — no TypeScript, no JSX, no build-time transpilation beyond Vite defaults
- **Framework:** None — no React, Vue, Svelte, or other UI libraries
- **Three.js version:** Latest stable release (0.160.x or higher)

### Code Constraints
- Total JavaScript in `src/main.js` must not exceed 100 lines (blank lines and comments excluded)
- No external dependencies beyond `three` and `vite`
- Scene must use only built-in Three.js primitives — no custom shaders, no external 3D models, no texture assets
- Diamond shape must use `OctahedronGeometry` or `ConeGeometry` (not a custom BufferGeometry)

### Visual Requirements
- Canvas background color: `0x1a1a2e` (dark blue-gray) — unchanged from original starter
- Two distinct shapes visible in the same viewport without camera movement
- Shapes positioned horizontally (left-right) with adequate spacing to prevent visual overlap
- Each shape must have visible edges and surface detail (not flat shaded)
- Scene must be well-lit enough to distinguish faces on both geometries
- No loading spinners, splash screens, or UI overlays

### Structural Requirements
- **Exact file structure:**
  - `index.html` — HTML entry point (unchanged)
  - `src/main.js` — Scene setup and render loop (modify to add second geometry)
  - `src/style.css` — Canvas styling (unchanged)
  - `package.json` — Dependencies and scripts (unchanged)
- No additional configuration files (`.eslintrc`, `vite.config.js`, etc.)
- No subdirectories beyond `src/`

### Geometric Requirements
- **Cube:** 1x1x1 `BoxGeometry` positioned at x = -2 (left side of scene)
- **Diamond:** `OctahedronGeometry` with radius 0.8 positioned at x = 2 (right side of scene)
- Both shapes rotate at the same rate: 0.01 radians per frame on X and Y axes
- Both shapes must be added to the same scene (not separate scenes or renderers)

### Performance Constraints
- Animation must maintain 60fps on mid-range hardware (2020+ laptop with integrated graphics)
- Window resize must recalculate aspect ratio and camera projection without visual glitches
- OrbitControls damping must feel responsive (no laggy or jittery camera movement)
- Adding a second geometry must not cause frame rate degradation below 30fps

### Non-Goals
- Animating shapes with different rotation speeds or directions
- Adding more than two shapes (this is a minimal demonstration)
- Shape-specific interactions (click handlers, raycasting)
- Production builds or deployment configuration
- Mobile touch controls (OrbitControls mouse interaction only)
- Accessibility features (ARIA, keyboard navigation)
- Multiple scenes, post-processing, or advanced rendering techniques

## Acceptance Boundaries

### Functional Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Scene initialization** | Both shapes visible within 5 seconds on `npm run dev` | Both shapes visible within 2 seconds | Instant render (< 500ms) |
| **Animation smoothness** | 30fps minimum, no stuttering | Consistent 60fps | 60fps with browser devtools open |
| **Shape rotation** | Both shapes rotate on at least one axis | Both shapes rotate on X and Y axes at same speed | Visually synchronized rotation (0.01 radians/frame) |
| **Shape positioning** | Both shapes visible without camera panning | Shapes clearly separated (no visual overlap at rest) | Shapes positioned symmetrically at x = -2 and x = 2 |
| **Window resize** | Canvas and shapes resize without page refresh | Canvas and camera update within 100ms | Seamless resize with no visible flicker |
| **OrbitControls** | Camera can rotate around scene center | Camera can rotate, pan, and zoom smoothly | Damping enabled for smooth deceleration |

### Code Quality Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **JavaScript line count** | Under 120 lines (with comments) | Under 100 lines (code only) | Under 90 lines (code only) |
| **Dependency count** | `three` and `vite` only | Same | Same + `package-lock.json` integrity verified |
| **Code readability** | Variable names distinguish cube from diamond | Each shape has descriptive variable name | Code organization groups shape initialization together |
| **Code reusability** | No copy-paste duplication for lighting/renderer | Shared scene setup, distinct mesh creation | Helper pattern for creating positioned meshes (if under 100 lines) |

### Visual Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Shape distinction** | Cube and diamond have different colors | Colors have high contrast with each other and background | Cube is cyan (`0x00aaff`), diamond is orange (`0xff6600`) |
| **Lighting** | Faces on both shapes are distinguishable | Both shapes have visible highlights and shadows | Lighting creates depth on both geometries equally |
| **Background color** | Dark color (any hex value) | `0x1a1a2e` or visually equivalent | Exact `0x1a1a2e` |
| **Canvas coverage** | No white margins on desktop viewport | Full viewport coverage, no scrollbars | Responsive across 1920x1080 and 1366x768 viewports |
| **Shape proportions** | Diamond does not appear stretched or squashed | Diamond appears as a symmetrical octahedron | Diamond radius (0.8) visually balanced with cube size (1.0) |

### Geometric Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Diamond geometry** | Uses `OctahedronGeometry` or `ConeGeometry` | Uses `OctahedronGeometry` with 8 faces | Radius 0.8, detail level 0 (standard octahedron) |
| **Cube geometry** | Uses `BoxGeometry` 1x1x1 | Same as original starter | Unchanged from prior orbit implementation |
| **Positioning** | X-axis separation prevents overlap | Cube at x = -2, diamond at x = 2 | Y and Z positions at 0 (both centered vertically) |
| **Camera framing** | Both shapes visible from initial camera position | Camera positioned to frame both shapes with margin | Camera Z position adjusted if needed (original Z=5 may need Z=6) |

### Developer Experience Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Setup time** | Under 5 minutes from clone to running dev server | Under 2 minutes | Under 60 seconds (unchanged from prior orbit) |
| **Hot reload** | Changes require page refresh | Changes reflect within 2 seconds | Changes reflect instantly (< 500ms) |
| **Error handling** | Browser console shows WebGL errors if any | No console errors on successful render | No console warnings or logs |
| **Code modification clarity** | Developer can identify which lines create each shape | Clear comments or variable names distinguish cube vs diamond code | Shapes initialized in adjacent code blocks |

### Failure Modes (Must Not Occur)
- Only one shape visible (cube or diamond missing)
- Shapes overlap at initial camera position (positioning too close)
- One shape rotates while the other remains static
- Frame rate drops below 30fps with two shapes (performance regression)
- Canvas does not fill viewport (white margins visible)
- OrbitControls fail to respond to mouse input
- Browser throws WebGL context loss errors

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit modifies an existing working implementation to add a second geometry. While the technical scope is small (adding ~10-15 lines of code), several factors require human oversight:

1. **Visual balance is subjective:** Positioning two shapes "side-by-side" with "adequate spacing" requires aesthetic judgment. The proposal specifies x = -2 and x = 2, but the reviewer may find this too close or too far. Camera framing may need adjustment to accommodate both shapes comfortably.

2. **100-line constraint becomes tighter:** The original implementation used 37 lines. Adding a second shape (geometry, material, mesh, positioning) adds approximately 10-15 lines, bringing the total to 47-52 lines. This leaves less margin for readability whitespace and comments, increasing the risk of producing code that meets the constraint but fails the "self-documenting" ideal.

3. **Color selection for distinction:** The proposal suggests cyan cube and orange diamond, but this is a design decision that may not match the user's preference. The Intent specifies "distinct visual characteristics" but does not mandate specific colors.

4. **Performance validation with two geometries:** While the risk assessment indicates minimal performance impact (adding 8 triangles to a 12-triangle scene), this must be validated on target hardware to ensure 60fps is maintained.

5. **First multi-mesh pattern:** This orbit establishes the pattern for managing multiple objects in a scene. The code structure (sequential initialization vs. helper functions) sets a precedent for future additions.

**Autonomous Candidacy:** This orbit could become Tier 1 after:
- Visual regression testing confirms consistent shape positioning across multiple runs
- Performance benchmarks demonstrate <5% frame time increase with two geometries
- A reference implementation exists showing the preferred code organization pattern

**Escalation Trigger:** Escalate to Tier 3 (Gated) if:
- User requests more than two shapes (scope creep risk increases line count pressure)
- User requests animation variations (different rotation speeds, orbiting motion) that complicate the animation loop
- Frame rate profiling reveals unexpected performance degradation requiring optimization

## Dependencies

### External Dependencies
- **Three.js library:** Latest stable release from npm registry (0.160.x or higher). Must include `OctahedronGeometry` as part of the core geometry library.
- **Vite build tool:** Version 5.x or higher. Must support ES6 module imports and provide a development server with hot module replacement.
- **Node.js runtime:** Version 18.0.0 or higher to ensure compatibility with Vite's native ESM support.
- **Modern browser:** Chrome 90+, Firefox 88+, Safari 14.1+, or Edge 90+ with WebGL 2.0 support.

### Repository Dependencies
- **Prior Orbit:** This orbit modifies the Three.js starter implementation from the previous orbit. The existing `index.html`, `src/style.css`, and `package.json` remain unchanged. Only `src/main.js` is modified.
- **Assumption:** The prior orbit implementation is functional and passes all acceptance criteria. If the base implementation has issues (camera positioning, lighting, controls), those must be resolved before adding the second geometry.

### Code Dependencies
- **Existing scene infrastructure:** The scene, camera, renderer, lights, and OrbitControls from the prior orbit are reused without modification.
- **Existing animation loop:** The `animate()` function must accommodate rotation updates for two meshes instead of one. The loop structure (`requestAnimationFrame`, `controls.update()`, `renderer.render()`) remains unchanged.

### Implicit Dependencies
- **WebGL availability:** The target execution environment must have a GPU capable of hardware-accelerated rendering. No software rendering fallbacks are required.
- **Geometry availability:** `OctahedronGeometry` must be available in Three.js core (it is — verified in r160 documentation). No additional imports beyond `THREE` namespace are required.
- **Camera framing assumption:** The original camera position (Z=5) must be sufficient to frame both shapes. If shapes at x = -2 and x = 2 fall outside the camera frustum, camera Z position must be increased to Z=6 or Z=7.