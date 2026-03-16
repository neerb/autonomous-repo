# Three.js Minimal Starter Project

## Desired Outcome

A developer clones this repository, runs `npm install && npm run dev`, and sees a rotating 3D cube in their browser within 30 seconds. The viewport displays a smooth, interactive 3D scene with proper lighting, camera controls via mouse drag, and responsive behavior on window resize. The project serves as a minimal, copy-pasteable foundation for Three.js experiments without framework overhead or build complexity beyond Vite's defaults.

## Constraints

### Technology Stack
- **JavaScript Only:** No TypeScript, no JSX, no compile-to-JS languages
- **No Frameworks:** Vanilla JavaScript without React, Vue, Svelte, or similar abstractions
- **Vite as Build Tool:** Must use Vite's default configuration without custom plugins or config files beyond package.json scripts
- **Three.js Latest Stable:** Use npm's latest Three.js release (0.160.0 or newer) with ES6 module imports

### Code Complexity
- **Line Budget:** Total JavaScript in `src/main.js` must not exceed 100 lines including comments and whitespace
- **File Structure:** Exactly 4 files: `index.html`, `src/main.js`, `src/style.css`, `package.json`
- **No External Assets:** No image textures, model files, or fonts — geometry and materials only

### Visual Requirements
- **Canvas Coverage:** 3D canvas must fill 100% of viewport width and height with no scrollbars
- **Dark Background:** Scene background color must be `0x1a1a2e` or visually equivalent dark blue-gray
- **Standard Material:** Cube must use `MeshStandardMaterial` (not Basic or Phong) to demonstrate proper lighting interaction

### Performance Boundaries
- **60fps Target:** Animation loop must maintain 60fps on a 2019 MacBook Pro or equivalent (Intel i5, integrated graphics)
- **Render on Demand:** Must use `requestAnimationFrame` for render loop, not `setInterval` or `setTimeout`
- **Resize Handling:** Window resize must update camera aspect ratio and renderer size without memory leaks

### Scene Composition Rules
- **Single Geometry:** Exactly one cube (BoxGeometry) — no additional meshes, helpers, or debug objects
- **Two Lights Only:** One `AmbientLight` for base illumination, one `DirectionalLight` for shadows/highlights
- **Camera Position:** `PerspectiveCamera` must be positioned to frame the entire cube with margin (suggested Z distance: 5 units)
- **Rotation Axes:** Cube must rotate on both X and Y axes simultaneously with visible angular velocity (not just spinning on one axis)

### User Interaction
- **OrbitControls Required:** Must import and enable `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js`
- **Mouse Drag:** User can orbit camera around the cube by dragging with mouse/trackpad
- **No Keyboard Controls:** No WASD, arrow keys, or other keyboard input

### Non-Goals
- **No Shadows:** Do not enable shadow rendering (performance overhead for minimal starter)
- **No Post-Processing:** No bloom, anti-aliasing passes, or effect composers
- **No GUI Controls:** No dat.GUI, lil-gui, or similar parameter tweaking interfaces
- **No Loading States:** Scene initializes synchronously — no loading screens or async asset fetches

## Acceptance Boundaries

### Functional Completeness (MUST Pass)
| Criterion | Threshold |
|-----------|-----------|
| Scene renders on page load | Cube visible within 2 seconds of `npm run dev` |
| Cube rotation | Continuous rotation on X and Y axes visible to naked eye |
| OrbitControls respond | Camera position changes when dragging mouse across canvas |
| Window resize | Canvas reflows to new viewport dimensions without distortion |
| Console errors | Zero JavaScript errors in browser console during normal operation |

### Code Quality (MUST Pass)
| Criterion | Threshold |
|-----------|-----------|
| JavaScript line count | ≤ 100 lines in `src/main.js` |
| File structure | Exactly 4 files: `index.html`, `src/main.js`, `src/style.css`, `package.json` |
| ES6 module imports | All Three.js imports use `import` syntax (no `require`) |
| No unused code | No commented-out code blocks or unused variables |

### Visual Fidelity (SHOULD Pass)
| Criterion | Acceptable Range |
|-----------|------------------|
| Background color | `0x1a1a2e` ± 10% luminance (dark blue-gray family) |
| Cube material | `MeshStandardMaterial` with visible light reflections |
| Lighting balance | Cube faces show gradient from light to shadow (not flat color) |
| Camera FOV | 45-75 degrees (standard perspective, not fisheye or orthographic) |

### Performance (SHOULD Pass)
| Criterion | Acceptable Range |
|-----------|------------------|
| Frame rate | ≥ 55fps on reference hardware (2019+ laptop with integrated graphics) |
| Initial load time | First render within 3 seconds of page load on 10Mbps connection |
| Memory stability | No heap growth > 5MB over 60 seconds of idle animation |

### Developer Experience (NICE TO HAVE)
| Criterion | Acceptable Range |
|-----------|------------------|
| npm install time | < 60 seconds on first install |
| Hot reload | Vite HMR updates scene within 2 seconds of saving `main.js` |
| Code readability | Functions/sections separated by blank lines with logical grouping |

## Trust Tier Assignment

**Tier 2: Supervised**

**Rationale:**
This orbit involves validating and potentially regenerating a complete project structure with external dependencies (Three.js, Vite) and precise technical requirements. While the scope is small (4 files, ~100 lines), the risk profile includes:

- **Dependency Version Alignment:** Three.js 0.160.0+ introduces breaking changes in module paths (OrbitControls moved to `/examples/jsm/`). Incorrect import paths will cause runtime errors.
- **Build Tool Configuration:** Vite requires specific `package.json` structure (`"type": "module"`, correct script definitions) that must align with ES6 imports in source code.
- **Viewport CSS Precision:** Achieving true full-viewport canvas with no scrollbars requires exact CSS reset rules (margin, padding, overflow) that are easy to misconfigure.
- **Three.js API Surface:** While well-documented, Three.js has multiple camera types, material types, and lighting configurations. Using incorrect combinations (e.g., `MeshBasicMaterial` ignoring lights) would meet syntactic requirements but fail visual intent.
- **Validation vs. Regeneration Decision:** Orbit must read existing files from prior orbit c71c2625, determine compliance, and conditionally overwrite — this requires human review to confirm correct preservation/regeneration logic.

**Supervision Requirements:**
- **Pre-Execution Review:** Human reviews validation checklist and file generation plan to confirm correct criteria being applied
- **Post-Execution Validation:** Human runs `npm install && npm run dev` and visually confirms cube rotation, OrbitControls responsiveness, viewport coverage, and absence of console errors
- **File Preservation Verification:** Human confirms that compliant files from orbit c71c2625 were preserved and only non-compliant files were regenerated

**Not Tier 1 (Autonomous):** Too many external dependencies, precise CSS requirements, and need to make preservation-vs-regeneration decisions that could silently fail without visual confirmation.

**Not Tier 3 (Gated):** No security surface (no user input, no network requests, no file system access beyond dev server), no data persistence, and limited blast radius (worst case: developer deletes broken files and re-runs orbit or manually fixes).

## Dependencies

### External Dependencies
- **Three.js Library:** npm package `three` at version `^0.160.0` or later
  - Required modules: `THREE.Scene`, `THREE.PerspectiveCamera`, `THREE.WebGLRenderer`, `THREE.BoxGeometry`, `THREE.MeshStandardMaterial`, `THREE.Mesh`, `THREE.AmbientLight`, `THREE.DirectionalLight`
  - Required addon: `OrbitControls` from `three/examples/jsm/controls/OrbitControls.js`
- **Vite Build Tool:** npm package `vite` at version `^5.0.0` or later
  - Provides dev server, HMR, and ES6 module resolution without config file

### Environment Dependencies
- **Node.js Runtime:** Version 18.0.0 or higher (required by Vite 5.x)
- **npm Package Manager:** Version 8.0.0 or higher (bundled with Node.js 18+)
- **Modern Web Browser:** Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+ (WebGL 2.0 support required)

### Prior Orbit Dependencies
- **Orbit c71c2625-0f6b-441c-a24b-a5d187d1ae16:** Previous orbit created `package.json`, `index.html`, `src/main.js`, and `src/style.css`. Current orbit must validate these files against acceptance boundaries and conditionally regenerate only non-compliant files to minimize unnecessary filesystem mutations.

### File System Dependencies
- **Repository Root Access:** Must read and potentially write files at paths:
  - `./index.html`
  - `./src/main.js`
  - `./src/style.css`
  - `./package.json` (read-only validation — confirmed compliant in prior artifacts)
- **`src/` Directory:** Must exist before reading/writing `main.js` and `style.css`
- **Preserve Existing Files:** Do not modify `./README.md` or `./.orbital/` artifacts

### Knowledge Dependencies
- **Three.js Documentation:** Official docs at threejs.org for API reference (camera setup, renderer options, material properties)
- **Vite Documentation:** Official docs at vitejs.dev for package.json script configuration and module resolution behavior
- **WebGL Fundamentals:** Understanding of viewport coordinates, aspect ratios, and requestAnimationFrame timing