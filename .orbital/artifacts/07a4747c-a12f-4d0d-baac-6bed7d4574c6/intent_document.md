# Minimal Three.js Starter Project with Interactive 3D Scene

## Desired Outcome

A developer can clone or create this project, run a single command (`npm install && npm run dev`), and immediately see a functioning 3D scene in their browser featuring a rotating cube with interactive camera controls. The project serves as a learning foundation for Three.js development, demonstrating the minimal viable setup for 3D web graphics without framework complexity. Success means any developer with Node.js installed can be viewing a 3D scene within 60 seconds of project initialization.

## Constraints

### Technical Stack Boundaries
- **No frameworks:** Vanilla JavaScript only — no React, Vue, Svelte, or similar abstractions
- **No TypeScript:** Plain `.js` files with no type annotations or compilation steps
- **Vite-only tooling:** No webpack, rollup, or alternative bundlers
- **Three.js latest stable:** Use current production release (^0.160.0 or later)

### Code Complexity Limits
- **Maximum 100 lines of JavaScript** across all `.js` files combined (excluding blank lines and comments)
- **Minimal file structure:** Exactly 4 files — `index.html`, `src/main.js`, `src/style.css`, `package.json`
- **No external assets:** No texture files, 3D models, or font files — geometry and materials only

### Visual & Interaction Requirements
- **Full-viewport canvas:** No margins, padding, or scrollbars — immersive 3D view
- **Dark background:** Scene background color `0x1a1a2e` or similar dark theme
- **Responsive rendering:** Canvas automatically resizes with browser window
- **Standard lighting model:** One ambient light + one directional light (no HDR, no post-processing)
- **Basic interactivity:** OrbitControls for mouse/touch camera manipulation only

### Performance & Compatibility
- **Single geometry primitive:** One cube only — no additional meshes or complexity
- **WebGL 1.0 compatibility:** Must run on browsers supporting baseline WebGL
- **No dependencies beyond Three.js and Vite:** Zero additional npm packages

### Non-Goals
- This is NOT a production template — no error boundaries, no analytics, no optimization strategies
- This is NOT a tutorial codebase — no inline comments explaining Three.js concepts
- This is NOT a component library — no reusable abstractions or modular architecture

## Acceptance Boundaries

### Critical (Must Pass)
| Criterion | Threshold | Measurement Method |
|-----------|-----------|-------------------|
| Project initialization | `npm install` completes without errors | Exit code 0 |
| Development server launch | `npm run dev` starts Vite on port 5173 | Server responds to localhost:5173 |
| Canvas rendering | Visible cube with lighting in browser | Visual inspection in Chrome/Firefox |
| Animation functional | Cube rotates continuously on X and Y axes | Visual confirmation of rotation over 5 seconds |
| Responsive behavior | Canvas resizes without distortion when browser window resized | Test at 1920x1080 and 800x600 |
| Camera controls | Mouse drag rotates camera view around cube | Left-click drag + right-click drag + scroll zoom all functional |
| Line count compliance | Total JavaScript ≤ 100 lines | `wc -l src/**/*.js` output |

### Important (Should Pass)
| Criterion | Threshold | Measurement Method |
|-----------|-----------|-------------------|
| File structure correctness | Exactly 4 files present (index.html, main.js, style.css, package.json) | File tree matches specification |
| Dark background visible | Scene background is dark color (approximate 0x1a1a2e) | Visual inspection of canvas background |
| Lighting setup | Two lights present (ambient + directional) | Scene graph inspection via dev tools |
| Material type | Cube uses `MeshStandardMaterial` | Code review confirms material class |
| No TypeScript artifacts | Zero `.ts`, `.tsx`, `tsconfig.json` files | File search returns empty |

### Nice-to-Have (Acceptable to Skip)
| Criterion | Threshold | Measurement Method |
|-----------|-----------|-------------------|
| README documentation | Basic usage instructions present | README.md file exists with run commands |
| Code formatting | Consistent indentation and style | Subjective review |
| Git initialization | .gitignore excludes node_modules | File check (acceptable if missing) |

### Failure Boundaries
The orbit **fails** if:
- The development server does not start
- The canvas is blank or shows a white/error screen
- The cube does not animate
- JavaScript exceeds 110 lines (10% tolerance)
- Any framework (React/Vue/etc.) is detected in dependencies

## Trust Tier Assignment

**Tier 2: Supervised Execution**

### Rationale
This orbit involves creating a new standalone project from scratch with specific technical constraints. While the scope is small and well-defined, several factors require human oversight:

**Risk Factors Elevating to Tier 2:**
- **Net-new project structure:** No existing codebase to modify — the AI must generate 4+ files with correct inter-file references (HTML script tags, CSS paths, module imports)
- **Constraint validation complexity:** The 100-line limit requires exact counting, and the AI may inadvertently exceed it through code generation optimizations
- **External dependency versioning:** Three.js version compatibility must be verified (OrbitControls import path changed between versions)
- **Development environment assumptions:** The generated code must work in the user's Node.js environment, which may have version-specific quirks

**Why Not Tier 1 (Autonomous):**
- No existing test suite to validate correctness automatically
- File structure creation has non-zero risk of path mismatches
- First orbit in trajectory — no prior context to validate against

**Why Not Tier 3 (Gated):**
- No production system impact — this is a greenfield development project
- No data persistence or external service integration
- Failure blast radius limited to wasted developer time (< 10 minutes)
- Easy to regenerate if malformed

**Supervision Requirements:**
- Human must verify the generated project structure before committing
- Human should run `npm install && npm run dev` to validate server startup
- Human must visually confirm the 3D scene renders correctly

## Dependencies

### External Dependencies
- **Node.js runtime:** Version 18.0.0 or higher required for Vite
- **npm package manager:** For installing Three.js and Vite dependencies
- **Modern web browser:** Chrome 90+, Firefox 88+, Safari 15+, or Edge 90+ with WebGL support

### NPM Package Dependencies
| Package | Version Constraint | Purpose |
|---------|-------------------|---------|
| `three` | `^0.160.0` | Core Three.js library for 3D rendering |
| `vite` | `^5.0.0` | Development server and module bundler (devDependency) |

### Prior Orbit Dependencies
- **None:** This is the first orbit in the trajectory — no predecessor artifacts required

### Cross-System Dependencies
- **None:** No external APIs, databases, or microservices required
- **No file system dependencies:** All assets generated in-memory (geometry primitives only)

### Implicit Knowledge Dependencies
The implementation assumes understanding of:
- Three.js scene graph architecture (Scene, Camera, Renderer hierarchy)
- OrbitControls import path convention in Three.js 0.160+
- Vite ES module resolution for node_modules imports
- requestAnimationFrame timing for smooth animation loops