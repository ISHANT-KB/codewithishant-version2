# System Design

## Overview

CodeWithIshant v2 is a full-stack learning platform built as a modular application:

- `frontend/`: Next.js public site + admin UI
- `backend/`: FastAPI REST API
- `database`: PostgreSQL

## High-Level Components

### Public UI

- Topic browsing
- Note display
- Cheatsheets and blogs
- Visualizer preview pages

### Admin UI

- Authenticated dashboard
- Topic management
- Note management
- Content publishing workflows

### Backend API

- Topic, note, blog CRUD endpoints
- Authentication and JWT handling
- Audit logging and security
- Parent-child topic validation

### Data Storage

- PostgreSQL stores content, auth, and metadata.
- Models include topics, notes, admins, audit logs, and token blacklist.

## Data Flow

1. User requests a public page in the frontend.
2. Frontend calls backend API to fetch topics, notes, or content.
3. Backend validates request, fetches from the database, and returns JSON.
4. Frontend renders content using component-driven pages.

## Backend Design

### Modular API Layers

- `routes/`: route definitions and request wiring
- `services/`: business logic and use cases
- `models/`: SQLAlchemy ORM models
- `schemas/`: Pydantic request/response models
- `core/`: auth, security, utilities

### Authentication

- JWT-based auth for admin routes.
- Token blacklist for logout and invalidation.
- `backend/app/core/jwt.py` for token creation and validation.

### Validation

- Use Pydantic for input validation and serialized response payloads.
- Validate parent topic relationships to prevent invalid nesting.

## Frontend Design

### App Router Layout

- `app/(public)/`: public content pages
- `app/(admin)/`: admin management pages
- `app/visualizer/`: algorithm visualizer pages

### Component Structure

- Feature folders under `components/features/`
- Shared UI under `components/common/`
- Utility code in `lib/`
- State management in `store/`

## Visualizer Engine Integration

- Visualizer pages consume engine state and render step-by-step progress.
- Core visualizer logic is separated from page markup.
- The engine should expose:
  - input configuration
  - state snapshots
  - next-step controls
  - event callbacks

## Non-Functional Requirements

- **Performance**: Keep API responses optimized and avoid overfetching.
- **Security**: Protect admin routes and validate all input.
- **Usability**: Build intuitive pages for authors and learners.
- **Maintainability**: Keep code modular and document architecture.

## Future Extensions

- Add caching with Redis for hot read-heavy endpoints.
- Add role-based permissions for editorial workflows.
- Add microservices for content indexing and search.
