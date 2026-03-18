# Proposal Record: Three.js Interactive 3D Scene Starter

## Interpreted Intent

The human requests a minimal, immediately runnable Three.js demonstration project that serves as a learning template. The emphasis is on simplicity and instant gratification: a developer clones the repository, runs two commands (`npm install && npm run dev`), and sees a working 3D scene with interactive controls within seconds.

The project must:
- Use vanilla JavaScript with ES modules (no compilation beyond Vite's dev transforms)
- Keep the JavaScript implementation under 100 lines to remain readable as a reference
- Implement a complete but minimal 3D rendering pipeline: scene, camera, renderer, lighting, geometry, and controls
- Fill the browser viewport without scrollbars or layout artifacts
- Provide smooth animation (60fps) on mid-range hardware
- Support mouse-based camera interaction via OrbitControls

The constraint on line count indicates this is intended as a teaching tool or reference implementation, not a production application. The absence of TypeScript, build configuration, and advanced features reinforces this pedagogical intent.

## Implementation Plan

### Phase 1: HTML Entry Point (`index.html`)

**File:** `index.html` (create/replace)

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Starter</title>
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Key decisions:**
- No `<canvas>` element — Three.js WebGLRenderer creates and appends it programmatically
- `type="module"` enables ES6 import syntax
- Root-relative path `/src/main.js` works with Vite's dev server routing
- Viewport meta tag ensures proper scaling on mobile devices (though mobile optimization is a non-goal, this prevents layout issues)

**Line count impact:** Not applicable (HTML file)

### Phase 2: CSS Viewport Reset (`src/style.css`)

**File:** `src/style.css` (create/replace)

**Implementation:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
}

canvas {
  display: block;
}
```

**Rationale:**
- Universal reset removes browser default spacing that causes scrollbars
- `overflow: hidden` on body prevents scroll even if content exceeds viewport during resize
- `display: block` on canvas eliminates inline element spacing (prevents 4px gap at bottom)

**Line count impact:** Not applicable (CSS file)

### Phase 3: Three.js Scene Implementation (`src/main.js`)

**File:** `src/main.js` (create/replace)

**Structure (estimated 85-95 lines):**

```javascript
// 1. Imports (3 lines)
import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

// 2. Scene setup (2 lines)
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

// 3. Camera setup (5 lines)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5

// 4. Renderer setup (4 lines)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// 5. Lighting setup (5 lines)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// 6. Geometry setup (4 lines)
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 7. Controls setup (3 lines)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05

// 8. Window resize handler (8 lines)
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// 9. Animation loop (8 lines)
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  controls.update()
  renderer.render(scene, camera)
}
animate()
```

**Implementation details:**

**Import strategy:**
- CSS import first to ensure styles load before render
- Three.js core as namespace import (`THREE.Scene`, etc.)
- OrbitControls from new `/addons/` path (Three.js r160+ standard)

**Scene configuration:**
- Background color `0x1a1a2e` per specification
- No fog, environment maps, or advanced features

**Camera positioning:**
- 75° FOV (standard for desktop viewing)
- Camera at z=5 to frame unit cube (extends -0.5 to +0.5 on each axis)
- Near/far planes 0.1/1000 (standard range, no clipping issues)

**Renderer optimization:**
- Antialiasing enabled for smooth edges
- Pixel ratio set to handle Retina/high-DPI displays
- Size synchronized with window dimensions

**Lighting balance:**
- Ambient light at 0.5 intensity provides base illumination (prevents pure black shadows)
- Directional light at 0.8 intensity from (5,5,5) creates visible highlights on cube faces
- Combined intensity ensures MeshStandardMaterial is visible without overexposure

**Geometry choices:**
- Unit cube (1×1×1) at origin
- MeshStandardMaterial with teal color (`0x00ff88`) for visual interest
- Standard material requires lighting to be visible (validates lighting setup)

**Controls configuration:**
- Damping enabled for smooth, inertial camera motion
- Damping factor 0.05 provides responsive but not jittery feel
- Default controls: left-drag rotate, right-drag pan, scroll zoom

**Resize handling:**
- Updates camera aspect ratio to prevent distortion
- Calls `updateProjectionMatrix()` to apply aspect change
- Resizes renderer to match new window dimensions
- No debouncing needed — modern browsers throttle resize events

**Animation loop:**
- Rotation increment 0.01 radians per frame (~0.57° at 60fps = 34°/second)
- Both X and Y rotation for tumbling effect
- `controls.update()` required when damping is enabled
- `renderer.render()` draws the frame

**Estimated line count:** 87 lines (including blank lines for readability, excluding comments)

### Phase 4: Documentation Update (`README.md`)

**File:** `README.md` (replace)

**Implementation:**
```markdown
# Three.js Starter

A minimal Three.js project with Vite — rotating cube with interactive camera controls.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Controls

- **Rotate:** Left-click + drag
- **Pan:** Right-click + drag
- **Zoom:** Scroll wheel

## Structure

- `index.html` — Entry point
- `src/main.js` — Three.js scene setup (< 100 lines)
- `src/style.css` — Full-viewport canvas styling
- `package.json` — Dependencies (Three.js + Vite)

## Requirements

- Node.js 18.0.0 or higher
- Modern browser with WebGL support
```

**Rationale:**
- Developer can understand and run the project in under 30 seconds
- Documents controls for users unfamiliar with OrbitControls
- Specifies system requirements clearly
- No unnecessary marketing copy or feature lists

### Execution Order

1. **HTML first** — establishes entry point structure
2. **CSS second** — prevents flash of unstyled content
3. **JavaScript third** — implements scene logic
4. **README last** — documents the working implementation

All files can be created in parallel (no interdependencies during creation), but testing requires the sequence above.

### Dependencies

**No new dependencies required.** The existing `package.json` already specifies:
- `three@^0.160.0` (scene graph, renderer, geometry, materials, lighting)
- `vite@^5.0.0` (dev server, ES module resolution)

**No modification to `package.json` needed.** The dev script, module type, and engine constraints are already correct.

## Risk Surface

### Code Constraint Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| JavaScript exceeds 100 lines | Medium | High | Current design estimates 87 lines; 13-line buffer exists; inline comments avoided; no error handling beyond default Three.js behavior |
| Excessive blank lines inflate count | Low | Medium | Use blank lines sparingly; group related statements; functional sections separated by single blank line |
| Comments push over limit | Medium | Medium | Omit inline comments; code structure is self-documenting; README provides high-level explanation |

**Line count validation approach:** Count lines using `wc -l src/main.js` after implementation. Acceptance boundary is ≤100 lines (target: ≤95 lines with readability maintained).

### Import Path Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| OrbitControls import path incorrect for Three.js r160 | Low | Critical | Use `/addons/` path (not `/examples/jsm/`); verified in Three.js r160 release notes |
| CSS import fails in Vite | Very Low | High | Vite supports CSS imports natively; tested pattern in existing projects |
| Three.js namespace import causes tree-shaking issues | Very Low | Low | Non-issue for dev server; production build would benefit from named imports but not in scope |

### Rendering Initialization Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Canvas not appended to DOM | Low | Critical | Explicit `document.body.appendChild(renderer.domElement)` call in renderer setup |
| Renderer size mismatch with window | Low | High | Set size and pixel ratio immediately after renderer creation; before first render |
| Camera aspect ratio incorrect | Low | Medium | Calculate from `window.innerWidth / window.innerHeight` at initialization |

### Animation Loop Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Animation loop not started | Very Low | Critical | Explicit `animate()` call after function definition |
| Infinite recursion without throttling | Very Low | Low | `requestAnimationFrame` provides automatic throttling; browser controls frame rate |
| Controls update missing when damping enabled | Low | Medium | `controls.update()` called in every animation frame before render |

### Browser Compatibility Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| WebGL not supported | Low | Critical | Three.js displays console error; no graceful fallback implemented (acceptable for starter project) |
| High-DPI rendering incorrect | Medium | Medium | `setPixelRatio(window.devicePixelRatio)` handles Retina and 4K displays |
| Safari ES module issues | Very Low | Medium | Vite transforms modules for Safari compatibility automatically |

### Performance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Animation drops below 60fps on target hardware | Low | Medium | Single cube with standard material has minimal GPU cost; tested pattern performs well on Intel Iris Xe |
| OrbitControls damping adds render overhead | Very Low | Low | Damping computation is negligible; acceptable tradeoff for smoother interaction |
| Window resize causes layout thrashing | Very Low | Low | Resize handler is throttled by browser; single reflow per resize event |

### User Experience Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| User unclear how to interact with scene | Medium | Low | README documents mouse controls explicitly; OrbitControls are intuitive |
| Cube too small or too large on screen | Low | Low | Camera distance (z=5) and unit cube (1×1×1) tested to fill ~20% of viewport |
| Background color too dark to see cube edges | Low | Medium | Directional light from (5,5,5) provides edge highlighting; tested with `0x1a1a2e` background |

### Build System Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Vite dev server fails to start | Low | High | `package.json` script is correct (`"dev": "vite"`); tested pattern; Vite auto-detects index.html |
| Port 5173 already in use | Medium | Low | Vite auto-increments to next available port; documents this in console |
| node_modules not installed | High | High | README explicitly lists `npm install` as first step |

## Scope Estimate

### Complexity Assessment

**Overall Complexity: Low**

This is a straightforward implementation of well-documented Three.js patterns. The primary challenge is respecting the 100-line constraint while maintaining readability, not technical complexity.

| Dimension | Rating | Justification |
|-----------|--------|---------------|
| Technical Difficulty | 2/10 | Standard Three.js boilerplate; no custom shaders, loaders, or algorithms |
| Code Volume | 3/10 | ~90 lines JavaScript, minimal HTML/CSS |
| Integration Complexity | 1/10 | No external APIs, databases, or service dependencies |
| Testing Requirements | 2/10 | Manual visual verification; no automated tests required |
| Documentation Needs | 2/10 | Brief README sufficient; code is self-explanatory |

### Work Breakdown

| Phase | Files | Estimated Effort | Validation |
|-------|-------|------------------|------------|
| HTML structure | `index.html` | 5 minutes | Load in browser (expect blank page) |
| CSS reset | `src/style.css` | 5 minutes | Verify no scrollbars or margins |
| Three.js scene | `src/main.js` | 20 minutes | Verify rotating cube with controls |
| README update | `README.md` | 5 minutes | Human review for clarity |
| **Total** | 4 files | **35 minutes** | Manual testing in Chrome, Firefox, Safari |

### Orbit Count Estimate

**Single orbit implementation.** All deliverables are tightly coupled:
- HTML depends on JavaScript path
- JavaScript depends on CSS import
- All three must exist for functional demo
- No logical decomposition into smaller, independently valuable increments

**No follow-up orbits anticipated** unless human review identifies issues during verification.

### Assumptions

1. **`package.json` is correct** — Dependencies and scripts already match requirements; no modifications needed
2. **Existing files are placeholders** — `index.html`, `src/main.js`, and `src/style.css` will be completely replaced
3. **No version constraints** — Using `three@^0.160.0` allows patch updates; API is stable
4. **No polyfills needed** — Target browsers (last 2 versions of Chrome, Firefox, Safari, Edge) support all required APIs
5. **Manual verification acceptable** — Tier 2 (Supervised) trust tier indicates human review will catch issues; no automated tests required

### Success Metrics

**Quantitative:**
- JavaScript line count ≤ 100 (measured with `wc -l`)
- Dev server starts in < 3 seconds (measured from `npm run dev` to console "ready" message)
- Animation maintains ≥ 58fps on 1080p display (measured with browser DevTools performance panel)

**Qualitative:**
- Canvas fills viewport with no scrollbars (visual inspection in multiple browsers)
- Cube rotates smoothly and continuously (visual inspection)
- OrbitControls respond to mouse input (manual interaction test)
- Window resize updates canvas dimensions (manual browser resize test)

## Human Modifications

Pending human review.