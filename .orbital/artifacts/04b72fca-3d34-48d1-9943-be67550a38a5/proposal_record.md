# Proposal Record: Three.js Starter Project

## Interpreted Intent

This orbit creates a minimal, pedagogical Three.js starter template optimized for immediate experimentation. The primary goal is **reducing cognitive load for WebGL beginners** by providing a working 3D scene in under 100 lines of vanilla JavaScript that demonstrates core Three.js concepts: scene graph hierarchy, physically-based rendering with `MeshStandardMaterial`, camera positioning, lighting composition, animation loops, and interactive controls.

The implementation must satisfy these non-negotiable constraints:

1. **Zero configuration overhead** — Running `npm install && npm run dev` must immediately launch a functional 3D scene without additional setup steps
2. **Strict minimalism** — Total JavaScript logic in `src/main.js` cannot exceed 100 lines (excluding blank lines and comments), forcing clean, readable code patterns
3. **Framework-free architecture** — Pure ES6 JavaScript with no TypeScript compilation, no React/Vue abstractions, no build complexity beyond Vite's zero-config defaults
4. **Teaching-oriented code quality** — Variable names, function structure, and optional inline comments must communicate Three.js fundamentals to learners unfamiliar with WebGL

The secondary goal is **demonstrating modern web development patterns**: ES6 modules, hot module replacement, viewport-responsive rendering, and GPU-accelerated graphics in a browser-native context. This positions the starter as both a learning tool and a foundation for rapid 3D prototyping.

**Success criteria alignment**: The orbit completes when a developer can clone the repository, run two shell commands, and see a smoothly rotating cube with realistic lighting that responds to mouse-based camera manipulation — achieving the Intent's "zero-friction onboarding" outcome.

## Implementation Plan

### Phase 1: HTML Entry Point Configuration

**File:** `index.html` (root)

**Current State:** File exists but content unknown

**Required Changes:**
- Create minimal HTML5 boilerplate with UTF-8 charset and viewport meta tag
- Include ES6 module script reference: `<script type="module" src="/src/main.js"></script>`
- Omit `<canvas>` element — Three.js `WebGLRenderer` will auto-create and append to `document.body`
- Set `<title>` to "Three.js Starter" for browser tab identification

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

**Rationale:** Vite requires explicit ES6 module type declaration. Auto-creating canvas eliminates HTML boilerplate and demonstrates Three.js DOM manipulation patterns.

### Phase 2: CSS Viewport Styling

**File:** `src/style.css`

**Current State:** File exists but content unknown

**Required Changes:**
- Remove all default browser margins and padding from `<body>`
- Configure `overflow: hidden` to prevent scrollbars during window resize transitions
- Force canvas to fill entire viewport with `display: block` and `100vw/100vh` dimensions
- Eliminate potential white gaps between canvas and viewport edges

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
  width: 100vw;
  height: 100vh;
}
```

**Rationale:** Universal selector reset ensures no browser default styles interfere. `display: block` on canvas prevents inline element spacing issues. `overflow: hidden` on body prevents scroll bars when renderer updates size asynchronously.

### Phase 3: Three.js Scene Implementation

**File:** `src/main.js`

**Current State:** File exists but implementation unknown

**Implementation Structure (32 lines estimated):**

1. **Module Imports (2 lines)**
   ```javascript
   import * as THREE from 'three';
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
   ```

2. **CSS Import (1 line)**
   ```javascript
   import './style.css';
   ```

3. **Scene Initialization (2 lines)**
   ```javascript
   const scene = new THREE.Scene();
   scene.background = new THREE.Color(0x1a1a2e);
   ```

4. **Camera Configuration (2 lines)**
   ```javascript
   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
   camera.position.z = 5;
   ```

5. **Renderer Setup (3 lines)**
   ```javascript
   const renderer = new THREE.WebGLRenderer({ antialias: true });
   renderer.setSize(window.innerWidth, window.innerHeight);
   document.body.appendChild(renderer.domElement);
   ```

6. **Lighting Setup (4 lines)**
   ```javascript
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
   scene.add(ambientLight);
   const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
   directionalLight.position.set(5, 5, 5);
   scene.add(directionalLight);
   ```

7. **Cube Geometry (4 lines)**
   ```javascript
   const geometry = new THREE.BoxGeometry(1, 1, 1);
   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
   const cube = new THREE.Mesh(geometry, material);
   scene.add(cube);
   ```

8. **OrbitControls Configuration (3 lines)**
   ```javascript
   const controls = new OrbitControls(camera, renderer.domElement);
   controls.enableDamping = true;
   controls.dampingFactor = 0.05;
   ```

9. **Window Resize Handler (5 lines)**
   ```javascript
   window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight;
     camera.updateProjectionMatrix();
     renderer.setSize(window.innerWidth, window.innerHeight);
   });
   ```

10. **Animation Loop (6 lines)**
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

**Total Line Count:** 32 lines of executable code (well under 100-line constraint)

**Pedagogical Enhancements (Optional, +5 lines):**
- Add brief inline comments explaining `camera.updateProjectionMatrix()` requirement
- Comment on `controls.update()` necessity for damping effect
- Document rotation increment units (radians per frame)

### Phase 4: Dependency Verification

**File:** `package.json` (root)

**Current State:** Already contains correct dependencies

**Verification Steps:**
1. Confirm `"type": "module"` field exists (enables ES6 imports)
2. Verify `three: ^0.160.0` in dependencies
3. Verify `vite: ^5.0.0` in devDependencies
4. Confirm `"dev": "vite"` script exists
5. Check `"engines": { "node": ">=18.0.0" }` field

**Action Required:** None — existing configuration already meets all Intent requirements

### Phase 5: Documentation Alignment

**File:** `README.md` (root)

**Current State:** Documents functionality in future tense, suggesting pre-implementation specification

**Verification Steps:**
1. Confirm documented controls (left-click rotate, right-click pan, scroll zoom) match OrbitControls default bindings
2. Verify structure section matches actual file layout
3. Ensure Quick Start commands (`npm install`, `npm run dev`) reflect package.json scripts

**Action Required:** None unless implementation deviates from documented behavior (e.g., custom OrbitControls key bindings)

### Execution Order

1. **Modify `index.html`** — Establish Vite entry point and ES6 module loader
2. **Modify `src/style.css`** — Configure viewport-filling canvas styles
3. **Modify `src/main.js`** — Implement complete Three.js scene with all required components
4. **Verify `package.json`** — Confirm dependencies and scripts (read-only verification)
5. **Test execution** — Run `npm run dev` and validate visual output, controls, and HMR

### Dependency Chain

- `index.html` must exist before Vite can serve application
- `src/style.css` must be importable when `main.js` executes
- `src/main.js` imports depend on `node_modules/three` (installed via `npm install`)
- OrbitControls import requires Three.js v0.150.0+ for correct JSM path

**Critical Path:** HTML → CSS import → Three.js initialization → Scene composition → Animation loop start

## Risk Surface

### Risk: Incorrect OrbitControls Import Path

**Scenario:** Using deprecated import `three/examples/js/controls/OrbitControls` (UMD format) instead of `three/examples/jsm/controls/OrbitControls.js` (ES6 modules)

**Detection:** Runtime error: "Failed to resolve module specifier 'three/examples/js/controls/OrbitControls'"

**Impact:** Medium — Application fails to initialize, blank screen with console error

**Mitigation:**
- Use canonical JSM path: `three/examples/jsm/controls/OrbitControls.js`
- Verify import statement includes `.js` extension (required for ES6 module resolution)
- Test with Three.js v0.160.0 specifically (version pinned in package.json)

**Rollback Plan:** Revert to direct camera manipulation if OrbitControls import fails (violates Intent requirement but provides functional fallback)

### Risk: Line Count Exceeds 100-Line Budget

**Scenario:** Implementation includes verbose variable names, excessive whitespace, or unnecessary abstraction layers pushing beyond constraint

**Detection:** Manual line count of `src/main.js` (excluding blank lines and comments)

**Impact:** Low — Functionality works but violates pedagogical constraint, triggering Tier 2 human review failure

**Mitigation:**
- Use 32-line implementation plan as baseline (68-line buffer)
- Avoid intermediate variables for single-use values (e.g., pass `new THREE.Color(0x1a1a2e)` directly to `scene.background`)
- Consolidate related operations (e.g., `light.position.set(5, 5, 5); scene.add(light);` on consecutive lines)
- Omit comments in initial implementation (can add pedagogical comments later if under budget)

**Measurement:** Final line count = `wc -l src/main.js` minus blank lines (`grep -c '^$' src/main.js`) minus comment lines (`grep -c '^s*//' src/main.js`)

### Risk: WebGL Context Creation Failure

**Scenario:** User runs application in unsupported browser (IE11, very old Safari) or on device without GPU

**Detection:** Three.js throws exception: "Error creating WebGL context"

**Impact:** High — Complete application failure with uncaught exception

**Mitigation:**
- **Acceptable per Intent:** No error handling required — Intent specifies "Modern browsers with native ES6 module and WebGL support"
- README documents requirement explicitly: "Modern browser with WebGL support"
- Let Three.js native error propagate to console (clear diagnostic for user)
- Do NOT add try-catch blocks (adds lines, violates simplicity constraint)

**User Responsibility:** Browser compatibility verification before execution

### Risk: Canvas Size Calculation Race Condition

**Scenario:** During window resize, `camera.aspect` calculation uses stale `window.innerWidth/Height` values before layout completes

**Detection:** Brief canvas distortion (stretched/squashed cube) during rapid resize

**Impact:** Low — Visual artifact resolves within 1-2 frames after resize completes

**Mitigation:**
- Accept immediate resize behavior (meets Intent "Acceptable" criteria: "Instant resize with maintained aspect ratio")
- Intent's "Ideal" criteria (debounced resize) is optional enhancement requiring additional code (lodash.debounce or custom implementation with setTimeout)
- Trade-off: Debouncing would exceed line budget and add complexity inappropriate for starter template

**Performance Note:** Modern browsers batch layout calculations, minimizing actual race condition occurrence

### Risk: OrbitControls Damping Not Updated

**Scenario:** Developer copies animation loop but forgets `controls.update()` call, resulting in jerky camera motion when damping is enabled

**Detection:** Camera snaps to final position on mouse release instead of coasting smoothly

**Impact:** Medium — Fails Intent "Ideal" acceptance criteria: "Smooth inertia with constrained vertical rotation"

**Mitigation:**
- **Always include `controls.update()` before `renderer.render()` in animation loop**
- Add inline comment: `controls.update(); // Required for damping`
- Position call immediately before render to establish visual pattern (update phase → render phase)

**Validation Test:** Drag camera with mouse, release — should decelerate smoothly over 0.5-1 second

### Risk: Lighting Configuration Produces Flat Shading

**Scenario:** Incorrect light intensity ratios or positioning cause cube to appear uniformly lit without visible gradation

**Detection:** All cube faces appear same brightness (fails Intent visual quality gate: "Cube faces must show clear light/shadow gradation")

**Impact:** Medium — Functional but pedagogically ineffective (fails to demonstrate PBR lighting)

**Mitigation:**
- Use proven lighting ratio: `AmbientLight(0xffffff, 0.5)` + `DirectionalLight(0xffffff, 1.0)`
- Position directional light at (5, 5, 5) — upper-right quadrant creates visible diagonal gradation
- Test with `MeshStandardMaterial({ color: 0xffffff })` — white surface maximizes visible light variation

**Visual Validation:** Top-right cube faces should be brighter than bottom-left faces (approximately 2:1 brightness ratio)

### Risk: Vite HMR Breaks Three.js State

**Scenario:** Hot module replacement updates `main.js` while animation loop is running, creating duplicate scene instances or orphaned event listeners

**Detection:** Performance degradation over time (multiple animation loops running), memory leak, multiple canvas elements

**Impact:** Medium — Degrades development experience, requires full page reload

**Mitigation:**
- **Acceptable risk** — Vite's default HMR behavior handles most cases correctly
- Animation loop using `requestAnimationFrame` naturally terminates when module reloads (RAF callbacks reference old closure scope)
- Renderer appends canvas to `document.body` — Vite HMR clears body content on reload
- No manual cleanup required given starter template simplicity

**Workaround:** If HMR issues occur, full page reload (`Ctrl+R`) resolves state

### Risk: Rotation Speed Too Fast/Slow

**Scenario:** Rotation increment of 0.01 radians per frame produces motion that appears too rapid (nauseating) or too slow (static) depending on display refresh rate

**Detection:** Visual assessment — cube should complete 1 full rotation every ~10 seconds at 60fps

**Impact:** Low — Aesthetic preference, does not affect functionality

**Mitigation:**
- Use 0.01 radians/frame as baseline (proven value from Context Package patterns)
- At 60fps: 0.01 × 60 = 0.6 radians/second ≈ 10.5 seconds per full rotation (2π radians)
- If adjustment needed during human review, modify increment without touching other code

**Calculation:** `rotationSpeed = (2 * Math.PI) / (fps * desiredSecondsPerRotation)`

## Scope Estimate

### Orbit Breakdown

**Single Orbit Completion:** This proposal implements all requirements in Orbit 2 with no additional orbits required

**Complexity Assessment:** Low-Medium
- **Low Complexity:** No external API integration, no state management, no testing infrastructure, no deployment configuration
- **Medium Complexity:** Requires precise Three.js API knowledge, line count constraint demands careful code organization, pedagogical quality requires human judgment

### Work Phase Decomposition

| Phase | Description | Estimated Duration | Complexity |
|-------|-------------|-------------------|------------|
| **HTML Configuration** | Modify `index.html` with ES6 module script tag | 5 minutes | Trivial |
| **CSS Styling** | Implement viewport-filling canvas styles in `src/style.css` | 5 minutes | Trivial |
| **Three.js Implementation** | Complete scene setup, lighting, geometry, controls, animation loop in `src/main.js` | 20 minutes | Medium |
| **Dependency Verification** | Confirm `package.json` configuration correctness | 2 minutes | Trivial |
| **Manual Testing** | Run `npm run dev`, validate visual output, test controls, verify HMR | 10 minutes | Low |
| **Line Count Audit** | Verify `src/main.js` under 100 lines | 2 minutes | Trivial |
| **Documentation Review** | Ensure README aligns with implementation | 3 minutes | Trivial |
| **Total** | End-to-end implementation and validation | **~45 minutes** | **Low-Medium** |

### Confidence Assessment

**High Confidence (90%)** that implementation will meet all Intent acceptance criteria on first attempt because:
- All required files already exist in repository (no scaffolding needed)
- Package.json dependencies are pre-configured correctly
- Three.js patterns from Context Package are proven and stable
- 32-line implementation estimate provides 68-line buffer (3x safety margin)
- No external service dependencies or integration points

**Medium Confidence (70%)** that implementation will meet "Excellent" code quality criteria without iteration because:
- Pedagogical quality is subjective (requires human review per Tier 2)
- Variable naming clarity depends on reviewer's assessment of "self-documenting"
- Optimal comment placement requires balancing brevity with teaching value

### Risk-Adjusted Timeline

- **Best Case:** 45 minutes (implementation works first try, passes human review)
- **Expected Case:** 60 minutes (minor adjustments to variable naming or comment placement during review)
- **Worst Case:** 90 minutes (line count exceeded, requiring refactoring to consolidate code)

### Deliverables Checklist

Upon orbit completion, the following artifacts will exist:

- ✅ `index.html` — HTML5 boilerplate with ES6 module script reference
- ✅ `src/style.css` — Viewport-filling canvas styles with zero margins
- ✅ `src/main.js` — Complete Three.js scene implementation under 100 lines
- ✅ `package.json` — Verified dependency configuration (no modifications)
- ✅ `README.md` — Verified documentation alignment (no modifications expected)
- ✅ Working development server on `http://localhost:5173` with HMR
- ✅ Rotating cube with PBR lighting and interactive camera controls
- ✅ Passing all Intent acceptance criteria (Minimum → Acceptable tier)

### Success Metrics

**Quantitative Gates:**
- `src/main.js` line count ≤ 100 (excluding blank lines and comments)
- Vite dev server startup time ≤ 5 seconds (Intent "Target" criteria)
- No console errors or warnings on application load
- Frame rate ≥ 55fps on standard hardware (allows 8% variance from 60fps target)

**Qualitative Gates (Human Review Required):**
- Code readability assessed by reviewer as "Acceptable" or higher
- Variable names are self-documenting without requiring comments
- Lighting produces visible gradation across cube faces
- OrbitControls feel responsive with smooth damping

## Human Modifications

Pending human review.