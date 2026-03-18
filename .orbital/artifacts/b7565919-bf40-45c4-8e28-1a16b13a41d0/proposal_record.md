# Proposal Record: Three.js Minimal Starter Project

## Interpreted Intent

This orbit creates a minimal, educational Three.js project that demonstrates modern 3D web development with zero configuration overhead. A developer should be able to run `npm install && npm run dev`, open a browser, and immediately see a rotating 3D cube with interactive camera controls. The project serves as a teaching tool that proves WebGL programming can be accessible without framework complexity or build configuration.

The outcome is measured by three success criteria:
1. **Functional completeness:** The scene renders, animates smoothly at 60fps, and responds to window resizing and mouse interaction
2. **Developer experience:** Setup requires a single command and Vite's dev server starts in under 5 seconds with working hot-reload
3. **Code simplicity:** The entire JavaScript implementation fits in under 100 lines using vanilla ES modules with no TypeScript, no frameworks, and exactly two npm dependencies

This is a greenfield initialization orbit — no existing production code to integrate with, no prior patterns to follow, no architectural constraints beyond Vite conventions. The repository currently contains only ORBITAL metadata artifacts and a correctly configured `package.json`. This orbit establishes the foundational code structure that future orbits will build upon.

## Implementation Plan

### File Creation Sequence

#### 1. Create `src/main.js` (Primary deliverable)
**Purpose:** Three.js scene initialization, animation loop, and event handlers

**Implementation approach:**
- Import Three.js core library using namespace import: `import * as THREE from 'three'`
- Import OrbitControls from examples directory: `import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'`
- Initialize rendering pipeline in top-level module scope (no `init()` wrapper needed for this minimal case)
- Create scene with background color `0x1a1a2e`
- Create PerspectiveCamera with FOV=75, aspect=window.innerWidth/innerHeight, near=0.1, far=1000
- Position camera at z=5 to view cube at origin
- Create WebGLRenderer with antialias enabled
- Set renderer size to window dimensions and append canvas to body
- Create BoxGeometry(1, 1, 1) and MeshStandardMaterial with default color
- Create mesh from geometry and material, add to scene
- Add AmbientLight(0xffffff, 0.5) for base illumination
- Add DirectionalLight(0xffffff, 0.5) positioned at (5, 5, 5) for directional shading
- Instantiate OrbitControls passing camera and renderer.domElement
- Define `animate()` function that calls requestAnimationFrame recursively
- Inside animation loop: rotate cube on X axis by 0.01 radians, Y axis by 0.01 radians
- Update controls and render scene
- Call `animate()` once to start loop
- Add window resize handler that updates camera.aspect, calls updateProjectionMatrix(), and updates renderer.setSize()

**Line count target:** 65-75 lines (well under 100-line constraint)

**Specific API calls:**
```javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
```

#### 2. Create `src/style.css`
**Purpose:** Full-viewport canvas with no scrollbars or default spacing

**Implementation approach:**
- Universal selector reset: margin 0, padding 0, box-sizing border-box
- Body: overflow hidden to prevent scrollbars
- Canvas element: display block (removes inline spacing), width 100vw, height 100vh

**Content:**
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

**Line count:** 13 lines (not counted toward 100-line JS budget)

#### 3. Create `index.html`
**Purpose:** HTML entry point that loads Vite dev server and executes main.js

**Implementation approach:**
- Standard HTML5 boilerplate with UTF-8 charset
- Viewport meta tag for mobile responsiveness
- Title: "Three.js Starter"
- Link to stylesheet using absolute path: `/src/style.css`
- Script tag with `type="module"` and absolute path: `/src/main.js`
- Empty body (canvas will be appended by JavaScript)

**Content:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Three.js Starter</title>
  <link rel="stylesheet" href="/src/style.css" />
</head>
<body>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Line count:** 11 lines

#### 4. Verify `package.json` (Existing file)
**Purpose:** Ensure correct npm configuration for Vite and Three.js

**Action required:** Read-only verification — no modification needed

**Verification checklist:**
- [ ] `"type": "module"` present (enables ES module syntax in .js files)
- [ ] `"scripts": { "dev": "vite" }` present (enables `npm run dev` command)
- [ ] `"dependencies": { "three": "^0.160.0" }` present (Three.js core library)
- [ ] `"devDependencies": { "vite": "^5.0.0" }` present (Vite dev server)
- [ ] `"engines": { "node": ">=18.0.0" }` present (Node version constraint)

**Risk mitigation:** If any field is missing or incorrect, report error to human supervisor — do not auto-fix without approval (Tier 2 supervision checkpoint)

### Execution Order

1. **Pre-flight validation:** Verify `package.json` matches expected structure
2. **Create src directory:** `mkdir -p src` (idempotent, safe if already exists)
3. **Write src/main.js:** Primary implementation file
4. **Write src/style.css:** CSS reset and viewport configuration
5. **Write index.html:** HTML entry point
6. **Post-creation verification:** Count lines in `src/main.js` excluding blanks and comments

### Dependencies and Imports

**Direct npm dependencies:**
- `three@^0.160.0` — Provides THREE namespace and core rendering classes
- `vite@^5.0.0` — Dev server with ES module resolution and HMR

**Import paths in src/main.js:**
```javascript
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
```

**Critical path requirement:** The OrbitControls import path must include the `.js` extension. Vite requires explicit extensions for ESM imports from `node_modules`. Omitting `.js` will cause a 404 error.

**No additional dependencies:** Intent explicitly forbids adding libraries beyond `three` and `vite`. Do not add:
- `@types/three` (TypeScript excluded)
- `three-stdlib` (examples already included in three package)
- `lil-gui`, `stats.js`, or other Three.js ecosystem tools

### Configuration Files

**No configuration files required:**
- No `vite.config.js` — Vite defaults work for this minimal setup
- No `tsconfig.json` — TypeScript excluded by Intent
- No `.gitignore` — Out of scope for this orbit
- No `README.md` modification — Intent specifies no documentation beyond basic setup

## Risk Surface

### Critical Risks (High Impact)

#### Risk: OrbitControls Import Path Error
**Likelihood:** Medium  
**Impact:** High (scene renders but controls don't work, confusing for learner)

**Mitigation:**
- Use exact path: `three/examples/jsm/controls/OrbitControls.js` with `.js` extension
- Verification protocol must test mouse interaction explicitly
- Human supervisor must confirm controls work during post-generation checkpoint

**Detection:** Browser console shows 404 error or module resolution failure

#### Risk: Line Count Budget Overrun
**Likelihood:** Low  
**Impact:** Medium (violates explicit constraint, fails acceptance criteria)

**Mitigation:**
- Target 65-75 lines to stay well under 100-line limit
- Use concise but readable syntax (method chaining where appropriate)
- Avoid intermediate variables for simple operations
- Automated gate counts lines excluding blanks/comments

**Detection:** Line count script in verification protocol

#### Risk: Canvas Not Filling Viewport
**Likelihood:** Low  
**Impact:** Medium (poor first impression, suggests misconfiguration)

**Mitigation:**
- CSS sets `width: 100vw; height: 100vh` on canvas element
- Renderer's `setSize()` uses `window.innerWidth` and `window.innerHeight`
- Resize handler updates both CSS and renderer dimensions synchronously

**Detection:** Visual inspection shows white borders or scrollbars

### Moderate Risks (Medium Impact)

#### Risk: Scene Background Color Mismatch
**Likelihood:** Low  
**Impact:** Low (aesthetic issue, not functional failure)

**Mitigation:**
- Use exact hex value `0x1a1a2e` as specified in Intent
- Human supervisor performs visual comparison during checkpoint

**Detection:** Background appears lighter or different shade of dark

#### Risk: Animation Performance Below 60fps
**Likelihood:** Very Low  
**Impact:** Medium (violates acceptance criteria)

**Mitigation:**
- Single cube with MeshStandardMaterial is trivial geometry
- Use `requestAnimationFrame` which automatically syncs to display refresh rate
- Verification protocol includes Performance tab recording

**Detection:** Browser dev tools Performance tab shows dropped frames

#### Risk: Window Resize Causes Stretched Cube
**Likelihood:** Low  
**Impact:** Medium (breaks responsive requirement)

**Mitigation:**
- Resize handler updates `camera.aspect` ratio before calling `updateProjectionMatrix()`
- Renderer's `setSize()` called with new dimensions
- Test resize behavior during human supervision checkpoint

**Detection:** Cube appears squashed or stretched after window resize

### Minor Risks (Low Impact)

#### Risk: Vite Dev Server Port Conflict
**Likelihood:** Medium  
**Impact:** Very Low (Vite auto-increments to next available port)

**Mitigation:**
- No action needed — Vite handles port conflicts automatically
- Verification protocol documents actual port used

**Detection:** Terminal output shows "Port 5173 is in use, trying 5174..."

#### Risk: Node Version Mismatch
**Likelihood:** Low  
**Impact:** Medium (Vite may fail to start)

**Mitigation:**
- `package.json` specifies `"engines": { "node": ">=18.0.0" }`
- Verification protocol includes `node --version` check
- Human supervisor confirms Node version during pre-execution checkpoint

**Detection:** npm install shows engine compatibility warning

#### Risk: Browser Console Warnings from Three.js
**Likelihood:** Low  
**Impact:** Very Low (educational distraction, not functional issue)

**Mitigation:**
- Use current Three.js API patterns (avoid deprecated classes)
- Enable `antialias: true` in renderer to prevent aliasing warnings
- Human supervisor checks console during post-generation checkpoint

**Detection:** Yellow warning messages in browser console

### Edge Cases

**Empty `src` directory handling:**
- Use `mkdir -p src` which is idempotent (safe if directory exists)
- No risk of data loss — directory currently does not exist

**Existing index.html conflict:**
- Repository structure shows `index.html` already exists (possibly empty placeholder)
- Strategy: Overwrite with new content — this is greenfield initialization
- Human supervisor reviews file diff during pre-execution checkpoint

**Multiple simultaneous dev servers:**
- If developer runs `npm run dev` twice, Vite spawns second server on different port
- No conflict — both servers work independently
- Not a bug, document as expected behavior

**HMR state preservation:**
- Vite HMR resets JavaScript module state on change
- Cube rotation angle resets to 0 on hot reload
- This is expected behavior, not a defect (noted in Context Package)

## Scope Estimate

### Complexity Assessment
**Overall Complexity:** Low

**Rationale:**
- Greenfield file creation with no existing code to integrate
- Well-documented Three.js API with stable patterns
- Minimal file count (3 new files + 1 verification)
- No external service integration or data persistence
- No testing infrastructure required
- Single-file JavaScript implementation with no module splitting

**Complexity factors:**
- **Positive (reduces complexity):** Standard Vite conventions, mature Three.js library, existing package.json
- **Negative (increases complexity):** Strict line count budget requires careful code organization, visual output requires subjective human judgment

### Orbit Count
**Estimated Orbits:** 1 (this orbit)

**Breakdown:**
- This proposal covers complete implementation of all Intent requirements
- No follow-up orbits needed unless acceptance criteria fail
- No additional features requested beyond minimal starter scope

**Potential future orbits (out of current scope):**
- Orbit 3: Add README tutorial with setup instructions
- Orbit 4: Add production build script and optimization
- Orbit 5: Add texture loading or advanced materials

### Work Phases

#### Phase 1: File Generation (Estimated: 5 minutes)
- Create `src/main.js` with Three.js scene initialization (primary deliverable)
- Create `src/style.css` with viewport CSS reset
- Create `index.html` with Vite entry point
- Verify `package.json` structure without modification

**Output:** 3 new files in repository

#### Phase 2: Automated Validation (Estimated: 2 minutes)
- Count lines in `src/main.js` excluding blanks and comments
- Verify all 4 required files exist
- Verify no additional dependencies added to package.json
- Verify import paths use correct syntax

**Output:** Validation report (pass/fail for each criterion)

#### Phase 3: Human Supervision Checkpoint (Estimated: 10 minutes)
- Pre-execution: Review file paths and package.json structure
- Execution: Run `npm install && npm run dev`
- Visual verification: Confirm cube renders with correct background color
- Interaction test: Verify OrbitControls respond to mouse drag/scroll
- Performance check: Open browser dev tools, record 5 seconds in Performance tab
- Code review: Verify Three.js imports use modern paths (not deprecated `three/build` pattern)

**Output:** Supervisor approval or rejection with specific feedback

#### Phase 4: Verification Protocol Execution (Estimated: 5 minutes)
- Run all automated gates from verification protocol
- Execute human checklist items
- Generate verification artifact with pass/fail status

**Output:** Verification Protocol artifact documenting orbit success

### Total Estimated Time
**Automated execution:** 7 minutes  
**Human supervision:** 10 minutes  
**Total orbit duration:** 17 minutes (excludes human review/approval time)

### Rollback Strategy
**If orbit fails acceptance criteria:**
1. Identify specific failing criterion from verification protocol
2. Determine if issue is code generation or environmental (Node version, browser compatibility)
3. If code issue: Regenerate affected file(s) with corrections
4. If environmental issue: Document requirement in README and mark orbit successful with caveats
5. If fundamental misunderstanding: Escalate to Intent revision (new orbit)

**Rollback mechanism:**
- Git reset to pre-orbit commit (if git initialized)
- Manual deletion of 3 generated files: `rm index.html src/main.js src/style.css`
- Package.json untouched, so no dependency cleanup needed

## Human Modifications

Pending human review.