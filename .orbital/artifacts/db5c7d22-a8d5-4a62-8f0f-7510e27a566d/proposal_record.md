# Proposal Record: Subtle Interaction + Scene Polish (Choreographed Motion)

## Interpreted Intent

This orbit enhances the existing Three.js scene with three coordinated enhancements that make the scene feel alive and responsive:

1. **Choreographed motion**: Each of the three objects (cube, diamond, sphere) moves in a distinct pattern. The cube continues its existing X/Y rotation. The diamond rotates on a different axis combination (Y/Z or Z/X) to create visual variety. The sphere orbits the scene center in a circular path with slight vertical oscillation, taking 10-15 seconds per orbit.

2. **Mouse-responsive lighting**: The directional light subtly shifts position or intensity based on mouse movement across the canvas. This creates a tactile connection between user input and scene state. The effect is smoothed via linear interpolation to avoid jitter and limited in magnitude to remain subtle.

3. **Soft shadow system**: Renderer shadow mapping is enabled with a ground plane receiving shadows from all three objects. Shadows use soft-edge rendering (PCF filtering) and are integrated without performance degradation. The ground plane is dark and minimal to avoid visual distraction.

The user feedback "make the shapes dance" indicates the prior attempt was insufficient. This proposal interprets "dance" as coordinated, rhythmic motion where each shape has a distinct movement pattern that complements rather than competes with the others. The sphere's orbital path and diamond's rotation create a choreographed ensemble with the existing cube rotation.

All enhancements fit within `src/main.js`, maintain the 100-line budget, preserve existing functionality (OrbitControls, resize handling), and require no new dependencies.

## Implementation Plan

### File Modifications

**`src/main.js`** — All changes occur in this single file.

### Implementation Phases

#### Phase 1: Shadow System Setup (Initialization Block)

Add shadow configuration immediately after renderer initialization:

```javascript
// Enable shadow mapping
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows

// Configure directional light for shadow casting
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;

// Enable shadow casting on all objects
cube.castShadow = true;
diamond.castShadow = true;
sphere.castShadow = true;
```

Create ground plane after existing geometry setup:

```javascript
const groundGeometry = new THREE.PlaneGeometry(10, 10);
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x0a0a0f, 
  roughness: 0.8 
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // Horizontal orientation
ground.position.y = -2; // Below object bases
ground.receiveShadow = true;
scene.add(ground);
```

**Line impact:** +18 lines (shadow config + ground plane)

#### Phase 2: Mouse Tracking State (Module Scope)

Add mouse position tracking variables at module scope (after imports, before scene setup):

```javascript
let mouseX = 0;
let mouseY = 0;
let targetLightX = 0;
let targetLightY = 0;
```

Register mouse event listener after resize listener:

```javascript
window.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1; // Normalize to -1 to 1
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1; // Invert Y for Three.js coordinates
});
```

**Line impact:** +6 lines (4 variables + 3-line event handler)

#### Phase 3: Enhanced Animation Loop

Modify the existing `animate()` function to include:

1. **Diamond rotation** (different axes than cube):
```javascript
diamond.rotation.y += 0.015; // Y axis (vertical spin)
diamond.rotation.z += 0.008; // Z axis (depth spin)
```

2. **Sphere orbital motion** (circular path with vertical oscillation):
```javascript
const time = Date.now() * 0.0005; // Time scale for ~12 second orbit
const orbitRadius = 3;
sphere.position.x = Math.cos(time) * orbitRadius;
sphere.position.z = Math.sin(time) * orbitRadius;
sphere.position.y = Math.sin(time * 2) * 0.3; // Vertical oscillation
```

3. **Light position interpolation** (smooth mouse-driven changes):
```javascript
// Calculate target light position based on mouse
targetLightX = mouseX * 2; // Scale to ±2 unit range
targetLightY = mouseY * 2;

// Lerp light position toward target (smooth over ~4 frames)
directionalLight.position.x += (targetLightX - directionalLight.position.x) * 0.05;
directionalLight.position.y += (targetLightY - directionalLight.position.y) * 0.05;
```

**Line impact:** +11 lines (2 diamond + 5 sphere + 4 light)

### Complete Animation Loop Structure

```javascript
function animate() {
  requestAnimationFrame(animate);
  
  // Existing cube rotation (preserved)
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  
  // Diamond rotation (new axes)
  diamond.rotation.y += 0.015;
  diamond.rotation.z += 0.008;
  
  // Sphere orbital motion
  const time = Date.now() * 0.0005;
  const orbitRadius = 3;
  sphere.position.x = Math.cos(time) * orbitRadius;
  sphere.position.z = Math.sin(time) * orbitRadius;
  sphere.position.y = Math.sin(time * 2) * 0.3;
  
  // Mouse-driven light interpolation
  targetLightX = mouseX * 2;
  targetLightY = mouseY * 2;
  directionalLight.position.x += (targetLightX - directionalLight.position.x) * 0.05;
  directionalLight.position.y += (targetLightY - directionalLight.position.y) * 0.05;
  
  controls.update(); // Existing
  renderer.render(scene, camera); // Existing
}
```

### Total Line Budget Analysis

- **Existing codebase**: Estimated ~65 lines (scene setup, objects, lights, controls, resize handler, basic animate loop)
- **Shadow system**: +18 lines
- **Mouse tracking**: +6 lines
- **Animation enhancements**: +11 lines
- **Total**: ~100 lines (within constraint)

### Execution Order

1. Modify initialization block: Add shadow configuration to renderer and light
2. Create ground plane geometry immediately after sphere creation
3. Add mouse tracking variables and event listener
4. Enhance animation loop with diamond rotation, sphere orbital motion, and light interpolation
5. Verify existing cube rotation and OrbitControls remain functional

### Dependencies

- **No new npm packages**: All functionality uses existing Three.js v0.160.0 APIs
- **Browser APIs**: `Date.now()` for time tracking, `mousemove` event
- **Three.js features**: Shadow mapping, standard material shadow properties, plane geometry

### Configuration Values

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Shadow map size | 1024x1024 | Balance between quality and performance; sufficient for small scene |
| Shadow camera bounds | ±10 units | Covers scene with margin; objects positioned within ±4 unit range |
| Ground plane size | 10x10 units | Large enough to catch all shadows without extending beyond view frustum |
| Ground plane color | 0x0a0a0f | Darker than background (0x1a1a2e) for subtle appearance |
| Ground Y position | -2 | Below object bases (assuming objects centered around y=0) |
| Cube rotation speed | 0.01 rad/frame | Preserved from orbit 1 |
| Diamond rotation speed | 0.015 (Y), 0.008 (Z) | Faster than cube but not competing; distinct axes |
| Sphere orbit radius | 3 units | Within acceptance boundary (2-4 units); avoids object collisions |
| Sphere orbit period | ~12 seconds | 0.0005 time scale → 2π / 0.0005 ≈ 12566ms ≈ 12.6 seconds |
| Sphere vertical oscillation | ±0.3 units | Subtle depth variation without dramatic height changes |
| Mouse influence scale | ±2 units | Light shifts noticeably but subtly across canvas |
| Light lerp factor | 0.05 | Smooth over ~4 frames (1 / 0.05 ≈ 20 frames to 95% convergence) |

## Risk Surface

### Performance Risks

**Shadow map rendering overhead**
- **Risk**: Shadow pre-pass adds GPU load, potentially dropping framerate below 60fps on integrated graphics
- **Mitigation**: Use 1024x1024 map size (conservative); PCFSoftShadowMap provides good quality-to-performance ratio; only 4 objects participate in shadow system (3 casters + 1 receiver)
- **Fallback**: If performance issues detected during review, reduce shadow map to 512x512 or disable shadows on smallest object

**Trigonometric calculations per frame**
- **Risk**: `Math.sin()` and `Math.cos()` called 3 times per frame for sphere motion
- **Mitigation**: Modern JavaScript engines optimize math operations heavily; three trig calls are negligible compared to WebGL rendering cost
- **Evidence**: Existing scene already performs matrix operations for cube rotation; adding sphere orbital math has <1% CPU impact

**Light position updates triggering shadow recalculation**
- **Risk**: Moving directional light could force shadow map regeneration every frame
- **Mitigation**: Three.js automatically manages shadow map updates; light position lerp is smooth and gradual, avoiding thrashing
- **Observation**: Shadow camera bounds are static (±10 units); only light position changes, not shadow projection frustum

### Functional Risks

**Sphere orbital path clipping through other objects**
- **Risk**: 3-unit orbital radius may cause sphere to intersect cube or diamond if they're positioned within that radius
- **Mitigation**: Context Package indicates objects have spatial separation from orbit 2; 3-unit radius should exceed object spacing
- **Verification**: Code review must confirm initial object positions; if collision detected, reduce orbit radius to 2.5 units or adjust sphere starting phase

**Mouse tracking interfering with OrbitControls**
- **Risk**: Both systems listen to mouse events; potential for conflict or event capture
- **Mitigation**: OrbitControls listens to `mousedown` and `wheel` events; our handler only reads `mousemove` position without calling `preventDefault()`
- **Test**: Manual verification during review that camera panning/rotating still works while moving mouse

**Light position becoming extreme during rapid mouse movement**
- **Risk**: Fast mouse gestures could accumulate large target offsets before lerp catches up
- **Mitigation**: Target position clamped by mouse normalization (±1 → ±2 units max); lerp factor prevents overshoot
- **Boundary**: Even at extreme corners, light remains within ±2 units, well within scene bounds

**Diamond rotation feeling chaotic instead of choreographed**
- **Risk**: Two-axis rotation (Y+Z) combined with specific speeds could create disorienting spin
- **Mitigation**: Y-axis speed (0.015) is primary; Z-axis speed (0.008) is secondary tumble effect; speeds chosen to avoid resonance with cube (0.01)
- **Tuning**: If motion feels wrong during review, reduce Z-axis speed to 0.005 or eliminate it

### Code Quality Risks

**Exceeding 100-line budget**
- **Risk**: Calculated total (~100 lines) leaves no margin for error
- **Mitigation**: Line count includes comments and formatting; actual implementation can be more compact if needed
- **Flexibility**: Mouse tracking variables can be declared inline within animate loop (saves 2 lines); shadow config can condense multi-line camera bounds into single-line object literal (saves ~5 lines)

**Magic numbers reducing readability**
- **Risk**: Hard-coded values (0.0005, 3, 0.05) lack context
- **Mitigation**: Inline comments added for key constants: `const time = Date.now() * 0.0005; // ~12 second orbit`
- **Alternative**: If line budget allows, extract to named constants: `const ORBIT_SPEED = 0.0005;`

**Mouse event listener accumulation on HMR**
- **Risk**: Vite hot reload may attach duplicate listeners without removing prior ones
- **Mitigation**: Accept as development-only quirk (multiple listeners reading same position have no adverse effect) or add guard: `if (!window.__mouseListenerAttached) { ...listener setup...; window.__mouseListenerAttached = true; }`
- **Impact**: Low priority; does not affect production build

### Shadow-Specific Risks

**Shadow camera frustum not covering full scene**
- **Risk**: If objects move outside ±10 unit bounds, shadows clip
- **Mitigation**: Sphere orbital radius (3 units) + object size (~1 unit) = ~4 unit max extent; 10-unit frustum provides >2x margin
- **Verification**: Visual inspection during review; if clipping observed, expand frustum to ±15 units

**Shadow bias artifacts (acne or peter-panning)**
- **Risk**: Default shadow bias may cause self-shadowing artifacts or shadows detaching from objects
- **Mitigation**: Three.js v0.160.0 has improved default bias values; PCFSoftShadowMap reduces acne naturally
- **Fallback**: If artifacts appear during review, add `directionalLight.shadow.bias = -0.001;` (requires 1 additional line)

**Soft shadows appearing too sharp**
- **Risk**: PCFSoftShadowMap may not provide sufficient blur radius for "soft" aesthetic
- **Mitigation**: 1024x1024 map size with PCF filtering provides reasonable softness; acceptable per intent's visual quality threshold
- **Alternative**: If shadows too sharp during review, increase map size to 2048x2048 (no code change, just value adjustment)

**Ground plane shadow quality on high-DPI displays**
- **Risk**: Fixed 1024x1024 shadow map looks pixelated on 4K or retina screens
- **Mitigation**: Accept as acceptable quality level for minimalist scene; shadow resolution secondary to motion and interaction
- **Enhancement**: If needed, multiply map size by `Math.min(window.devicePixelRatio, 2)` (adds 2 lines)

### Regression Risks

**Existing cube rotation altered**
- **Risk**: Modifications to animate loop could inadvertently change cube behavior
- **Mitigation**: Preserve exact `cube.rotation.x += 0.01; cube.rotation.y += 0.01;` statements; add new rotation logic after existing logic
- **Verification**: Side-by-side visual comparison before/after confirms cube motion unchanged

**OrbitControls update timing**
- **Risk**: Rearranging animate loop could cause controls to update after render instead of before
- **Mitigation**: Maintain `controls.update()` immediately before `renderer.render()` as in existing pattern
- **Test**: Camera damping and smooth transitions should feel identical to pre-orbit behavior

**Window resize handler overwritten**
- **Risk**: Adding new event listeners could accidentally replace existing resize logic
- **Mitigation**: Use `addEventListener()` (additive) not `window.onresize =` (destructive); resize handler remains untouched
- **Verification**: Test window resize behavior during review

**Scene background color changed**
- **Risk**: Ground plane or shadow rendering could affect background appearance
- **Mitigation**: Ground plane is below camera view (y = -2) and darker than background; renderer clear color (0x1a1a2e) not modified
- **Check**: Visual confirmation that dark aesthetic preserved

## Scope Estimate

### Complexity Assessment

**Overall Complexity**: Medium-Low

This orbit combines three independent systems (shadows, mouse interaction, motion choreography) but each system is straightforward in isolation:

- **Shadow system**: Standard Three.js feature; configuration is mechanical
- **Mouse tracking**: Simple event handler + variable updates
- **Motion patterns**: Basic trigonometry and rotation increments

Complexity arises from:
- Integration density (many changes in small codebase)
- Line budget constraint requiring concise implementation
- Need to verify no regressions across multiple systems

### Work Phases

**Phase 1: Shadow System** (30% of effort)
- Configure renderer and light shadow properties
- Create ground plane geometry
- Test shadow rendering and adjust camera frustum if needed
- Estimated: 15-20 lines of code

**Phase 2: Mouse Interaction** (25% of effort)
- Add mouse tracking state variables
- Register event listener with position normalization
- Implement light position lerp in animation loop
- Estimated: 10-15 lines of code

**Phase 3: Motion Choreography** (30% of effort)
- Add diamond rotation on Y/Z axes
- Implement sphere orbital motion with time-based calculation
- Tune rotation speeds and orbital radius for aesthetic harmony
- Estimated: 10-15 lines of code

**Phase 4: Integration & Testing** (15% of effort)
- Verify line count within budget
- Test all three systems simultaneously
- Confirm no regressions (OrbitControls, resize, cube rotation)
- Check performance on target hardware

### Orbit Count

**Single Orbit**: All changes occur in one file with related functionality. Breaking into sub-orbits would create awkward intermediate states (e.g., shadows without motion, motion without mouse interaction).

### Human Review Checkpoints

1. **Initial implementation review**: Verify code fits within 100-line budget and follows established patterns
2. **Visual aesthetic review**: Confirm motion patterns feel choreographed, shadows are subtle, mouse interaction is discoverable
3. **Performance validation**: Test framerate on mid-range hardware; verify 60fps maintained
4. **Regression testing**: Confirm OrbitControls, window resize, and existing cube rotation work correctly
5. **Cross-browser check**: Verify shadow rendering consistent across Chrome, Firefox, Safari

### Estimated Implementation Time

- **AI execution**: <5 minutes (single file modification)
- **Human review**: 10-15 minutes (visual inspection, interaction testing, performance validation)
- **Iteration**: 0-1 cycles (likely complete on first pass given concrete specification)

### Success Criteria Mapping

| Acceptance Boundary | Verification Method |
|---------------------|---------------------|
| Diamond rotates on different axes than cube | Visual inspection: diamond should tumble visibly differently than cube's X/Y spin |
| Sphere orbital period 10-15 seconds | Timed observation: sphere should complete circle in ~12-13 seconds with current config |
| Light responds to mouse position | Interactive test: move mouse corner-to-corner, verify light shift is visible but subtle |
| Shadows are soft-edged | Visual inspection: shadow boundaries should have gradient falloff, not hard pixel edges |
| No framerate drops | Performance monitoring: maintain 60fps during simultaneous motion + OrbitControls manipulation |
| Code under 100 lines | Line count verification: `wc -l src/main.js` should report ≤100 |
| OrbitControls preserved | Functional test: click-drag for rotation, scroll for zoom should work identically to pre-orbit |

## Human Modifications

Pending human review.