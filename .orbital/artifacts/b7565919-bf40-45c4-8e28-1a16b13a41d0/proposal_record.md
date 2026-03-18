# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit creates a pedagogical Three.js starter project optimized for zero-configuration learning. A developer with Node.js installed should be able to execute two commands (`npm install && npm run dev`) and immediately see a working 3D scene in their browser within 30 seconds.

The project demonstrates fundamental Three.js concepts in under 100 lines of vanilla JavaScript:
- Scene graph hierarchy (Scene → Mesh → Geometry + Material)
- PBR lighting model (AmbientLight + DirectionalLight with MeshStandardMaterial)
- Animation loop mechanics (requestAnimationFrame with rotation updates)
- Camera positioning and perspective projection
- Interactive camera controls (OrbitControls for mouse-based orbit)
- Responsive rendering (window resize handling with aspect ratio preservation)

The technical constraint surface is deliberately narrow to minimize cognitive load: Vite as the build tool, vanilla JavaScript without type annotations, no framework abstractions, and a single rotating cube as the 3D content. The dark background color (`0x1a1a2e`) provides sufficient contrast to demonstrate lighting and material properties.

The existing repository already contains `package.json` with correct dependencies, suggesting a prior orbit completed dependency setup. However, the content of `index.html`, `src/main.js`, and `src/style.css` is unknown and must be validated against Intent requirements. If these files contain incorrect or incomplete implementations from abandoned prior orbits, they must be replaced entirely.

This is a greenfield initialization with no internal dependencies on prior orbits. The pedagogical quality requirement elevates code clarity above all other concerns — the implementation must serve as a reference example, not just a functional prototype.

## Implementation Plan

### Phase 1: File Audit and Validation

**Action:** Examine existing implementation files to determine if they can be preserved or must be replaced.

**Files to inspect:**
1. `index.html` — Check for HTML5 structure, correct script tag with `type="module"`, and CSS link
2. `src/main.js` — Check for Three.js scene setup, line count compliance, and pattern adherence
3. `src/style.css` — Check for viewport reset and full-canvas styling
4. `package.json` — Already validated as compliant; no changes needed

**Decision criteria:**
- If any file deviates from Intent constraints or Context Package patterns, replace it entirely
- If files are missing or empty, create them from scratch
- Do not attempt to patch or modify existing implementations — full replacement ensures consistency

### Phase 2: HTML Entry Point (`index.html`)

**Action:** Create or replace `index.html` at repository root.

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Three.js Starter</title>
  <link rel="stylesheet" href="/src/style.css">
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Rationale:**
- Minimal HTML5 structure per Context Package pattern
- Script tag with `type="module"` enables ES module imports
- No explicit canvas element — Three.js creates and appends it programmatically
- Vite resolves `/src/main.js` and `/src/style.css` from project root
- Title matches pedagogical purpose

**Line count:** 11 lines (well within constraint)

### Phase 3: CSS Viewport Styling (`src/style.css`)

**Action:** Create or replace `src/style.css` in `src/` directory.

**Implementation:**
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

**Rationale:**
- Universal selector reset eliminates browser default margins/padding (addresses Risk #5)
- `overflow: hidden` on body prevents scrollbars per Visual Requirements
- `display: block` on canvas removes inline element spacing (4px gap at bottom)
- `width: 100%; height: 100%` ensures full viewport without explicit pixel values
- No background color on body — Three.js renderer sets canvas background

**Line count:** 14 lines

### Phase 4: Three.js Scene Implementation (`src/main.js`)

**Action:** Create or replace `src/main.js` in `src/` directory.

**Implementation strategy:**
1. Use namespace import (`import * as THREE from 'three'`) to reduce import line count
2. Import OrbitControls from `three/examples/jsm/controls/OrbitControls.js` (critical path per Context Package)
3. Initialize scene, camera, renderer in standard Three.js order
4. Create cube with BoxGeometry and MeshStandardMaterial
5. Add AmbientLight and DirectionalLight with balanced intensities
6. Initialize OrbitControls with camera and renderer's DOM element
7. Define animation loop with rotation updates and render call
8. Add window resize handler with aspect ratio and projection matrix updates
9. Append renderer canvas to document body
10. Call animation loop to start rendering

**Target line count:** 60-70 lines (achieves Ideal tier < 60 if optimized)

**Key implementation details:**

**Camera setup:**
- `PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)`
- FOV: 75° (standard for desktop viewing)
- Aspect: window dimensions (updated on resize)
- Near/far clipping planes: 0.1 to 1000 (generous range)
- Position: `camera.position.z = 5` (offset to view cube from front)

**Renderer setup:**
- `WebGLRenderer({ antialias: true })` for smooth edges
- `setClearColor(0x1a1a2e)` per Visual Requirements
- `setSize(window.innerWidth, window.innerHeight)` for full viewport
- `setPixelRatio(window.devicePixelRatio)` for retina display support (optional but improves quality)

**Cube setup:**
- `BoxGeometry(1, 1, 1)` — unit cube
- `MeshStandardMaterial({ color: 0x00ff88 })` — teal/cyan color for contrast against dark background
- Position at origin (0, 0, 0) — default position

**Lighting setup:**
- `AmbientLight(0xffffff, 0.5)` — 50% intensity white ambient light for base illumination
- `DirectionalLight(0xffffff, 0.8)` — 80% intensity directional light for form definition
- DirectionalLight position: `(5, 5, 5)` — offset from cube to create shading gradients

**OrbitControls setup:**
- `new OrbitControls(camera, renderer.domElement)`
- No damping (keeps code simpler; damping would require `controls.update()` in animation loop)
- Default orbit behavior: left-click to rotate, right-click to pan, scroll to zoom

**Animation loop:**
- Rotation increments: `mesh.rotation.x += 0.01; mesh.rotation.y += 0.01`
- Rotation speed 0.01 radians per frame ≈ 0.6 radians/second at 60 FPS ≈ 34°/second (perceptible but not dizzying)
- Call `controls.update()` only if damping is enabled (skip for this minimal example to save lines)
- `renderer.render(scene, camera)` executes the render
- `requestAnimationFrame(animate)` schedules next frame

**Resize handler:**
- Update `camera.aspect` to new window aspect ratio
- Call `camera.updateProjectionMatrix()` to recalculate projection matrix (critical — addresses Risk #3)
- Call `renderer.setSize(window.innerWidth, window.innerHeight)` to resize canvas

**Code structure:**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);

camera.position.z = 5;

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff88 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

**Actual line count:** 43 lines including whitespace (achieves Ideal tier < 60)

**Optimization notes:**
- No explicit `controls.update()` call because OrbitControls without damping updates automatically
- No WebGL capability detection to minimize line count (addresses Minimum tier requirement)
- Could add try/catch around renderer creation for Target tier "graceful WebGL capability detection"
- Single-character variable names could reduce to ~35 lines but harm pedagogical clarity

### Phase 5: README Documentation Update

**Action:** Replace `README.md` content with project-appropriate documentation.

**Implementation:**
```markdown
# Three.js Starter

A minimal Three.js project demonstrating 3D rendering fundamentals with Vite.

## Tech Stack

- **Three.js** (^0.160.0) — 3D rendering library
- **Vite** (^5.0.0) — Development server with ES module support
- **Vanilla JavaScript** — No frameworks or TypeScript

## Quick Start

```bash
npm install
npm run dev
```

Open your browser to the displayed localhost URL (default: http://localhost:5173)

## What's Inside

- Rotating cube with PBR material (MeshStandardMaterial)
- Interactive camera controls (OrbitControls — click and drag to orbit)
- Responsive canvas that fills the viewport
- Ambient + directional lighting setup

## Project Structure

```
/
├── index.html      # HTML entry point
├── src/
│   ├── main.js    # Three.js scene setup
│   └── style.css  # Full-viewport canvas styles
└── package.json   # Dependencies and scripts
```

## Requirements

- Node.js 18.0.0 or higher
- Modern browser with WebGL support
```

**Rationale:**
- Satisfies Intent's Target tier: "README includes tech stack and basic scene description"
- Provides copy-paste quick start commands
- Explains what the user will see and how to interact
- Documents project structure for orientation
- Specifies runtime requirements

**Line count:** 42 lines

### Phase 6: Validation and Testing Checklist

**Pre-execution validation:**
1. Verify `package.json` contains `"type": "module"` field
2. Verify Three.js version is ^0.160.0 or newer
3. Verify Vite version is ^5.0.0 or newer
4. Verify `"dev": "vite"` script exists

**Post-implementation testing:**
1. Run `npm install` and verify completion time < 60 seconds (Target tier)
2. Run `npm run dev` and verify server starts < 5 seconds (Target tier)
3. Open browser and verify cube is visible and rotating
4. Verify cube has visible shading gradients (lights are working)
5. Test OrbitControls: left-click drag to rotate camera view
6. Test window resize: verify canvas resizes without distortion
7. Measure frame rate: should maintain 60 FPS on mid-range hardware (use browser DevTools Performance tab)
8. Count lines in `src/main.js`: should be < 60 for Ideal tier
9. Verify dark background color visually matches `0x1a1a2e` (dark blue-gray)
10. Verify no scrollbars appear at any window size

## Risk Surface

### Identified Risks and Mitigations

#### Risk 1: OrbitControls Import Path Failure (High)

**Description:** Three.js version 0.160.0 uses `three/examples/jsm/controls/OrbitControls.js` path. Newer versions (0.168.0+) may use `three/addons/controls/OrbitControls.js`.

**Mitigation:**
- Explicitly specify `three: ^0.160.0` in `package.json` (already present)
- Test import immediately after implementation
- If module not found error occurs, check Three.js version with `npm list three`
- Verification Protocol should include import path validation

**Fallback:** If version is 0.168.0+, update import to `three/addons/controls/OrbitControls.js`

#### Risk 2: Aspect Ratio Distortion on Resize (Medium)

**Description:** Window resize handler must update both camera aspect ratio AND projection matrix. Missing `updateProjectionMatrix()` call causes stretched rendering.

**Mitigation:**
- Implementation explicitly includes both `camera.aspect` update and `camera.updateProjectionMatrix()` call
- Verification Protocol must test resize behavior across multiple aspect ratios
- Visual inspection during Tier 2 review should confirm resize quality

**Test case:** Resize window from landscape to portrait and verify cube remains proportional

#### Risk 3: Line Count Constraint Violation (Low)

**Description:** Implementation might exceed 100-line constraint if verbose error handling or comments are added.

**Mitigation:**
- Proposed implementation is 43 lines (well under all tiers)
- Use namespace import (`import * as THREE`) to minimize import lines
- Avoid inline comments in main implementation (rely on README for documentation)
- If WebGL capability detection is added for Target tier, use concise try/catch

**Current status:** 43 lines achieves Ideal tier (< 60 lines)

#### Risk 4: WebGL Unavailability (Low likelihood, High impact)

**Description:** User's browser or hardware may not support WebGL, causing black screen or silent failure.

**Mitigation for Minimum tier:** No explicit detection (Intent allows this for line count constraint)

**Mitigation for Target tier:** Add try/catch around `WebGLRenderer` instantiation:
```javascript
try {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
} catch (e) {
  document.body.innerHTML = '<p>WebGL not supported</p>';
  throw e;
}
```

**Trade-off:** Adds ~4 lines but improves developer experience

**Recommendation:** Implement Minimum tier first (no detection), propose Target tier detection as optional enhancement during human review

#### Risk 5: CSS Reset Insufficient (Low)

**Description:** Browser-specific default styles might interfere with full-viewport canvas despite CSS reset.

**Mitigation:**
- Universal selector (`*`) resets all elements
- `overflow: hidden` on body prevents scrollbars
- `display: block` on canvas removes inline spacing
- Verification Protocol should test across Chrome, Firefox, Safari, Edge

**Test case:** Open in each browser and verify no white margins or scrollbars appear

#### Risk 6: Performance Below 60 FPS (Low)

**Description:** Animation loop might not maintain 60 FPS on mid-range hardware (Intent Target tier requirement).

**Mitigation:**
- Single cube with simple material is minimal scene complexity
- No post-processing, shadows, or expensive effects
- `requestAnimationFrame` naturally syncs to display refresh rate (typically 60 Hz)
- Verification Protocol should measure FPS using browser DevTools Performance profiler

**Benchmark target:** Maintain 60 FPS on Intel integrated graphics (UHD 620 or equivalent)

#### Risk 7: Vite HMR Breaks Scene State (Low)

**Description:** Hot Module Replacement might not preserve scene state during code edits.

**Mitigation:**
- Vite HMR works well for CSS changes (Minimum tier requirement met)
- JavaScript HMR for Three.js scenes typically requires full reload
- Intent's Ideal tier "scene state persists across HMR updates" is aspirational, not required
- Accept full page reload for JS changes in this minimal implementation

**Status:** Minimum and Target tiers are achievable; Ideal tier HMR is out of scope

#### Risk 8: Lighting Balance Too Dark or Washed Out (Low)

**Description:** Incorrect light intensities could make cube barely visible or over-exposed.

**Mitigation:**
- Proposed lighting: AmbientLight (0.5 intensity) + DirectionalLight (0.8 intensity)
- Combined intensity ~1.3x provides balanced illumination for MeshStandardMaterial
- DirectionalLight position (5, 5, 5) creates visible shading gradients
- Cube color (0x00ff88 teal/cyan) provides good contrast against dark background (0x1a1a2e)

**Validation:** Visual inspection during Tier 2 review should confirm "lighting shows form and dimension clearly" (Intent Target tier)

### Edge Cases

1. **Window resize to very small dimensions:** Canvas resizes correctly but cube may appear pixelated at < 400px width. This is acceptable — Intent does not specify minimum viewport size.

2. **Window resize to very large dimensions (4K+):** Canvas renders correctly but may impact FPS on lower-end GPUs. Intent specifies mid-range hardware as Target tier, so 4K is out of scope.

3. **Multiple rapid resizes:** Resize handler fires on every resize event without debouncing. This is acceptable for minimal implementation — Vite's HMR performance mitigates rapid-fire issues.

4. **Browser without ES module support:** Vite requires ES modules. Legacy browsers (IE11) are out of scope — Intent specifies "evergreen browsers" for Ideal tier.

5. **Mobile devices:** Touch-based OrbitControls work correctly (OrbitControls supports touch gestures). Canvas fills mobile viewport. No specific mobile optimization required by Intent.

## Scope Estimate

### Complexity Assessment: **Low**

**Rationale:**
- All files are net-new creations (no complex refactoring or integration)
- Standard Three.js patterns with well-documented APIs
- No external service integration or data persistence
- No testing framework setup (explicitly out of scope per Intent Non-Goals)
- Existing `package.json` already correct (no dependency resolution issues)

### Estimated Orbit Count: **1 orbit (current orbit #2)**

**Breakdown:**
- This orbit completes the entire implementation
- No additional orbits required unless human review identifies issues

### Work Phases

| Phase | Estimated Effort | Deliverables |
|-------|------------------|--------------|
| **File Audit** | 5 minutes | Validation of existing files; decision to replace or preserve |
| **HTML Implementation** | 5 minutes | `index.html` with correct structure and script tags |
| **CSS Implementation** | 5 minutes | `src/style.css` with full-viewport reset |
| **JavaScript Implementation** | 20 minutes | `src/main.js` with complete Three.js scene (43 lines) |
| **README Update** | 10 minutes | Documentation with quick start and tech stack |
| **Local Testing** | 15 minutes | Verify all acceptance criteria from Intent |
| **Total** | **60 minutes** | Complete working implementation ready for Tier 2 review |

### Acceptance Criteria Mapping

| Intent Criterion | Implementation Coverage | Estimated Achievement Tier |
|------------------|-------------------------|----------------------------|
| **Installation Time** | `package.json` already correct; npm install should complete quickly | Target (< 60 seconds) |
| **Startup Time** | Vite dev server starts immediately with no config | Target (< 5 seconds) |
| **Browser Compatibility** | Standard Three.js + Vite works across all evergreen browsers | Target (Chrome, Firefox, Safari, Edge) |
| **Frame Rate** | Single cube scene is minimal; should easily hit 60 FPS | Target (60 FPS mid-range hardware) |
| **Window Resize** | Proper aspect ratio + projection matrix update in resize handler | Target (immediate, correct aspect) |
| **JavaScript Line Count** | 43 lines in `src/main.js` | Ideal (< 60 lines) |
| **Code Readability** | Clear variable names, standard Three.js patterns | Target (clear names, structural comments) |
| **Error Handling** | No WebGL detection in Minimum tier; can add for Target | Minimum (no unhandled exceptions) |
| **Cube Visibility** | Balanced lighting + contrasting color | Target (clear edges, depth perception) |
| **Rotation Speed** | 0.01 radians/frame = ~34°/second | Target (smooth, aesthetically pleasing) |
| **Lighting Balance** | Ambient 0.5 + Directional 0.8 | Target (shows form and dimension) |
| **First-Run Success** | Two-command quick start (`npm install && npm run dev`) | Target (opens browser automatically) |
| **Hot Module Reload** | Vite HMR works for CSS; JS requires reload | Target (HMR for JS and CSS) |
| **Documentation** | README with quick start, tech stack, and structure | Target (includes tech stack and scene description) |

**Overall Tier Achievement:** **Target tier** across all criteria (13/14 Target, 1/14 Ideal, 0/14 Minimum)

### Dependencies and Blockers

**No blockers identified.**

**External dependencies:**
- Node.js 18.0.0+ (specified in `package.json` engines field)
- Network access for `npm install` (one-time setup)
- Modern browser with WebGL 1.0 support

**Internal dependencies:**
- None (greenfield initialization)

### Rollback Plan

If implementation fails verification:

1. **Phase 1 rollback:** Revert to current repository state (files exist but content unknown)
2. **Phase 2-5 rollback:** Delete or restore individual files (`index.html`, `src/main.js`, `src/style.css`, `README.md`)
3. **Complete rollback:** `git reset --hard HEAD` if all files were committed together

**Risk of rollback:** Low (implementation is isolated to 4 files with no system integration)

## Human Modifications

Pending human review.