# Proposal Record: Subtle Interaction + Scene Polish

## Interpreted Intent

The intent requests enhancement of the existing Three.js scene to create a more dynamic, interactive experience through three primary mechanisms:

1. **Ambient motion**: Introduce continuous, slow animations to the diamond (Z-axis rotation distinct from cube's X/Y rotation) and sphere (circular orbit around scene center with 3–5 unit radius completing in 12–15 seconds)

2. **Mouse-responsive lighting**: Implement a mousemove event handler that shifts the directional light's target position based on normalized cursor coordinates, creating the perception that lighting follows viewer attention without aggressive spotlight behavior

3. **Shadow rendering**: Enable Three.js shadow mapping with soft shadows (PCFSoftShadowMap), configure all three objects (cube, diamond, sphere) to cast shadows, and add a dark ground plane positioned below the scene to receive shadows

The implementation must preserve the existing 100-line JavaScript constraint in `src/main.js`, maintain OrbitControls functionality without interference, keep the dark aesthetic (0x1a1a2e background with complementary ground plane color ~0x0a0a0f), and achieve 60fps performance on mid-range hardware.

**Critical understanding**: This is not about adding visual complexity but about making the existing minimalist scene feel alive through motion, light reactivity, and spatial grounding via shadows. The line budget constraint requires aggressive code economy while maintaining readability. The Trust Tier 2 assignment acknowledges that shadow configuration, mouse handler integration with OrbitControls, and orbital motion calculations have multiple implementation paths with quality/performance tradeoffs that benefit from human oversight.

## Implementation Plan

### Phase 1: Shadow System Configuration (Lines Budget: ~10 lines)

**File**: `src/main.js`

**Modifications to renderer initialization block** (immediately after renderer creation):
```javascript
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

**Modifications to directional light setup** (after `directionalLight.position.set()`):
```javascript
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
```

**Rationale**: Shadow camera frustum bounds of ±10 units encompass the scene assuming objects are positioned within ±3 units of origin. Near/far planes (0.5–50) provide margin without excessive depth range. 1024×1024 resolution balances quality and performance per Intent target.

**Modifications to existing mesh objects** (after each mesh creation):
```javascript
cube.castShadow = true;
diamond.castShadow = true;
sphere.castShadow = true;
```

### Phase 2: Ground Plane Geometry (Lines Budget: ~5 lines)

**File**: `src/main.js`

**New geometry creation block** (after sphere creation, before animation loop):
```javascript
const groundPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 1 })
);
groundPlane.rotation.x = -Math.PI / 2;
groundPlane.position.y = -2;
groundPlane.receiveShadow = true;
scene.add(groundPlane);
```

**Rationale**: 20×20 unit plane catches shadows from objects within ±10 units. Position at y=-2 places it below objects (assuming object positions are y=0 or higher). Color 0x0a0a0f is very dark, maintaining aesthetic per Intent. Roughness=1 eliminates specular highlights. Rotation by -π/2 radians orients plane horizontally.

### Phase 3: Orbital Motion Implementation (Lines Budget: ~4 lines)

**File**: `src/main.js`

**Modifications to animation loop** (inside `animate()` function, after existing cube rotation):

Assuming existing pattern:
```javascript
const elapsedTime = clock.getElapsedTime();
cube.rotation.x = elapsedTime * 0.5;
cube.rotation.y = elapsedTime * 0.3;
```

**Add**:
```javascript
diamond.rotation.z = elapsedTime * 0.2;
sphere.position.x = Math.cos(elapsedTime * 0.4) * 4;
sphere.position.z = Math.sin(elapsedTime * 0.4) * 4;
```

**Rationale**: 
- Diamond Z-axis rotation at 0.2 rad/s is slower than cube (0.5/0.3 rad/s on X/Y), creating distinct motion per Intent
- Sphere orbit uses radius of 4 units (within 3–5 target range) and angular velocity of 0.4 rad/s, completing full orbit in ~15.7 seconds (2π/0.4), meeting 12–15 second target
- Circular path using cos/sin maintains constant radius without drift
- No Y-axis variation (stretch goal) to conserve lines

### Phase 4: Mouse Interaction Handler (Lines Budget: ~6 lines)

**File**: `src/main.js`

**Global state variable** (at top of file, after imports):
```javascript
const mouse = { x: 0, y: 0 };
```

**Event listener registration** (after window resize handler setup):
```javascript
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});
```

**Modifications to animation loop** (after object animations, before controls.update()):
```javascript
directionalLight.position.x = 5 + mouse.x * 3;
directionalLight.position.z = 5 + mouse.y * 3;
```

**Rationale**:
- Normalized mouse coordinates ([-1, 1] range) provide consistent scaling across viewport sizes
- Using `mousemove` instead of `pointermove` avoids potential conflict with OrbitControls pointer event listeners
- Modifying light position (not target) creates a "following" effect—light maintains directionality toward scene center but shifts source angle
- Multiplier of 3 units provides perceptible shift without extreme movement (light moves within ±3 units of base position 5, 5, 5)
- No `preventDefault()` call preserves OrbitControls drag functionality

### Phase 5: Line Budget Verification

**Current estimate**: 
- Shadow config: 10 lines (renderer + light + object flags)
- Ground plane: 5 lines
- Orbital motion: 4 lines (diamond + sphere x/z)
- Mouse handler: 6 lines (global state + listener + light position update)
- **Total new code**: 25 lines

**Action required**: Before implementation, retrieve current `src/main.js` and count existing lines. If current + 25 > 100, apply compression strategies:

1. Combine shadow camera bounds into single multi-line statement with property shorthand
2. Inline ground plane material properties without intermediate variables
3. Consolidate object `castShadow` flags: `[cube, diamond, sphere].forEach(m => m.castShadow = true)`
4. Merge mouse coordinate calculations into single expression

**Priority order if cuts needed** (per Intent minimum acceptability):
1. Shadows (non-negotiable for acceptance)
2. Sphere orbit (minimum acceptable motion)
3. Mouse interaction (minimum acceptable reactivity)
4. Diamond rotation (minimum acceptable, but smallest impact)

### File Modification Summary

| File | Modification Type | Lines Changed | Risk Level |
|------|------------------|---------------|------------|
| `src/main.js` | Extension | +25 (estimated) | Medium |
| `index.html` | None | 0 | None |
| `src/style.css` | None | 0 | None |
| `package.json` | None | 0 | None |

### Execution Order

1. **Shadow configuration first**: Enables visual debugging of subsequent geometry additions (ground plane visibility confirms shadow setup works)
2. **Ground plane second**: Provides shadow receiver before motion creates dynamic shadows
3. **Motion third**: Orbital and rotational animations functional independently of mouse interaction
4. **Mouse handler last**: Non-breaking addition—if it introduces issues, can be removed without affecting other features

## Risk Surface

### Risk: Line Budget Overrun

**Trigger conditions**: Current `src/main.js` exceeds 75 lines, leaving insufficient margin for 25-line addition.

**Impact**: Constraint violation requires either cutting features or aggressive code compression that reduces maintainability.

**Mitigation strategy**:
- Pre-implementation line count audit mandatory
- Compression techniques ready: method chaining, forEach for repeated operations, eliminated whitespace
- Feature priority defined (shadows > sphere orbit > mouse > diamond rotation)
- If budget requires cuts, document removed features in commit message for future restoration

**Detection**: Automated line count in verification protocol must flag any file exceeding 100 lines.

### Risk: Mouse Handler Interferes with OrbitControls

**Trigger conditions**: Mouse move event listener captures events during OrbitControls drag, causing light position jitter or control sluggishness.

**Impact**: Degraded UX violates constraint to preserve OrbitControls functionality.

**Mitigation strategy**:
- Use `mousemove` event (not `pointermove` which OrbitControls uses)
- No `preventDefault()` or `stopPropagation()` in handler
- Light position modification is non-modal (doesn't block control updates)
- Testing protocol includes drag-rotate camera while observing light behavior

**Detection**: Manual test—rotate camera with OrbitControls during mouse movement. Controls should feel unchanged; light shifts should not correlate with drag velocity.

**Fallback**: If conflict detected, add button state check: `if (e.buttons === 0) { /* update light */ }` to only respond when no mouse buttons pressed (adds 1 line to budget).

### Risk: Shadow Performance Below 60fps

**Trigger conditions**: Three shadow-casting objects with 1024×1024 shadow map on mid-range hardware causes frame drops.

**Impact**: Violates performance budget constraint, makes scene unsuitable for production use.

**Mitigation strategy**:
- 1024×1024 resolution is conservative (lower than 2048×2048 high-quality standard)
- PCFSoftShadowMap more expensive than BasicShadowMap but provides required softness
- Tight shadow camera frustum (±10 units) minimizes rendered area
- Single directional light (not multiple shadow-casting lights)

**Detection**: 
- Browser DevTools Performance profiler during animation
- CPU throttling (4x slowdown) simulates mid-range hardware
- Monitor frame time—must remain <16.67ms (60fps threshold)

**Fallback options** (in priority order):
1. Reduce shadow map resolution to 512×512 (acceptable per Intent minimum, adds no lines)
2. Switch to BasicShadowMap (harder shadows but faster, change 1 line)
3. Disable sphere `castShadow` (least visual impact as it's moving, saves 0 lines but reduces workload)

### Risk: Ground Plane Visibility Issues

**Trigger conditions**: Plane positioned incorrectly (too far below, outside camera frustum) or color too bright (clashes with 0x1a1a2e background).

**Impact**: Shadows invisible or aesthetic disrupted.

**Mitigation strategy**:
- Position y=-2 tested against camera position (0, 0, 5) and default OrbitControls target (scene center)
- 20×20 size large enough to catch shadows from objects within ±10 units
- Color 0x0a0a0f extremely dark (RGB 10, 10, 15 vs background 26, 26, 46)
- Roughness=1 eliminates bright specular reflections

**Detection**: Visual inspection—ground plane should be subtly visible below objects, not dominating frame. Shadows should appear dark gray, not black (indicates plane is receiving light).

**Fallback**: If plane invisible, adjust position upward to y=-1.5. If too bright, darken to 0x050505 (no line budget impact, single hex value change).

### Risk: Sphere Orbit Appears Mechanical

**Trigger conditions**: Perfect circular orbit at constant speed feels artificial compared to organic motion.

**Impact**: Aesthetic concern—scene feels computational rather than alive (Intent goal violated).

**Mitigation strategy**:
- Chosen parameters (4-unit radius, 0.4 rad/s speed) create slow, hypnotic motion per Intent description
- Pure circular path is mathematically stable—no accumulated error or drift
- Y-axis variation (elliptical path) deferred to stretch goal due to line budget

**Detection**: Subjective assessment during review—does sphere motion feel natural or robotic?

**Fallback**: If mechanical feel detected and lines available, add Y-axis sine wave: `sphere.position.y = Math.sin(elapsedTime * 0.4) * 0.5` (+1 line).

### Risk: Shadow Artifacts (Acne, Peter Panning, Aliasing)

**Trigger conditions**: Shadow bias not set, shadow camera near/far planes incorrect, or resolution insufficient for ground plane size.

**Impact**: Visual quality degradation—shadows appear detached, pixelated, or have dark speckles.

**Mitigation strategy**:
- Default shadow bias often sufficient for flat surfaces (ground plane)
- Near=0.5, far=50 encompasses all scene geometry with margin
- 1024×1024 resolution provides ~51 pixels per unit on 20×20 plane (acceptable for soft shadows)

**Detection**: Visual inspection at multiple camera angles—shadows should be contiguous with object bases, edges smooth (within PCF filter expectations), no surface speckles.

**Fallback**: Add `directionalLight.shadow.bias = -0.001` if acne appears (+1 line). Adjust near/far planes if shadows clipped (0 additional lines, value changes only).

### Risk: Code Readability Loss Under Compression

**Trigger conditions**: Line budget forces multi-statement lines, abbreviated variables, or removed whitespace.

**Impact**: Future modifications harder, violates Intent target for readable code.

**Mitigation strategy**:
- Compress only if necessary (after line count audit reveals budget shortage)
- Preserve descriptive variable names (`groundPlane` not `gp`)
- Use semantic grouping (related operations on same line, e.g., `mapSize.set(1024, 1024)`)
- Avoid clever tricks that require comments to explain

**Detection**: Code review—can a senior engineer understand modifications without asking questions?

**Acceptance**: 100-line constraint inherently limits verbosity. Some compression acceptable if logic remains clear.

## Scope Estimate

### Complexity Assessment: **Low-Medium**

**Reasoning**:
- Shadow system is built-in Three.js feature with well-documented API—no custom shader code
- Orbital motion uses elementary trigonometry (sin/cos)—no physics simulation
- Mouse interaction is simple coordinate normalization and vector addition
- No new dependencies, external APIs, or data structures
- Primary complexity is line budget management, not algorithmic challenge

**Comparison to prior orbits**:
- **Orbit 1** (Initial scene): High complexity (new project setup, dependency configuration, build tooling)
- **Orbit 2** (Multi-geometry): Low complexity (duplicate existing geometry pattern twice)
- **This orbit**: Medium complexity (shadow configuration has more parameters than geometry creation, but still follows established Three.js patterns)

### Work Breakdown

| Phase | Tasks | Estimated Lines | Risk Level |
|-------|-------|----------------|------------|
| Setup Audit | Count current lines in `src/main.js`, verify object references exist | 0 | Low |
| Shadow Config | Renderer flags, light shadow properties, object cast/receive flags | 10 | Medium |
| Ground Plane | Geometry creation, material, positioning, scene addition | 5 | Low |
| Motion | Diamond Z rotation, sphere orbit calculations | 4 | Low |
| Mouse Handler | Global state, event listener, light position update | 6 | Medium |
| Verification | Visual inspection, performance profiling, OrbitControls test | 0 | Low |
| **Total** | | **25 new lines** | |

### Orbit Count: **1 orbit** (this proposal)

**Justification**: All features are tightly coupled and must be implemented together to achieve the Intent's "tactile and alive" outcome. Splitting into sub-orbits (e.g., shadows in one, motion in another) would:
- Require intermediate verification states that don't meet acceptance criteria
- Add overhead of multiple artifact generation cycles
- Risk version drift if repository changes between orbits

**Dependencies**: No blocking dependencies. All changes self-contained within `src/main.js`.

### Time Estimate

**Implementation**: 30–45 minutes
- 10 min: Line audit and compression planning if needed
- 20 min: Code modifications following this proposal
- 10 min: Local testing with Vite dev server
- 5 min: Commit and push changes

**Verification**: 15–20 minutes (documented in Verification Protocol)
- Visual inspection across browser viewports
- Performance profiling with CPU throttling
- OrbitControls interaction testing
- Line count validation

**Total**: ~60 minutes assuming no issues. Budget 90 minutes if compression or debugging required.

## Human Modifications

Pending human review.