# Three.js Starter Project with Diamond Geometry

## Desired Outcome

A functional Three.js development environment that allows developers to immediately begin prototyping 3D web graphics without configuration overhead. When complete, running `npm install && npm run dev` will launch a local development server displaying an interactive 3D scene with **two rotating geometries** (a cube and a diamond) that respond to mouse-based camera controls. The project serves as a teaching template demonstrating core Three.js concepts (scene graph, multiple mesh management, lighting, materials, animation loop, camera interaction) in under 100 lines of code.

The developer experience outcome: zero-friction onboarding for Three.js experimentation with hot module replacement, eliminating the traditional barrier of WebGL boilerplate setup. The addition of a diamond geometry demonstrates how to compose scenes with multiple objects, position them spatially, and apply independent transformations — expanding the pedagogical value beyond single-object demonstrations.

## Constraints

### Technology Stack Boundaries
- **Build Tool:** Vite only (no Webpack, Parcel, or other bundlers)
- **JavaScript Dialect:** Vanilla JavaScript ES6+ only — no TypeScript, no JSX, no framework layers (React/Vue/Svelte forbidden)
- **Three.js Version:** Latest stable release (^0.160.0 or higher)
- **Browser Support:** Modern browsers with native ES6 module and WebGL support (no IE11 polyfills)

### Code Complexity Limits
- **Line Count Cap:** Total JavaScript in `src/main.js` must not exceed 100 lines (excluding blank lines and comments)
- **File Structure:** Exactly 4 files required: `index.html`, `src/main.js`, `src/style.css`, `package.json`
- **Dependency Count:** Exactly 2 runtime dependencies (`three`, `vite`), no additional libraries

### Scene Composition Requirements
- **Geometry:** Two primitive meshes — one cube and one diamond (octahedron or custom geometry)
- **Spatial Positioning:** Geometries must be positioned so both are simultaneously visible without camera movement
- **Material:** Both meshes use `MeshStandardMaterial` (demonstrates PBR lighting, not basic materials)
- **Lighting:** Exactly 1 `AmbientLight` + 1 `DirectionalLight` (no additional lights)
- **Camera:** `PerspectiveCamera` positioned to frame both geometries at scene origin
- **Controls:** `OrbitControls` from Three.js examples (no custom camera implementations)

### Visual and Performance Standards
- **Background Color:** Dark theme (`0x1a1a2e` or similar hex value)
- **Canvas Behavior:** Must fill entire viewport with no scrollbars or margins
- **Responsiveness:** Automatic canvas resize on window dimension changes
- **Animation:** Both geometries rotate smoothly on X and Y axes using `requestAnimationFrame` with distinct rotation speeds or axes to demonstrate independent animation
- **Frame Rate:** Maintain 60fps on standard hardware (no performance-intensive effects)

### Diamond Geometry Specification
- **Shape:** Octahedron primitive (`THREE.OctahedronGeometry`) or tetrahedral diamond shape
- **Position:** Offset from cube to avoid z-fighting (e.g., positioned to the left/right or above/below the cube)
- **Scale:** Sized appropriately relative to cube (0.5-1.5x cube dimensions) to maintain visual balance
- **Color:** Distinct from cube color to demonstrate multi-material scene composition

### Non-Goals
- No asset loading (textures, models, fonts)
- No post-processing effects or shaders
- No physics simulation or collision detection
- No UI overlays or text rendering
- No multi-scene or camera switching logic
- No build optimization or production deployment configuration
- No complex geometry hierarchies (parent-child transforms, groups) — flat scene graph only

## Acceptance Boundaries

### Functional Completeness
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Startup Time** | `npm run dev` launches server within 10 seconds | Within 5 seconds | Within 3 seconds |
| **Visual Render** | Both geometries visible and lit, no console errors | Both rotating smoothly with correct materials, clearly distinguishable | Geometries with subtle edge highlights, professional lighting balance, aesthetically pleasing spatial composition |
| **Camera Control** | Orbit/pan/zoom functional with mouse | Intuitive damping and limits configured | Smooth inertia with constrained vertical rotation |
| **Window Resize** | Canvas adjusts without distortion | Instant resize with maintained aspect ratio | Debounced resize with smooth transitions |
| **Code Clarity** | Functions correctly | Self-documenting variable names, logical grouping | Brief inline comments explaining Three.js concepts and multi-object patterns for learners |

### Scene Composition Spectrum
- **Unacceptable:** Diamond not visible in initial camera view, geometries overlapping (z-fighting), only one geometry rotating
- **Minimal:** Both geometries visible but positioned awkwardly, identical rotation speeds (not demonstrating independent animation), poor color contrast
- **Acceptable:** Both geometries clearly visible with spatial separation, distinct rotation patterns, complementary material colors
- **Excellent:** Aesthetically balanced composition (e.g., symmetrical positioning), rotation speeds that create visual interest (one faster than the other), color harmony demonstrating PBR material diversity

### Code Quality Spectrum
- **Unacceptable:** TypeScript usage, framework imports, >100 lines in main.js, additional scene objects beyond cube and diamond
- **Minimal:** Hardcoded values with no spatial logic explanation, identical code duplicated for both geometries, tightly coupled initialization
- **Acceptable:** Clear variable names (`cube`, `diamond`), separated initialization and animation logic, working hot reload
- **Excellent:** Reusable geometry creation pattern (e.g., helper function or clear initialization blocks), brief pedagogical comments explaining spatial positioning decisions, configured OrbitControls with sensible limits

### Development Experience
- **Hot Module Replacement:** Changes to `main.js` or `style.css` must reflect in browser within 2 seconds without full page reload
- **Error Handling:** Console must clearly surface Three.js initialization errors (missing WebGL, shader compilation failures)
- **Dependency Management:** `npm install` must complete without peer dependency warnings or version conflicts

### Visual Quality Gates
- **Lighting Balance:** Both geometry faces must show clear light/shadow gradation (not flat-shaded or over-bright)
- **Rotation Smoothness:** No visible frame stuttering or jank during continuous rotation of either geometry
- **Color Accuracy:** Background must be dark (RGB values all below 50) to provide contrast with lit geometries
- **Spatial Clarity:** Both geometries must be fully visible without camera adjustment, with clear depth separation
- **Control Responsiveness:** Mouse drag must immediately affect camera without input lag

### Diamond Geometry Quality
- **Shape Accuracy:** If using `OctahedronGeometry`, must have 8 triangular faces forming a diamond silhouette; if custom geometry, must clearly read as a diamond shape
- **Material Rendering:** Diamond material must respond to lighting identically to cube (both using `MeshStandardMaterial`)
- **Position Validation:** Diamond must not intersect with cube geometry or appear to float disconnected from scene composition

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit operates at Tier 2 because while the technical blast radius remains minimal (isolated starter project with no integration points), the artifact serves a **pedagogical function with increased compositional complexity** that requires human validation of teaching quality and spatial design decisions. Autonomous execution (Tier 1) is inappropriate because:

1. **Didactic Intent with Complexity Trade-off:** The <100 line constraint now covers two geometries with independent animations and spatial positioning. An AI must balance code conciseness against pedagogical clarity when demonstrating multi-object scene composition — a subjective trade-off requiring human judgment.

2. **Spatial Composition Aesthetics:** Positioning two geometries to create a visually balanced, pedagogically clear scene involves artistic judgment. Camera framing, geometry separation distance, and relative scale affect teaching effectiveness beyond what automated tests can validate.

3. **Ambiguous Diamond Specification:** The requirement "add a diamond" leaves geometric interpretation open. Using `OctahedronGeometry` (8-sided polyhedron approximating a cut diamond) is geometrically accurate but may not match user's mental model. Human review ensures the chosen geometry matches intent.

4. **Line Budget Pressure:** Adding a second geometry with independent animation, materials, and positioning logic consumes additional lines. The AI must make code organization decisions (refactoring for brevity vs. maintaining clarity) that impact teaching quality — requiring human oversight.

5. **Low-Risk Failure Mode:** If the implementation is incorrect, the blast radius is contained to a non-functional demo (no data loss, no production impact, no security risk). This makes Tier 2 appropriate rather than the heavier Tier 3 gating.

The orbit does not require Tier 3 (Gated) because no security, compliance, or production systems are involved. A human reviewer can validate the artifact meets pedagogical and aesthetic standards through a 5-minute code inspection and visual review.

## Dependencies

### External Package Dependencies
- **Three.js (npm: `three`):** Core 3D rendering library providing Scene, Camera, Renderer, geometries (BoxGeometry, OctahedronGeometry), materials, lights, and OrbitControls
  - Version constraint: `^0.160.0` (latest stable as of requirement specification)
  - Import surface: ES6 modules from `three` and `three/examples/jsm/controls/OrbitControls.js`
  - New usage: `THREE.OctahedronGeometry(radius, detail)` for diamond shape

- **Vite (npm: `vite`):** Development server and build tool
  - Version constraint: `^5.0.0`
  - Required for: ES6 module resolution, hot module replacement, development server on localhost:5173

### System Dependencies
- **Node.js:** Runtime for npm package installation and Vite execution
  - Minimum version: 18.0.0 (specified in `package.json` engines field)
  - Required for: Package management, development server process

- **WebGL Support:** Browser capability for GPU-accelerated 3D rendering
  - Detection: Three.js WebGLRenderer initialization will fail gracefully if unavailable
  - Fallback: No graceful degradation required (core requirement depends on WebGL)

### Filesystem Dependencies
- **Repository Root:** Must contain `index.html` as entry point for Vite server
- **src Directory:** Must exist before initialization to house `main.js` and `style.css`
- **Write Permissions:** Required in project root for Vite to create `.vite` cache directory during dev server startup

### Prior Orbit Dependencies
- **Orbit 1 (Implied):** Repository initialization established `package.json`, `README.md`, and `src/` directory structure
- **Orbit 2 (Current Foundation):** Existing Intent Document, Context Package, and Proposal Record provide patterns for single-geometry Three.js scene — this orbit extends that foundation by adding a second geometry
- **Code Surface:** Existing `src/main.js` implementation (if complete) will be modified to add diamond geometry, requiring awareness of current scene structure

### No External Service Dependencies
- This is a greenfield initialization orbit with no backend integration
- No database, API, or external service connections
- No shared modules or configuration files from external repositories