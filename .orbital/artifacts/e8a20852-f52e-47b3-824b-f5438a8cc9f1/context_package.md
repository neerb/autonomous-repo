# Context Package: Initialize ORBITAL Repository Structure

## Codebase References

### Existing Files
- `README.md` — Current repository placeholder, must be preserved and enhanced but not replaced

### Files to Create
- `.orbital/README.md` — Entry point documentation for the ORBITAL system within this repository
- `.orbital/docs/ORBITAL_SPEC.md` — Complete specification reference for ORBITAL v0.1
- `.orbital/docs/CONTRIBUTING.md` — Contribution guidelines for working within ORBITAL workflow
- `.orbital/docs/TRUST_TIERS.md` — Trust tier definitions, assignment criteria, and governance
- `.orbital/docs/GLOSSARY.md` — Terminology reference (intent, orbit, artifact, proposal, etc.)
- `.orbital/templates/intent-template.md` — Starter template for creating new intent documents
- `.orbital/templates/orbit-log-template.md` — Starter template for orbit execution logs
- `.orbital/orbits/orbit-000-bootstrap.md` — Self-documenting log of this initialization orbit
- `.orbital/intents/INT-001-bootstrap.md` — Formal intent artifact capturing this initialization
- `.orbital/scripts/validate-intent.sh` — Shell script for basic intent schema validation
- `.github/workflows/orbital-ci.yml` — GitHub Actions workflow skeleton for future automation
- `.gitignore` — Git exclusion rules for temporary orbit artifacts

### Directories to Create
- `.orbital/` — Root directory for all ORBITAL system artifacts
- `.orbital/intents/` — Storage for validated intent documents
- `.orbital/orbits/` — Orbit execution logs and metadata
- `.orbital/context/` — Context packages and architectural documentation
- `.orbital/proposals/` — Draft intents awaiting validation and acceptance
- `.orbital/docs/` — System documentation and specifications
- `.orbital/templates/` — Reusable templates for ORBITAL artifacts
- `.orbital/scripts/` — Automation and validation utilities
- `.github/` — GitHub-specific configuration (if not already exists)
- `.github/workflows/` — CI/CD workflow definitions

## Architecture Context

### ORBITAL System Overview
ORBITAL is an autonomous development system where AI agents execute work through structured units called orbits. Each orbit is triggered by a validated intent document that specifies desired outcomes, constraints, and acceptance criteria. The system operates in four phases per orbit: Context (briefing), Proposal (planning), Execution (implementation), and Review (validation).

### Repository Structure Philosophy
The `.orbital/` directory serves as the system's control plane, isolated from application code to prevent conflicts between meta-work (managing development process) and feature work (actual implementation). This separation enables:

- **Concurrent orbit execution** — multiple agents working on different intents without collision
- **Audit trail** — complete history of all work performed autonomously
- **Human oversight** — centralized location for reviewing AI decisions before merge
- **Trust tier governance** — scaffolding for progressive autonomy based on risk assessment

### Data Flow
1. Human or AI creates intent document in `.orbital/proposals/`
2. Intent Agent validates and moves to `.orbital/intents/` with unique identifier
3. Context Agent generates context package in `.orbital/context/`
4. Orbit begins, logs progress in `.orbital/orbits/orbit-NNN-name.md`
5. Artifacts (code, docs, configs) created in appropriate repository locations
6. Review phase validates against intent acceptance criteria
7. Merge or rollback based on trust tier and validation results

### Integration Points
- **Git workflows** — All ORBITAL operations happen on feature branches named `orbit/NNN-short-name`
- **GitHub Actions** — Future automation hooks for trust tier enforcement, validation gates, and notification
- **Documentation site** — `.orbital/docs/` can be published via GitHub Pages or similar for team reference

## Pattern Library

### ORBITAL Specification Patterns

#### Intent Document Structure
Must contain exactly five sections:
1. **Desired Outcome** — Single paragraph describing the end state
2. **Constraints** — Bullet list of technical, business, or process limitations
3. **Acceptance Boundaries** — Three-tier definition (minimal, target, aspirational)
4. **Trust Tier Assignment** — Tier number with rationale paragraph
5. **Dependencies** — External systems, prior orbits, team approvals required

#### Orbit Naming Convention
Format: `orbit-NNN-short-kebab-name` where NNN is zero-padded sequential number

#### Intent Naming Convention
Format: `INT-NNN-short-kebab-name.md` where NNN is sequential identifier

#### Trust Tier Definitions
- **Tier 0:** Trivial (typos, comments, documentation)
- **Tier 1:** Autonomous (low-risk, fully specified, reversible)
- **Tier 2:** Supervised (requires human review before merge)
- **Tier 3:** Collaborative (AI proposes, human implements)
- **Tier 4:** Human-led (AI assists, human drives)

### File Organization Conventions
- Markdown for all documentation (universal readability, version control friendly)
- YAML frontmatter for metadata where applicable
- Relative paths from repository root in all references
- ISO 8601 timestamps for temporal metadata

### Documentation Style
- Active voice, present tense for specifications
- Past tense for orbit logs (describing completed work)
- Imperative mood for instructions and templates
- Avoid jargon without glossary definition

## Prior Orbit References

**None.** This is `orbit-000`, the bootstrap orbit that establishes the ORBITAL system itself. All subsequent orbits will reference this as the foundational initialization that created the workspace structure.

## Risk Assessment

### Directory Structure Conflicts
**Risk:** Creating `.orbital/` or `.github/` directories that conflict with existing tooling or workflows.

**Likelihood:** Low — repository is currently minimal with only README.md

**Mitigation:** 
- Check for existing `.orbital/` or `.github/` before creation
- If `.github/` exists, only add `workflows/` subdirectory
- Document any pre-existing structures in orbit log

### Documentation Accuracy
**Risk:** ORBITAL specification documentation diverges from actual system behavior or becomes outdated.

**Likelihood:** Medium — documentation is static, system evolves

**Mitigation:**
- Include version identifier (`v0.1`) in all specification documents
- Add "Last Updated" timestamp to each doc
- Note in README that `.orbital/docs/ORBITAL_SPEC.md` is the canonical reference

### Template Completeness
**Risk:** Templates missing required fields or sections, causing invalid intent documents.

**Likelihood:** Medium — first-time template creation

**Mitigation:**
- Templates must include all mandatory sections from specification
- Add inline comments explaining each section's purpose
- Include validation script that checks intent documents against spec

### Git Ignore Misconfiguration
**Risk:** `.gitignore` excludes necessary files or includes sensitive temporary artifacts in version control.

**Likelihood:** Low — straightforward configuration

**Mitigation:**
- Only exclude temporary orbit work (e.g., `.orbital/tmp/`, `*.draft.md`)
- Never exclude validated intents, completed orbit logs, or context packages
- Test with `git status` after creation to verify behavior

### Permission and Access Issues
**Risk:** AI agent lacks write permissions to create directories or commit files.

**Likelihood:** Low — assumes proper repository access configured

**Mitigation:**
- Validate write access before beginning directory creation
- If permission errors occur, escalate to human for repository settings adjustment
- Document any permission requirements in `.orbital/README.md`

### Overwrites and Data Loss
**Risk:** Accidentally overwriting existing README.md or other repository files.

**Likelihood:** Very Low — intent explicitly constrains against modification

**Mitigation:**
- Never write to existing files unless explicitly specified in intent
- Use `git diff` before committing to verify only expected files changed
- README.md enhancement is append-only (add section, don't replace)

### Specification Drift
**Risk:** Creating structure that doesn't match ORBITAL specification, requiring rework.

**Likelihood:** Low — specification is well-defined and provided in context

**Mitigation:**
- Cross-reference every directory and file against specification
- Include specification version reference in all created documents
- Orbit log must cite specific spec sections that informed each decision