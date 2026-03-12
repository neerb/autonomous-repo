# Verification Protocol: React Foundation - Binary Tree Fractal Simulation Project

## Automated Gates

### Build and Compilation Gates

**Gate 1.1: Development Server Start**
- **Command:** `npm run dev`
- **Expected Output:** Vite dev server starts without errors, displays local URL (e.g., `http://localhost:5173`)
- **Pass Criteria:** 
  - Exit code 0
  - No compilation errors in console
  - Server responds to HTTP requests within 3 seconds
- **Failure Response:** Block merge, review build configuration and dependency integrity
- **Intent Mapping:** Tier 1 acceptance criterion "React application builds successfully with `npm run dev` and loads without console errors"

**Gate 1.2: Production Build**
- **Command:** `npm run build`
- **Expected Output:** Vite creates optimized production bundle in `dist/` directory
- **Pass Criteria:**
  - Exit code 0
  - No TypeScript/ESLint errors
  - Bundle size under 500KB total (verified via `du -sh dist/`)
  - Generated files include `index.html`, JavaScript chunks, and assets
- **Failure Response:** Block merge, investigate bundle bloat or build errors
- **Intent Mapping:** Intent measurable threshold "Bundle Size: Under 500KB total production build output"

**Gate 1.3: Preview Server**
- **Command:** `npm run preview` (after successful build)
- **Expected Output:** Production preview server starts and serves built application
- **Pass Criteria:**
  - Exit code 0
  - Server starts on configured port
  - Application loads in browser without 404 errors
- **Failure Response:** Block merge, verify build artifacts and server configuration
- **Intent Mapping:** Tier 1 acceptance criterion for production readiness

### Runtime Console Gates

**Gate 2.1: Console Error Check**
- **Execution:** Open application in Chrome DevTools console
- **Pass Criteria:**
  - Zero errors in console during initial load
  - Zero errors during growth animation phase (0-5 seconds)
  - Zero errors during sway animation phase (5-60 seconds observed)
  - No React warnings about keys, refs, or lifecycle methods
  - No "Failed to cancel animation frame" warnings
- **Test Inputs:** Load page fresh, observe for 60 seconds
- **Expected Output:** Clean console with no red error messages or yellow warnings
- **Failure Response:** Block merge, fix console errors before proceeding
- **Intent Mapping:** Tier 1 acceptance criterion "loads without console errors"

**Gate 2.2: React StrictMode Compatibility**
- **Execution:** Verify `src/index.jsx` wraps App in `<React.StrictMode>`
- **Pass Criteria:**
  - StrictMode enabled in development build
  - No double-execution issues (verify single animation loop active)
  - No "Cannot update during existing state transition" warnings
  - Cleanup functions execute properly on unmount
- **Test Inputs:** Hot reload component 3 times, mount/unmount via conditional render
- **Expected Output:** Stable behavior with no StrictMode warnings
- **Failure Response:** Fix effect cleanup and idempotency issues
- **Intent Mapping:** Context Package risk mitigation for "React StrictMode double-execution"

### Performance Benchmarks

**Gate 3.1: Frame Rate Measurement**
- **Tool:** Chrome DevTools Performance Profiler
- **Execution:**
  1. Open DevTools → Performance tab
  2. Start recording
  3. Load application and observe full growth + 10 seconds of sway
  4. Stop recording
  5. Analyze FPS graph in timeline
- **Pass Criteria:**
  - Minimum FPS: 45fps during growth animation
  - Target FPS: 50fps+ during sway animation
  - No frame drops below 45fps for more than 2 consecutive frames
  - Main thread frames complete within 20ms (50fps) or ideally 16.67ms (60fps)
- **Test Configurations:**
  - Depth 8 (256 branches): Must maintain 60fps
  - Depth 10 (1024 branches): Must maintain 50fps minimum
  - Depth 12 (4096 branches): Must maintain 45fps minimum
- **Failure Response:** If FPS < 45, investigate rendering optimization, potentially reduce max depth or simplify sway algorithm
- **Intent Mapping:** 
  - Tier 1: "Growth animation completes within 5 seconds"
  - Tier 2: "Animation maintains 50+ fps during both growth and sway phases"
  - Intent measurable threshold: "Frame Rate: 45fps minimum, 60fps target"

**Gate 3.2: Initial Load Time**
- **Tool:** Chrome DevTools Performance → Network tab
- **Execution:**
  1. Clear browser cache
  2. Open Network tab, enable "Disable cache"
  3. Record timeline
  4. Load application
  5. Measure time to first canvas pixel drawn
- **Pass Criteria:**
  - First tree pixel visible within 1 second of navigation
  - DOMContentLoaded event fires within 500ms
  - All assets loaded within 2 seconds on simulated Fast 3G
- **Test Environment:** Chrome DevTools Network throttling → Fast 3G profile
- **Failure Response:** Optimize bundle splitting, investigate slow initialization
- **Intent Mapping:** Intent measurable threshold "Initial Load: First tree pixel visible within 1 second of page load"

**Gate 3.3: Memory Stability**
- **Tool:** Chrome DevTools Memory Profiler
- **Execution:**
  1. Open Memory tab
  2. Take heap snapshot (baseline)
  3. Let animation run for 2 minutes
  4. Take second heap snapshot
  5. Let animation run for 5 more minutes
  6. Take third heap snapshot
  7. Compare memory growth between snapshots
- **Pass Criteria:**
  - Memory growth < 5MB between snapshot 2 and 3 (stable state)
  - No detached DOM nodes accumulating
  - Animation frame IDs properly canceled (verify in snapshot detached listeners)
- **Failure Response:** Investigate memory leaks in animation loop, check cleanup functions
- **Intent Mapping:** Proposal risk mitigation for "Animation loop memory leak"

### Algorithm Correctness Gates

**Gate 4.1: Recursion Depth Validation**
- **Test Cases:**
  - **Input:** `maxDepth: 6` → **Expected:** 64 branches total (2^6)
  - **Input:** `maxDepth: 8` → **Expected:** 256 branches total (2^8)
  - **Input:** `maxDepth: 10` → **Expected:** 1024 branches total (2^10)
  - **Input:** `maxDepth: 12` → **Expected:** 4096 branches total (2^12)
- **Execution:** Log `treeDataRef.current.branches.length` in browser console after generation
- **Pass Criteria:**
  - Branch count matches 2^depth exactly for each test depth
  - No RangeError (stack overflow) exceptions at depth 12
  - Tree generation completes within 500ms at depth 12
- **Failure Response:** Investigate recursive algorithm termination or switch to iterative approach
- **Intent Mapping:** 
  - Tier 1: "At least 6 levels of recursive branching occur"
  - Intent measurable threshold: "Recursion Depth: 8 minimum, 10 target, 12 maximum"

**Gate 4.2: Binary Branching Validation**
- **Test Case:** Verify each branch (except leaves) spawns exactly 2 children
- **Execution:** Add validation function to `fractalAlgorithm.js`:
  ```javascript
  export function validateTreeStructure(tree) {
    const depthCounts = null;
    tree.branches.forEach(b => {
      depthCounts[b.depth] = (depthCounts[b.depth] || 0) + 1;
    });
    
    for (let d = 0; d < maxDepth - 1; d++) {
      if (depthCounts[d] * 2 !== depthCounts[d + 1]) {
        return false; // Not binary
      }
    }
    return true;
  }
  ```
- **Pass Criteria:** Function returns `true` for all test depths (6, 8, 10, 12)
- **Failure Response:** Fix recursive branch generation logic
- **Intent Mapping:** Tier 1: "Each branch spawns exactly two child branches (left and right)"

**Gate 4.3: Seeded Random Determinism**
- **Test Cases:**
  - **Seed 42, Run 1:** Generate tree, record first 10 branch angles
  - **Seed 42, Run 2:** Generate tree with same seed, record first 10 branch angles
  - **Expected:** Angles match exactly between runs
- **Execution:** 
  ```javascript
  const tree1 = generateTreeStructure({ ...DEFAULT_CONFIG, seed: 42 });
  const tree2 = generateTreeStructure({ ...DEFAULT_CONFIG, seed: 42 });
  const angles1 = tree1.branches.slice(0, 10).map(b => b.angle);
  const angles2 = tree2.branches.slice(0, 10).map(b => b.angle);
  console.assert(JSON.stringify(angles1) === JSON.stringify(angles2));
  ```
- **Pass Criteria:** Assertion passes, arrays are identical
- **Failure Response:** Fix seeded random implementation to be truly deterministic
- **Intent Mapping:** Intent constraint "Use seeded random number generation to ensure reproducible outputs for testing"

**Gate 4.4: Branch Length Scaling**
- **Test Case:** Verify branch length decreases by `lengthScale` factor at each depth
- **Execution:**
  ```javascript
  const config = { ...DEFAULT_CONFIG, lengthScale: 0.7, trunkLength: 100 };
  const tree = generateTreeStructure(config);
  const depth0 = tree.branches.filter(b => b.depth === 0)[0]; // Trunk
  const depth1 = tree.branches.filter(b => b.depth === 1)[0]; // First child
  const depth2 = tree.branches.filter(b => b.depth === 2)[0]; // Grandchild
  console.assert(Math.abs(depth1.length - depth0.length * 0.7) < 0.01);
  console.assert(Math.abs(depth2.length - depth1.length * 0.7) < 0.01);
  ```
- **Pass Criteria:** 
  - Assertions pass (within 0.01 pixel tolerance for floating point)
  - Minimum scaling factor 0.7 maintained (Intent constraint)
  - Scaling between 0.65-0.75 for Tier 2 compliance
- **Failure Response:** Fix branch length calculation in recursive generator
- **Intent Mapping:** 
  - Tier 1: "Branch length decreases with each generation (minimum 70% scaling factor per level)"
  - Tier 2: "Branch scaling factor between 0.65-0.75 creates balanced proportions"

### Animation State Machine Gates

**Gate 5.1: Growth Phase Duration**
- **Test Case:** Measure elapsed time from load to sway phase start
- **Execution:** Add console timestamps:
  ```javascript
  // In growing phase completion:
  console.log('Growth complete at:', elapsed, 'ms');
  ```
- **Pass Criteria:**
  - Growth completes between 3000ms and 5000ms
  - Phase transition occurs at exactly `GROWTH_DURATION` constant value
  - No premature transition to sway before all branches visible
- **Failure Response:** Adjust `GROWTH_DURATION` constant or fix timing calculation
- **Intent Mapping:** 
  - Tier 1: "Growth animation completes within 5 seconds from initial render"
  - Intent measurable threshold: "Growth Duration: 3-5 seconds from start to full canopy"

**Gate 5.2: Phase Transition Integrity**
- **Test Case:** Verify clean transition from growth to sway without visual artifacts
- **Execution:**
  1. Record video of animation cycle
  2. Review frame-by-frame at transition point
  3. Check console for state change log
- **Pass Criteria:**
  - `animationPhase` state changes from 'growing' to 'swaying' exactly once
  - No intermediate undefined or null states
  - `startTimeRef` resets at transition (timestamp reinitializes)
  - No canvas flicker or empty frames at transition
- **Failure Response:** Fix state machine logic in animation loop
- **Intent Mapping:** Tier 2: "Sway animation begins automatically after growth completes"

**Gate 5.3: Continuous Sway Persistence**
- **Test Case:** Verify sway continues indefinitely without stopping
- **Execution:** 
  1. Load application
  2. Wait for growth to complete
  3. Observe sway for 5 minutes
  4. Check animation frame ID remains valid
- **Pass Criteria:**
  - Sway motion continues for full 5-minute observation
  - No freezing or stuttering
  - Animation frame callback continues firing (check FPS counter)
  - No transition back to idle or stopped state
- **Failure Response:** Investigate animation loop termination conditions
- **Intent Mapping:** Intent desired outcome "continuously sways with gentle, wind-like motion that persists indefinitely"

## Human Verification Points

### Visual Quality Assessment

**Verification Point A: Tree Structure Naturalness**
- **Reviewer Action:**
  1. Load application with default seed (42)
  2. Observe fully grown tree structure
  3. Generate 5 additional trees with seeds 1, 10, 100, 256, 999
  4. Assess visual quality against criteria below
- **Pass Criteria (Subjective):**
  - Tree appears organic and natural, not mechanical or symmetric
  - Branch angles vary visibly but not chaotically
  - Overall silhouette resembles a deciduous tree canopy
  - No branches overlap excessively or create visual tangles
  - Balance between left and right sides appears natural (not perfectly symmetric)
- **Tier Requirements:**
  - **Tier 1:** Tree structure is recognizable and stable
  - **Tier 2:** Tree exhibits natural-looking random variation
  - **Tier 3:** Tree could pass for a realistic botanical illustration
- **Failure Response:** If trees appear unnatural, adjust `angleVariation` constant, review random distribution
- **Intent Mapping:** Tier 2: "Branch angles vary randomly within ±15 degrees from base angle to create natural appearance"

**Verification Point B: Color Gradient Visibility**
- **Reviewer Action:**
  1. Observe fully grown tree at depth 10
  2. Compare trunk (depth 0) color to leaf tips (depth 10)
  3. Inspect intermediate branches (depth 3, 5, 7)
- **Pass Criteria:**
  - Trunk appears distinctly darker/browner than leaf tips
  - Leaf tips appear noticeably greener than trunk
  - Gradient is smooth and continuous (no abrupt color changes)
  - Intermediate branches show visible color progression
- **Reference Values:**
  - Trunk: Should approximate `#4a3728` (dark brown)
  - Leaves: Should approximate `#6b8e23` (olive green)
- **Failure Response:** If gradient not visible, increase color contrast or adjust interpolation formula
- **Intent Mapping:** Tier 2: "Color differentiation between trunk (darker) and branches (lighter/greener)"

**Verification Point C: Animation Smoothness**
- **Reviewer Action:**
  1. Observe growth animation from start to completion
  2. Observe sway animation for 30 seconds
  3. Compare perceived smoothness against criteria
- **Pass Criteria (Growth):**
  - Branches appear progressively without jumps or gaps
  - Growth rate feels consistent across all branch generations
  - No visible stuttering or frame skipping
  - Final branches complete without abrupt stop
- **Pass Criteria (Sway):**
  - Motion is continuous and fluid, not choppy
  - Sway amplitude increases visibly from trunk to tips
  - Motion follows a smooth sinusoidal pattern (not linear or jerky)
  - No sudden direction changes or acceleration spikes
- **Tier Requirements:**
  - **Tier 1:** Animation is functional and visible
  - **Tier 2:** Animation is smooth and natural-looking
  - **Tier 3:** Animation is indistinguishable from high-quality motion graphics
- **Failure Response:** If animation stutters, profile performance, consider reducing branch count or simplifying sway
- **Intent Mapping:** 
  - Tier 2: "Growth animation proceeds smoothly with consistent timing"
  - Tier 2: "Sway motion affects all branches proportionally (tip branches move more than trunk)"

**Verification Point D: Sway Motion Realism**
- **Reviewer Action:**
  1. Observe sway for 1 full minute
  2. Compare motion to real tree swaying in wind
  3. Assess whether motion feels "wind-like" per intent description
- **Pass Criteria:**
  - Motion resembles gentle breeze, not earthquake or vibration
  - Amplitude is subtle, not exaggerated (tips move ~20-40 pixels max)
  - Frequency is slow enough to appear natural (period ~3-6 seconds per cycle)
  - Motion has organic quality, not robotic repetition
  - Tips move more than trunk (proportional scaling visible)
- **Failure Response:** Adjust sway parameters (amplitude, frequency) for more natural appearance
- **Intent Mapping:** 
  - Intent desired outcome: "gently swaying as if in the wind"
  - Tier 3: "Sway motion uses sinusoidal easing for smooth, realistic wind effect"

### Architecture and Code Quality

**Verification Point E: Component Structure Compliance**
- **Reviewer Action:**
  1. Open `src/components/FractalTree.jsx` in code editor
  2. Review component organization and patterns
  3. Verify separation of concerns
- **Pass Criteria:**
  - Component uses functional React with hooks (no class components)
  - Canvas operations isolated in rendering functions (`drawGrowingTree`, `drawSwayingTree`)
  - No business logic mixed into JSX return statement
  - Refs used appropriately for canvas context and animation ID
  - State used only for animation phase tracking
  - Effects have proper dependencies and cleanup functions
- **Code Smells to Reject:**
  - Canvas operations outside useEffect hooks
  - Missing cleanup in animation loop effect
  - State updates inside render function
  - Direct DOM manipulation outside canvas context
- **Failure Response:** Refactor component to follow React best practices
- **Intent Mapping:** Intent constraint "Maintain clear separation between rendering logic (canvas manipulation) and React component lifecycle"

**Verification Point F: Utility Function Purity**
- **Reviewer Action:**
  1. Open `src/utils/fractalAlgorithm.js` and `src/utils/seededRandom.js`
  2. Review function signatures and implementations
  3. Verify no side effects or external dependencies
- **Pass Criteria:**
  - All exported functions are pure (same inputs → same outputs)
  - No module-level mutable state (except closure variables in seeded random)
  - No React imports or dependencies
  - No DOM access or global variable mutation
  - Functions can be tested in isolation without mocks
- **Failure Response:** Refactor utilities to remove side effects and external dependencies
- **Intent Mapping:** Context Package pattern "Pure Function Structure: Utilities should be stateless pure functions that can be tested independently"

**Verification Point G: Performance Optimization Evidence**
- **Reviewer Action:**
  1. Review component implementation for performance patterns
  2. Check for unnecessary re-renders or allocations
  3. Verify tree structure pre-calculation
- **Pass Criteria:**
  - Tree structure generated once during mount (in initialization effect)
  - No object allocation inside animation loop
  - Canvas clear and redraw uses efficient batch operations
  - No array copies or transformations per frame
  - Refs used to avoid re-render triggers
- **Anti-patterns to Reject:**
  - Generating tree structure per frame
  - Calling expensive functions inside render loop
  - Creating new objects/arrays in animation callback
  - Setting state on every frame
- **Failure Response:** Refactor to pre-calculate and cache expensive operations
- **Intent Mapping:** Proposal risk mitigation "Pre-calculate tree structure once during initialization rather than per-frame"

### Cross-Browser Compatibility

**Verification Point H: Multi-Browser Rendering**
- **Reviewer Action:**
  1. Test application in Chrome (latest)
  2. Test application in Firefox (latest)
  3. Test application in Safari (latest)
  4. Test application in Edge (latest)
- **Pass Criteria:**
  - Application loads and renders correctly in all browsers
  - Animation performance acceptable (subjective smoothness check)
  - No browser-specific console errors
  - Visual appearance consistent (colors, dimensions match)
  - Frame rate within 10fps across browsers (e.g., if Chrome hits 60fps, Firefox should achieve 50fps+)
- **Known Acceptable Differences:**
  - Safari may render slightly slower due to canvas optimization differences
  - Firefox may show minor color rendering variations due to color space handling
- **Failure Response:** If critical browser incompatibility found, investigate browser-specific API usage
- **Intent Mapping:** Intent constraint "Target modern evergreen browsers (Chrome, Firefox, Safari, Edge) with ES2020+ feature set"

### Edge Case Validation

**Verification Point I: Boundary Depth Configurations**
- **Reviewer Action:**
  1. Manually modify `DEFAULT_CONFIG.maxDepth` to boundary values
  2. Test depth values: 1, 6, 8, 10, 12, 15
  3. Observe behavior and performance
- **Pass Criteria:**
  - **Depth 1:** Displays trunk only, no crash
  - **Depth 6:** Fast rendering, Tier 1 minimum achieved
  - **Depth 8:** Good performance, Tier 2 minimum achieved
  - **Depth 10:** Target performance, Tier 2 target achieved
  - **Depth 12:** Acceptable performance, Tier 2 maximum achieved
  - **Depth 15:** Graceful degradation (slower but no crash) OR hard limit enforced
- **Failure Response:** If depth 12+ crashes, enforce maximum depth limit in algorithm
- **Intent Mapping:** 
  - Intent constraint "Limit tree depth to prevent stack overflow and maintain visual clarity; typical range 8-12 levels"
  - Intent measurable threshold "Recursion Depth: 8 minimum, 10 target, 12 maximum"

**Verification Point J: Component Lifecycle Stability**
- **Reviewer Action:**
  1. Add conditional rendering to App component:
     ```javascript
     const [show, setShow] = useState(true);
     return (
       <div>
         <button onClick={() => setShow(!show)}>Toggle</button>
         {show && <FractalTree />}
       </div>
     );
     ```
  2. Toggle component mount/unmount 10 times
  3. Observe browser memory and console
- **Pass Criteria:**
  - Component mounts and unmounts cleanly each time
  - No console errors or warnings on unmount
  - No "Cannot update unmounted component" warnings
  - Memory returns to baseline after unmount (check DevTools Memory tab)
  - No orphaned animation frames continue after unmount
- **Failure Response:** Fix cleanup functions in useEffect hooks
- **Intent Mapping:** Proposal risk mitigation "Animation loop memory leak"

## Intent Traceability

### Tier 1: Minimum Viable Visualization

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|---------------------|
| React application builds successfully with `npm run dev` | Automated | Gate 1.1 |
| Loads without console errors | Automated | Gate 2.1 |
| Canvas element renders and occupies visible viewport area (minimum 800x600px) | Human | Point E (component review) |
| Tree grows from bottom-center starting position with visible trunk | Human | Point A (visual assessment) |
| At least 6 levels of recursive branching occur | Automated | Gate 4.1 (depth validation) |
| Each branch spawns exactly two child branches (left and right) | Automated | Gate 4.2 (binary branching) |
| Branch length decreases with each generation (minimum 70% scaling factor per level) | Automated | Gate 4.4 (length scaling) |
| Growth animation completes within 5 seconds from initial render | Automated | Gate 5.1 (growth duration) |
| Tree structure remains visible and stable after growth completes | Human | Point C (animation smoothness) |

### Tier 2: Organic & Animated (Target)

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|---------------------|
| Branch angles vary randomly within ±15 degrees from base angle to create natural appearance | Human | Point A (naturalness assessment) |
| Growth animation proceeds smoothly with consistent timing across all branch generations | Human | Point C (animation smoothness) |
| Sway animation begins automatically after growth completes | Automated | Gate 5.2 (phase transition) |
| Sway motion affects all branches proportionally (tip branches move more than trunk) | Human | Point D (sway realism) |
| Animation maintains 50+ fps during both growth and sway phases | Automated | Gate 3.1 (frame rate measurement) |
| Tree depth reaches 8-10 levels producing visually complete canopy | Automated | Gate 4.1 with depth 8-10 |
| Branch scaling factor between 0.65-0.75 creates balanced proportions | Automated | Gate 4.4 with config check |
| Color differentiation between trunk (darker) and branches (lighter/greener) | Human | Point B (color gradient visibility) |

### Tier 3: Polished Experience (Stretch Goals)

| Acceptance Criterion | Verification Method | Gate/Point Reference |
|---------------------|---------------------|---------------------|
| Consistent 60fps throughout all animation phases | Automated | Gate 3.1 (target 60fps) |
| Sway motion uses sinusoidal easing for smooth, realistic wind effect | Human | Point D (sway realism review) |
| Multiple sway parameters (amplitude, frequency, phase) create complex motion | Human | Point D (motion complexity) |
| Branch thickness decreases proportionally to length | Human | Point A (visual review for thickness) |
| Subtle color gradient from brown trunk to green leaf tips | Human | Point B (gradient smoothness) |
| Tree depth of 10-12 levels with graceful termination at natural endpoints | Automated | Gate 4.1 with depth 10-12 |
| Growth animation timing coordinated so leaf tips reach final position simultaneously | Human | Point C (growth coordination) |
| No visual artifacts, flickering, or canvas clearing flashes | Human | Point C (artifact detection) |
| Application loads and begins animation within 500ms on mid-range hardware | Automated | Gate 3.2 (initial load time) |

### Measurable Thresholds

| Threshold | Target Value | Verification Method | Gate/Point Reference |
|-----------|-------------|---------------------|---------------------|
| Frame Rate | 45fps minimum, 60fps target | Automated | Gate 3.1 |
| Initial Load | First tree pixel visible within 1 second | Automated | Gate 3.2 |
| Growth Duration | 3-5 seconds from start to full canopy | Automated | Gate 5.1 |
| Recursion Depth | 8 minimum, 10 target, 12 maximum | Automated | Gate 4.1 |
| Branch Count | Approximately 256-2048 total branches | Automated | Gate 4.1 (derived from depth) |
| Bundle Size | Under 500KB total production build output | Automated | Gate 1.2 |

### Constraints Verification

| Constraint Category | Specific Constraint | Verification Method | Gate/Point Reference |
|-------------------|---------------------|---------------------|---------------------|
| Framework | React 18+ as sole UI framework | Human | Point E (component review) |
| Rendering | HTML5 Canvas API for all visual rendering | Human | Point E (no WebGL/SVG check) |
| Dependencies | Minimize external packages beyond React core and Vite | Automated | Gate 1.2 (check package.json) |
| Browser Support | Modern evergreen browsers (Chrome, Firefox, Safari, Edge) | Human | Point H (multi-browser testing) |
| Performance | Maintain 60fps during animation on mid-range hardware | Automated | Gate 3.1 |
| Recursion Depth | Limit tree depth to prevent stack overflow (typical range 8-12) | Automated | Gate 4.1 + Point I (boundary tests) |
| Component Structure | Clear separation between rendering logic and React lifecycle | Human | Point E (architecture review) |
| State Management | Use only React built-in state management | Human | Point E (no Redux/MobX check) |
| Code Organization | Keep fractal algorithm logic isolated in utility functions | Human | Point F (utility purity check) |
| Build Process | Preserve existing Vite configuration | Automated | Gate 1.1, 1.2 (no config changes) |
| Deterministic Randomness | Use seeded random number generation | Automated | Gate 4.3 (determinism test) |
| Resource Limits | Prevent infinite loops through hard-coded depth limits | Automated | Gate 4.1 (max depth enforcement) |

## Escape Criteria

### Re-Orbit Triggers

**Trigger R1: Tier 1 Acceptance Failure**
- **Condition:** Any Tier 1 automated gate fails or critical human verification point (A, E, F) rejects implementation
- **Impact:** Orbit cannot be marked complete; fundamental requirements not met
- **Response:**
  1. Document specific failing criteria in orbit notes
  2. Classify failure type:
     - **Type A - Build/Runtime Error:** Critical infrastructure failure
     - **Type B - Algorithm Defect:** Logic error in tree generation
     - **Type C - Performance Failure:** Frame rate below minimum threshold
     - **Type D - Visual Quality:** Tree structure unacceptable
  3. If Type A or B: Create immediate re-orbit with focused scope to fix specific defect
  4. If Type C: Evaluate fallback options (reduce depth, simplify sway) vs. re-orbit
  5. If Type D: Human tuning session to adjust parameters, then re-verify

**Trigger R2: Performance Degradation**
- **Condition:** Gate 3.1 (Frame Rate) shows < 45fps on mid-range hardware at depth 10
- **Impact:** Violates minimum performance requirements
- **Response:**
  1. Profile with Chrome DevTools to identify bottleneck
  2. Determine if issue is fixable with optimization (batching, caching) or requires architectural change
  3. If quick fix available: Apply optimization and re-verify Gate 3.1
  4. If architectural change needed: Create re-orbit focused on performance optimization
  5. Fallback option: Reduce `DEFAULT_CONFIG.maxDepth` to 8 and verify Tier 1 compliance

**Trigger R3: Memory Leak Detection**
- **Condition:** Gate 3.3 (Memory Stability) shows > 10MB growth over 5-minute run
- **Impact:** Application degrades over time, unacceptable for production
- **Response:**
  1. Take heap snapshot comparison to identify leak source
  2. Common causes: animation frame not canceled, event listeners not removed, refs not cleared
  3. Apply fix to cleanup functions in useEffect
  4. Re-run Gate 3.3 to verify leak resolved
  5. If leak persists: Create re-orbit with focused scope on lifecycle management

**Trigger R4: Cross-Browser Incompatibility**
- **Condition:** Verification Point H reveals critical failure in Firefox or Safari (application doesn't render or crashes)
- **Impact:** Browser support requirement violated
- **Response:**
  1. Document specific browser and error
  2. Investigate browser-specific Canvas API differences
  3. If minor CSS/styling issue: Fix inline and re-verify
  4. If Canvas API incompatibility: Research polyfill or alternative approach
  5. Create re-orbit if solution requires significant refactoring

### Scope Reduction Options

**Reduction Level 1: Defer Tier 3 Features**
- **Condition:** Tier 2 criteria met but Tier 3 polish unachievable in current orbit
- **Impact:** Acceptable; Tier 2 is target, Tier 3 is stretch goal
- **Action:**
  1. Mark orbit complete at Tier 2 level
  2. Document which Tier 3 features were not implemented
  3. Create backlog items for Tier 3 enhancements (optional future orbit)
- **No re-orbit required**

**Reduction Level 2: Simplify Animation**
- **Condition:** Performance issues persist despite optimization attempts
- **Impact:** Reduces visual quality but maintains core functionality
- **Action:**
  1. Remove sway animation (deliver growth only)
  2. Reduce depth to 8 (256 branches instead of 1024)
  3. Verify Tier 1 criteria still met
  4. Mark orbit complete with simplified scope
  5. Document decision rationale in orbit notes

**Reduction Level 3: Remove Color Gradient**
- **Condition:** Color interpolation causes performance issues or visual artifacts
- **Impact:** Reduces visual polish but maintains tree structure
- **Action:**
  1. Use single color for all branches (solid brown or green)
  2. Remove `calculateBranchColor` function calls from rendering loop
  3. Verify performance improvement
  4. Mark orbit complete with reduced scope
  5. Document that color gradient deferred to future enhancement

### Rollback Procedures

**Rollback Scenario 1: Catastrophic Failure**
- **Trigger:** Application crashes browser, infinite loop detected, or build completely broken
- **Action:**
  1. Immediately revert all changes to pre-orbit state
  2. Verify `npm run dev` works with reverted code
  3. Document failure mode in orbit postmortem
  4. Analyze root cause before attempting re-orbit
  5. Consider fundamental approach change (e.g., iterative instead of recursive algorithm)

**Rollback Scenario 2: Partial Implementation**
- **Trigger:** Some files implemented successfully but integration fails
- **Action:**
  1. Identify which components are stable (e.g., utility functions work but component has issues)
  2. Preserve working utilities in separate branch
  3. Revert component to pre-orbit state
  4. Create incremental re-orbit that builds on stable foundation
  5. Apply lessons learned to component implementation

**Rollback Scenario 3: Unacceptable Visual Quality**
- **Trigger:** Tree appearance fundamentally flawed (Verification Point A complete rejection)
- **Action:**
  1. Do not merge to main branch
  2. Create archive branch with attempt for reference
  3. Review Orbit 1 artifacts to understand if similar issues occurred
  4. Reconsider algorithm parameters (angle variation, length scale, depth)
  5. Create re-orbit with revised approach to randomness and branching

### Escalation Triggers

**Escalation Level 1: Technical Lead Review**
- **Trigger:** 
  - Second consecutive re-orbit fails same criteria
  - Orbit exceeds estimated duration by 100% (8+ hours instead of 4)
  - Conflict between acceptance criteria (e.g., performance vs. visual quality trade-off)
- **Action:**
  1. Pause implementation work
  2. Document specific blocker or conflict
  3. Request technical lead to review acceptance criteria
  4. Determine if intent needs revision or implementation approach needs expert guidance

**Escalation Level 2: Product Owner Consultation**
- **Trigger:**
  - Tier 2 criteria impossible to achieve within performance constraints
  - Scope reduction would eliminate core intent functionality
  - Visual quality assessment produces conflicting opinions
- **Action:**
  1. Prepare summary of technical limitations
  2. Present trade-off options with pros/cons
  3. Request product owner to clarify priority (performance vs. visual quality)
  4. Revise acceptance criteria based on product decision
  5. Re-baseline orbit with adjusted expectations

**Escalation Level 3: Architecture Review**
- **Trigger:**
  - Fundamental Canvas API limitations discovered
  - React performance ceiling hit (cannot achieve 60fps with current approach)
  - Memory leak unfixable with current architecture
- **Action:**
  1. Document technical constraint in detail
  2. Research alternative approaches (WebGL, SVG, Web Workers)
  3. Present findings to architecture team
  4. Determine if constraint is acceptable or requires technology change
  5. If technology change needed: Create new trajectory with revised technical foundation

### Quality Gates Waiver Process

**Waiver Request Criteria:**
- Only applicable to Tier 3 (stretch goal) criteria
- Never applicable to Tier 1 (minimum viable) criteria
- Tier 2 criteria may be considered for waiver only with technical lead approval

**Waiver Process:**
1. Identify specific criterion requiring waiver (reference by ID from traceability table)
2. Document technical reason waiver is necessary (e.g., browser limitation, hardware constraint)
3. Quantify impact (e.g., "Frame rate 58fps instead of 60fps target")
4. Propose mitigation (e.g., "Document limitation in README, acceptable for demo")
5. Get approval from reviewer or technical lead
6. Document waiver in orbit completion notes

**Non-Waiverable Criteria:**
- Build succeeds without errors (Gate 1.1, 1.2)
- Application loads without console errors (Gate 2.1)
- Minimum 6 levels of recursion (Gate 4.1 at depth 6)
- Growth animation completes (Gate 5.1)
- No memory leaks (Gate 3.3)