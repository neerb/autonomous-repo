# Three.js Starter Project

## Desired Outcome

A developer can initialize a minimal Three.js development environment in under 60 seconds using modern tooling. Upon running `npm install && npm run dev`, the browser displays a visually correct 3D scene with interactive camera controls and smooth animation. The project serves as an immediate starting point for 3D web experiments without framework overhead or TypeScript complexity.

When complete:
- A new developer clones the repository, runs two commands, and sees a rotating cube in their browser
- The scene demonstrates core Three.js concepts (geometry, materials, lighting, camera, controls) in under 100 lines of readable JavaScript
- The development server provides instant hot-reload for rapid iteration
- The viewport fills the entire browser window with no white margins or scroll bars

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

### Visual Requirements
- Canvas background color: `0x1a1a2e` (dark blue-gray)
- Cube must have visible edges and surface detail (not flat shaded)
- Scene must be well-lit enough to distinguish cube faces
- No loading spinners, splash screens, or UI overlays

### Structural Requirements
- **Exact file structure:**
  - `index.html` — HTML entry point
  - `src/main.js` — Scene setup and render loop
  - `src/style.css` — Canvas styling
  - `package.json` — Dependencies and scripts
- No additional configuration files (`.eslintrc`, `vite.config.js`, etc.)
- No subdirectories beyond `src/`

### Performance Constraints
- Animation must maintain 60fps on mid-range hardware (2020+ laptop with integrated graphics)
- Window resize must recalculate aspect ratio and camera projection without visual glitches
- OrbitControls damping must feel responsive (no laggy or jittery camera movement)

### Non-Goals
- Production builds or deployment configuration
- Mobile touch controls (OrbitControls mouse interaction only)
- Accessibility features (ARIA, keyboard navigation)
- Multiple scenes, post-processing, or advanced rendering techniques
- Documentation beyond a minimal README

## Acceptance Boundaries

### Functional Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Scene initialization** | Scene renders within 5 seconds on `npm run dev` | Scene renders within 2 seconds | Instant render (< 500ms) |
| **Animation smoothness** | 30fps minimum, no stuttering | Consistent 60fps | 60fps with browser devtools open |
| **Cube rotation** | Visible rotation on at least one axis | Rotation on both X and Y axes at same speed | Visually pleasing rotation speed (0.01 radians/frame) |
| **Window resize** | Canvas resizes without page refresh | Canvas and camera update within 100ms | Seamless resize with no visible flicker |
| **OrbitControls** | Camera can rotate around cube | Camera can rotate, pan, and zoom smoothly | Damping enabled for smooth deceleration |

### Code Quality Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **JavaScript line count** | Under 120 lines (with comments) | Under 100 lines (code only) | Under 80 lines (code only) |
| **Dependency count** | `three` and `vite` only | Same | Same + `package-lock.json` integrity verified |
| **Code readability** | Variable names are descriptive | Functions have single-line comments | Code is self-documenting without comments |

### Visual Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Lighting** | Cube faces are distinguishable | Cube has visible highlights and shadows | Lighting creates depth and dimension |
| **Background color** | Dark color (any hex value) | `0x1a1a2e` or visually equivalent | Exact `0x1a1a2e` |
| **Canvas coverage** | No white margins on desktop viewport | Full viewport coverage, no scrollbars | Responsive across 1920x1080 and 1366x768 viewports |

### Developer Experience Acceptance
| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Setup time** | Under 5 minutes from clone to running dev server | Under 2 minutes | Under 60 seconds |
| **Hot reload** | Changes require page refresh | Changes reflect within 2 seconds | Changes reflect instantly (< 500ms) |
| **Error handling** | Browser console shows WebGL errors if any | No console errors on successful render | No console warnings or logs |

### Failure Modes (Must Not Occur)
- Black screen with no error message
- Cube renders but does not rotate
- OrbitControls fail to respond to mouse input
- Canvas does not fill viewport (white margins visible)
- Browser throws WebGL context loss errors
- Dev server fails to start on port 5173 without clear error message

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit involves creating a new codebase from scratch with specific structural and technical constraints. While the scope is small and the risk of breaking existing systems is zero, several factors require human oversight:

1. **Ambiguity in "minimal":** The 100-line constraint is clear, but decisions about code organization (single function vs. multiple helper functions) and naming conventions require human judgment to ensure readability.

2. **Visual acceptance is subjective:** "Well-lit" and "visually pleasing rotation speed" are not algorithmically verifiable. A human must confirm the scene meets aesthetic expectations.

3. **First-time setup risk:** This project establishes patterns for future Three.js work in this repository. Architectural decisions (file structure, import patterns, initialization order) should be validated before they become implicit standards.

4. **Performance variability:** The 60fps constraint depends on hardware and browser. Automated testing cannot validate this across target environments without manual verification on representative devices.

**Autonomous Candidacy:** This orbit could become Tier 1 after demonstrating that:
- Generated code consistently passes visual and performance checks across multiple runs
- The ORBITAL system establishes automated visual regression testing (screenshot diffing)
- A reference implementation exists to serve as a known-good baseline

**Escalation Trigger:** Escalate to Tier 3 (Gated) if:
- The orbit requires integration with existing Three.js projects (higher blast radius)
- WebGL compatibility issues arise that require browser-specific workarounds
- Performance profiling reveals frame-rate degradation under specific conditions

## Dependencies

### External Dependencies
- **Three.js library:** Latest stable release from npm registry (0.160.x or higher). Must include `OrbitControls` as an importable module from `three/examples/jsm/controls/OrbitControls.js`.
- **Vite build tool:** Version 5.x or higher. Must support ES6 module imports and provide a development server with hot module replacement.
- **Node.js runtime:** Version 18.0.0 or higher to ensure compatibility with Vite's native ESM support.
- **Modern browser:** Chrome 90+, Firefox 88+, Safari 14.1+, or Edge 90+ with WebGL 2.0 support.

### Repository Dependencies
- **None:** This is a greenfield project with no dependencies on existing code, services, or prior orbits.
- **Future Dependency:** This starter project may serve as a template or reference implementation for subsequent Three.js-related intents. Any breaking changes to the file structure or initialization patterns should be documented.

### Implicit Dependencies
- **WebGL availability:** The target execution environment must have a GPU capable of hardware-accelerated rendering. Software rendering fallbacks are not required.
- **Network access during setup:** `npm install` requires access to the npm registry. No runtime network dependencies exist after installation.