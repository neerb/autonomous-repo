# Proposal Record: Subtle Interaction + Scene Polish with Minimal Menu

## Interpreted Intent

This orbit enhances the existing Three.js scene from Orbit 1 with three categories of improvements that collectively make the experience feel more dynamic and polished:

**1. Coordinated Motion System:**
The three geometric objects (cube, diamond, sphere) will move independently but harmoniously. The cube maintains its existing X+Y rotation. The diamond rotates on a different axis (Z+X) to create visual distinction. The sphere orbits the scene center in a circular path, calculated using trigonometric functions with a 2-unit radius completing one revolution every 10 seconds.

**2. Reactive Lighting:**
A `mousemove` event listener captures cursor position, normalizes coordinates to [-1, 1] range, and applies these values to shift the DirectionalLight's position. This creates a subtle "following" effect where light direction responds to user presence. The scaling factor (2-3×) ensures visibility without overwhelming the scene.

**3. Shadow Rendering:**
Enable Three.js shadow mapping with `PCFSoftShadowMap` for soft edges. Configure the DirectionalLight to cast shadows, set all three objects (`cube`, `diamond`, `sphere`) to `castShadow = true`, and add a dark PlaneGeometry ground at y=-3 with `receiveShadow = true`. The ground plane uses a very dark blue-tinted material (0x0a0a0f) to remain subtle.

**4. Minimal Menu Overlay:**
Add a small HTML div to `index.html` containing 3-4 items: the date "March 19, 2026", scene name, and optionally FPS or control hints. Style via `src/style.css` with absolute positioning (top-right corner), semi-transparent dark background (rgba(0,0,0,0.7)), white text, and sufficient padding for readability.

**Constraint Adherence:**
All JavaScript logic remains in `src/main.js` under 100 lines. No new npm dependencies. OrbitControls and resize handler remain untouched. Performance target of 60fps maintained through efficient shadow map configuration (1024×1024 resolution) and minimal computational overhead in animation loop.

## Implementation Plan

### Phase 1: Shadow System Configuration (src/main.js)

**Lines 1-3: Renderer Shadow Initialization**
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```
Add immediately after renderer creation, before scene population.

**Lines 4-6: DirectionalLight Shadow Setup**
```javascript
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.position.set(5, 10, 7.5);
```
Modify existing DirectionalLight configuration. Position adjusted to cast shadows toward camera.

**Lines 7-9: Object Shadow Casting**
```javascript
cube.castShadow = true;
diamond.castShadow = true;
sphere.castShadow = true;
```
Add after each mesh creation.

### Phase 2: Ground Plane Creation (src/main.js)

**Lines 10-15: Ground Geometry and Material**
```javascript
const groundGeometry = new THREE.PlaneGeometry(30, 30);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x0a0a0f,
  roughness: 0.8,
  metalness: 0.2
});
const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -3;
groundPlane.receiveShadow = true;
scene.add(groundPlane);
```
Insert after object creation, before animation loop definition.

### Phase 3: Enhanced Animation Logic (src/main.js)

**Lines 16-18: Clock Initialization**
```javascript
const clock = new THREE.Clock();
```
Add before `animate()` function definition.

**Lines 19-28: Modified Animation Loop**
```javascript
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  diamond.rotation.z += 0.008;
  diamond.rotation.x += 0.012;
  
  sphere.position.x = Math.cos(elapsed * 0.6) * 2;
  sphere.position.z = Math.sin(elapsed * 0.6) * 2;
  
  controls.update();
  renderer.render(scene, camera);
}
```
Replace existing animate function. Orbital calculation: `elapsed * 0.6` yields ~10.47 second period (within 8-15s requirement). Radius of 2 units (within 1.5-3 range).

### Phase 4: Mouse Interaction (src/main.js)

**Lines 29-35: Mouse Event Listener**
```javascript
let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  directionalLight.position.x = 5 + mouseX * 3;
  directionalLight.position.z = 7.5 + mouseY * 3;
});
```
Add after window resize listener. Normalized coordinates scaled by 3× for perceptible effect. Base position (5, 10, 7.5) with ±3 unit range.

### Phase 5: Menu Overlay (index.html + src/style.css)

**index.html modification:**
```html
<div id="scene-menu">
  <div>March 19, 2026</div>
  <div>Interactive Scene</div>
  <div>Drag to rotate • Scroll to zoom</div>
</div>
```
Insert inside `<body>` before script tag.

**src/style.css additions:**
```css
#scene-menu {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: #ffffff;
  padding: 12px 16px;
  font-family: monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 4px;
  z-index: 10;
  pointer-events: none;
}

#scene-menu div {
  margin: 2px 0;
}
```
Append to existing stylesheet. `pointer-events: none` prevents interference with OrbitControls.

### Phase 6: Line Count Optimization

**Current projection:** ~85 lines in main.js (excluding blanks/comments)
- Imports: 2 lines
- Scene setup: 8 lines (existing)
- Renderer + shadows: 4 lines
- Camera: 3 lines (existing)
- Lights: 6 lines (modified)
- Objects + shadows: 15 lines (3 objects × 5 lines each)
- Ground plane: 8 lines
- Clock: 1 line
- Mouse tracking: 6 lines
- Animation loop: 14 lines
- Resize handler: 5 lines (existing)
- Controls: 2 lines (existing)
- animate() call: 1 line

**Buffer:** 15 lines remaining for adjustments/debugging.

### Execution Order

1. Modify `src/main.js`: Add shadow configuration to renderer (Phase 1)
2. Modify `src/main.js`: Update DirectionalLight configuration (Phase 1)
3. Modify `src/main.js`: Add `castShadow` to existing objects (Phase 1)
4. Modify `src/main.js`: Create and add ground plane (Phase 2)
5. Modify `src/main.js`: Add Clock and update animate() function (Phase 3)
6. Modify `src/main.js`: Add mousemove listener (Phase 4)
7. Modify `index.html`: Insert menu div (Phase 5)
8. Modify `src/style.css`: Add menu styles (Phase 5)
9. Test in browser: Visual verification and FPS measurement
10. Adjust parameters if needed (light scaling, orbital speed, shadow intensity)

### File Change Summary

| File | Type | Lines Changed |
|------|------|---------------|
| `src/main.js` | Modify | +35 lines, 0 removed |
| `index.html` | Modify | +5 lines |
| `src/style.css` | Modify | +17 lines |
| **Total** | | **57 new lines** |

## Risk Surface

### Implementation Risks

**1. Line Budget Overflow**
- **Risk:** Compact syntax may sacrifice readability or introduce bugs
- **Mitigation:** Use multi-property object literals, avoid unnecessary variables, leverage existing patterns from Orbit 1
- **Fallback:** Remove optional menu text elements (control hints) to save 1-2 lines if needed

**2. Shadow Performance Impact**
- **Risk:** Shadow map generation drops frame rate below 60fps on Intel UHD 620
- **Likelihood:** Low (3 objects + 1 plane is minimal complexity)
- **Mitigation:** 1024×1024 shadow map size (not 2048), PCFSoft filtering (not PCFSoftShadow which is more expensive)
- **Detection:** Manual testing with browser DevTools Performance panel
- **Fallback:** Disable shadows on sphere (least visually important) if FPS drops below 57

**3. Mouse Event Conflict with OrbitControls**
- **Risk:** `mousemove` listener prevents drag rotation
- **Likelihood:** Very Low (different event types)
- **Mitigation:** OrbitControls uses `pointerdown`/`pointermove` with state tracking; passive `mousemove` listener operates independently
- **Verification:** Test drag rotation with menu present

**4. Ground Plane Visibility Issues**
- **Risk:** Plane edges visible or too prominent against dark background
- **Mitigation:** 30×30 size (150% of minimum requirement), very dark material (0x0a0a0f), positioned at y=-3 (below all objects)
- **Adjustment:** If visible, darken further to 0x050508 or reduce size to 25×25

**5. Orbital Motion Consistency Across Frame Rates**
- **Risk:** Sphere speed varies on different hardware (30fps vs 60fps)
- **Mitigation:** Use `clock.getElapsedTime()` for time-based (not frame-based) calculations
- **Verification:** Speed remains constant regardless of frame rate fluctuations

### Visual/UX Risks

**6. Insufficient Shadow Visibility**
- **Risk:** Shadows too faint under default view angle
- **Mitigation:** DirectionalLight positioned at (5, 10, 7.5) casts visible shadows toward camera origin (0, 0, 5 estimated)
- **Adjustment:** If shadows imperceptible, increase light.shadow.camera.near/far or adjust light angle

**7. Mouse Interaction Too Subtle**
- **Risk:** Light shift not noticeable within acceptance criteria (100px mouse movement)
- **Mitigation:** 3× scaling factor on normalized coordinates (+/- 3 units from base position)
- **Verification:** Move cursor 200px and observe light/shadow changes
- **Adjustment:** Increase scaling to 4-5× if effect imperceptible

**8. Menu Readability Against Scene**
- **Risk:** White text insufficient contrast when bright objects rotate behind menu
- **Mitigation:** `rgba(0,0,0,0.7)` background provides 70% opacity barrier, 4px border-radius softens edges
- **Verification:** WCAG contrast ratio test (target ≥4.5:1 for normal text)
- **Adjustment:** Increase background opacity to 0.85 if contrast fails

### Regression Risks

**9. Existing Rotation Animation Disrupted**
- **Risk:** Cube rotation changes accidentally
- **Mitigation:** Leave cube rotation lines untouched (`.x += 0.01; .y += 0.01`)
- **Verification:** Compare pre/post cube rotation speed and axes

**10. Resize Handler Interference**
- **Risk:** New event listeners conflict with existing resize logic
- **Mitigation:** Only `mousemove` listener added; resize handler unchanged
- **Verification:** Test window resize maintains aspect ratio and full viewport coverage

**11. OrbitControls Configuration Override**
- **Risk:** New code inadvertently disables or reconfigures controls
- **Mitigation:** No modifications to controls instance or configuration
- **Verification:** Test all OrbitControls gestures (drag, zoom, pan)

### Performance Edge Cases

**12. High-Frequency Mouse Events**
- **Risk:** Rapid mouse movement creates garbage collection pressure
- **Mitigation:** Reuse `mouseX`/`mouseY` variables (no object allocation per event)
- **Impact:** Negligible (2 float updates per event, <0.1ms)

**13. Shadow Map Resolution on HiDPI Displays**
- **Risk:** 1024×1024 appears pixelated on Retina screens
- **Mitigation:** PCFSoft filtering provides blur to hide aliasing
- **Acceptance:** Slight pixelation acceptable given performance priority
- **Adjustment:** Increase to 2048×2048 only if performance remains >60fps

## Scope Estimate

### Complexity Assessment

**Overall Complexity:** Low-Medium

**Breakdown:**
- Shadow system configuration: **Low** (well-documented Three.js API, 10 lines)
- Ground plane creation: **Low** (standard geometry + material, 8 lines)
- Enhanced animation: **Medium** (trigonometry for orbit, clock integration, 15 lines)
- Mouse interaction: **Low** (coordinate normalization, direct property updates, 6 lines)
- Menu overlay: **Low** (static HTML + CSS, 22 lines across 2 files)

**Constraints Impact:**
- 100-line budget: **Medium difficulty** (requires careful line management)
- No new dependencies: **No impact** (all APIs available in Three.js v0.160.0)
- Performance requirement: **Low risk** (tested patterns, minimal scene complexity)

### Work Phases

**Phase 1: Core Scene Enhancement (60% of effort)**
- Shadow configuration and ground plane
- Estimated time: 20 minutes
- Validation: Shadows visible in browser

**Phase 2: Motion and Interaction (30% of effort)**
- Animation loop modifications and mouse listener
- Estimated time: 15 minutes
- Validation: Coordinated motion, responsive lighting

**Phase 3: Menu and Polish (10% of effort)**
- HTML/CSS overlay implementation
- Estimated time: 5 minutes
- Validation: Menu visible, properly styled

**Total Estimated Time:** 40 minutes of implementation + 20 minutes testing/adjustment = **1 hour**

### Orbit Count

**Single-Orbit Implementation:** This proposal covers all requirements in one cohesive orbit. No sub-orbits required due to:
- Small scope (3 files, <60 new lines)
- No external dependencies or integration points
- All changes contained within existing architecture
- Additive modifications (no refactoring of Orbit 1 code)

### Success Criteria Mapping

| Acceptance Criterion | Implementation Element | Verification Method |
|---------------------|------------------------|---------------------|
| Cube, diamond, sphere independent motion | Separate rotation axes, orbital calculation | Visual inspection |
| Diamond rotation differs by ≥45° from cube | Z+X axes vs X+Y axes (90° difference) | Code review |
| Sphere orbit 8-15s period, 1.5-3 unit radius | `elapsed * 0.6` (10.47s), radius 2 | Timer + measurement |
| 60fps ±5% on Intel UHD 620 | 1024px shadows, efficient loop | DevTools Performance |
| Mouse affects light within 100px movement | 3× scaling on normalized coords | Manual cursor test |
| Light response smooth and proportional | Direct property updates, no easing | Visual inspection |
| Shadows enabled with soft edges | PCFSoftShadowMap, castShadow flags | Visual inspection |
| All objects cast shadows | `castShadow = true` × 3 | Shadow visibility test |
| Ground plane ≥20×20 units | 30×30 PlaneGeometry | Code review |
| Menu present with March 19, 2026 date | HTML div with hardcoded text | Visual inspection |
| Menu <10% viewport coverage | ~80×120px in top-right corner | Pixel measurement |
| Menu contrast ≥4.5:1 | White on rgba(0,0,0,0.7) | WCAG checker tool |
| Code ≤100 lines | Line count script | Automated count |
| No console errors | Browser DevTools Console | Manual check |
| OrbitControls functional | Drag, zoom, pan gestures | Manual interaction |

## Human Modifications

Pending human review.