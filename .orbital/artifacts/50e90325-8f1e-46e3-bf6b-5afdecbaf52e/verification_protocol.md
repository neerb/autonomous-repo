# Verification Protocol: React Foundation - Binary Tree Fractal Simulation Project

## Automated Gates

### Build & Runtime Gates

**Gate 1.1: Clean Installation**
- **Test Command:** `npm install`
- **Pass Criteria:** 
  - Exits with code 0
  - Creates node_modules/ directory
  - Generates package-lock.json
  - No peer dependency warnings for React or Vite
- **Intent Reference:** Intent Dependencies > External Dependencies (Node.js 18.x, React 18.x, Vite)

**Gate 1.2: Development Server Startup**
- **Test Command:** `npm run dev`
- **Pass Criteria:**
  - Server starts within 5 seconds
  - Listens on port 3000
  - Opens browser automatically or logs URL
  - No compilation errors in terminal
  - Browser console shows no errors on initial load
- **Intent Reference:** Acceptance Boundaries > Minimum Viable > "Application runs locally via npm start or equivalent without errors"

**Gate 1.3: Production Build**
- **Test Command:** `npm run build`
- **Pass Criteria:**
  - Build completes without errors
  - Creates dist/ directory
  - Output bundle size < 150 KB (React + application code)
  - No TypeScript errors (if .jsx files are present)
- **Intent Reference:** Acceptance Boundaries > Target Outcome (implicit: production-ready code)

### Code Quality Gates

**Gate 2.1: File Count Limit**
- **Test Command:** `find . -name "*.js" -o -name "*.jsx" | grep -v node_modules | grep -v dist | wc -l`
- **Pass Criteria:** Count ≤ 15 files
- **Intent Reference:** Constraints > Technical Boundaries > "Total project file count (excluding node_modules, build artifacts) should not exceed 15 files"

**Gate 2.2: Maximum File Size**
- **Test Script:**
  ```bash
  for file in src/**/*.{js,jsx}; do
    lines=$(wc -l < "$file")
    if [ $lines -gt 500 ]; then
      echo "FAIL: $file has $lines lines (max 500)"
      exit 1
    fi
  done
  echo "PASS: All files under 500 lines"
  ```
- **Pass Criteria:** No file exceeds 500 lines
- **Intent Reference:** Acceptance Boundaries > Unacceptable Outcomes > "Code is a single monolithic file exceeding 500 lines"

**Gate 2.3: Algorithm Separation**
- **Test Command:** `grep -l "import.*react" src/utils/*.js`
- **Pass Criteria:** Exit code 1 (no matches found — utils have no React imports)
- **Intent Reference:** Constraints > Architectural Limits > "clear separation between fractal logic and rendering logic"

**Gate 2.4: Seeded Randomness Implementation**
- **Test Script:**
  ```javascript
  // test/seededRandom.test.js
  import { createSeededRandom } from '../src/utils/seededRandom.js';
  
  const rng1 = createSeededRandom(12345);
  const rng2 = createSeededRandom(12345);
  
  const seq1 = [rng1(), rng1(), rng1()];
  const seq2 = [rng2(), rng2(), rng2()];
  
  console.assert(
    JSON.stringify(seq1) === JSON.stringify(seq2),
    'Same seed produces identical sequence'
  );
  ```
- **Pass Criteria:** Assertion passes (reproducible randomness)
- **Intent Reference:** Acceptance Boundaries > Minimum Viable > "Code includes at least one seeded random function for reproducible tree generation"

**Gate 2.5: Branch Count Validation**
- **Test Script:**
  ```javascript
  // test/fractalAlgorithm.test.js
  import { generateFractalTree } from '../src/utils/fractalAlgorithm.js';
  
  const branches = generateFractalTree({
    startX: 400,
    startY: 600,
    initialLength: 100,
    maxDepth: 3,
    seed: 12345
  });
  
  // Binary tree: depth 0 (1) + depth 1 (2) + depth 2 (4) + depth 3 (8) = 15 branches
  console.assert(
    branches.length === 15,
    `Expected 15 branches at depth 3, got ${branches.length}`
  );
  
  // Verify seeded reproducibility
  const branches2 = generateFractalTree({
    startX: 400,
    startY: 600,
    initialLength: 100,
    maxDepth: 3,
    seed: 12345
  });
  
  console.assert(
    branches[0].x2 === branches2[0].x2 && branches[0].y2 === branches2[0].y2,
    'Same seed produces identical tree structure'
  );
  ```
- **Pass Criteria:** Both assertions pass
- **Intent Reference:** Acceptance Boundaries > Minimum Viable > "Displays a binary tree fractal with at least 8 levels of recursion" + seeded randomness

### Dependency Security Gates

**Gate 3.1: Dependency Audit**
- **Test Command:** `npm audit --production`
- **Pass Criteria:**
  - No high or critical vulnerabilities in production dependencies
  - Low/moderate vulnerabilities documented in verification report
- **Intent Reference:** Context Package > Risk Assessment > Dependency Risks

**Gate 3.2: React 18 Compliance**
- **Test Command:** `grep -r "ReactDOM.render" src/`
- **Pass Criteria:** Exit code 1 (no deprecated ReactDOM.render found, only createRoot)
- **Intent Reference:** Proposal Record > Risk Surface > "React 18 breaking changes"

**Gate 3.3: Git Ignore Coverage**
- **Test Script:**
  ```bash
  if [ -f .gitignore ]; then
    grep -q "node_modules" .gitignore && 
    grep -q "dist" .gitignore && 
    grep -q "build" .gitignore && 
    echo "PASS: .gitignore covers critical directories"
  else
    echo "FAIL: .gitignore missing"
    exit 1
  fi
  ```
- **Pass Criteria:** Script exits with code 0
- **Intent Reference:** Context Package > Risk Assessment > Integration Risks > "Git history becomes polluted with build artifacts"

### Performance Gates (Automated Profiling)

**Gate 4.1: Frame Rate Measurement**
- **Test Setup:** Launch application in Chrome headless mode with DevTools Protocol
- **Test Script:**
  ```javascript
  // test/performance.js (using Puppeteer)
  const puppeteer = require('puppeteer');
  
  (async () => {
    const browser = await puppeteer.launch();
    const page = await page.newPage();
    await page.goto('http://localhost:3000');
    
    // Wait for growth animation to complete
    await page.waitForTimeout(6000);
    
    // Measure FPS during sway phase (10 second sample)
    await page.evaluate(() => {
      window.frameCount = 0;
      window.startTime = performance.now();
      function countFrames() {
        window.frameCount++;
        if (performance.now() - window.startTime < 10000) {
          requestAnimationFrame(countFrames);
        }
      }
      requestAnimationFrame(countFrames);
    });
    
    await page.waitForTimeout(10000);
    
    const fps = await page.evaluate(() => {
      const elapsed = (performance.now() - window.startTime) / 1000;
      return window.frameCount / elapsed;
    });
    
    console.log(`Average FPS: ${fps.toFixed(2)}`);
    
    if (fps >= 24) {
      console.log('PASS: FPS >= 24 (minimum viable)');
    } else {
      console.log('FAIL: FPS below minimum threshold');
      process.exit(1);
    }
    
    if (fps >= 30) {
      console.log('PASS: FPS >= 30 (target outcome)');
    }
    
    await browser.close();
  })();
  ```
- **Pass Criteria (Minimum):** FPS ≥ 24
- **Pass Criteria (Target):** FPS ≥ 30
- **Intent Reference:** Acceptance Boundaries > Minimum Viable > "Frame rate remains above 24 FPS on target hardware during animation" + Target > "Frame rate maintains 30+ FPS consistently"

**Gate 4.2: Memory Leak Detection**
- **Test Script:**
  ```javascript
  // test/memory.js (using Puppeteer)
  const puppeteer = require('puppeteer');
  
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    
    // Initial heap measurement
    const initialMetrics = await page.metrics();
    const initialHeap = initialMetrics.JSHeapUsedSize;
    
    // Run for 10 minutes
    await page.waitForTimeout(600000);
    
    // Final heap measurement
    const finalMetrics = await page.metrics();
    const finalHeap = finalMetrics.JSHeapUsedSize;
    
    const heapGrowth = ((finalHeap - initialHeap) / initialHeap) * 100;
    
    console.log(`Heap growth: ${heapGrowth.toFixed(2)}%`);
    
    if (heapGrowth < 20) {
      console.log('PASS: No significant memory leak detected');
    } else {
      console.log('FAIL: Heap grew by more than 20%');
      process.exit(1);
    }
    
    await browser.close();
  })();
  ```
- **Pass Criteria:** Heap growth < 20% over 10 minutes
- **Intent Reference:** Context Package > Risk Assessment > Performance Risks > "Memory leak in animation loop"

## Human Verification Points

### Visual Quality Assessment

**Verification Point 1.1: Tree Structure Recognition**
- **Action:** Open application in browser, observe initial render
- **Assessment Criteria:**
  - Tree has single trunk at bottom-center
  - Branches split into left/right pairs at each depth level
  - Tree structure resembles natural binary fractal (not chaotic overlap)
  - Recursion depth appears to be 10-12 levels (count visible branching generations)
- **Pass/Fail Decision:** Reviewer determines if structure is "visually recognizable as a binary fractal"
- **Intent Reference:** Acceptance Boundaries > Unacceptable Outcomes > "Tree structure is not visually recognizable as a binary fractal (e.g., branches overlap chaotically)"

**Verification Point 1.2: Asymmetry Validation**
- **Action:** Refresh page 5 times with same seed (12345), then modify seed in code to generate 3 different trees
- **Assessment Criteria:**
  - Same seed produces visually identical tree on all refreshes
  - Different seeds produce distinct silhouettes
  - Branch angles show visible randomness (not perfectly symmetrical)
  - Tree does not appear mechanical or template-like
- **Pass/Fail Decision:** Reviewer confirms visible asymmetry exists
- **Intent Reference:** Acceptance Boundaries > Unacceptable Outcomes > "No visible randomization in branch angles (tree is perfectly symmetrical)"

**Verification Point 1.3: Color Palette Evaluation**
- **Action:** Observe color gradient from trunk to leaves
- **Assessment Criteria:**
  - Trunk appears brown (HSL H: 30-40)
  - Leaf tips appear green (HSL H: 110-130)
  - Gradient transitions smoothly without abrupt jumps
  - Colors are naturalistic (not neon, not muddy)
  - Background sky gradient is subtle and non-distracting
  - Overall aesthetic feels "daytime outdoor" as specified
- **Pass/Fail Decision:** Reviewer confirms palette is naturalistic and appealing
- **Intent Reference:** Constraints > Visual and UX Boundaries > "Color Palette: Start with naturalistic browns/greens. Avoid neon, avoid pure black backgrounds. Aim for a daytime outdoor aesthetic."

**Verification Point 1.4: Animation Timing Verification**
- **Action:** Use stopwatch to measure growth animation duration
- **Assessment Criteria:**
  - Growth phase completes in 3-8 seconds (target: 5 seconds)
  - Growth animation shows progressive reveal from trunk to tips
  - Phase transition from growth to sway is smooth (no jarring pause)
  - Sway animation begins immediately after growth completes
- **Pass/Fail Decision:** Growth duration within 3-8 second window
- **Intent Reference:** Constraints > Visual and UX Boundaries > "Animation Timing: Growth phase should complete within 3-8 seconds"

**Verification Point 1.5: Sway Subtlety Check**
- **Action:** Observe sway animation for 30 seconds
- **Assessment Criteria:**
  - Sway motion is gentle and periodic (not erratic)
  - Maximum rotation visually appears ≤5 degrees
  - Tips sway more than trunk (depth-based variation present)
  - Motion does not cause discomfort or disorientation
  - Sway looks like wind effect (not earthquake or vibration)
- **Pass/Fail Decision:** Reviewer confirms sway is subtle and natural
- **Intent Reference:** Constraints > Visual and UX Boundaries > "Sway must be subtle enough to avoid motion sickness (max rotation ±5 degrees)"

### Code Architecture Review

**Verification Point 2.1: Separation of Concerns**
- **Action:** Review file structure and imports
- **Assessment Criteria:**
  - `src/utils/fractalAlgorithm.js` contains only pure functions (no React, no Canvas)
  - `src/utils/seededRandom.js` is standalone utility (no domain logic)
  - `src/components/FractalTree.jsx` handles only rendering and animation orchestration
  - `src/App.jsx` handles only parameter setup and component composition
  - Clear boundary: algorithm generates data, component renders data
- **Pass/Fail Decision:** Reviewer confirms clean separation enables future reuse
- **Intent Reference:** Acceptance Boundaries > Target Outcome > "Code structure separates fractal generation algorithm from rendering concerns"

**Verification Point 2.2: Animation Cleanup**
- **Action:** Inspect FractalTree.jsx useEffect cleanup function
- **Assessment Criteria:**
  - useEffect returns cleanup function
  - Cleanup calls `cancelAnimationFrame(animationRef.current)`
  - Animation ID stored in ref (not state)
  - No React warnings in console about missing cleanup
- **Pass/Fail Decision:** Reviewer confirms proper cleanup prevents memory leaks
- **Intent Reference:** Context Package > Risk Assessment > Performance Risks > "Memory leak in animation loop"

**Verification Point 2.3: Pattern Consistency**
- **Action:** Review naming conventions across all files
- **Assessment Criteria:**
  - Components use PascalCase (FractalTree, App)
  - Utilities use camelCase (fractalAlgorithm, seededRandom)
  - Constants use UPPER_SNAKE_CASE (MAX_DEPTH, BASE_ANGLE)
  - File extensions consistent (.jsx for components, .js for utilities)
- **Pass/Fail Decision:** Reviewer confirms consistent patterns for future orbits
- **Intent Reference:** Context Package > Pattern Library > Naming Conventions

**Verification Point 2.4: README Completeness**
- **Action:** Read README.md as if unfamiliar with project
- **Assessment Criteria:**
  - Setup instructions include prerequisites (Node 18.x)
  - Installation steps are complete and accurate (`npm install`, `npm run dev`)
  - Algorithm explanation describes recursive branching logic
  - Configuration section documents key constants (MAX_DEPTH, BASE_ANGLE, etc.)
  - README mentions seeded randomness and default seed value
- **Pass/Fail Decision:** Reviewer can set up and understand project using only README
- **Intent Reference:** Acceptance Boundaries > Target Outcome > "README includes setup instructions and a brief explanation of the fractal algorithm"

### Performance Validation (Human Observation)

**Verification Point 3.1: Subjective Smoothness**
- **Action:** Observe animation for 2 minutes on target hardware (M1 MacBook Air or equivalent)
- **Assessment Criteria:**
  - Animation feels smooth to human eye (no perceived stuttering)
  - Growth animation has no frame drops or pauses
  - Sway animation maintains consistent motion (no jitter)
  - Browser DevTools Performance tab shows consistent 60 FPS target (allow occasional dips to 30 FPS)
- **Pass/Fail Decision:** Reviewer confirms animation is "visually compelling enough to hold viewer attention for at least 30 seconds"
- **Intent Reference:** Desired Outcome > "The fractal must be visually compelling enough to hold viewer attention for at least 30 seconds, with smooth animation that doesn't degrade performance on standard consumer hardware"

**Verification Point 3.2: Browser Responsiveness**
- **Action:** During animation, attempt to interact with browser UI (open DevTools, switch tabs, resize window)
- **Assessment Criteria:**
  - Browser remains responsive during animation
  - Tab switching has no lag
  - CPU usage remains reasonable (<80% of single core in Activity Monitor)
  - No "Page Unresponsive" warnings from browser
- **Pass/Fail Decision:** Reviewer confirms application does not block browser
- **Intent Reference:** Acceptance Boundaries > Unacceptable Outcomes > "Application crashes or fails to render on initial load" (extended to runtime stability)

### Acceptance Boundary Traceability

**Verification Point 4.1: Minimum Viable Checklist**
- **Action:** Manually verify all minimum viable criteria
- **Checklist:**
  - [ ] Application runs locally via `npm run dev` without errors (Gate 1.2)
  - [ ] Displays a binary tree fractal with at least 8 levels of recursion (VP 1.1 + manual depth count)
  - [ ] Growth animation proceeds from trunk to branches with visible progression (VP 1.4)
  - [ ] Sway animation demonstrates periodic motion after growth completes (VP 1.5)
  - [ ] Frame rate remains above 24 FPS on target hardware during animation (Gate 4.1)
  - [ ] Code includes at least one seeded random function for reproducible tree generation (Gate 2.4)
- **Pass/Fail Decision:** All 6 criteria must pass for minimum viable outcome
- **Intent Reference:** Acceptance Boundaries > Minimum Viable Outcome (all criteria)

**Verification Point 4.2: Target Outcome Checklist**
- **Action:** Verify enhanced quality criteria
- **Checklist:**
  - [ ] Frame rate maintains 30+ FPS consistently (Gate 4.1 target threshold)
  - [ ] Growth animation includes visual feedback: thickness tapering (inspect Canvas drawing code) + color gradient (VP 1.3)
  - [ ] Sway animation uses natural motion (VP 1.5 confirms non-linear appearance)
  - [ ] Recursion depth reaches 10-12 levels (VP 1.1 visual count)
  - [ ] Branch angles vary by 5-15 degrees from base angle (VP 1.2 confirms randomness)
  - [ ] Code structure separates fractal generation algorithm from rendering concerns (VP 2.1)
  - [ ] README includes setup instructions and algorithm explanation (VP 2.4)
- **Pass/Fail Decision:** All 7 criteria must pass for target outcome
- **Intent Reference:** Acceptance Boundaries > Target Outcome (all criteria)

**Verification Point 4.3: Unacceptable Outcome Exclusion**
- **Action:** Verify none of the failure conditions exist
- **Exclusion Checklist:**
  - [ ] Application does NOT crash or fail to render on initial load (Gate 1.2)
  - [ ] Animation does NOT stutter below 20 FPS (Gate 4.1 minimum + 20% margin)
  - [ ] Tree structure IS recognizable as binary fractal (VP 1.1)
  - [ ] Growth and sway animations ARE functional (VP 1.4, VP 1.5)
  - [ ] Branch angles SHOW visible randomization (VP 1.2)
  - [ ] NO file exceeds 500 lines (Gate 2.2)
- **Pass/Fail Decision:** If ANY exclusion fails, orbit fails regardless of other passes
- **Intent Reference:** Acceptance Boundaries > Unacceptable Outcomes (all criteria inverted)

## Intent Traceability

### Acceptance Boundary → Verification Mapping

| Intent Criterion | Verification Method | Gate/VP Reference |
|------------------|---------------------|-------------------|
| **Minimum Viable Outcomes** | | |
| Application runs locally via npm start | Automated: Dev server startup | Gate 1.2 |
| Displays binary tree with ≥8 depth | Human: Visual inspection | VP 1.1 |
| Growth animation proceeds trunk→branches | Human: Timing and progression | VP 1.4 |
| Sway animation demonstrates periodic motion | Human: Motion observation | VP 1.5 |
| Frame rate >24 FPS | Automated: Puppeteer profiling | Gate 4.1 (min) |
| Code includes seeded random function | Automated: Reproducibility test | Gate 2.4 |
| **Target Outcomes** | | |
| Frame rate ≥30 FPS consistently | Automated: Puppeteer profiling | Gate 4.1 (target) |
| Thickness tapering in growth animation | Human: Code + visual inspection | VP 1.3, VP 4.2 |
| Color gradient trunk→leaves | Human: Visual inspection | VP 1.3 |
| Sway uses easing (not linear) | Human: Motion quality assessment | VP 1.5 |
| Recursion depth 10-12 levels | Human: Visual counting | VP 1.1 |
| Branch angle variation 5-15° | Human: Asymmetry check | VP 1.2 |
| Separated algorithm/rendering code | Human: Architecture review | VP 2.1 |
| README with setup + algorithm docs | Human: Documentation review | VP 2.4 |
| **Unacceptable Outcomes (Exclusions)** | | |
| Application crashes on load | Automated: Build/startup gates | Gate 1.2 |
| Animation <20 FPS | Automated: Performance gate | Gate 4.1 |
| Tree not recognizable as binary fractal | Human: Structure assessment | VP 1.1 |
| Growth/sway animations absent | Human: Animation verification | VP 1.4, VP 1.5 |
| No visible randomization (symmetrical) | Human: Asymmetry check | VP 1.2 |
| Monolithic file >500 lines | Automated: Line count script | Gate 2.2 |
| **Constraints** | | |
| ≤15 files (excluding build artifacts) | Automated: File count script | Gate 2.1 |
| Canvas API (not SVG, not WebGL) | Human: Code review | VP 2.1 (implicit) |
| Minimal dependencies (React + Vite only) | Automated: package.json inspection | Gate 1.1 |
| Seeded randomness for debugging | Automated: Reproducibility test | Gate 2.4 |
| Growth timing 3-8 seconds | Human: Stopwatch measurement | VP 1.4 |
| Sway ≤5° rotation | Human: Motion observation | VP 1.5 |
| Naturalistic color palette | Human: Color evaluation | VP 1.3 |

### Risk Mitigation → Verification Mapping

| Risk | Verification Method | Gate/VP Reference |
|------|---------------------|-------------------|
| Frame rate drops below 30 FPS | Automated profiling | Gate 4.1 |
| Memory leak in animation loop | Automated heap monitoring | Gate 4.2 |
| Monolithic component >500 lines | Automated line count | Gate 2.2 |
| Algorithm coupled to React lifecycle | Automated import check | Gate 2.3 |
| Non-reproducible randomness | Automated seed test | Gate 2.4 |
| Tree looks artificial/mechanical | Human visual assessment | VP 1.2 |
| Color palette harsh/unnatural | Human aesthetic review | VP 1.3 |
| Sway causes motion sickness | Human motion sensitivity test | VP 1.5 |
| Git artifacts pollute repository | Automated .gitignore check | Gate 3.3 |
| React 18 API misuse | Automated deprecated API scan | Gate 3.2 |

## Escape Criteria

### Re-Orbit Conditions

**Condition 1: Minimum Viable Failure**
- **Trigger:** Any criterion in VP 4.1 (Minimum Viable Checklist) fails
- **Action:** 
  1. Document specific failure in verification report
  2. Create new orbit with narrowed scope addressing only failed criteria
  3. Retain passing elements from current implementation
  4. Example: If FPS is 22 (below 24 minimum), new orbit focuses solely on performance optimization (reduce depth to 10, optimize Canvas drawing)

**Condition 2: Performance Degradation**
- **Trigger:** Gate 4.1 shows FPS <24 on target hardware
- **Action:**
  1. Profile specific bottleneck (fractal generation vs. Canvas rendering vs. animation calculation)
  2. If generation time >100ms: Consider Web Worker offload (new orbit)
  3. If Canvas rendering slow: Reduce MAX_DEPTH from 11 to 10 or 9
  4. If animation calculation slow: Optimize rotation math or reduce SWAY_FREQUENCY
  5. Re-run Gate 4.1 after adjustment
  6. If still failing: Escalate to human review for hardware compatibility assessment

**Condition 3: Memory Leak Detected**
- **Trigger:** Gate 4.2 shows heap growth >20% over 10 minutes
- **Action:**
  1. Review FractalTree.jsx useEffect cleanup implementation
  2. Verify cancelAnimationFrame is called correctly
  3. Check for event listeners not cleaned up
  4. If leak persists: Add explicit cleanup for Canvas context references
  5. Re-run Gate 4.2 after fix
  6. If still failing: New orbit to implement Canvas pooling or context disposal

**Condition 4: Visual Quality Rejection**
- **Trigger:** Human reviewer fails VP 1.1, VP 1.2, or VP 1.3 (tree appearance)
- **Action:**
  1. Reviewer documents specific aesthetic concern (e.g., "colors too muddy", "tree too symmetrical")
  2. Adjust CONFIG constants in fractalAlgorithm.js:
     - ANGLE_VARIATION: Increase for more asymmetry
     - HSL parameters: Adjust hue/saturation/lightness ranges
  3. Generate 5 test seeds, share screenshots with reviewer
  4. Iterate until reviewer approves
  5. If >3 iterations required: Escalate to Tier 3 (gated) for creative direction input

**Condition 5: Architecture Violation**
- **Trigger:** Gate 2.1, Gate 2.2, or VP 2.1 fails (code structure issues)
- **Action:**
  1. Refactor violating code to meet separation-of-concerns requirements
  2. Re-run all Automated Gates (1.x, 2.x, 3.x)
  3. If refactor breaks functionality: Roll back and create new orbit with explicit refactoring scope
  4. Example: If fractalAlgorithm.js has React imports, extract pure algorithm logic into separate module

### Escalation Triggers

**Escalation Level 1: Technical Review**
- **Trigger:** Any automated gate fails twice after re-orbit attempt
- **Action:** Schedule synchronous review with human engineer to diagnose root cause
- **Participants:** AI agent executor + senior engineer
- **Outcome:** Decide between:
  - Adjust acceptance criteria (if requirements were unrealistic)
  - Change implementation approach (if technical solution was flawed)
  - Abort orbit and re-scope trajectory

**Escalation Level 2: Product Review**
- **Trigger:** Human verification points fail subjectively (VP 1.x aesthetic judgments) after 3 iterations
- **Action:** Escalate to product owner or design lead for creative direction
- **Participants:** AI agent executor + engineer + design/product stakeholder
- **Outcome:** Define explicit aesthetic parameters (specific HSL ranges, reference images) and re-orbit with concrete targets

**Escalation Level 3: Trajectory Re-Planning**
- **Trigger:** Orbit cannot achieve minimum viable outcome within 2 re-orbit attempts
- **Action:** Pause trajectory, conduct retrospective on why requirements were unachievable
- **Participants:** Full team (engineer, product, AI operations)
- **Outcome:** Either:
  - Adjust trajectory acceptance boundaries (make requirements more achievable)
  - Split trajectory into multiple smaller trajectories
  - Abort trajectory if fundamental approach is flawed

### Rollback Procedures

**Rollback Scenario 1: Functional Regression**
- **Trigger:** Application that passed Gate 1.2 in initial implementation now crashes after changes
- **Procedure:**
  1. Revert all changes since last passing commit
  2. Run full verification protocol on reverted code
  3. If revert passes: Identify specific commit that introduced regression
  4. Create new orbit to re-implement failed changes incrementally
  5. Add regression test to Automated Gates before attempting re-implementation

**Rollback Scenario 2: Performance Regression**
- **Trigger:** FPS drops from 30+ to <24 after optimization attempt
- **Procedure:**
  1. Revert optimization changes
  2. Re-run Gate 4.1 to confirm FPS returns to acceptable level
  3. Document optimization approach as failed experiment
  4. Try alternative optimization (e.g., if reducing depth failed, try optimizing Canvas drawing instead)

**Rollback Scenario 3: Aesthetic Degradation**
- **Trigger:** Human reviewer determines visual quality worsened after color/animation adjustments
- **Procedure:**
  1. Revert to previous CONFIG values in fractalAlgorithm.js
  2. Save rejected parameters in commented block for documentation
  3. Attempt smaller incremental adjustments (e.g., change HSL hue by ±5 instead of ±20)
  4. Re-submit for human review after each small change

**Rollback Scenario 4: Architecture Debt**
- **Trigger:** Refactoring to meet Gate 2.x requirements introduces new coupling or complexity
- **Procedure:**
  1. Revert refactoring attempt
  2. Accept current architecture with documented technical debt note
  3. Create follow-up orbit specifically for architecture improvement
  4. Allow current orbit to complete with known debt if functionality is solid
  5. Tag commit with "TODO: Architecture debt - see orbit N+1"

### Verification Report Template

Upon completion of all gates and verification points, generate report:

```markdown
# Verification Report: Orbit 1 - Binary Tree Fractal Foundation

## Summary
- **Outcome:** [PASS / CONDITIONAL PASS / FAIL]
- **Achieved Tier:** [Minimum Viable / Target / Stretch]
- **Verification Date:** [YYYY-MM-DD]
- **Verified By:** [Human Reviewer Name]

## Automated Gate Results
- Gate 1.1 (Clean Installation): [PASS/FAIL]
- Gate 1.2 (Dev Server Startup): [PASS/FAIL]
- Gate 1.3 (Production Build): [PASS/FAIL]
- Gate 2.1 (File Count): [X/15 files] [PASS/FAIL]
- Gate 2.2 (Max File Size): [Largest: X lines] [PASS/FAIL]
- Gate 2.3 (Algorithm Separation): [PASS/FAIL]
- Gate 2.4 (Seeded Randomness): [PASS/FAIL]
- Gate 2.5 (Branch Count): [PASS/FAIL]
- Gate 3.1 (Dependency Audit): [X vulnerabilities] [PASS/FAIL]
- Gate 3.2 (React 18 Compliance): [PASS/FAIL]
- Gate 3.3 (Git Ignore): [PASS/FAIL]
- Gate 4.1 (Frame Rate): [X FPS] [PASS/FAIL]
- Gate 4.2 (Memory Leak): [X% heap growth] [PASS/FAIL]

## Human Verification Results
- VP 1.1 (Tree Structure): [PASS/FAIL] - [Reviewer notes]
- VP 1.2 (Asymmetry): [PASS/FAIL] - [Reviewer notes]
- VP 1.3 (Color Palette): [PASS/FAIL] - [Reviewer notes]
- VP 1.4 (Animation Timing): [X seconds] [PASS/FAIL]
- VP 1.5 (Sway Subtlety): [PASS/FAIL] - [Reviewer notes]
- VP 2.1 (Separation of Concerns): [PASS/FAIL]
- VP 2.2 (Animation Cleanup): [PASS/FAIL]
- VP 2.3 (Pattern Consistency): [PASS/FAIL]
- VP 2.4 (README Completeness): [PASS/FAIL]
- VP 3.1 (Subjective Smoothness): [PASS/FAIL]
- VP 3.2 (Browser Responsiveness): [PASS/FAIL]
- VP 4.1 (Minimum Viable Checklist): [X/6 passed]
- VP 4.2 (Target Outcome Checklist): [X/7 passed]
- VP 4.3 (Unacceptable Exclusion): [X/6 confirmed absent]

## Acceptance Boundary Achievement
- Minimum Viable Outcome: [ACHIEVED / NOT ACHIEVED]
- Target Outcome: [ACHIEVED / NOT ACHIEVED]
- Stretch Outcome: [ACHIEVED / NOT ACHIEVED]

## Known Issues / Technical Debt
[List any accepted compromises or deferred improvements]

## Recommendations for Future Orbits
[Suggestions for next trajectory steps based on this implementation]

## Approvals
- Technical Reviewer: [Name] [Date]
- Human Supervisor (Tier 2): [Name] [Date]
```

This report becomes part of the orbit's permanent record and informs future trajectory planning.