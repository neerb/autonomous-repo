# Three.js Minimal Starter Project

## Desired Outcome

A developer can clone this repository and immediately run a working Three.js application in their browser. Within 30 seconds of executing `npm install && npm run dev`, they see a rotating 3D cube with interactive camera controls, demonstrating a minimal but complete Three.js setup. The project serves as a pedagogical reference for beginners learning Three.js with modern tooling, requiring zero configuration beyond the provided files.

## Constraints

### Technical Stack
- **Build Tool:** Vite only — no Webpack, Rollup, or other bundlers
- **Language:** Vanilla JavaScript (ES modules) — no TypeScript, no JSX, no preprocessors
- **Framework:** Three.js as the sole runtime dependency — no React, Vue, Svelte, or other UI frameworks
- **Three.js Version:** Latest stable (0.160.0 or newer)

### Code Complexity
- **Total JavaScript:** Under 100 lines in `src/main.js` including whitespace and comments
- **File Count:** Exactly 4 files (index.html, src/main.js, src/style.css, package.json) excluding package-lock.json and node_modules
- **No Build Configuration:** No vite.config.js or other config files — default Vite behavior only

### Visual Requirements
- **Canvas Background:** Dark color scheme (specifically `0x1a1a2e` or visually equivalent dark blue-gray)
- **Full Viewport:** Canvas must fill 100% of browser window with no scrollbars or margins
- **Responsive:** Must handle window resize without distortion or aspect ratio issues

### Scene Composition
- **Geometry:** Single cube (BoxGeometry) — no additional meshes, particles, or complex models
- **Material:** MeshStandardMaterial (requires lighting to be visible)
- **Lighting:** Exactly two lights — one AmbientLight and one DirectionalLight
- **Camera:** PerspectiveCamera positioned to view the cube from an angle
- **Controls:** OrbitControls from `three/examples/jsm/controls/OrbitControls.js`
- **Animation:** Continuous rotation on both X and Y axes using `requestAnimationFrame`

### Non-Goals
- No production build optimization (minification, tree-shaking, etc.)
- No testing framework or test files
- No asset loading (textures, models, fonts)
- No post-processing effects or advanced rendering techniques
- No UI overlays, HUD elements, or DOM interaction beyond the canvas
- No environment maps, shadows, or physically-based rendering features

## Acceptance Boundaries

### Functional Requirements

| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Installation Time** | `npm install` completes in < 2 minutes on typical broadband | < 60 seconds | < 30 seconds |
| **Startup Time** | Dev server starts in < 10 seconds | < 5 seconds | < 3 seconds |
| **Browser Compatibility** | Works in latest Chrome/Firefox | Works in Chrome, Firefox, Safari, Edge (last 2 versions) | Works in all evergreen browsers |
| **Frame Rate** | Maintains 30 FPS on mid-range hardware | Maintains 60 FPS on mid-range hardware | Maintains 60 FPS on low-end hardware |
| **Window Resize** | Canvas resizes without distortion within 1 second | Canvas resizes immediately with correct aspect ratio | Resize is visually seamless |

### Code Quality

| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **JavaScript Line Count** | < 100 lines total | < 80 lines | < 60 lines |
| **Code Readability** | No obfuscation; basic comments | Clear variable names; structural comments | Self-documenting code with minimal comments needed |
| **Error Handling** | No unhandled exceptions on startup | Graceful WebGL capability detection | Informative error messages for common failures |

### Scene Appearance

| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **Cube Visibility** | Cube is visible and lit against background | Cube has clear edges and depth perception | Cube demonstrates material properties (highlights, shading) |
| **Rotation Speed** | Cube rotates at perceptible speed | Rotation is smooth and aesthetically pleasing | Rotation speed demonstrates animation fundamentals |
| **Lighting Balance** | Scene is neither too dark nor washed out | Lighting shows form and dimension clearly | Lighting demonstrates PBR principles at basic level |

### Developer Experience

| Criterion | Minimum Acceptable | Target | Ideal |
|-----------|-------------------|--------|-------|
| **First-Run Success** | Works after `npm install && npm run dev` with no additional steps | Opens browser automatically to correct localhost port | Includes helpful console output explaining what's running |
| **Hot Module Reload** | Vite HMR works for CSS changes | Vite HMR works for JS and CSS | Scene state persists across HMR updates where possible |
| **Documentation** | README explains how to start dev server | README includes tech stack and basic scene description | Code comments explain Three.js concepts for beginners |

## Trust Tier Assignment

**Assigned Tier:** Tier 2 (Supervised)

**Rationale:**

This orbit requires Tier 2 supervision due to the following risk factors:

1. **Repository Initialization:** Creating a new project structure from scratch has higher risk than modifying existing files. Incorrect file placement or missing dependencies could prevent the project from running entirely.

2. **Dependency Management:** Introducing external packages (Three.js, Vite) requires correct version specification and peer dependency resolution. A malformed `package.json` could cause installation failures that block all downstream work.

3. **Integration Surface:** The orbit touches multiple file types (HTML, JS, CSS, JSON) that must work together correctly. A missing script tag, incorrect module path, or CSS specificity issue could create subtle failures.

4. **Browser Environment Assumptions:** WebGL capability detection and window resize handling involve browser APIs that may behave differently across environments. Automated verification cannot easily simulate all browser conditions.

5. **Pedagogical Quality:** As a starter project for learning, the code quality must be exemplary. Subtle anti-patterns or non-idiomatic code would undermine the educational purpose, requiring human judgment to assess.

The blast radius is limited (new project, no existing system integration), but the success criteria require human judgment about code quality, educational clarity, and cross-browser behavior. Autonomous execution could produce technically functional code that fails to meet the pedagogical intent.

## Dependencies

### External Dependencies
- **Node.js Runtime:** Version 18.0.0 or higher (specified in `package.json` engines field)
- **npm or compatible package manager:** For dependency installation
- **Modern Browser:** Supporting ES modules and WebGL 1.0 minimum

### Package Dependencies
- **three:** ^0.160.0 (runtime dependency for 3D rendering)
- **vite:** ^5.0.0 (dev dependency for development server and module resolution)

### No Internal Dependencies
This is orbit #2 for this project. There are no dependencies on prior orbits as this is a greenfield initialization. The existing repository contains only placeholder files that will be replaced or supplemented.

### Environmental Assumptions
- **Filesystem:** Writable `src/` directory for project structure
- **Network:** Internet access during `npm install` for package download
- **Port Availability:** Port 5173 (Vite default) or fallback port available for dev server