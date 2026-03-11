# Verification Protocol: Initialize ORBITAL Repository Structure

**Protocol ID:** VP-INT-001-1  
**Generated:** 2024-01-15  
**Intent:** INT-001-bootstrap  
**Proposal:** PROP-INT-001-1

---

## Automated Gates

| ID | Traces To | Check | Tool | Expected | Blocking |
|----|-----------|-------|------|----------|----------|
| AG-01 | Minimal: `.orbital/` directory exists with subdirectories | Directory `.orbital/` exists with subdirectories `intents/`, `orbits/`, `context/`, `proposals/`, `docs/` | Shell script: `test -d .orbital && test -d .orbital/intents && test -d .orbital/orbits && test -d .orbital/context && test -d .orbital/proposals && test -d .orbital/docs` | Exit code 0 (all directories exist) | Yes |
| AG-02 | Minimal: `.orbital/README.md` explains purpose of each subdirectory | File `.orbital/README.md` exists and is non-empty | Shell script: `test -f .orbital/README.md && test -s .orbital/README.md` | Exit code 0 (file exists and has content) | Yes |
| AG-03 | Minimal: `.orbital/docs/` contains ORBITAL_SPEC.md and CONTRIBUTING.md | Files `.orbital/docs/ORBITAL_SPEC.md` and `.orbital/docs/CONTRIBUTING.md` exist | Shell script: `test -f .orbital/docs/ORBITAL_SPEC.md && test -f .orbital/docs/CONTRIBUTING.md` | Exit code 0 (both files exist) | Yes |
| AG-04 | Minimal: `.gitignore` configured to exclude temporary orbit artifacts | File `.gitignore` exists and contains patterns `.orbital/tmp/`, `*.draft.md`, `.orbital/.workspace/` | Shell script: `grep -q '.orbital/tmp/' .gitignore && grep -q '*.draft.md' .gitignore && grep -q '.orbital/.workspace/' .gitignore` | Exit code 0 (all patterns present) | Yes |
| AG-05 | Target: `.orbital/docs/TRUST_TIERS.md` exists | File `.orbital/docs/TRUST_TIERS.md` exists | Shell script: `test -f .orbital/docs/TRUST_TIERS.md` | Exit code 0 (file exists) | Yes |
| AG-06 | Target: `.orbital/templates/` directory with starter templates | Directory `.orbital/templates/` exists with files `intent-template.md` and `orbit-log-template.md` | Shell script: `test -d .orbital/templates && test -f .orbital/templates/intent-template.md && test -f .orbital/templates/orbit-log-template.md` | Exit code 0 (directory and both templates exist) | Yes |
| AG-07 | Target: `.orbital/orbits/orbit-000-bootstrap.md` exists | File `.orbital/orbits/orbit-000-bootstrap.md` exists | Shell script: `test -f .orbital/orbits/orbit-000-bootstrap.md` | Exit code 0 (file exists) | Yes |
| AG-08 | Target: Root README.md updated with ORBITAL system explanation | Root `README.md` contains reference to ORBITAL and link to `.orbital/README.md` | Shell script: `grep -q 'ORBITAL' README.md && grep -q '.orbital/README.md' README.md` | Exit code 0 (both references present) | Yes |
| AG-09 | Aspirational: `.orbital/scripts/` directory with validation utilities | Directory `.orbital/scripts/` exists with file `validate-intent.sh` | Shell script: `test -d .orbital/scripts && test -f .orbital/scripts/validate-intent.sh` | Exit code 0 (directory and script exist) | Yes |
| AG-10 | Aspirational: `.orbital/docs/GLOSSARY.md` exists | File `.orbital/docs/GLOSSARY.md` exists | Shell script: `test -f .orbital/docs/GLOSSARY.md` | Exit code 0 (file exists) | Yes |
| AG-11 | Aspirational: GitHub Actions workflow skeleton exists | File `.github/workflows/orbital-ci.yml` exists | Shell script: `test -f .github/workflows/orbital-ci.yml` | Exit code 0 (file exists) | Yes |
| AG-12 | Aspirational: `.orbital/intents/INT-001-bootstrap.md` exists | File `.orbital/intents/INT-001-bootstrap.md` exists | Shell script: `test -f .orbital/intents/INT-001-bootstrap.md` | Exit code 0 (file exists) | Yes |
| AG-13 | Constraint: Must not modify or delete existing README.md | Original README.md content is preserved | Shell script: `git diff HEAD -- README.md | grep -q '^-# autonomous-repo' || git diff HEAD -- README.md | grep -q '^-Testing purposes' || exit 0` (fails if original lines deleted) | Exit code 0 (no deletions of original content) | Yes |
| AG-14 | Constraint: No third-party dependencies introduced | No `package.json`, `requirements.txt`, `Gemfile`, `go.mod`, or similar dependency files created | Shell script: `! test -f package.json && ! test -f requirements.txt && ! test -f Gemfile && ! test -f go.mod` | Exit code 0 (no dependency files exist) | Yes |
| AG-15 | Constraint: Must not create any code files | No `.js`, `.py`, `.go`, `.rb`, `.java` files created outside `.orbital/scripts/` | Shell script: `find . -type f ( -name '*.js' -o -name '*.py' -o -name '*.go' -o -name '*.rb' -o -name '*.java' ) ! -path './.orbital/scripts/*' | wc -l` | Count equals 0 (no code files outside scripts directory) | Yes |
| AG-16 | All created files are valid markdown | Markdown files pass basic syntax validation | Tool: `markdownlint` or `mdl` on all `.md` files in `.orbital/` | Zero critical errors | No (advisory only) |
| AG-17 | Template completeness: intent-template.md has all required sections | File `.orbital/templates/intent-template.md` contains section headings: "Desired Outcome", "Constraints", "Acceptance Boundaries", "Trust Tier Assignment", "Dependencies" | Shell script: `grep -q '## Desired Outcome' .orbital/templates/intent-template.md && grep -q '## Constraints' .orbital/templates/intent-template.md && grep -q '## Acceptance Boundaries' .orbital/templates/intent-template.md && grep -q '## Trust Tier Assignment' .orbital/templates/intent-template.md && grep -q '## Dependencies' .orbital/templates/intent-template.md` | Exit code 0 (all sections present) | Yes |

---

## Human Verification Points

| ID | Traces To | Check | Method | Assessed By |
|----|-----------|-------|--------|-------------|
| HV-01 | Minimal: `.orbital/README.md` explains purpose of each subdirectory | Verify `.orbital/README.md` clearly describes the purpose of `intents/`, `orbits/`, `context/`, `proposals/`, and `docs/` subdirectories with sufficient detail for a new user to understand the system | Read `.orbital/README.md` and assess clarity, completeness, and accuracy of subdirectory explanations | Intent Architect |
| HV-02 | Minimal: `.orbital/docs/ORBITAL_SPEC.md` is complete specification | Verify `.orbital/docs/ORBITAL_SPEC.md` accurately reflects ORBITAL v0.1 specification from system documentation — no omissions, no inaccuracies, version identifier present | Compare `.orbital/docs/ORBITAL_SPEC.md` against source specification document section-by-section | System Architect |
| HV-03 | Target: `.orbital/docs/CONTRIBUTING.md` provides clear contribution workflow | Verify `.orbital/docs/CONTRIBUTING.md` explains how to create intents, execute orbits, and review work in a way that a new contributor could follow without assistance | Read through contribution guide simulating new contributor perspective; check for missing steps or unclear instructions | Intent Architect |
| HV-04 | Target: Templates are usable and include helpful inline guidance | Verify `.orbital/templates/intent-template.md` and `orbit-log-template.md` contain inline comments explaining each section's purpose and provide clear guidance on what content to include | Review templates for clarity, completeness of guidance, and ease of use; simulate filling out template to test usability | Intent Architect |
| HV-05 | Target: Root README.md enhancement integrates well with existing content | Verify the added ORBITAL section in root `README.md` flows naturally after existing content, maintains consistent formatting/tone, and provides appropriate context without overwhelming simple repository description | Read entire README.md to assess integration quality; check that original "Testing purposes" placeholder context is respected | Intent Architect |
| HV-06 | Aspirational: `.orbital/scripts/validate-intent.sh` logic is correct | Verify validation script correctly checks for required sections, handles edge cases (missing sections, malformed markdown), and provides helpful error messages | Code review of shell script; trace logic for section detection; test with sample valid and invalid intent documents | System Architect |
| HV-07 | Aspirational: `.orbital/docs/GLOSSARY.md` definitions are accurate | Verify glossary entries for "intent", "orbit", "artifact", "proposal", "context package", "trust tier", "acceptance boundaries" match their usage throughout ORBITAL system documentation | Cross-reference glossary definitions against specification and other documentation; check for consistency | System Architect |
| HV-08 | Self-documentation: `orbit-000-bootstrap.md` accurately documents this orbit | Verify orbit log captures decisions made, files created, validation performed, and serves as accurate historical record of initialization process | Read orbit log and compare against actual repository state; check for completeness and accuracy of documentation | Intent Architect |
| HV-09 | Constraint: Original README.md content is preserved (human verification of semantic preservation) | Verify README.md append operation preserved original meaning and context of "Testing purposes" statement; new section doesn't contradict or override original intent | Read both original and modified README.md; assess whether append-only constraint was respected in spirit (not just mechanically) | Intent Architect |

---

## Intent Traceability

| Acceptance Criterion | Covered By |
|---------------------|------------|
| `.orbital/` directory exists with subdirectories: `intents/`, `orbits/`, `context/`, `proposals/`, `docs/` | AG-01 |
| `.orbital/README.md` explains the purpose of each subdirectory | AG-02, HV-01 |
| `.orbital/docs/` contains at minimum: `ORBITAL_SPEC.md`, `CONTRIBUTING.md` | AG-03, HV-02, HV-03 |
| Repository has a `.gitignore` configured to exclude temporary orbit artifacts | AG-04 |
| `.orbital/docs/TRUST_TIERS.md` documenting tier definitions and assignment criteria | AG-05 |
| `.orbital/templates/` directory with starter templates for intent documents and orbit logs | AG-06, HV-04 |
| `.orbital/orbits/` contains `orbit-000-bootstrap.md` documenting this initialization orbit | AG-07, HV-08 |
| Root README.md updated to include brief explanation of ORBITAL system and link to `.orbital/README.md` | AG-08, HV-05 |
| `.orbital/scripts/` directory with validation utilities (e.g., intent schema validator) | AG-09, HV-06 |
| `.orbital/docs/GLOSSARY.md` defining key ORBITAL terminology | AG-10, HV-07 |
| GitHub Actions workflow skeleton in `.github/workflows/orbital-ci.yml` for future automation | AG-11 |
| `.orbital/intents/INT-001-bootstrap.md` capturing this initialization as a formal intent artifact | AG-12 |
| Must not modify or delete the existing README.md file | AG-13, HV-09 |
| Must adhere to ORBITAL specification v0.1 exactly as defined in system documentation | HV-02, HV-07 |
| Must create only directories and files explicitly required by ORBITAL — no speculative additions | AG-14, AG-15 |
| Must not introduce any third-party dependencies or external services at this stage | AG-14 |
| Must not create any code files, build configurations, or application logic (intent-driven only) | AG-15 |
| All documentation must be markdown format for universal readability | AG-16 |
| Template must contain all five required sections per ORBITAL specification | AG-17, HV-04 |

**Orphan checks:** None — all automated gates and human verification points trace to acceptance criteria from the intent.

**Uncovered criteria:** None — all acceptance boundaries (minimal, target, aspirational) and constraints have corresponding verification checks.

---

## Escape Criteria

| Failure Mode | Action | Owner |
|-------------|--------|-------|
| Directory structure incomplete (AG-01 fails) | re-orbit — create missing directories in correct structure; verify `.orbital/` hierarchy matches specification | AI Agent |
| Required file missing (AG-02 through AG-12 fails) | re-orbit — create missing file with appropriate content; cross-reference against proposal file list | AI Agent |
| .gitignore misconfigured (AG-04 fails) | re-orbit — add missing patterns to `.gitignore`; test with `git status` to verify temporary artifacts excluded | AI Agent |
| README.md original content deleted (AG-13 fails) | rollback — revert entire orbit, restore original README.md; retry with append-only operation | AI Agent |
| Forbidden dependencies introduced (AG-14 fails) | re-orbit — delete dependency files; verify no `package.json`, `requirements.txt`, or similar remain | AI Agent |
| Code files created outside scripts directory (AG-15 fails) | re-orbit — delete code files; verify only `.orbital/scripts/validate-intent.sh` contains executable logic | AI Agent |
| Template missing required sections (AG-17 fails) | re-orbit — add missing sections to template; cross-reference against ORBITAL specification's intent document structure | AI Agent |
| Markdown syntax errors (AG-16 fails) | re-orbit — fix markdown formatting; not blocking but should be corrected for documentation quality | AI Agent |
| Documentation inaccuracy detected (HV-02, HV-07 fails) | re-orbit — correct inaccurate content; cross-reference against authoritative ORBITAL specification | AI Agent → Intent Architect (if ambiguity in spec) |
| Template unusable or guidance unclear (HV-04 fails) | re-orbit — revise template with clearer inline guidance; test revised template by simulating intent creation | AI Agent → Intent Architect (if guidance design unclear) |
| README.md integration poor (HV-05, HV-09 fails) | re-orbit — revise added section to better integrate with original content; maintain append-only constraint | AI Agent → Intent Architect (if integration approach disputed) |
| Validation script logic error (HV-06 fails) | re-orbit — fix script logic; test with valid and invalid intent samples to verify correct behavior | AI Agent → System Architect (if shell scripting expertise needed) |
| Orbit log incomplete or inaccurate (HV-08 fails) | re-orbit — revise orbit log to accurately document initialization process; include all decisions and file creations | AI Agent |
| Permission or filesystem errors during creation | escalate — agent lacks necessary access; human must configure repository permissions or investigate filesystem issues | AI Agent → Repository Administrator |
| Specification ambiguity blocking implementation | escalate — ORBITAL specification itself requires clarification; cannot proceed without authoritative guidance | AI Agent → System Architect |