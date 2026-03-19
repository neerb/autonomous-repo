# Verification Protocol: Add Diamond Geometry to Three.js Starter Scene

## Automated Gates

### AG-1: Dependency Integrity Check

**Gate ID:** `AG-1-deps-unchanged`

**Verification Command:**
```bash
# Compare package.json against Orbit 2 baseline
git diff HEAD~1 package.json
```

**Pass Criteria:**
- Exit code: 0 (no differences detected)
- `package.json` remains unchanged from Orbit 2 state
- Dependencies still: `"three": "^0.160.0"` and `"vite": "^5.0.0"`
- No new dependencies added

**Fail Criteria:**
- Any modifications to `package.json` detected
- New dependencies added to `dependencies` or `devDependencies`
- Version numbers changed

**Traceability:** Maps to Intent Acceptance Boundary "Dependency Integrity" - "No new npm dependencies added beyond existing three and vite"

**Execution Frequency:** Once before code modification, once after implementation

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
- `OctahedronGeometry` referenced as `THREE.OctahedronGeometry` (namespace pattern)

**Fail Criteria:**
- Exit code: non-zero
- Error message contains "SyntaxError"
- Error message contains "OctahedronGeometry is not defined"
- Error message contains "Cannot find module"

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "No ESLint errors with standard ES6+ rules"

**Execution Frequency:** After `src/main.js` modification

---

### AG-3: Line Count Verification

**Gate ID:** `AG-3-line-count`

**Verification Script:**
```bash
# Exclude blank lines and comment-only lines
grep -v '^[[:space:]]*$' src/main.js | grep -v '^[[:space:]]*//' | wc -l
```

**Pass Criteria:**
- Line count ≤ 100 (excluding blank lines and comment-only lines)
- Actual code lines counted (imports, declarations, function bodies, statements)

**Fail Criteria:**
- Line count > 100 after excluding blanks and comments

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "src/main.js remains under 100 lines (blank lines and comments excluded from count)"

**Execution Frequency:** After `src/main.js` modification

---

### AG-4: File Structure Audit

**Gate ID:** `AG-4-file-structure`

**Verification Command:**
```bash
# Check that only src/main.js was modified
git diff --name-only HEAD~1 | grep -v '^.orbital/' | grep -v '^src/main.js$'
```

**Expected Output:** Empty (no files modified except `src/main.js`)

**Pass Criteria:**
- Only `src/main.js` appears in git diff
- `index.html`, `src/style.css`, `package.json` unchanged
- No new files created beyond existing 4-file structure
- `.orbital/` artifacts excluded from check

**Fail Criteria:**
- `index.html`, `src/style.css`, or `package.json` modified
- Additional files created (e.g., new config files, assets)

**Traceability:** Maps to Intent Acceptance Boundary "Project Structure" - "Only src/main.js modified — index.html, src/style.css, package.json remain unchanged"

**Execution Frequency:** After all file operations complete

---

### AG-5: OctahedronGeometry Usage Check

**Gate ID:** `AG-5-octahedron-geometry`

**Verification Script:**
```bash
# Check for OctahedronGeometry instantiation in src/main.js
grep -E "new THREE.OctahedronGeometry" src/main.js
```

**Pass Criteria:**
- At least one match found
- Pattern matches `new THREE.OctahedronGeometry(...)` (namespace access)
- Constructor called with 0, 1, or 2 arguments (radius, detail parameters)

**Fail Criteria:**
- No matches found (diamond geometry not created)
- Pattern uses incorrect namespace (e.g., `new OctahedronGeometry(...)` without `THREE.` prefix)

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "Diamond geometry created with Three.js built-in OctahedronGeometry constructor"

**Execution Frequency:** After `src/main.js` modification

---

### AG-6: Scene Addition Check

**Gate ID:** `AG-6-scene-add-diamond`

**Verification Script:**
```bash
# Check for scene.add(diamond) or similar pattern
grep -E "scene.add(diamond)" src/main.js
```

**Pass Criteria:**
- At least one match found
- Pattern confirms diamond mesh added to scene graph
- Variable name `diamond` used (matches module-level declaration)

**Fail Criteria:**
- No matches found (diamond not added to scene)
- Diamond variable not declared at module level

**Traceability:** Maps to Intent Acceptance Boundary "Code Quality" - "Diamond mesh added to scene graph via scene.add(diamondMesh)"

**Execution Frequency:** After `src/main.js` modification

---

### AG-7: Module Variable Declaration Check

**Gate ID:** `AG-7-module-vars`

**Verification Script:**
```bash
# Check for diamond variable in module-level declaration
grep -E "let.*diamond" src/main.js | head -n 1
```

**Pass Criteria:**
- Match found in module-level scope (top of file, outside functions)
- Variable `diamond` declared alongside `scene`, `camera`, `renderer`, `cube`, `controls`
- Pattern: `let scene, camera, renderer, cube, diamond, controls;` or similar order

**Fail Criteria:**
- No module-level declaration of `diamond` variable
- `diamond` declared only inside function scope (would break `animate()` access)

**Traceability:** Maps to Intent Acceptance Boundary "Architecture Restrictions" - "Diamond mesh requires module-level scope if modified in animation loop"

**Execution Frequency:** After `src/main.js` modification

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
- Terminal output contains "Local: http://localhost:5173/" or similar (from manual observation)
- No "EADDRINUSE" errors (port conflict)

**Fail Criteria:**
- Vite process exits with error code
- Cannot connect to dev server after 5 seconds
- Error messages about missing dependencies or module resolution failures

**Traceability:** Maps to Intent Acceptance Boundary "Functional Completeness" - "Running npm install && npm run dev shows both cube and diamond rotating"

**Execution Frequency:** After all file modifications complete, before human verification

---

## Human Verification Points

### HV-1: Dual Geometry Visual Inspection

**Verification Steps:**

1. Open browser to `http://localhost:5173` (or port shown in Vite terminal output)
2. Observe initial page load (should complete in <2 seconds)
3. Verify cube presence and positioning:
   - **Cube visibility:** Green cube visible on left side of viewport
   - **Cube geometry:** 6-sided box shape with square faces
   - **Cube color:** Green (hex `0x00ff00` or similar)
4. Verify diamond presence and positioning:
   - **Diamond visibility:** Diamond/octahedron visible on right side of viewport
   - **Diamond geometry:** 8-sided polyhedron with triangular faces (visibly distinct from cube)
   - **Diamond color:** Different from cube (cyan `0x00ffff` preferred, or acceptable if same green)
5. Verify spatial relationship:
   - **Horizontal separation:** Visible gap between cube and diamond (minimum 1 unit separation)
   - **No overlap:** Shapes do not intersect or touch
   - **Both visible:** No need to pan or zoom camera to see both shapes
   - **Vertical alignment:** Both shapes centered vertically at same Y position
6. Verify lighting and rendering:
   - **Lighting on both:** Both shapes illuminated by existing AmbientLight and DirectionalLight
   - **Face differentiation:** Multiple faces visible on both shapes (not pure silhouettes)
   - **Background:** Dark background color (`0x1a1a2e` or similar) unchanged from Orbit 2
   - **Canvas fullscreen:** Canvas fills 100% of viewport with no white borders or margins

**Pass Criteria:**
- Both cube and diamond visible simultaneously in initial view
- Diamond has visibly different geometry (8 triangular faces vs 6 square faces)
- Horizontal gap visible between shapes (minimum 1 unit separation)
- Both shapes illuminated with face contrast visible
- Camera framing includes both shapes without clipping or extreme distance

**Fail Criteria:**
- Diamond not visible in initial viewport (requires camera adjustment to see)
- Shapes overlap or intersect in initial view (unacceptable per Intent)
- Diamond geometry appears identical to cube (no geometric distinction)
- Either shape appears as pure silhouette (lighting failure)
- White borders or margins visible around canvas

**Traceability:** Maps to Intent Acceptance Boundaries:
- "Both shapes are visible in initial viewport without camera adjustment" (mandatory)
- "Diamond shape is geometrically distinct from cube (octahedron with visible triangular faces)" (mandatory)
- "Both shapes positioned horizontally adjacent with visible gap between them" (mandatory)
- "Horizontal spacing between shapes is sufficient to distinguish them (minimum 1 unit separation)" (mandatory)
- "Lighting illuminates both shapes (no pure silhouette on either geometry)" (mandatory)
- "Shapes overlap or intersect in initial view" (unacceptable)

**Execution Frequency:** Once after Vite dev server starts (AG-8 passes)

---

### HV-2: Dual Animation Loop Verification

**Verification Steps:**

1. With browser window open to running application, observe both shapes' motion
2. Measure cube rotation behavior:
   - **Continuous rotation:** Cube rotates without pausing or stuttering
   - **Dual-axis rotation:** Cube rotates on both X and Y axes (unchanged from Orbit 2)
   - **Rotation speed:** Approximately 1 full rotation per 10 seconds (0.01 radians/frame at 60fps)
3. Measure diamond rotation behavior:
   - **Continuous rotation:** Diamond rotates without pausing or stuttering
   - **Dual-axis rotation:** Diamond rotates on both X and Y axes
   - **Rotation speed:** Same as cube (0.01 radians/frame) or different if intentional variation
4. Verify synchronized rendering:
   - **Both shapes animate:** Cube and diamond rotate simultaneously (not one frozen while other moves)
   - **Smooth animation:** No visible judder or frame drops on modern hardware
5. Open browser DevTools Performance tab (optional):
   - Record 5 seconds of animation
   - Check frame rate in timeline (target 60fps on capable hardware)

**Pass Criteria:**
- Both cube and diamond rotate continuously without stopping
- Visual confirmation of rotation on at least two axes for both shapes
- Smooth animation with no visible judder on modern hardware
- Frame rate ≥ 55fps on capable hardware (acceptable: ≥ 30fps on low-end hardware per Intent)

**Fail Criteria:**
- Either shape is static (no rotation)
- Either shape rotates on only one axis (violates "rotates on X and Y axes" requirement)
- Animation stutters or freezes on capable hardware (acceptable on low-end hardware)

**Traceability:** Maps to Intent Acceptance Boundaries:
- "Running npm install && npm run dev shows both cube and diamond rotating" (mandatory)
- "Both shapes must rotate continuously" (animation requirement)
- "Animation must run at 60fps on capable hardware" (performance requirement)

**Execution Frequency:** Concurrent with HV-1, observe for 10+ seconds

---

### HV-3: OrbitControls Dual-Shape Interaction Test

**Verification Steps:**

1. With browser window open to running application, use mouse to interact:
   - **Left-click drag:** Click and hold left mouse button, drag in any direction
   - **Observe camera movement:** View angle around both shapes changes as mouse moves
   - **Release mouse:** Camera stops moving but both shapes continue rotating
2. Test multiple drag directions:
   - Horizontal drag: Camera orbits left/right around scene center
   - Vertical drag: Camera orbits up/down around scene center
   - Diagonal drag: Combined motion
3. Verify both shapes remain in frame:
   - **Cube visibility:** Cube remains visible during camera orbit
   - **Diamond visibility:** Diamond remains visible during camera orbit
   - **No shape clipping:** Neither shape clips through camera near plane during orbit
4. Verify orbit center feels balanced:
   - Camera orbits around visual center between both shapes (not biased toward one shape)
   - If shapes positioned symmetrically (x=±1.5), orbit center at origin feels natural

**Pass Criteria:**
- Camera view changes in response to mouse drag
- Drag motion feels responsive (no significant input lag)
- Both shapes remain visible throughout camera orbit
- Both cube and diamond continue autonomous rotation during camera movement
- Controls work in all drag directions (horizontal, vertical, diagonal)
- Orbit center feels visually balanced between both shapes

**Fail Criteria:**
- Mouse drag has no effect on camera (OrbitControls broken)
- Camera movement is jerky or unresponsive
- Either shape clips out of view during normal orbit motion
- Orbit center feels off-balance (e.g., biased heavily toward one shape)

**Traceability:** Maps to Intent Acceptance Boundaries:
- "Mouse drag (OrbitControls) rotates camera around both shapes simultaneously" (mandatory)
- "OrbitControls behavior applies to both shapes (single camera orbits entire scene)" (constraint)

**Execution Frequency:** After HV-2, perform multiple drag tests over 5+ seconds

---

### HV-4: Window Resize Dual-Shape Behavior Test

**Verification Steps:**

1. With browser window open to running application, manually resize browser window:
   - **Drag window edge:** Make window smaller (50% original size)
   - **Observe canvas:** Canvas should shrink to match new window size
   - **Check shape proportions:** Both cube and diamond should maintain correct aspect ratios (not stretched)
   - **Check visibility:** Both shapes should remain visible after resize
2. Restore window to original size:
   - **Drag window edge:** Make window larger again
   - **Observe canvas:** Canvas should expand to match new window size
   - **Check shape proportions:** Both shapes should still maintain correct aspect ratios
3. Test extreme sizes:
   - Very small window (e.g., 400x300 pixels) — both shapes should remain visible
   - Very large window (e.g., full screen on 1920x1080 display) — both shapes should remain visible
4. Check for visual artifacts:
   - No scrollbars appear during resize
   - No blank canvas areas or white borders
   - Animation continues smoothly during and after resize

**Pass Criteria:**
- Canvas resizes to fill 100% of new window dimensions
- Both cube and diamond maintain square/proportional faces (not stretched to rectangles)
- Both shapes remain visible at all tested window sizes
- No scrollbars appear during resize
- No visual glitches or blank frames during resize
- Animation continues smoothly during and after resize

**Fail Criteria:**
- Canvas does not resize (fixed dimensions)
- Either shape becomes distorted (stretched or squashed)
- Either shape clips out of view during resize
- Scrollbars appear during resize (violates "Canvas must fill 100% of viewport with no scrollbars" constraint)
- Canvas aspect ratio is incorrect (violates "Window resize maintains full-viewport canvas" mandatory boundary)

**Traceability:** Maps to Intent Acceptance Boundaries:
- "Window resize maintains full-viewport canvas with both shapes visible" (mandatory)
- "Canvas continues to fill 100% of viewport" (visual requirement)

**Execution Frequency:** After HV-3, perform at least 3 resize cycles

---

### HV-5: Browser Console Inspection

**Verification Steps:**

1. Open browser DevTools (F12 or right-click > Inspect)
2. Navigate to Console tab
3. Check for errors and warnings:
   - **Module loading:** No "Failed to resolve module" errors
   - **OctahedronGeometry:** No "OctahedronGeometry is not defined" errors
   - **WebGL context:** No "WebGL context lost" errors
   - **Three.js warnings:** No deprecation warnings from Three.js library
   - **Import errors:** No 404 errors for `three` or `OrbitControls` modules
4. Check Network tab:
   - `main.js` loads successfully (HTTP 200)
   - `three` module loads from node_modules (not CDN)
   - No failed resource requests

**Pass Criteria:**
- Zero JavaScript errors in console
- Zero "Failed to resolve module specifier" errors
- No "OctahedronGeometry is not defined" errors
- No 404 errors for any imports
- No WebGL-related errors
- Acceptable: Vite HMR messages in console (not errors)

**Fail Criteria:**
- Any JavaScript errors present (red text in console)
- Module import failures (OctahedronGeometry, Three.js core, OrbitControls)
- WebGL context creation failures
- Warnings about deprecated Three.js APIs

**Traceability:** Maps to Intent Acceptance Boundaries:
- "No ESLint errors with standard ES6+ rules" (mandatory)
- "OctahedronGeometry imported from three package (already available, no separate import needed)" (mandatory)

**Execution Frequency:** Concurrent with HV-1 through HV-4, monitor console throughout testing

---

### HV-6: Code Readability and Educational Value Assessment

**Verification Steps:**

1. Open `src/main.js` in text editor
2. Read through entire file (target: <10 minutes reading time)
3. Assess diamond addition clarity:
   - **Variable naming:** Diamond variables clearly named (`diamond`, `diamondGeometry`, `diamondMaterial`)
   - **Pattern consistency:** Diamond creation follows same pattern as cube creation
   - **Educational value:** Diamond addition demonstrates multi-geometry scene composition
   - **Code duplication:** Minimal duplication (rotation updates acceptable, geometry creation not duplicated)
4. Verify module-level variable scope:
   - `diamond` added to module-level declaration line
   - Consistent with existing pattern (`let scene, camera, renderer, cube, diamond, controls;`)
5. Verify positioning clarity:
   - Cube positioning explicit: `cube.position.x = -1.5;` or similar
   - Diamond positioning explicit: `diamond.position.x = 1.5;` or similar
   - Symmetric positioning visible in code (both equidistant from origin)
6. Verify animation loop updates:
   - Diamond rotation updates added to `animate()` function
   - Pattern consistent with cube rotation (`diamond.rotation.x += 0.01; diamond.rotation.y += 0.01;`)

**Pass Criteria:**
- Diamond addition is comprehensible to learner in single read-through
- Variable and function names clearly indicate purpose
- Diamond creation pattern mirrors cube creation pattern (consistency)
- Positioning values show intentional horizontal separation
- Animation updates for diamond follow same pattern as cube
- Educational goal achieved: Multiple geometries in single scene demonstrated

**Fail Criteria:**
- Diamond addition unclear or confusing (requires multiple read-throughs)
- Inconsistent naming conventions between cube and diamond
- Positioning values arbitrary or unclear (not obviously symmetric or separated)
- Animation updates for diamond differ unnecessarily from cube pattern

**Traceability:** Maps to Intent Desired Outcome - "This demonstrates multiple geometry types in a single scene, showing learners how to instantiate and position different Three.js primitives"

**Execution Frequency:** Once after all file write operations, before visual testing

---

### HV-7: Visual Color Differentiation Assessment

**Verification Steps:**

1. With browser window open to running application, observe shape colors:
   - **Cube color:** Note current cube material color (expected green `0x00ff00`)
   - **Diamond color:** Note current diamond material color (expected cyan `0x00ffff` or same as cube)
2. Assess color differentiation value:
   - **Different colors:** If diamond uses different color (cyan, magenta, blue), assess if distinction aids learning
   - **Same color:** If diamond uses same color as cube (both green), assess if geometric distinction alone is sufficient
3. Consider educational context:
   - Does color differentiation improve learner ability to distinguish shapes?
   - Is geometric distinction (octahedron vs cube) sufficient without color variation?
   - Does color choice align with typical Three.js demo conventions (color variety)?

**Pass Criteria:**
- If diamond uses different color: Color provides clear visual distinction that aids learning
- If diamond uses same color: Geometric distinction (8 triangular faces vs 6 square faces) remains clearly visible
- Color choice does not distract or confuse (no jarring color combinations)

**Fail Criteria:**
- Diamond color identical to cube AND geometric distinction unclear (both appear too similar)
- Color choice creates visual confusion or poor contrast against dark background

**Traceability:** Maps to Intent Acceptance Boundary (Acceptable) - "Diamond uses same material color as cube (both green) if color differentiation not needed for learning value"

**Note:** This is an acceptable boundary criterion, not mandatory. Reviewer discretion applies.

**Execution Frequency:** During HV-1 (visual inspection), with follow-up assessment of educational value

---

## Intent Traceability

### Functional Completeness Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Running `npm install && npm run dev` shows both cube and diamond rotating | AG-8 | HV-1, HV-2 | ⚠️ Requires both |
| Diamond shape is geometrically distinct from cube (octahedron with visible triangular faces) | AG-5 | HV-1 | ⚠️ Requires both |
| Both shapes are visible in initial viewport without camera adjustment | None | HV-1 | ⚠️ Human only |
| Both shapes positioned horizontally adjacent with visible gap between them | None | HV-1 | ⚠️ Human only |
| Mouse drag (OrbitControls) rotates camera around both shapes simultaneously | None | HV-3 | ⚠️ Human only |
| Window resize maintains full-viewport canvas with both shapes visible | None | HV-4 | ⚠️ Human only |
| Diamond uses same rotation speed as cube (acceptable) | None | HV-2 | ⚠️ Acceptable |
| Diamond uses same material color as cube (acceptable if color differentiation not needed) | None | HV-7 | ⚠️ Acceptable |

---

### Code Quality Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| `src/main.js` remains under 100 lines (blank lines and comments excluded from count) | AG-3 | None | ✅ Automated |
| Diamond geometry created with Three.js built-in `OctahedronGeometry` constructor | AG-5 | HV-6 | ⚠️ Requires both |
| Diamond mesh added to scene graph via `scene.add(diamondMesh)` | AG-6 | None | ✅ Automated |
| No ESLint errors with standard ES6+ rules | AG-2 | HV-5 | ⚠️ Requires both |
| Diamond shares same material instance as cube OR has separate material (acceptable) | None | HV-6, HV-7 | ⚠️ Acceptable |
| Diamond rotation handled in same animation loop update block as cube (acceptable) | None | HV-6 | ⚠️ Acceptable |

---

### Visual Standards Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Both shapes centered vertically in viewport on initial load | None | HV-1 | ⚠️ Human only |
| Lighting illuminates both shapes (no pure silhouette on either geometry) | None | HV-1 | ⚠️ Human only |
| Horizontal spacing between shapes is sufficient to distinguish them (minimum 1 unit separation) | None | HV-1 | ⚠️ Human only |
| Camera FOV and position frame both shapes without requiring zoom or pan | None | HV-1 | ⚠️ Human only |
| Diamond appears smaller or larger than cube due to geometry defaults (acceptable) | None | HV-1 | ⚠️ Acceptable |
| Diamond positioned left or right of cube (acceptable as long as separation is clear) | None | HV-1 | ⚠️ Acceptable |
| Shapes overlap or intersect in initial view (unacceptable) | None | HV-1 | ❌ Fail condition |
| Diamond not visible in initial viewport (unacceptable) | None | HV-1 | ❌ Fail condition |

---

### Dependency Integrity Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| No new npm dependencies added beyond existing `three` and `vite` | AG-1 | None | ✅ Automated |
| `OctahedronGeometry` imported from `three` package (already available, no separate import needed) | AG-5, AG-2 | HV-5 | ⚠️ Requires both |
| `package.json` unchanged from prior orbit state | AG-1 | None | ✅ Automated |

---

### Project Structure Criteria

| Intent Acceptance Criterion | Automated Gate | Human Verification Point | Pass/Fail Status |
|------------------------------|----------------|---------------------------|-------------------|
| Only `src/main.js` modified — `index.html`, `src/style.css`, `package.json` remain unchanged | AG-4 | None | ✅ Automated |
| No additional files created beyond existing 4-file structure | AG-4 | None | ✅ Automated |
| Diamond mesh initialization occurs in existing `init()` function | None | HV-6 | ⚠️ Human only |

---

## Escape Criteria

### EC-1: Automated Gate Failure

**Trigger Condition:** Any automated gate (AG-1 through AG-8) returns fail status

**Response Actions:**

1. **Immediate Halt:** Stop verification protocol execution
2. **Error Logging:** Capture full stderr output from failed gate command
3. **Root Cause Analysis:**
   - If AG-1 fails: Inspect `package.json` for unexpected modifications or new dependencies
   - If AG-2 fails: Review `src/main.js` syntax errors, validate `OctahedronGeometry` namespace usage
   - If AG-3 fails: Manual line count verification, identify lines pushing over 100 limit
   - If AG-4 fails: Identify unexpected file modifications (check git diff output)
   - If AG-5 fails: Check if `OctahedronGeometry` constructor present, verify namespace pattern
   - If AG-6 fails: Check if `scene.add(diamond)` call present in `init()` function
   - If AG-7 fails: Verify `diamond` variable declared at module level (outside functions)
   - If AG-8 fails: Review Vite error messages, check module resolution failures

4. **Re-Orbit Decision Matrix:**

| Failed Gate | Re-Orbit Required | Scope | Estimated Time |
|-------------|-------------------|-------|----------------|
| AG-1 | Maybe (environmental if npm install issue) | Revert package.json changes or document environmental issue | 2-5 minutes |
| AG-2 | Yes | Fix JavaScript syntax errors in `src/main.js` | 5-10 minutes |
| AG-3 | Yes | Refactor `src/main.js` to reduce line count (consolidate diamond creation) | 5-10 minutes |
| AG-4 | Yes | Revert unintended file modifications, modify only `src/main.js` | 2-5 minutes |
| AG-5 | Yes | Add missing `OctahedronGeometry` constructor call | 2-5 minutes |
| AG-6 | Yes | Add missing `scene.add(diamond)` call in `init()` | 2-5 minutes |
| AG-7 | Yes | Move `diamond` variable declaration to module level | 2-5 minutes |
| AG-8 | Maybe | Investigate Vite startup errors, may be environmental | 5-10 minutes |

5. **Escalation Trigger:** If same automated gate fails twice after re-orbit, escalate to human review for architectural decision

---

### EC-2: Human Verification Point Failure

**Trigger Condition:** Any human verification point (HV-1 through HV-7) identifies fail criteria

**Response Actions:**

1. **Failure Documentation:** Record specific fail criteria observed (e.g., "Diamond not visible in initial viewport" for HV-1)
2. **Severity Classification:**
   - **Critical:** Violates mandatory acceptance boundary (✅) → Immediate re-orbit required
   - **Major:** Violates acceptable boundary (⚠️) → Human judgment call on re-orbit
   - **Minor:** Does not violate stated boundary but degrades UX → Document for future improvement

3. **Re-Orbit Decision Matrix:**

| Failed HV Point | Fail Criteria | Re-Orbit Required | Scope | Estimated Time |
|-----------------|---------------|-------------------|-------|----------------|
| HV-1 (Visual) | Diamond not visible in initial viewport | Yes (Critical) | Adjust diamond positioning or camera framing | 5-10 minutes |
| HV-1 (Visual) | Shapes overlap or intersect | Yes (Critical) | Adjust positioning to increase separation (x=±2.0 instead of ±1.5) | 5-10 minutes |
| HV-1 (Visual) | Diamond not geometrically distinct | Yes (Critical) | Verify OctahedronGeometry used, adjust lighting or detail level | 10-15 minutes |
| HV-2 (Animation) | Diamond not rotating | Yes (Critical) | Add missing diamond rotation updates in `animate()` | 2-5 minutes |
| HV-2 (Animation) | Performance below 30fps on capable hardware | Maybe (Major) | Simplify geometry or material (not expected with 20 triangles) | 10-15 minutes |
| HV-3 (OrbitControls) | Mouse drag no effect on camera | Yes (Critical) | Debug OrbitControls (unlikely, should be unchanged from Orbit 2) | 10-15 minutes |
| HV-3 (OrbitControls) | Orbit center feels unbalanced | Maybe (Major) | Adjust `controls.target` to center between shapes | 2-5 minutes |
| HV-4 (Resize) | Canvas doesn't resize to fill viewport | Yes (Critical) | Debug `onWindowResize()` (unlikely, should be unchanged from Orbit 2) | 10-15 minutes |
| HV-4 (Resize) | Shapes distorted on resize | Yes (Critical) | Debug camera aspect ratio calculation (unlikely, should be unchanged) | 10-15 minutes |
| HV-4 (Resize) | Either shape clips out of view on resize | Maybe (Major) | Adjust positioning or camera distance | 5-10 minutes |
| HV-5 (Console) | JavaScript errors present | Yes (Critical) | Debug error messages, fix identified issues | 10-20 minutes |
| HV-5 (Console) | OctahedronGeometry not defined errors | Yes (Critical) | Verify `import * as THREE from 'three'` present, check namespace usage | 5-10 minutes |
| HV-6 (Readability) | Code unclear or inconsistent | No (Minor) | Document for future refactoring, does not block orbit | N/A |
| HV-7 (Color) | Color differentiation unclear | Maybe (Major) | Adjust diamond material color for better contrast | 2-5 minutes |

4. **Rollback Procedure:**
   - If critical failure detected in HV-1 through HV-5: Restore previous `src/main.js` version from git
   - Re-run automated gates (AG-1 through AG-8) to verify clean state
   - Begin re-orbit with corrected implementation approach

---

### EC-3: Combined Gate Failure (Multiple Failures)

**Trigger Condition:** More than 2 automated gates fail OR more than 1 critical human verification point fails

**Response Actions:**

1. **Immediate Halt:** Stop all verification activities
2. **Full Rollback:** Restore `src/main.js` to pre-orbit state from version control
3. **Architecture Review:** Convene human review session to assess:
   - Whether Intent Document scope is correctly understood
   - Whether Proposal Record implementation approach is viable
   - Whether line count constraint (100 lines) is achievable with diamond addition
   - Whether unknown code structure issues exist in Orbit 2 baseline
4. **Re-Planning:** Generate new Proposal Record with alternative implementation approach:
   - Consolidated diamond creation (saves 2 lines)
   - Material reuse instead of separate diamond material (saves 1 line)
   - Alternative positioning strategy (asymmetric instead of symmetric)
5. **Escalation:** Notify orbit supervisor that original proposal failed comprehensive verification

**Escalation Trigger:** Automatic escalation to Tier 3 (Gated) if combined gate failure occurs twice

---

### EC-4: Acceptable Boundary Edge Cases

**Scenario:** Verification identifies behavior within "acceptable" boundary range (⚠️) but not optimal

**Examples:**
- Diamond uses same green color as cube (Intent accepts if color differentiation not needed for learning value)
- Diamond uses same rotation speed as cube (Intent accepts same speed)
- Diamond appears smaller than cube due to geometry defaults (Intent accepts size variation from defaults)
- Line count is 98 lines (under 100 limit but close to boundary)

**Response Actions:**

1. **Document Observation:** Note acceptable boundary condition in verification results
2. **Human Judgment Call:** Reviewer decides whether to:
   - **Accept and proceed:** Mark orbit as complete with acceptable boundary note
   - **Recommend improvement:** Mark orbit as complete but log enhancement request for future orbit (e.g., "Consider adding color differentiation in future iteration")
   - **Re-orbit for optimization:** Reject orbit and request refinement to move from "acceptable" to "optimal"

3. **No Automatic Escalation:** Acceptable boundary conditions do not trigger re-orbit unless human reviewer explicitly requests it

4. **Documentation:** Record acceptable boundary decisions in verification results:
   - Which boundaries fell into acceptable range
   - Reviewer rationale for accepting vs. requesting improvement
   - Educational value assessment (especially for color differentiation decision)

**Escalation Trigger:** None — acceptable boundaries are intentionally flexible per Intent design

---

### EC-5: Line Count Boundary Violation

**Trigger Condition:** AG-3 (line count gate) fails with count > 100 lines

**Specific Response Actions:**

1. **Calculate Overage:** Determine how many lines over 100 limit (e.g., 103 lines = 3-line overage)
2. **Apply Line Budget Optimization Strategies (in priority order):**

   **Strategy 1: Consolidate Diamond Creation (saves 2 lines)**
   ```javascript
   // BEFORE (5 lines)
   const diamondGeometry = new THREE.OctahedronGeometry(1, 0);
   const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
   diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
   diamond.position.x = 1.5;
   scene.add(diamond);
   
   // AFTER (3 lines)
   diamond = new THREE.Mesh(
     new THREE.OctahedronGeometry(1, 0),
     new THREE.MeshStandardMaterial({ color: 0x00ffff })
   );
   diamond.position.x = 1.5;
   scene.add(diamond);
   ```

   **Strategy 2: Reuse Cube Material (saves 1 additional line)**
   ```javascript
   // BEFORE (separate material)
   const diamondMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffff });
   diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
   
   // AFTER (reuse cube material)
   diamond = new THREE.Mesh(diamondGeometry, material); // material from cube creation
   ```

   **Strategy 3: Inline Positioning (saves 1 additional line)**
   ```javascript
   // BEFORE (separate positioning line)
   diamond = new THREE.Mesh(...);
   diamond.position.x = 1.5;
   scene.add(diamond);
   
   // AFTER (inline positioning)
   (diamond = new THREE.Mesh(...)).position.x = 1.5;
   scene.add(diamond);
   ```

3. **Re-Count After Each Strategy:** Apply strategies incrementally, re-run AG-3 after each to check if under 100 lines
4. **Trade-off Assessment:** Note any readability reduction from consolidation strategies
5. **Escalation:** If all strategies applied and still over 100 lines, escalate to human review for scope reduction discussion

**Maximum Achievable Savings:** 4 lines (Strategy 1 + Strategy 2 + Strategy 3)

**Escalation Trigger:** If overage > 4 lines, automatic escalation as line budget constraint cannot be satisfied with optimization alone

---

### EC-6: Visual Framing Failure

**Trigger Condition:** HV-1 fails with "Either shape not visible in initial viewport" or "Shapes clip during rotation"

**Specific Response Actions:**

1. **Diagnose Framing Issue:**
   - Check actual positioning values in code (cube.position.x, diamond.position.x)
   - Calculate horizontal extent: cube left edge to diamond right edge
   - Compare to camera frustum width: `2 * tan(FOV/2) * distance`
   
2. **Apply Framing Correction Strategies (in priority order):**

   **Strategy 1: Verify Symmetric Positioning (no line count impact)**
   - Ensure cube at `x = -1.5`, diamond at `x = 1.5`
   - Total width: ~4.5 units (within 7.7-unit frustum at FOV 75, distance 5)
   
   **Strategy 2: Pull Camera Back (1 character change)**
   - Change camera position from `z = 5` to `z = 6`
   - Increases frustum width from 7.7 to 9.2 units
   - Both shapes appear smaller but more margin for rotation
   
   **Strategy 3: Increase Camera FOV (1 character change)**
   - Change FOV from `75` to `85` degrees
   - Increases frustum width at same distance
   - Wider-angle view (may introduce distortion)
   
   **Strategy 4: Reduce Positioning Separation (no line count impact)**
   - Change cube to `x = -1.0`, diamond to `x = 1.0`
   - Reduces total width to ~3 units
   - Increases gap visibility but reduces shape separation

3. **Visual Re-Verification:** After applying strategy, re-run HV-1 to confirm both shapes visible
4. **Trade-off Assessment:** Document any visual impact (e.g., shapes appear smaller if camera pulled back)

**Escalation Trigger:** If all strategies fail to frame both shapes, escalate to human review for alternative positioning or camera setup discussion

---

### EC-7: Environmental Failure (Non-Orbit Issues)

**Trigger Condition:** Verification failures caused by environmental factors outside orbit scope

**Examples:**
- Node.js version below 18.0.0 (AG-1 or AG-8 may fail)
- Port 5173 occupied by another process (AG-8 fails)
- Browser lacks WebGL support (HV-1 fails with black screen)
- Network issues prevent `npm install` (AG-1 fails)
- Incorrect Orbit 2 baseline state (cube not rendering from prior orbit)

**Response Actions:**

1. **Classify as Environmental:** Distinguish between orbit code issues and setup issues
2. **Document Requirements:** Update verification handoff notes with environmental prerequisites
3. **No Re-Orbit:** Environmental failures do not trigger code changes to current orbit
4. **User Notification:** Provide clear error message explaining environmental requirement:
   - "Node.js 18.0.0 or higher is required. Current version: X.X.X. Please upgrade Node.js."
   - "Port 5173 is already in use. Vite will use alternative port shown in terminal output."
   - "WebGL is not supported in this browser. Please use Chrome 90+, Firefox 88+, Safari 15+, or Edge 90+."
   - "Orbit 2 baseline verification failed. Please verify cube from prior orbit renders correctly before adding diamond."

5. **Baseline Verification:** If Orbit 2 state is suspect:
   - Check `src/main.js` contains cube rendering code from prior orbit
   - Run Orbit 2 verification protocol to confirm baseline functionality
   - If Orbit 2 verification fails, escalate to resolve baseline issues before proceeding with diamond addition

**Escalation Trigger:** None for true environmental issues (Node version, port conflicts, browser support). Escalate if Orbit 2 baseline verification fails (indicates prior orbit incomplete).