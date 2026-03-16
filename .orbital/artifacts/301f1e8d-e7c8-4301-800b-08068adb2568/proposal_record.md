# Proposal Record: Three.js Starter Project

## Interpreted Intent

This orbit requires the creation of a minimal, immediately executable Three.js demonstration project that serves as a validated foundation for 3D web development learning and prototyping. The core deliverable is a browser-based 3D scene featuring a continuously rotating cube with interactive camera controls, achievable by running `npm run dev` after dependency installation.

The implementation must balance competing demands:

1. **Minimal complexity** — Under 100 lines of JavaScript, no frameworks, no TypeScript, no custom abstractions
2. **Professional quality** — Smooth 60fps animation, proper viewport handling, responsive resize behavior, clean console execution
3. **Complete functionality** — Scene graph with camera/lights/geometry, OrbitControls interaction, animation loop, window resize handling
4. **Visual specifications** — Dark background (0x1a1a2e), full-viewport canvas, visible depth perception from lighting

The intent prioritizes learning value and template utility over production readiness. This is explicitly not a tutorial (minimal comments), not production-ready (no error handling), and not cross-browser tested (modern evergreen browsers only). Success is measured by visual verification and functional interaction within a 100-line JavaScript budget.

The existing repository contains target files from a prior incomplete orbit (a6b4c09a), but their compliance status is unknown. The Context Package recommends full file replacement to ensure clean alignment with current Intent requirements, avoiding the risk of inheriting non-compliant code patterns or exceeding the line count budget through incremental modifications.

## Implementation Plan

### Phase 1: File Validation and Replacement Strategy

**Decision: Replace all content files (index.html, src/main.js, src/style.css)**

**Rationale:**
- Prior orbit a6b4c09a produced no verification protocol, indicating incomplete execution
- Current file contents unknown and potentially non-compliant with 100-line limit, background color (0x1a1a2e), or TypeScript prohibition
- Clean slate approach eliminates inheritance risk and ensures Intent alignment
- package.json already compliant (dependencies, scripts, engines field correct per Context Package)

**Files requiring replacement:**

| File | Action | Reason |
|------|--------|--------|
| `index.html` | Full replacement | Contents unknown, must verify ES module loading and viewport meta tag |
| `src/main.js` | Full replacement | Contents unknown, cannot validate line count or Intent compliance |
| `src/style.css` | Full replacement | Contents unknown, must ensure viewport fill behavior |
| `package.json` | Preserve as-is | Already compliant with all Intent requirements (confirmed in Context Package) |
| `README.md` | Preserve as-is | Outside Intent scope per non-goals |

### Phase 2: HTML Structure Implementation

**Target file: `index.html`**

**Complete implementation:**

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

**Implementation details:**
- HTML5 doctype with semantic structure (Level 2 acceptance criterion)
- Viewport meta tag for responsive behavior (Level 2 acceptance criterion)
- Descriptive title element (Level 2 acceptance criterion)
- CSS link using Vite's root-relative path resolution (`/src/style.css`)
- Script tag with `type="module"` for ES module support (Intent constraint)
- Script placed in body (not head) — module defer behavior ensures DOM availability
- No div container — canvas appended directly to body via JavaScript

**Line count: 10 lines**

### Phase 3: CSS Viewport Styling Implementation

**Target file: `src/style.css`**

**Complete implementation:**

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

**Implementation details:**
- Universal selector reset eliminates all default margins and padding (Level 1 acceptance criterion: "zero margins, padding")
- box-sizing: border-box prevents sizing calculation issues
- body and html set to 100% dimensions
- overflow: hidden prevents scrollbars (Level 1 acceptance criterion)
- canvas display: block removes inline element spacing artifacts
- No explicit width/height on canvas — handled by renderer.setSize() in JavaScript
- Minimal ruleset optimized for single-canvas application

**Line count: 14 lines**

### Phase 4: Three.js Scene Implementation

**Target file: `src/main.js`**

**Complete implementation:**

```javascript
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new Scene();
scene.background = new Color(0x1a1a2e);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const geometry = new BoxGeometry(2, 2, 2);
const material = new MeshStandardMaterial({ color: 0x00ff88 });
const cube = new Mesh(geometry, material);
scene.add(cube);

const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
```

**Line count: 48 lines** (including blank lines for readability, well under 100-line constraint)

**Section-by-section breakdown:**

**Lines 1-2: Imports**
- Named imports for all Three.js core classes from 'three'
- Color class imported for scene.background assignment (Context Package risk mitigation)
- OrbitControls from examples/jsm path (correct for Three.js 0.160.0 per Context Package)

**Lines 4-5: Scene Setup**
- Scene instantiation
- Background color set to 0x1a1a2e (Intent requirement, Level 1 acceptance criterion)

**Lines 7-8: Camera Configuration**
- PerspectiveCamera with 75° FOV (standard, Level 3 criterion: "optimized for scene scale")
- Aspect ratio from window dimensions
- Near plane 0.1, far plane 1000 (standard best-practice values, Level 3 criterion)
- Camera positioned at z=5 to frame 2x2x2 cube (Level 2 criterion: "fully frames the cube")

**Lines 10-13: Renderer Setup**
- WebGLRenderer with antialiasing enabled (Level 2 criterion: smooth edges)
- Size set to window dimensions (Level 1 criterion: "fills full browser viewport")
- Pixel ratio accounts for high-DPI displays (Level 3 criterion)
- Canvas appended to body (Level 1 criterion: no margins/padding)

**Lines 15-18: Cube Creation**
- BoxGeometry 2x2x2 units (visible and well-framed)
- MeshStandardMaterial with color 0x00ff88 (teal for contrast with dark background)
- Mesh instantiation and scene addition
- Material choice satisfies Level 3 criterion: "specular highlights demonstrating proper light interaction"

**Lines 20-25: Lighting**
- AmbientLight at 0.5 intensity (base illumination)
- DirectionalLight at 0.8 intensity positioned at (5, 5, 5)
- Lighting balance creates visible depth perception (Level 2 criterion: "shadows/highlights on cube faces")

**Lines 27-29: OrbitControls Configuration**
- Controls instantiated with camera and renderer canvas
- Damping enabled for smooth motion (Level 2 criterion: "smooth, natural camera motion")
- Damping factor 0.05 (moderate smoothness, standard value)

**Lines 31-36: Window Resize Handler**
- Listener updates camera aspect ratio
- updateProjectionMatrix() applies aspect change
- Renderer size updated to new dimensions
- Pixel ratio re-applied (handles display changes)
- Satisfies Level 1 criterion: "window resize updates canvas dimensions without distortion"

**Lines 38-47: Animation Loop**
- Recursive requestAnimationFrame invocation
- Cube rotation incremented by 0.01 radians per frame on X and Y axes (Intent requirement)
- controls.update() called before render (required for damping, Context Package pattern)
- renderer.render() executes frame rendering
- Function invoked immediately to start loop
- Satisfies Level 1 criterion: "cube rotates continuously without user interaction"

**Critical implementation decisions:**

1. **Background color via Color class** — Requires explicit Color import (Context Package risk mitigation for "Color Import Omission")
2. **Cube color 0x00ff88** — Bright teal provides strong contrast with 0x1a1a2e background for visibility
3. **Camera position z=5** — Calculated to frame 2x2x2 cube without clipping at 75° FOV
4. **Lighting intensities** — Ambient 0.5 + Directional 0.8 creates visible depth without over-brightening
5. **Directional light position (5,5,5)** — Creates highlights on top/right faces for depth perception
6. **Rotation speed 0.01** — ~0.6° per frame, full rotation in ~10 seconds (smooth, noticeable)
7. **Damping factor 0.05** — Provides smooth camera motion without excessive lag
8. **Pixel ratio in resize** — Handles display changes (external monitor plugging/unplugging)

### Phase 5: Verification Preparation

**Pre-execution checklist:**
1. Verify package.json unchanged (dependencies already correct)
2. Confirm no additional files created (vite.config.js, tsconfig.json, etc.)
3. Validate import paths match Three.js 0.160.0 conventions
4. Count lines in src/main.js: 48 lines (within 100-line constraint)
5. Verify background color hex value is exactly 0x1a1a2e

**Execution sequence:**
1. Replace index.html content with implementation from Phase 2
2. Replace src/style.css content with implementation from Phase 3
3. Replace src/main.js content with implementation from Phase 4
4. Verify file structure matches Intent requirements (4 files only)
5. No `npm install` required (dependencies already installed per package.json)
6. Execute `npm run dev` to start Vite development server
7. Open browser to localhost:5173 (default Vite port)
8. Perform visual and functional verification against acceptance criteria

## Risk Surface

### Risk 1: Line Count Budget Compliance

**Probability:** Very Low  
**Impact:** High (automatic rejection per acceptance boundaries)

**Mitigation implemented:**
- Final implementation: 48 lines in src/main.js (52-line buffer remaining)
- No comments beyond minimal structure (Intent specifies "not a tutorial")
- Compact patterns without sacrificing readability
- Blank lines limited to logical section separators (7 blank lines total)
- Every line serves functional purpose

**Validation:** Line count manually verified during implementation planning phase

### Risk 2: Three.js 0.160.0 API Compatibility

**Probability:** Very Low  
**Impact:** High (runtime errors blocking execution)

**Mitigation implemented:**
- OrbitControls import path verified for v0.160.0: `three/examples/jsm/controls/OrbitControls.js` (standard path)
- Color class import included for scene.background assignment (supported since r149, stable in r160)
- Standard Three.js constructors with established APIs (PerspectiveCamera, WebGLRenderer, MeshStandardMaterial)
- No experimental or deprecated features used

**Validation point:** Test imports immediately after file creation — if import fails, consult Three.js r160 release notes

### Risk 3: Existing File State Contamination

**Probability:** N/A (eliminated by design)  
**Impact:** N/A

**Mitigation implemented:**
- Full file replacement strategy eliminates inheritance of prior orbit code
- No parsing or merging of existing file contents
- Clean slate ensures alignment with current Intent
- Implementation plan explicitly specifies "Full replacement" for all content files

**Result:** Risk eliminated through architectural decision

### Risk 4: Background Color Specification Error

**Probability:** Very Low  
**Impact:** High (rejection criterion: "background color is not 0x1a1a2e")

**Mitigation implemented:**
- Color value 0x1a1a2e explicitly specified in implementation line 5
- Color class imported to handle scene.background assignment
- Hexadecimal value matches Intent specification exactly (dark blue-grey)

**Validation:** Visual inspection during execution confirms background color compliance

### Risk 5: Window Resize Behavior Correctness

**Probability:** Very Low  
**Impact:** Medium (affects Level 1 acceptance criterion)

**Mitigation implemented:**
- Resize listener updates camera.aspect from window dimensions
- camera.updateProjectionMatrix() applies aspect ratio change
- renderer.setSize() updates canvas dimensions
- renderer.setPixelRatio() re-applied (handles display changes)
- Implementation follows Context Package pattern exactly

**Validation:** Test window resize by dragging browser edges and verify canvas adjusts without distortion

### Risk 6: OrbitControls Interaction Failure

**Probability:** Very Low  
**Impact:** High (Level 1 acceptance criterion: "OrbitControls respond to mouse drag, scroll, and right-click")

**Mitigation implemented:**
- Controls instantiated with correct parameters: camera and renderer.domElement
- enableDamping=true provides smooth motion (Level 2 criterion)
- controls.update() called in animation loop (required for damping)
- Import path verified for Three.js 0.160.0

**Validation:** Test mouse drag (orbit), scroll (zoom), right-click drag (pan) during execution

### Risk 7: Animation Performance Below 60fps

**Probability:** Very Low  
**Impact:** Medium (affects Level 2 acceptance criterion)

**Mitigation implemented:**
- Minimal scene complexity (1 cube, 2 lights)
- No shadow rendering (performance optimization)
- Standard requestAnimationFrame timing
- GPU-accelerated WebGL rendering
- No expensive computations in animation loop

**Validation:** Measure frame rate with browser DevTools performance monitor during execution

### Risk 8: Vite Module Resolution Failure

**Probability:** Very Low  
**Impact:** High (blocks development server startup)

**Mitigation implemented:**
- package.json "type": "module" field present (Context Package confirms)
- Standard ES module import syntax
- Three.js v0.160.0 is ESM-compatible package
- No custom path aliases or resolution configuration
- Vite 5.0.0 supports zero-config ES modules by default

**Fallback:** If module resolution fails, create minimal vite.config.js with explicit resolve.alias (adds one file, maintains Intent compliance)

### Risk 9: Console Errors or Warnings

**Probability:** Very Low  
**Impact:** High (Level 1 acceptance criterion: "zero console errors or warnings")

**Mitigation implemented:**
- All imports verified for correctness
- No deprecated Three.js APIs used
- No undefined variables or references
- Canvas append occurs after DOM ready (module defer behavior)
- Standard browser APIs used (window, document, requestAnimationFrame)

**Validation:** Open browser console during execution and verify no error or warning messages

### Risk 10: Canvas Not Filling Viewport

**Probability:** Very Low  
**Impact:** High (rejection criterion: "canvas does not fill viewport or has visible margins/padding")

**Mitigation implemented:**
- CSS universal selector reset eliminates all default spacing
- body/html set to 100% width/height with overflow:hidden
- canvas display:block removes inline spacing
- renderer.setSize() uses window.innerWidth/innerHeight
- No explicit canvas CSS dimensions (JavaScript controls sizing)

**Validation:** Visual inspection confirms canvas fills entire viewport with no scrollbars or margins

## Scope Estimate

### Orbit Count: 1 (This Orbit)

**Justification:**
- All work self-contained within single orbit execution
- No external dependencies requiring coordination
- No blocking issues identified in risk assessment
- File structure simple and fully specified
- Implementation plan executable in single pass

### Complexity Assessment: Low

**Complexity factors:**

**Low complexity elements (dominant):**
- Standard Three.js scene setup patterns (well-documented, proven in Context Package)
- Minimal file structure (4 files, 3 require modification)
- No backend integration, API calls, or external services
- No state management, routing, or framework coordination
- Clear specification with concrete acceptance criteria
- 48-line implementation well under 100-line budget (52-line buffer)

**No medium or high complexity elements present**

### Work Phases Breakdown

**Phase 1: File Implementation**
- **Duration:** 15-20 minutes
- Replace index.html (2 minutes)
- Replace src/style.css (2 minutes)
- Replace src/main.js (10-15 minutes)
- Verify line count ≤ 100 (1 minute)

**Phase 2: Local Verification**
- **Duration:** 10-15 minutes
- Execute `npm run dev` (1 minute)
- Verify visual rendering (2 minutes)
- Test cube rotation (1 minute)
- Test OrbitControls interactions (3 minutes)
- Test window resize (2 minutes)
- Check console for errors (1 minute)
- Measure frame rate (2 minutes)
- Verify background color 0x1a1a2e (1 minute)

**Phase 3: Acceptance Validation**
- **Duration:** 5-10 minutes
- Validate Level 1 criteria (8 items, 5 minutes)
- Validate Level 2 criteria (7 items, 3 minutes)
- Document Level 3 criteria achieved (2 minutes)

**Total estimated execution time: 30-45 minutes** for complete orbit including verification

### Expected Acceptance Level: Level 2 (Professional Standard)

**Level 1 (Required) — Certainty: Very High**
- All 8 criteria within implementation scope
- Line count: 48 lines (well under 100)
- Standard patterns ensure compatibility
- Full replacement eliminates contamination

**Level 2 (Target) — Certainty: High**
- 60fps achievable with minimal scene (1 cube, 2 lights)
- Camera FOV (75°) and position (z=5) optimized for 2x2x2 cube
- OrbitControls damping explicitly configured
- HTML semantic structure included
- Code formatting consistent throughout

**Level 3 (Stretch) — Certainty: Medium-High**
- Pixel ratio handling included (high-DPI rendering)
- MeshStandardMaterial provides specular highlights (automatic with proper lighting)
- Camera FOV/near/far planes follow best practices (75°, 0.1, 1000)
- OrbitControls min/max distance NOT configured (would add lines, not required)
- Timestamp-based delta time NOT implemented (not required, uniform rotation acceptable)
- Code formatting consistent but not explicitly specified in Intent (semicolons used, 2-space indent where applicable)

**Partial Level 3 achievement expected:** 3-4 of 6 criteria likely satisfied

### Dependencies and Blockers

**No blocking dependencies:**
- package.json already contains correct dependencies (no npm changes)
- Node.js >=18.0.0 assumed present (Intent dependency)
- Modern browser with WebGL 2.0 assumed available (Intent dependency)
- Git and npm assumed operational (standard environment)

**Non-blocking references:**
- Prior orbit a6b4c09a artifacts exist but not required (full replacement strategy)
- .orbital infrastructure read-only (no write coordination)
- README.md outside scope (no conflict)

### Success Probability

**Overall confidence: Very High (95%+)**

**Supporting factors:**
- Clear, unambiguous Intent requirements
- Complete implementation specified in Proposal
- 48-line implementation provides 52-line safety buffer
- Standard Three.js patterns with proven compatibility
- No external service dependencies
- Single-file JavaScript implementation reduces integration risk
- Visual/functional verification straightforward
- All identified risks mitigated or eliminated

**Remaining uncertainties (minimal impact):**
- Exact prior orbit file contents unknown (mitigated by full replacement)
- Performance on verification hardware unknown (mitigated by minimal scene)
- Lighting visual quality subjective (mitigated by standard values from Context Package)

## Human Modifications

Pending human review.