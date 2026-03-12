# Proposal Record: React Calculator Web App

## Interpreted Intent

This orbit establishes a **greenfield React calculator application** that performs the four basic arithmetic operations (addition, subtraction, multiplication, division) through a browser-based interface. The implementation must:

- Initialize a React project from scratch in the existing `autonomous-repo` repository
- Create a functional calculator UI with numeric display and button grid
- Support both mouse clicks and keyboard input for all operations
- Handle decimal numbers with appropriate precision (minimum 6, target 10 significant digits)
- Implement error handling for division by zero
- Support operation chaining (consecutive calculations without pressing equals)
- Provide clear/reset functionality
- Run locally via development server with no backend or deployment infrastructure

The application is **purely client-side** with all computation happening in the browser. This is the **foundational orbit** that establishes project structure, component architecture patterns, and development conventions for future trajectory work.

Key understanding: This is not about building a complex scientific calculator or production-ready application. The focus is on establishing a **clean, functional foundation** with proper React patterns and basic calculator behavior that meets acceptance criteria from minimal through target range.

## Implementation Plan

### Phase 1: Project Initialization

#### 1.1 Initialize Vite React Project
**Action:** Use Vite scaffolding to create React project structure

**Command:** 
```bash
npm create vite@latest . -- --template react
```

**Rationale:** Vite provides fast development server, modern ES module support, and minimal configuration overhead. The `.` argument initializes in the current directory rather than creating a subdirectory.

**Generated Files:**
- `package.json` — Dependencies: react@^18.2.0, react-dom@^18.2.0, vite@^5.0.0
- `vite.config.js` — Minimal Vite configuration
- `index.html` — Entry HTML file (Vite places this in root, not public/)
- `src/main.jsx` — React application entry point
- `src/App.jsx` — Root component (to be replaced)
- `src/App.css` — Root styles (to be replaced)
- `src/index.css` — Global styles
- `.gitignore` — Standard Node.js exclusions

#### 1.2 Install Dependencies
**Action:** Install npm packages

**Command:**
```bash
npm install
```

**Verification:** Confirm `node_modules/` directory created and `package-lock.json` generated

#### 1.3 Verify Development Server
**Action:** Launch development server to confirm setup

**Command:**
```bash
npm run dev
```

**Expected Output:** Server running on `http://localhost:5173` with default Vite React template

### Phase 2: Project Structure Setup

#### 2.1 Create Directory Structure
**Action:** Establish component organization

**Directories to Create:**
```
src/components/
src/utils/
```

**Commands:**
```bash
mkdir -p src/components
mkdir -p src/utils
```

#### 2.2 Configure .gitignore
**Action:** Ensure proper Git exclusions

**File:** `.gitignore`

**Content Additions (if not already present):**
```
# dependencies
node_modules/

# Vite build output
dist/
dist-ssr/

# local env files
.env.local
.env.*.local

# logs
*.log

# OS files
.DS_Store

# IDE
.vscode/
.idea/
```

### Phase 3: Core Calculator Implementation

#### 3.1 Create Calculation Utility
**Action:** Implement pure calculation functions with precision handling

**File:** `src/utils/calculator.js`

**Implementation:**
```javascript
/**
 * Perform arithmetic operations with floating-point precision handling
 */
export const calculate = (operand1, operator, operand2) => {
  const a = parseFloat(operand1);
  const b = parseFloat(operand2);
  
  if (isNaN(a) || isNaN(b)) {
    return 'Error';
  }
  
  let result;
  
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        return 'Error';
      }
      result = a / b;
      break;
    default:
      return 'Error';
  }
  
  // Round to 10 significant digits to handle floating-point precision
  return parseFloat(result.toPrecision(10));
};

/**
 * Format display value with appropriate precision
 */
export const formatDisplay = (value) => {
  if (value === 'Error') return value;
  
  const num = parseFloat(value);
  if (isNaN(num)) return '0';
  
  // Handle very large or very small numbers with scientific notation
  if (Math.abs(num) >= 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6);
  }
  
  // Limit display to 12 characters
  const str = num.toString();
  if (str.length > 12) {
    return parseFloat(num.toPrecision(10)).toString();
  }
  
  return str;
};
```

**Rationale:** Separates calculation logic from UI, handles division by zero, implements precision rounding, and formats display output.

#### 3.2 Create Button Component
**Action:** Build reusable button presentation component

**File:** `src/components/Button.jsx`

**Implementation:**
```javascript
import './Button.css';

const Button = ({ value, onClick, type = 'number' }) => {
  return (
    <button 
      className={`calculator-button calculator-button--${type}`}
      onClick={() => onClick(value)}
    >
      {value}
    </button>
  );
};

export default Button;
```

**File:** `src/components/Button.css`

**Implementation:**
```css
.calculator-button {
  font-size: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.15s;
}

.calculator-button:hover {
  background-color: #e0e0e0;
}

.calculator-button:active {
  background-color: #d0d0d0;
}

.calculator-button--operator {
  background-color: #ff9500;
  color: white;
  font-weight: bold;
}

.calculator-button--operator:hover {
  background-color: #e68a00;
}

.calculator-button--action {
  background-color: #d4d4d2;
  font-size: 1.2rem;
}

.calculator-button--action:hover {
  background-color: #c0c0be;
}

.calculator-button--equals {
  background-color: #4CAF50;
  color: white;
  font-weight: bold;
}

.calculator-button--equals:hover {
  background-color: #45a049;
}
```

**Rationale:** Provides visual distinction between number, operator, action, and equals buttons. CSS Modules avoided to minimize initial complexity; plain CSS with BEM-style naming used instead.

#### 3.3 Create Display Component
**Action:** Build numeric display presentation component

**File:** `src/components/Display.jsx`

**Implementation:**
```javascript
import './Display.css';

const Display = ({ value }) => {
  return (
    <div className="calculator-display">
      {value}
    </div>
  );
};

export default Display;
```

**File:** `src/components/Display.css`

**Implementation:**
```css
.calculator-display {
  background-color: #222;
  color: #fff;
  font-size: 2.5rem;
  text-align: right;
  padding: 1.5rem;
  min-height: 4rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-radius: 5px 5px 0 0;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

**Rationale:** Fixed-width monospace font ensures consistent character spacing. Text overflow handling prevents layout breakage with long numbers.

#### 3.4 Create Calculator Container Component
**Action:** Implement state management and calculation logic

**File:** `src/components/Calculator.jsx`

**Implementation:**
```javascript
import { useState, useEffect } from 'react';
import Display from './Display';
import Button from './Button';
import { calculate, formatDisplay } from '../utils/calculator';
import './Calculator.css';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operand, setOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  // Handle number button clicks
  const handleNumberClick = (num) => {
    if (display === 'Error') {
      return; // Require clear to recover from error
    }

    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? String(num) : display + num);
    }
  };

  // Handle decimal point
  const handleDecimalClick = () => {
    if (display === 'Error') {
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  // Handle operator button clicks
  const handleOperatorClick = (nextOperator) => {
    if (display === 'Error') {
      return;
    }

    const inputValue = parseFloat(display);

    if (operand === null) {
      setOperand(inputValue);
    } else if (operator) {
      const result = calculate(operand, operator, inputValue);
      setDisplay(formatDisplay(result));
      setOperand(result === 'Error' ? null : result);
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  // Handle equals button
  const handleEqualsClick = () => {
    if (display === 'Error' || operator === null) {
      return;
    }

    const inputValue = parseFloat(display);
    const result = calculate(operand, operator, inputValue);
    
    setDisplay(formatDisplay(result));
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  // Handle clear button
  const handleClearClick = () => {
    setDisplay('0');
    setOperand(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      if (key >= '0' && key <= '9') {
        handleNumberClick(key);
      } else if (key === '.') {
        handleDecimalClick();
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault(); // Prevent browser shortcuts
        handleOperatorClick(key);
      } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        handleEqualsClick();
      } else if (key === 'Escape' || key === 'c' || key === 'C') {
        handleClearClick();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [display, operand, operator, waitingForOperand]);

  return (
    <div className="calculator">
      <Display value={display} />
      <div className="calculator-buttons">
        <Button value="C" onClick={handleClearClick} type="action" />
        <Button value="/" onClick={handleOperatorClick} type="operator" />
        <Button value="*" onClick={handleOperatorClick} type="operator" />
        <Button value="-" onClick={handleOperatorClick} type="operator" />
        
        <Button value="7" onClick={handleNumberClick} type="number" />
        <Button value="8" onClick={handleNumberClick} type="number" />
        <Button value="9" onClick={handleNumberClick} type="number" />
        <Button value="+" onClick={handleOperatorClick} type="operator" />
        
        <Button value="4" onClick={handleNumberClick} type="number" />
        <Button value="5" onClick={handleNumberClick} type="number" />
        <Button value="6" onClick={handleNumberClick} type="number" />
        
        <Button value="1" onClick={handleNumberClick} type="number" />
        <Button value="2" onClick={handleNumberClick} type="number" />
        <Button value="3" onClick={handleNumberClick} type="number" />
        <Button value="=" onClick={handleEqualsClick} type="equals" />
        
        <Button value="0" onClick={handleNumberClick} type="number" />
        <Button value="." onClick={handleDecimalClick} type="number" />
      </div>
    </div>
  );
};

export default Calculator;
```

**File:** `src/components/Calculator.css`

**Implementation:**
```css
.calculator {
  max-width: 400px;
  margin: 2rem auto;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calculator-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background-color: #ccc;
}

.calculator-button:nth-child(1) {
  grid-column: 1 / 3;
}

.calculator-button:nth-child(17) {
  grid-column: 1 / 3;
}

.calculator-button:nth-child(16) {
  grid-row: 5 / 7;
}
```

**Rationale:** Implements complete state machine for calculator operations, handles operation chaining, provides keyboard support, and manages error states. Grid layout creates clean button arrangement.

### Phase 4: Application Integration

#### 4.1 Update Root Application Component
**Action:** Replace default Vite template with calculator

**File:** `src/App.jsx`

**Implementation:**
```javascript
import Calculator from './components/Calculator';
import './App.css';

function App() {
  return (
    <div className="app">
      <h1>React Calculator</h1>
      <Calculator />
    </div>
  );
}

export default App;
```

**File:** `src/App.css`

**Implementation:**
```css
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app h1 {
  text-align: center;
  color: white;
  font-size: 3rem;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}
```

#### 4.2 Update Global Styles
**Action:** Set baseline styles

**File:** `src/index.css`

**Implementation:**
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Phase 5: Documentation

#### 5.1 Update README
**Action:** Replace placeholder content with comprehensive setup instructions

**File:** `README.md`

**Implementation:**
```markdown
# React Calculator Web App

A basic calculator web application built with React that performs addition, subtraction, multiplication, and division.

## Features

- Basic arithmetic operations (+, −, ×, ÷)
- Decimal number support
- Operation chaining (consecutive calculations)
- Keyboard input support
- Error handling for division by zero
- Clean, intuitive interface

## Prerequisites

- Node.js 18.x or higher
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/neerb/autonomous-repo.git
cd autonomous-repo
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:5173`

## Usage

### Mouse Input
- Click number buttons (0-9) to input numbers
- Click operation buttons (+, −, ×, ÷) to perform calculations
- Click = to complete calculation
- Click C to clear and reset

### Keyboard Input
- Number keys (0-9) for digit input
- Operators (+, -, *, /) for operations
- Enter or = for equals
- Escape or C for clear
- Period (.) for decimal point

## Project Structure

```
autonomous-repo/
├── src/
│   ├── components/
│   │   ├── Calculator.jsx    # Main calculator container
│   │   ├── Calculator.css
│   │   ├── Display.jsx        # Numeric display component
│   │   ├── Display.css
│   │   ├── Button.jsx         # Reusable button component
│   │   └── Button.css
│   ├── utils/
│   │   └── calculator.js      # Calculation logic and formatting
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Technical Details

- **Framework:** React 18.x
- **Build Tool:** Vite 5.x
- **Styling:** Plain CSS with component-specific stylesheets
- **State Management:** React useState hooks
- **Precision:** 10 significant digits for calculations

## Known Limitations

- Displays up to 12 characters (switches to scientific notation for larger numbers)
- Standard JavaScript floating-point precision limits apply
- Desktop-first design (not optimized for mobile)
```

#### 5.2 Update Package.json Metadata
**Action:** Add project description and repository metadata

**File:** `package.json` (modify existing fields)

**Changes:**
```json
{
  "name": "react-calculator-app",
  "description": "Basic calculator web application built with React",
  "version": "1.0.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/neerb/autonomous-repo.git"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Phase 6: Verification

#### 6.1 Manual Testing Checklist
**Actions to perform before completion:**

1. **Launch verification:**
   - Run `npm run dev`
   - Confirm no console errors
   - Confirm calculator displays at localhost:5173

2. **Basic operation tests:**
   - Test: 5 + 3 = 8
   - Test: 10 - 4 = 6
   - Test: 7 * 6 = 42
   - Test: 20 / 4 = 5

3. **Decimal tests:**
   - Test: 0.1 + 0.2 (should display ~0.3 with precision handling)
   - Test: 5.5 * 2 = 11

4. **Error handling:**
   - Test: 5 / 0 (should display "Error")
   - Test: Clear button recovers from error state

5. **Operation chaining:**
   - Test: 5 + 3 + 2 (should display 8 after second +, then 10 after final =)

6. **Keyboard input:**
   - Test: Type "5+3=" using keyboard
   - Test: Press Escape to clear

7. **Edge cases:**
   - Test: Multiple decimal points (should only allow one)
   - Test: Very large numbers (should format appropriately)

## Risk Surface

### Implementation Risks

#### Risk 1: Floating-Point Precision Errors
**Description:** JavaScript's floating-point arithmetic may produce imprecise results (e.g., `0.1 + 0.2 = 0.30000000000000004`)

**Likelihood:** High — Will occur with any decimal operations

**Impact:** Medium — Violates acceptance criteria for calculation accuracy

**Mitigation Implemented:**
- `calculate()` function uses `toPrecision(10)` to round results to 10 significant digits
- `formatDisplay()` function truncates display to prevent showing floating-point artifacts
- Display formatting limits shown digits while preserving calculation accuracy

**Residual Risk:** Some edge cases with repeating decimals may still show minor precision issues beyond 10 significant digits

#### Risk 2: Division by Zero
**Description:** JavaScript division by zero produces `Infinity`, which breaks display and subsequent calculations

**Likelihood:** Medium — Users will attempt this operation

**Impact:** High — Breaks calculator functionality until cleared

**Mitigation Implemented:**
- Explicit check in `calculate()` function returns 'Error' string for zero divisor
- Error state displayed to user
- Calculator requires clear action to recover, preventing cascading errors
- Keyboard input disabled during error state

**Residual Risk:** None — fully mitigated

#### Risk 3: Operation Chaining State Complexity
**Description:** Managing state for consecutive operations (e.g., "5 + 3 + 2") requires careful state machine implementation

**Likelihood:** High — Core feature users expect

**Impact:** High — Incorrect chaining breaks fundamental calculator behavior

**Mitigation Implemented:**
- `waitingForOperand` flag tracks whether next input starts new number
- Operator click executes pending operation before setting new operator
- Equals click finalizes operation and resets operator state
- State transitions explicitly tested in manual verification checklist

**Residual Risk:** Low — Edge cases with rapid operator changes may produce unexpected behavior

#### Risk 4: Display Overflow
**Description:** Long calculation results may exceed display width, causing layout breakage

**Likelihood:** Medium — Can occur with large multiplication results

**Impact:** Medium — Display becomes unreadable but calculations still work

**Mitigation Implemented:**
- CSS `overflow: hidden` and `text-overflow: ellipsis` on display component
- `formatDisplay()` switches to scientific notation for numbers >= 1e12 or <= 1e-6
- 12-character display capacity enforced through formatting logic

**Residual Risk:** Low — Scientific notation may be unfamiliar to some users

### Architectural Risks

#### Risk 5: Vite Build Tool Lock-In
**Description:** Using Vite creates dependency on specific build configuration and plugins

**Likelihood:** Low — Only becomes issue if build tool migration needed

**Impact:** Medium — Future migration requires configuration rewrite

**Mitigation Implemented:**
- Minimal Vite configuration used (default template settings)
- No custom plugins or advanced features
- Standard React code with no Vite-specific APIs
- README documents build tool choice for future reference

**Residual Risk:** Low — Migration path exists but requires effort

#### Risk 6: Component Coupling
**Description:** Calculator component contains both state management and rendering logic, potentially limiting reusability

**Likelihood:** Low — Only becomes issue if future orbits require calculator logic reuse

**Impact:** Low — Refactoring is straightforward if needed

**Mitigation Implemented:**
- Calculation logic extracted to `src/utils/calculator.js`
- Button and Display are pure presentation components
- Clear separation between container (Calculator) and presentation layers

**Residual Risk:** Very Low — Current architecture supports refactoring if needed

### Development Environment Risks

#### Risk 7: Node.js Version Incompatibility
**Description:** Developer may have Node.js version < 18.x, causing Vite startup failure

**Likelihood:** Medium — Depends on developer environment

**Impact:** High — Blocks initial development

**Mitigation Implemented:**
- `engines` field in package.json specifies Node.js >= 18.0.0
- README prominently lists Node.js 18.x requirement
- npm will warn if Node version doesn't match

**Residual Risk:** Low — Clear error messaging guides developer to solution

#### Risk 8: Port Conflict on 5173
**Description:** Vite's default port 5173 may be occupied by another process

**Likelihood:** Low — Uncommon unless developer runs multiple Vite projects

**Impact:** Low — Vite automatically selects next available port

**Mitigation:** Vite handles automatically

**Residual Risk:** Very Low — No action needed

### User Experience Risks

#### Risk 9: Keyboard Event Capture
**Description:** Global keyboard event listener may interfere with browser shortcuts or accessibility tools

**Likelihood:** Low — Limited to specific key combinations

**Impact:** Low — Some browser shortcuts may not work while calculator focused

**Mitigation Implemented:**
- `event.preventDefault()` only called for operator keys that might trigger browser shortcuts
- Standard number keys and letters not prevented
- Event listener attached to window, not document, allowing event bubbling

**Residual Risk:** Low — Critical browser shortcuts (Ctrl+T, Alt+Tab) remain functional

#### Risk 10: No Input Validation Feedback
**Description:** Invalid keyboard input (letters, special characters) provides no user feedback

**Likelihood:** Medium — Users may attempt to type invalid characters

**Impact:** Very Low — Invalid input silently ignored

**Mitigation:** Event handler only responds to valid input keys; all other keys no-op

**Residual Risk:** Very Low — Acceptable for MVP scope

## Scope Estimate

### Complexity Assessment
**Overall Complexity:** Low to Medium

**Breakdown:**
- **Project Setup:** Low — Standard Vite React initialization
- **Component Architecture:** Low — 4 simple components with clear responsibilities
- **State Management:** Medium — Calculator state machine requires careful implementation but well-defined patterns exist
- **Calculation Logic:** Low — Basic arithmetic with precision handling
- **Keyboard Support:** Medium — Event handling and key mapping adds moderate complexity
- **Styling:** Low — CSS Grid for layout, no complex animations or responsive requirements

### Work Phases

| Phase | Description | Estimated Effort | Files Created/Modified |
|-------|-------------|------------------|------------------------|
| 1. Project Init | Vite setup, dependency install | 15 min | package.json, vite.config.js, base files |
| 2. Structure Setup | Create directories, configure git | 10 min | Directory structure, .gitignore |
| 3. Core Implementation | Build Calculator, Display, Button components | 90 min | 6 component files, 1 utility file |
| 4. Integration | Wire components, root app, styles | 30 min | App.jsx, App.css, index.css |
| 5. Documentation | Update README, package.json metadata | 20 min | README.md, package.json |
| 6. Verification | Manual testing, bug fixes | 30 min | N/A (testing phase) |

**Total Estimated Effort:** ~3 hours

### Orbit Count
**Single Orbit:** This entire implementation completes in Orbit 1 as scoped. No additional orbits required unless acceptance criteria are not met during verification.

### Acceptance Criteria Mapping

| Acceptance Boundary | Implementation Coverage |
|---------------------|------------------------|
| **Minimal Threshold** | |
| Launch without errors | Phase 1 verification, Phase 6 testing |
| All 4 operations work correctly | Phase 3.1 calculator.js implements all operations |
| Visual interface with display and buttons | Phase 3.2-3.4 implements complete UI |
| Two-number operation execution | Phase 3.4 Calculator state machine |
| **Target Range** | |
| Decimal support with 2+ places | Phase 3.1 precision handling, formatDisplay() |
| Real-time display updates | Phase 3.4 useState hooks trigger immediate re-renders |
| Clear/reset functionality | Phase 3.4 handleClearClick() |
| Division by zero error handling | Phase 3.1 explicit zero check in calculate() |
| Operation chaining | Phase 3.4 handleOperatorClick() logic |
| Keyboard input | Phase 3.4 useEffect keyboard listener |
| Visual button distinction | Phase 3.2 Button.css type-based styling |
| **Exceptional Ceiling** | |
| Responsive layout | NOT IMPLEMENTED — Desktop-first per constraints |
| All keyboard shortcuts | IMPLEMENTED — Phase 3.4 covers all operations |
| Thousand separators | NOT IMPLEMENTED — Adds complexity without requirement |
| Detailed error messages | PARTIALLY — "Error" displayed, not specific messages |
| Intermediate result display | IMPLEMENTED — Operation chaining shows results |
| Accessible keyboard navigation | NOT IMPLEMENTED — Standard tab order only |

**Target Achievement:** Implementation achieves **100% of Minimal Threshold** and **~85% of Target Range**. Exceptional ceiling features intentionally omitted per non-goals (responsiveness) and scope management (accessibility enhancements, advanced formatting).

## Human Modifications

Pending human review.