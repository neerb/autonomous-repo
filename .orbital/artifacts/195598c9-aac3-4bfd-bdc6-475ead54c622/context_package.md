# Context Package: Add Sphere Geometry to Three.js Scene

## Codebase References

### Primary Modification Surface
- **`src/main.js`** — Contains all scene setup, geometry creation, material assignment, animation loop, and OrbitControls initialization. This is the sole JavaScript file requiring modification.

### Supporting Files (Read-Only)
- **`index.html`** — Entry point that loads `src/main.js` as an ES module. No changes required.
- **`src/style.css`** — Defines full-viewport canvas styling with zero margin/padding. No changes required.
- **`package.json`** — Declares three@^0.160.0 and vite@^5.0.0 dependencies. No changes required.

### Current Scene Structure in `src/main.js`
Based on prior orbit artifacts and project requirements, the file contains:
- Scene initialization with dark background (0x1a1a2e)
- PerspectiveCamera positioned to view center
- WebGLRenderer with resize handling
- Two existing mesh objects: cube (BoxGeometry) and diamond (OctahedronGeometry)
- MeshStandardMaterial applied to both shapes
- AmbientLight and DirectionalLight
- OrbitControls imported from `three/examples/jsm/controls/OrbitControls.js`
- Animation loop using `requestAnimationFrame` with rotation updates

## Architecture Context

### Scene Graph Architecture
The project follows a flat scene hierarchy pattern where all mesh objects are direct children of the root scene. There is no nested group structure or parent-child relationships between geometries.

### Geometry Creation Pattern
Each shape follows this instantiation sequence:
1. Create geometry (e.g., `new THREE.BoxGeometry()`)
2. Create material (MeshStandardMaterial with shared or unique parameters)
3. Create mesh combining geometry + material
4. Add mesh to scene via `scene.add(mesh)`
5. Store mesh reference in a variable for animation loop access

### Animation Loop Structure
The animation loop operates on a per-frame basis:
- `requestAnimationFrame` recursively calls the animate function
- Each mesh has its rotation properties (`.rotation.x`, `.rotation.y`, `.rotation.z`) incremented
- Rotation increments are direct assignments (e.g., `cube.rotation.x += 0.01`)
- OrbitControls.update() is called before rendering
- Renderer.render() executes with scene and camera

### Spatial Coordination System
Shapes are positioned using `.position.set(x, y, z)` in Three.js world coordinates. The camera is positioned to view the origin (0, 0, 0), so shapes must be offset from center to avoid overlapping. Prior orbit 6099821b placed the cube and diamond at distinct X-axis positions to create horizontal separation.

### Rendering Pipeline
- Single WebGLRenderer instance
- Antialiasing enabled for smooth edges
- Pixel ratio set to `window.devicePixelRatio` for high-DPI displays
- Automatic resize listener updates renderer and camera aspect ratio

## Pattern Library

### Geometry Instantiation Pattern
```javascript
const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
const material = new THREE.MeshStandardMaterial({ color: 0xcolor });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(x, y, z);
scene.add(mesh);
```

### Material Configuration Standard
All shapes use `MeshStandardMaterial` with color specified as hexadecimal integers (e.g., `0xff6b6b`). The pattern established in prior orbits suggests each shape may have a distinct color for visual differentiation. Standard material properties respond to the existing AmbientLight and DirectionalLight setup.

### Rotation Animation Pattern
Each mesh is assigned distinct rotation axes in the animation loop:
- Cube: Rotates on X and Y axes
- Diamond: Rotates on different axes (established in orbit 6099821b)
- Sphere: Must use a third unique combination

Rotation increments are small float values (typically 0.01 to 0.03 radians per frame) to create smooth motion at 60fps.

### Naming Convention
Variables follow camelCase naming:
- Geometry objects: `cubeGeometry`, `diamondGeometry`, `sphereGeometry`
- Material objects: `cubeMaterial`, `diamondMaterial`, `sphereMaterial` (or shared `material` if using same material)
- Mesh objects: `cube`, `diamond`, `sphere`

### Line Count Optimization
The codebase prioritizes brevity to maintain sub-100-line count:
- Variable declarations are concise
- No unnecessary comments
- Single-line statements where readable
- Destructuring imports from Three.js modules

## Prior Orbit References

### Orbit 6099821b-a2a2-472a-bf8f-b997405e75e1: Diamond Addition
**Objective:** Added octahedron geometry as second shape to complement the original cube.

**Implementation Approach:**
- Used `THREE.OctahedronGeometry` to create diamond shape
- Positioned diamond offset from cube on X-axis for horizontal separation
- Assigned distinct rotation axes to avoid identical animation
- Maintained line count under 100 by using efficient geometry instantiation

**Key Learnings:**
- Horizontal spatial arrangement (X-axis offset) successfully maintains visibility of both shapes
- Distinct rotation axes (cube uses X+Y, diamond likely uses Y+Z or X+Z) creates visual interest
- MeshStandardMaterial works consistently across different geometry types
- No performance degradation observed with two animated shapes

**Patterns to Replicate:**
- Position sphere at a third distinct X-axis coordinate to continue horizontal arrangement
- Select rotation axes not yet used (if cube is X+Y and diamond is Y+Z, sphere could be X+Z or Z-only)
- Maintain consistent material instantiation pattern

### Initial Orbit: Project Bootstrap
**Established Constraints:**
- 100-line JavaScript budget (currently close to limit after two shapes)
- Dark background color 0x1a1a2e
- Full-viewport canvas with zero margin/padding
- Camera positioned at (0, 0, 5) looking at origin

**Architecture Decisions:**
- Vite build system for fast dev server and ES module support
- OrbitControls for interactive camera manipulation
- Standard lighting setup (ambient + directional) sufficient for MeshStandardMaterial

## Risk Assessment

### Line Count Budget Exhaustion
**Risk Level:** High  
**Description:** Adding a third shape may push total line count over 100 lines in `src/main.js`, violating a hard constraint.  
**Mitigation:**
- Use maximally concise syntax (single-line geometry + material + mesh creation where possible)
- Share material instance across shapes if colors can be the same (reduces 3 lines to 1)
- Avoid adding comments or whitespace
- Validate line count before committing changes

### Spatial Occlusion
**Risk Level:** Medium  
**Description:** Poor positioning could cause shapes to overlap in the default camera view, making one or more invisible or partially obscured.  
**Mitigation:**
- Position sphere at sufficient X-axis offset from cube and diamond (continue horizontal arrangement pattern)
- Test visibility from default camera position (0, 0, 5) looking at (0, 0, 0)
- Ensure sphere radius (target 0.8-1.2 units) doesn't create disproportionate size relative to cube and diamond

### Performance Degradation
**Risk Level:** Low  
**Description:** Adding a third animated shape could reduce frame rate below 60fps on standard hardware.  
**Mitigation:**
- SphereGeometry segment counts should be moderate (32 width/height segments is standard)
- Avoid excessive polygon counts (higher segment counts increase GPU load)
- Three.js efficiently handles 3-4 simple shapes with standard materials
- Test on target hardware (modern browser with WebGL support)

### Animation Axis Collision
**Risk Level:** Low  
**Description:** If sphere uses the same rotation axes as cube or diamond, visual variety is reduced and acceptance criteria for "distinct rotation axes" fails.  
**Mitigation:**
- Document which axes cube and diamond currently use (requires inspection of `src/main.js`)
- Select a third unique combination from available options: X+Y, X+Z, Y+Z, X-only, Y-only, Z-only
- Ensure rotation speed (increment value) differs slightly for additional visual variety

### Material Property Consistency
**Risk Level:** Low  
**Description:** If sphere material properties don't match the MeshStandardMaterial pattern, visual coherence is lost or rendering issues occur.  
**Mitigation:**
- Use identical MeshStandardMaterial constructor pattern as cube and diamond
- If target acceptance includes distinct color, choose a third color value that complements existing palette
- Avoid introducing metalness, roughness, or other advanced properties not used in existing shapes

### OrbitControls Interaction Conflicts
**Risk Level:** Very Low  
**Description:** Adding a third shape should not affect OrbitControls functionality, but unforeseen interactions could occur.  
**Mitigation:**
- No changes required to OrbitControls configuration
- Sphere is a passive mesh object like cube and diamond
- OrbitControls operates on camera, not individual meshes

### Regression of Existing Shapes
**Risk Level:** Very Low  
**Description:** Code changes to add sphere could accidentally modify cube or diamond behavior.  
**Mitigation:**
- Only additive changes required (no modifications to existing geometry or animation code)
- Maintain existing variable names and references
- Verify cube and diamond rotation behavior unchanged after implementation