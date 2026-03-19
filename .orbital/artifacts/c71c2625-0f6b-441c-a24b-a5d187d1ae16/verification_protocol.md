# Verification Protocol: Three.js Starter Project

## Automated Gates

### Gate 1: File Structure Validation
**Purpose:** Verify exactly 4 project files exist with correct names and locations  
**Tool:** Shell script or filesystem check  
**Pass Criteria:**
```bash
# Expected files (relative to repository root)
✓ index.html
✓ package.json
✓ src/main.js
✓ src/style.css
```

**Failure Conditions:**
- Missing any of the 4 required files
- Extra configuration files (e.g., `vite.config.js`, `.env`, `tsconfig.json`)
- JavaScript files outside `src/` directory
- TypeScript files (`.ts`, `.tsx`) anywhere in repository

**Test Command:**
```bash
# Count files (should be exactly 4 + README.md)
find . -type f 
  -not -path './node_modules/*' 
  -not -path './.git/*' 
  -not -path './.orbital/*' 
  -not -name 'package-lock.json' 
  -not -name 'README.md' | wc -l
# Expected output: 4
```

**Maps to Intent:** Constraint "File Structure Immutability — Exactly four files required"

---

### Gate 2: package.json Schema Validation
**Purpose:** Verify dependencies, scripts, and Node version constraints  
**Tool:** JSON schema validator or npm audit  
**Pass Criteria:**

```json
{
  "dependencies": {
    "three": "^0.160.0"  // Only Three.js, no other packages
  },
  "devDependencies": {
    "vite": "^5.0.0"     // Only Vite, no other packages
  },
  "scripts": {
    "dev": "vite"        // Only dev script, no build/preview
  },
  "engines": {
    "node": ">=18.0.0"   // Node 18+ requirement
  }
}
```

**Validation Steps:**
1. Parse `package.json` as JSON (must be valid JSON)
2. Count dependencies: exactly 1 (`three`)
3. Count devDependencies: exactly 1 (`vite`)
4. Count scripts: exactly 1 (`dev`)
5. Verify `engines.node` specifies `>=18.0.0`
6. Confirm no `peerDependencies`, `optionalDependencies`, or framework packages

**Failure Conditions:**
- React, Vue, Svelte, or any UI framework in dependencies
- TypeScript in devDependencies
- Build tools beyond Vite (webpack, rollup, parcel)
- Production build scripts (`build`, `preview`)
- Missing `"type": "module"` field

**Test Command:**
```bash
# Verify dependency count
cat package.json | jq '.dependencies | length'  # Expected: 1
cat package.json | jq '.devDependencies | length'  # Expected: 1

# Verify Three.js version constraint
cat package.json | jq -r '.dependencies.three' | grep -q '^^0.160.0$'
echo $?  # Expected: 0 (success)
```

**Maps to Intent:** Constraint "Dependency minimalism — Only three and vite"

---

### Gate 3: JavaScript Line Count Budget
**Purpose:** Enforce 100-line limit in `src/main.js`  
**Tool:** Line counting script with exclusion rules  
**Pass Criteria:** ≤100 non-blank, non-comment lines

**Counting Rules (from Proposal):**
- **Exclude:** Blank lines (zero non-whitespace characters)
- **Exclude:** Single-line comments starting with `//`
- **Include:** Multi-line comments (`/* ... */`) as 1 line per physical line
- **Include:** Import statements
- **Include:** All executable code

**Test Script:**
```bash
#!/bin/bash
# Count lines in src/main.js excluding blanks and single-line comments
grep -v -E '^s*$|^s*//' src/main.js | wc -l
# Expected: ≤100
```

**Failure Conditions:**
- Line count exceeds 100
- Minified code (multiple statements per line to game the count)
- Code split across multiple files to circumvent limit

**Output Format:**
```
Line count: 45 / 100 ✓ PASS
```

**Maps to Intent:** Constraint "Code budget — Total JavaScript must not exceed 100 lines in src/main.js"

---

### Gate 4: Dependency Installation Success
**Purpose:** Verify `npm install` completes without errors  
**Tool:** npm CLI  
**Pass Criteria:** Exit code 0, no error messages in stdout/stderr

**Test Command:**
```bash
npm install --prefer-offline 2>&1 | tee install.log
echo "Exit code: $?"
# Expected: Exit code: 0
```

**Failure Conditions:**
- npm exits with non-zero code
- `ENOTFOUND`, `ETARGET`, or `ERESOLVE` errors
- Peer dependency warnings for unlisted packages
- `package-lock.json` shows dependency conflicts

**Retry Strategy (for transient failures):**
- Wait 5 minutes and retry if registry unreachable (`ENOTFOUND`)
- Clear npm cache if checksum mismatch (`EINTEGRITY`)
- Max 3 retries before escalating to human

**Maps to Intent:** Acceptance Boundary "Running npm install completes without errors"

---

### Gate 5: Dev Server Startup
**Purpose:** Verify `npm run dev` starts Vite on port 5173  
**Tool:** npm CLI + port check  
**Pass Criteria:** 
- Vite dev server starts within 5 seconds
- Binds to `http://localhost:5173`
- No error messages in console

**Test Command:**
```bash
# Start dev server in background
npm run dev > dev.log 2>&1 &
DEV_PID=$!

# Wait up to 5 seconds for port to open
timeout 5 bash -c 'until nc -z localhost 5173; do sleep 0.1; done'

# Check if port is listening
curl -s -o /dev/null -w "%{http_code}" http://localhost:5173
# Expected: 200

# Clean up
kill $DEV_PID
```

**Failure Conditions:**
- Port 5173 already in use (bind error)
- Vite crashes on startup (module resolution error)
- Timeout after 5 seconds (hung process)
- HTTP response code other than 200

**Maps to Intent:** Acceptance Boundary "Running npm run dev starts a dev server accessible at http://localhost:5173"

---

### Gate 6: Browser Console Error Scan
**Purpose:** Detect JavaScript runtime errors and import failures  
**Tool:** Puppeteer or Playwright for headless browser automation  
**Pass Criteria:** Zero console errors after 5 seconds

**Test Script (Puppeteer):**
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(5000);  // Wait 5s for scene init
  
  await browser.close();
  
  if (errors.length > 0) {
    console.error('Console errors detected:');
    errors.forEach(e => console.error(`  - ${e}`));
    process.exit(1);
  }
  
  console.log('✓ No console errors');
})();
```

**Failure Conditions:**
- Module resolution errors (`Failed to resolve module specifier`)
- Three.js API errors (`Cannot read property 'Scene' of undefined`)
- OrbitControls import errors (most common failure mode)
- WebGL context creation errors (GPU not available)

**Maps to Intent:** Acceptance Boundary "Code quality — No console warnings, no errors"

---

### Gate 7: Three.js Version Verification
**Purpose:** Confirm installed Three.js version matches proposal specification  
**Tool:** npm list  
**Pass Criteria:** Three.js version in range `0.160.0` to `<0.161.0`

**Test Command:**
```bash
npm list three --depth=0 | grep three@
# Expected output: three@0.160.x (where x is any patch version)
```

**Version-Specific Import Path Check:**
- If version ≥ 0.160.0: Import path must be `three/addons/controls/OrbitControls.js`
- If version < 0.160.0: Import path must be `three/examples/jsm/controls/OrbitControls.js`

**Validation Script:**
```bash
THREE_VERSION=$(npm list three --depth=0 --json | jq -r '.dependencies.three.version')
IMPORT_PATH=$(grep -o "three/[^']*OrbitControls" src/main.js)

if [[ "$THREE_VERSION" =~ ^0.16[0-9] ]]; then
  [[ "$IMPORT_PATH" == "three/addons/controls/OrbitControls.js" ]] && echo "✓ PASS" || echo "✗ FAIL"
else
  [[ "$IMPORT_PATH" == "three/examples/jsm/controls/OrbitControls.js" ]] && echo "✓ PASS" || echo "✗ FAIL"
fi
```

**Maps to Intent:** Dependency "Three.js library (npm package three): Latest stable version from npm registry"

---

### Gate 8: CSS Viewport Reset Validation
**Purpose:** Verify full-viewport canvas styling without margins  
**Tool:** CSS parser or grep pattern match  
**Pass Criteria:** `src/style.css` contains margin/padding reset and overflow hidden

**Required CSS Rules:**
```css
* { margin: 0; padding: 0; }      /* Universal reset */
body { overflow: hidden; }        /* No scrollbars */
canvas { display: block; }        /* Remove inline spacing */
```

**Test Command:**
```bash
# Check for required CSS patterns
grep -q "margin: 0" src/style.css && 
grep -q "padding: 0" src/style.css && 
grep -q "overflow: hidden" src/style.css && 
grep -q "canvas.*display: block" src/style.css
echo $?  # Expected: 0 (all patterns found)
```

**Failure Conditions:**
- Missing margin/padding reset (browser default spacing visible)
- `overflow: auto` or `overflow: scroll` (scrollbars appear)
- Canvas not set to `display: block` (4px gap below canvas)

**Maps to Intent:** Constraint "Canvas must fill 100% of viewport with zero margin/padding/overflow"

---

### Gate 9: HTML Module Script Validation
**Purpose:** Verify `index.html` uses ES6 module imports  
**Tool:** HTML parser or grep  
**Pass Criteria:** `<script type="module">` present, no `<canvas>` element

**Test Command:**
```bash
# Verify module script type
grep -q '<script type="module"' index.html
echo $?  # Expected: 0

# Verify no pre-existing canvas element (Three.js creates dynamically)
! grep -q '<canvas' index.html
echo $?  # Expected: 0 (no canvas found)
```

**Failure Conditions:**
- `<script>` without `type="module"` (ES6 imports fail)
- Hardcoded `<canvas>` element (conflicts with Three.js renderer)
- Missing CSS link to `src/style.css`

**Maps to Intent:** Architecture Context "Browser-Native Patterns — ES6 module imports"

---

## Human Verification Points

### Verification Point 1: Visual Scene Inspection
**Objective:** Confirm 3D scene renders correctly with all required elements  
**Executor:** Human reviewer with browser access  
**Duration:** 60 seconds

**Procedure:**
1. Open `http://localhost:5173` in Chrome, Firefox, or Safari
2. Wait 2 seconds for scene initialization
3. Observe the following elements:

**Checklist:**
- [ ] **Cube visible:** A 3D cube is clearly visible in the center of viewport
- [ ] **Cube color:** Cube is bright green (`0x00ff00` material color)
- [ ] **Rotation:** Cube continuously rotates on both X and Y axes (not static)
- [ ] **Background color:** Canvas background is dark blue-grey (matches `0x1a1a2e` hex)
- [ ] **Sharp edges:** Cube corners are crisp, not pixelated (antialiasing enabled)
- [ ] **Lighting visible:** Cube faces show varying brightness (not flat-shaded)

**Pass Criteria:** All 6 checkboxes marked  
**Failure Action:** If any element missing, escalate to Escape Criteria section

**Maps to Intent:** 
- Acceptance Boundary "A cube is visible and continuously rotating on both X and Y axes"
- Acceptance Boundary "Background color matches 0x1a1a2e specification"
- Verification Signal "Cube corners are sharp, not jagged (antialiasing enabled)"

---

### Verification Point 2: Lighting Realism Assessment
**Objective:** Verify shading gradients meet "realistic lighting" threshold  
**Executor:** Human reviewer  
**Duration:** 30 seconds

**Procedure:**
1. With scene running, observe cube face brightness
2. Identify the three visible faces (front, top, right)
3. Compare brightness across faces

**Expected Gradient Pattern:**
- **Top face:** Brightest (DirectionalLight position `(5,5,5)` illuminates from above)
- **Front-right face:** Medium brightness (angled toward light source)
- **Front-left face:** Darkest (angled away from light source)

**Visual Reference (Brightness Scale):**
```
Top:    ████████ (80-100% brightness)
Right:  ██████   (60-80% brightness)
Left:   ████     (40-60% brightness)
```

**Acceptance Threshold:** 
- At least 20% brightness difference between brightest and darkest visible face
- No pure black faces (AmbientLight prevents complete darkness)
- Smooth color transition across faces (no banding artifacts)

**Pass Criteria:** Visible gradient meets threshold  
**Marginal Case:** 10-20% difference acceptable if faces clearly distinguishable  
**Failure:** <10% difference or all faces same brightness (lighting error)

**Maps to Intent:** Acceptance Boundary "Lighting realism — Cube faces show clear shading gradients"

---

### Verification Point 3: Mouse Interaction Test
**Objective:** Verify OrbitControls enable camera movement via mouse  
**Executor:** Human reviewer  
**Duration:** 60 seconds

**Procedure:**
1. With scene running, position cursor over canvas
2. Click and drag left/right → Camera orbits horizontally around cube
3. Click and drag up/down → Camera orbits vertically around cube
4. Scroll mouse wheel up → Camera zooms toward cube
5. Scroll mouse wheel down → Camera zooms away from cube

**Pass Criteria:**
- [ ] Left/right drag: Camera position changes, cube rotates in opposite direction
- [ ] Up/down drag: Camera elevation changes, viewing angle shifts
- [ ] Zoom in: Cube appears larger, fills more of viewport
- [ ] Zoom out: Cube appears smaller, more background visible
- [ ] Cube remains in frame: Camera never loses sight of cube during interaction

**Behavioral Checks:**
- Camera movement is **smooth** (no stuttering or frame drops during drag)
- Cube rotation continues **while dragging** (animation loop not blocked)
- Mouse cursor changes to **grab cursor** during drag (browser feedback)

**Failure Conditions:**
- No response to mouse drag (OrbitControls not initialized)
- Camera snaps/jumps instead of smooth motion (damping misconfigured)
- Cube disappears when zooming (camera near/far plane clipping)

**Maps to Intent:** 
- Acceptance Boundary "Mouse drag rotates camera view (OrbitControls functional)"
- Verification Signal "Zooming with mouse wheel maintains cube in frame"

---

### Verification Point 4: Window Resize Responsiveness
**Objective:** Verify canvas and camera adapt to window dimension changes  
**Executor:** Human reviewer  
**Duration:** 90 seconds

**Procedure:**
1. Start with browser window at 1920x1080 (or similar 16:9 aspect ratio)
2. Observe cube shape (should appear cubic, not stretched)
3. Drag window corner to resize: 1280x720 → 1024x768 → 800x600
4. At each size, verify:

**Responsiveness Checklist:**
- [ ] Canvas fills entire viewport (no gaps, scrollbars, or overflow)
- [ ] Cube remains cubic (not elliptical or distorted)
- [ ] Background color persists (no white flashes during resize)
- [ ] Frame rate remains smooth (no sustained lag below 50 FPS)

**Aspect Ratio Test Cases:**

| Window Size | Aspect Ratio | Expected Cube Shape |
|-------------|--------------|---------------------|
| 1920x1080   | 16:9 (wide)  | Cubic (width = height visually) |
| 1024x768    | 4:3 (square) | Cubic |
| 800x1200    | 2:3 (tall)   | Cubic |

**Extreme Case Test:**
- Resize to minimum (400x300): Cube should remain cubic, still fill 20-60% of viewport
- Resize to ultrawide (2560x1080): Cube should remain cubic, background visible on sides

**Failure Conditions:**
- Cube stretches horizontally (aspect ratio not updated)
- Canvas does not resize (fixed dimensions instead of `window.innerWidth/Height`)
- Scrollbars appear (body overflow not hidden)

**Maps to Intent:** 
- Acceptance Boundary "Resizing browser window updates canvas dimensions without distortion"
- Verification Signal "Canvas aspect ratio matches window aspect ratio at all sizes above 400x300px"

---

### Verification Point 5: Rotation Speed Measurement
**Objective:** Verify cube rotation speed falls within acceptable range  
**Executor:** Human reviewer with stopwatch  
**Duration:** 30 seconds

**Procedure:**
1. Identify a reference point on the cube (e.g., top-left corner)
2. Start stopwatch when reference point reaches 12 o'clock position
3. Stop stopwatch when reference point completes full rotation back to 12 o'clock
4. Record rotation duration in seconds

**Acceptance Ranges:**
- **Ideal:** 8-12 seconds per full rotation (matches Intent specification)
- **Acceptable:** 5-20 seconds per full rotation (wider tolerance)
- **Failure:** <5 seconds (too fast, disorienting) or >20 seconds (too slow, appears static)

**Speed Calculation (from Proposal):**
```
Rotation speed: 0.01 radians per frame
At 60 FPS: 0.01 × 60 = 0.6 rad/sec
Full rotation (2π rad): 2π / 0.6 ≈ 10.5 seconds
```

**Pass Criteria:** Measured duration within 5-20 second range  
**Marginal Case:** 4-5 seconds or 20-25 seconds acceptable if reviewer approves subjective "feel"  
**Optimization Note:** If rotation too slow, increase `cube.rotation.x/y` increment in `src/main.js`

**Maps to Intent:** Acceptance Boundary "Rotation speed — Cube completes one full rotation in 8-12 seconds (acceptable: 5-20 seconds)"

---

### Verification Point 6: Viewport Fill Percentage
**Objective:** Verify cube size relative to viewport meets 20-60% threshold  
**Executor:** Human reviewer (visual estimation or screenshot measurement)  
**Duration:** 60 seconds

**Procedure:**
1. Take screenshot of browser at 1920x1080 resolution
2. Measure cube diagonal from top-left corner to bottom-right corner (in pixels)
3. Measure viewport diagonal (1920² + 1080² = ~2203 pixels)
4. Calculate percentage: (cube diagonal / viewport diagonal) × 100

**Visual Estimation (No Tools):**
- Cube should occupy roughly 1/4 to 1/2 of screen width
- Cube should occupy roughly 1/3 to 2/3 of screen height
- Background clearly visible on all sides (cube not touching edges)

**Acceptance Ranges:**
- **Ideal:** 30-50% viewport fill (Proposal target)
- **Acceptable:** 20-60% viewport fill (Intent specification)
- **Failure:** <20% (cube too small, hard to see details) or >60% (cube too large, feels claustrophobic)

**Adjustment Strategy (if out of range):**
- Cube too small: Decrease `camera.position.z` (move camera closer)
- Cube too large: Increase `camera.position.z` (move camera farther)
- **Proposal default:** `camera.position.z = 5` with `BoxGeometry(2, 2, 2)` → ~35% fill

**Maps to Intent:** Acceptance Boundary "Camera distance — Cube fills approximately 30-50% of viewport (acceptable: 20-60%)"

---

### Verification Point 7: Performance Frame Rate Check
**Objective:** Verify smooth rendering at 50+ FPS on reference hardware  
**Executor:** Human reviewer with DevTools  
**Duration:** 60 seconds

**Procedure:**
1. Open Chrome DevTools → Performance tab
2. Click "Record" button
3. Let scene run for 10 seconds (capture stable state)
4. Stop recording and inspect FPS graph

**Target Hardware (from Intent):**
- **Reference Device:** M1 MacBook Air or equivalent (2020+)
- **Display:** 1080p resolution (1920x1080)
- **Browser:** Chrome 120+ or Firefox 120+

**Acceptance Thresholds:**
- **Ideal:** 60 FPS sustained (perfect frame time: 16.67ms)
- **Acceptable:** 50+ FPS average (frame time: <20ms)
- **Marginal:** 45-50 FPS (acceptable if no visible stuttering)
- **Failure:** <45 FPS sustained (visible lag, poor UX)

**Performance Scenarios:**

| Scenario | Expected FPS | Notes |
|----------|--------------|-------|
| Static view (no interaction) | 60 FPS | Baseline performance |
| Mouse drag (OrbitControls active) | 55-60 FPS | Minor overhead acceptable |
| Window resize (drag corner) | 50-55 FPS | Brief FPS drop acceptable |
| High-DPI display (4K) | 50+ FPS | Accept lower bound |

**Failure Investigation:**
- If FPS <50: Check GPU utilization (should be <80%)
- If stuttering: Check for JavaScript long tasks (>50ms)
- If resize lag: Acceptable per Intent non-goals (no debouncing)

**Maps to Intent:** Acceptance Boundary "Performance — 60 FPS on M1 MacBook Air at 1080p viewport (acceptable: 50+ FPS)"

---

### Verification Point 8: Code Quality Manual Review
**Objective:** Verify code readability, patterns, and absence of bad practices  
**Executor:** Senior engineer familiar with Three.js  
**Duration:** 5 minutes

**Review Checklist:**

**Import Statements:**
- [ ] Three.js imported as namespace: `import * as THREE from 'three'`
- [ ] OrbitControls imported correctly: `import { OrbitControls } from 'three/addons/controls/OrbitControls.js'`
- [ ] No unused imports (grep for unused variables)

**Scene Setup:**
- [ ] Camera FOV reasonable (60-90 degrees)
- [ ] Renderer has antialias enabled: `{ antialias: true }`
- [ ] Clear color set via Three.js: `renderer.setClearColor(0x1a1a2e)`
- [ ] Canvas appended to DOM: `document.body.appendChild(renderer.domElement)`

**Lighting:**
- [ ] Exactly one `AmbientLight` (grep count: 1)
- [ ] Exactly one `DirectionalLight` (grep count: 1)
- [ ] DirectionalLight has position set: `.position.set(x, y, z)`
- [ ] Both lights added to scene: `scene.add(ambientLight, directionalLight)`

**Geometry:**
- [ ] Cube uses `MeshStandardMaterial` (not `MeshBasicMaterial` or `MeshLambertMaterial`)
- [ ] Material has color property set: `{ color: 0xHEXCODE }`
- [ ] Mesh added to scene: `scene.add(cube)`

**Animation Loop:**
- [ ] `requestAnimationFrame` called recursively
- [ ] Cube rotation incremented: `cube.rotation.x += ...` and `cube.rotation.y += ...`
- [ ] Renderer renders scene: `renderer.render(scene, camera)`
- [ ] No delta time calculation (acceptable per Proposal simplification)

**Resize Handler:**
- [ ] Window resize event listener registered
- [ ] Camera aspect updated: `camera.aspect = window.innerWidth / window.innerHeight`
- [ ] Projection matrix updated: `camera.updateProjectionMatrix()`
- [ ] Renderer size updated: `renderer.setSize(window.innerWidth, window.innerHeight)`

**Anti-Patterns (Fail if Present):**
- [ ] No `eval()` or `Function()` constructor
- [ ] No hardcoded canvas width/height (must use `window.innerWidth/Height`)
- [ ] No `setInterval` or `setTimeout` for animation (must use `requestAnimationFrame`)
- [ ] No jQuery or DOM manipulation libraries
- [ ] No inline event handlers in HTML (`onclick`, `onload`)

**Pass Criteria:** All positive checks marked, no anti-patterns found  
**Maps to Intent:** Acceptance Boundary "Code quality — No unused imports, no console warnings, ESLint-clean if linted"

---

## Intent Traceability

### Acceptance Boundary → Verification Gate Mapping

| Intent Acceptance Boundary | Verification Gate(s) | Type |
|----------------------------|---------------------|------|
| "Running npm install completes without errors" | Gate 4: Dependency Installation Success | Automated |
| "Running npm run dev starts a dev server accessible at http://localhost:5173" | Gate 5: Dev Server Startup | Automated |
| "A cube is visible and continuously rotating on both X and Y axes" | VP 1: Visual Scene Inspection | Human |
| "Scene contains exactly one AmbientLight and one DirectionalLight" | VP 8: Code Quality Manual Review | Human |
| "Cube uses MeshStandardMaterial (not MeshBasicMaterial or other types)" | VP 8: Code Quality Manual Review | Human |
| "Mouse drag rotates camera view (OrbitControls functional)" | VP 3: Mouse Interaction Test | Human |
| "Resizing browser window updates canvas dimensions without distortion" | VP 4: Window Resize Responsiveness | Human |
| "Background color matches 0x1a1a2e specification" | VP 1: Visual Scene Inspection | Human |
| "Total line count in src/main.js is ≤100 lines (excluding blank lines and comments)" | Gate 3: JavaScript Line Count Budget | Automated |
| "Performance: 60 FPS on M1 MacBook Air at 1080p viewport (acceptable: 50+ FPS)" | VP 7: Performance Frame Rate Check | Human |
| "Lighting realism: Cube faces show clear shading gradients" | VP 2: Lighting Realism Assessment | Human |
| "Rotation speed: Cube completes one full rotation in 8-12 seconds (acceptable: 5-20 seconds)" | VP 5: Rotation Speed Measurement | Human |
| "Camera distance: Cube fills approximately 30-50% of viewport (acceptable: 20-60%)" | VP 6: Viewport Fill Percentage | Human |
| "Code quality: No unused imports, no console warnings, ESLint-clean if linted" | Gate 6: Browser Console Error Scan + VP 8: Code Quality Manual Review | Automated + Human |
| "Cube corners are sharp, not jagged (antialiasing enabled)" | VP 1: Visual Scene Inspection | Human |
| "Zooming with mouse wheel maintains cube in frame" | VP 3: Mouse Interaction Test | Human |
| "package.json contains only three and vite in dependencies" | Gate 2: package.json Schema Validation | Automated |
| "Canvas aspect ratio matches window aspect ratio at all sizes above 400x300px" | VP 4: Window Resize Responsiveness | Human |

### Constraint → Verification Gate Mapping

| Intent Constraint | Verification Gate(s) | Type |
|-------------------|---------------------|------|
| "No frameworks: React, Vue, Svelte, or any UI framework prohibited" | Gate 2: package.json Schema Validation | Automated |
| "No TypeScript: Pure .js files with no type annotations" | Gate 1: File Structure Validation | Automated |
| "Code budget: Total JavaScript must not exceed 100 lines in src/main.js" | Gate 3: JavaScript Line Count Budget | Automated |
| "Dependency minimalism: Only three and vite as production and dev dependencies" | Gate 2: package.json Schema Validation | Automated |
| "Background color fixed at 0x1a1a2e" | VP 1: Visual Scene Inspection | Human |
| "Canvas must fill 100% of viewport with zero margin/padding/overflow" | Gate 8: CSS Viewport Reset Validation | Automated |
| "Window resize must trigger immediate canvas and camera aspect ratio updates" | VP 4: Window Resize Responsiveness | Human |
| "File Structure Immutability: Exactly four files required" | Gate 1: File Structure Validation | Automated |

### Dependency → Verification Gate Mapping

| Intent Dependency | Verification Gate(s) | Type |
|-------------------|---------------------|------|
| "Three.js library (npm package three): Latest stable version from npm registry" | Gate 7: Three.js Version Verification | Automated |
| "Vite build tool (npm package vite): Version 5.x or later" | Gate 2: package.json Schema Validation | Automated |
| "Node.js: Version 18.x or later" | Gate 2: package.json Schema Validation (engines field) | Automated |
| "Modern browser: WebGL 2.0 support required" | Gate 6: Browser Console Error Scan | Automated |

### Coverage Analysis
- **Total Intent Acceptance Boundaries:** 17
- **Total Verification Gates (Automated):** 9
- **Total Verification Points (Human):** 8
- **Unmapped Boundaries:** 0 (100% traceability)

---

## Escape Criteria

### Scenario 1: Automated Gate Failure (Non-Transient)
**Trigger:** Any automated gate fails with persistent error after 3 retries

**Escalation Path:**
1. **Immediate Action:** Halt verification, do not proceed to human verification
2. **Diagnostics:** Capture full error logs, npm versions, Node version
3. **Re-Orbit Decision Matrix:**

| Failed Gate | Root Cause | Re-Orbit Action |
|-------------|------------|-----------------|
| Gate 1: File Structure | Missing files | Regenerate files, preserve existing code |
| Gate 2: package.json Schema | Wrong dependencies | Rewrite package.json, re-run npm install |
| Gate 3: Line Count Budget | Code too verbose | Refactor main.js, remove helper functions |
| Gate 4: npm Install | Registry failure | Wait 15 minutes, retry once, then escalate |
| Gate 5: Dev Server | Port conflict | Document port conflict, manual port change acceptable |
| Gate 6: Console Errors | Import path error | Fix OrbitControls import path based on Three.js version |
| Gate 7: Three.js Version | Wrong version installed | Lock package.json to exact version (~0.160.0) |
| Gate 8: CSS Validation | Missing CSS rules | Regenerate src/style.css |
| Gate 9: HTML Module Script | Wrong script type | Regenerate index.html |

**Re-Orbit Threshold:** Max 2 re-orbits before escalating to human architecture review

---

### Scenario 2: Human Verification Point Failure (Subjective)
**Trigger:** Human reviewer marks verification point as "marginal" or "fail"

**Escalation Path:**

**Marginal Failures (Acceptable Deviation):**
- **VP 2 (Lighting):** 10-20% brightness difference instead of 20%+ → **Accept** if faces clearly distinguishable
- **VP 5 (Rotation Speed):** 4-5 seconds or 20-25 seconds → **Accept** if reviewer approves "feel"
- **VP 6 (Viewport Fill):** 18-22% or 58-62% → **Accept** if minor deviation
- **VP 7 (FPS):** 45-50 FPS → **Accept** if no visible stuttering

**Hard Failures (Require Fix):**

| Failed VP | Root Cause | Fix Action | Re-Orbit Required? |
|-----------|------------|------------|-------------------|
| VP 1: Scene Not Visible | Canvas not appending | Debug DOM insertion | No (code fix) |
| VP 2: No Shading | Lights not in scene | Verify `scene.add(lights)` | No (code fix) |
| VP 3: No Mouse Control | OrbitControls not initialized | Debug controls instantiation | No (code fix) |
| VP 4: Resize Distortion | Missing `updateProjectionMatrix()` | Add to resize handler | No (code fix) |
| VP 5: Wrong Rotation Speed | Increment too small/large | Adjust rotation speed | No (tuning) |
| VP 6: Cube Too Small/Large | Wrong camera distance | Adjust `camera.position.z` | No (tuning) |
| VP 7: Low FPS | GPU bottleneck | Document performance note in README | Accept (hardware variance) |
| VP 8: Code Anti-Patterns | Logic error in implementation | Refactor offending code | Yes (re-orbit) |

**Human Review Override:** Senior engineer can accept marginal failures if they judge the deviation acceptable for learning template use case

---

### Scenario 3: Scope Creep During Verification
**Trigger:** Human reviewer requests features outside Intent non-goals

**Common Requests (Must Reject):**

| Request | Intent Violation | Response |
|---------|------------------|----------|
| "Add FPS counter" | Non-goal: "No UI overlays" | Reject. Use browser DevTools for FPS. |
| "Load HDRI background" | Non-goal: "No asset loading" | Reject. Solid background only. |
| "Add TypeScript" | Constraint: "No TypeScript" | Reject. Vanilla JS only. |
| "Build production bundle" | Non-goal: "No production build optimization" | Reject. Dev server only. |
| "Add touch controls" | Non-goal: "No mobile gesture support" | Reject. Mouse-only interaction. |
| "Debounce resize handler" | Non-goal: "No production optimization" | Reject. Accept minor FPS drop on resize. |

**Escalation:** If reviewer insists on out-of-scope feature, escalate to project owner for Intent Document revision. Do NOT modify code to accommodate scope expansion.

---

### Scenario 4: Dependency Installation Failure (Transient)
**Trigger:** Gate 4 (npm install) fails with network or registry error

**Retry Strategy:**

| Error Code | Meaning | Wait Time | Max Retries | Escalation |
|------------|---------|-----------|-------------|------------|
| `ENOTFOUND` | npm registry unreachable | 5 minutes | 3 | Check internet connection |
| `ETIMEDOUT` | Request timeout | 2 minutes | 5 | Switch npm registry mirror |
| `EINTEGRITY` | Checksum mismatch | 0 seconds | 1 | Clear npm cache, retry |
| `ERESOLVE` | Dependency conflict | 0 seconds | 0 | Human review of package.json |

**Automatic Retry Script:**
```bash
#!/bin/bash
MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  npm install --prefer-offline 2>&1 | tee install_attempt_$RETRY_COUNT.log
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "✓ npm install succeeded on attempt $((RETRY_COUNT + 1))"
    exit 0
  fi
  
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "✗ npm install failed, waiting 5 minutes before retry $RETRY_COUNT/$MAX_RETRIES"
  sleep 300
done

echo "✗ npm install failed after $MAX_RETRIES attempts, escalating to human"
exit 1
```

---

### Scenario 5: Browser Compatibility Failure
**Trigger:** Scene works in Chrome but fails in Firefox or Safari

**Compatibility Matrix (from Intent):**

| Browser | Min Version | Known Issues |
|---------|-------------|--------------|
| Chrome  | 90+         | None (reference browser) |
| Firefox | 88+         | WebGL context loss on tab switch (acceptable) |
| Safari  | 14+         | OrbitControls damping may behave differently |

**Failure Triage:**

1. **Console Errors:** Check browser DevTools for WebGL errors
2. **Feature Detection:** Verify WebGL 2.0 available (`canvas.getContext('webgl2')`)
3. **Polyfills:** Do NOT add polyfills (violates dependency minimalism)

**Escalation Decision:**
- If Chrome works but Firefox/Safari fail: Document browser compatibility note in README
- If all browsers fail: Re-orbit (fundamental implementation error)
- Accept browser-specific quirks if scene is functional (e.g., performance variance)

---

### Scenario 6: Line Count Budget Violation
**Trigger:** Gate 3 shows line count >100 in `src/main.js`

**Triage Steps:**

1. **Verify Counting Rules:**
   - Re-run counter excluding blank lines and `//` comments
   - Confirm multi-line comments counted correctly (1 line per physical line)

2. **Identify Bloat Sources:**
   ```bash
   # Find longest functions
   grep -n "^function|^const.*=>.*{" src/main.js
   
   # Count lines per logical section
   awk '/^import/,/^$/ {import++}
        /const scene/,/^$/ {scene++}
        /animate/,/^}/ {animate++}
        END {print "Imports:", import, "Scene:", scene, "Animate:", animate}' src/main.js
   ```

3. **Refactor Strategy:**
   - Remove unnecessary variable declarations (inline where possible)
   - Combine `scene.add()` calls: `scene.add(light1, light2, cube)`
   - Remove blank lines (sacrifice readability if needed)
   - Simplify resize handler (remove intermediate variables)

**Re-Orbit Threshold:** If refactoring reduces count to ≤100, no re-orbit needed. If refactoring requires significant logic changes, re-orbit.

---

### Scenario 7: Performance Failure on Reference Hardware
**Trigger:** VP 7 shows sustained FPS <45 on M1 MacBook Air

**Diagnostic Steps:**

1. **Profile in Chrome DevTools:**
   - Identify JavaScript long tasks (>50ms)
   - Check GPU utilization (should be <80%)
   - Inspect requestAnimationFrame timing

2. **Common Bottlenecks:**

| Bottleneck | Detection | Fix |
|------------|-----------|-----|
| Resize handler thrashing | High CPU during window drag | Accept (Intent allows no debouncing) |
| OrbitControls damping overhead | `controls.update()` in profile | Already disabled in Proposal |
| High-DPI display scaling | 4K resolution, pixelRatio >1 | Document expected FPS range |
| Antialias cost | GPU utilization >90% | Accept (Intent requires antialiasing) |

3. **Escalation Decision:**
   - FPS 45-50: Accept (within Intent "acceptable" range)
   - FPS 40-45: Document performance note, accept if no stuttering
   - FPS <40: Re-orbit (fundamental performance issue)

**Hardware Variance Acceptance:** If FPS <50 on M1 but >50 on Intel Mac, accept and document in README

---

### Rollback Procedure

**Trigger:** Any scenario requiring full orbit rollback (not minor fix)

**Rollback Steps:**

1. **Preserve Current State:**
   ```bash
   git checkout -b orbit-1-failed-$(date +%s)
   git add .
   git commit -m "Failed orbit state for debugging"
   ```

2. **Reset Repository:**
   ```bash
   git checkout main
   rm -rf index.html package.json src/
   git reset --hard HEAD~1  # If files were committed
   ```

3. **Preserve Artifacts:**
   - Move failed orbit artifacts to `.orbital/artifacts/failed/`
   - Capture all verification logs
   - Document failure reason in orbit history

4. **Re-Orbit Preparation:**
   - Review failure logs
   - Update Proposal Record with fixes
   - Increment orbit attempt counter

**Maximum Orbit Attempts:** 3 attempts before escalating to human architecture redesign

---

### Final Verification Sign-Off

**Completion Criteria:** All automated gates pass AND all human verification points marked "Pass" or "Accept (Marginal)"

**Sign-Off Checklist:**
- [ ] All 9 automated gates: PASS
- [ ] All 8 human verification points: PASS or ACCEPT
- [ ] No unresolved escape scenarios
- [ ] Intent traceability: 100% coverage
- [ ] Orbit artifacts archived to `.orbital/artifacts/`

**Approval Signature:**
```
Orbit: 1
Status: VERIFIED
Verified By: [Human Reviewer Name]
Date: [ISO 8601 Timestamp]
Trust Tier: 2 (Supervised)
Next Action: Mark orbit complete, archive artifacts
```

**Post-Verification Actions:**
1. Tag repository: `orbit-1-complete`
2. Generate verification report (this document + test results)
3. Update trajectory status in ORBITAL database
4. Notify project owner of completion