# Context Package: React Calculator Web App

## Codebase References

### Current Repository State
The repository at https://github.com/neerb/autonomous-repo is in minimal initialization state with only:

- `README.md` — Basic repository description file with minimal content

### Files to be Created
This orbit will establish the foundational structure for a React application. Expected file creation includes:

- `package.json` — Project manifest with dependencies (react, react-dom, build tooling)
- `package-lock.json` or `yarn.lock` — Dependency lock file for reproducible builds
- `src/` — Source code directory containing all application code
- `src/index.js` or `src/main.jsx` — Application entry point that mounts React to the DOM
- `src/App.js` or `src/App.jsx` — Root React component
- `src/components/` — Directory for React components (Calculator, Display, Button, etc.)
- `public/` — Static assets directory containing `index.html` and favicon
- `public/index.html` — HTML shell that hosts the React application
- `.gitignore` — Git exclusion rules for node_modules, build artifacts
- Build configuration files (dependent on scaffolding tool choice)

### Files to be Modified
- `README.md` — Update with project setup instructions, development commands, and project description

### No Existing Code Surfaces
This is a greenfield initialization with no existing code to integrate with, refactor, or maintain compatibility against.

## Architecture Context

### System Boundaries
This orbit establishes a **standalone client-side application** with the following architectural characteristics:

- **Deployment Model:** Local development server only (no production hosting in this orbit)
- **Execution Environment:** Browser JavaScript runtime (no Node.js server component)
- **State Management:** Component-local state only (no global state management library required for basic calculator)
- **Data Flow:** Unidirectional data flow following React principles (props down, events up)

### Component Architecture Pattern
The calculator will follow a **container/presentation component split**:

- **Container Component (Calculator):** Manages calculation state, operation logic, and orchestrates child components
- **Presentation Components:** Display (shows numbers), ButtonGrid (renders calculator buttons), Button (individual button with click handlers)

### Technology Stack Decisions

#### Build Tool Selection
Three viable options for React project initialization:

1. **Vite** (Recommended) — Modern, fast development server with minimal configuration
2. **Create React App** — Traditional scaffolding tool with comprehensive defaults
3. **Manual Setup** — Custom webpack/Rollup configuration (excessive for this scope)

**Recommendation:** Vite for superior development experience (fast hot module replacement) and modern defaults (ES modules, optimized builds).

### State Management Strategy
Given the **frontend-only constraint** and **basic operations scope**, the calculator state will be managed through:

- React `useState` hooks for display value, pending operation, stored operand
- No need for Context API, Redux, Zustand, or other state management libraries
- State structure: `{ display: string, operator: string | null, operand: number | null, waitingForOperand: boolean }`

### Calculation Logic Location
All arithmetic operations will be implemented as **pure functions** within the Calculator component or extracted to a utility module (`src/utils/calculator.js`) if complexity warrants separation. No external math libraries needed for basic operations.

## Pattern Library

### React Patterns to Establish

#### Component File Structure
```
src/components/
├── Calculator.jsx       # Container component with state
├── Display.jsx          # Presentation component for numeric display
├── ButtonGrid.jsx       # Layout component for button arrangement
└── Button.jsx           # Reusable button presentation component
```

#### Naming Conventions
- **Components:** PascalCase (e.g., `Calculator`, `ButtonGrid`)
- **Files:** PascalCase matching component name with `.jsx` or `.js` extension
- **Props:** camelCase (e.g., `onClick`, `displayValue`, `isOperator`)
- **Event Handlers:** `handle` prefix (e.g., `handleNumberClick`, `handleOperatorClick`)
- **CSS Classes:** kebab-case or BEM methodology (e.g., `calculator-display`, `button--operator`)

#### State Management Pattern
```javascript
// Hook-based state management in functional components
const [display, setDisplay] = useState('0');
const [operator, setOperator] = useState(null);
```

#### Event Handling Pattern
```javascript
// Event handlers defined within container component
const handleNumberClick = (number) => {
  // State update logic
};

// Passed as props to presentation components
<Button value="7" onClick={() => handleNumberClick('7')} />
```

### Styling Approach
Since no existing styles exist, establish one of:

- **CSS Modules** — Scoped styles co-located with components (`Calculator.module.css`)
- **Inline Styles** — React style objects for simple styling needs
- **Plain CSS** — Single global stylesheet (`src/App.css`)

**Recommendation:** CSS Modules for component-scoped styling without external dependencies.

### Project Structure Pattern
```
autonomous-repo/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   ├── Display.jsx
│   │   ├── ButtonGrid.jsx
│   │   └── Button.jsx
│   ├── utils/
│   │   └── calculator.js       # Optional: calculation logic
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── .gitignore
├── package.json
└── README.md
```

## Prior Orbit References

### No Prior Orbits
This is **Orbit 1** in the trajectory. No previous implementation attempts, architectural decisions, or code artifacts exist to reference.

### Trajectory Context
The trajectory description indicates this is the **initial establishment** of a calculator application. Future orbits may:

- Add advanced features (scientific functions, history)
- Implement testing infrastructure
- Add deployment configuration
- Enhance accessibility or responsiveness

This orbit establishes the **foundational patterns** that future orbits will build upon or refactor.

## Risk Assessment

### Architectural Risks

#### Risk: Build Tool Lock-in
**Description:** Choice of Vite vs. Create React App vs. manual setup creates long-term tooling dependencies that are difficult to change.

**Impact:** Medium — Switching build tools later requires significant refactoring of configuration and potentially code structure.

**Mitigation:** 
- Use Vite for modern defaults and minimal abstraction
- Keep build configuration minimal and standard
- Document all non-standard configuration choices in README.md

#### Risk: Premature Abstraction
**Description:** Over-engineering component structure (too many layers, excessive props drilling) for a simple calculator.

**Impact:** Low — Increases code complexity without providing value for current scope.

**Mitigation:**
- Start with 3-4 components maximum (Calculator, Display, Button, optional ButtonGrid)
- Extract additional components only when duplication is evident
- Keep state management simple with local useState hooks

### Implementation Risks

#### Risk: Floating-Point Precision Errors
**Description:** JavaScript floating-point arithmetic produces imprecise results (e.g., `0.1 + 0.2 !== 0.3`).

**Impact:** High — Violates acceptance criteria for calculation accuracy.

**Mitigation:**
- Round display values to fixed decimal precision (e.g., 10 significant digits)
- Use `Number.parseFloat()` and `toFixed()` for display formatting
- Consider `Math.round()` with multiplier for precise decimal operations
- Document known precision limits in code comments

#### Risk: Division by Zero Handling
**Description:** Dividing by zero produces `Infinity` or `NaN` in JavaScript, which breaks the calculator display.

**Impact:** Medium — Creates confusing user experience and violates acceptance boundary for error handling.

**Mitigation:**
- Explicitly check for zero divisor before division operation
- Display error message ("Error" or "Cannot divide by zero")
- Require clear/reset action to recover from error state

#### Risk: Operation Chaining Logic Complexity
**Description:** Handling consecutive operations (e.g., "5 + 3 + 2" should display 8 after second +) requires stateful operation tracking.

**Impact:** Medium — Common calculator feature that users expect but adds state management complexity.

**Mitigation:**
- Implement clear state machine: `waitingForOperand` flag to track input state
- Execute pending operation when new operator is pressed
- Test edge cases: changing operator mid-input, equals followed by operator

### Development Environment Risks

#### Risk: Node.js Version Incompatibility
**Description:** Developer's local Node.js version may be incompatible with chosen build tool or React version.

**Impact:** Low — Blocks initial development server launch.

**Mitigation:**
- Specify `engines` field in `package.json` requiring Node.js >= 18.x
- Document Node.js version requirement prominently in README.md
- Recommend use of nvm (Node Version Manager) for version management

#### Risk: Git Configuration Issues
**Description:** Missing or incorrect `.gitignore` could commit `node_modules/` or build artifacts to repository.

**Impact:** Low — Pollutes repository history with large binary files.

**Mitigation:**
- Generate `.gitignore` as first file with standard Node.js exclusions
- Include patterns: `node_modules/`, `dist/`, `build/`, `.DS_Store`, coverage reports

### Security Risks

#### Risk: Dependency Vulnerabilities
**Description:** React and build tool dependencies may contain known security vulnerabilities.

**Impact:** Low — No user data, authentication, or server communication reduces attack surface.

**Mitigation:**
- Use latest stable versions of React (18.x) and Vite/CRA
- Document dependency update process in README.md
- Note: No automated scanning or updates required per non-goals

#### Risk: XSS Through Calculator Display
**Description:** If user input is rendered unsafely, could enable cross-site scripting attacks.

**Impact:** Very Low — Calculator only accepts numeric input, no free-form text or HTML.

**Mitigation:**
- React automatically escapes content by default
- Validate all input as numeric before state updates
- No use of `dangerouslySetInnerHTML` required

### User Experience Risks

#### Risk: Keyboard Event Conflicts
**Description:** Keyboard shortcuts may conflict with browser shortcuts or accessibility tools.

**Impact:** Low — May interfere with screen readers or browser navigation.

**Mitigation:**
- Use standard key mappings (numbers, operators, Enter, Escape)
- Avoid overriding critical browser shortcuts (Ctrl+T, Ctrl+W)
- Implement keyboard handlers on focused calculator container, not globally

#### Risk: Display Overflow
**Description:** Long calculation results may exceed display width, causing layout breakage or unreadable text.

**Impact:** Medium — Violates acceptance boundary for display capacity (12 character minimum).

**Mitigation:**
- Set `max-width` and `overflow: hidden` or `overflow: auto` on display element
- Use `text-overflow: ellipsis` for graceful truncation
- Implement scientific notation for very large/small numbers (>1e12 or <1e-12)