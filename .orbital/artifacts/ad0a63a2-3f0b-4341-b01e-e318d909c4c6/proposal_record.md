# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit creates a functional Three.js demonstration project optimized for rapid prototyping and learning. The deliverable is a working browser application that:

1. **Renders immediately** — A developer runs two commands (`npm install && npm run dev`) and sees a 3D scene within seconds, with no configuration or troubleshooting required.

2. **Demonstrates core Three.js patterns** — The implementation serves as a reference for scene setup, lighting, materials, camera controls, and animation loops using idiomatic Three.js code.

3. **Stays minimal** — The entire codebase fits comfortably in a single screen (under 100 lines of JavaScript), making it readable in one sitting and easy to understand for developers new to Three.js.

4. **Works responsively** — The canvas fills the viewport and adapts to window resizing without requiring page refreshes or manual intervention.

5. **Provides interactive exploration** — OrbitControls allow users to rotate the camera around the scene, creating an intuitive 3D navigation experience.

The success metric is simple: can someone unfamiliar with Three.js clone this repository, start the dev server, and within 5 minutes understand how to create their own 3D scene by modifying this template?

**Key Interpretation Points:**
- "Minimal" means prioritizing clarity over features — one cube, two lights, essential controls only
- "Starter project" means this is a teaching artifact, not production code — comments should explain Three.js concepts, not implementation details
- The 100-line constraint forces architectural decisions toward simplicity (single file, no abstractions, inline configuration)
- The dark background (`0x1a1a2e`) and `MeshStandardMaterial` indicate the visual goal is a modern, polished look with realistic lighting

## Implementation Plan

### Phase 1: File Structure Verification and Creation

**Step 1.1: Assess Existing Files**
- Inspect `index.html`, `src/main.js`, and `src/style.css` to determine current state
- `package.json` already contains correct configuration — no changes needed
- If files are empty or missing, create from scratch
- If files contain partial implementations, perform surgical updates to meet specifications

**Step 1.2: Create/Update `index.html`**
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

**Key Decisions:**
- No canvas element in HTML (Three.js creates it programmatically)
- CSS link in `<head>` ensures styles load before JavaScript executes (prevents FOUC)
- Script tag with `type="module"` enables ESM imports
- Minimal metadata (charset, viewport, title) — no meta tags for SEO, social sharing, or PWA

**Step 1.3: Create/Update `src/style.css`**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
}

canvas {
  display: block;
}
```

**Key Decisions:**
- Universal selector reset eliminates browser default margins/padding
- `overflow: hidden` on body prevents scrollbars when canvas resizes
- `canvas { display: block; }` removes inline spacing that creates 4px bottom gap
- No font families, colors, or typography styles (no text is rendered)

### Phase 2: Three.js Scene Implementation

**Step 2.1: Create/Update `src/main.js` Structure**

The file follows this execution order:
1. Import dependencies (Three.js core + OrbitControls)
2. Initialize scene, camera, renderer
3. Create and add cube geometry to scene
4. Add lighting (ambient + directional)
5. Initialize OrbitControls
6. Define animation loop
7. Start animation loop
8. Attach resize handler

**Step 2.2: Implementation Details**

```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.z = 5;

// Renderer configuration
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a2e);
document.body.appendChild(renderer.domElement);

// Cube creation
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  controls.update();
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

**Line Count:** 48 lines (including whitespace for readability) — comfortably under the 100-line constraint with room for 2-3 inline comments if needed.

**Key Technical Decisions:**

| Decision | Rationale |
|----------|-----------|
| Camera FOV: 75° | Standard wide angle for 3D scenes; prevents fisheye distortion while showing full cube |
| Camera position: z=5 | Positions camera far enough to see entire 1×1×1 cube with comfortable framing |
| Near/far planes: 0.1/1000 | Standard values for small-to-medium scenes; prevents z-fighting and clipping |
| Antialias: true | Smooths cube edges at negligible performance cost for single object |
| Cube color: 0x00ff00 | Bright green contrasts well with dark background; easily identifiable in screenshots |
| Ambient light: 0.5 | Provides base illumination so back faces aren't pitch black |
| Directional light: 0.8 at (5,5,5) | Creates depth through top-right lighting; intensity ensures clear face differentiation |
| Rotation speed: 0.01/frame | At 60fps = 0.6 rad/sec = ~34°/sec; visible but not dizzying |
| OrbitControls: default settings | No damping or zoom limits; prioritizes simplicity over polish |

### Phase 3: Verification Preparation

**Step 3.1: Manual Testing Checklist**
Before orbit completion, verify:
- [ ] `npm install` succeeds without errors
- [ ] `npm run dev` starts Vite server and displays localhost URL
- [ ] Browser loads page without console errors
- [ ] Cube is visible, centered, and green
- [ ] Cube rotates continuously on X and Y axes
- [ ] Left mouse drag rotates camera around cube
- [ ] Right mouse drag pans camera
- [ ] Scroll wheel zooms camera in/out
- [ ] Window resize updates canvas dimensions immediately
- [ ] Background is dark blue-grey (#1a1a2e)
- [ ] Lighting creates visible depth (faces have different brightness)

**Step 3.2: Line Count Verification**
- Run `wc -l src/main.js` to confirm under 100 lines
- If over limit, remove whitespace or consolidate declarations

**Step 3.3: Performance Baseline**
- Open Chrome DevTools Performance tab
- Record 10 seconds of animation
- Verify frame rate stays above 55fps
- Check for memory leaks (heap size should stabilize after initial allocation)

### Phase 4: File Operations Summary

| File | Operation | Justification |
|------|-----------|---------------|
| `package.json` | No change | Already configured correctly with all required dependencies and scripts |
| `index.html` | Create or overwrite | Ensure minimal HTML structure with correct script and CSS links |
| `src/style.css` | Create or overwrite | Apply full-viewport canvas styling with no margins or scrollbars |
| `src/main.js` | Create or overwrite | Implement complete Three.js scene with all required elements |
| `README.md` | Preserve | Keep existing content unchanged per Intent constraints |
| `.orbital/` | Preserve | Do not modify prior orbit artifacts |

**Execution Order:**
1. Create `index.html` (no dependencies)
2. Create `src/style.css` (no dependencies)
3. Create `src/main.js` (depends on package.json being correct)
4. Run `npm install` if `node_modules/` is missing
5. Execute verification steps

## Risk Surface

### Risk 1: Import Path Typo for OrbitControls
**Scenario:** Using `three/addons/controls/OrbitControls.js` (deprecated path) or `three/examples/js/controls/OrbitControls.js` (non-ESM path) causes silent failure where controls initialize but don't function.

**Impact:** Medium — Dev server starts, cube renders, but mouse interactions do nothing. No console error in some browser versions.

**Mitigation:**
- Use exact path: `three/examples/jsm/controls/OrbitControls.js`
- Add inline comment: `// Note: Use /jsm/ path for ESM, not /js/ or /addons/`
- Verification Protocol includes explicit control testing (drag cube with mouse)

### Risk 2: Animation Loop Not Invoked
**Scenario:** Defining `animate()` function but forgetting the initial `animate()` call results in a static scene.

**Impact:** High — Violates core acceptance criteria (rotating cube). Easy to miss in code review because function exists.

**Mitigation:**
- Place `animate();` call immediately after function definition (line adjacency reduces oversight risk)
- Verification Protocol requires confirming rotation with stopwatch (cube should complete 360° in ~10.5 seconds)

### Risk 3: MeshStandardMaterial Appears Black
**Scenario:** If lighting is omitted or misconfigured, `MeshStandardMaterial` renders as black silhouette because physically-based materials require light to compute appearance.

**Impact:** Medium — Cube visible but doesn't meet "lighting reveals cube faces with clear depth perception" acceptance criterion.

**Mitigation:**
- Always add lights before first render
- Use both ambient (base illumination) and directional (depth cues) lights
- Test by removing one light source and verifying cube is still visible (confirms lighting redundancy)

### Risk 4: Resize Handler Updates Only One Dimension
**Scenario:** Updating `renderer.setSize()` without updating `camera.aspect` and `camera.updateProjectionMatrix()` causes stretched rendering after window resize.

**Impact:** Low — Functional but visually incorrect; most users won't resize window during 5-minute exploration.

**Mitigation:**
- Resize handler updates all three properties atomically
- Verification Protocol includes manual window resize test

### Risk 5: Code Exceeds 100-Line Budget
**Scenario:** Adding comments, error handling, or verbose variable names pushes `src/main.js` over constraint.

**Impact:** Medium — Violates explicit Intent constraint; requires refactoring to compress code.

**Mitigation:**
- Current implementation is 48 lines (52% of budget)
- Allowance for 2-3 strategic comments without risk
- If approaching limit, remove blank lines and use terse (but still semantic) variable names

### Risk 6: CSS Loads After JavaScript
**Scenario:** If Vite's module resolution causes `src/main.js` to execute before `src/style.css` loads, there's a frame where default body margins create white borders.

**Impact:** Very Low — Violates "no white flashes or FOUC" acceptance criterion but only visible on slow connections.

**Mitigation:**
- CSS link in `<head>` (blocking) before script in `<body>` (non-blocking)
- Vite's default behavior prioritizes CSS loading
- Verification Protocol tests on throttled connection (Chrome DevTools Network tab: Fast 3G)

### Risk 7: OrbitControls Damping Without Update Call
**Scenario:** If OrbitControls damping is enabled (not in current plan) but `controls.update()` is omitted from animation loop, camera movement feels sluggish or broken.

**Impact:** N/A — Current implementation uses default settings (no damping).

**Mitigation:**
- Explicitly call `controls.update()` in animation loop even with default settings (defensive programming)
- Future-proofs code if someone enables damping by modifying constructor options

### Risk 8: WebGL Context Loss on Low-End Devices
**Scenario:** On devices with limited GPU memory or driver issues, WebGL context loss causes black screen with no recovery.

**Impact:** Very Low — Modern browsers handle context restoration automatically; affects <1% of users on supported hardware.

**Mitigation:**
- Accept as known limitation (adding recovery handler adds 15+ lines)
- Out of scope per Intent's "No production optimization" non-goal
- Document in Verification Protocol that project targets modern hardware (2019+ MacBook Pro equivalent)

### Risk 9: Vite HMR Memory Leak with WebGL
**Scenario:** Hot module replacement causes Three.js to initialize multiple WebGL contexts without disposing old renderer instances, leading to memory growth during development.

**Impact:** Very Low — Affects only development experience; resolved by manual page refresh.

**Mitigation:**
- Accept as known HMR limitation with WebGL applications
- Verification Protocol notes that HMR works for CSS but may require manual refresh for JS changes
- Adding disposal logic adds complexity that violates "minimal" constraint

## Scope Estimate

### Orbit Count: 1 (This Orbit)

**Justification:**
All four files can be created or updated in a single atomic operation. No dependencies on external services, no database migrations, no multi-stage rollouts. The implementation is create-and-verify, not iterative refinement.

### Complexity Assessment: **Low**

**Factors:**
- **No integration points** — Standalone project with no existing codebase to merge into
- **Well-documented technology** — Three.js r160 has stable API with extensive examples
- **Minimal surface area** — 4 files totaling ~150 lines across HTML, CSS, and JavaScript
- **No edge cases** — Single-user, single-browser, no data handling, no async operations
- **Binary success criteria** — Either the cube renders and rotates, or it doesn't

**Complexity Multipliers:**
- ✅ No asynchronous operations (loading, fetching, promises)
- ✅ No user input validation or error handling
- ✅ No cross-browser compatibility testing beyond evergreen browsers
- ✅ No build process configuration (Vite zero-config)
- ✅ No test suite creation (manual verification only per Trust Tier 2)

### Work Breakdown

| Phase | Effort | Deliverables |
|-------|--------|--------------|
| **File Creation** | 15 minutes | `index.html`, `src/style.css`, `src/main.js` written to specification |
| **Dependency Verification** | 5 minutes | Confirm `package.json` unchanged, `node_modules/` populated |
| **Manual Testing** | 10 minutes | Execute verification checklist (dev server, rendering, controls, resize) |
| **Line Count Audit** | 2 minutes | Verify `src/main.js` under 100 lines, adjust if needed |
| **Performance Baseline** | 5 minutes | Record frame rate, check memory stability |
| **Documentation Review** | 3 minutes | Confirm code comments explain Three.js concepts (not implementation) |

**Total Estimated Effort:** 40 minutes (hands-on keyboard time)

**Human Review Estimate:** 2-5 minutes
- Start dev server: 10 seconds
- Visual inspection: 30 seconds (cube visible, rotating, correct colors)
- Interaction test: 20 seconds (drag cube with mouse, verify controls work)
- Resize test: 10 seconds (drag browser window corner, verify canvas adapts)
- Code quality scan: 1-2 minutes (read `src/main.js`, check for obvious errors)

### Confidence Level: **High (95%)**

**Reasoning:**
- Implementation follows canonical Three.js patterns from official documentation
- Prior orbits in repository suggest project structure is already correct
- No novel algorithms or untested integrations
- Success criteria are objective and measurable
- Technology stack is mature and stable (Vite 5.x, Three.js 0.160.x)

**Risk Factors:**
- 5% failure probability accounts for:
  - Undiscovered file permissions issues preventing write operations
  - Vite version incompatibility with Node.js environment
  - Browser WebGL implementation quirks on specific OS/GPU combinations

## Human Modifications

Pending human review.