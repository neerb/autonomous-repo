# Three.js Minimal Starter Project

## Desired Outcome

A developer can clone or initialize this repository, run a single command (`npm install && npm run dev`), and immediately see a functioning Three.js scene with an interactive rotating cube in their browser. The project serves as a minimal, educational starting point for learning Three.js with modern tooling (Vite), requiring no additional configuration or setup steps. The outcome demonstrates that modern 3D web development can be accessible with under 100 lines of vanilla JavaScript, no framework complexity, and instant hot-reload during development.

## Constraints

### Technology Stack
- **Build Tool:** Vite only — no Webpack, Rollup, or other bundlers
- **Language:** Vanilla JavaScript (ES modules) — no TypeScript, no Babel transforms
- **3D Library:** Three.js latest stable version (^0.160.0 or newer)
- **Frameworks:** None — no React, Vue, Svelte, or any component framework

### Code Complexity
- **Line Count:** Total JavaScript in `src/main.js` must not exceed 100 lines (excluding blank lines and comments)
- **File Structure:** Exactly 4 files: `index.html`, `src/main.js`, `src/style.css`, `package.json`
- **Dependencies:** Only `three` (production) and `vite` (dev) in package.json

### Visual Requirements
- **Background Color:** Dark theme with scene background set to `0x1a1a2e` or similar dark hex value
- **Canvas Layout:** Full-viewport canvas with no margins, padding, or scroll bars
- **Responsive:** Canvas must automatically resize when browser window dimensions change

### Scene Architecture
- **Geometry:** Single cube (BoxGeometry) only — no additional meshes
- **Material:** MeshStandardMaterial — requires lighting to be visible
- **Lighting:** Exactly two light sources: one AmbientLight and one DirectionalLight
- **Camera:** PerspectiveCamera with FOV, aspect ratio, near/far planes configured for a visible cube
- **Controls:** OrbitControls imported from `three/examples/jsm/controls/OrbitControls.js` for camera manipulation
- **Animation:** Continuous rotation on both X and Y axes using `requestAnimationFrame`

### Non-Goals
- **Advanced Features:** No post-processing, shadows, textures, models, or particle systems
- **Testing:** No unit tests, integration tests, or E2E tests required
- **Documentation:** No inline JSDoc comments or README tutorials beyond basic setup
- **Build Output:** No production build optimization or distribution artifacts

## Acceptance Boundaries

### Functional Completeness
| Criterion | Minimum Acceptable | Ideal |
|-----------|-------------------|-------|
| Scene renders on page load | Cube visible within 2 seconds of page load | Cube visible within 500ms |
| Rotation animation | Smooth 60fps rotation visible on both axes | No frame drops, consistent rotation speed |
| Window resize handling | Canvas resizes without page refresh | Canvas and camera aspect update within one frame |
| OrbitControls responsiveness | Camera responds to mouse drag/scroll | Smooth damping, no input lag |

### Code Quality
| Criterion | Minimum Acceptable | Ideal |
|-----------|-------------------|-------|
| JavaScript line count | ≤ 100 lines in `src/main.js` | ≤ 80 lines with clear structure |
| Dependency count | Exactly 2 (three + vite) | No additional dependencies |
| Browser console errors | Zero errors on load | Zero errors or warnings |
| CSS specificity | No `!important` flags | Minimal, semantic selectors |

### Developer Experience
| Criterion | Minimum Acceptable | Ideal |
|-----------|-------------------|-------|
| Setup time | `npm install && npm run dev` succeeds | Vite dev server starts in < 5 seconds |
| Hot reload | Vite HMR works for JS changes | HMR preserves cube rotation state |
| File structure clarity | All 4 files present and named correctly | File names match standard Vite conventions |

### Visual Fidelity
| Criterion | Minimum Acceptable | Ideal |
|-----------|-------------------|-------|
| Lighting visibility | Cube faces show distinct shading | Shadows create depth perception |
| Background color | Matches `0x1a1a2e` or similar dark tone | Contrast allows cube edges to be visible |
| Cube appearance | Recognizable as 3D cube | Edges crisp, no aliasing artifacts |

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

### Rationale

**Why Not Tier 1 (Autonomous):**
- This is a greenfield project initialization with zero existing codebase structure to reference
- The repository currently contains only ORBITAL metadata artifacts — no production code exists
- File creation decisions (naming, placement) will establish patterns for future work
- Incorrect Three.js API usage (e.g., wrong import paths, deprecated methods) could teach wrong patterns

**Why Not Tier 3 (Gated):**
- No integration with external services, databases, or production systems
- No security-sensitive operations (authentication, data validation, API keys)
- No risk of data loss or corruption — this is net-new file creation
- Failure mode is benign: a non-working demo that can be discarded and regenerated

**Tier 2 Justification:**
- Requires human verification that generated code follows Three.js best practices (current API patterns, proper disposal patterns for future memory management)
- Human should confirm Vite configuration aligns with modern conventions (ES module setup, import paths)
- Visual output requires subjective human judgment: "Does this look right?" is not automatable
- Establishes foundational patterns that will influence subsequent orbits — worth a human checkpoint

### Supervision Checkpoints
1. **Pre-execution:** Review file paths and package.json structure
2. **Post-generation:** Run `npm run dev` and visually confirm scene renders correctly
3. **Code review:** Verify Three.js imports use correct paths (not deprecated `three/build` pattern)
4. **Performance check:** Confirm animation runs at stable 60fps in browser dev tools

## Dependencies

### External Dependencies
- **Node.js:** Version ≥18.0.0 required for Vite compatibility (specified in package.json engines field)
- **npm:** Package manager for dependency installation (or yarn/pnpm equivalents)
- **Modern Browser:** Chrome/Firefox/Safari with WebGL 2.0 support for Three.js rendering

### Three.js Ecosystem
- **Core Library:** `three` package from npm, version ^0.160.0 or compatible
- **OrbitControls:** Imported from Three.js examples directory (`three/examples/jsm/controls/OrbitControls.js`)
- **WebGL Context:** Browser must provide WebGLRenderingContext (automatically handled by Three.js)

### Build Tooling
- **Vite Dev Server:** Must support ES module hot reload and bare import resolution for `three`
- **Module Resolution:** Vite must resolve `node_modules/three` imports without additional configuration

### No Prior Orbit Dependencies
- This is orbit #2 but does not depend on orbit #1 deliverables
- Existing `.orbital/artifacts/*` files are metadata only — not code dependencies
- Repository structure shows no prior working codebase to integrate with

### Environmental Assumptions
- Repository is cloned or initialized in a local filesystem with write permissions
- Network access available for `npm install` to fetch packages from npmjs.com
- No corporate proxy, firewall, or npm registry mirror configuration required