# Three.js Interactive 3D Scene Starter

## Desired Outcome

A developer can clone this repository, run `npm install && npm run dev`, and immediately see a rotating 3D cube in their browser with interactive camera controls. The project serves as a minimal, documented foundation for Three.js experimentation without framework overhead or build complexity. The viewport fills the browser window with no scrollbars or layout shifts, and the scene renders at 60fps on mid-range hardware.

## Constraints

**Technology Stack**
- Three.js latest stable version (0.160.x or higher)
- Vite as the sole build tool
- Vanilla JavaScript only — no TypeScript, no JSX, no frameworks
- ES modules syntax throughout

**Code Simplicity**
- Total JavaScript code must not exceed 100 lines in `src/main.js`
- No external libraries beyond Three.js and OrbitControls
- No CSS preprocessors or PostCSS plugins
- Single HTML entry point with no templating

**Visual Requirements**
- Scene background color: `0x1a1a2e` (dark blue-grey)
- Cube material must be `MeshStandardMaterial` to respond to lighting
- Both ambient and directional lighting required for depth perception
- Animation must be smooth and continuous (no frame drops)

**Browser Compatibility**
- Must work in Chrome, Firefox, Safari, and Edge (last 2 versions)
- No use of experimental WebGL features or extensions
- Graceful fallback if WebGL 2 is unavailable

**Non-Goals**
- Custom shaders or advanced rendering techniques
- Asset loading (textures, models, fonts)
- Post-processing effects
- Mobile-specific optimizations beyond responsive viewport
- Development environment customization (linting, formatting configs)

## Acceptance Boundaries

**Minimum Viable**
- Project starts with `npm run dev` without errors
- Browser displays a rotating cube at `http://localhost:5173`
- Camera can be rotated with mouse drag (OrbitControls functional)
- Window resize updates canvas dimensions without reload
- Cube rotates continuously on both X and Y axes

**Target Success**
- Code is under 100 lines in `src/main.js`
- Canvas fills 100% of viewport width and height with no overflow
- Animation maintains 60fps on 1080p display (Intel Iris Xe or equivalent)
- Scene includes visible ambient and directional lighting with noticeable shadows or highlights
- OrbitControls allow zoom (scroll), pan (right-click drag), and rotate (left-click drag)
- Code includes inline comments explaining Three.js initialization steps

**Exceptional**
- Animation maintains 60fps on 4K display
- Code uses less than 80 lines while maintaining readability
- OrbitControls damping enabled for smooth camera motion
- Scene uses proper disposal patterns (though not critical for this simple case)

**Unacceptable**
- Any framework dependencies in `package.json`
- TypeScript configuration files present
- Build time exceeds 3 seconds on first load
- Canvas does not resize when browser window changes
- Cube remains static (no rotation)
- JavaScript exceeds 100 lines

## Trust Tier Assignment

**Assigned Tier: 2 (Supervised)**

**Rationale:**
This orbit creates a new project structure from scratch, which requires validation of directory organization and file relationships. While the technical complexity is low (standard Three.js boilerplate), the potential for cascading errors exists:

- Incorrect `package.json` configuration could break dependency resolution
- Missing ES module declarations could cause import failures
- Malformed HTML structure could break Vite's injection mechanism
- Incorrect camera/renderer initialization could result in a blank screen

The blast radius is contained (only affects this starter project), but manual verification ensures the generated structure actually runs. A human reviewer can catch issues like:
- Typos in npm script names
- Incorrect Three.js import paths
- Missing viewport meta tag for responsive behavior
- Animation loop that doesn't actually call itself

Tier 1 (Autonomous) would be appropriate if this were modifying an existing, tested Three.js project. Tier 3 (Gated) would be excessive given the limited external dependencies and well-documented Three.js APIs.

## Dependencies

**External Packages**
- `three` (npm): Scene graph, renderer, geometry, materials, lighting, controls
- `vite` (npm): Dev server, ES module bundling, hot module replacement

**Browser APIs**
- WebGL 2 or WebGL 1 with fallback
- `requestAnimationFrame` for render loop
- `window.addEventListener` for resize handling

**Development Prerequisites**
- Node.js 18.0.0 or higher (for Vite compatibility)
- npm or pnpm for package installation
- Modern browser with WebGL support

**No Prior Orbits**
This is a greenfield project with no dependencies on previous work. The repository currently contains only ORBITAL artifact metadata and this represents the first functional code delivery.