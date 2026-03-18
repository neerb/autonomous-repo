# Verification Protocol: Three.js Minimal Starter Project

## Automated Gates

### AG-1: Dependency Installation

**Gate ID:** `AG-1-npm-install`

**Verification Command:**
```bash
npm install --dry-run
```

**Pass Criteria:**
- Exit code: 0
- No peer dependency warnings in stdout
- No engine compatibility errors
- `node_modules/three/` directory structure exists after actual `npm install`
- `node_modules/vite/` directory structure exists after actual `npm install`

**Fail Criteria:**
- Exit code: non-zero
- Error message contains "engine 'node' is incompatible"
- Warning message contains "WARN" related to peer dependencies
- Missing `package.json` in repository root

**Traceability:** Maps to Intent Acceptance Boundary "Dependency Integrity" - "npm install completes without peer dependency warnings"

**Execution Frequency:** Once at orbit start, before any file modifications

---

### AG-2: JavaScript Syntax Validation

**Gate ID:** `AG-2-js-syntax`

**Verification Command:**
```bash
node --check src/main.js
```

**Pass Criteria:**
- Exit code: 0
- No syntax errors in stderr
- Module imports resolve (Three.js, OrbitControls)

**Fail Criteria:**
- Exit code: non-zero
- Error message contains "SyntaxError"
- Error message contains "Cannot find module"

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "No ESLint errors with standard ES6+ rules"

**Execution Frequency:** After `src/main.js` file write operation

---

### AG-3: CSS Syntax Validation

**Gate ID:** `AG-3-css-syntax`

**Verification Command:**
```bash
# Using Node.js css-tree or manual validation
npx css-validator src/style.css
```

**Alternative Manual Validation:**
- File parses without errors in browser DevTools
- No "Failed to parse" warnings in Vite dev server console

**Pass Criteria:**
- No CSS parsing errors
- All selectors are valid (body, canvas)
- All properties are valid (margin, overflow, display)

**Fail Criteria:**
- Syntax errors in CSS file
- Invalid property names or values

**Traceability:** Maps to Intent Acceptance Boundary "Project Structure" - "src/style.css referenced in index.html with proper MIME type handling"

**Execution Frequency:** After `src/style.css` file write operation

---

### AG-4: HTML5 Validation

**Gate ID:** `AG-4-html-validation`

**Verification Command:**
```bash
# Using nu-validator or manual inspection
npx html-validate index.html
```

**Alternative Manual Validation:**
- DOCTYPE declaration is `<!DOCTYPE html>`
- Script tag has `type="module"` attribute
- Link tag has valid `href` to `/src/style.css`

**Pass Criteria:**
- Valid HTML5 document structure
- `<script type="module" src="/src/main.js">` present in body
- `<link rel="stylesheet" href="/src/style.css">` present in head
- Character encoding meta tag present: `<meta charset="UTF-8">`

**Fail Criteria:**
- Invalid HTML5 syntax
- Missing required meta tags
- Incorrect script or link tag attributes

**Traceability:** Maps to Intent Acceptance Boundary "Project Structure" - "index.html loads src/main.js as ES module"

**Execution Frequency:** After `index.html` file write operation

---

### AG-5: Line Count Verification

**Gate ID:** `AG-5-line-count`

**Verification Script:**
```bash
# Exclude blank lines and comment-only lines
grep -v '^[[:space:]]*$' src/main.js | grep -v '^[[:space:]]*//' | wc -l
```

**Pass Criteria:**
- Line count ≤ 100 (excluding blank lines and comment-only lines)
- Actual code lines (imports, declarations, function bodies) counted

**Fail Criteria:**
- Line count > 100 after excluding blanks and comments

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "src/main.js is under 100 lines (blank lines and comments excluded from count)"

**Execution Frequency:** After `src/main.js` file write operation

---

### AG-6: File Structure Audit

**Gate ID:** `AG-6-file-structure`

**Verification Command:**
```bash
# Check exact file count (excluding .orbital/, node_modules/, .git/)
find . -maxdepth 2 -type f ( -name "*.html" -o -name "*.js" -o -name "*.css" -o -name "package.json" ) | grep -v node_modules | grep -v .orbital | wc -l
```

**Expected File List:**
- `index.html` (root)
- `package.json` (root)
- `src/main.js`
- `src/style.css`

**Pass Criteria:**
- Exactly 4 application files exist
- No additional configuration files (`.eslintrc`, `tsconfig.json`, `vite.config.js`, etc.)
- `src/` directory exists

**Fail Criteria:**
- More than 4 application files present
- Required files missing
- Additional configuration files violate "no config beyond Vite defaults" constraint

**Traceability:** Maps to Intent Acceptance Boundary "Project Structure" - "Exactly 4 files in repository root or src"

**Execution Frequency:** After all file write operations complete

---

### AG-7: Import Path Verification

**Gate ID:** `AG-7-import-paths`

**Verification Script:**
```bash
# Check that Three.js imports are from 'three' package, not CDN
grep -E "from ['"]three['"]" src/main.js
grep -E "from ['"]three/examples/jsm/controls/OrbitControls.js['"]" src/main.js
```

**Pass Criteria:**
- Line matching `import * as THREE from 'three';` exists
- Line matching `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';` exists
- No CDN URLs (https://cdn.jsdelivr.net, https://unpkg.com, etc.) in import statements

**Fail Criteria:**
- Imports reference CDN URLs instead of npm packages
- OrbitControls import path missing `.js` extension
- Imports use incorrect paths

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "All imported Three.js modules are from the installed three package (no CDN links)"

**Execution Frequency:** After `src/main.js` file write operation

---

### AG-8: Vite Dev Server Start

**Gate ID:** `AG-8-vite-start`

**Verification Command:**
```bash
timeout 10s npm run dev > /dev/null 2>&1 &
sleep 5
curl -I http://localhost:5173 | head -n 1
```

**Pass Criteria:**
- Vite dev server starts without fatal errors
- HTTP response code 200 from localhost:5173 (or alternative port)
- Terminal output contains "Local:   http://localhost:5173/" or similar
- No "EADDRINUSE" errors (port conflict)

**Fail Criteria:**
- Vite process exits with error code
- Cannot connect to dev server after 5 seconds
- Error messages about missing dependencies or configuration

**Traceability:** Maps to Intent Acceptance Boundary "Functional Completeness" - "Running npm install && npm run dev opens a browser window"

**Execution Frequency:** After all file write operations complete, before human verification

---

## Human Verification Points

### HV-1: Visual Rendering Inspection

**Verification Steps:**

1. Open browser to `http://localhost:5173` (or port shown in Vite terminal output)
2. Observe initial page load (should complete in <2 seconds)
3. Verify scene rendering:
   - **Cube visibility:** Green cube is centered in viewport
   - **Lighting contrast:** All six cube faces are distinguishable by lighting (not pure silhouette)
   - **Background color:** Canvas background is dark (hex `0x1a1a2e` or similar dark tone)
   - **No artifacts:** No white borders, margins, or padding around canvas
   - **Full viewport:** Canvas fills 100% of browser window with no scrollbars

**Pass Criteria:**
- Cube is visible and centered within 2 seconds of page load
- At least 3 cube faces are distinctly visible with different shading
- Background is visually dark (not white, light gray, or bright color)
- Canvas edges touch all four browser window edges
- No scrollbars appear in browser window

**Fail Criteria:**
- Black screen with no visible geometry (violates "Scene is empty, black screen with no visible geometry" unacceptable boundary)
- Cube appears as pure black silhouette (violates "Lighting makes cube faces distinguishable" mandatory boundary)
- White or light background visible (violates "Background color must be dark" constraint)
- White borders or margins around canvas (violates "Canvas has no white borders, margins, or padding" mandatory boundary)
- Scrollbars present (violates "Canvas must fill 100% of viewport with no scrollbars" constraint)

**Traceability:** Maps to Intent Acceptance Boundaries:
- "Cube is centered in viewport on initial load" (mandatory)
- "Lighting makes cube faces distinguishable" (mandatory)
- "Canvas has no white borders, margins, or padding" (mandatory)
- "Scene is empty, black screen with no visible geometry" (unacceptable)

**Execution Frequency:** Once after Vite dev server starts (AG-8 passes)

---

### HV-2: Animation Loop Verification

**Verification Steps:**

1. With browser window open to running application, observe cube motion
2. Measure rotation behavior:
   - **Continuous rotation:** Cube rotates without pausing or stuttering
   - **Dual-axis rotation:** Cube rotates on both X and Y axes (not just spinning on one axis)
   - **Rotation speed:** Approximately 1 full rotation per 10 seconds (0.01 radians/frame at 60fps)
3. Open browser DevTools Performance tab (optional):
   - Record 5 seconds of animation
   - Check frame rate in timeline (target 60fps on capable hardware)

**Pass Criteria:**
- Cube rotates continuously without stopping
- Visual confirmation of rotation on at least two axes (edges change position, not just spinning like a top)
- Smooth animation with no visible judder on modern hardware
- Frame rate ≥ 55fps on capable hardware (acceptable: ≥ 30fps on low-end hardware per Intent)

**Fail Criteria:**
- Cube is static (no rotation)
- Cube rotates on only one axis (violates "rotates the cube on X and Y axes" mandatory boundary)
- Animation stutters or freezes (unless on low-end hardware, which is acceptable per Intent)

**Traceability:** Maps to Intent Acceptance Boundary "Functional Completeness" - "Cube rotates continuously on both X and Y axes without user input" (mandatory)

**Execution Frequency:** Concurrent with HV-1, observe for 10+ seconds

---

### HV-3: OrbitControls Interaction Test

**Verification Steps:**

1. With browser window open to running application, use mouse to interact:
   - **Left-click drag:** Click and hold left mouse button, drag in any direction
   - **Observe camera movement:** View angle around cube changes as mouse moves
   - **Release mouse:** Camera stops moving but cube continues rotating
2. Test multiple drag directions:
   - Horizontal drag: Camera orbits left/right around cube
   - Vertical drag: Camera orbits up/down around cube
   - Diagonal drag: Combined motion
3. Verify cube remains centered:
   - Camera orbits around stationary cube (not pushing cube around)

**Pass Criteria:**
- Camera view changes in response to mouse drag
- Drag motion feels responsive (no significant input lag)
- Cube remains at center of rotation (camera orbits around it)
- Cube continues autonomous rotation during camera movement
- Controls work in all drag directions (horizontal, vertical, diagonal)

**Fail Criteria:**
- Mouse drag has no effect on camera (violates "Mouse drag rotates camera view around the cube" mandatory boundary)
- Camera movement is jerky or unresponsive
- Cube moves instead of camera orbiting
- Controls only work in one direction

**Traceability:** Maps to Intent Acceptance Boundary "Functional Completeness" - "Mouse drag rotates camera view around the cube (OrbitControls)" (mandatory)

**Execution Frequency:** After HV-2, perform multiple drag tests

---

### HV-4: Window Resize Behavior Test

**Verification Steps:**

1. With browser window open to running application, manually resize browser window:
   - **Drag window edge:** Make window smaller (50% original size)
   - **Observe canvas:** Canvas should shrink to match new window size
   - **Check cube proportions:** Cube should maintain 1:1:1 aspect ratio (not stretched)
2. Restore window to original size:
   - **Drag window edge:** Make window larger again
   - **Observe canvas:** Canvas should expand to match new window size
   - **Check cube proportions:** Cube should still maintain correct aspect ratio
3. Test extreme sizes:
   - Very small window (e.g., 400x300 pixels)
   - Very large window (e.g., full screen on 1920x1080 display)

**Pass Criteria:**
- Canvas resizes to fill 100% of new window dimensions
- Cube maintains square faces (not stretched to rectangles)
- No scrollbars appear during resize
- No visual glitches or blank frames during resize
- Animation continues smoothly during and after resize

**Fail Criteria:**
- Canvas does not resize (fixed dimensions)
- Cube becomes distorted (stretched or squashed)
- Scrollbars appear during resize (violates "Canvas must fill 100% of viewport with no scrollbars" constraint)
- Canvas aspect ratio is incorrect (violates "Window resize maintains full-viewport canvas without distortion" mandatory boundary)

**Traceability:** Maps to Intent Acceptance Boundary "Functional Completeness" - "Window resize maintains full-viewport canvas without distortion" (mandatory)

**Execution Frequency:** After HV-3, perform at least 3 resize cycles

---

### HV-5: Browser Console Inspection

**Verification Steps:**

1. Open browser DevTools (F12 or right-click > Inspect)
2. Navigate to Console tab
3. Check for errors and warnings:
   - **Module loading:** No "Failed to resolve module" errors
   - **WebGL context:** No "WebGL context lost" errors
   - **Three.js warnings:** No deprecation warnings from Three.js library
   - **Import errors:** No 404 errors for OrbitControls.js
4. Check Network tab:
   - `main.js` loads successfully (HTTP 200)
   - `style.css` loads successfully (HTTP 200)
   - `three` module loads from node_modules (not CDN)

**Pass Criteria:**
- Zero JavaScript errors in console
- Zero "Failed to resolve module specifier" errors
- No 404 errors for any imports
- No WebGL-related errors
- Acceptable: Vite HMR messages in console (not errors)

**Fail Criteria:**
- Any JavaScript errors present (red text in console)
- Module import failures (OrbitControls.js not found)
- WebGL context creation failures
- Warnings about deprecated Three.js APIs

**Traceability:** Maps to Intent Acceptance Boundaries:
- "No ESLint errors with standard ES6+ rules" (mandatory)
- "All imported Three.js modules are from the installed three package" (mandatory)

**Execution Frequency:** Concurrent with HV-1 through HV-4, monitor console throughout testing

---

### HV-6: Code Readability Assessment

**Verification Steps:**

1. Open `src/main.js` in text editor
2. Read through entire file (target: <10 minutes reading time)
3. Assess code clarity:
   - **Variable naming:** Clear purpose from variable names (scene, camera, renderer, cube, controls)
   - **Function purpose:** Each function has single clear responsibility (init, animate, onWindowResize)
   - **Minimal abstraction:** No unnecessary helper functions or classes
   - **Comment necessity:** Code is self-documenting through naming (minimal comments needed)
4. Verify functional programming patterns:
   - No class definitions (except Three.js constructors)
   - Functions use `function` keyword or arrow syntax
   - Variables scoped to module or function level only

**Pass Criteria:**
- File is comprehensible in single read-through (<10 minutes)
- Variable and function names clearly indicate purpose
- No confusing abstractions or indirection
- Follows functional programming patterns per Intent constraint
- Minimal inline comments (code readability through naming is preferred per Intent)

**Fail Criteria:**
- File requires multiple read-throughs to understand
- Unclear variable names (e.g., single letters, abbreviations)
- Custom class definitions violate "No class-based architecture" constraint
- Excessive comments indicate poor code clarity

**Traceability:** Maps to Intent Desired Outcome - "The codebase serves as a learning reference that new developers can understand in one read-through"

**Execution Frequency:** Once after all file write operations, before visual testing

---

## Intent Traceability

### Functional Completeness Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Running `npm install && npm run dev` opens a browser window showing a rotating cube | AG-1, AG-8 | HV-1, HV-2 | ⚠️ Requires both |
| Mouse drag rotates camera view around the cube (OrbitControls) | AG-7 (import verification) | HV-3 | ⚠️ Requires both |
| Window resize maintains full-viewport canvas without distortion | None | HV-4 | ⚠️ Human only |
| Cube rotates continuously on both X and Y axes without user input | None | HV-2 | ⚠️ Human only |
| Animation frame drops below 60fps on low-end hardware (acceptable) | None | HV-2 (optional DevTools check) | ⚠️ Acceptable |

---

### Code Quality Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| `src/main.js` is under 100 lines (blank lines and comments excluded from count) | AG-5 | None | ✅ Automated |
| No ESLint errors with standard ES6+ rules | AG-2 | HV-5 | ⚠️ Requires both |
| All imported Three.js modules are from the installed `three` package (no CDN links) | AG-7 | HV-5 (Network tab) | ⚠️ Requires both |
| Inline comments are minimal (acceptable) | None | HV-6 | ⚠️ Human only |

---

### Visual Standards Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Cube is centered in viewport on initial load | None | HV-1 | ⚠️ Human only |
| Lighting makes cube faces distinguishable (no pure silhouette) | None | HV-1 | ⚠️ Human only |
| Canvas has no white borders, margins, or padding | None | HV-1 | ⚠️ Human only |
| Cube material uses Three.js default parameters if they produce visible contrast (acceptable) | None | HV-1 | ⚠️ Acceptable |
| Scene is empty, black screen with no visible geometry (unacceptable) | None | HV-1 | ❌ Fail condition |

---

### Dependency Integrity Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| `package.json` specifies exact or caret ranges for `three` and `vite` | AG-1 (npm install verification) | None | ✅ Automated |
| `npm install` completes without peer dependency warnings | AG-1 | None | ✅ Automated |
| Node.js version requirement documented in `package.json` engines field | AG-1 | None | ✅ Automated |
| Three.js version is not the absolute latest if a stable release from the last 3 months is used (acceptable) | None | None | ⚠️ Acceptable |

---

### Project Structure Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Exactly 4 files in repository root or src: `index.html`, `package.json`, `src/main.js`, `src/style.css` | AG-6 | None | ✅ Automated |
| `index.html` loads `src/main.js` as ES module | AG-4 | None | ✅ Automated |
| `src/style.css` referenced in `index.html` with proper MIME type handling | AG-3, AG-4 | None | ✅ Automated |
| No additional configuration files beyond Vite defaults (unacceptable) | AG-6 | None | ❌ Fail condition |

---

## Escape Criteria

### EC-1: Automated Gate Failure

**Trigger Condition:** Any automated gate (AG-1 through AG-8) returns fail status

**Response Actions:**

1. **Immediate Halt:** Stop verification protocol execution
2. **Error Logging:** Capture full stderr output from failed gate command
3. **Root Cause Analysis:**
   - If AG-1 fails: Check Node.js version (`node --version`), inspect `package.json` engines field
   - If AG-2 fails: Review `src/main.js` syntax errors, validate import paths
   - If AG-3 fails: Review `src/style.css` for invalid CSS syntax
   - If AG-4 fails: Review `index.html` for malformed HTML5 structure
   - If AG-5 fails: Manual line count verification, identify lines pushing over 100 limit
   - If AG-6 fails: Identify unexpected files (`.eslintrc`, `tsconfig.json`, `vite.config.js`)
   - If AG-7 fails: Check import statement syntax, verify `.js` extension on OrbitControls path
   - If AG-8 fails: Review Vite error messages, check port availability

4. **Re-Orbit Decision Matrix:**

| Failed Gate | Re-Orbit Required | Scope | Estimated Time |
|-------------|-------------------|-------|----------------|
| AG-1 | No (environmental) | Document Node.js requirement in handoff notes | 0 minutes |
| AG-2 | Yes | Fix JavaScript syntax errors in `src/main.js` | 5-10 minutes |
| AG-3 | Yes | Fix CSS syntax errors in `src/style.css` | 2-5 minutes |
| AG-4 | Yes | Fix HTML5 structure errors in `index.html` | 2-5 minutes |
| AG-5 | Yes | Refactor `src/main.js` to reduce line count | 10-15 minutes |
| AG-6 | Yes | Remove unexpected configuration files | 2-5 minutes |
| AG-7 | Yes | Correct Three.js import paths | 2-5 minutes |
| AG-8 | Maybe | Investigate Vite startup errors, may be environmental | 5-10 minutes |

5. **Escalation Trigger:** If same automated gate fails twice after re-orbit, escalate to human review for architectural decision

---

### EC-2: Human Verification Point Failure

**Trigger Condition:** Any human verification point (HV-1 through HV-6) identifies fail criteria

**Response Actions:**

1. **Failure Documentation:** Record specific fail criteria observed (e.g., "Black screen, no cube visible" for HV-1)
2. **Severity Classification:**
   - **Critical:** Violates mandatory acceptance boundary (✅) → Immediate re-orbit required
   - **Major:** Violates acceptable boundary (⚠️) → Human judgment call on re-orbit
   - **Minor:** Does not violate stated boundary but degrades UX → Document for future improvement

3. **Re-Orbit Decision Matrix:**

| Failed HV Point | Fail Criteria | Re-Orbit Required | Scope | Estimated Time |
|-----------------|---------------|-------------------|-------|----------------|
| HV-1 (Visual) | Black screen, no geometry | Yes (Critical) | Debug camera position, lighting, geometry in `src/main.js` | 10-15 minutes |
| HV-1 (Visual) | Cube not centered | Yes (Critical) | Adjust camera position or cube position in `src/main.js` | 5-10 minutes |
| HV-1 (Visual) | White borders visible | Yes (Critical) | Fix CSS in `src/style.css` (margin, padding, display rules) | 2-5 minutes |
| HV-2 (Animation) | Cube not rotating | Yes (Critical) | Debug animation loop, check `cube.rotation.x/y` updates | 5-10 minutes |
| HV-2 (Animation) | Single-axis rotation only | Yes (Critical) | Add missing rotation axis in `animate()` function | 2-5 minutes |
| HV-3 (OrbitControls) | Mouse drag no effect | Yes (Critical) | Debug OrbitControls initialization, check import path | 5-10 minutes |
| HV-4 (Resize) | Canvas doesn't resize | Yes (Critical) | Debug `onWindowResize()` function, check event listener | 5-10 minutes |
| HV-4 (Resize) | Cube distortion on resize | Yes (Critical) | Fix camera aspect ratio calculation in `onWindowResize()` | 5-10 minutes |
| HV-5 (Console) | JavaScript errors present | Yes (Critical) | Debug error messages, fix identified issues | 10-20 minutes |
| HV-5 (Console) | Module import failures | Yes (Critical) | Correct import paths, verify `node_modules` structure | 5-10 minutes |
| HV-6 (Readability) | Code unclear or confusing | No (Minor) | Document for future refactoring, does not block orbit | N/A |

4. **Rollback Procedure:**
   - If critical failure detected in HV-1 through HV-5: Restore previous file versions from git
   - Re-run automated gates (AG-1 through AG-8) to verify clean state
   - Begin re-orbit with corrected implementation approach

---

### EC-3: Combined Gate Failure (Multiple Failures)

**Trigger Condition:** More than 3 automated gates fail OR more than 2 critical human verification points fail

**Response Actions:**

1. **Immediate Halt:** Stop all verification activities
2. **Full Rollback:** Restore all files to pre-orbit state from version control
3. **Architecture Review:** Convene human review session to assess:
   - Whether Intent Document scope is correctly understood
   - Whether Proposal Record implementation approach is viable
   - Whether unknown environmental constraints exist (Node version, OS-specific issues, etc.)
4. **Re-Planning:** Generate new Proposal Record with alternative implementation approach
5. **Escalation:** Notify orbit supervisor that original proposal failed comprehensive verification

**Escalation Trigger:** Automatic escalation to Tier 3 (Gated) if combined gate failure occurs twice

---

### EC-4: Acceptable Boundary Edge Cases

**Scenario:** Verification identifies behavior within "acceptable" boundary range (⚠️) but not optimal

**Examples:**
- Animation runs at 45fps on reviewer's hardware (Intent accepts <60fps on low-end hardware)
- Three.js r160 is 4 months old, not "latest" (Intent accepts stable releases from last 3 months)
- `src/main.js` uses default MeshStandardMaterial parameters (Intent accepts defaults if they produce visible contrast)

**Response Actions:**

1. **Document Observation:** Note acceptable boundary condition in verification results
2. **Human Judgment Call:** Reviewer decides whether to:
   - **Accept and proceed:** Mark orbit as complete with acceptable boundary note
   - **Recommend improvement:** Mark orbit as complete but log enhancement request for future orbit
   - **Re-orbit for optimization:** Reject orbit and request refinement to move from "acceptable" to "optimal"

3. **No Automatic Escalation:** Acceptable boundary conditions do not trigger re-orbit unless human reviewer explicitly requests it

**Escalation Trigger:** None — acceptable boundaries are intentionally flexible per Intent design

---

### EC-5: Environmental Failure (Non-Orbit Issues)

**Trigger Condition:** Verification failures caused by environmental factors outside orbit scope

**Examples:**
- Node.js version below 18.0.0 (AG-1 fails)
- Port 5173 occupied by another process (AG-8 fails)
- Browser lacks WebGL support (HV-1 fails with black screen)
- Network issues prevent npm install (AG-1 fails)

**Response Actions:**

1. **Classify as Environmental:** Distinguish between orbit code issues and setup issues
2. **Document Requirements:** Update verification handoff notes with environmental prerequisites
3. **No Re-Orbit:** Environmental failures do not trigger code changes
4. **User Notification:** Provide clear error message explaining environmental requirement:
   - "Node.js 18.0.0 or higher is required. Current version: X.X.X. Please upgrade Node.js."
   - "Port 5173 is already in use. Vite will use alternative port shown in terminal output."
   - "WebGL is not supported in this browser. Please use Chrome 90+, Firefox 88+, Safari 15+, or Edge 90+."

**Escalation Trigger:** None — environmental issues are out of orbit scope per Intent dependencies section