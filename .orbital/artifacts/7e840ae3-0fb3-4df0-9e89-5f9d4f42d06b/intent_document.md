# Three.js Starter Project

## Desired Outcome

A developer can clone this repository, run a single command (`npm install && npm run dev`), and immediately see a rotating 3D cube in their browser with working camera controls. The project serves as a clean foundation for learning Three.js fundamentals or bootstrapping new 3D web experiments without wrestling with build configuration or boilerplate.

When complete, the repository will contain a minimal but complete 3D scene that demonstrates:
- Proper Three.js initialization and render loop patterns
- Responsive viewport handling that works on any screen size
- Interactive camera controls for exploring 3D space
- Basic lighting setup that makes objects visible and dimensional

## Constraints

### Technology Boundaries
- **Vanilla JavaScript only** — no frameworks (React, Vue, Svelte), no TypeScript, no JSX
- **Three.js version ≥ 0.160.0** — use modern import patterns, not legacy global namespace
- **Vite as build tool** — do not introduce webpack, parcel, or custom build scripts
- **ES modules** — use `import/export` syntax, not CommonJS `require()`

### Code Simplicity
- **Total JavaScript code ≤ 100 lines** in `src/main.js` — excluding blank lines and imports
- **No external CSS frameworks** — plain CSS only in `src/style.css`
- **No additional npm dependencies** beyond `three` and `vite`

### Visual Requirements
- **Dark background color** — scene background must be `0x1a1a2e` or visually equivalent dark tone
- **Full viewport rendering** — canvas fills entire browser window with no scrollbars or margins
- **Visible cube** — geometry must be clearly visible against the dark background with proper lighting

### Scene Composition Rules
- **Exactly one rotating cube** — no additional geometries or scene objects beyond lights and camera
- **MeshStandardMaterial required** — not BasicMaterial, not PhongMaterial
- **Two light sources** — one AmbientLight and one DirectionalLight, no more
- **OrbitControls enabled** — must support mouse-based camera rotation and zoom

### Animation Specifications
- **Continuous rotation** — cube rotates on both X and Y axes every frame
- **requestAnimationFrame loop** — do not use setInterval or setTimeout for rendering
- **Responsive resize handling** — camera aspect ratio and renderer size update on window resize

### File Structure Lock
The exact file structure must be:
```
/
├── index.html
├── package.json
├── src/
│   ├── main.js
│   └── style.css
```

No additional directories, no config files beyond package.json, no nested src structure.

## Acceptance Boundaries

### Functionality Thresholds

**Minimum Viable (Tier 2 Gate)**
- Running `npm run dev` starts a local server without errors
- Browser displays a visible rotating cube
- Mouse drag rotates the camera viewpoint
- Window resize does not break rendering

**Target Quality (Preferred Outcome)**
- Cube rotation speed is visually smooth (not too fast or slow)
- Lighting creates clear depth perception on cube faces
- OrbitControls feel responsive with no lag on standard hardware
- Code is readable with logical variable names

**Excellence Markers (Beyond Requirements)**
- Camera positioned to show cube at optimal viewing angle on load
- Lighting balanced so all cube faces are distinguishable
- Animation runs at stable 60fps on mid-tier hardware
- Code includes brief inline comments explaining Three.js concepts

### Code Quality Metrics
- **Line count**: 80-100 lines in main.js (excluding imports/blank lines)
- **Import clarity**: Three.js imports use named imports, not wildcard `* as THREE`
- **No console errors**: Browser console clean on page load and during interaction
- **CSS specificity**: No `!important` rules, no inline styles

### Performance Bounds
- **Initial load time**: < 2 seconds on standard broadband (not counting npm install)
- **Frame rate**: ≥ 30fps sustained on 4-year-old laptop hardware
- **Memory stability**: No memory leaks during 5 minutes of continuous interaction

### Failure Conditions (Automatic Rejection)
- Cube does not rotate
- OrbitControls non-functional or missing
- TypeScript files present in repository
- Additional npm dependencies beyond three and vite
- Frameworks (React/Vue/etc.) introduced
- JavaScript exceeds 100 lines

## Trust Tier Assignment

**Assigned Tier: 2 (Supervised)**

**Rationale:**
This orbit operates under Tier 2 supervision because:

1. **Greenfield project creation** — establishing new file structure and dependency configuration carries moderate risk of misalignment with developer workflow expectations

2. **No existing codebase constraints** — the AI has full creative freedom within stated constraints, increasing the likelihood of subjective implementation choices that may not match unstated preferences

3. **Multiple integration points** — coordination between HTML, CSS, JavaScript, package.json, and Vite configuration creates surface area for subtle misconfigurations

4. **Learning resource intent** — this starter is likely to be studied or modified by developers learning Three.js, so code clarity and best practices matter beyond functional correctness

5. **Low blast radius** — failure only affects this isolated project, no production systems or user data at risk

**Tier 1 (Autonomous) not appropriate because:**
- No test suite exists to validate correctness automatically
- Visual quality and code readability are subjective and require human judgment
- No established patterns in the codebase to follow (it's net-new)

**Tier 3 (Gated) not required because:**
- No security implications or user data involved
- No existing systems to break or integrate with
- Reversible with `git reset --hard` if outcome is unsatisfactory

## Dependencies

### External Dependencies
- **Node.js ≥ 18.0.0** — required for Vite and npm ecosystem
- **npm or compatible package manager** — for installing three and vite
- **Modern web browser** — with WebGL support (Chrome, Firefox, Safari, Edge)

### Codebase Dependencies
- **None** — this is a greenfield project with no existing orbits or modules to integrate with

### Knowledge Dependencies
- **Three.js documentation patterns** — the AI must apply current Three.js API conventions (post-r150 import syntax)
- **Vite default behaviors** — understanding of Vite's dev server and module resolution
- **WebGL compatibility** — awareness of browser rendering capabilities and common pitfalls

### Temporal Dependencies
- **Three.js version stability** — the implementation assumes version 0.160.0 remains the "latest" as specified; if the user intends true latest-latest, package.json should use `"three": "^0.160.0"` or `"three": "latest"`

### Assumed Pre-Conditions
- Repository exists and is initialized with git
- Developer has permission to create files in the repository root and src/ directory
- No conflicting files exist at the target paths (index.html, package.json, src/*)