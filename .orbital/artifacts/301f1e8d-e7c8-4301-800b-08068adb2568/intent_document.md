# Three.js Starter Project

## Desired Outcome

A fully functional, browser-based 3D scene that runs immediately after executing `npm run dev`, demonstrating fundamental Three.js capabilities through a minimal interactive example. When complete, a developer can clone the repository, install dependencies, run one command, and see a smoothly animated 3D cube rotating in their browser with full mouse-based camera control. This serves as a validated foundation for exploring Three.js features without framework overhead or configuration complexity.

The project must be immediately usable for learning, prototyping, or serving as a template for more complex 3D web applications. The implementation quality should demonstrate professional standards: proper viewport handling, clean separation of concerns, and smooth 60fps animation performance.

## Constraints

### Technical Stack Boundaries
- **JavaScript only**: No TypeScript, no transpilation beyond Vite's default ES module handling
- **Framework-free**: No React, Vue, Svelte, or similar frameworks — pure vanilla JavaScript with DOM APIs
- **Latest stable versions**: Three.js ^0.160.0 and Vite ^5.0.0 as specified in package.json
- **Node.js compatibility**: Must run on Node 18+ as declared in engines field

### Code Quality Limits
- **Line count ceiling**: Total JavaScript in src/main.js must not exceed 100 lines including whitespace and comments
- **Simplicity mandate**: No custom abstractions, helper classes, or module splitting beyond the defined structure
- **Direct imports**: Three.js features must be imported directly from 'three' and 'three/examples/jsm/controls/OrbitControls.js'

### File Structure Lock
- **Exact structure**: Only these files may exist in the final deliverable:
  - `index.html` — HTML entry point
  - `src/main.js` — Scene setup and animation logic
  - `src/style.css` — Visual styling
  - `package.json` — Dependencies and scripts
- **No additional files**: No configuration files beyond Vite defaults, no utility modules, no separate scene files

### Visual and Performance Requirements
- **Background color**: Scene background must be `0x1a1a2e` (dark blue-grey)
- **Full viewport**: Canvas must fill entire browser window with zero margins, padding, or scrollbars
- **Responsive**: Window resize must immediately update camera aspect ratio and renderer size without manual refresh
- **Smooth animation**: Target 60fps with continuous rotation on X and Y axes
- **No console errors**: Clean execution with no warnings or errors in browser console

### Non-Goals
- **Not a tutorial**: No extensive comments explaining Three.js concepts
- **Not production-ready**: No error boundaries, loading states, or fallback handling
- **Not optimized for scale**: No performance optimizations beyond basic best practices
- **Not cross-browser tested**: Assumes modern evergreen browser (Chrome, Firefox, Safari latest)

## Acceptance Boundaries

### Level 1: Minimum Viable (Required)
- Project installs without errors using `npm install`
- `npm run dev` starts Vite dev server and opens browser viewport
- Scene renders with visible cube, lights, and dark background color
- Cube rotates continuously without user interaction
- OrbitControls respond to mouse drag, scroll, and right-click
- Window resize updates canvas dimensions without distortion
- Zero console errors or warnings during normal operation
- Total lines in src/main.js ≤ 100

### Level 2: Professional Standard (Target)
- All Level 1 criteria met
- Animation runs at stable 60fps on modern hardware (verified via browser DevTools performance monitor)
- Camera starts at position that fully frames the cube without clipping
- Lighting creates visible depth perception (shadows/highlights on cube faces)
- OrbitControls damping provides smooth, natural camera motion
- Aspect ratio updates correctly on both window expansion and reduction
- Code follows consistent formatting and naming conventions
- HTML semantic structure with proper document title and meta tags

### Level 3: Exceptional Quality (Stretch)
- All Level 2 criteria met
- Cube material includes visible specular highlights demonstrating proper light interaction
- Camera FOV and near/far planes optimized for scene scale
- OrbitControls configured with reasonable min/max distance limits
- CSS includes smooth anti-aliased rendering on high-DPI displays
- Animation loop uses proper timestamp-based delta time (though not strictly required for uniform rotation)
- Code is formatted consistently with single-style quotes, 2-space indent, semicolons present

### Rejection Criteria
- TypeScript files present in project
- Framework dependencies in package.json
- JavaScript total exceeds 100 lines
- Background color is not 0x1a1a2e
- Canvas does not fill viewport or has visible margins/padding
- Cube does not rotate or animation is choppy/inconsistent
- OrbitControls do not function or cause errors
- Window resize breaks layout or requires manual page refresh

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**
This orbit operates within Tier 2 because it involves creating a complete project structure from scratch with multiple file creation and dependency installation requirements. While the scope is narrow and well-defined, the blast radius extends beyond single-file modifications:

- **Multiple file creation**: Four distinct files must be created with proper coordination
- **Dependency management**: Requires accurate package.json configuration with specific version constraints
- **Cross-file integration**: HTML must correctly reference JS/CSS, imports must resolve properly
- **Build tool configuration**: Vite must work correctly without explicit configuration beyond package.json

The trust tier elevation from Tier 1 is justified by:
- **First-time setup risk**: No existing codebase to reference means higher chance of structural errors
- **Dependency version sensitivity**: Three.js API changes between versions could break examples
- **Environment assumptions**: Node version requirements must be validated

The tier does not escalate to Tier 3 because:
- **No external systems**: No databases, APIs, or third-party services involved
- **No security implications**: Pure client-side rendering with no data handling
- **Clear acceptance criteria**: Success is visually and functionally verifiable
- **Limited scope**: Under 100 lines of logic reduces complexity risk
- **Reversible changes**: Entire project can be deleted and regenerated without system impact

Human review should verify: file structure correctness, dependency versions, successful local execution, and visual quality of rendered scene.

## Dependencies

### External Libraries
- **three**: ^0.160.0 — Core Three.js library providing WebGL rendering, scene graph, geometries, materials, and lighting
- **vite**: ^5.0.0 — Development server and build tool for ES module support and hot module replacement

### Runtime Environment
- **Node.js**: >=18.0.0 — Required for npm package management and Vite dev server
- **Modern browser**: Chrome 90+, Firefox 88+, Safari 14+, or equivalent with WebGL 2.0 support

### Prior Orbit Context
This is Orbit 3 in the trajectory. Previous orbits established:
- **Orbit 1-2**: Initial project structure and Three.js integration (artifacts in `.orbital/artifacts/a6b4c09a-*`)
- **Related orbit**: Prior orbit c71c2625 contains verification protocol and test results that may inform quality standards

No blocking dependencies exist — this orbit can proceed independently as it establishes the foundational project structure. Future orbits building on this starter may depend on this orbit's successful completion for baseline functionality.

### System Dependencies
- **Git**: Assumed present for repository operations
- **npm**: For dependency installation and script execution
- **.orbital infrastructure**: Artifact storage and tracking system (no direct code dependency)