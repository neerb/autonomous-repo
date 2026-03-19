# Add Sphere Geometry to Three.js Scene

## Desired Outcome

The Three.js scene will display three distinct 3D shapes rotating simultaneously: the existing cube, the existing diamond (octahedron), and a new sphere. All three shapes will be visible in the viewport, visually distinguishable from each other, and will maintain independent rotation animations. The user will be able to interact with all three shapes using the existing OrbitControls, experiencing a richer visual demonstration of Three.js geometry types.

## Constraints

- **No Framework Dependencies**: Maintain vanilla JavaScript implementation with Vite — no React, Vue, or other framework additions
- **No TypeScript**: All code must remain in plain JavaScript
- **Line Count Budget**: Total JavaScript code must stay under 100 lines in `src/main.js`
- **Existing Scene Preservation**: The current cube and diamond (octahedron) must remain unchanged in appearance, position, and animation behavior
- **Consistent Material System**: The sphere must use MeshStandardMaterial matching the existing shape materials
- **Existing Lighting**: No changes to the current AmbientLight and DirectionalLight setup
- **Existing Controls**: OrbitControls behavior must remain unchanged
- **Performance**: Maintain smooth 60fps animation on standard hardware with three shapes rendering
- **Viewport Layout**: All three shapes must be visible simultaneously in the default camera view without requiring user interaction

## Acceptance Boundaries

**Minimal Acceptance:**
- A sphere geometry is added to the scene using `THREE.SphereGeometry`
- The sphere renders with MeshStandardMaterial
- The sphere has its own rotation animation (distinct rotation axes from cube and diamond)
- All three shapes are visible in the initial camera view
- No performance degradation (maintains 60fps)
- Total line count remains under 100 lines in `src/main.js`

**Target Acceptance:**
- Sphere is positioned to form a balanced composition with cube and diamond
- Sphere has visually appropriate dimensions (radius between 0.8 and 1.2 units)
- Sphere rotation uses different axes than the cube and diamond for visual variety
- Shapes are spatially arranged so none fully occludes another in the default view
- Code maintains existing readability and structure patterns

**Exceptional Acceptance:**
- Shapes are arranged in a geometric pattern (e.g., triangle formation, linear sequence)
- Sphere has distinct material properties (different color or metalness/roughness values) for visual distinction
- Animation timing creates a visually pleasing coordinated motion between all three shapes
- Spatial arrangement demonstrates depth perception through overlapping but distinguishable placement

**Unacceptable Outcomes:**
- Sphere is not visible in the default camera view
- Frame rate drops below 55fps with three shapes
- Existing cube or diamond behavior changes
- Line count exceeds 100 lines
- TypeScript or framework dependencies are introduced
- Code structure becomes significantly less maintainable

## Trust Tier Assignment

**Tier 2: Supervised**

**Rationale:**
This orbit operates within a well-established codebase with clear patterns and minimal architectural risk. The change is additive (adding a third shape) with no modifications to existing geometry or scene infrastructure. However, Tier 2 supervision is warranted due to:

1. **Spatial Coordination Complexity**: Positioning three shapes to be simultaneously visible and aesthetically balanced requires geometric reasoning that could result in poor composition if automated without review
2. **Line Count Constraint**: The 100-line budget is a hard constraint that requires careful validation — automated code generation could exceed this limit through verbose implementations
3. **Visual Quality Judgment**: "Visually distinguishable" and "balanced composition" require subjective human evaluation that automated testing cannot fully capture
4. **Animation Harmony**: Coordinating three independent rotation animations to create pleasing motion requires aesthetic judgment

The technical risk is low (adding a sphere geometry is straightforward), but the aesthetic and compositional aspects benefit from human verification before merge. A Tier 3 (Gated) assignment would be excessive given the low blast radius and reversible nature of the change.

## Dependencies

- **Prior Orbit**: Orbit 6099821b-a2a2-472a-bf8f-b997405e75e1 (diamond/octahedron addition) — This orbit extends that work by adding the third shape requested in the re-orbit
- **Existing Scene Structure**: Depends on the current scene graph in `src/main.js` including camera setup, lighting, and animation loop
- **Three.js Library**: Requires `THREE.SphereGeometry` API from the installed three@^0.160.0 package
- **Material System**: Depends on existing MeshStandardMaterial implementation pattern used for cube and diamond
- **Animation Loop**: Depends on the existing `requestAnimationFrame` loop structure to integrate sphere rotation