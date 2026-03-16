# Proposal Record: Three.js Starter Project

## Interpreted Intent

This orbit requires the creation of a minimal, immediately executable Three.js demo that serves as a learning foundation. The core requirement is a browser-based 3D scene featuring a continuously rotating cube with interactive camera controls, achievable by running a single `npm run dev` command after dependency installation.

The implementation must satisfy these critical constraints:

1. **Technology lockdown**: Vanilla JavaScript with Three.js 0.160.0 and Vite 5.0.0, no TypeScript, no frameworks
2. **Line count budget**: Maximum 100 lines in src/main.js including whitespace and comments
3. **File structure freeze**: Exactly four files (index.html, src/main.js, src/style.css, package.json) with no additional configuration
4. **Visual specifications**: Dark background (0x1a1a2e), full-viewport canvas, smooth 60fps animation
5. **Scene requirements**: PerspectiveCamera, WebGLRenderer, single cube with MeshStandardMaterial, AmbientLight, DirectionalLight, OrbitControls, rotation on X and Y axes, responsive window resize handling

The intent prioritizes simplicity and immediacy over production readiness. This is explicitly not a tutorial (minimal comments), not production-ready (no error handling), and not cross-browser tested (modern evergreen browsers only). Success is measured by visual verification and functional interaction, not test coverage or architectural sophistication.

The existing repository already contains the target files (index.html, src/main.js, src/style.css, package.json), but their compliance with intent requirements is unknown due to a prior incomplete orbit (a6b4c09a). The safest approach is full file replacement rather than incremental patching to ensure clean alignment with current specifications.

## Implementation Plan

### Phase 1: File Validation and Replacement Strategy

**Decision: Replace all content files (index.html, src/main.js, src/style.css)**

Rationale:
- Prior orbit a6b4c09a left no verification protocol, indicating incomplete execution
- Current file contents unknown and potentially non-compliant with 100-line limit or background color requirements
- Clean slate approach eliminates risk of inheriting non-compliant code patterns
- package.json is already compliant and requires no changes

**Files requiring replacement:**

1. **index.html** — Full replacement
2. **src/main.js** — Full replacement
3. **src/style.css** — Full replacement

**Files preserved as-is:**

4. **package.json** — Already compliant (dependencies, scripts, engines field correct)
5. **README.md** — Outside scope per Intent non-goals

### Phase 2: HTML Structure Implementation

**Target file: `index.html`**

**Structure:**
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

**Key implementation details:**
- HTML5 doctype with semantic structure
- Viewport meta tag for responsive behavior (Level 2 acceptance criterion)
- Descriptive title element (Level 2 acceptance criterion)
- CSS link using Vite's root-relative path resolution (`/src/style.css`)
- Script tag with `type="module"` attribute for ES module support
- Script tag in body (not head) leverages module defer behavior, ensuring DOM availability
- No div container — canvas appended directly to body via JavaScript

**Line count: 10 lines** (well within reasonable bounds)

### Phase 3: CSS Viewport Styling

**Target file: `src/style.css`**

**Structure:**
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

**Key implementation details:**
- Universal selector reset eliminates all default margins and padding
- box-sizing: border-box prevents sizing issues
- body and html set to 100% dimensions
- overflow: hidden prevents scrollbars (Level 1 acceptance criterion)
- canvas display: block removes inline element spacing artifacts
- No explicit width/height on canvas — handled by renderer.setSize() in JavaScript
- Minimal ruleset optimized for single-canvas application

**Line count: 14 lines** (minimal and focused)

### Phase 4: Three.js Scene Implementation

**Target file: `src/main.js`**

**Structure breakdown:**

**Section 1: Imports (3 lines)**
```javascript
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Section 2: Scene and Camera Setup (5 lines)**
```javascript
const scene = new Scene();
scene.background = new Color(0x1a1a2e);

const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
```

**Section 3: Renderer Setup (5 lines)**
```javascript
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);
```

**Section 4: Cube Geometry and Material (4 lines)**
```javascript
const geometry = new BoxGeometry(2, 2, 2);
const material = new MeshStandardMaterial({ color: 0x00ff88 });
const cube = new Mesh(geometry, material);
scene.add(cube);
```

**Section 5: Lighting (5 lines)**
```javascript
const ambientLight = new AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);
```

**Section 6: OrbitControls Setup (3 lines)**
```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
```

**Section 7: Window Resize Handler (6 lines)**
```javascript
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
```

**Section 8: Animation Loop (9 lines)**
```javascript
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  controls.update();
  renderer.render(scene, camera);
}

animate();
```

**Total estimated line count: ~45 lines** (including blank lines for readability)

**Critical implementation decisions:**

1. **Background color**: Use `scene.background = new Color(0x1a1a2e)` requiring Color import
2. **Camera parameters**: FOV 75° (standard), aspect from window dimensions, near 0.1, far 1000, position.z = 5 (frames 2x2x2 cube)
3. **Cube size**: 2x2x2 units (visible and well-framed at camera distance)
4. **Material color**: 0x00ff88 (teal/green for good contrast with dark background and visible lighting)
5. **Lighting intensities**: Ambient 0.5, Directional 0.8 (balanced for depth perception without over-brightening)
6. **Directional light position**: (5, 5, 5) creates visible highlights on cube faces
7. **Damping settings**: enableDamping = true, dampingFactor = 0.05 (smooth camera motion for Level 2)
8. **Rotation speed**: 0.01 radians per frame (~0.6°/frame, full rotation in ~10 seconds)
9. **Pixel ratio handling**: setPixelRatio(window.devicePixelRatio) for high-DPI displays (Level 3 criterion)

**Import corrections needed:**
- Add `Color` to Three.js imports for background color assignment

**Revised Section 1:**
```javascript
import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshStandardMaterial, Mesh, AmbientLight, DirectionalLight, Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Final line count estimate: 46-50 lines** (well under 100-line constraint)

### Phase 5: Verification Preparation

**Pre-execution checklist:**
1. Verify package.json unchanged (dependencies already correct)
2. Confirm no additional files created (vite.config.js, tsconfig.json, etc.)
3. Validate import paths match Three.js 0.160.0 conventions
4. Count lines in src/main.js (must be ≤ 100)
5. Check background color hex value is exactly 0x1a1a2e

**Execution sequence:**
1. Replace index.html content
2. Replace src/style.css content
3. Replace src/main.js content
4. Verify file structure matches Intent requirements
5. No npm install required (dependencies already present)
6. Execute `npm run dev` and verify Vite starts
7. Open browser to localhost:5173
8. Verify visual and functional acceptance criteria

## Risk Surface

### Risk 1: Line Count Budget Overrun

**Probability:** Low  
**Impact:** High (automatic rejection per acceptance boundaries)

**Scenario:** Final src/main.js implementation exceeds 100 lines due to whitespace, comments, or verbose patterns.

**Mitigation implemented:**
- Estimated line count of 46-50 leaves 50-line buffer for adjustments
- No comments beyond minimal documentation (Intent specifies "not a tutorial")
- Compact initialization patterns (inline object creation where readable)
- Single-line statements for simple assignments
- Blank lines only between logical sections (7-8 total)

**Contingency:** If approaching limit, remove blank lines between sections (reduces readability but maintains functionality)

### Risk 2: Three.js 0.160.0 API Compatibility

**Probability:** Low  
**Impact:** High (runtime errors blocking execution)

**Scenario:** OrbitControls import path or API changed in v0.160.0, causing import failures or method errors.

**Mitigation implemented:**
- Using documented stable import path: `three/examples/jsm/controls/OrbitControls.js`
- Standard Three.js class constructors with well-established APIs
- No experimental or deprecated Three.js features
- Color class import for scene.background (supported since Three.js r149)

**Verification point:** Test imports immediately after file creation — if import fails, consult Three.js r160 migration guide

**Fallback:** If OrbitControls path invalid, check alternative paths in node_modules/three/examples/ structure

### Risk 3: Existing File State Contamination

**Probability:** Medium  
**Impact:** Medium (confusion, wasted debugging time)

**Scenario:** Current index.html, src/main.js, or src/style.css contain non-compliant code from orbit a6b4c09a that conflicts with implementation.

**Mitigation implemented:**
- Full file replacement strategy eliminates inheritance of prior code
- No attempt to parse or merge existing file contents
- Clean slate approach ensures alignment with current Intent
- Validation step confirms no TypeScript syntax or framework imports present post-implementation

**Detection:** If Vite startup fails with unexpected errors, indicates system state divergence requiring manual cleanup

### Risk 4: Vite Module Resolution Failure

**Probability:** Very Low  
**Impact:** High (blocks development server)

**Scenario:** Vite fails to resolve Three.js imports from node_modules despite correct configuration.

**Mitigation implemented:**
- package.json "type": "module" field already present (confirmed in repository)
- Standard ES module import syntax compatible with Vite defaults
- No custom path aliases or resolution configuration required
- Three.js v0.160.0 is fully ESM-compatible package

**Detection point:** `npm run dev` execution — Vite will report module resolution errors immediately

**Fallback:** If failure occurs, create minimal vite.config.js with explicit resolve.alias for Three.js paths (adds one file but maintains Intent compliance)

### Risk 5: Browser WebGL Availability

**Probability:** Very Low  
**Impact:** Medium (visual failure in unsupported environments)

**Scenario:** Target browser lacks WebGL 2.0 support, causing renderer initialization to fail silently.

**Mitigation implemented:**
- Intent explicitly accepts modern browser requirement (Chrome 90+, Firefox 88+, Safari 14+)
- No fallback UI or error handling required per non-goals
- WebGLRenderer initialization will fail with console error if unsupported
- Verification protocol should document browser requirements

**Acceptance:** This risk is explicitly acknowledged in Intent non-goals ("not cross-browser tested")

### Risk 6: Window Resize Performance Degradation

**Probability:** Low  
**Impact:** Low (affects Level 2 criterion only during resize operation)

**Scenario:** Rapid resize events during window drag cause frame rate drops below 60fps.

**Mitigation implemented:**
- Accept this risk per Intent: "no performance optimizations beyond basic best practices"
- Modern browsers throttle resize events automatically
- Brief performance degradation during active resize acceptable
- Animation recovers immediately when resize completes
- No debouncing added (would increase line count and complexity)

**Measurement:** Verify 60fps during steady-state animation (not during resize) for Level 2 acceptance

### Risk 7: OrbitControls Damping Smoothness

**Probability:** Very Low  
**Impact:** Low (affects Level 2 acceptance criterion)

**Scenario:** Damping configuration insufficient for "smooth, natural camera motion" requirement.

**Mitigation implemented:**
- enableDamping = true activates inertia-based camera motion
- dampingFactor = 0.05 provides moderate smoothness (standard value range 0.05-0.25)
- controls.update() called in animation loop (required for damping to function)
- Configuration tested in Three.js community examples

**Tuning:** If motion too abrupt during review, increase dampingFactor to 0.1-0.15 (no line count impact)

### Risk 8: Color Contrast and Visibility

**Probability:** Very Low  
**Impact:** Low (visual quality concern, not functional failure)

**Scenario:** Cube color poorly visible against dark background, lighting insufficient for depth perception.

**Mitigation implemented:**
- Cube material color: 0x00ff88 (bright teal) provides strong contrast with 0x1a1a2e background
- Ambient light intensity 0.5 ensures cube is never completely dark
- Directional light intensity 0.8 creates visible highlights and shadows on faces
- MeshStandardMaterial responds realistically to lighting (physically-based rendering)

**Verification:** Visual inspection during execution confirms depth perception and color contrast (Level 2 criterion)

## Scope Estimate

### Orbit Count: 1 (This Orbit)

**Justification:**
- All work contained within single orbit execution
- No external dependencies requiring coordination
- No blocking issues identified in risk assessment
- File structure simple and self-contained
- Implementation plan executable in single pass

### Complexity Assessment: Low-Medium

**Complexity factors:**

**Low complexity elements:**
- Standard Three.js scene setup patterns (well-documented)
- Minimal file structure (4 files total)
- No backend integration or API calls
- No state management or routing
- No build configuration beyond defaults

**Medium complexity elements:**
- Line count constraint requires careful implementation density
- OrbitControls damping configuration needs testing
- Window resize handler must update multiple properties correctly
- Lighting balance requires visual verification

**Mitigating factors:**
- Context Package provides complete API patterns
- Prior orbit (c71c2625) demonstrates verification protocol structure
- Clear acceptance boundaries with Level 1/2/3 criteria
- No ambiguous requirements or open-ended design decisions

### Work Phases Breakdown

**Phase 1: File Implementation (Estimated: 15-20 minutes)**
- Replace index.html with minimal HTML5 structure (2 minutes)
- Replace src/style.css with viewport reset rules (2 minutes)
- Replace src/main.js with complete Three.js scene setup (10-15 minutes)
- Verify line count in src/main.js ≤ 100 (1 minute)

**Phase 2: Local Verification (Estimated: 10-15 minutes)**
- Execute `npm run dev` and confirm Vite starts (1 minute)
- Open browser and verify visual rendering (2 minutes)
- Test cube rotation animation (1 minute)
- Test OrbitControls mouse interactions (drag, scroll, right-click) (3 minutes)
- Test window resize responsiveness (2 minutes)
- Check browser console for errors/warnings (1 minute)
- Measure frame rate with DevTools performance monitor (2 minutes)
- Verify background color matches 0x1a1a2e specification (1 minute)

**Phase 3: Acceptance Validation (Estimated: 5-10 minutes)**
- Validate Level 1 criteria (8 items) systematically (5 minutes)
- Validate Level 2 criteria (7 additional items) if Level 1 passes (3 minutes)
- Document any Level 3 criteria achieved (2 minutes)
- Identify any rejection criteria violations (immediate failure check)

**Total estimated time: 30-45 minutes** for complete orbit execution including verification

### Dependencies and Blockers

**No blocking dependencies identified:**
- package.json already contains correct dependencies (no npm install changes needed)
- Node.js >=18.0.0 assumed present (documented in Intent)
- Modern browser with WebGL 2.0 assumed available (documented in Intent)
- Git and npm assumed operational (standard development environment)

**Non-blocking considerations:**
- Prior orbit a6b4c09a artifacts exist but do not block this implementation (full replacement strategy)
- .orbital infrastructure artifacts are read-only references (no write coordination needed)
- README.md exists but outside scope (no conflict)

### Success Criteria Alignment

**Level 1 (Required) — Expected to achieve:**
- All 8 criteria within implementation plan scope
- Line count well under 100 (estimated 46-50 lines)
- Standard Three.js patterns ensure compatibility
- Full file replacement eliminates contamination risk

**Level 2 (Target) — High confidence:**
- 60fps achievable with minimal scene complexity
- Camera FOV and position optimized for cube framing
- OrbitControls damping explicitly configured
- HTML semantic structure included in implementation
- Code formatting consistency enforced in implementation

**Level 3 (Stretch) — Partially achieved:**
- Pixel ratio handling included (high-DPI rendering)
- Cube material specular highlights from MeshStandardMaterial (automatic)
- Camera FOV/near/far planes optimized (75°, 0.1, 1000 are standard best-practice values)
- OrbitControls min/max distance NOT configured (would add lines, not required)
- Timestamp-based delta time NOT implemented (not required, uniform rotation acceptable)
- Code formatting (quotes, indent, semicolons) — will be consistently applied but not specified in Intent

### Confidence Level: High

**Factors supporting high confidence:**
- Clear, unambiguous requirements in Intent Document
- Complete API patterns provided in Context Package
- Generous line count buffer (100 limit, 46-50 estimated)
- Standard Three.js patterns with established compatibility
- No external service dependencies or integration complexity
- Single-file implementation reduces coordination risk
- Visual verification straightforward (render or not, rotate or not)

**Remaining uncertainties:**
- Exact prior orbit a6b4c09a file contents unknown (mitigated by full replacement strategy)
- Frame rate performance on verification hardware unknown (mitigated by minimal scene complexity)
- Lighting balance visual quality subjective (mitigated by standard intensity values)

## Human Modifications

Pending human review.