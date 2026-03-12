# Context Package: React Foundation - Binary Tree Fractal Simulation Project

## Codebase References

### Current Repository State
The repository at `https://github.com/neerb/autonomous-repo` is in an initialization state with minimal content:

- **README.md** — Single file containing repository title and purpose statement. No technical documentation or setup instructions present.
- **No package.json** — No Node.js project initialization. No dependencies declared.
- **No .gitignore** — No build artifact or node_modules exclusion patterns defined.
- **No src/ directory** — No application code structure exists.

### Files to Create
This orbit will establish the foundational file structure. Expected new files include:

- **package.json** — Project manifest defining React 18.x dependency, scripts (start, build, test), and project metadata
- **public/index.html** — HTML entry point with root div mount point for React application
- **src/index.js** or **src/index.tsx** — React application bootstrap, ReactDOM.render invocation
- **src/App.js** or **src/App.tsx** — Root component containing or orchestrating the fractal visualization
- **src/components/FractalTree.js** — Canvas-based or SVG-based component responsible for rendering the tree
- **src/utils/fractalAlgorithm.js** — Pure function implementing recursive binary tree generation logic with seeded randomization
- **src/utils/animationController.js** — Animation frame management, growth progression state, sway oscillation logic
- **.gitignore** — Standard Node.js exclusions (node_modules/, build/, .env files)
- **README.md (updated)** — Setup instructions, algorithm explanation, development commands

### No Existing Code Constraints
Since this is greenfield development, there are no legacy patterns to maintain, no existing dependencies to avoid conflicting with, and no migration concerns. However, choices made here will become the precedent for future work.

## Architecture Context

### Application Architecture
This orbit establishes a **client-side single-page application (SPA)** with the following architectural layers:

**Presentation Layer:**
- React components manage UI lifecycle and rendering
- Canvas API or SVG for fractal drawing (decision point: Canvas recommended for performance with complex animations)
- Component tree: App → FractalTree → Canvas element

**Business Logic Layer:**
- Fractal generation algorithm as pure functions (input: depth, angle, seed → output: branch coordinate array)
- Animation state machine managing growth phase → sway phase transitions
- Seeded random number generator for reproducible tree variations

**No Data Layer:**
- No persistence, no API calls, no backend services
- All state is ephemeral and lives in React component state or refs

### Technology Stack Decision Points

**Build Tool Selection:**
- **Vite (Recommended):** Faster dev server startup, modern ESM-based tooling, simpler configuration for Canvas/animation use cases. Aligns with "keep it simple" constraint.
- **Create React App (Alternative):** More established, zero-config, but slower HMR and more opinionated structure. Acceptable but heavier.

**Rendering Technology:**
- **Canvas API (Recommended):** Direct pixel manipulation, better performance for animated fractals with 10-12 recursion levels, simpler coordinate transformations for recursive drawing.
- **SVG (Alternative):** Declarative, easier to style individual branches, but DOM manipulation overhead becomes significant with hundreds of SVG elements during animation.

**Animation Approach:**
- **requestAnimationFrame (Recommended):** Browser-native frame sync, allows manual control of growth progression and sway timing, no external dependency.
- **React Spring or Framer Motion (Not Recommended):** Would violate "minimal dependencies" constraint. Adds complexity for marginal benefit in this use case.

### Data Flow

```
User loads page
  → React mounts App component
    → App initializes fractal parameters (seed, depth, base angle)
      → FractalTree component receives parameters as props
        → useEffect triggers fractal generation (calls fractalAlgorithm.js)
          → Algorithm returns array of branch objects [{x1, y1, x2, y2, depth, angle}]
            → Component stores branches in state/ref
              → Animation loop begins (requestAnimationFrame)
                → Growth phase: incrementally reveal branches by depth level
                  → Sway phase: apply sine-wave rotation to branch angles
                    → Canvas redraw with updated coordinates
```

### Performance Considerations
- **Recursion depth 10-12** generates approximately 1024-4096 branch segments (2^n). Canvas can handle this; SVG may struggle.
- **Animation frame budget:** 16.67ms per frame for 60 FPS. Fractal generation is one-time cost (can be pre-computed). Canvas drawing must complete within budget.
- **Memory footprint:** Branch array with 4096 objects × ~6 properties × 8 bytes ≈ 192 KB. Negligible for target hardware.

## Pattern Library

### Patterns to Establish (This Orbit Creates Precedent)

**Project Structure Convention:**
```
/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── FractalTree.js
│   ├── utils/
│   │   ├── fractalAlgorithm.js
│   │   └── animationController.js
│   ├── App.js
│   └── index.js
├── package.json
├── .gitignore
└── README.md
```

**Naming Conventions:**
- **Components:** PascalCase (FractalTree, App)
- **Utilities:** camelCase (fractalAlgorithm, animationController)
- **Constants:** UPPER_SNAKE_CASE for configuration values (MAX_DEPTH, BASE_ANGLE)
- **File extensions:** .js for now (TypeScript out of scope unless explicitly needed)

**Component Patterns:**
- **Functional components with hooks** (no class components)
- **Props for configuration, refs for animation state** — avoid re-renders during animation loop
- **Separation of concerns:** Fractal generation logic separate from rendering logic separate from animation timing

**Seeded Random Pattern:**
```javascript
// Establish this pattern for reproducible randomness
function seededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
```

**Animation Loop Pattern:**
```javascript
// Establish requestAnimationFrame usage pattern
useEffect(() => {
  let animationId;
  const animate = (timestamp) => {
    // Update animation state
    // Redraw canvas
    animationId = requestAnimationFrame(animate);
  };
  animationId = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationId);
}, [dependencies]);
```

### Patterns to Avoid
- **No inline styles** — Use CSS modules or styled-components pattern if styling complexity grows (future orbit)
- **No prop drilling beyond 2 levels** — Keep component tree flat per Intent constraint
- **No premature abstraction** — Resist creating generic "AnimationEngine" or "FractalRenderer" base classes
- **No external state management** — No Redux, Zustand, or Context API needed for single-component application

## Prior Orbit References

### No Prior Orbits
This is **Orbit 1 of Trajectory 1**. No previous implementation attempts exist in this repository.

### Relevant Domain Knowledge (External Context)
- **Binary tree fractals** are well-documented in computer graphics literature. Standard approach: recursive function with branching factor 2, angle offset ±θ, length decay factor (typically 0.6-0.8).
- **Canvas animation performance** best practices: batch draw operations, avoid clearRect on every frame if possible (use layering or dirty rectangles for optimization in future orbits).
- **React + Canvas integration** common pattern: useRef for canvas element, useEffect for animation loop setup/teardown, avoid storing canvas drawing operations in component state.

### Greenfield Advantages
- No technical debt to refactor
- No conflicting dependency versions
- No legacy browser support requirements
- Freedom to choose optimal tools without migration constraints

### Greenfield Risks
- Every decision sets precedent for future orbits
- No existing error handling patterns to follow
- No established testing strategy to replicate
- Risk of over-engineering in absence of real constraints

## Risk Assessment

### Performance Risks

**Risk:** Animation frame rate drops below 30 FPS during sway phase
- **Likelihood:** Low if Canvas is used; Medium if SVG is used
- **Impact:** Violates minimum viable outcome, creates poor user experience
- **Mitigation:** Use Canvas API. Profile with browser DevTools Performance tab before committing. Reduce recursion depth to 10 if 12 levels cause frame drops. Pre-calculate branch positions during growth phase rather than recalculating every frame.

**Risk:** Memory leak in animation loop
- **Likelihood:** Medium (common mistake with requestAnimationFrame in React)
- **Impact:** Tab becomes unresponsive after extended viewing
- **Mitigation:** Ensure cancelAnimationFrame is called in useEffect cleanup. Store animation ID in ref, not state. Test by letting application run for 5+ minutes and monitoring DevTools Memory tab.

### Architectural Risks

**Risk:** Coupling fractal algorithm to React component lifecycle
- **Likelihood:** High without deliberate separation
- **Impact:** Fractal logic cannot be reused in future non-React contexts, difficult to unit test
- **Mitigation:** Implement fractal generation as pure function in `src/utils/fractalAlgorithm.js` with no React imports. Function signature: `generateTree(params) => branches[]`. Component only orchestrates, doesn't calculate.

**Risk:** Build tool choice locks repository into outdated patterns
- **Likelihood:** Low with Vite; Medium with Create React App
- **Impact:** Future orbits struggle with slow build times or configuration inflexibility
- **Mitigation:** Choose Vite for modern ESM tooling. Document build tool choice in README with rationale. Ensure no CRA-specific patterns (e.g., REACT_APP_ env vars) leak into code.

### Visual Quality Risks

**Risk:** Tree looks artificial or unnatural (perfectly symmetrical, mechanical)
- **Likelihood:** High if randomization is insufficient
- **Impact:** Fails "visually compelling" acceptance criterion
- **Mitigation:** Implement angle variation (±5-15 degrees), length variation (±10%), and slight trunk curvature. Use multiple random seeds to test visual variety. Include screenshot or GIF in PR for human review.

**Risk:** Color palette is harsh or unappealing
- **Likelihood:** Medium (subjective aesthetic judgment)
- **Impact:** Reduces viewer engagement, reflects poorly on repository quality
- **Mitigation:** Use HSL color space for trunk-to-leaf gradient (H: 30→120, S: 40-60%, L: 30-60%). Avoid pure colors. Reference natural tree photography for color inspiration. Human review in Tier 2 process.

### Code Quality Risks

**Risk:** Monolithic component exceeds 500 lines
- **Likelihood:** Medium if all logic stays in FractalTree component
- **Impact:** Explicit unacceptable outcome in Intent
- **Mitigation:** Enforce separation: algorithm in utils/, animation loop management in separate hook or utility, rendering in component. Set up line count check in verification protocol.

**Risk:** No reproducible randomness (debugging impossible)
- **Likelihood:** Medium if Math.random() is used directly
- **Impact:** Cannot reproduce visual bugs, fails minimum viable outcome
- **Mitigation:** Implement seeded RNG in `src/utils/seededRandom.js`. Pass seed as prop (default to constant like 12345). Document seed usage in README.

### Integration Risks

**Risk:** Repository structure conflicts with future trajectory needs
- **Likelihood:** Low but high-impact
- **Impact:** Future orbits require restructuring, causing churn
- **Mitigation:** Use conventional project layout (public/, src/, components/, utils/). Avoid fractal-specific top-level directories. Keep structure generic enough for additional visualizations.

**Risk:** Git history becomes polluted with build artifacts
- **Likelihood:** High without .gitignore
- **Impact:** Repository bloat, PR noise
- **Mitigation:** Create comprehensive .gitignore before first commit. Include node_modules/, build/, dist/, .DS_Store, *.log, .env*.

### Dependency Risks

**Risk:** React 18 has breaking changes from documentation examples
- **Likelihood:** Low (React 18 is stable as of 2024)
- **Impact:** Example code doesn't work, requires research
- **Mitigation:** Use React 18 createRoot API (not legacy ReactDOM.render). Reference official React docs for concurrent features.

**Risk:** Bundler introduces unexpected build errors
- **Likelihood:** Low with Vite; Medium with Create React App on newer Node versions
- **Impact:** `npm start` fails, violates minimum viable outcome
- **Mitigation:** Specify Node.js version requirement in README (18.x+). Test build on clean environment (consider Docker container for verification protocol).

### Security Risks

**Risk:** Malicious dependency in transitive dependency tree
- **Likelihood:** Very Low (standard React dependencies are well-audited)
- **Impact:** Supply chain vulnerability in greenfield project
- **Mitigation:** Run `npm audit` after dependency installation. Use npm lockfile (package-lock.json) to pin transitive versions. Accept low/moderate non-exploitable vulnerabilities in dev dependencies.

### Mitigation Priority
1. **High Priority:** Performance profiling, animation cleanup, fractal algorithm separation, .gitignore creation
2. **Medium Priority:** Color palette review, seeded randomness, line count enforcement
3. **Low Priority:** Dependency audit, Node version documentation