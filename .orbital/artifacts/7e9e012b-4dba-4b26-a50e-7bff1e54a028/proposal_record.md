# Proposal Record: React Foundation - Binary Tree Fractal Simulation Project

## Interpreted Intent

This orbit requires building a React-based web application that renders an animated binary tree fractal on an HTML5 canvas. The core requirement is to create a visual demonstration of recursive tree generation starting from a single trunk at the bottom center of the canvas, with branches recursively splitting into left and right children. Each branch generation reduces in length and introduces subtle random angle variation to create an organic appearance.

The implementation must satisfy two sequential animation phases:

1. **Growth Phase:** The tree animates from trunk to full canopy over 3-5 seconds, with branches appearing progressively as if growing in real-time
2. **Sway Phase:** After growth completes, the entire tree structure continuously sways with wind-like motion, creating a gentle oscillating effect that persists indefinitely

The application targets Tier 2 acceptance criteria as the primary success measure: smooth animation at 50+ fps, 8-10 levels of recursion depth, organic random variation within ±15 degrees, and clear visual distinction between trunk and branches through color differentiation. Performance is critical — the implementation must maintain smooth frame rates on mid-range hardware without browser lag or freezing.

The project operates under strict technical constraints: React 18+ only for UI, HTML5 Canvas for rendering (no WebGL/SVG), no external graphics libraries beyond React core and Vite build tooling, and deterministic seeded randomness for reproducible testing. The architecture must maintain clean separation between React component lifecycle concerns and pure fractal algorithm logic.

This is Orbit 2 following a complete prior implementation attempt (Orbit 1), indicating that the previous approach had fundamental issues requiring a fresh start rather than incremental fixes. The new implementation must avoid repeating whatever architectural or algorithmic decisions caused the restart while learning from any successful patterns.

## Implementation Plan

### Phase 1: Seeded Random Number Generator (Foundation)

**File:** `src/utils/seededRandom.js`

Create a deterministic pseudo-random number generator using a Linear Congruential Generator (LCG) algorithm to ensure reproducible test outputs and consistent visual appearance across runs with the same seed.

**Implementation approach:**
- Export a `createSeededRandom(seed)` factory function that returns a closure-based generator
- Use LCG parameters: `a = 1664525`, `c = 1013904223`, `m = 2^32` (common high-quality constants)
- Internal state stored in closure variable, mutated on each call
- Return normalized values in [0, 1) range via division by `m`
- Default seed value of `42` for consistent baseline behavior

**Rationale:** Seeded randomness enables regression testing by allowing verification protocol to validate that specific seeds produce expected tree structures. Pure function design allows testing in isolation without React component complexity.

### Phase 2: Fractal Tree Algorithm (Core Logic)

**File:** `src/utils/fractalAlgorithm.js`

Implement pure functions that generate tree structure as a hierarchical data representation, separating algorithm logic from rendering concerns.

**Data structure:**
```javascript
{
  branches: [
    {
      startX, startY,     // Branch starting point
      endX, endY,         // Branch ending point
      angle,              // Branch angle in radians
      length,             // Branch length in pixels
      depth,              // Recursion depth (0 = trunk)
      thickness           // Line width for rendering
    },
    // ... all branches flattened into array
  ]
}
```

**Key functions:**

1. `generateTreeStructure(config)` - Entry point that initializes recursion
   - **Parameters:** `{ startX, startY, trunkLength, maxDepth, lengthScale, baseAngle, angleVariation, seed }`
   - **Returns:** Complete tree structure with all branches pre-calculated
   - **Process:** Initialize random generator, create trunk branch, call recursive generator, return flattened branch array

2. `generateBranch(parent, depth, maxDepth, random, config)` - Recursive branch generator
   - **Termination condition:** `depth >= maxDepth` returns empty array
   - **Logic:** 
     - Calculate left and right child angles using base angle ± random variation
     - Compute child branch length using `parent.length * lengthScale`
     - Calculate child start position from parent end position
     - Calculate child end position using trigonometry (`Math.cos`, `Math.sin`)
     - Calculate thickness as proportional to depth (`maxThickness * (1 - depth / maxDepth)`)
     - Recursively generate children for each branch
     - Return flattened array of current branch plus all descendants

3. `calculateBranchColor(depth, maxDepth)` - Color interpolation for trunk-to-leaf gradient
   - **Returns:** RGB color string interpolated from brown (`#4a3728`) to green (`#6b8e23`)
   - **Logic:** Linear interpolation based on `depth / maxDepth` ratio

**Configuration constants:**
```javascript
export const DEFAULT_CONFIG = {
  trunkLength: 120,
  maxDepth: 10,
  lengthScale: 0.7,
  baseAngle: Math.PI / 6,        // 30 degrees
  angleVariation: Math.PI / 12,  // ±15 degrees
  maxThickness: 8,
  seed: 42
};
```

**Rationale:** Pre-calculating the entire tree structure once during initialization avoids per-frame allocation and recursion during animation, addressing performance risk. Flattened array structure enables efficient iteration during rendering. Pure functions allow comprehensive unit testing without DOM or canvas dependencies.

### Phase 3: React Component with Canvas Integration

**File:** `src/components/FractalTree.jsx`

Implement the React component that manages canvas lifecycle, animation state machine, and orchestrates rendering by calling utility functions.

**Component structure:**

```javascript
import React, { useEffect, useRef, useState } from 'react';
import { generateTreeStructure, DEFAULT_CONFIG, calculateBranchColor } from '../utils/fractalAlgorithm.js';

function FractalTree() {
  // Canvas dimensions
  const CANVAS_WIDTH = 1000;
  const CANVAS_HEIGHT = 800;
  const GROWTH_DURATION = 4000; // 4 seconds in milliseconds
  
  // Refs for canvas context and animation frame ID
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const animationIdRef = useRef(null);
  const treeDataRef = useRef(null);
  const startTimeRef = useRef(null);
  
  // Animation state: 'growing', 'swaying'
  const [animationPhase, setAnimationPhase] = useState('growing');
  
  // Initialization effect - runs once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctxRef.current = canvas.getContext('2d');
    
    // Generate complete tree structure
    const startX = CANVAS_WIDTH / 2;
    const startY = CANVAS_HEIGHT - 50;
    
    treeDataRef.current = generateTreeStructure({
      ...DEFAULT_CONFIG,
      startX,
      startY
    });
  }, []);
  
  // Animation loop effect
  useEffect(() => {
    if (!ctxRef.current || !treeDataRef.current) return;
    
    const ctx = ctxRef.current;
    const tree = treeDataRef.current;
    
    function animate(timestamp) {
      // Initialize start time on first frame
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      if (animationPhase === 'growing') {
        drawGrowingTree(ctx, tree, elapsed);
        
        // Transition to swaying when growth completes
        if (elapsed >= GROWTH_DURATION) {
          setAnimationPhase('swaying');
          startTimeRef.current = timestamp; // Reset for sway phase
        }
      } else if (animationPhase === 'swaying') {
        drawSwayingTree(ctx, tree, elapsed);
      }
      
      animationIdRef.current = requestAnimationFrame(animate);
    }
    
    animationIdRef.current = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [animationPhase]);
  
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#87ceeb' }}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid #333' }}
      />
    </div>
  );
}

export default FractalTree;
```

**Rendering functions (within component scope):**

1. `drawGrowingTree(ctx, tree, elapsed)` - Growth phase rendering
   - Calculate growth progress: `progress = Math.min(elapsed / GROWTH_DURATION, 1)`
   - Determine visible branch count: `visibleCount = Math.floor(tree.branches.length * progress)`
   - Iterate through first `visibleCount` branches
   - For each branch: set stroke style to branch color, set line width to thickness, draw line from start to end
   - Use batch drawing: single `beginPath()`, multiple `moveTo()`/`lineTo()` calls, single `stroke()`

2. `drawSwayingTree(ctx, tree, elapsed)` - Sway phase rendering
   - Calculate sway offset using sinusoidal function: `sway = Math.sin(elapsed * 0.001) * amplitude`
   - Amplitude scales with branch depth (tips move more than trunk): `amplitude = depth * 2`
   - For each branch: apply sway rotation around parent connection point, draw with transformed coordinates
   - Use canvas transformations: `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, `ctx.restore()`

**Rationale:** Using refs for canvas context and tree data prevents unnecessary re-renders while maintaining access to mutable values across animation frames. Separate effects for initialization and animation loop provide clear lifecycle boundaries. Explicit animation state machine prevents race conditions between growth and sway phases. Time-based animation (milliseconds elapsed) ensures consistent speed regardless of frame rate variations.

### Phase 4: Application Integration

**File:** `src/App.jsx`

Modify the root component to render the FractalTree component as the sole application content.

**Implementation:**
```javascript
import React from 'react';
import FractalTree from './components/FractalTree.jsx';

function App() {
  return <FractalTree />;
}

export default App;
```

**Rationale:** Minimal composition layer maintains separation of concerns. No additional state management or routing needed for single-component application.

**File:** `src/index.jsx`

Verify that the existing bootstrap code correctly mounts the App component. No modifications expected unless the file has non-standard structure.

**Expected content:**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**File:** `public/index.html`

Verify that the HTML template includes a `<div id="root">` mount point. No modifications expected.

### Phase 5: Documentation Update

**File:** `README.md`

Update the placeholder content with project-specific documentation.

**Content structure:**
- Project title and description
- Prerequisites (Node.js 18+)
- Installation instructions (`npm install`)
- Development commands (`npm run dev`, `npm run build`, `npm run preview`)
- Architecture overview (brief explanation of component and utility structure)
- Configuration parameters (how to adjust tree depth, colors, animation speed)

### Implementation Order

1. **First:** `src/utils/seededRandom.js` - Foundation with no dependencies
2. **Second:** `src/utils/fractalAlgorithm.js` - Depends on seededRandom
3. **Third:** `src/components/FractalTree.jsx` - Depends on fractalAlgorithm
4. **Fourth:** `src/App.jsx` - Integrates FractalTree
5. **Fifth:** Verify `src/index.jsx` and `public/index.html` - No changes expected
6. **Last:** `README.md` - Documentation after implementation complete

### Dependencies and Constraints

**No new package dependencies required.** The implementation uses only:
- React 18.2.0 (already in `package.json`)
- React-DOM 18.2.0 (already in `package.json`)
- HTML5 Canvas API (browser native)
- `window.requestAnimationFrame` (browser native)
- Standard JavaScript Math functions

**Build system:** Existing Vite configuration remains unchanged. No modifications to `vite.config.js` or `package.json`.

**Browser compatibility:** ES2020+ features used include optional chaining (`?.`), nullish coalescing (`??`), and arrow functions. All target browsers (Chrome, Firefox, Safari, Edge evergreen versions) support these features.

## Risk Surface

### Performance Risks and Mitigations

**Canvas rendering bottleneck (High likelihood, High impact):**
- **Risk:** Drawing 256-2048 lines per frame at 60fps requires 15,360-122,880 line operations per second, potentially exceeding browser rendering capacity
- **Mitigation implemented:** 
  - Pre-calculate all branch positions during initialization (one-time cost)
  - Use batch drawing with single `beginPath()`/`stroke()` call per frame
  - Store tree structure in flat array for cache-friendly iteration
  - Avoid object allocation inside animation loop
  - Use integer pixel coordinates to reduce subpixel rendering overhead
- **Verification:** Profile with Chrome DevTools Performance tab, measure frame times under 16.67ms (60fps) or 20ms (50fps minimum)

**Stack overflow from recursion (Medium likelihood, Critical impact):**
- **Risk:** Maximum depth of 12 creates 4096 stack frames during tree generation, approaching JavaScript call stack limits (typically 10,000-50,000 frames)
- **Mitigation implemented:**
  - Hard-coded `MAX_DEPTH` constant with defensive bounds checking
  - Recursion occurs only during initialization, not per-frame
  - Tail-call optimization candidate (flatten children into parent return)
  - Iterative alternative available if recursion proves unstable
- **Verification:** Test explicitly with `maxDepth: 12` configuration, monitor for RangeError exceptions

**Animation loop memory leak (Low likelihood, Medium impact):**
- **Risk:** Forgetting to cancel `requestAnimationFrame` causes continued execution after component unmount, accumulating event listeners and memory
- **Mitigation implemented:**
  - Store animation frame ID in ref (`animationIdRef`)
  - Return cleanup function from useEffect that calls `cancelAnimationFrame()`
  - Test in React StrictMode which intentionally double-mounts components
- **Verification:** Mount/unmount component multiple times, check browser memory profiler for leaks

### Visual Quality Risks and Mitigations

**Random variation producing chaotic appearance (Medium likelihood, Medium impact):**
- **Risk:** Angle variation exceeding ±15 degrees or insufficient clamping creates visually unnatural trees
- **Mitigation implemented:**
  - Named constant `ANGLE_VARIATION = Math.PI / 12` (exactly 15 degrees)
  - Deterministic seeded random allows testing specific seeds
  - Color gradient provides visual coherence even with extreme angles
- **Verification:** Generate trees with seeds 1-100, visually inspect for outliers, adjust constants if needed

**Animation timing inconsistency (Medium likelihood, Medium impact):**
- **Risk:** Branches appear at uneven intervals or sway motion stutters due to frame rate variations
- **Mitigation implemented:**
  - Time-based animation using `timestamp` parameter from requestAnimationFrame
  - Growth progress calculated as `elapsed / GROWTH_DURATION` ratio
  - Sway motion uses continuous sinusoidal function, not frame-dependent increments
  - State machine ensures clean transition between growth and sway phases
- **Verification:** Throttle browser to 30fps in DevTools, verify animation still appears smooth

**Color gradient not visible (Low likelihood, Low impact):**
- **Risk:** Brown-to-green interpolation too subtle to perceive, trunk and leaves appear same color
- **Mitigation implemented:**
  - Distinct base colors: trunk `#4a3728` (dark brown), leaves `#6b8e23` (olive green)
  - Linear interpolation based on depth ratio creates gradual transition
  - Can increase contrast by adjusting RGB endpoint values if needed
- **Verification:** Visual inspection at full tree depth, verify trunk and tips are distinguishable

### Integration Risks and Mitigations

**React StrictMode double-execution (Medium likelihood, Low impact):**
- **Risk:** Development mode StrictMode causes useEffect to run twice, potentially initializing two animation loops
- **Mitigation implemented:**
  - Effects designed to be idempotent (safe to run multiple times)
  - Animation ID ref ensures only one active loop (second initialization cancels first)
  - Cleanup function properly cancels animation frame
- **Verification:** Run `npm run dev` with StrictMode enabled, verify single animation loop in console

**Canvas ref timing (Low likelihood, High impact):**
- **Risk:** Accessing `canvasRef.current` before DOM mount causes null reference error
- **Mitigation implemented:**
  - Guard clause: `if (!canvas) return;` before all canvas operations
  - Canvas operations occur inside useEffect (after mount)
  - Context stored in ref after successful acquisition
- **Verification:** Test component mounting, check browser console for errors

**Hot module replacement (HMR) issues (Low likelihood, Low impact):**
- **Risk:** Vite HMR during development causes stale animation loops or duplicate event listeners
- **Mitigation implemented:**
  - Proper cleanup functions in all useEffect hooks
  - Animation ID stored in ref prevents multiple concurrent loops
  - HMR-safe design with no module-level mutable state
- **Verification:** Make code changes during `npm run dev`, verify tree re-renders correctly

### Scope and Complexity Risks

**Over-engineering Tier 3 features (Medium likelihood, Low impact):**
- **Risk:** Implementing advanced sway physics, color gradients, or responsive canvas before validating Tier 1 criteria
- **Mitigation implemented:**
  - Implementation plan prioritizes Tier 1 functionality first
  - Tier 2 features (color, smooth sway) included but can be simplified if time-constrained
  - Tier 3 features (complex motion, coordinated timing) explicitly deferred
- **Verification:** Ensure Tier 1 criteria pass before adding polish

**Repeating Orbit 1 mistakes (Medium likelihood, Medium impact):**
- **Risk:** Implementing same architectural approach that caused restart without understanding root cause
- **Mitigation implemented:**
  - Proposal represents fresh analysis independent of Orbit 1 artifacts
  - Different data structure approach (flattened array vs nested tree)
  - Different animation strategy (time-based progress vs frame-based state)
  - Emphasis on performance from initialization rather than post-hoc optimization
- **Verification:** Review Orbit 1 artifacts post-implementation to document differences

## Scope Estimate

### Complexity Assessment

**Overall Complexity: Medium**

The implementation involves moderate algorithmic complexity (recursive tree generation, trigonometric calculations, animation state management) but operates within well-understood domains (Canvas API, React component lifecycle) with no novel computer graphics techniques or advanced mathematics required.

**Complexity factors:**
- **Algorithm design:** Recursive tree generation is textbook fractal algorithm with clear termination conditions
- **Performance optimization:** Pre-calculation strategy avoids real-time computation complexity
- **Animation coordination:** Two-phase state machine is straightforward finite automaton
- **Integration surface:** Single-component application with minimal dependencies
- **Testing surface:** Pure functions enable unit testing, visual verification requires human judgment

**Low complexity factors:**
- No external API integration or data fetching
- No authentication or security boundaries
- No state synchronization across components
- No routing or navigation logic
- No build system modifications

**Medium complexity factors:**
- Canvas rendering performance requires profiling and tuning
- Recursive algorithm needs careful termination logic
- Animation timing coordination across thousands of branches
- Visual quality assessment requires subjective human judgment

### Work Phases and Orbit Count

**Estimated Orbit Count: 1 orbit** (this current orbit)

All implementation work fits within a single orbit scope because:
1. Clear technical specification with minimal ambiguity
2. No external dependencies or integration points
3. Isolated feature implementation with no cross-cutting concerns
4. Well-defined acceptance criteria with measurable thresholds

**Phase breakdown within this orbit:**

| Phase | Estimated Effort | Complexity | Risk Level |
|-------|-----------------|------------|------------|
| Seeded random utility | 15 minutes | Low | Low |
| Fractal algorithm logic | 45 minutes | Medium | Medium |
| React component + canvas | 60 minutes | Medium | Medium |
| Application integration | 15 minutes | Low | Low |
| Initial testing & tuning | 30 minutes | Medium | High |
| Documentation update | 15 minutes | Low | Low |
| **Total implementation** | **3 hours** | **Medium** | **Medium** |

**Post-implementation verification phase:**
- Human visual inspection: 15 minutes
- Performance profiling: 15 minutes
- Cross-browser testing: 15 minutes
- Acceptance criteria validation: 30 minutes
- **Total verification:** 1.25 hours

**Total orbit duration estimate: 4-5 hours** (implementation + verification)

### Confidence Level

**High confidence (85%)** in meeting Tier 1 and Tier 2 acceptance criteria within single orbit:
- Tier 1 requirements are mechanical and testable (build succeeds, canvas renders, recursion occurs)
- Tier 2 requirements achievable with proposed design (smooth animation, color differentiation, sway motion)
- Performance mitigations address primary risk surface
- Fresh approach avoids repeating Orbit 1 failure patterns

**Medium confidence (60%)** in achieving all Tier 3 polish features:
- Coordinated timing for simultaneous leaf arrival is algorithmically complex
- 60fps consistency on all hardware profiles depends on browser optimization
- Subtle visual quality (gradients, no artifacts) may require parameter tuning iteration
- Time constraints may require accepting Tier 2 as successful completion

### Scaling Considerations

**If implementation exceeds single orbit scope:**

**Fallback strategy:**
1. Deliver Tier 1 functionality in current orbit as minimum viable product
2. Create follow-up orbit for Tier 2 enhancements (animation smoothness, color)
3. Defer Tier 3 polish to optional future orbit

**Simplification options if scope needs reduction:**
- Remove sway animation (deliver growth only)
- Reduce maximum depth to 8 (256 branches instead of 1024)
- Use single color for all branches (eliminate gradient complexity)
- Accept 30fps performance target instead of 60fps

**Extension options if scope allows additional work:**
- Implement Tier 3 features (thickness variation, coordinated timing)
- Add simple UI controls for depth and color (outside current intent but low effort)
- Create additional seeded random variations for visual diversity
- Add README documentation for extending/customizing the tree

## Human Modifications

Pending human review.