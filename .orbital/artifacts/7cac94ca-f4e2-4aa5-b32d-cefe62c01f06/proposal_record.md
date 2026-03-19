# Proposal Record: Subtle Interaction + Scene Polish with Date Display

## Interpreted Intent

This orbit enhances the existing Three.js starter scene with four coordinated improvements that create a sense of life and responsiveness while maintaining code minimalism. The scene currently contains three geometries (cube, diamond, sphere) with basic rotation on a single object. We will:

1. **Differentiate motion patterns** — Give each geometry its own movement signature: cube continues X+Y rotation, diamond gains Z-axis rotation at different speed, sphere executes circular orbit around origin on XZ plane
2. **Enable soft shadow system** — Configure renderer shadow mapping, make all three geometries cast shadows, add ground plane positioned below origin to receive shadows with dark material that blends into background
3. **Add mouse-reactive lighting** — DirectionalLight position responds to mouse movement with smooth interpolation, creating subtle illumination shifts without interfering with OrbitControls camera manipulation
4. **Integrate date display** — Render "3/19/2026" as sprite-based text positioned in viewport corner using canvas texture, avoiding async font loading complexity

The implementation prioritizes the 100-line JavaScript constraint by using sprite text over TextGeometry (eliminates FontLoader async overhead), inlining shadow properties during geometry creation, and storing mouse interaction state in minimal variables. The aesthetic remains dark and minimal — shadows are soft-edged and subtle, the ground plane is nearly black, and mouse interaction creates gentle light shifts rather than dramatic effects.

Critical interpretation: The date "3/19/2026" is a literal string to display, not a dynamic timestamp. This re-orbit from prior work adds date rendering as the distinguishing feature.

## Implementation Plan

### File Modifications

**`src/main.js` (primary modification surface)**

Structural changes organized in sequential blocks:

**Block 1: Imports (lines 1-2)**
- Existing: `import * as THREE from 'three'` and `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'`
- No changes required — all features use built-in Three.js APIs

**Block 2: Scene initialization (lines 3-8)**
- Existing: Scene, camera (positioned at z: 5), renderer with dark background
- **Modification:** Add `renderer.shadowMap.enabled = true` and `renderer.shadowMap.type = THREE.PCFSoftShadowMap` immediately after renderer creation
- Line count impact: +2 lines

**Block 3: Lighting setup (lines 9-12)**
- Existing: AmbientLight and DirectionalLight
- **Modifications:**
  - Set `directionalLight.castShadow = true`
  - Configure shadow camera: `directionalLight.shadow.camera.left = directionalLight.shadow.camera.bottom = -10`, `directionalLight.shadow.camera.right = directionalLight.shadow.camera.top = 10`
  - Set shadow map size: `directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024`
  - Position DirectionalLight at `(5, 10, 5)` to illuminate from above-right
- Line count impact: +3 lines (property assignments can be chained)

**Block 4: Geometry creation (lines 13-25)**
- Existing: Cube, diamond (OctahedronGeometry), sphere
- **Modifications for each mesh:**
  - Add `castShadow: true` during mesh creation or as immediate property assignment
  - Store references needed for animation (cube, diamond, sphere as module-scope variables)
- **New ground plane:**
  - `const ground = new THREE.Mesh(new THREE.PlaneGeometry(15, 15), new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 1 }))`
  - `ground.rotation.x = -Math.PI / 2` (rotate to horizontal)
  - `ground.position.y = -2` (position below origin)
  - `ground.receiveShadow = true`
  - `scene.add(ground)`
- Line count impact: +4 lines (ground plane), +3 lines (shadow properties for existing meshes)

**Block 5: Mouse interaction state (new, after geometry)**
- `let mouseX = 0, mouseY = 0`
- `window.addEventListener('mousemove', (e) => { mouseX = e.clientX / window.innerWidth - 0.5; mouseY = e.clientY / window.innerHeight - 0.5 })`
- Line count impact: +2 lines

**Block 6: Date sprite creation (new, before OrbitControls)**
- Create canvas texture:
  ```javascript
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 64;
  ctx.fillStyle = '#ffffff';
  ctx.font = '32px monospace';
  ctx.fillText('3/19/2026', 10, 40);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
  sprite.position.set(4, 3, 0);
  sprite.scale.set(2, 0.5, 1);
  scene.add(sprite);
  ```
- Line count impact: +11 lines (aggressive optimization: inline canvas setup, chain property assignments)
- Optimization opportunities: Combine variable declarations, remove whitespace, inline texture into sprite material constructor

**Block 7: OrbitControls setup (existing, lines ~35-36)**
- No changes — preserved as-is

**Block 8: Window resize handler (existing, lines ~37-41)**
- No changes — preserved as-is

**Block 9: Animation loop (lines ~42-50, expanded to ~55)**
- Existing: `requestAnimationFrame`, cube rotation on X and Y
- **Additions:**
  - Diamond rotation: `diamond.rotation.z += 0.005` (slower than cube, different axis)
  - Sphere orbit: Store time variable `let time = 0` before animate function, increment `time += 0.01`, update position `sphere.position.x = 3 * Math.cos(time); sphere.position.z = 3 * Math.sin(time)`
  - Light interpolation: `directionalLight.position.x += (mouseX * 10 - directionalLight.position.x) * 0.05; directionalLight.position.y += (10 - mouseY * 5 - directionalLight.position.y) * 0.05`
- Line count impact: +6 lines

**Line count reconciliation:**
- Starting baseline (Orbit 1): ~45 lines (scene setup, three geometries, lights, controls, resize, animation)
- Shadow system: +5 lines (renderer config, light properties, shadow camera)
- Ground plane: +4 lines
- Mouse state: +2 lines
- Date sprite: +11 lines (target for aggressive optimization)
- Motion updates: +6 lines
- **Total estimated: 73 lines** (27-line buffer for existing code variance and optimization)

**Optimization strategies if line count exceeds 100:**
1. Inline canvas texture creation into SpriteMaterial constructor (save 3-4 lines)
2. Chain all shadow property assignments on single lines with semicolons (save 2-3 lines)
3. Combine mouse coordinate normalization into event handler body (save 1 line)
4. Remove intermediate variables for geometries/materials where only used once (save 2-3 lines)

### Execution Order

1. **Enable renderer shadows** — Must occur during initialization before any geometry is added
2. **Configure light shadow properties** — Requires light to exist, must complete before animation loop starts
3. **Create ground plane** — After light configuration to ensure it can receive shadows
4. **Set up mouse listener** — Before animation loop so state variables exist when referenced
5. **Create date sprite** — Canvas must be created and rendered before texture is applied to sprite
6. **Modify animation loop** — Last step, references all objects created in prior steps

### Dependencies

**No new npm packages required.** All features use:
- `THREE.PCFSoftShadowMap` (built-in shadow map type)
- `THREE.PlaneGeometry` (built-in primitive)
- `THREE.Sprite` and `THREE.SpriteMaterial` (built-in billboard rendering)
- `THREE.CanvasTexture` (built-in texture type that wraps HTML5 canvas)
- Browser `mousemove` event (native DOM API)
- `document.createElement('canvas')` (native DOM API)

**Existing dependencies leveraged:**
- `three@^0.160.0` — provides all Three.js APIs
- `vite@^5.0.0` — no changes to build configuration required

### Visual Validation Approach

After implementation, visual checks to confirm acceptance boundaries:

1. **Motion differentiation:** Observe scene for 10 seconds — cube should rotate on X+Y, diamond on Z only, sphere should complete ~1/8 of circular orbit
2. **Shadow visibility:** Look for soft-edged shadows cast by all three geometries onto ground plane — should be subtle but clearly present
3. **Mouse interaction:** Move mouse across viewport — light position should shift smoothly causing illumination changes on geometries
4. **Date readability:** "3/19/2026" should be visible in corner (top-right or configurable), white text contrasting against dark background
5. **Performance:** Open browser DevTools performance monitor — frame rate should maintain 58-60fps during continuous animation

## Risk Surface

### Line Count Overage

**Risk:** Implementation exceeds 100-line hard constraint due to date sprite creation overhead (11 lines estimated).

**Mitigation Strategy:**
- Canvas texture creation is most line-intensive block — inline all setup:
  ```javascript
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 256; canvas.height = 64; ctx.fillStyle = '#fff'; ctx.font = '32px monospace'; ctx.fillText('3/19/2026', 10, 40);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
  sprite.position.set(4, 3, 0); sprite.scale.set(2, 0.5, 1); scene.add(sprite);
  ```
- Reduces to 4 lines with aggressive semicolon chaining
- Alternative: If still over limit, propose HTML overlay positioned with CSS as Tier 2 modification request (violates "not as HTML overlay" but provides escape valve)

**Detection:** Line count check in verification phase before commit.

### Shadow Performance Degradation

**Risk:** Three shadow-casting objects plus 1024x1024 shadow map may cause frame drops on mid-tier hardware.

**Mitigation Strategy:**
- DirectionalLight shadow camera frustum sized to -10/+10 bounds (tight fit reduces wasted shadow map space)
- Ground plane limited to 15x15 units (smaller than typical defaults)
- Shadow map resolution at 1024x1024 (acceptable threshold per intent document)
- Use `PCFSoftShadowMap` which has hardware-optimized soft shadow filtering

**Fallback:** If frame rate drops below 55fps in testing, reduce shadow map to 512x512 (quality/performance tradeoff acceptable per intent's "balance" language).

**Detection:** Performance profiling during visual validation phase.

### Mouse Interaction Jitter During OrbitControls Usage

**Risk:** Simultaneous mouse tracking for light updates and OrbitControls camera drag creates visual conflict or jittery light movement.

**Mitigation Strategy:**
- Light position interpolation uses lerp factor 0.05 (smooth, damped response)
- Mouse coordinates stored in module-scope variables, updated immediately in event handler
- Light position updated incrementally in animation loop (decoupled from event timing)
- No `preventDefault()` or `stopPropagation()` calls — events flow to both systems independently

**Test Case:** Click-drag to rotate camera while moving mouse — camera rotation should remain smooth, light should shift gently without jumps.

**Detection:** Manual testing during visual validation.

### Date Sprite Positioning Off-Screen or Occluded

**Risk:** Sprite positioned at `(4, 3, 0)` may be outside camera view frustum or hidden behind rotating geometries depending on camera FOV and position.

**Mitigation Strategy:**
- Position selected to be top-right of viewport at default camera position (z: 5)
- Sprite scale of 2x0.5 ensures readability without dominating scene
- SpriteMaterial always renders at full brightness (unaffected by lighting) ensuring visibility
- Billboard behavior (faces camera) prevents rotation-based occlusion

**Adjustment During Review:** If position proves suboptimal during visual validation, coordinates easily tweaked (single line change).

**Detection:** Visual inspection during validation phase.

### Sphere Orbit Drift or Ellipse Formation

**Risk:** Floating-point accumulation in time variable or incorrect parametric equations cause sphere to drift from circular path over time.

**Mitigation Strategy:**
- Use standard parametric circle: `x = radius * cos(t)`, `z = radius * sin(t)` with y constant
- Time increment of 0.01 produces smooth motion (full orbit in ~628 frames at 60fps ≈ 10.5 seconds, within 8-15 second acceptance range)
- Radius of 3 units (midpoint of 2-4 acceptable range) keeps sphere visible without colliding with other objects

**Validation:** Observe sphere for 30+ seconds — should return to starting position repeatedly without visible drift.

**Detection:** Extended runtime visual check (5+ minutes) during validation phase.

### Ground Plane Visual Prominence

**Risk:** Ground plane draws excessive attention away from primary geometries due to size, brightness, or shadow contrast.

**Mitigation Strategy:**
- Material color `0x0a0a0a` is extremely dark (10/255 brightness) — nearly blends with `0x1a1a2e` background
- Roughness 1.0 eliminates specular highlights that would create visual pop
- Size 15x15 is large enough to catch shadows but edges remain outside typical camera view at default position
- Positioned at y: -2 (below all geometries which are at origin height)

**Tuning During Review:** Shadow darkness can be adjusted via `directionalLight.shadow.darkness` or material opacity if shadows too harsh or too faint.

**Detection:** Aesthetic judgment during Tier 2 human review.

### Shadow Camera Frustum Clipping

**Risk:** Default shadow camera bounds too narrow, causing shadows to be cut off at edges or not appear at all.

**Mitigation Strategy:**
- Explicit frustum configuration: left/right/top/bottom at ±10 units frames all three geometries (each ~1-2 units in size) plus orbital radius
- Near 0.5, far 50 brackets scene depth comfortably
- DirectionalLight positioned at (5, 10, 5) — high enough to illuminate from above, angled to create visible shadows

**Debugging Hook:** If shadows missing during testing, temporarily add `new THREE.CameraHelper(directionalLight.shadow.camera)` to visualize frustum (remove before line count check).

**Detection:** Visual inspection — shadows should be present under all three geometries on ground plane.

## Scope Estimate

### Complexity Assessment

**Overall Complexity: Low-Medium**

This orbit involves well-understood Three.js APIs with no novel algorithms or complex state management. Primary challenge is code density optimization to meet 100-line constraint while maintaining readability.

**Breakdown by feature:**
- Shadow system: Low complexity (property flags and renderer config)
- Mouse interaction: Low complexity (basic event handling and lerp)
- Sphere orbit: Low complexity (parametric circle math)
- Date sprite: Medium complexity (canvas API and texture creation require more lines)
- Ground plane: Low complexity (standard geometry creation)

### Orbit Count

**Single Orbit** — All features are tightly coupled and must be tested together:
- Shadow system requires ground plane to validate
- Mouse interaction modifies the same light that casts shadows
- Date sprite is additive and doesn't interact with other features
- Motion changes build on existing animation loop

Splitting into multiple orbits would create incomplete states (e.g., shadows enabled but no ground plane to receive them).

### Work Phases

**Phase 1: Code Generation (Estimated: 1 pass)**
- Modify `src/main.js` with all five feature additions
- Optimize line count to meet <100 constraint
- Ensure code passes syntax validation

**Phase 2: Visual Validation (Estimated: 10-15 minutes manual testing)**
- Start dev server with `npm run dev`
- Verify motion differentiation (all three objects move distinctly)
- Confirm shadows visible and soft-edged
- Test mouse interaction (light responds smoothly)
- Check date sprite positioning and readability
- Monitor frame rate in DevTools performance panel

**Phase 3: Tier 2 Review (Human Checkpoint)**
- Aesthetic judgment: Are shadows subtle enough? Is ground plane unobtrusive?
- Date context validation: Is "3/19/2026" the correct literal string?
- Code readability check: Are optimizations too aggressive for a "starter" project?
- Approve or request modifications

**Phase 4: Documentation (if approved)**
- Update repository README if this becomes reference implementation
- No additional artifacts required for this orbit

### Success Criteria Checklist

- [ ] `src/main.js` contains ≤100 lines of JavaScript
- [ ] Cube rotates on X+Y, diamond on Z, sphere orbits origin
- [ ] All three geometries cast soft shadows onto ground plane
- [ ] Ground plane visible but unobtrusive (dark, blends with background)
- [ ] Mouse movement causes perceptible light position shifts within 0.5s
- [ ] OrbitControls remain functional during mouse interaction
- [ ] Date "3/19/2026" visible in viewport corner, readable against dark background
- [ ] Scene maintains 58-60fps during continuous animation
- [ ] No console errors or warnings
- [ ] Window resize handling preserved and functional

## Human Modifications

Pending human review.