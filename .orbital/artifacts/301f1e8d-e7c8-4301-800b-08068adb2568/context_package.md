# Context Package: Three.js Starter Project

## Codebase References

### Existing Files Requiring Modification

**package.json** (root)
- Current state: Already configured with correct dependencies (three ^0.160.0, vite ^5.0.0)
- Status: Complete and compliant with Intent requirements
- No modifications needed: Dependencies, scripts, and engines field already match specifications

**index.html** (root)
- Current state: File exists but contents unknown
- Required integration: Must reference `src/main.js` as ES module entry point
- Required integration: Must include viewport meta tag for responsive behavior
- Action: Verify structure or replace with minimal HTML5 template

**src/main.js** (src/)
- Current state: File exists but contents unknown
- Purpose: Complete Three.js scene setup and animation loop
- Imports required:
  - `three` — Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Color
  - `three/examples/jsm/controls/OrbitControls.js` — OrbitControls class
- Scope: Must contain all scene initialization, render loop, and window resize handler
- Constraint: Total lines must not exceed 100

**src/style.css** (src/)
- Current state: File exists but contents unknown
- Purpose: Full-viewport canvas styling with zero margin/padding
- Required rules:
  - Body/HTML reset (margin: 0, padding: 0, overflow: hidden)
  - Canvas sizing (width: 100vw, height: 100vh, display: block)
- Scope: Minimal CSS focused solely on viewport fill behavior

**README.md** (root)
- Current state: "Testing purposes" placeholder text
- Status: Outside scope of Intent requirements (non-goal)
- Action: No modifications required per Intent constraints

### Files Not Requiring Modification

**.orbital/artifacts/** (all subdirectories)
- Purpose: ORBITAL system metadata and prior orbit artifacts
- Status: Read-only reference material
- Relevance: Orbit 301f1e8d (current), a6b4c09a (prior incomplete), and c71c2625 (complete example) contain patterns

### Vite Configuration

**vite.config.js**
- Current state: Absent (not in repository structure)
- Vite behavior: Defaults to zero-config setup when no config file exists
- Intent alignment: "No configuration files beyond Vite defaults" constraint satisfied
- Action: Do not create — rely on Vite's automatic ES module handling

## Architecture Context

### Project Structure Pattern

```
threejs-starter/
├── index.html          # Entry point (loads main.js as module)
├── package.json        # Dependencies + dev script
├── src/
│   ├── main.js        # Scene setup + animation loop
│   └── style.css      # Viewport styling
└── .orbital/          # System artifacts (read-only)
```

This is a **flat, minimal architecture** with no abstraction layers:
- Single HTML file serves as application entry point
- Single JavaScript file contains all application logic
- Single CSS file handles all styling
- No build output directory — Vite serves from memory during development

### Data Flow Architecture

**Initialization Flow:**
1. Browser loads `index.html`
2. HTML references `src/style.css` (stylesheet link)
3. HTML loads `src/main.js` as ES module (type="module")
4. main.js imports Three.js classes from node_modules
5. main.js creates scene graph: Scene → Camera, Lights, Mesh
6. main.js initializes WebGLRenderer and appends canvas to DOM
7. main.js starts animation loop via requestAnimationFrame

**Runtime Flow:**
1. Browser invokes animation function each frame (~60fps)
2. Animation function updates mesh rotation properties
3. Animation function calls renderer.render(scene, camera)
4. OrbitControls updates camera position based on mouse input
5. Window resize event triggers camera aspect + renderer size update

**No persistent state:** All state lives in memory during browser session. No localStorage, no backend communication, no routing.

### Infrastructure Constraints

**Development Server:**
- Vite dev server runs on localhost (default port 5173)
- Hot module replacement enabled by default
- ES module imports resolved from node_modules/
- No build step required for development execution

**Browser Environment:**
- WebGL 2.0 context required for Three.js rendering
- requestAnimationFrame provides frame timing (browser-managed)
- Window object provides resize events and viewport dimensions
- No service workers, web workers, or background processes

**Deployment Context:**
- Development-only project (Intent explicitly states "not production-ready")
- No build output, CDN hosting, or static site generation
- No environment variables or runtime configuration

### Design Patterns in Scope

**Imperative Scene Graph Construction:**
- Direct instantiation of Three.js objects (no factory functions)
- Explicit parent-child relationships via `scene.add(mesh)`
- Immediate execution pattern (no deferred initialization)

**Imperative Animation Loop:**
- Single recursive function using requestAnimationFrame
- Direct property mutation for rotation (mesh.rotation.x += delta)
- Inline render call (no separate render abstraction)

**Event-Driven Responsiveness:**
- Window resize listener attached during initialization
- Listener directly updates camera and renderer properties
- No debouncing or throttling (acceptable for minimal project)

## Pattern Library

### Naming Conventions

**Variables:**
- Lowercase with descriptive names: `scene`, `camera`, `renderer`, `cube`, `controls`
- No Hungarian notation or type prefixes
- Three.js objects named by their purpose, not class name (e.g., `cube` not `boxMesh`)

**Functions:**
- camelCase for function names: `animate()`, `handleResize()`
- Descriptive verb-based names for event handlers

**Constants:**
- Hexadecimal color values: `0x1a1a2e` (background), `0xffffff` (light colors)
- No separate constants section — inline values acceptable for minimal project

### Import Style

**ES Module Pattern:**
```javascript
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Characteristics:**
- Named imports for Three.js core classes (destructured from 'three')
- Named import for OrbitControls from examples/jsm path (not addons)
- No default imports
- No import aliases or renaming

### Three.js API Usage Patterns

**Camera Configuration:**
```javascript
const camera = new PerspectiveCamera(fov, aspect, near, far);
camera.position.z = distance;
```
- Standard perspective projection
- Position on Z-axis to frame scene
- Aspect ratio from window.innerWidth / window.innerHeight

**Renderer Setup:**
```javascript
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
```
- Antialiasing enabled for smooth edges
- Size matches viewport dimensions
- Pixel ratio accounts for high-DPI displays
- Canvas appended directly to body

**Background Color Pattern:**
```javascript
scene.background = new Color(0x1a1a2e);
```
- Requires Color import from 'three'
- Hexadecimal color value specified in Intent

**Material Pattern:**
```javascript
const material = new MeshStandardMaterial({ color: 0xcolor });
```
- MeshStandardMaterial for physically-based rendering
- Requires lights to be visible (not self-emissive)
- Color specified as hexadecimal integer

**Lighting Pattern:**
```javascript
const ambientLight = new AmbientLight(0xffffff, intensity);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, intensity);
directionalLight.position.set(x, y, z);
scene.add(directionalLight);
```
- Ambient provides base illumination (no shadows)
- Directional provides directional lighting (simulates sun)
- Both added to scene

**Animation Loop Pattern:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update rotations
  mesh.rotation.x += delta;
  mesh.rotation.y += delta;
  // Update controls
  controls.update();
  // Render frame
  renderer.render(scene, camera);
}
animate();
```
- Recursive self-invocation via requestAnimationFrame
- Controls updated before render (required for damping)
- Single render call per frame

### CSS Reset Pattern

**Viewport Fill:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  display: block;
}
```
- Universal selector reset eliminates all default spacing
- Overflow hidden prevents scrollbars
- Canvas set to block display to remove inline spacing
- No explicit canvas dimensions — handled by JavaScript

## Prior Orbit References

### Orbit 301f1e8d (Current Orbit)

**Artifacts Present:**
- `.orbital/artifacts/301f1e8d-e7c8-4301-800b-08068adb2568/intent_document.md` — Current Intent
- `.orbital/artifacts/301f1e8d-e7c8-4301-800b-08068adb2568/context_package.md` — This document
- `.orbital/artifacts/301f1e8d-e7c8-4301-800b-08068adb2568/proposal_record.md` — Implementation plan (sibling artifact)

**Status:** In progress (context phase)

**Key Decisions from Proposal:**
- Full file replacement strategy adopted for index.html, src/main.js, src/style.css
- 48-line implementation in main.js (52-line buffer under 100-line constraint)
- Color import identified as required for scene.background assignment
- OrbitControls damping configuration specified (enableDamping=true, dampingFactor=0.05)
- Camera positioned at z=5 to frame 2x2x2 cube
- Lighting balance: Ambient 0.5, Directional 0.8 at position (5,5,5)
- Cube material color 0x00ff88 (teal) for contrast with dark background

### Orbit a6b4c09a (Prior Three.js Work)

**Artifacts Present:**
- `.orbital/artifacts/a6b4c09a-283b-48f1-9386-68f4ef295656/context_package.md`
- `.orbital/artifacts/a6b4c09a-283b-48f1-9386-68f4ef295656/intent_document.md`
- `.orbital/artifacts/a6b4c09a-283b-48f1-9386-68f4ef295656/proposal_record.md`

**Analysis:**
- No verification protocol present (orbit likely incomplete)
- Suggests previous attempt at Three.js integration
- Current state of files (index.html, src/main.js, src/style.css) may contain partial implementation from this orbit
- Risk: Existing files may have incomplete or non-compliant code

**Lessons:**
- Verification absence indicates potential incomplete execution
- Current orbit must not assume prior orbit's output is correct
- All files should be validated against Intent requirements, not trusted as-is
- Full replacement strategy mitigates contamination risk

### Orbit c71c2625 (Complete Prior Work)

**Artifacts Present:**
- Complete artifact set including verification protocol, test results, and code generation
- `.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/verification_protocol.md`
- `.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/test_results.md`
- `.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/code_generation.md`

**Analysis:**
- Demonstrates successful orbit completion pattern in this repository
- Shows verification standards and test result documentation structure
- Unknown domain — not necessarily Three.js related
- Provides template for quality assurance approach

**Lessons:**
- Verification protocol should follow similar structure for consistency
- Test results pattern provides template for Level 1/2/3 acceptance validation
- Complete artifact generation establishes quality bar for this trajectory
- Code generation artifact suggests automated code production approach

### Pattern Divergence Risk

**Current File State Unknown:**
- Repository structure shows files exist but contents not provided
- Prior orbit a6b4c09a may have left files in partial state
- Cannot verify if existing code follows current Intent constraints (100 line limit, no TypeScript, specific background color)

**Mitigation:**
- Orbit 301f1e8d Proposal Record recommends full file replacement rather than incremental patching
- Cannot assume existing code is compliant — must validate against Intent
- If existing code is non-compliant, full file replacement is safer than debugging inheritance issues
- Clean slate approach reduces complexity and ensures Intent compliance

## Risk Assessment

### Risk: Line Count Budget Violation

**Severity:** High (direct acceptance boundary violation)

**Scenario:** src/main.js exceeds 100 lines when implementing all required features (scene setup, lights, geometry, material, controls, animation loop, resize handler).

**Indicators:**
- Verbose variable declarations
- Separate functions for initialization steps
- Extensive error handling or validation code
- Comments exceeding minimal documentation

**Mitigation:**
- Proposal Record specifies 48-line implementation (52-line buffer remaining)
- Use compact initialization patterns (inline object creation where appropriate)
- Combine related setup into single statement chains
- Minimize whitespace and comments (Intent specifies "not a tutorial")
- Prioritize functional code over defensive programming
- Test line count during implementation, not after completion

### Risk: Three.js Version API Incompatibility

**Severity:** Medium (could cause runtime errors)

**Scenario:** Three.js 0.160.0 API differs from expected patterns, causing import failures or deprecated method calls.

**Indicators:**
- OrbitControls import path changed in recent versions
- Constructor signatures modified
- Deprecated methods removed
- Color class API changes

**Mitigation:**
- Verify OrbitControls import path: `three/examples/jsm/controls/OrbitControls.js` is correct for v0.160.0
- Use standard constructors documented in Three.js r160 release notes
- Test imports immediately after implementation
- Color import added to handle scene.background assignment (required since r149)
- Fallback: Adjust version constraint if critical API incompatibility discovered

### Risk: Window Resize Handler Performance

**Severity:** Low (affects Level 2 acceptance criteria)

**Scenario:** Resize event fires rapidly during window drag, causing excessive re-renders and frame drops.

**Indicators:**
- Animation stutters during window resize
- DevTools performance monitor shows frame rate drops below 60fps
- Render calls queuing faster than GPU can process

**Mitigation:**
- Accept this risk: Intent explicitly states "no performance optimizations beyond basic best practices"
- Debouncing would add complexity and line count
- Modern browsers handle resize events efficiently
- Brief performance degradation during resize acceptable for learning project
- Level 2 acceptance measures steady-state 60fps, not during resize operations

### Risk: Vite Configuration Assumption Failure

**Severity:** Medium (blocks development workflow)

**Scenario:** Vite requires explicit configuration for ES module imports or Three.js path resolution.

**Indicators:**
- `npm run dev` fails with module resolution errors
- Import statements fail to resolve from node_modules
- OrbitControls import fails despite correct path

**Mitigation:**
- Vite 5.0.0 supports zero-config ES modules by default
- package.json "type": "module" field already present (confirmed in repository)
- Three.js is standard ESM-compatible package
- If failure occurs: Create minimal vite.config.js with explicit resolve configuration (adds one file but maintains Intent compliance)

### Risk: Existing File Contamination

**Severity:** Medium (wastes implementation time, causes confusion)

**Scenario:** Existing files (index.html, src/main.js, src/style.css) contain non-compliant code from orbit a6b4c09a that conflicts with current Intent.

**Indicators:**
- TypeScript syntax present in .js files
- Framework imports in existing code
- Non-standard project structure
- Background color not set to 0x1a1a2e
- Line count already exceeding 100

**Mitigation:**
- Proposal Record adopts full file replacement strategy
- Recommend full file replacement rather than incremental patching
- Do not attempt to preserve prior orbit's code if non-compliant
- Clean slate approach reduces complexity and ensures Intent compliance

### Risk: Browser WebGL Support Variability

**Severity:** Low (Intent assumes modern browser)

**Scenario:** Target browser lacks WebGL 2.0 support or has limited GPU capabilities.

**Indicators:**
- Renderer initialization fails silently
- Black screen with no console errors
- Performance significantly below 60fps target

**Mitigation:**
- Intent explicitly accepts "not cross-browser tested" limitation
- Target audience is developers with modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- No fallback required per non-goals
- Document browser requirements in verification protocol
- WebGLRenderer will produce console errors if WebGL unavailable

### Risk: OrbitControls Damping Configuration

**Severity:** Low (affects Level 2 acceptance only)

**Scenario:** OrbitControls without damping enabled provides abrupt, non-smooth camera motion.

**Indicators:**
- Camera snaps to position rather than easing
- Mouse release causes instant stop
- Level 2 acceptance criterion "smooth, natural camera motion" not met

**Mitigation:**
- Proposal Record specifies: `controls.enableDamping = true; controls.dampingFactor = 0.05;`
- Requires `controls.update()` call in animation loop (already planned)
- Adds ~2 lines to implementation
- Cost acceptable within 100-line budget

### Risk: Canvas Append Timing Issue

**Severity:** Low (rare edge case)

**Scenario:** Attempting to append renderer canvas before DOM ready causes failure in edge cases.

**Indicators:**
- Console error: cannot append to null body
- Canvas not visible in viewport
- Occurs primarily in slow-loading environments

**Mitigation:**
- Place script tag at end of body (standard pattern)
- Or use type="module" defer behavior (already planned)
- Module scripts execute after DOM parsing by default
- Risk minimal with modern browser behavior
- HTML structure in Proposal places script in body, not head

### Risk: Color Import Omission

**Severity:** Medium (runtime error blocking scene initialization)

**Scenario:** Forgetting to import Color class from 'three' causes scene.background assignment to fail.

**Indicators:**
- Runtime error: "Color is not defined"
- Scene renders with default black background instead of 0x1a1a2e
- Rejection criterion triggered (background color incorrect)

**Mitigation:**
- Proposal Record explicitly identifies Color import as required
- Import list includes Color in implementation specification
- Pattern library documents Color usage for background assignment
- Verification protocol should check background color visually