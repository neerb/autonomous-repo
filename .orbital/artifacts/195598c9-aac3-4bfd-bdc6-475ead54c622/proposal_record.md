# Proposal Record: Add Sphere Geometry to Three.js Scene

## Interpreted Intent

This orbit adds a third geometric shape (sphere) to the existing Three.js scene, which currently contains a rotating cube and diamond (octahedron). The sphere must be immediately visible alongside the existing shapes without requiring user camera manipulation, maintain its own distinct rotation animation, and integrate seamlessly into the established codebase patterns. The implementation must preserve the sub-100-line JavaScript constraint while maintaining 60fps performance. The user's experience should evolve from viewing two shapes to viewing three shapes with varied geometries and coordinated animations, demonstrating Three.js's geometry diversity.

## Implementation Plan

### File Modifications

**`src/main.js` (Single Modification Surface)**

The implementation requires adding sphere-specific code to the existing scene setup structure. Based on the Context Package's analysis of prior orbit 6099821b, the current file structure follows this pattern:

1. Three.js imports
2. Scene, camera, renderer initialization
3. Lighting setup (ambient + directional)
4. Geometry 1: Cube creation and positioning
5. Geometry 2: Diamond creation and positioning
6. OrbitControls initialization
7. Window resize handler
8. Animation loop with rotation updates

**Insertion Points:**

- **After diamond geometry creation (line ~35-40 estimated):** Insert sphere geometry, material, mesh creation, and scene addition
- **Inside animation loop (line ~60-65 estimated):** Insert sphere rotation update

### Implementation Sequence

#### Phase 1: Sphere Geometry Creation
```javascript
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
);
sphere.position.set(3, 0, 0);
scene.add(sphere);
```

**Technical Decisions:**
- **Radius:** 1.0 unit (within target 0.8-1.2 range, matches cube edge length for visual consistency)
- **Segments:** 32 width × 32 height (standard resolution, balances smoothness with performance)
- **Color:** 0x4ecdc4 (teal/cyan) — complements existing color palette while remaining visually distinct
- **Position:** (3, 0, 0) — continues horizontal X-axis arrangement pattern established in orbit 6099821b

**Spatial Reasoning:**
Assuming cube is at (-3, 0, 0) and diamond is at (0, 0, 0) based on prior orbit patterns, positioning the sphere at (3, 0, 0) creates a linear horizontal arrangement with 3-unit spacing. From camera position (0, 0, 5), all three shapes will be visible in a balanced row formation.

#### Phase 2: Animation Integration
```javascript
sphere.rotation.x += 0.015;
sphere.rotation.z += 0.015;
```

**Rotation Axis Selection:**
- **Cube:** X + Y axes (established in initial orbit)
- **Diamond:** Y + Z axes (inferred from orbit 6099821b pattern of avoiding axis overlap)
- **Sphere:** X + Z axes (third unique combination, creates visual variety)

**Rotation Speed:** 0.015 radians/frame (slightly different from cube's typical 0.01, creates subtle variation in motion timing)

### Line Count Budget Analysis

**Current Estimated Line Count:** ~75 lines (based on standard implementation of scene + 2 shapes + controls)

**New Code Addition:**
- Sphere geometry/material/mesh: 4 lines (condensed into single multi-line statement)
- Sphere positioning and scene addition: 2 lines (inline with mesh creation)
- Animation rotation updates: 2 lines

**Total Added Lines:** 8 lines (conservative estimate)

**Projected Total:** 83 lines (16 lines under 100-line constraint)

**Optimization Strategy:**
- Use inline geometry/material creation within Mesh constructor (saves 2 variable declarations)
- Chain position.set() with scene.add() on same logical line if needed
- No comments or whitespace added

### Dependency Management

**No New Dependencies Required:**
- `THREE.SphereGeometry` is part of core Three.js library (already installed at ^0.160.0)
- No additional imports or package installations needed
- All Three.js APIs used are stable and available in version 0.160.0

### Testing Approach

**Manual Verification Steps:**
1. Run `npm run dev` and load http://localhost:5173
2. Verify all three shapes visible in initial view without camera interaction
3. Confirm sphere has smooth surface rendering (32 segments should eliminate faceting)
4. Observe rotation on X+Z axes (distinct from cube and diamond)
5. Test OrbitControls interaction (left-drag, right-drag, scroll)
6. Verify 60fps in browser DevTools performance monitor
7. Count lines in `src/main.js` to confirm <100 constraint

**Performance Baseline:**
- Current scene with 2 shapes: ~60fps
- SphereGeometry (32×32 segments) adds ~2048 triangles
- Expected performance: 60fps maintained (Three.js handles 3-4 standard geometries efficiently on modern hardware)

## Risk Surface

### Line Count Constraint Violation
**Risk Level:** Medium  
**Probability:** 20%  
**Impact:** High (hard constraint violation, unacceptable outcome)

**Mitigation:**
- Pre-implementation line count at ~75 leaves 16-line buffer
- Sphere addition requires minimum 6 lines (geometry, material, mesh, position, scene.add, 2× animation)
- Use maximally concise syntax: inline constructors, chain method calls
- Validation: Count lines immediately after implementation, before commit

**Contingency:**
If line count exceeds 100:
- Combine variable declarations using destructuring or comma operators
- Inline position.set() calls within mesh creation
- Remove any non-essential whitespace or formatting

### Spatial Composition Issues
**Risk Level:** Medium  
**Probability:** 15%  
**Impact:** Medium (fails target acceptance for "balanced composition")

**Specific Scenarios:**
- Sphere radius too large: Dominates scene, obscures other shapes
- X-axis position incorrect: Sphere outside camera frustum or overlapping diamond
- Depth ordering confusion: Shapes at same Z-depth create visual flatness

**Mitigation:**
- Radius 1.0 unit matches cube dimensions (cube likely uses size 2.0, giving 1.0 half-extents)
- Position (3, 0, 0) maintains 3-unit spacing pattern
- All shapes at Z=0 is acceptable (camera at Z=5 provides clear separation)
- Visual test from camera position (0, 0, 5) confirms all shapes visible

**Contingency:**
If sphere not visible or poorly positioned:
- Adjust X position: Try (2.5, 0, 0) or (3.5, 0, 0)
- Adjust radius: Try 0.8 (minimal) or 1.2 (maximal target range)
- Add slight Z-offset: (3, 0, -0.5) creates depth variety

### Animation Axis Collision
**Risk Level:** Low  
**Probability:** 10%  
**Impact:** Low (fails target acceptance for "distinct rotation axes")

**Collision Scenario:**
If diamond already uses X+Z axes (unknown without inspecting current `src/main.js`), sphere's X+Z rotation would be identical.

**Mitigation:**
- Pre-implementation inspection: Review current animation loop to document cube and diamond rotation axes
- Backup axis combinations available: Y+Z (if diamond doesn't use), Z-only, Y-only
- Selected X+Z is statistically unlikely to collide (6 possible 2-axis combinations)

**Contingency:**
If X+Z is already used:
- Switch to Y+Z axes
- Switch to single-axis rotation (Z-only) for maximum distinction

### Performance Degradation
**Risk Level:** Low  
**Probability:** 5%  
**Impact:** Medium (unacceptable outcome if FPS drops below 55)

**Performance Factors:**
- SphereGeometry (32×32): ~2048 triangles (moderate polygon count)
- Three animated meshes: Minimal CPU overhead
- MeshStandardMaterial: Shader compilation cached after first two shapes

**Mitigation:**
- 32-segment sphere is industry standard (not excessive)
- WebGLRenderer with antialiasing handles 3-4 shapes efficiently
- No shadows or advanced rendering features enabled
- Modern browsers with WebGL 2.0 support target hardware

**Contingency:**
If FPS drops below 55:
- Reduce sphere segments to 24×24 (~1152 triangles)
- Reduce sphere segments to 16×16 (~512 triangles, minimum smooth appearance)
- Profile GPU usage in DevTools to identify bottleneck

### Existing Shape Regression
**Risk Level:** Very Low  
**Probability:** 5%  
**Impact:** High (unacceptable outcome if cube or diamond behavior changes)

**Regression Vectors:**
- Accidental modification of existing mesh variables
- Incorrect insertion point breaks animation loop logic
- Typo in variable name references existing shape

**Mitigation:**
- Implementation is purely additive (no edits to existing geometry code)
- New variable name `sphere` does not conflict with `cube` or `diamond`
- Animation loop additions are independent rotation updates
- Code review before commit verifies no changes to existing lines

**Contingency:**
If regression detected:
- Revert to prior commit
- Re-implement with explicit variable scoping
- Add defensive checks (verify cube/diamond references unchanged)

### Material Inconsistency
**Risk Level:** Very Low  
**Probability:** 3%  
**Impact:** Low (fails target acceptance for "consistent material system")

**Inconsistency Scenarios:**
- Wrong material type used (e.g., MeshBasicMaterial instead of MeshStandardMaterial)
- Missing color property (renders black)
- Additional material properties (metalness, roughness) not used in existing shapes

**Mitigation:**
- Exact pattern replication: `new THREE.MeshStandardMaterial({ color: 0xcolor })`
- Color value 0x4ecdc4 is valid hexadecimal format
- No additional properties specified (matches existing pattern)

**Contingency:**
If material renders incorrectly:
- Verify MeshStandardMaterial constructor syntax
- Confirm color value format (0x prefix required)
- Match exact material properties from cube/diamond

## Scope Estimate

### Complexity Assessment
**Overall Complexity:** Low

**Complexity Factors:**
- **Technical Implementation:** Trivial (adding one geometry using established pattern)
- **Spatial Reasoning:** Moderate (requires geometric understanding of 3D positioning)
- **Aesthetic Judgment:** Moderate (rotation axes and color selection subjective)
- **Integration Risk:** Low (purely additive change with no architectural modifications)

### Work Breakdown

| Phase | Tasks | Estimated Effort | Risk Level |
|-------|-------|-----------------|------------|
| **Implementation** | Add sphere geometry, material, mesh, positioning code | 10 minutes | Low |
| **Animation Integration** | Add rotation updates to animation loop | 5 minutes | Low |
| **Visual Testing** | Load in browser, verify visibility and composition | 10 minutes | Medium |
| **Performance Validation** | Measure FPS, verify 60fps maintained | 5 minutes | Low |
| **Line Count Verification** | Count lines in `src/main.js`, confirm <100 | 2 minutes | Medium |
| **Code Review** | Verify no regressions, check patterns consistency | 8 minutes | Low |
| **Total** | - | **40 minutes** | **Low** |

### Orbit Count Estimate
**Single Orbit:** This proposal represents one complete orbit with no sub-orbits required.

**Justification:**
- All changes confined to single file (`src/main.js`)
- No architectural modifications or infrastructure changes
- No external dependencies or configuration updates
- Implementation follows established patterns with no innovation required

### Confidence Level
**High Confidence (90%):** The implementation is straightforward with well-understood APIs and clear patterns from prior orbits. The primary uncertainties are aesthetic (spatial composition quality) and the line count constraint, both of which have clear mitigations.

**Low Confidence Factors:**
- Exact line count of current `src/main.js` unknown (estimated at ~75)
- Current rotation axes for cube/diamond not confirmed (assumes X+Y and Y+Z)
- Visual composition quality subjective (requires human review per Tier 2 assignment)

## Human Modifications

Pending human review.