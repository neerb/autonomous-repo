# Proposal Record: Three.js Starter Project

## Interpreted Intent

This orbit implements a minimal Three.js development environment optimized for rapid prototyping. The core requirement is a functional 3D scene visible within 60 seconds of cloning the repository, achieved through a deliberately constrained implementation that prioritizes simplicity over extensibility.

**Key Interpretations:**

1. **"Minimal" means line-count constrained, not feature-constrained.** The 100-line JavaScript limit forces architectural decisions that favor inline initialization over helper functions. This is a teaching tool first, a production scaffold second.

2. **Visual correctness is non-negotiable.** The scene must render with depth perception (lighting creates distinguishable faces), the canvas must fill the entire viewport without white margins, and the background color must be exactly `0x1a1a2e`. These are pass/fail criteria.

3. **The 60fps performance target assumes modern hardware.** "Mid-range 2020+ laptop with integrated graphics" implies Intel Iris Xe or AMD Vega-class GPUs. No fallback rendering paths or performance monitoring are required — the scene either hits 60fps or fails acceptance.

4. **Hot module replacement is a Vite feature, not an implementation concern.** The JavaScript code does not need to handle module hot-swapping — Vite's dev server provides this automatically for ES module imports.

5. **OrbitControls damping is a UX enhancement, not a performance risk.** Enabling damping with a conservative `dampingFactor` of 0.05 creates smooth camera deceleration without introducing frame drops on target hardware.

6. **This is a greenfield implementation.** The existing `package.json` and `README.md` are already correct. The orbit creates three new files (`index.html`, `src/main.js`, `src/style.css`) that integrate with the existing structure.

## Implementation Plan

### Phase 1: HTML Entry Point

**File:** `index.html` (root directory)

**Purpose:** Minimal HTML5 document that loads Vite's module system and mounts the canvas.

**Implementation:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Three.js Starter</title>
    <link rel="stylesheet" href="/src/style.css" />
  </head>
  <body>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

**Design Decisions:**
- No `<canvas>` element in HTML — Three.js renderer creates and appends it dynamically
- Viewport meta tag ensures proper scaling on mobile devices (even though OrbitControls mouse-only constraint means touch support is out of scope)
- CSS link uses absolute path `/src/style.css` to match Vite's dev server routing
- Script uses `type="module"` to enable ES6 import syntax

**Line Count:** 11 lines (HTML not counted toward 100-line JavaScript constraint)

### Phase 2: CSS Reset and Viewport Styling

**File:** `src/style.css`

**Purpose:** Eliminate browser default styles and ensure canvas fills the entire viewport.

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

**Design Decisions:**
- Universal selector (`*`) resets all elements to eliminate cross-browser inconsistencies
- `overflow: hidden` on body prevents scrollbars during window resize transitions
- `display: block` on canvas removes the 3-4px inline whitespace gap that appears below inline elements in most browsers
- No explicit `width` or `height` on canvas — Three.js renderer sets these dynamically via `setSize()`

**Line Count:** 12 lines (CSS not counted toward 100-line JavaScript constraint)

### Phase 3: Three.js Scene Implementation

**File:** `src/main.js`

**Purpose:** Scene initialization, animation loop, and resize handling in under 100 lines.

**Implementation Structure:**

1. **Imports (3 lines)**
   ```javascript
   import * as THREE from 'three'
   import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
   ```

2. **Scene Setup (1 line)**
   ```javascript
   const scene = new THREE.Scene()
   ```

3. **Camera Configuration (4 lines)**
   ```javascript
   const camera = new THREE.PerspectiveCamera(
     75,
     window.innerWidth / window.innerHeight,
     0.1,
     1000
   )
   camera.position.z = 5
   ```
   - **FOV:** 75 degrees (standard for desktop 3D applications)
   - **Aspect ratio:** Calculated from window dimensions, recalculated on resize
   - **Near plane:** 0.1 (prevents clipping of close objects)
   - **Far plane:** 1000 (sufficient for simple scenes without distant objects)
   - **Z position:** 5 units back (positions camera to view cube at origin)

4. **Renderer Configuration (5 lines)**
   ```javascript
   const renderer = new THREE.WebGLRenderer({ antialias: true })
   renderer.setSize(window.innerWidth, window.innerHeight)
   renderer.setPixelRatio(window.devicePixelRatio)
   renderer.setClearColor(0x1a1a2e)
   document.body.appendChild(renderer.domElement)
   ```
   - **Antialiasing:** Enabled for smooth edges (minor performance cost acceptable on target hardware)
   - **Pixel ratio:** Matches device DPI (2x on Retina displays)
   - **Clear color:** Exact hex `0x1a1a2e` per Intent visual requirements
   - **DOM append:** Canvas added to body after renderer creation (ensures canvas exists before OrbitControls initialization)

5. **Lighting (4 lines)**
   ```javascript
   const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
   scene.add(ambientLight)
   const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
   directionalLight.position.set(5, 5, 5)
   scene.add(directionalLight)
   ```
   - **Ambient light:** 50% intensity white light (ensures no face is completely black)
   - **Directional light:** 80% intensity positioned at (5, 5, 5) (creates highlights on top-right faces)
   - **No shadows:** Shadow mapping disabled to stay under 100-line constraint

6. **Geometry and Material (4 lines)**
   ```javascript
   const geometry = new THREE.BoxGeometry(1, 1, 1)
   const material = new THREE.MeshStandardMaterial({ color: 0x00aaff })
   const cube = new THREE.Mesh(geometry, material)
   scene.add(cube)
   ```
   - **BoxGeometry:** 1x1x1 cube (standard unit size)
   - **MeshStandardMaterial:** Physically-based rendering material (responds to lights, has specular highlights)
   - **Color:** Bright cyan (`0x00aaff`) for high contrast against dark background
   - **MeshStandardMaterial vs MeshBasicMaterial:** Standard material required to show lighting effects (Basic material ignores lights, would appear flat)

7. **OrbitControls (3 lines)**
   ```javascript
   const controls = new OrbitControls(camera, renderer.domElement)
   controls.enableDamping = true
   controls.dampingFactor = 0.05
   ```
   - **Constructor:** Binds mouse events to renderer's canvas element
   - **Damping:** Enabled for smooth deceleration (requires `controls.update()` in animation loop)
   - **Damping factor:** 0.05 (lower = more momentum, higher = quicker stops)

8. **Window Resize Handler (6 lines)**
   ```javascript
   window.addEventListener('resize', () => {
     camera.aspect = window.innerWidth / window.innerHeight
     camera.updateProjectionMatrix()
     renderer.setSize(window.innerWidth, window.innerHeight)
   })
   ```
   - **Aspect ratio update:** Prevents cube stretching when window changes shape
   - **Projection matrix update:** Required after changing camera properties
   - **Renderer size update:** Matches canvas dimensions to new window size

9. **Animation Loop (7 lines)**
   ```javascript
   function animate() {
     requestAnimationFrame(animate)
     
     cube.rotation.x += 0.01
     cube.rotation.y += 0.01
     
     controls.update()
     renderer.render(scene, camera)
   }
   animate()
   ```
   - **requestAnimationFrame:** Browser-optimized 60fps loop (pauses when tab inactive)
   - **Rotation increment:** 0.01 radians per frame (approximately 34 degrees per second)
   - **controls.update():** Required when damping is enabled
   - **Render call:** Draws scene from camera perspective

**Total Line Count:** 37 lines (excluding blank lines for readability)

**Optimization Strategy for 100-Line Constraint:**
- Inline all object instantiation (no helper functions)
- Combine related operations on consecutive lines (e.g., `scene.add(ambientLight)` immediately after `const ambientLight = ...`)
- Use single-character variable names where context is obvious (considered but rejected — Intent prioritizes readability)
- Eliminate all comments in final version (preserve comments in proposal for clarity)

### Phase 4: Verification

**Actions:**
1. Run `npm install` to verify dependencies resolve correctly
2. Run `npm run dev` to start Vite dev server
3. Open `http://localhost:5173` in Chrome 90+ or Firefox 88+
4. Visually confirm:
   - Cube is visible and rotating on both X and Y axes
   - Background color is dark blue-gray (compare to `#1a1a2e` in color picker)
   - Canvas fills entire viewport with no white margins or scrollbars
   - OrbitControls respond to left-click drag (rotation), right-click drag (pan), scroll wheel (zoom)
5. Open Chrome DevTools Performance tab and record 5 seconds of animation
6. Verify frame rate stays above 30fps (target 60fps)
7. Resize browser window and confirm canvas updates without visual glitches

## Risk Surface

### Implementation Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **OrbitControls import path typo** | Medium | High — Camera remains static, breaking acceptance criteria | Use exact path from Context Package: `three/examples/jsm/controls/OrbitControls.js` with `.js` extension. Test import resolution immediately after writing. |
| **Camera positioned too close/far** | Low | Medium — Cube too large/small in viewport | Camera Z position of 5 units is calculated for 1x1x1 cube with 75° FOV. Formula: `distance = (objectSize / 2) / tan(FOV / 2)` = (0.5) / tan(37.5°) ≈ 0.65 minimum. Z=5 provides comfortable viewing distance with room for orbit navigation. |
| **Rotation speed too fast/slow** | Medium | Low — Subjective visual acceptance may fail | Rotation increment of 0.01 radians/frame = 0.6 radians/second at 60fps = 34°/sec. This matches Intent's "visually pleasing" guidance. If reviewer finds it too fast, reduce to 0.005; if too slow, increase to 0.015. |
| **Lighting too dim/bright** | Low | Medium — Cube faces not distinguishable | Ambient light at 0.5 intensity ensures base visibility. Directional light at 0.8 intensity creates contrast. Combined intensity of 1.3 is standard for well-lit scenes without overexposure. |
| **Pixel ratio mismatch on Retina displays** | Low | Low — Canvas appears blurry but functional | `renderer.setPixelRatio(window.devicePixelRatio)` doubles resolution on 2x displays. This increases pixel count by 4x (2x width, 2x height) but target hardware (2020+ laptops with Iris Xe) can render 1920x1080@2x at 60fps for simple scenes. |

### Code Quality Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Exceeding 100-line limit** | Low | High — Fails Intent constraint | Current implementation is 37 lines. Adding 5 lines of comments and 10 blank lines for readability = 52 lines total, well under 100-line target. If additional features are requested during review, prioritize removing blank lines before removing functionality. |
| **Variable name collisions** | Very Low | Low — JavaScript scope prevents collisions | All variables are `const` declarations in module scope. No global variables. No risk of collision with Three.js internals (all THREE.* names are namespaced). |
| **Memory leak from unreleased resources** | Very Low | Medium — Long-running sessions could degrade performance | Three.js does not require manual cleanup for single-scene applications. Geometry, materials, and textures are garbage-collected when scene is destroyed. No `dispose()` calls needed for this use case. |

### Browser Compatibility Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **WebGL not available** | Low | High — Black screen with console error | Intent specifies "Modern browser with WebGL support" as requirement. No fallback needed. Three.js logs clear error message: "WebGL not supported" to console if context creation fails. |
| **ES module imports not supported** | Very Low | High — Script fails to load | Target browsers (Chrome 90+, Firefox 88+, Safari 14.1+) all support ES modules. Vite transforms imports for dev server. No transpilation needed. |
| **requestAnimationFrame not supported** | Very Low | High — No animation | All target browsers support `requestAnimationFrame` since 2012. No polyfill needed. |

### Performance Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Frame rate drops below 60fps** | Low | Medium — Fails performance acceptance | Scene complexity is minimal: 1 mesh (12 triangles), 2 lights, no shadows, no post-processing. Target hardware (Intel Iris Xe) can render 100k+ triangles at 60fps. Actual triangle count: 12. Safety margin: 8,333x. |
| **Window resize causes frame drops** | Medium | Low — Temporary glitch acceptable | Resize handler recalculates aspect ratio and updates renderer size synchronously. On 4K displays (3840x2160), this reallocates ~8.3 million pixels. Modern GPUs handle this in <16ms. If stuttering occurs, debounce resize handler with 100ms delay. |
| **High pixel ratio doubles GPU load** | Medium | Low — Still above 30fps minimum | Retina displays (2x pixel ratio) render 4x pixels. For 1920x1080 window, actual render size is 3840x2160. Simple scene maintains 60fps on target hardware even at 4K resolution. |

### Scope Creep Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| **Reviewer requests additional features** | Medium | Medium — Could exceed 100-line constraint | Intent explicitly lists non-goals: production builds, mobile touch, accessibility, multiple scenes, post-processing. If requested during review, reference Intent Document section "Non-Goals" and propose separate orbit. |
| **Reviewer requests performance monitoring** | Low | Low — Can be added without code changes | Chrome DevTools Performance tab provides frame rate graphs. No in-code FPS counter needed. If persistent monitoring is required, this should be a separate orbit for a debug overlay. |

## Scope Estimate

### Complexity Assessment

**Overall Complexity:** Low

**Justification:**
- Greenfield implementation with no integration points
- Well-defined constraints (100 lines, specific file structure, exact visual requirements)
- No data persistence, no external APIs, no state management
- Three.js provides high-level abstractions for all required functionality
- Vite handles all build tooling without configuration

### Work Breakdown

| Phase | Description | Estimated Lines | Complexity |
|-------|-------------|-----------------|------------|
| **Phase 1: HTML Entry Point** | Create `index.html` with module script loader | 11 lines (not counted) | Trivial |
| **Phase 2: CSS Reset** | Create `src/style.css` with viewport styles | 12 lines (not counted) | Trivial |
| **Phase 3: Scene Imports** | Import Three.js core and OrbitControls | 3 lines | Low — Path must be exact |
| **Phase 4: Scene Initialization** | Instantiate scene, camera, renderer | 15 lines | Low — Standard Three.js pattern |
| **Phase 5: Lighting** | Add ambient and directional lights | 5 lines | Low — Standard lighting setup |
| **Phase 6: Geometry** | Create cube mesh with material | 4 lines | Trivial |
| **Phase 7: OrbitControls** | Configure camera controls with damping | 3 lines | Low — Standard control setup |
| **Phase 8: Resize Handler** | Update camera and renderer on window resize | 6 lines | Medium — Aspect ratio math required |
| **Phase 9: Animation Loop** | Rotate cube and render scene at 60fps | 7 lines | Low — Standard animation pattern |
| **Phase 10: Verification** | Manual testing of visual and performance acceptance | N/A | Medium — Subjective criteria |

**Total Estimated Lines:** 43 lines of JavaScript (57 lines under 100-line constraint budget)

### Orbit Count Estimate

**Single Orbit:** This proposal represents the complete implementation. No follow-up orbits are required unless acceptance criteria fail during verification.

**Potential Follow-Up Orbits (if needed):**
- **Orbit 1.1:** Performance optimization if frame rate drops below 30fps (Low probability based on risk assessment)
- **Orbit 1.2:** Visual adjustments if lighting or rotation speed fails acceptance (Medium probability due to subjective criteria)
- **Orbit 1.3:** OrbitControls refinement if damping feels unresponsive (Low probability)

### Time Estimate

**Implementation:** 15-30 minutes
- Writing HTML: 2 minutes
- Writing CSS: 2 minutes
- Writing JavaScript: 10-15 minutes
- Initial testing: 5-10 minutes

**Verification:** 15-30 minutes
- Functional testing: 5 minutes
- Visual acceptance: 5-10 minutes
- Performance profiling: 5-10 minutes
- Cross-browser testing: 5 minutes

**Total:** 30-60 minutes from start to verified completion

### Risk-Adjusted Estimate

**Pessimistic Case (90th percentile):**
- OrbitControls import path requires debugging: +15 minutes
- Rotation speed requires tuning: +10 minutes
- Lighting requires adjustment: +10 minutes
- **Total:** 65-95 minutes

**Optimistic Case (10th percentile):**
- Implementation succeeds on first attempt: 20 minutes
- Visual acceptance passes without adjustment: 10 minutes
- **Total:** 30 minutes

**Most Likely Case (50th percentile):**
- One visual adjustment iteration: +10 minutes
- **Total:** 40-70 minutes

## Human Modifications

Pending human review.