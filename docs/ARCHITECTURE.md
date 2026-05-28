# CodeWithIshant v2 — Architecture Documentation

# Overview

CodeWithIshant v2 is a scalable educational developer platform designed to provide:

* Technical notes
* Blogs
* Cheatsheets
* Topic-based learning systems
* Interactive algorithm visualizers
* Secure admin management
* Developer-focused educational experiences

The system follows a modular full-stack architecture with separation of concerns across frontend, backend, infrastructure, and documentation layers.

---

# High-Level Architecture

```text
┌──────────────────────┐
│      Frontend        │
│   Next.js App Router │
└──────────┬───────────┘
           │ HTTP/API
           ▼
┌──────────────────────┐
│       Backend        │
│       FastAPI        │
└──────────┬───────────┘
           │ ORM
           ▼
┌──────────────────────┐
│     PostgreSQL       │
└──────────────────────┘
```

Infrastructure components:

* Nginx reverse proxy
* GitHub Actions security workflows
* Future Redis caching
* Future Docker containerization

---

# Frontend Architecture

## Technology Stack

Frontend uses:

* Next.js App Router
* TypeScript
* Tailwind CSS
* Zustand state management
* Feature-based component architecture

---

# Frontend Structure

```text
frontend/
├── app/
├── components/
├── hooks/
├── lib/
├── store/
├── constants/
├── types/
└── public/
```

---

# App Router Design

The frontend uses route groups for separation of concerns.

## Public Routes

```text
app/(public)/
```

Contains:

* Landing pages
* Blogs
* Notes
* Cheatsheets
* Topics

---

## Admin Routes

```text
app/(admin)/
```

Contains:

* Dashboard
* Content management
* Audit systems
* Authentication

Admin routes are logically isolated from public pages.

---

## Visualizer Routes

```text
app/visualizer/
```

Contains interactive educational algorithm visualizers.

Current visualizers:

* Bubble Sort
* Merge Sort
* Insertion Sort
* Binary Search
* Topological Sort

Future visualizers may include:

* Graph algorithms
* Trees
* Dynamic programming
* Networking simulations
* OS scheduling simulations

---

# Component Architecture

Components are organized by responsibility.

## Common Components

```text
components/common/
```

Shared reusable utilities.

Examples:

* Markdown renderer
* Branding components

---

## Feature Components

```text
components/features/
```

Feature-specific UI modules.

Examples:

* Blog cards
* Topic cards
* Note previews

---

## Layout Components

```text
components/layout/
```

Application shell structure.

Examples:

* Navbar
* Sidebar
* Footer
* Public shell

---

## UI Components

```text
components/ui/
```

Reusable primitive UI system.

Examples:

* Buttons
* Empty states
* Badges
* Dividers

---

# State Management

Global frontend state uses Zustand.

Current stores:

* Authentication store
* UI store

The architecture avoids unnecessary global state and prefers local state where appropriate.

---

# Hooks Architecture

Reusable custom hooks are isolated inside:

```text
hooks/
```

Examples:

* View detection
* Mouse parallax
* Idle timeout handling

This improves:

* Reusability
* Component cleanliness
* Separation of logic

---

# API Layer

Frontend API communication is centralized.

```text
lib/api/
```

Advantages:

* Typed requests
* Centralized API handling
* Easier scaling
* Easier authentication handling
* Cleaner frontend components

---

# Backend Architecture

## Technology Stack

Backend uses:

* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL
* JWT authentication

The backend follows service-layer architecture with clear separation between:

* routing
* business logic
* database models
* schemas
* utilities

---

# Backend Structure

```text
backend/app/
├── api/
├── core/
├── db/
├── models/
├── schemas/
└── services/
```

---

# API Layer

```text
api/v1/
```

Responsible for:

* route definitions
* request handling
* dependency injection

Routes remain thin and delegate business logic to services.

---

# Service Layer

```text
services/
```

Contains:

* business logic
* reusable workflows
* database interaction orchestration

Examples:

* blog services
* topic services
* audit services

This architecture improves:

* maintainability
* testability
* scalability

---

# Models Layer

```text
models/
```

Contains SQLAlchemy database models.

Examples:

* Blog
* Note
* Topic
* AuditLog
* TokenBlacklist

Models define database structure and relationships.

---

# Schemas Layer

```text
schemas/
```

Contains Pydantic validation schemas.

Responsibilities:

* request validation
* response serialization
* type safety

---

# Core Layer

```text
core/
```

Contains security and foundational utilities.

Examples:

* JWT handling
* CSRF protection
* input sanitization
* security utilities

Security is treated as a core architectural concern.

---

# Database Architecture

## Database

Primary database:

* PostgreSQL

---

## ORM

Uses SQLAlchemy ORM for:

* model abstraction
* relationships
* query management

---

## Migrations

Alembic handles schema migrations.

Advantages:

* version-controlled database changes
* reproducible environments
* safe schema evolution

---

# Security Architecture

Security-first practices are integrated into the architecture.

Current security features:

* JWT authentication
* token blacklist
* CSRF protection
* audit logging
* request sanitization

Security workflows also exist at CI/CD level.

---

# Audit Logging System

The platform includes audit logging for:

* admin actions
* sensitive operations
* security tracking

This improves:

* traceability
* debugging
* monitoring
* future compliance readiness

---

# Infrastructure Architecture

## Reverse Proxy

Nginx acts as reverse proxy.

Responsibilities:

* request routing
* static handling
* SSL integration
* security headers
* performance optimization

---

## CI/CD Security

GitHub Actions workflows include:

* dependency scanning
* secret scanning

This improves development security hygiene.

---

# Documentation Architecture

The project maintains extensive documentation.

Current documentation includes:

* PRD
* TRD
* Architecture docs
* Feature logs
* App flow diagrams
* Summary docs

Documentation is treated as a first-class engineering asset.

---

# Scalability Philosophy

The architecture is designed with long-term scalability in mind.

Current scalability principles:

* modular organization
* service separation
* reusable frontend systems
* centralized API handling
* isolated feature modules

Future scalability plans:

* Redis caching
* Docker containerization
* CDN integration
* search indexing
* AI services
* microservice exploration

---

# Design Philosophy

The platform aims to be:

* educational
* modern
* scalable
* developer-centric
* production-grade

UI philosophy:

* minimal
* interactive
* dark-theme friendly
* animation-enhanced
* readability-focused

---

# Future Architectural Goals

Planned future systems:

* AI-powered educational tools
* recommendation systems
* semantic search
* real-time collaboration
* advanced visualizer engine
* analytics dashboard
* distributed services

---

# Engineering Principles

Core principles:

* separation of concerns
* maintainability
* scalability
* security-first development
* reusable systems
* typed architecture
* modular design

The project prioritizes long-term maintainability over short-term shortcuts.

---

# Conclusion

CodeWithIshant v2 is designed as a modern educational engineering platform with scalable architecture, modular organization, and long-term extensibility.

The system architecture emphasizes:

* clean separation
* security
* maintainability
* educational usability
* future scalability

The architecture is intentionally structured to evolve into a larger developer ecosystem over time.
