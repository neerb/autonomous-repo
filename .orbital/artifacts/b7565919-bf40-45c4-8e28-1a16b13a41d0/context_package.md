# Context Package: Three.js Minimal Starter Project

## Codebase References

### Files to Create
This orbit involves creating four new files from scratch in a greenfield repository:

| File Path | Purpose | Current State |
|-----------|---------|---------------|
| `index.html` | HTML entry point that loads the Vite dev server and mounts the canvas | Does not exist |
| `src/main.js` | Three.js scene initialization, animation loop, and event handlers | Does not exist |
| `src/style.css` | CSS reset for full-viewport canvas with no overflow | Does not exist |
| `package.json` | npm manifest with dependencies and dev script | Exists with correct structure |

### Existing Files to Preserve
| File Path | Purpose | Action Required |
|-----------|---------|-----------------|
| `package.json` | Already contains correct `three` and `vite` dependencies with proper `type: "module"` | Verify versions match ^0.160.0 and ^5.0.0 respectively |
| `README.md` | Minimal placeholder ("Testing purposes") | Leave unchanged — Intent Document specifies no documentation beyond basic setup |
| `.orbital/artifacts/**/*` | ORBITAL metadata artifacts from prior orbits | Do not modify or reference |

### Directory Structure Pattern
```
autonomous-repo/
├── index.html           (root-level entry point)
├── package.json         (already exists)
├── src/
│   ├── main.js         (application entry)
│   └── style.css       (global styles)
└── README.md           (existing, unchanged)
```

This follows standard Vite conventions where `index.html` is at the repository root and sources are under `src/`.

## Architecture Context

### Build System Architecture
**Vite ES Module Resolution:**
- Vite serves `index.html` directly without compilation (HTML-as-entry pattern)
- JavaScript imports use bare module specifiers (`import * as THREE from 'three'`)
- Vite's dev server rewrites bare imports to `/node_modules/three/...` at runtime
- No build configuration file (`vite.config.js`) needed for this minimal setup
- HMR (Hot Module Replacement) works automatically for `.js` and `.css` changes

**Module Type:**
- `package.json` specifies `"type": "module"` — all `.js` files treated as ES modules
- Top-level `await` is supported (though not needed for this orbit)
- No CommonJS `require()` syntax allowed

### Three.js Rendering Pipeline
**Initialization Sequence:**
1. Create `THREE.Scene()` — container for all 3D objects
2. Create `THREE.PerspectiveCamera()` — defines viewing frustum
3. Create `THREE.WebGLRenderer()` — interfaces with WebGL context
4. Add renderer's `<canvas>` DOM element to `document.body`
5. Create geometry, material, and mesh
6. Add lights to scene (ambient + directional)
7. Add OrbitControls tied to camera and renderer's DOM element
8. Start `requestAnimationFrame` loop

**Render Loop Pattern:**
```javascript
function animate() {
  requestAnimationFrame(animate);
  // Update logic (rotation, controls)
  renderer.render(scene, camera);
}
```

### Responsive Behavior
**Window Resize Handling:**
- Must update `camera.aspect` to match new window dimensions
- Must call `camera.updateProjectionMatrix()` after aspect change
- Must call `renderer.setSize(width, height)` to resize canvas
- Event listener: `window.addEventListener('resize', onWindowResize)`

**Canvas Sizing Strategy:**
- CSS sets `width: 100vw; height: 100vh` on canvas element
- Renderer's `setSize()` method sets internal rendering resolution
- These must stay synchronized to avoid blurry or stretched output

## Pattern Library

### Three.js Import Patterns (Modern)
**Core Library:**
```javascript
import * as THREE from 'three';
// Usage: THREE.Scene(), THREE.BoxGeometry(), etc.
```

**Addons/Examples:**
```javascript
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// Note: .js extension required, path is relative to 'three' package
```

**Deprecated Pattern to Avoid:**
```javascript
// DO NOT USE: Old UMD build path
import * as THREE from 'three/build/three.module.js';
```

### Naming Conventions
**Three.js Objects:**
- Scene: `scene`
- Camera: `camera`
- Renderer: `renderer`
- Mesh: `cube` or `mesh`
- Material: `material`
- Geometry: `geometry`
- Controls: `controls`

**Functions:**
- Animation loop: `animate()` or `tick()`
- Resize handler: `onWindowResize()` or `handleResize()`
- Initialization: `init()` or inline at module top-level

### CSS Reset Pattern
**Full-Viewport Canvas:**
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
  width: 100vw;
  height: 100vh;
}
```

This prevents scroll bars, removes default spacing, and ensures canvas fills viewport exactly.

### HTML Structure Pattern
**Minimal Vite Entry Point:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project Name</title>
  <link rel="stylesheet" href="/src/style.css" />
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

Key details:
- No `<div id="app">` needed — canvas appended to body directly
- Stylesheet link uses absolute path from root: `/src/style.css`
- Script tag uses `type="module"` and absolute path: `/src/main.js`

## Prior Orbit References

### Orbit #1 (Unknown Content)
- Artifacts exist in `.orbital/artifacts/c71c2625-0f6b-441c-a24b-a5d187d1ae16/`
- Includes `code_generation.md`, `test_results.md`, `verification_protocol.md`
- No indication this orbit touched Three.js, Vite, or the production codebase
- Likely focused on ORBITAL system setup or metadata infrastructure

**Implication for Current Orbit:**
- No code patterns to inherit from prior orbit
- No architectural decisions to respect or conflict with
- This is effectively the first production code orbit

### Repository History Pattern
- Repository name: `neerb/autonomous-repo`
- Purpose stated in README: "Testing purposes"
- This suggests an experimental repository for validating ORBITAL methodology
- Production patterns are not yet established — this orbit will set them

### Package.json Already Configured
- Existing `package.json` already has correct structure
- `"type": "module"` already set
- `"scripts": { "dev": "vite" }` already present
- Dependencies versions already pinned to `^0.160.0` (three) and `^5.0.0` (vite)

**Decision Point:**
- Do we overwrite `package.json` to ensure exact match?
- Or do we trust existing configuration is correct?
- **Recommendation:** Leave `package.json` unchanged unless version validation fails

## Risk Assessment

### Technical Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Three.js API Deprecation** | Medium | Low | Use current documentation (r160+), avoid deprecated classes like `Geometry` (use `BufferGeometry`), avoid deprecated materials |
| **Import Path Errors** | High | Medium | Triple-check OrbitControls path: `three/examples/jsm/controls/OrbitControls.js` — most common mistake is wrong path or missing `.js` extension |
| **WebGL Context Loss** | Low | Low | Modern browsers handle this automatically; no recovery logic needed for starter project |
| **Memory Leaks from Geometry** | Low | Low | Static scene with single cube — no dynamic creation/destruction, so disposal not critical |
| **Vite HMR State Loss** | Low | High | Expected behavior — HMR resets animation state. Document this as normal, not a bug |

### Integration Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Conflicting package.json** | Medium | Low | Existing package.json looks correct; validate `type: "module"` present before assuming compatibility |
| **Port Conflicts** | Low | Medium | Vite defaults to port 5173; if occupied, Vite auto-increments. No action needed |
| **Node Version Mismatch** | Medium | Medium | Package.json specifies `>=18.0.0`; verify in verification protocol with `node --version` check |
| **npm vs yarn vs pnpm** | Low | Low | All three work with standard package.json; Vite is package-manager agnostic |

### Code Quality Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Line Count Overrun** | Low | Medium | Strict 100-line budget requires concise code; avoid intermediate variables, use chaining where readable |
| **Magic Numbers** | Low | High | Acceptable for starter project (Intent explicitly de-prioritizes documentation); FOV=75, aspect=window ratio, near=0.1, far=1000 are Three.js conventions |
| **No Error Handling** | Low | Low | WebGL context creation can fail on old devices, but Intent scope excludes production robustness |
| **Global Scope Pollution** | Medium | Low | ES modules isolate scope automatically; no `var` declarations leak globals |

### Performance Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **60fps Not Achieved** | Medium | Low | Single cube is trivial geometry; even integrated GPUs exceed 60fps. Risk only on very old hardware |
| **Window Resize Jank** | Low | Medium | Resize handler fires frequently; consider debouncing if visual stutter observed (out of scope for minimal starter) |
| **OrbitControls Damping Lag** | Low | Low | Default damping feels responsive; only customize if Intent acceptance boundaries demand it |

### Security Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **XSS via Three.js** | None | None | Three.js only renders WebGL — no user input, no DOM injection vectors |
| **Dependency Vulnerabilities** | Low | Low | Three.js and Vite are actively maintained; versions ^0.160.0 and ^5.0.0 are current as of 2024 |
| **Dev Server Exposure** | Low | Low | Vite dev server binds to localhost by default; no external network exposure |

### Architectural Risks

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Pattern Divergence** | Medium | Medium | This orbit establishes foundational patterns (file structure, import style); document choices in README or comments for future orbits |
| **Vite Config Creep** | Low | Low | Temptation to add `vite.config.js` for customization; resist unless Intent explicitly requires it |
| **Scope Expansion** | Medium | Medium | Starter projects often attract feature bloat (shadows, textures, models); Intent explicitly forbids this — enforce strictly |
| **TypeScript Conversion Pressure** | Low | Medium | Future orbits may want to add TypeScript; ensure vanilla JS patterns (no `any` workarounds, no implicit types) are clean starting points |

### Supervision-Specific Risks (Tier 2)

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| **Human Misses Import Error** | High | Medium | Supervision checkpoint must include running `npm run dev` and checking browser console for 404s or module errors |
| **Visual Output Subjective** | Medium | High | "Does the cube look right?" requires human judgment; provide screenshot in verification artifact for comparison |
| **Performance Measurement Skipped** | Low | Medium | Supervision checkpoint includes opening browser dev tools Performance tab and recording 5 seconds of animation |
| **Line Count Not Verified** | Low | Low | Automated gate can count lines in `src/main.js`; exclude blank lines and comments per Intent definition |