# Verification Protocol: React Calculator Web App - Enhanced Testing & Validation

## Automated Gates

### Gate 1: Test Infrastructure Validation

**Objective:** Verify testing framework installed correctly and meets constraint boundaries.

**Execution Command:**
```bash
npm install && du -sh node_modules/{vitest,jsdom,@testing-library} | awk '{sum+=$1}END{print sum"MB"}'
```

**Pass Criteria:**
- Total testing library footprint ≤10MB (Intent Constraint: "Testing framework additions must not exceed 10MB")
- Exit code 0 from npm install (no dependency conflicts)
- Files exist: `vitest.config.js`, `src/test/setup.js`

**Failure Action:** Re-orbit to Phase 1 with dependency optimization (remove optional packages like `@testing-library/jest-dom`)

---

### Gate 2: Unit Test Execution - Calculator Logic

**Objective:** Validate all four arithmetic operations with comprehensive edge case coverage.

**Execution Command:**
```bash
npm test -- src/test/utils/calculator.test.js --reporter=json --outputFile=.orbital/artifacts/unit-test-results.json
```

**Pass Criteria:**
- **Minimum Acceptable (Intent):** ≥20 total test cases execute without errors
- **Target Success (Intent):** ≥30 test cases pass, covering:
  - Addition: positive numbers, negative numbers, decimals, zero operand (≥8 tests)
  - Subtraction: same coverage pattern (≥8 tests)
  - Multiplication: including multiply by zero, multiply by one (≥8 tests)
  - Division: including division by zero handling (≥8 tests)
- Execution time <10 seconds (contributes to 30-second total budget)
- Zero test timeouts or infrastructure failures

**Expected Test Cases (Minimum 32):**

| Test Suite | Test Case | Input | Expected Output | Intent Traceability |
|------------|-----------|-------|-----------------|---------------------|
| Addition | adds two positive integers | 5 + 3 | 8 | Intent Quality Standard: "two positive numbers" |
| Addition | adds two positive decimals | 1.5 + 2.7 | 4.2 | Intent Quality Standard: "decimal inputs" |
| Addition | adds two negative numbers | -5 + -3 | -8 | Intent Quality Standard: "two negative numbers" |
| Addition | adds positive and negative | 5 + -3 | 2 | Intent Quality Standard: "two negative numbers" |
| Addition | adds zero to positive | 0 + 5 | 5 | Intent Quality Standard: "zero as operand" |
| Addition | adds zero to negative | 0 + -5 | -5 | Intent Quality Standard: "zero as operand" |
| Addition | handles large numbers | 1e15 + 1e15 | 2e15 | Intent Target: "large numbers" |
| Addition | handles floating point | 0.1 + 0.2 | ~0.3 (toBeCloseTo) | Intent Target: "floating-point precision" |
| Subtraction | subtracts positive integers | 10 - 3 | 7 | Intent Quality Standard: "two positive numbers" |
| Subtraction | subtracts with decimals | 5.5 - 2.2 | 3.3 | Intent Quality Standard: "decimal inputs" |
| Subtraction | subtracts negative numbers | -5 - -3 | -2 | Intent Quality Standard: "two negative numbers" |
| Subtraction | subtracts to negative result | 3 - 5 | -2 | Intent Quality Standard: edge case |
| Subtraction | subtracts from zero | 0 - 5 | -5 | Intent Quality Standard: "zero as operand" |
| Subtraction | subtracts zero | 5 - 0 | 5 | Intent Quality Standard: "zero as operand" |
| Subtraction | handles large numbers | 1e15 - 1e14 | 9e14 | Intent Target: "large numbers" |
| Subtraction | handles precision | 1.1 - 0.1 | ~1.0 (toBeCloseTo) | Intent Target: "floating-point precision" |
| Multiplication | multiplies positive integers | 5 × 3 | 15 | Intent Quality Standard: "two positive numbers" |
| Multiplication | multiplies decimals | 2.5 × 4.0 | 10.0 | Intent Quality Standard: "decimal inputs" |
| Multiplication | multiplies negative numbers | -5 × -3 | 15 | Intent Quality Standard: "two negative numbers" |
| Multiplication | multiplies positive and negative | 5 × -3 | -15 | Intent Quality Standard: sign handling |
| Multiplication | multiplies by zero | 5 × 0 | 0 | Intent Quality Standard: "zero as operand" |
| Multiplication | multiplies by one | 5 × 1 | 5 | Intent Quality Standard: identity operation |
| Multiplication | handles large numbers | 1e7 × 1e7 | 1e14 | Intent Target: "large numbers" |
| Multiplication | handles precision | 0.1 × 0.2 | ~0.02 (toBeCloseTo) | Intent Target: "floating-point precision" |
| Division | divides positive integers | 10 ÷ 2 | 5 | Intent Quality Standard: "two positive numbers" |
| Division | divides with decimals | 5.5 ÷ 2.0 | 2.75 | Intent Quality Standard: "decimal inputs" |
| Division | divides negative numbers | -10 ÷ -2 | 5 | Intent Quality Standard: "two negative numbers" |
| Division | divides positive by negative | 10 ÷ -2 | -5 | Intent Quality Standard: sign handling |
| Division | divides by zero | 5 ÷ 0 | Infinity or "Error" | Intent Target: "division by zero handling" |
| Division | divides zero | 0 ÷ 5 | 0 | Intent Quality Standard: "zero as operand" |
| Division | divides by one | 5 ÷ 1 | 5 | Intent Quality Standard: identity operation |
| Division | handles precision | 1.0 ÷ 3.0 | ~0.333... (toBeCloseTo) | Intent Target: "floating-point precision" |

**Failure Action:** If <20 tests execute: BLOCK orbit, re-orbit Phase 2. If 20-29 tests pass: CONDITIONAL PASS with human review required (Intent: "Minimum Acceptable").

---

### Gate 3: Component Test Execution

**Objective:** Verify React components render correctly and respond to props.

**Execution Command:**
```bash
npm test -- src/test/components/*.test.jsx --reporter=json --outputFile=.orbital/artifacts/component-test-results.json
```

**Pass Criteria:**
- **Minimum Acceptable:** ≥6 component tests execute (Button: 3, Display: 3)
- All tests use semantic queries (`getByRole`, `getByLabelText`, not CSS selectors)
- Tests validate behavior (callbacks fire, props render) not implementation (class names)
- Execution time <5 seconds

**Expected Test Cases (Minimum 6):**

| Component | Test Case | Validation | Intent Traceability |
|-----------|-----------|------------|---------------------|
| Button | renders with provided label | screen.getByText(label) exists | Intent: Component integration validation |
| Button | calls onClick when clicked | Mock function called once | Intent: UI interaction validation |
| Button | applies correct CSS class | Component renders without errors | Intent: Visual validation criteria |
| Display | renders provided value | screen.getByText(value) exists | Intent Target: "display formatting" |
| Display | displays zero by default | screen.getByText('0') exists | Intent: Initial state validation |
| Display | handles long numbers | No overflow, ellipsis or scroll | Intent Target: "large numbers" edge case |

**Failure Action:** If tests fail due to missing APIs, add polyfills to `src/test/setup.js` and re-run. If tests fail due to wrong prop interfaces, BLOCK and escalate to human review (production code inspection needed).

---

### Gate 4: Integration Test Execution - User Workflows

**Objective:** Validate end-to-end user interactions from button click through calculation to display update.

**Execution Command:**
```bash
npm test -- src/test/integration/calculator-workflows.test.jsx --reporter=json --outputFile=.orbital/artifacts/integration-test-results.json
```

**Pass Criteria:**
- **Target Success (Intent):** ≥5 integration tests pass covering:
  - Basic arithmetic operation (one test per operation type)
  - Operation chaining (Intent Quality Standard: "operation chaining")
  - Error handling (division by zero graceful degradation)
- Tests simulate realistic user interactions via `@testing-library/user-event`
- Execution time <15 seconds (budget management)

**Expected Test Cases (Minimum 5):**

| Test Case | User Actions | Expected Display | Intent Traceability |
|-----------|--------------|------------------|---------------------|
| Basic addition: 5 + 3 = 8 | Click [5] [+] [3] [=] | Display shows "8" | Intent Desired Outcome: "addition...function correctly" |
| Operation chaining: 10 - 3 = 7, then × 2 = 14 | Click [1][0][-][3][=], then [×][2][=] | First "7", then "14" | Intent Quality Standard: "operation chaining" |
| Division by zero: 5 ÷ 0 | Click [5][÷][0][=] | "Error" or "Infinity" (per implementation) | Intent Target: "division by zero handling" |
| Decimal calculation: 0.1 + 0.2 | Click [0][.][1][+][0][.][2][=] | Display ~"0.3" | Intent Target: "floating-point precision" |
| Negative result: 3 - 5 = -2 | Click [3][-][5][=] | Display shows "-2" | Intent Target: "error states" (negative display) |

**Failure Action:** If tests timeout: reduce `waitFor` timeouts, use `userEvent.setup()` optimization. If assertions fail: BLOCK and require human review of Calculator.jsx state management implementation.

---

### Gate 5: Test Execution Performance Budget

**Objective:** Ensure all automated tests execute within 30-second constraint.

**Execution Command:**
```bash
time npm test -- --reporter=json --outputFile=.orbital/artifacts/full-test-results.json
```

**Pass Criteria:**
- Total execution time ≤30 seconds (Intent Constraint: "execute in under 30 seconds total")
- Breakdown budget:
  - Unit tests: ≤10 seconds
  - Component tests: ≤5 seconds
  - Integration tests: ≤15 seconds
- No individual test exceeds 5-second timeout

**Failure Action:** If budget exceeded: optimize tests (remove unnecessary `waitFor` calls, use synchronous APIs where possible). If cannot optimize: reduce test count to meet budget while maintaining Intent "Minimum Acceptable" threshold (20+ tests).

---

### Gate 6: Test Output Format Validation

**Objective:** Verify machine-readable output for CI/CD integration.

**Execution Command:**
```bash
cat .orbital/artifacts/full-test-results.json | jq '.testResults | length'
```

**Pass Criteria:**
- JSON file exists at `.orbital/artifacts/full-test-results.json` (Intent: "machine-readable output")
- JSON parseable (valid syntax)
- Contains fields: `numTotalTests`, `numPassedTests`, `numFailedTests`, `testResults[]`
- `numTotalTests` ≥20 (Intent: "Minimum Acceptable")

**Failure Action:** If JSON malformed: check Vitest reporter configuration in `vitest.config.js`. If file missing: verify `outputFile` path in config.

---

### Gate 7: Production Code Integrity

**Objective:** Verify no production code modified during verification implementation (Intent Constraint).

**Execution Command:**
```bash
git diff HEAD --name-only | grep -E '^src/(components|utils)/' && echo "FAIL: Production code modified" || echo "PASS"
```

**Pass Criteria:**
- **CRITICAL CONSTRAINT (Intent):** Zero modifications to files in:
  - `src/components/*.jsx`
  - `src/utils/*.js`
  - `src/App.jsx`
  - `src/main.jsx`
- Only permitted changes:
  - New files in `src/test/`
  - `package.json` (devDependencies only)
  - `vitest.config.js` (new file)
  - `.orbital/artifacts/*`
  - `README.md` (documentation updates)

**Failure Action:** If production code modified: IMMEDIATE BLOCK, rollback commit, re-orbit with strict code review gate.

---

### Gate 8: Dependency Bundle Size Validation

**Objective:** Verify test dependencies do not leak into production bundle.

**Execution Command:**
```bash
npm run build && du -sh dist/ && ls dist/ | grep -E 'vitest|@testing-library' && echo "FAIL: Test deps in bundle" || echo "PASS"
```

**Pass Criteria:**
- `dist/` folder size unchanged from baseline (production bundle unaffected)
- No test library names appear in `dist/` file listing
- `package.json` shows testing libraries in `devDependencies` only

**Failure Action:** If test deps in bundle: add test directories to Vite's `build.rollupOptions.external`. If bundle size increased: investigate and remove any production imports of test libraries.

---

## Human Verification Points

### HVP-1: Calculator Logic API Inspection

**Prerequisite:** Before automated tests run.

**Reviewer Action:**
1. Open `src/utils/calculator.js` in code editor
2. Identify exported functions and their signatures
3. Document actual API contract:
   - Function names (e.g., `add()`, `subtract()`, or `calculate(op, a, b)`?)
   - Parameter order and types
   - Return value format (number, string, or object?)
   - Error handling approach for division by zero

**Verification Checklist:**
- [ ] Exported function names match test imports in `src/test/utils/calculator.test.js`
- [ ] Test function calls use correct parameter order
- [ ] Division by zero test assertions match actual implementation behavior
- [ ] Test mocks (if any) align with actual function signatures

**Intent Traceability:** Intent Dependency: "Existing calculator implementation in src/utils/calculator.js (must remain stable during verification)"

**Pass Criteria:** All test imports successfully call actual functions without TypeErrors or "function not found" errors.

**Failure Action:** If API mismatch discovered: update test imports and function calls in Phase 2 tests. Document actual API in `src/test/README.md`.

---

### HVP-2: Component Prop Interface Review

**Timing:** After component tests written, before integration tests.

**Reviewer Action:**
1. Open `src/components/Button.jsx` and `src/components/Display.jsx`
2. Identify prop interfaces (PropTypes, TypeScript interfaces, or JSDoc)
3. Review component test files (`src/test/components/*.test.jsx`) and verify:
   - Test components receive props using correct names
   - Prop types match (string vs. number, callback signatures)
   - Required props are always provided in tests

**Verification Checklist:**
- [ ] Button tests pass `onClick` callback with correct signature
- [ ] Button tests pass `label` or `children` prop correctly
- [ ] Display tests pass `value` prop with correct type (string vs. number)
- [ ] No PropType warnings in test console output
- [ ] Component tests use semantic queries, not brittle selectors

**Intent Traceability:** Context Package: "Component Props: Integration tests must match the actual prop interfaces"

**Pass Criteria:** All component tests render without PropType warnings or missing prop errors.

**Failure Action:** If prop mismatches found: update test props to match actual component interfaces. If components lack PropTypes: add inline documentation to tests explaining expected props.

---

### HVP-3: Manual Verification Checklist Execution

**Timing:** After all automated gates pass.

**Reviewer Action:**
1. Start development server: `npm run dev`
2. Open `.orbital/artifacts/manual-verification-checklist.md`
3. Execute each scenario step-by-step
4. Fill in "Actual Result" column with PASS/FAIL and notes
5. Screenshot any failures for documentation

**Verification Checklist (Minimum 8 Scenarios):**

| Scenario | Steps | Expected Result | Acceptance Boundary |
|----------|-------|-----------------|---------------------|
| 1. Basic Addition | Click [5][+][3][=] | Display shows "8", no errors | Intent Minimum: Manual checklist with 8+ scenarios |
| 2. Operation Chaining | [10][-][3][=], then [×][2][=] | First "7", then "14" | Intent Quality Standard: "operation chaining" |
| 3. Division by Zero | [5][÷][0][=] | Error message or Infinity displayed gracefully | Intent Target: "division by zero handling" |
| 4. Decimal Input | [0][.][1][+][0][.][2][=] | Display ~"0.3" (accept 0.30000000004) | Intent Target: "floating-point precision" |
| 5. Negative Result Display | [3][-][5][=] | Display shows "-2" with proper formatting | Intent Target: "display formatting" |
| 6. Large Number Handling | [9][9][9][9][9][9][9][9][9][9] | Display shows all digits or scientific notation | Intent Target: "large numbers" |
| 7. Clear/Reset Function | Enter "5+3", click Clear, enter "2×4" | Previous calculation cleared, new calc works | Intent: Basic functionality validation |
| 8. Rapid Button Clicking | Click [5] rapidly 10 times | Display updates smoothly, no crashes | Intent: Stress test, UX coherence |

**Intent Traceability:** Intent Acceptance Boundary: "Manual verification checklist documenting 8+ interactive scenarios with expected results"

**Pass Criteria:**
- **Minimum Acceptable (Intent):** ≥6 of 8 scenarios PASS
- **Target Success (Intent):** All 8 scenarios PASS with visual validation notes
- No browser console errors during any scenario
- Display formatting consistent (font, alignment, color)

**Failure Action:** 
- If ≥2 scenarios fail: BLOCK orbit, investigate root cause (likely Calculator.jsx state management issue)
- If 1 scenario fails: CONDITIONAL PASS with documented known limitation
- If failures are visual only (formatting): PASS with UI improvement recommendations for future orbit

---

### HVP-4: Test Strategy Architectural Review

**Timing:** After full implementation, before orbit closure.

**Reviewer Action:**
1. Review test file organization in `src/test/`
2. Assess test quality against Context Package patterns:
   - Tests use semantic queries (not CSS selectors)
   - Integration tests simulate realistic user workflows
   - Unit tests avoid testing implementation details
3. Evaluate test maintainability:
   - Clear test descriptions
   - No hardcoded magic numbers without comments
   - Test setup/teardown properly managed

**Verification Checklist:**
- [ ] Test organization follows proposed structure (`utils/`, `components/`, `integration/`)
- [ ] File naming conventions match codebase (camelCase for utils, PascalCase for components)
- [ ] Tests do not import production code into test files (no circular dependencies)
- [ ] No test-specific code added to production files (no `if (process.env.NODE_ENV === 'test')`)
- [ ] Test documentation adequate for future developers (`src/test/README.md` complete)

**Intent Traceability:** Intent Trust Tier: "Learning Opportunity: First orbit in a new repository establishes quality patterns"

**Pass Criteria:** Senior engineer confirms tests establish good patterns for future verification work.

**Failure Action:** If patterns suboptimal: document improvement recommendations in `.orbital/artifacts/verification-report.md`, PASS with notes for future refactoring.

---

### HVP-5: Traceability Matrix Validation

**Timing:** Final verification step before orbit closure.

**Reviewer Action:**
1. Open `.orbital/artifacts/test-execution-report.md`
2. Review traceability matrix table
3. Verify every automated test maps to Intent acceptance criteria
4. Confirm no "orphan tests" (tests without clear intent justification)

**Verification Checklist:**
- [ ] Every test suite explicitly references Intent acceptance boundary
- [ ] Edge case tests (division by zero, large numbers) map to "Target Success" criteria
- [ ] Integration tests map to "operation chaining" and UI interaction requirements
- [ ] Test count meets or exceeds Intent thresholds (20 minimum, 30 target, 40 exceptional)
- [ ] Coverage gaps (if any) documented with justification

**Intent Traceability:** Intent Acceptance Boundary (Target): "Test results document includes traceability matrix linking tests to original intent requirements"

**Pass Criteria:** 
- **Minimum Acceptable:** Test-to-intent mapping exists (even if informal)
- **Target Success:** Formal traceability matrix table with explicit references
- **Exceptional Achievement:** Bidirectional traceability (intent → tests AND tests → intent)

**Failure Action:** If traceability incomplete: add mapping table to test execution report before orbit closure.

---

## Intent Traceability

### Automated Test Coverage Mapping

| Intent Acceptance Criterion | Automated Gate | Test Count | Status Field |
|------------------------------|----------------|------------|--------------|
| **Minimum: 20+ test cases covering all 4 operations** | Gate 2: Unit Test Execution | 32 unit tests (8 per operation) | `numTotalTests >= 20` in JSON |
| **Minimum: Test zero as operand for each operation** | Gate 2: Calculator Logic Tests | 8 zero-operand tests (2 per operation) | Tests with "zero" in description |
| **Minimum: Test positive/negative numbers** | Gate 2: Calculator Logic Tests | 16 sign-variation tests | Tests with "positive"/"negative" in name |
| **Minimum: Test decimal inputs** | Gate 2: Calculator Logic Tests | 8 decimal tests | Tests with "decimal"/"floating" in name |
| **Minimum: Machine-readable output** | Gate 6: Output Format Validation | N/A | JSON file exists, parseable |
| **Minimum: 100% tests execute without errors** | Gates 2-4: All test executions | All tests | `testResults[].status != "error"` |
| **Target: 30+ test cases** | Gates 2-4: Combined test count | 43 total tests | `numTotalTests >= 30` |
| **Target: Integration tests (UI interactions)** | Gate 4: Integration Test Execution | 5 workflow tests | Integration test suite passes |
| **Target: Edge cases (division by zero, large numbers)** | Gate 2: Calculator Logic Tests | 8 edge case tests | Specific edge case test names |
| **Target: Traceability matrix** | HVP-5: Traceability Validation | N/A | Matrix table exists in report |
| **Exceptional: 40+ test cases** | Gates 2-4: Combined count | 43 tests | `numTotalTests >= 40` |
| **Constraint: <30 second execution** | Gate 5: Performance Budget | N/A | `time npm test` output ≤30s |
| **Constraint: <10MB testing libraries** | Gate 1: Infrastructure Validation | N/A | `du -sh` output ≤10MB |
| **Constraint: No production code mods** | Gate 7: Production Code Integrity | N/A | Git diff shows no src/components or src/utils changes |

### Manual Verification Coverage Mapping

| Intent Acceptance Criterion | Human Verification Point | Evidence Location | Pass Threshold |
|------------------------------|-------------------------|-------------------|----------------|
| **Minimum: 8+ interactive scenarios** | HVP-3: Manual Checklist Execution | `.orbital/artifacts/manual-verification-checklist.md` | ≥8 scenarios documented |
| **Target: Visual validation (display formatting)** | HVP-3: Manual Checklist (Scenarios 5, 6) | Manual checklist "Actual Result" column | Pass notes mention formatting |
| **Target: Error state validation** | HVP-3: Manual Checklist (Scenario 3) | Manual checklist division by zero result | Error handling graceful |
| **Constraint: Vite-based setup unchanged** | HVP-1: API Inspection, HVP-4: Arch Review | Code review notes | No Vite config broken |
| **Trust Tier: Learning opportunity (quality patterns)** | HVP-4: Test Strategy Review | Reviewer architectural assessment | Senior engineer approval |
| **Dependency: Calculator.js API stability** | HVP-1: Calculator Logic API Inspection | API documentation in test README | Tests call correct functions |
| **Dependency: Component prop interfaces** | HVP-2: Component Prop Review | PropType validation in test output | No PropType warnings |

### Verification Completeness Check

**All Intent constraints verified:**
- ✅ No production code modifications (Gate 7)
- ✅ Vite/React/Node.js compatibility (Gate 1)
- ✅ <10MB testing library footprint (Gate 1)
- ✅ <30 second execution time (Gate 5)
- ✅ Verification-only scope (Gate 7)
- ✅ Chrome/Chromium environment (HVP-3: manual tests in browser)

**All Intent acceptance boundaries addressed:**
- ✅ Minimum: 20+ tests (Gate 2-4: 43 total tests)
- ✅ Minimum: 8+ manual scenarios (HVP-3: 8 scenarios)
- ✅ Minimum: Machine-readable output (Gate 6: JSON reporter)
- ✅ Minimum: 100% execution without errors (Gate 2-4: exit codes)
- ✅ Target: 30+ tests (Gate 2-4: 43 total tests)
- ✅ Target: Integration tests (Gate 4: 5 workflow tests)
- ✅ Target: Traceability matrix (HVP-5: matrix validation)
- ✅ Exceptional: 40+ tests (Gate 2-4: 43 total tests achieves this)

**No orphan verification activities:** Every gate and HVP explicitly references Intent document section.

---

## Escape Criteria

### Escape Path 1: Automated Gate Failure (Gates 2-6)

**Trigger:** Any automated test gate reports <100% test execution success OR performance budget exceeded.

**Assessment:**
1. **Critical Failure (≥25% tests failing):**
   - BLOCK orbit immediately
   - Do NOT proceed to human verification
   - Likely root cause: API mismatch between tests and implementation
   - **Escalation:** Require HVP-1 (API Inspection) before any test reruns

2. **Moderate Failure (10-24% tests failing):**
   - PAUSE orbit for investigation
   - Run failing tests individually to isolate issues
   - If failures due to timing issues (async), optimize with `waitFor` or `act()`
   - If failures due to wrong assertions, validate against actual implementation behavior
   - **Re-orbit Threshold:** If fixes require >2 hours, re-orbit Phase 2 or Phase 3

3. **Minor Failure (<10% tests failing):**
   - CONDITIONAL PASS if failures are known edge cases
   - Document failures in `.orbital/artifacts/known-limitations.md`
   - Proceed to human verification with reviewer awareness
   - **Future Orbit:** Create new intent to address known limitations

**Re-orbit Conditions:**
- Test count falls below Intent "Minimum Acceptable" (20 tests) → Re-orbit Phase 2 (Unit Tests)
- Integration tests cannot simulate user interactions → Re-orbit Phase 3 (Integration Tests)
- Performance budget exceeded by >10 seconds → Optimize tests or reduce scope to meet constraint

**Rollback Procedure:**
```bash
# Revert test commits
git reset --hard HEAD~1

# Uninstall test dependencies
npm uninstall vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom

# Delete test files
rm -rf src/test/ vitest.config.js

# Restore package.json
git checkout package.json
```

---

### Escape Path 2: Production Code Integrity Violation (Gate 7)

**Trigger:** Git diff shows modifications to production files in `src/components/`, `src/utils/`, or core application files.

**Assessment:**
- **CRITICAL BLOCKER:** This violates Intent constraint "No modifications to existing calculator logic"
- **Immediate Action:** HALT all verification activities

**Escalation Procedure:**
1. Identify which production files were modified
2. Determine if modifications are accidental (developer error) or necessary (test coupling)
3. If accidental: rollback changes, re-run verification from Gate 1
4. If necessary (e.g., tests require new exports from calculator.js):
   - **ESCALATE to Trust Tier 3 review:** Production code changes require human approval
   - Document why changes are necessary in `.orbital/artifacts/production-code-justification.md`
   - Request human reviewer assess if changes are minimal and safe
   - If approved: update Intent document to reflect revised scope
   - If rejected: re-orbit with revised test strategy that avoids production changes

**Rollback Procedure:**
```bash
# Hard rollback to last clean commit
git reset --hard <last-clean-commit-sha>

# Verify no production changes
git diff HEAD --name-only | grep -E '^src/(components|utils)/'

# If grep returns nothing, rollback successful
```

**Re-orbit Gate:** Cannot proceed with orbit closure until Gate 7 passes cleanly.

---

### Escape Path 3: Manual Verification Checklist Failure (HVP-3)

**Trigger:** ≥2 of 8 manual scenarios fail during human verification.

**Assessment:**
1. **Catastrophic Failure (≥4 scenarios fail):**
   - Likely root cause: Automated tests not validating actual user experience
   - Tests may pass but application broken
   - **BLOCK orbit closure**
   - **Escalation:** Full review of Calculator.jsx implementation required
   - **Action:** Create new intent to fix underlying calculator bugs (separate from verification orbit)

2. **Significant Failure (2-3 scenarios fail):**
   - **CONDITIONAL BLOCK**
   - Investigate if failures are:
     - Visual only (formatting, CSS) → Document, pass with recommendations
     - Functional (calculations wrong) → BLOCK, fix calculator implementation in new orbit
     - Edge cases not covered by automated tests → Add missing automated tests, re-run Gate 2-4
   - **Re-orbit Threshold:** If missing test coverage identified, re-orbit Phase 2 to add tests

3. **Minor Failure (1 scenario fails):**
   - Document as known limitation
   - PASS orbit with note for future improvement
   - Add issue to backlog for future orbit

**Re-orbit Conditions:**
- If failures reveal automated tests insufficient → Re-orbit Phase 2 with expanded test cases
- If failures reveal integration tests don't match real usage → Re-orbit Phase 3 with revised workflows
- If failures reveal production bugs → HALT verification orbit, create new orbit for bug fixes

**Escalation Trigger:** If manual verification consistently contradicts automated test results, escalate to senior engineer for test strategy review.

---

### Escape Path 4: Performance Budget Violation (Gate 5)

**Trigger:** Test execution exceeds 30-second Intent constraint.

**Assessment:**
1. **Measure breakdown:** Run each test suite individually to identify bottleneck
2. **Optimization attempts (in order):**
   - Reduce `waitFor` timeouts in integration tests (default 1000ms → 500ms)
   - Use `userEvent.setup()` instead of `fireEvent` for faster interactions
   - Parallelize test suites if running serially
   - Remove unnecessary `act()` wrappers

3. **If optimization insufficient:**
   - **Scope reduction decision:** Reduce test count to meet budget while maintaining Intent "Minimum Acceptable"
   - Priority order: Keep integration tests > unit tests > component tests
   - Document removed tests in `.orbital/artifacts/deferred-tests.md`
   - PASS orbit with reduced scope, create follow-up intent for additional coverage

**Re-orbit Threshold:** If budget exceeded by >50% (>45 seconds), re-orbit Phase 3 with redesigned integration tests.

**Rollback Not Required:** Performance issues don't compromise test validity, only CI/CD integration.

---

### Escape Path 5: Dependency Size Constraint Violation (Gate 1)

**Trigger:** Testing library footprint exceeds 10MB Intent constraint.

**Assessment:**
1. **Measure actual sizes:**
   ```bash
   du -sh node_modules/vitest
   du -sh node_modules/jsdom
   du -sh node_modules/@testing-library
   ```

2. **Optimization sequence:**
   - Remove optional dependency `@testing-library/jest-dom` (saves ~2MB)
   - Replace `jsdom` with `happy-dom` (lighter alternative)
   - Use Vitest minimal install (exclude UI and browser mode plugins)

3. **If still exceeds constraint:**
   - **ESCALATE:** Request Intent constraint revision with justification
   - Alternative: Use Jest instead of Vitest (ironic, but may have better tree-shaking)
   - Last resort: Write tests without Testing Library (plain DOM APIs)

**Re-orbit Threshold:** If cannot meet constraint after optimizations, re-orbit Phase 1 with alternative testing stack.

**Rollback Procedure:**
```bash
npm uninstall <oversized-package>
npm install <lighter-alternative>
# Re-run Gate 1
```

---

### Escape Path 6: Test-Production Bundle Contamination (Gate 8)

**Trigger:** Test libraries appear in production build output.

**Assessment:**
- **ROOT CAUSE:** Likely production code accidentally imports test utilities
- **CRITICAL:** This violates deployment integrity

**Remediation Steps:**
1. Search for any imports of test libraries in production code:
   ```bash
   grep -r "from 'vitest'" src/components/ src/utils/
   grep -r "from '@testing-library" src/components/ src/utils/
   ```

2. If found: Remove imports, ensure production code never references test utilities

3. Add Vite build exclusions:
   ```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         external: ['vitest', '@testing-library/*', 'jsdom']
       }
     }
   }
   ```

4. Re-run `npm run build` and verify `dist/` folder clean

**Rollback Procedure:** If contamination unfixable, rollback entire orbit and redesign test isolation strategy.

---

### Orbit Closure Decision Matrix

| Gates Passed | HVPs Passed | Manual Checklist | Decision |
|--------------|-------------|------------------|----------|
| All 8 gates | All 5 HVPs | ≥7 of 8 scenarios | **PASS** - Close orbit, merge PR |
| All 8 gates | All 5 HVPs | 6 of 8 scenarios | **CONDITIONAL PASS** - Document known limitations, close orbit |
| All 8 gates | 4 of 5 HVPs | ≥6 of 8 scenarios | **CONDITIONAL PASS** - Senior engineer approval required |
| 7 of 8 gates | All 5 HVPs | ≥6 of 8 scenarios | **INVESTIGATE** - Determine if failed gate is critical |
| ≤6 of 8 gates | Any | Any | **BLOCK** - Re-orbit required |
| Any | ≤3 of 5 HVPs | Any | **ESCALATE** - Human review found critical issues |
| Any | Any | ≤5 of 8 scenarios | **BLOCK** - Manual verification reveals broken functionality |

**Final Approval Authority:** For Tier 2 (Supervised) orbit, senior engineer must sign off even on PASS conditions before orbit closure.