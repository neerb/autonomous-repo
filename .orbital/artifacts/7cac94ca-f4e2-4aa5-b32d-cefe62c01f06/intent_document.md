# Subtle Interaction + Scene Polish with Date Display

## Desired Outcome

The existing Three.js scene evolves from a static demonstration into a living, reactive environment that responds to user presence while maintaining its minimalist aesthetic. When complete, the viewport will display three geometries in continuous, differentiated motion — a rotating cube, a spinning diamond, and an orbiting sphere — all casting soft shadows onto a subtle ground plane. Mouse movement will create a tangible sense of connection through dynamic lighting that follows the cursor. A date stamp (3/19/2026) will be visible in the scene, integrated naturally without disrupting the visual composition. The scene will feel tactile and alive while remaining under 100 lines of JavaScript and requiring no additional dependencies.

## Constraints

**Technical Boundaries:**
- No new npm packages beyond `three` and `vite` already in package.json
- All logic remains in `src/main.js` — no additional JavaScript modules
- Total JavaScript code must not exceed 100 lines
- No TypeScript, no frameworks, no postprocessing libraries
- Preserve existing OrbitControls functionality for camera manipulation
- Maintain window resize handling that keeps the canvas responsive
- Dark background color (0x1a1a2e) must remain unchanged

**Architectural Limits:**
- Single-file structure for JavaScript logic
- Vanilla ES6 module imports only
- No WebGL shaders or custom materials
- No external texture loading or asset pipelines

**UX Patterns:**
- Scene must remain visually minimal — shadows should be subtle, not dramatic
- Mouse interaction should feel responsive but not twitchy (smooth interpolation)
- Ground plane must be unobtrusive — present to receive shadows but not dominate the composition
- Date display must integrate naturally without appearing as a separate UI layer

**Non-Goals:**
- Bloom, color grading, or other postprocessing effects
- Complex particle systems or additional geometry beyond the ground plane
- Audio integration or video textures
- Mobile-specific touch interactions beyond OrbitControls defaults
- Performance optimization for low-end devices (targeting modern desktops)

## Acceptance Boundaries

**Motion Differentiation (Required):**
- Cube rotates on X and Y axes (existing behavior preserved)
- Diamond rotates on a single different axis (Z or Y+Z combination) at a visibly different speed
- Sphere orbits the origin on XZ plane with radius between 2-4 units, completing full orbit in 8-15 seconds
- All three objects must have distinct, non-synchronized motion patterns visible within 5 seconds of load

**Shadow System (Required):**
- Renderer shadow map enabled with type `PCFSoftShadowMap` or equivalent
- Cube, diamond, and sphere all cast shadows (`castShadow: true`)
- Ground plane receives shadows (`receiveShadow: true`) and is positioned below origin
- Shadows must be visible but not harsh — penumbra should create soft edges
- Ground plane geometry must be simple (PlaneGeometry) and dark-colored to blend with background

**Mouse Interaction (Required):**
- Mouse movement within viewport modifies DirectionalLight position or intensity
- Light response must use smooth interpolation (not direct position mapping) to avoid jitter
- Interaction should be perceptible within 0.5 seconds of mouse movement
- Light changes must not override OrbitControls camera rotation

**Date Display (Required):**
- Text "3/19/2026" appears in the 3D scene (not as HTML overlay)
- Date rendered using Three.js TextGeometry or sprite-based text
- Positioned to be readable but not centered — corner or edge placement preferred
- Text color contrasts with background while maintaining dark aesthetic (light gray or white)

**Performance (Threshold):**
- Animation loop maintains 60fps on mid-range hardware (2019+ laptop with dedicated GPU)
- Shadow map resolution balances quality and performance (1024x1024 maximum)
- No memory leaks over 5 minutes of continuous runtime

**Code Constraints (Hard Limit):**
- `src/main.js` remains under 100 lines including imports, initialization, and animation loop
- No line length tricks (e.g., semicolon-chaining) — standard formatting applies
- Code must remain readable with clear variable names and logical grouping

**Acceptable Scope Variations:**
- Ground plane size between 10-20 units is acceptable
- Sphere orbit radius and speed may vary within specified ranges to achieve aesthetic balance
- Date text size and exact position may be adjusted for legibility
- Shadow darkness may be tuned between 30-70% opacity to balance visibility and subtlety

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit operates within a sandbox project (`threejs-starter`) with no production dependencies or user-facing services, which would typically allow Tier 1 autonomy. However, three factors elevate supervision requirements:

1. **Date Hardcoding Risk:** The explicit date "3/19/2026" appears to be a placeholder or test value that may need validation. If this date has semantic meaning (release milestone, demo date, timestamp feature), autonomous execution could embed incorrect context. A human checkpoint ensures date intent is correctly interpreted.

2. **Aesthetic Judgment:** The "subtle" and "natural integration" requirements for shadows, ground plane, and date placement involve subjective UX decisions that cannot be objectively validated through automated tests. Tier 2 allows human review of visual output before finalization.

3. **100-Line Constraint Tension:** Adding four new features (differentiated motion, shadows, mouse interaction, date display) while remaining under 100 lines requires aggressive code compression that may sacrifice clarity. Supervised review prevents optimization choices that create future maintainability debt in a project explicitly designed as a "starter" template for learning.

**Blast Radius if Wrong:** Low. Failures affect only local development environment. No deployment pipeline, no data persistence, no external integrations. Worst case: regenerate with clarified requirements.

**Domain Risk:** Low-Medium. Three.js shadow systems and text rendering have known edge cases (font loading async, shadow acne, performance cliffs), but these are well-documented and recoverable.

## Dependencies

**Prior Orbit (Orbit 1):**
- Existing scene setup with cube geometry, PerspectiveCamera, WebGLRenderer
- Configured AmbientLight and DirectionalLight
- OrbitControls implementation for camera manipulation
- Window resize event handler
- Rotation animation loop using `requestAnimationFrame`
- All dependencies in `package.json` (three@^0.160.0, vite@^5.0.0)

**Technical Dependencies:**
- Three.js `TextGeometry` and `FontLoader` for date rendering (both part of `three` package, no additional install)
- Three.js `PCFSoftShadowMap` shadow renderer (built-in)
- Browser `mousemove` event API for interaction tracking

**Codebase Surface Area:**
- `src/main.js` — primary modification target, currently contains scene initialization and animation loop
- `index.html` — may require `<meta charset="utf-8">` if text rendering exposes encoding issues
- `src/style.css` — no changes expected, preserved as-is

**External System Dependencies:**
- Font file for TextGeometry (Three.js provides fallback fonts in examples, may need CDN or local copy)
- If font loading proves complex within line budget, fallback to sprite-based text using `Sprite` + canvas texture

**Assumptions:**
- Existing diamond and sphere geometries from Orbit 1 are already present in `src/main.js`
- Scene graph structure supports adding ground plane as sibling to existing meshes
- Current DirectionalLight position is accessible and mutable for mouse interaction
- OrbitControls do not conflict with `mousemove` event listeners