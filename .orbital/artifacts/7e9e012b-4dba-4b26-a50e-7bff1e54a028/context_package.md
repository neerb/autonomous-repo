# Context Package: React Foundation - Binary Tree Fractal Simulation Project

## Codebase References

### Current Project Structure

**Build Configuration:**
- `vite.config.js` - Vite build configuration with React plugin
- `package.json` - Dependency manifest defining React 18.2.0, Vite 5.0.0, and ES module type
- `.gitignore` - Version control exclusions

**Application Entry Points:**
- `public/index.html` - HTML shell with root mounting point for React application
- `src/index.jsx` - React application bootstrap, imports App component and mounts to DOM
- `src/App.jsx` - Top-level application component container

**Feature Implementation Files (Existing from Orbit 1):**
- `src/components/FractalTree.jsx` - React component for fractal tree rendering (previous implementation)
- `src/utils/fractalAlgorithm.js` - Utility module for tree generation logic (previous implementation)
- `src/utils/seededRandom.js` - Deterministic random number generator (previous implementation)

### Orbit 1 Artifact References

The `.orbital/artifacts/50e90325-8f1e-46e3-bf6b-5afdecbaf52e/` directory contains complete documentation from the previous implementation attempt:
- `intent_document.md` - Original intent specification
- `context_package.md` - Prior context analysis
- `proposal_record.md` - Implementation plan from Orbit 1
- `code_generation.md` - Generated code artifacts
- `verification_protocol.md` - Test and validation procedures
- `test_results.md` - Execution outcomes

**Key Consideration:** These files represent a complete implementation cycle that resulted in a restart (Orbit 2). Review these artifacts to understand:
- What approach was taken initially
- What technical decisions were made
- What issues may have triggered the restart
- What patterns to preserve or avoid

### Files Requiring Modification or Creation

**Primary Implementation Surface:**
- `src/components/FractalTree.jsx` - Must implement canvas rendering, animation lifecycle, and tree drawing
- `src/utils/fractalAlgorithm.js` - Must contain recursive tree generation logic, branch calculation, and termination conditions
- `src/utils/seededRandom.js` - Must provide deterministic random number generation for reproducible test scenarios
- `src/App.jsx` - Must import and render FractalTree component
- `src/index.jsx` - May require modification if application initialization needs adjustment

**Supporting Files:**
- `README.md` - Currently contains placeholder content; should be updated with project documentation post-implementation

## Architecture Context

### Application Structure Pattern

The codebase follows a standard Vite + React single-page application architecture:

```
Entry Flow:
public/index.html
  └─> src/index.jsx (ReactDOM.createRoot)
      └─> src/App.jsx (root component)
          └─> src/components/FractalTree.jsx (feature component)
              └─> src/utils/fractalAlgorithm.js (pure logic)
              └─> src/utils/seededRandom.js (utility)
```

**Separation of Concerns:**
- **Component Layer** (`src/components/`): React components managing UI lifecycle, refs, state, and effects
- **Utility Layer** (`src/utils/`): Pure functions with no React dependencies, testable in isolation
- **App Layer** (`src/App.jsx`): Composition root for feature components
- **Bootstrap Layer** (`src/index.jsx`, `public/index.html`): Application initialization

### Data Flow Characteristics

**No External Data Sources:**
- All tree generation parameters are compile-time constants or derived from seeded random generation
- No API calls, no fetch operations, no external state management
- Canvas rendering is entirely synchronous except for animation frame scheduling

**State Management Boundaries:**
- Component-local state using `useState` for animation phase tracking (growing vs swaying)
- Refs using `useRef` for canvas context persistence and animation frame ID storage
- No prop drilling or global state required for single-component application

### Rendering Architecture

**Canvas Integration Pattern:**
The application must bridge React's declarative component model with Canvas's imperative drawing API:

1. **Mount Phase:** Acquire canvas ref, get 2D rendering context, store in ref
2. **Initialization Phase:** Generate tree structure data, prepare animation state
3. **Animation Loop:** Use `requestAnimationFrame` to drive continuous rendering, update animation state, redraw canvas
4. **Unmount Phase:** Cancel animation frame to prevent memory leaks

**Critical Timing Consideration:**
Canvas operations must occur after DOM mount (inside `useEffect`) but before first render attempt. The pattern typically involves:
- `useEffect` with empty dependency array for mount-time setup
- `useRef` to store canvas context across renders without triggering re-renders
- Separate `useEffect` with animation state dependencies for loop management

### Build System Context

**Vite Configuration:**
The project uses Vite's default React configuration with ES modules:
- JSX transformed via `@vitejs/plugin-react`
- Hot module replacement (HMR) enabled in dev mode
- No custom build optimizations or plugins configured
- Output target is modern ESM with code splitting

**Module Resolution:**
- `"type": "module"` in `package.json` enforces ES module syntax
- Imports must use `.jsx` extensions for component files
- No path aliases configured; all imports are relative

### Performance Infrastructure

**Browser API Constraints:**
- `requestAnimationFrame` provides approximately 60fps on capable hardware but may throttle to 30fps in background tabs
- Canvas 2D context operations are synchronous and block the main thread
- Excessive redraw operations (clearing entire canvas each frame) can cause performance degradation

**Optimization Surface:**
- Minimize canvas clear operations; only redraw changed regions if possible
- Batch canvas drawing operations to reduce context state changes
- Avoid allocation inside animation loop (pre-calculate tree structure)
- Use integer coordinates where possible to avoid subpixel rendering overhead

## Pattern Library

### React Component Patterns (Inferred Standards)

**File Naming:**
- Component files use PascalCase with `.jsx` extension: `FractalTree.jsx`
- Utility modules use camelCase with `.js` extension: `fractalAlgorithm.js`, `seededRandom.js`
- One component per file convention

**Component Structure:**
Based on existing file organization, components should follow:
```javascript
// Imports
import React, { useState, useEffect, useRef } from 'react';

// Component definition
function ComponentName() {
  // Hooks
  // Event handlers
  // Effects
  // Return JSX
}

export default ComponentName;
```

**Export Convention:**
Default exports for components and utility modules (evidenced by `src/App.jsx`, `src/components/FractalTree.jsx`)

### Canvas Rendering Patterns

**Standard Canvas Integration:**
```javascript
const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  // Drawing operations
}, [dependencies]);

return <canvas ref={canvasRef} width={800} height={600} />;
```

**Animation Loop Pattern:**
```javascript
const animationIdRef = useRef(null);

useEffect(() => {
  function animate() {
    // Update state
    // Draw frame
    animationIdRef.current = requestAnimationFrame(animate);
  }
  
  animate();
  
  return () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
  };
}, [dependencies]);
```

### Utility Module Patterns

**Pure Function Structure:**
Utilities should be stateless pure functions that can be tested independently:
```javascript
// fractalAlgorithm.js
export function generateTree(params) {
  // Pure logic, no side effects
  return treeStructure;
}

export function calculateBranch(parent, angle, length) {
  // Mathematical transformations
  return { x, y, angle };
}
```

**Seeded Random Pattern:**
The `seededRandom.js` module should provide deterministic pseudo-random generation:
```javascript
export function createSeededRandom(seed) {
  // Return generator function with internal state
  return function random() {
    // LCG or similar algorithm
    return value; // 0-1 range
  };
}
```

### Code Organization Standards

**Import Ordering:**
1. External dependencies (React, etc.)
2. Internal components (relative imports from `./components/`)
3. Internal utilities (relative imports from `./utils/`)

**Constant Definition:**
Configuration values should be defined as named constants at module top:
```javascript
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const MAX_DEPTH = 10;
const BRANCH_ANGLE = Math.PI / 6; // 30 degrees
```

## Prior Orbit References

### Orbit 1 Analysis (50e90325-8f1e-46e3-bf6b-5afdecbaf52e)

**Context:**
Orbit 1 resulted in a complete implementation cycle with all ORBITAL artifacts generated and code produced. The presence of these artifacts alongside "Orbit 2 - Trying this over again from scratch" indicates that while Orbit 1 was technically complete, it did not meet acceptance criteria or encountered issues requiring a fresh start.

**Artifact Inventory:**
- Intent, Context, Proposal, Verification artifacts exist
- Code generation artifact present (implementation was produced)
- Test results artifact present (verification was attempted)

**Implications:**

1. **Implementation Was Delivered:** Code was generated for `FractalTree.jsx`, `fractalAlgorithm.js`, and `seededRandom.js`
2. **Verification Occurred:** Test results suggest the implementation was evaluated against acceptance criteria
3. **Outcome Required Restart:** Despite technical completion, human review determined a fresh approach was needed

**Potential Issues from Orbit 1 (Hypotheses):**
- **Performance:** Animation may have failed to maintain target frame rates
- **Visual Quality:** Tree appearance may have been unnatural or not aesthetically acceptable
- **Algorithm Design:** Recursive implementation may have had stack overflow or termination issues
- **Animation Coordination:** Growth or sway animation may have exhibited timing artifacts
- **Code Quality:** Implementation may have been difficult to maintain or extend

**Lessons for Orbit 2:**

1. **Review Before Reuse:** Examine Orbit 1 code artifacts to identify specific failure modes
2. **Fresh Perspective:** Do not cargo-cult the prior approach; reconsider algorithm fundamentals
3. **Simplify First:** Ensure Tier 1 acceptance criteria are rock-solid before pursuing Tier 2 polish
4. **Performance Priority:** Given Intent's 60fps requirement, prioritize rendering efficiency from the start
5. **Early Visual Validation:** Implement basic tree rendering before adding complexity like animation

**Files to Examine:**
- `.orbital/artifacts/50e90325-8f1e-46e3-bf6b-5afdecbaf52e/code_generation.md` - What was the code structure?
- `.orbital/artifacts/50e90325-8f1e-46e3-bf6b-5afdecbaf52e/test_results.md` - What failed verification?
- `.orbital/artifacts/50e90325-8f1e-46e3-bf6b-5afdecbaf52e/proposal_record.md` - What was the technical approach?

**Preservation Considerations:**
The existing `src/components/FractalTree.jsx`, `src/utils/fractalAlgorithm.js`, and `src/utils/seededRandom.js` files contain Orbit 1's implementation. Orbit 2 should:
- **Overwrite these files completely** rather than attempting to patch
- **Preserve the file structure** (same paths) to maintain project organization
- **Learn from but not replicate** the prior implementation's decisions

## Risk Assessment

### Performance Risks

**Risk: Canvas Rendering Bottleneck**
- **Description:** Drawing thousands of lines per frame (256-2048 branches at depth 8-12) may exceed browser rendering capacity, causing frame drops below 45fps threshold
- **Likelihood:** Medium - Canvas 2D is generally performant but depends on branch count and drawing operations per frame
- **Impact:** High - Violates Tier 1 acceptance criteria and core user experience goal
- **Mitigation:**
  - Pre-calculate tree structure once during initialization rather than per-frame
  - Use batch drawing operations (single beginPath/stroke call for multiple lines)
  - Consider drawing thinner branches with single-pixel strokes for distant branches
  - Profile with browser DevTools Performance tab during development
  - Test on mid-range hardware (not just developer workstation)

**Risk: Animation Loop Memory Leak**
- **Description:** Failing to cancel `requestAnimationFrame` on component unmount causes continued execution and memory accumulation
- **Likelihood:** Low - Standard React pattern well-documented
- **Impact:** Medium - Degrades browser performance over time, not immediately visible
- **Mitigation:**
  - Implement cleanup function in useEffect that cancels animation frame
  - Store animation ID in ref, not state
  - Test component mounting/unmounting in React StrictMode
  - Verify no warnings in browser console during hot module replacement

### Algorithm Risks

**Risk: Stack Overflow from Deep Recursion**
- **Description:** Recursive tree generation at depth 10-12 creates 1024-4096 stack frames, potentially exceeding JavaScript call stack limits
- **Likelihood:** Low-Medium - Modern browsers have large stacks but recursion depth is configurable
- **Impact:** Critical - Application crash, unrecoverable user experience
- **Mitigation:**
  - Implement hard maximum depth limit (MAX_DEPTH constant)
  - Consider iterative algorithm with explicit stack/queue if recursion proves unstable
  - Test with depth=12 explicitly during verification
  - Add defensive depth check at function entry

**Risk: Infinite Loop in Animation**
- **Description:** Animation state machine transitions incorrectly, causing runaway requestAnimationFrame calls
- **Likelihood:** Low - Controlled by explicit state transitions
- **Impact:** High - Browser tab freezes, requires force-quit
- **Mitigation:**
  - Use finite state machine for animation phases (idle -> growing -> swaying)
  - Add frame counter with maximum frame limit as circuit breaker
  - Test state transitions thoroughly in verification protocol
  - Include console logging during development to observe state changes

### Visual Quality Risks

**Risk: Random Variation Too Extreme**
- **Description:** Random angle deviations exceed ±15 degrees, producing unnatural or chaotic tree appearance
- **Likelihood:** Medium - Randomness parameters require tuning
- **Impact:** Medium - Fails Tier 2 "organic appearance" criteria but not Tier 1 functionality
- **Mitigation:**
  - Use seeded random for reproducible testing
  - Define angle variation as named constant for easy adjustment
  - Implement multiple test seeds in verification protocol
  - Clamp random values to explicit bounds

**Risk: Animation Timing Inconsistency**
- **Description:** Branch growth rates vary unpredictably, causing jerky or asynchronous appearance
- **Likelihood:** Medium - Coordinating timing across recursive structure is complex
- **Impact:** Medium - Fails Tier 2 "smooth animation" criteria
- **Mitigation:**
  - Use time-based animation (elapsed milliseconds) rather than frame-based
  - Calculate growth percentage from consistent timestamp reference
  - Test at different frame rates (throttle browser to 30fps in DevTools)
  - Ensure sway phase only begins after growth completes (explicit state check)

### Integration Risks

**Risk: React Strict Mode Double-Render Issues**
- **Description:** Development mode strict mode causes useEffect to run twice, potentially duplicating canvas setup or animation loops
- **Likelihood:** Medium - Standard React 18 behavior
- **Impact:** Low-Medium - May cause visual glitches or performance issues in development
- **Mitigation:**
  - Design effects to be idempotent (safe to run multiple times)
  - Use cleanup functions properly
  - Test that only one animation loop is active (check animation ID ref)
  - Verify behavior in production build (strict mode disabled)

**Risk: Canvas Reference Timing**
- **Description:** Attempting to access canvas context before DOM mount causes null reference errors
- **Likelihood:** Low - Well-understood React lifecycle pattern
- **Impact:** High - Application fails to render, console errors
- **Mitigation:**
  - Always check `canvasRef.current` for null before accessing
  - Perform canvas operations inside useEffect with proper dependencies
  - Add defensive null checks before getContext calls
  - Test in React StrictMode to catch timing issues

### Scope Creep Risks

**Risk: Over-Engineering Beyond Intent**
- **Description:** Implementing user controls, responsive resizing, or multi-tree scenes that are explicitly non-goals
- **Likelihood:** Low - Intent clearly defines non-goals
- **Impact:** Low - Wastes time but doesn't break acceptance criteria
- **Mitigation:**
  - Reference Intent constraints during proposal phase
  - Focus on Tier 1 acceptance criteria first
  - Defer any "nice to have" features to future orbits
  - Keep implementation minimal and focused

**Risk: Premature Optimization**
- **Description:** Spending excessive time on Tier 3 polish (color gradients, complex sway) before Tier 1 is validated
- **Likelihood:** Medium - Natural tendency to pursue perfect solution
- **Impact:** Low-Medium - Delays delivery, increases verification complexity
- **Mitigation:**
  - Implement and verify Tier 1 criteria completely before advancing
  - Use tiered implementation approach (basic → organic → polished)
  - Tag git commits with tier level for rollback capability
  - Define verification protocol with tier-specific checkpoints

### Regression Risks

**Risk: Breaking Existing Build Process**
- **Description:** Modifying `vite.config.js` or `package.json` in ways that break development or build commands
- **Likelihood:** Very Low - Intent constrains changes to feature files only
- **Impact:** High - Blocks development and deployment
- **Mitigation:**
  - Do not modify build configuration files unless absolutely necessary
  - Test `npm run dev`, `npm run build`, `npm run preview` commands in verification
  - Keep changes isolated to `src/` directory
  - Verify bundle size stays under 500KB threshold

**Risk: Overwriting Orbit 1 Without Learning**
- **Description:** Replacing existing files without understanding what caused the restart, repeating same mistakes
- **Likelihood:** Medium - Fresh start mentality may ignore prior context
- **Impact:** Medium - Wastes effort, risks repeating failed approach
- **Mitigation:**
  - Review Orbit 1 artifacts before implementation
  - Document specific differences in approach in proposal record
  - Preserve successful patterns from Orbit 1 if identifiable
  - Explicitly note lessons learned in verification protocol