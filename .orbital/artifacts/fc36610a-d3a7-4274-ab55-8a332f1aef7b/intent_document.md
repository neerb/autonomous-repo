# Three.js Minimal Starter Project

## Desired Outcome

A working Three.js development environment that allows developers to immediately begin 3D web experimentation. When complete, running `npm install && npm run dev` will launch a browser showing a smooth, interactive 3D scene with a rotating cube that responds to mouse controls. The project serves as a copy-paste foundation for learning Three.js fundamentals without framework overhead or build configuration complexity.

**Success looks like:** A developer with no prior Three.js experience can clone, install, and see a rendered 3D scene in under 2 minutes. They can immediately modify cube properties, lighting, or camera position in `src/main.js` and see results via hot module reload. The codebase is simple enough to understand in a single read-through.

## Constraints

### Technical Boundaries
- **No frameworks:** React, Vue, Angular, Svelte, or any component-based UI library is prohibited
- **No TypeScript:** Use vanilla JavaScript (ES modules) only
- **No build complexity:** Vite configuration must remain implicit (no `vite.config.js` unless absolutely required for asset handling)
- **Line budget:** `src/main.js` must remain under 100 lines including whitespace and comments
- **Browser target:** Modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+) with WebGL 2.0 support

### Scene Requirements (Non-Negotiable)
- **Camera:** PerspectiveCamera with field of view suitable for desktop viewing (45-75 degrees)
- **Renderer:** WebGLRenderer with antialiasing enabled, canvas fills entire viewport
- **Geometry:** Single cube (BoxGeometry) at world origin
- **Material:** MeshStandardMaterial (requires lighting to be visible)
- **Lighting:** Exactly one AmbientLight and one DirectionalLight
- **Animation:** Continuous rotation on both X and Y axes via `requestAnimationFrame`
- **Interactivity:** OrbitControls from `three/examples/jsm/controls/OrbitControls.js`
- **Background:** Dark color scheme (0x1a1a2e or similar dark blue/gray)

### Visual Standards
- **No default white background:** Scene background must be explicitly set to a dark color
- **Responsive canvas:** Must resize properly when browser window changes dimensions
- **No scroll bars:** CSS must eliminate page scrolling via `margin: 0; padding: 0; overflow: hidden`
- **Full viewport:** Canvas must occupy 100vw × 100vh without letterboxing

### Performance
- **60 FPS target:** Animation loop must maintain smooth frame rate on mid-range hardware (Intel Iris Xe, M1 base)
- **Minimal dependencies:** Only `three` and `vite` in dependencies, no additional libraries
- **Fast startup:** `npm run dev` to visible scene in under 3 seconds on localhost

### Non-Goals
- No textures or advanced materials (keep MeshStandardMaterial with solid color)
- No shadows (performance overhead for a starter)
- No post-processing effects
- No multiple objects or complex scene graphs
- No GUI controls (dat.gui, lil-gui, etc.)
- No physics engines
- No loading screens or progress indicators

## Acceptance Boundaries

### Critical (Must Pass)
| Criterion | Threshold |
|-----------|-----------|
| Project initialization | `npm install` completes without errors on Node 18+ |
| Development server | `vite` starts successfully and serves on localhost:5173 |
| Scene renders | Cube is visible and correctly lit when page loads |
| Animation works | Cube rotates continuously on X and Y axes without stuttering |
| Controls respond | Mouse drag rotates camera, scroll zooms, right-click pans |
| Window resize | Canvas resizes without distortion when browser window changes |
| Code line count | `src/main.js` is 100 lines or fewer (including blank lines) |
| Dependencies | Only `three` and `vite` present in package.json dependencies |

### Important (Should Pass)
| Criterion | Threshold |
|-----------|-----------|
| Background color | Scene background is 0x1a1a2e or similar dark tone |
| Lighting quality | Cube faces show clear brightness differentiation (not flat-shaded appearance) |
| Camera position | Cube is centered in viewport at comfortable viewing distance (not clipped or tiny) |
| HMR works | Editing `src/main.js` and saving triggers hot reload without full page refresh |
| File structure | Exactly 4 files: `index.html`, `src/main.js`, `src/style.css`, `package.json` |
| Antialiasing | Cube edges appear smooth, not jagged (antialiasing enabled) |

### Nice to Have (Improved Quality)
| Criterion | Threshold |
|-----------|-----------|
| Code comments | Key setup steps have single-line comments explaining purpose |
| README.md | Includes quick start instructions and controls reference |
| Semantic HTML | `index.html` uses proper meta tags (charset, viewport) |
| CSS reset | Body margin/padding explicitly zeroed, overflow hidden on html and body |
| OrbitControls config | Sensible defaults (damping enabled, auto-rotate disabled) |

### Out of Scope (Rejection Criteria)
- TypeScript files (`.ts`) in source
- Framework imports (React, Vue components)
- Multiple scenes or cameras
- Custom Vite configuration beyond defaults
- External asset files (textures, models, fonts)
- More than 100 lines in `src/main.js`

## Trust Tier Assignment

**Assigned Tier:** 2 (Supervised)

### Rationale

This orbit operates in a **Tier 2 - Supervised** trust model because:

1. **Low blast radius:** Creating a new starter project from scratch has no risk of damaging existing systems, production data, or user-facing functionality. Failure only affects the new project directory.

2. **Moderate complexity:** While Three.js setup follows well-documented patterns, the 100-line constraint requires careful architectural decisions about what to include/exclude. File structure, import paths, and Vite-specific module resolution need human validation.

3. **Ambiguity in "minimal":** The requirement balances multiple concerns (completeness, simplicity, educational value) that require judgment calls. For example, whether to include `renderer.shadowMap.enabled = true` or stick to the "no shadows" non-goal.

4. **No automated verification:** Unlike API endpoints or database migrations, a 3D scene's correctness is partially subjective. "Looks right" and "feels responsive" require human sensory validation beyond unit tests.

5. **Educational purpose:** This starter is for learning — if the AI misinterprets Three.js best practices (e.g., using deprecated APIs), it could teach incorrect patterns to developers. Human review ensures pedagogical quality.

**Human verification required:**
- Visual inspection: Does the cube render correctly with proper lighting?
- Interaction testing: Do OrbitControls respond smoothly?
- Code review: Is `src/main.js` clear, idiomatic, and under 100 lines?
- HMR validation: Does hot reload work without full page refresh?

A Tier 1 (Autonomous) model would be appropriate if this were generating a config file from a schema, or a Tier 3 (Gated) model if modifying a production Three.js application with user traffic.

## Dependencies

### External Dependencies
- **Node.js runtime:** Version 18.0.0 or higher (specified in `package.json` engines field)
- **npm package registry:** Must be accessible for `npm install` to fetch `three` and `vite`
- **Browser WebGL support:** Target browser must support WebGL 2.0 (automatic fallback not required)

### Package Dependencies
- **three:** Version ^0.160.0 or latest stable release
  - Core library for Scene, Camera, Renderer, Geometry, Material
  - OrbitControls from `three/examples/jsm/controls/OrbitControls.js`
- **vite:** Version ^5.0.0 or latest stable release
  - Development server with HMR
  - ES module resolution for Three.js imports

### Knowledge Dependencies
- **Three.js API patterns:** Standard initialization sequence (Scene → Camera → Renderer → Geometry → Material → Mesh → Lights → Controls → Animation Loop)
- **Vite conventions:** ES module imports, implicit index.html serving, HMR via `import.meta.hot`
- **CSS viewport units:** Understanding of `100vw`, `100vh`, and `box-sizing: border-box` for full-screen canvas

### No Internal Dependencies
This is a greenfield project with no dependencies on:
- Existing repository code
- Prior orbits or trajectories
- Shared libraries or internal packages
- Backend APIs or data services
- CI/CD pipelines (development-only project)

### Verification Dependencies
Successful completion requires:
- Human with working browser (Chrome/Firefox/Safari)
- Visual confirmation of rendered scene
- Mouse interaction testing for OrbitControls
- Terminal access to run `npm install` and `npm run dev`