# Engineering Rules

## Purpose

This document defines shared engineering principles for CodeWithIshant v2. It helps keep the repo consistent, safe, and easy to maintain across frontend, backend, and docs.

## Core Principles

- **Simplicity first**: Prefer readable, maintainable code over cleverness.
- **Consistency**: Follow established conventions for naming, formatting, and architecture.
- **Incremental improvement**: Make small, safe changes with clear intent.
- **Automate quality**: Use linting, formatting, tests, and CI checks.
- **Document decisions**: Capture design choices in docs, not only in code.

## Repository Practices

- Keep `frontend/` focused on UI, routing, and client-side logic.
- Keep `backend/` focused on API, auth, data access, and business rules.
- Use `docs/` for architecture, process, strategy, and planning.
- Avoid cross-folder duplication of logic whenever possible.

## Coding Standards

### Frontend

- Use TypeScript strict typing where practical.
- Prefer functional React components with hooks.
- Keep UI components small and reusable.
- Use Tailwind CSS classes consistently and keep custom styles scoped.
- Keep page-level logic in `app/` routes, and shared UI in `components/`.

### Backend

- Use Pydantic models for request validation and response schemas.
- Keep business logic inside services, not inside route handlers.
- Use SQLAlchemy models consistently for database operations.
- Keep authentication and authorization separate from core services.
- Limit `backend/app/main.py` to app setup, routers, middleware, and startup.

## Branching and Pull Requests

- Work in feature branches named clearly, e.g. `feature/topic-search`, `fix/auth-flow`, `docs/ui-system`.
- Open PRs with a summary, key changes, testing steps, and any assumptions.
- Request review from at least one teammate when available.
- Keep PRs focused; avoid mixing unrelated refactors and feature work.

## Commit Message Guidelines

- Use short, imperative subject lines (50 characters or less).
- Include a brief body for context when needed.
- Example:
  - `Fix topic slug validation for nested topics`
  - `Add admin note creation endpoint`

## Testing

- Add regression tests for new features and bug fixes.
- Prefer unit tests for business logic and integration tests for API behavior.
- Run existing test commands before merging.
- Document any manual verification steps when automated coverage is not available.

## Documentation

- Add or update docs for architecture, API contracts, design decisions, or workflows.
- Keep documentation concise and actionable.
- Use `docs/` as the canonical place for project rules, plans, and system notes.

## Security and Privacy

- Never commit secrets, credentials, or production tokens.
- Validate all user input in the backend.
- Store passwords securely and use JWT secrets safely.
- Protect admin routes and guard against common web attacks.

## Quality Checks

- Use formatters and linters for both frontend and backend.
- Fix warnings and errors before merging.
- Keep code review feedback constructive and focused on project goals.
