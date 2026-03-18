# Three.js Starter Project

## Desired Outcome

A functional Three.js development environment that allows developers to immediately begin prototyping 3D web graphics without configuration overhead. When complete, running `npm install && npm run dev` will launch a local development server displaying an interactive 3D scene with a rotating cube that responds to mouse-based camera controls. The project serves as a teaching template demonstrating core Three.js concepts (scene graph, lighting, materials, animation loop, camera interaction) in under 100 lines of code.

The developer experience outcome: zero-friction onboarding for Three.js experimentation with hot module replacement, eliminating the traditional barrier of WebGL boilerplate setup.

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
- **Geometry:** Single cube primitive only (no custom geometries, models, or additional meshes)
- **Material:** `MeshStandardMaterial` required (demonstrates PBR lighting, not basic materials)
- **Lighting:** Exactly 1 `AmbientLight` + 1 `DirectionalLight` (no additional lights)
- **Camera:** `PerspectiveCamera` positioned to frame the cube at scene origin
- **Controls:** `OrbitControls` from Three.js examples (no custom camera implementations)

### Visual and Performance Standards
- **Background Color:** Dark theme (`0x1a1a2e` or similar hex value)
- **Canvas Behavior:** Must fill entire viewport with no scrollbars or margins
- **Responsiveness:** Automatic canvas resize on window dimension changes
- **Animation:** Smooth rotation on both X and Y axes using `requestAnimationFrame`
- **Frame Rate:** Maintain 60fps on standard hardware (no performance-intensive effects)

### Non-Goals
- No asset loading (textures, models, fonts)
- No post-processing effects or shaders
- No physics simulation or collision detection
- No UI overlays or text rendering
- No multi-scene or camera switching logic
- No build optimization or production deployment configuration

## Acceptance Boundaries

### Functional Completeness
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Startup Time** | `npm run dev` launches server within 10 seconds | Within 5 seconds | Within 3 seconds |
| **Visual Render** | Cube visible and lit, no console errors | Cube rotating smoothly with correct materials | Cube with subtle edge highlights, professional lighting balance |
| **Camera Control** | Orbit/pan/zoom functional with mouse | Intuitive damping and limits configured | Smooth inertia with constrained vertical rotation |
| **Window Resize** | Canvas adjusts without distortion | Instant resize with maintained aspect ratio | Debounced resize with smooth transitions |
| **Code Clarity** | Functions correctly | Self-documenting variable names, logical grouping | Brief inline comments explaining Three.js concepts for learners |

### Code Quality Spectrum
- **Unacceptable:** TypeScript usage, framework imports, >100 lines in main.js, additional scene objects beyond requirements
- **Minimal:** Hardcoded values, no code comments, tightly coupled initialization logic
- **Acceptable:** Clear variable names, separated initialization and animation logic, working hot reload
- **Excellent:** Modular setup functions (e.g., `createScene()`, `createLights()`), brief pedagogical comments, configured OrbitControls with sensible limits

### Development Experience
- **Hot Module Replacement:** Changes to `main.js` or `style.css` must reflect in browser within 2 seconds without full page reload
- **Error Handling:** Console must clearly surface Three.js initialization errors (missing WebGL, shader compilation failures)
- **Dependency Management:** `npm install` must complete without peer dependency warnings or version conflicts

### Visual Quality Gates
- **Lighting Balance:** Cube faces must show clear light/shadow gradation (not flat-shaded or over-bright)
- **Rotation Smoothness:** No visible frame stuttering or jank during continuous rotation
- **Color Accuracy:** Background must be dark (RGB values all below 50) to provide contrast with lit cube
- **Control Responsiveness:** Mouse drag must immediately affect camera without input lag

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit operates at Tier 2 because while the technical blast radius is minimal (isolated starter project with no integration points), the artifact serves a **pedagogical function** that requires human validation of teaching quality. Autonomous execution (Tier 1) is inappropriate because:

1. **Didactic Intent:** The <100 line constraint exists to demonstrate minimalism as a teaching tool. An AI could technically satisfy requirements with suboptimal code organization that hinders learning.

2. **Subjective Code Quality:** "Clean starter code" has human judgment dimensions beyond linting. Variable naming clarity, logical grouping, and comment helpfulness require review by someone who understands the learner's context.

3. **Ecosystem Volatility:** Three.js and Vite update frequently. While version pinning provides stability, the AI should not autonomously decide which minor version trade-offs to make without human oversight of breaking changes.

4. **Low-Risk Failure Mode:** If the implementation is incorrect, the blast radius is contained to a non-functional demo (no data loss, no production impact, no security risk). This makes Tier 2 appropriate rather than the heavier Tier 3 gating.

The orbit does not require Tier 3 (Gated) because no security, compliance, or production systems are involved. A human reviewer can quickly validate the artifact meets pedagogical standards through a 5-minute code inspection.

## Dependencies

### External Package Dependencies
- **Three.js (npm: `three`):** Core 3D rendering library providing Scene, Camera, Renderer, geometries, materials, lights, and OrbitControls
  - Version constraint: `^0.160.0` (latest stable as of requirement specification)
  - Import surface: ES6 modules from `three` and `three/examples/jsm/controls/OrbitControls.js`

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

### No Code Dependencies
- This is a greenfield initialization orbit with no prior orbits to reference
- No existing codebase integration required
- No shared modules or configuration files to import
- No database, API, or external service connections