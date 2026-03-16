# Three.js Starter Project

## Desired Outcome

A developer can clone a repository, run `npm install && npm run dev`, and immediately see a functional 3D scene in their browser at `http://localhost:5173`. The scene displays a rotating cube with realistic lighting, responsive to window resizing, and interactive via mouse controls. This eliminates 2-3 hours of Three.js boilerplate setup, allowing developers to start experimenting with 3D graphics immediately.

The project serves as a validated learning template for developers new to Three.js who need a working foundation without framework complexity or TypeScript configuration overhead.

## Constraints

### Technical Boundaries
- **No frameworks**: React, Vue, Svelte, or any UI framework prohibited — vanilla JavaScript only
- **No TypeScript**: Pure `.js` files with no type annotations or compilation step
- **Code budget**: Total JavaScript must not exceed 100 lines in `src/main.js`
- **Dependency minimalism**: Only `three` and `vite` as production and dev dependencies respectively
- **Browser compatibility**: Must work in modern evergreen browsers (Chrome 90+, Firefox 88+, Safari 14+)

### Visual & Interaction Requirements
- Background color fixed at `0x1a1a2e` (dark blue-grey)
- Canvas must fill 100% of viewport with zero margin/padding/overflow
- Window resize must trigger immediate canvas and camera aspect ratio updates
- OrbitControls must be enabled and functional without additional configuration

### File Structure Immutability
Exactly four files required:
- `index.html` — HTML entry point
- `src/main.js` — Scene logic and render loop
- `src/style.css` — Canvas styling
- `package.json` — Dependencies and scripts

No additional configuration files (`.env`, `vite.config.js`, etc.) unless absolutely required by Vite defaults.

### Non-Goals
- Animation beyond basic rotation (particles, physics, post-processing out of scope)
- Asset loading (textures, models, fonts excluded)
- UI overlays or HUD elements
- Touch/mobile gesture support beyond default OrbitControls behavior
- Production build optimization or deployment configuration

## Acceptance Boundaries

### Critical (Must Pass)
- Running `npm install` completes without errors
- Running `npm run dev` starts a dev server accessible at `http://localhost:5173`
- A cube is visible and continuously rotating on both X and Y axes
- Scene contains exactly one `AmbientLight` and one `DirectionalLight`
- Cube uses `MeshStandardMaterial` (not `MeshBasicMaterial` or other types)
- Mouse drag rotates camera view (OrbitControls functional)
- Resizing browser window updates canvas dimensions without distortion
- Background color matches `0x1a1a2e` specification
- Total line count in `src/main.js` is ≤ 100 lines (excluding blank lines and comments)

### Acceptable (Quality Thresholds)
- **Performance**: 60 FPS on M1 MacBook Air at 1080p viewport (acceptable: 50+ FPS)
- **Lighting realism**: Cube faces show clear shading gradients (acceptable: any visible shading difference)
- **Rotation speed**: Cube completes one full rotation in 8-12 seconds (acceptable: 5-20 seconds)
- **Camera distance**: Cube fills approximately 30-50% of viewport (acceptable: 20-60%)
- **Code quality**: No unused imports, no console warnings, ESLint-clean if linted (acceptable: warnings only, no errors)

### Verification Signals
- Visual: Cube corners are sharp, not jagged (antialiasing enabled)
- Behavioral: Zooming with mouse wheel maintains cube in frame
- Structural: `package.json` contains only `three` and `vite` in dependencies
- Responsive: Canvas aspect ratio matches window aspect ratio at all sizes above 400x300px

## Trust Tier Assignment

**Assigned Tier: 2 (Supervised)**

### Rationale
This orbit qualifies for Tier 2 based on:

**Low Blast Radius**
- Creates a new standalone project from scratch (no existing codebase modification risk)
- No network calls, authentication, or data persistence
- Failure state is immediately visible (broken 3D scene or dev server error)
- Rollback is trivial (delete directory)

**Moderate Technical Risk**
- Three.js API is well-documented but version-sensitive (breaking changes in major releases)
- OrbitControls import path has changed across Three.js versions (potential import error)
- Window resize handlers can cause performance issues if implemented incorrectly
- Vite HMR may not refresh Three.js scene state properly without full reload

**Supervision Justification**
Human verification required for:
1. **Visual quality assessment**: AI cannot objectively measure "realistic lighting" or confirm rotation is "smooth"
2. **Performance validation**: 60 FPS target requires actual browser testing across devices
3. **Code budget enforcement**: 100-line limit needs human judgment on comment/whitespace counting conventions
4. **Developer experience**: AI cannot test the "clone → run → works" flow end-to-end

Tier 1 (Autonomous) rejected due to lack of automated visual regression testing for 3D scenes. Tier 3 (Gated) excessive given zero data/security risk and isolated project scope.

## Dependencies

### External Dependencies
- **Three.js library** (npm package `three`): Latest stable version from npm registry
  - Required for: `Scene`, `PerspectiveCamera`, `WebGLRenderer`, `BoxGeometry`, `MeshStandardMaterial`, `Mesh`, `AmbientLight`, `DirectionalLight`, `OrbitControls`
  - Risk: Major version updates may change import paths or API signatures

- **Vite build tool** (npm package `vite`): Version 5.x or later
  - Required for: Dev server with HMR, ES module resolution
  - Risk: Vite defaults may conflict with Three.js module imports in older versions

### System Requirements
- **Node.js**: Version 18.x or later (for Vite compatibility)
- **npm**: Version 9.x or later
- **Modern browser**: WebGL 2.0 support required for `WebGLRenderer`

### Prior Orbits
None — this is a greenfield initialization orbit with no trajectory history.

### Implicit Assumptions
- Developer has Git installed for repository cloning
- Developer has write permissions in target directory
- Port 5173 is available (Vite default dev server port)
- System supports OpenGL/Metal/DirectX for WebGL rendering