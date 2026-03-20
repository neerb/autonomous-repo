# Subtle Interaction + Scene Polish with Minimal Menu

## Desired Outcome

The Three.js scene becomes a polished, interactive 3D experience that feels responsive and alive. When a user loads the application on March 19, 2026, they encounter a dark, atmospheric scene where:

- Geometric objects (cube, diamond, sphere) move continuously in coordinated but distinct patterns, creating visual interest without distraction
- Mouse movement subtly influences the lighting, making the scene feel reactive to user presence
- Shadows cast by objects onto a ground plane add depth and spatial coherence
- A minimal, non-intrusive menu overlay provides basic controls or information without breaking immersion

The experience should feel tactile and dynamic while remaining lightweight, fast, and visually cohesive with the established dark aesthetic.

## Constraints

**Technical Boundaries:**
- No additional npm dependencies beyond `three` and `vite` already in package.json
- No postprocessing effects or complex rendering pipelines
- All interaction and animation logic must remain in `src/main.js`
- Total JavaScript code must not exceed 100 lines
- No frameworks (React, Vue, Angular, Svelte) — vanilla JavaScript only
- No TypeScript

**Performance Requirements:**
- Must maintain 60fps on mid-tier hardware (integrated graphics)
- Shadow calculations must not introduce perceptible frame drops
- Mouse interaction must have imperceptible latency (<16ms response)

**Visual Constraints:**
- Preserve the dark background color (0x1a1a2e)
- Ground plane must be subtle and not compete with primary objects for attention
- Menu must be minimal — no more than 3-5 elements, semi-transparent or low-contrast
- Existing OrbitControls functionality must remain fully operational

**Scope Limits:**
- No new geometric primitives beyond a ground plane
- No audio, particle effects, or texture loading
- No server-side components or data persistence
- Menu is informational/basic controls only — not a complex UI system

## Acceptance Boundaries

**Motion & Animation:**
- All three objects (cube, diamond, sphere) must exhibit continuous, independent motion
- Diamond rotation axis must differ measurably from cube rotation (at least 45° axis difference)
- Sphere orbital motion must complete one revolution in 8-15 seconds with radius 1.5-3 units
- Animation must maintain 60fps ±5% on reference hardware (Intel UHD 620 or equivalent)

**Interaction:**
- Mouse movement must visibly affect light direction OR intensity within 100px of cursor motion
- Light response must be smooth and proportional (no abrupt changes)
- Interaction must not interfere with OrbitControls camera manipulation
- Effect must be subtle enough to enhance, not dominate, the scene

**Shadow System:**
- Shadows must be enabled on renderer with soft edges (PCF filtering)
- All three primary objects must cast shadows onto the ground plane
- Shadows must be visible under default camera position and lighting
- Ground plane must be large enough to catch shadows without visible edges (minimum 20x20 units)

**Menu Implementation:**
- Menu must be present and visible on page load
- Must contain date stamp "March 19, 2026" as specified
- Must not obscure more than 10% of viewport area
- Must use CSS positioning (not Three.js sprites or 3D elements)
- Must be readable against the dark background (contrast ratio ≥4.5:1)

**Code Quality:**
- Total line count in `src/main.js` must be ≤100 lines (excluding blank lines)
- All existing functionality (resize handling, OrbitControls) must remain intact
- No console errors or warnings in browser DevTools

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit operates at Tier 2 due to moderate blast radius with specific verification needs:

- **Low Implementation Risk:** Changes are additive (no removal of existing code) and confined to a small, self-contained project with no production dependencies
- **Moderate Complexity:** Integrating shadow rendering, coordinated animations, and interaction within a strict 100-line budget requires careful implementation — errors could degrade performance or visual quality
- **Clear Verification Path:** Acceptance criteria are measurable (FPS, line count, visual elements present) but require human judgment for subjective quality (shadow subtlety, interaction "feel")
- **Limited Domain Impact:** Failure affects only a starter project demonstration with no users, data, or downstream systems

Tier 1 (Autonomous) is insufficient because the 100-line constraint combined with new features creates non-trivial implementation challenges that benefit from review. Tier 3 (Gated) is excessive given the isolated scope and lack of security, data, or production concerns.

## Dependencies

**Prior Orbit:**
- Orbit 1 (ID: `feb8e410-9390-453a-b597-a92938a16631`) must be complete — this orbit builds on the existing Three.js scene with cube, diamond, sphere, lighting, and OrbitControls

**Codebase Requirements:**
- `src/main.js` must exist with functional scene, renderer, camera, and animation loop
- `index.html` must have a canvas element that Three.js can target
- `src/style.css` must already style the canvas for full viewport coverage
- `package.json` must include `three` dependency with OrbitControls available

**External Dependencies:**
- Three.js library (version ^0.160.0) with `WebGLRenderer`, shadow support, and `OrbitControls`
- Vite dev server for hot module replacement during development
- Modern browser with WebGL support

**No External Services:**
- This orbit requires no API calls, external data sources, or third-party services
- All functionality is client-side and self-contained