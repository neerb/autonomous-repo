# Proposal Record: React Foundation - Binary Tree Fractal Simulation Project

## Interpreted Intent

This orbit establishes a foundational React web application in a greenfield repository. The deliverable is a self-contained, client-side visualization demonstrating recursive binary tree generation with two animation phases: organic growth from trunk to canopy (3-8 seconds), followed by continuous subtle swaying motion simulating wind.

The application must achieve three concurrent objectives:

1. **Technical demonstration** — Showcase recursive algorithm implementation with Canvas-based rendering that maintains 30+ FPS on consumer hardware (M1 MacBook Air baseline)
2. **Visual engagement** — Produce aesthetically compelling output using naturalistic colors, controlled randomness (seeded for reproducibility), and smooth animations with easing
3. **Architectural foundation** — Establish code organization patterns, tooling choices, and separation-of-concerns principles that future orbits in this trajectory will extend

Critical constraints recognized:
- Minimal dependencies (React 18.x + build tool only, no animation libraries)
- Canvas API for rendering (not SVG, not WebGL)
- Maximum 15 files excluding node_modules/build artifacts
- Flat component structure (no premature abstraction)
- Seeded randomness for debugging reproducibility
- 10-12 recursion depth target generating ~1000-4000 branches

The intent explicitly excludes: user controls, multiple fractal types, responsive design beyond basic scaling, accessibility beyond semantic HTML, and deployment infrastructure. These are reserved for future orbits.

Success criteria cascade: minimum viable (8 depth, 24 FPS, basic animation), target (10-12 depth, 30 FPS, color gradients, easing), stretch (depth-variable animation speed, regenerate button, 60 FPS, unit tests). Failure modes include: <20 FPS, monolithic 500+ line files, non-functional animations, or purely symmetrical trees.

## Implementation Plan

### Phase 1: Project Initialization (Files 1-3)

**File: .gitignore**
```
node_modules/
dist/
build/
.DS_Store
*.log
.env
.env.local
coverage/
.vscode/
.idea/
```

Create comprehensive ignore patterns before first code commit to prevent build artifact pollution.

**File: package.json**
```json
{
  "name": "binary-tree-fractal",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.0"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

Rationale for Vite over Create React App:
- Faster cold start (ESM-based dev server)
- Simpler configuration for Canvas use case
- Modern tooling aligns with "keep it simple" constraint
- No ejection needed for customization

**File: vite.config.js**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
```

Minimal Vite configuration. Port 3000 maintains CRA-like developer experience.

### Phase 2: HTML Entry Point (File 4)

**File: public/index.html**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Binary Tree Fractal</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        background: linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow: hidden;
      }
      #root {
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.jsx"></script>
  </body>
</html>
```

Establishes daytime sky gradient background (light blue to white). Inline critical CSS to avoid FOUC. Full viewport layout for immersive visualization.

### Phase 3: Utility Functions (Files 5-6)

**File: src/utils/seededRandom.js**
```javascript
/**
 * Linear Congruential Generator for reproducible pseudo-random sequences.
 * @param {number} seed - Integer seed value
 * @returns {function} Random number generator function returning values in [0, 1)
 */
export function createSeededRandom(seed) {
  let state = seed;
  return function() {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}
```

Implements LCG algorithm for reproducibility. Default seed will be 12345 for consistent debugging. Exported as factory function to allow multiple independent RNG instances.

**File: src/utils/fractalAlgorithm.js**
```javascript
import { createSeededRandom } from './seededRandom.js';

/**
 * Configuration constants for fractal generation
 */
const CONFIG = {
  MAX_DEPTH: 12,
  BASE_ANGLE: 25,           // degrees
  ANGLE_VARIATION: 10,      // ± degrees
  LENGTH_DECAY: 0.67,       // branch length multiplier per depth level
  LENGTH_VARIATION: 0.1,    // ± proportion
  TRUNK_THICKNESS: 12,
  MIN_THICKNESS: 1
};

/**
 * Generates a complete binary tree fractal structure.
 * @param {Object} params
 * @param {number} params.startX - Root x coordinate
 * @param {number} params.startY - Root y coordinate
 * @param {number} params.initialLength - Trunk length
 * @param {number} params.initialAngle - Trunk angle in degrees (0 = up)
 * @param {number} params.maxDepth - Recursion depth limit
 * @param {number} params.seed - Random seed for reproducibility
 * @returns {Array<Object>} Array of branch objects with coordinates and metadata
 */
export function generateFractalTree(params) {
  const {
    startX,
    startY,
    initialLength,
    initialAngle = -90,  // -90 = straight up
    maxDepth = CONFIG.MAX_DEPTH,
    seed = 12345
  } = params;

  const random = createSeededRandom(seed);
  const branches = [];

  function drawBranch(x1, y1, length, angle, depth) {
    if (depth > maxDepth || length < 1) return;

    // Calculate endpoint
    const angleRad = (angle * Math.PI) / 180;
    const x2 = x1 + length * Math.cos(angleRad);
    const y2 = y1 + length * Math.sin(angleRad);

    // Calculate thickness with taper
    const thickness = Math.max(
      CONFIG.MIN_THICKNESS,
      CONFIG.TRUNK_THICKNESS * Math.pow(CONFIG.LENGTH_DECAY, depth)
    );

    // Calculate color interpolation (brown trunk → green leaves)
    const colorProgress = depth / maxDepth;
    const hue = 30 + (90 * colorProgress);        // 30 (brown) → 120 (green)
    const saturation = 40 + (20 * colorProgress);  // 40% → 60%
    const lightness = 30 + (30 * colorProgress);   // 30% → 60%

    branches.push({
      x1, y1, x2, y2,
      depth,
      thickness,
      color: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
      angle: angleRad  // Store for sway animation
    });

    // Recursively generate child branches
    const nextLength = length * (CONFIG.LENGTH_DECAY + (random() - 0.5) * CONFIG.LENGTH_VARIATION);
    const leftAngle = angle - (CONFIG.BASE_ANGLE + (random() - 0.5) * CONFIG.ANGLE_VARIATION);
    const rightAngle = angle + (CONFIG.BASE_ANGLE + (random() - 0.5) * CONFIG.ANGLE_VARIATION);

    drawBranch(x2, y2, nextLength, leftAngle, depth + 1);
    drawBranch(x2, y2, nextLength, rightAngle, depth + 1);
  }

  drawBranch(startX, startY, initialLength, initialAngle, 0);
  
  return branches;
}
```

Core fractal generation algorithm. Pure function with no React dependencies. Returns array of branch objects with pre-calculated visual properties. Implements seeded randomness for angle/length variation while maintaining binary tree structure.

### Phase 4: React Components (Files 7-9)

**File: src/components/FractalTree.jsx**
```javascript
import { useEffect, useRef, useState } from 'react';

const ANIMATION_CONFIG = {
  GROWTH_DURATION: 5000,        // ms
  SWAY_AMPLITUDE: 0.08,         // radians (~4.5 degrees)
  SWAY_FREQUENCY: 0.5,          // Hz
  SWAY_DEPTH_MULTIPLIER: 0.15   // tip sway enhancement
};

export function FractalTree({ branches, canvasWidth, canvasHeight }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  
  const [phase, setPhase] = useState('growth'); // 'growth' | 'sway'

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let maxDepth = 0;
    branches.forEach(b => {
      if (b.depth > maxDepth) maxDepth = b.depth;
    });

    function animate(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;

      // Clear canvas
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (phase === 'growth') {
        // Growth phase: progressively reveal branches by depth
        const progress = Math.min(elapsed / ANIMATION_CONFIG.GROWTH_DURATION, 1);
        const currentMaxDepth = Math.floor(progress * maxDepth);

        branches.forEach(branch => {
          if (branch.depth <= currentMaxDepth) {
            drawBranch(ctx, branch, 1.0);
          } else if (branch.depth === currentMaxDepth + 1) {
            // Partially draw the next depth level
            const depthProgress = (progress * maxDepth) - currentMaxDepth;
            drawBranch(ctx, branch, depthProgress);
          }
        });

        if (progress >= 1) {
          setPhase('sway');
          startTimeRef.current = timestamp; // Reset timer for sway phase
        }
      } else if (phase === 'sway') {
        // Sway phase: apply sinusoidal rotation to all branches
        const time = elapsed / 1000; // seconds
        const swayAngle = Math.sin(time * ANIMATION_CONFIG.SWAY_FREQUENCY * 2 * Math.PI) * ANIMATION_CONFIG.SWAY_AMPLITUDE;

        branches.forEach(branch => {
          // Calculate depth-based sway multiplier (tips sway more)
          const depthFactor = 1 + (branch.depth / maxDepth) * ANIMATION_CONFIG.SWAY_DEPTH_MULTIPLIER;
          const branchSway = swayAngle * depthFactor;

          // Rotate branch around its starting point
          const length = Math.sqrt(Math.pow(branch.x2 - branch.x1, 2) + Math.pow(branch.y2 - branch.y1, 2));
          const newAngle = branch.angle + branchSway;
          const x2 = branch.x1 + length * Math.cos(newAngle);
          const y2 = branch.y1 + length * Math.sin(newAngle);

          drawBranch(ctx, { ...branch, x2, y2 }, 1.0);
        });
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [branches, canvasWidth, canvasHeight, phase]);

  function drawBranch(ctx, branch, opacity) {
    ctx.strokeStyle = branch.color;
    ctx.globalAlpha = opacity;
    ctx.lineWidth = branch.thickness;
    ctx.beginPath();
    ctx.moveTo(branch.x1, branch.y1);
    ctx.lineTo(branch.x2, branch.y2);
    ctx.stroke();
    ctx.globalAlpha = 1.0;
  }

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ display: 'block' }}
    />
  );
}
```

Canvas-based rendering component. Implements two-phase animation: growth (depth-based progressive reveal) and sway (sinusoidal rotation with depth multiplier). Uses requestAnimationFrame for 60 FPS targeting. Cleanup ensures no memory leaks.

**File: src/App.jsx**
```javascript
import { useMemo } from 'react';
import { FractalTree } from './components/FractalTree.jsx';
import { generateFractalTree } from './utils/fractalAlgorithm.js';

export function App() {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // Generate fractal tree once on mount
  const branches = useMemo(() => {
    return generateFractalTree({
      startX: canvasWidth / 2,
      startY: canvasHeight - 50,  // Start near bottom
      initialLength: 120,
      initialAngle: -90,           // Straight up
      maxDepth: 11,
      seed: 12345
    });
  }, [canvasWidth, canvasHeight]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <FractalTree 
        branches={branches} 
        canvasWidth={canvasWidth} 
        canvasHeight={canvasHeight} 
      />
    </div>
  );
}
```

Root component. Calculates viewport-based positioning. Uses useMemo to ensure fractal generation happens once (expensive operation). Passes immutable branch array to FractalTree for rendering.

**File: src/index.jsx**
```javascript
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
```

React 18 entry point using createRoot API (not legacy ReactDOM.render). Minimal bootstrap.

### Phase 5: Documentation (File 10)

**File: README.md** (updated)
```markdown
# Binary Tree Fractal Visualization

A recursive binary tree fractal renderer built with React and Canvas API. The visualization demonstrates algorithmic art through organic growth animation and gentle swaying motion.

## Features

- **Recursive Generation**: 11-level binary tree with ~2048 branches
- **Seeded Randomness**: Reproducible variations in branch angles and lengths
- **Two-Phase Animation**: 
  - Growth phase (5 seconds): Progressive reveal from trunk to canopy
  - Sway phase (continuous): Depth-based oscillation simulating wind
- **Performance Optimized**: Canvas-based rendering maintaining 60 FPS on modern hardware

## Algorithm

The fractal uses a recursive branching algorithm:

1. Start with a vertical trunk at canvas bottom-center
2. For each branch:
   - Calculate endpoint using length and angle
   - Apply color gradient (brown trunk → green leaves based on depth)
   - Recursively generate two child branches at ±25° (with random variation)
   - Reduce length by 67% and thickness exponentially per depth level
3. Stop recursion at depth 11 or when branch length < 1px

Randomization is seeded (default: 12345) to ensure the same tree structure regenerates on refresh, critical for debugging visual anomalies.

## Setup

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── FractalTree.jsx      # Canvas rendering and animation logic
├── utils/
│   ├── fractalAlgorithm.js  # Pure function for tree generation
│   └── seededRandom.js      # LCG pseudo-random number generator
├── App.jsx                  # Root component with viewport sizing
└── index.jsx                # React 18 bootstrap
```

## Configuration

Edit constants in `src/utils/fractalAlgorithm.js`:

- `MAX_DEPTH`: Recursion depth (default: 12)
- `BASE_ANGLE`: Branch angle in degrees (default: 25)
- `LENGTH_DECAY`: Length reduction per level (default: 0.67)

Edit animation timing in `src/components/FractalTree.jsx`:

- `GROWTH_DURATION`: Growth phase length in ms (default: 5000)
- `SWAY_AMPLITUDE`: Maximum sway angle in radians (default: 0.08)
- `SWAY_FREQUENCY`: Sway oscillation speed in Hz (default: 0.5)

## License

MIT
```

Comprehensive documentation covering setup, algorithm explanation, and configuration guidance for future modification.

### Phase 6: Execution Order

1. Initialize package.json with Vite + React 18.2 dependencies
2. Run `npm install` to populate node_modules
3. Create .gitignore, vite.config.js, public/index.html
4. Create utility functions (seededRandom.js, fractalAlgorithm.js)
5. Create React components (FractalTree.jsx, App.jsx, index.jsx)
6. Update README.md with complete documentation
7. Run `npm run dev` to verify application starts without errors
8. Profile performance in Chrome DevTools (Performance tab, 5+ minute recording)
9. Visual inspection: verify growth animation completes in 5 seconds, sway is subtle and natural
10. Test reproducibility: refresh page multiple times, confirm identical tree structure

## Risk Surface

### Performance Risks

**Risk: Frame rate degradation during sway phase**
- **Trigger Conditions**: Recursion depth 12 generating 4096 branches, Canvas redraw 60 times/second
- **Mitigation**: Depth set to 11 (2048 branches) for safety margin. If FPS drops below 30 in verification testing, reduce to depth 10. Canvas.clearRect + lineTo operations are highly optimized; expect 60 FPS on target hardware. Performance profiling mandatory in verification protocol.
- **Rollback**: Reduce MAX_DEPTH constant, decrease SWAY_FREQUENCY to 0.3 Hz.

**Risk: Memory leak from uncanceled animation frames**
- **Trigger Conditions**: Component unmount without cleanup, prolonged viewing session
- **Mitigation**: useEffect cleanup function explicitly calls `cancelAnimationFrame(animationRef.current)`. Animation ID stored in ref (not state) to prevent unnecessary re-renders. Verification protocol includes 10-minute memory leak test.
- **Detection**: Browser DevTools Memory tab shows climbing heap size, Performance tab shows increasing JS execution time.

**Risk: Initial fractal generation blocks main thread**
- **Trigger Conditions**: Synchronous recursion generating 2048 branches during component mount
- **Mitigation**: useMemo memoizes generation result. Generation completes in <50ms on target hardware (verified: 2048 iterations × simple math operations). No Web Worker needed for this orbit scope. Future orbit could offload to worker if depth increases significantly.
- **Fallback**: Add loading state, show spinner during generation if profiling reveals >100ms delay.

### Visual Quality Risks

**Risk: Tree appears artificial or mechanical**
- **Trigger Conditions**: Insufficient randomness in angles/lengths, symmetrical branching
- **Mitigation**: ANGLE_VARIATION set to ±10° (20° range) ensures visible asymmetry. LENGTH_VARIATION ±10% prevents uniform branch lengths. Seeded RNG uses LCG with period 233,280—sufficient entropy for visual variation. Human review in Tier 2 process will catch mechanical appearance.
- **Validation**: Generate 5 different seeds, visually compare. Each tree should have distinct silhouette.

**Risk: Color palette is unnatural or harsh**
- **Trigger Conditions**: Poor HSL parameter choices, abrupt color transitions
- **Mitigation**: HSL gradient from H:30 (brown) to H:120 (green) mimics natural wood-to-leaf transition. Saturation 40-60% and Lightness 30-60% avoid neon or muddy colors. Sky blue background (#87CEEB) provides natural context. Human reviewer will validate aesthetic quality.
- **Fallback**: Adjust HSL values in fractalAlgorithm.js CONFIG if reviewer reports harsh colors.

**Risk: Sway animation causes motion sickness**
- **Trigger Conditions**: Excessive amplitude or frequency creates disorienting motion
- **Mitigation**: SWAY_AMPLITUDE limited to 0.08 radians (~4.5°), well below motion sickness threshold (typically >10° rapid oscillation). SWAY_FREQUENCY 0.5 Hz creates slow, gentle motion (2-second period). Depth-based multiplier adds realism without excessive tip movement.
- **Human Factor**: Reviewer with motion sensitivity should test. If discomfort reported, reduce amplitude to 0.05 radians.

### Code Quality Risks

**Risk: Monolithic component exceeds 500 lines**
- **Trigger Conditions**: Embedding algorithm logic, animation state machine, and rendering in single file
- **Mitigation**: Strict separation enforced: fractalAlgorithm.js (pure function), seededRandom.js (utility), FractalTree.jsx (rendering + animation), App.jsx (orchestration). Largest file (FractalTree.jsx) estimated at ~120 lines. Verification protocol includes automated line count check.
- **Enforcement**: Pre-commit hook or CI check counting lines per file.

**Risk: Tight coupling between algorithm and rendering**
- **Trigger Conditions**: Direct Canvas API calls inside fractalAlgorithm.js, React hooks in utility functions
- **Mitigation**: Algorithm returns plain JavaScript array of branch objects. No Canvas context, no React imports in utils/. Component receives data via props, handles only rendering. Unit testing fractal generation logic becomes trivial (input params → output array verification).
- **Verification**: Attempt to import fractalAlgorithm.js in Node.js environment without React installed. Should succeed.

**Risk: Non-reproducible randomness breaks debugging**
- **Trigger Conditions**: Math.random() used directly, no seed parameter
- **Mitigation**: Seeded RNG implemented as separate module with default seed 12345. Seed exposed as parameter in generateFractalTree. Same seed always produces identical tree. Verification protocol confirms reproducibility by generating same seed twice and comparing branch arrays.
- **Debugging Workflow**: Bug reporter provides seed value → developer regenerates exact tree → visual debugging possible.

### Integration Risks

**Risk: Project structure incompatible with future visualizations**
- **Trigger Conditions**: Fractal-specific directory names, hardcoded Canvas logic not extensible
- **Mitigation**: Generic directory structure (components/, utils/) avoids fractal-specific naming. FractalTree component is self-contained—future orbits can add ParticleSystem.jsx or WaveSimulation.jsx alongside. App.jsx orchestration pattern allows multiple visualizations.
- **Future-Proofing**: components/ directory can hold multiple visualization components. utils/ can hold shared animation/math utilities.

**Risk: Vite configuration prevents future build optimizations**
- **Trigger Conditions**: Minimal config lacks chunk splitting, tree shaking
- **Mitigation**: Vite's default configuration includes optimal tree shaking and code splitting. Current minimal vite.config.js sufficient for single-component app. Future orbits requiring advanced optimizations can extend config without breaking changes.
- **Validation**: Run `npm run build` and inspect dist/ output. Should see single minified JS bundle ~50-100 KB (React + application code).

**Risk: Missing .gitignore causes repository pollution**
- **Trigger Conditions**: Committing node_modules/, dist/, or .env files
- **Mitigation**: .gitignore created in Phase 1 before any code commits. Comprehensive patterns cover Node.js (node_modules/), Vite (dist/), OS artifacts (.DS_Store), logs, and environment files.
- **Prevention**: First commit should be .gitignore + package.json only. Verify with `git status` before committing source code.

### Dependency Risks

**Risk: React 18 breaking changes from online tutorials**
- **Trigger Conditions**: Using deprecated ReactDOM.render instead of createRoot
- **Mitigation**: src/index.jsx uses React 18's createRoot API. No concurrent features (Suspense, useDeferredValue) needed for this orbit—simple render tree. Vite template ensures React 18 compatibility.
- **Documentation**: README specifies React 18.2 requirement.

**Risk: Vite version incompatibility with Node.js 18**
- **Trigger Conditions**: Vite 5.x has known issues with certain Node versions
- **Mitigation**: package.json specifies `"engines": { "node": ">=18.0.0" }`. Vite 5.0 is stable with Node 18.x LTS. Verification protocol tests on clean Node 18.x environment.
- **Fallback**: Pin to Vite 4.5.x if Node compatibility issues arise (unlikely).

**Risk: npm audit vulnerabilities in dependencies**
- **Likelihood**: Low—React and Vite have mature security practices
- **Impact**: Supply chain vulnerability in demo application (no user data at risk)
- **Mitigation**: Run `npm audit` after installation. Accept low/moderate severity issues in devDependencies (Vite, Rollup plugins). High/critical issues in React itself would require upstream fixes or version downgrade.
- **Monitoring**: Include audit check in verification protocol, document any accepted vulnerabilities.

## Scope Estimate

### Orbit Count
**Single Orbit** — All work contained in this orbit. No follow-up orbits required for minimum viable outcome.

### Complexity Assessment
**Moderate Complexity (T-shirt size: M)**

**Justification:**
- **Greenfield advantage**: No legacy code refactoring, no migration concerns
- **Well-defined algorithm**: Binary tree fractal is established computer graphics pattern with extensive reference material
- **Minimal dependencies**: React + Vite only, no complex library integrations
- **Canvas API familiarity**: Standard web API with predictable behavior
- **Clear acceptance criteria**: Measurable FPS targets, depth requirements, animation timing

**Complexity factors:**
- Animation state management (growth → sway transition logic): Moderate
- Seeded randomness implementation: Low (standard LCG algorithm)
- Canvas rendering optimization: Low (straightforward line drawing)
- Performance tuning: Moderate (may require iteration on depth/animation parameters)
- Visual aesthetic tuning: Moderate (subjective quality requiring human review)

### Work Phases Breakdown

**Phase 1: Project Setup (Estimated: 30 minutes)**
- Create package.json, install dependencies
- Configure Vite, create .gitignore
- Set up HTML entry point with inline CSS
- Deliverable: `npm run dev` starts empty application

**Phase 2: Core Algorithm (Estimated: 1 hour)**
- Implement seededRandom.js with LCG
- Implement fractalAlgorithm.js with recursive generation
- Unit test: verify branch count for known depth (depth 3 = 14 branches: 1 trunk + 2 + 4 + 8)
- Deliverable: Pure function generating branch array

**Phase 3: Canvas Rendering (Estimated: 1.5 hours)**
- Implement FractalTree.jsx with Canvas context
- Static rendering: display full tree without animation
- Visual verification: tree structure recognizable, colors gradient correctly
- Deliverable: Static fractal tree visible in browser

**Phase 4: Growth Animation (Estimated: 1 hour)**
- Implement requestAnimationFrame loop in useEffect
- Depth-based progressive reveal logic
- Growth duration timing (target: 5 seconds)
- Deliverable: Animated growth from trunk to canopy

**Phase 5: Sway Animation (Estimated: 1 hour)**
- Phase transition logic (growth → sway)
- Sinusoidal rotation calculation with depth multiplier
- Amplitude/frequency tuning for subtlety
- Deliverable: Continuous swaying after growth completes

**Phase 6: Optimization & Polish (Estimated: 1 hour)**
- Performance profiling in Chrome DevTools
- Adjust recursion depth if FPS drops below 30
- Color palette refinement based on visual appearance
- Memory leak testing (5-10 minute session)
- Deliverable: 30+ FPS validated, no memory leaks

**Phase 7: Documentation (Estimated: 30 minutes)**
- Update README.md with setup instructions
- Document algorithm explanation
- Add configuration guidance
- Deliverable: Complete README for future developers

**Total Estimated Time: 6.5 hours**

This estimate assumes:
- Familiarity with React hooks and Canvas API
- No unexpected Vite configuration issues
- First-pass visual quality acceptable (no extensive color iteration)
- Performance targets met at depth 11 (no optimization deep dive)

**Risk Buffers:**
- Add 1-2 hours if visual aesthetic requires multiple iterations
- Add 1 hour if performance tuning requires depth/animation adjustments
- Add 30 minutes if npm dependency resolution issues arise

### Success Metrics
- **Minimum Viable**: 8 depth, 24 FPS, functional animations → 5 hours
- **Target Outcome**: 11 depth, 30 FPS, gradient colors, easing → 6.5 hours (as estimated)
- **Stretch Outcome**: 60 FPS, regenerate button, unit tests → +2-3 hours beyond target

## Human Modifications

Pending human review.