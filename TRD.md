Here is your enhanced and corrected Technical Requirements Document. I've fixed the heading hierarchy, filled technical gaps, added missing sections, corrected inconsistencies, and elevated it to production-grade standards.

---

# Technical Requirements Document (TRD)
# CodeWithIshant Platform

| **Document Metadata** | |
|---|---|
| **Project** | CodeWithIshant |
| **Document Type** | Technical Requirements Document (TRD) |
| **Version** | 1.1 |
| **Status** | Draft / Under Review |
| **Date** | 2026-05-12 |

---

## 1. Introduction

### 1.1 Purpose
This document defines the comprehensive technical architecture, technology stack, system design, security posture, deployment strategy, and scalability roadmap for the **CodeWithIshant** educational platform.

The primary goal is to engineer a scalable, secure, maintainable, and high-performance full-stack application that delivers educational content with an exceptional developer and user experience.

### 1.2 Scope
This TRD covers:
- System architecture and tech stack justification
- Frontend and backend structural design
- Database schema, constraints, and relationships
- Authentication, authorization, and security mechanisms
- API design standards and endpoint specifications
- Performance, SEO, and accessibility requirements
- Deployment, CI/CD, and disaster recovery planning
- Scalability roadmap and future integrations

### 1.3 Target Audience
- Frontend and Backend Engineers
- DevOps / Platform Engineers
- QA and Security Auditors
- Technical Project Stakeholders

---

## 2. System Overview

**CodeWithIshant** is a full-stack educational platform providing:
- Curated technical notes and cheat sheets
- In-depth topic explanations with syntax highlighting
- Secure user authentication and personalized dashboards
- Full-text search and content categorization
- Bookmarking and reading history
- Future: AI-powered assistance, community features, and interactive code playgrounds

### 2.1 Architectural Style
The platform follows a **modern client-server architecture** with clear separation of concerns:
- Stateless RESTful API backend
- Server-side rendered (SSR) and statically generated (SSG) frontend
- Relational database with normalized schema design

---

## 3. Tech Stack

### 3.1 Frontend

| Technology | Purpose | Justification |
|---|---|---|
| **Next.js 15+** | Frontend Framework | App Router, SSR/SSG, Image Optimization, API Routes |
| **React 19+** | UI Library | Component-based architecture, concurrent features |
| **TypeScript** | Type Safety | Compile-time error catching, enhanced DX, safer refactors |
| **Tailwind CSS** | Styling | Utility-first, minimal CSS bundle, design consistency |
| **Shadcn UI** | UI Components | Accessible, customizable, Radix UI primitives |
| **Framer Motion** | Animations | Declarative animations, layout transitions |
| **Axios** | HTTP Client | Request/response interceptors, automatic JSON parsing |
| **Zod** | Runtime Validation | Schema validation for forms and API responses |

### 3.2 Backend

| Technology | Purpose | Justification |
|---|---|---|
| **FastAPI** | Backend Framework | High performance, async-native, automatic OpenAPI docs |
| **SQLAlchemy 2.0** | ORM | Async support, type-annotated models, robust migration path |
| **PostgreSQL 16+** | Database | ACID compliance, advanced indexing, JSONB support, full-text search |
| **Pydantic v2** | Validation & Serialization | Fast, strict typing, integrated with FastAPI |
| **Alembic** | Database Migrations | Version-controlled schema evolution |
| **Python-Jose** | JWT Handling | JWS/JWT encoding/decoding with algorithm flexibility |
| **Passlib (bcrypt)** | Password Hashing | Industry-standard hashing with salt |
| **Uvicorn** | ASGI Server | Async worker support for FastAPI |
| **python-multipart** | Form Parsing | OAuth2 password flow support |

### 3.3 DevOps & Tooling

| Tool | Purpose |
|---|---|
| **Git** | Version Control |
| **GitHub** | Repository Hosting & Code Review |
| **GitHub Actions** | CI/CD Pipeline |
| **VS Code** | Development Environment |
| **Postman / Bruno** | API Testing & Documentation |
| **Docker & Docker Compose** | Containerization & Local Orchestration |
| **ESLint + Prettier** | Code Quality & Formatting |
| **Husky + lint-staged** | Pre-commit Hooks |

---

## 4. Architecture Overview

### 4.1 High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Web App    │  │   Mobile     │  │   Search     │      │
│  │  (Next.js)   │  │  (Future)    │  │   Engines    │      │
│  └──────┬───────┘  └──────────────┘  └──────────────┘      │
└─────────┼───────────────────────────────────────────────────┘
          │ HTTPS / HTTP/2
┌─────────▼───────────────────────────────────────────────────┐
│                      CDN (Future)                            │
│            (Static Assets, Edge Caching)                     │
└─────────┬───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                   API Gateway / Load Balancer                │
│              (Rate Limiting, SSL Termination)                │
└─────────┬───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              FastAPI Backend (Python)                │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │   │
│  │  │   Auth      │ │   Notes     │ │   Search     │  │   │
│  │  │   Module    │ │   Module    │ │   Module     │  │   │
│  │  └─────────────┘ └─────────────┘ └──────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────┬───────────────────────────────────────────────────┘
          │
┌─────────▼───────────────────────────────────────────────────┐
│                   Data Layer                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           SQLAlchemy ORM (Async Session)             │   │
│  └──────────────────────┬──────────────────────────────┘   │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐   │
│  │              PostgreSQL Database                     │   │
│  │  (Row-Level Security, Indexes, Full-Text Search)    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Communication Patterns
- **Synchronous**: RESTful JSON API between Client and Backend
- **Future Asynchronous**: WebSocket for real-time notifications; Redis Pub/Sub for background tasks

---

## 5. Frontend Architecture

### 5.1 Framework Configuration
- **Routing**: Next.js App Router (`app/` directory)
- **Rendering Strategy**:
  - **SSR**: Dynamic content pages (notes, user profiles)
  - **SSG**: Public marketing pages, cheat sheets, sitemap
  - **CSR**: Dashboards, bookmarks, admin panels (post-auth)
- **Output**: Hybrid (Server + Static)

### 5.2 Key Requirements
- Fully responsive design (Mobile / Tablet / Desktop)
- Core Web Vitals optimization (LCP < 2.5s, CLS < 0.1, FID/INP < 200ms)
- WCAG 2.1 Level AA accessibility compliance
- SEO optimization with dynamic metadata and structured data
- Reusable, composable component system

### 5.3 Folder Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Route groups (login, register)
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # Next.js API routes (proxies, edge)
│   ├── notes/              # Public note pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Shadcn UI primitives
│   ├── forms/              # Form-specific components
│   ├── layout/             # Header, Footer, Sidebar
│   └── notes/              # Note-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities, constants, config
├── services/               # API service layer (Axios instances)
├── stores/                 # Zustand state stores (Future)
├── types/                  # Global TypeScript definitions
├── styles/                 # Global CSS, Tailwind config
├── public/                 # Static assets
└── middleware.ts           # Auth middleware, route guards
```

### 5.4 Core Features

#### Authentication
- Login / Signup pages with form validation (Zod + React Hook Form)
- JWT access token handling via HTTP-only cookies (preferred) or secure localStorage
- Route protection via Next.js Middleware (`middleware.ts`)
- Persistent login with automatic token refresh logic
- Logout with client-side state cleanup

#### Notes Module
- Server-side markdown rendering (security: sanitize HTML)
- Syntax highlighting via `react-syntax-highlighter` or `Shiki`
- Topic categorization with breadcrumb navigation
- Full-text search integration
- Reading progress indicator

#### Dashboard
- Personalized bookmarks with drag-and-drop ordering (Future)
- User profile management (avatar upload, bio)
- Recently viewed topics with local + server sync
- Reading statistics and activity heatmap (Future)

### 5.5 State Management

| Phase | Solution | Use Case |
|---|---|---|
| **Current** | React Context API + `useReducer` | Global auth state, theme |
| **Phase 2** | Zustand | Dashboard state, UI preferences |
| **Phase 3** | TanStack Query (React Query) | Server state caching, background refetching |

### 5.6 API Communication Layer

```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: Attach JWT
api.interceptors.request.use((config) => {
  const token = getAccessToken(); // from cookie/storage
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: Handle 401, refresh token, global errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Trigger token refresh or redirect to login
    }
    return Promise.reject(error);
  }
);
```

**Requirements**:
- Centralized error handling with user-friendly toast notifications
- Request deduplication and cancellation
- Standardized API response envelope: `{ success: boolean, data: T, message?: string, errors?: object }`

---

## 6. Backend Architecture

### 6.1 Framework
- **FastAPI** with Python 3.12+
- **Async-first**: All database operations use `asyncpg` + SQLAlchemy async session
- **Auto-generated docs**: OpenAPI/Swagger UI at `/docs`, ReDoc at `/redoc`

### 6.2 API Design Standards
- **Style**: RESTful JSON API
- **Versioning**: URL-based (`/api/v1/...`)
- **Content-Type**: `application/json`
- **Date/Time**: ISO 8601 UTC strings
- **Pagination**: Cursor-based for high-volume lists, Offset-based for admin UIs
- **Filtering**: Query parameters (`?category=python&sort=created_at:desc`)
- **Status Codes**: Strict adherence to HTTP semantics

### 6.3 Backend Responsibilities
- Authentication & Authorization (OAuth2 Password Flow + JWT)
- Input validation, sanitization, and business logic enforcement
- CRUD operations with transaction safety
- Database query optimization and connection pooling
- Structured logging and error reporting
- Rate limiting and abuse prevention

### 6.4 Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app factory, lifespan events
│   ├── api/
│   │   ├── deps.py             # Dependencies (DB session, current user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py         # Auth endpoints
│   │       ├── users.py        # User endpoints
│   │       ├── notes.py        # Note endpoints
│   │       ├── categories.py   # Category endpoints
│   │       └── bookmarks.py    # Bookmark endpoints
│   ├── core/
│   │   ├── config.py           # Pydantic Settings (env vars)
│   │   ├── security.py         # Password hashing, JWT utils
│   │   └── logging.py          # Structured logging config
│   ├── db/
│   │   ├── base.py             # Base declarative class
│   │   ├── session.py          # Async engine & session factory
│   │   └── init_db.py          # DB initialization scripts
│   ├── models/                 # SQLAlchemy ORM models
│   ├── schemas/                # Pydantic request/response models
│   ├── services/               # Business logic layer
│   ├── middleware/             # CORS, logging, error handling
│   └── utils/                  # Helper functions
├── alembic/                    # Migration scripts
├── tests/                      # Pytest suite
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── .env.example
```

---

## 7. Database Design

### 7.1 Database Configuration
- **Engine**: PostgreSQL 16+
- **ORM**: SQLAlchemy 2.0 (Declarative Base, type-annotated)
- **Driver**: `asyncpg`
- **Migration**: Alembic
- **Connection Pooling**: Async connection pool (min: 5, max: 20)

### 7.2 Core Schema

#### `users`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier |
| `username` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL`, `CHECK (LENGTH >= 3)` | Public display name |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | Login identifier |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Soft-delete flag |
| `is_admin` | `BOOLEAN` | `DEFAULT FALSE` | Role flag |
| `created_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Registration time |
| `updated_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Last profile update |

**Indexes**: `idx_users_email`, `idx_users_username`

---

#### `categories`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-increment ID |
| `name` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | Category name |
| `slug` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | URL-friendly identifier |
| `description` | `TEXT` | | Optional description |
| `created_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Creation time |

**Indexes**: `idx_categories_slug`

---

#### `notes`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, `DEFAULT gen_random_uuid()` | Unique identifier |
| `title` | `VARCHAR(255)` | `NOT NULL` | Note title |
| `slug` | `VARCHAR(255)` | `UNIQUE`, `NOT NULL` | URL-friendly identifier |
| `content` | `TEXT` | `NOT NULL` | Markdown content |
| `summary` | `VARCHAR(500)` | | Short description for SEO |
| `category_id` | `INTEGER` | `FK → categories.id`, `ON DELETE SET NULL` | Topic category |
| `author_id` | `UUID` | `FK → users.id`, `ON DELETE CASCADE` | Content creator |
| `is_published` | `BOOLEAN` | `DEFAULT FALSE` | Visibility flag |
| `view_count` | `INTEGER` | `DEFAULT 0` | Analytics counter |
| `created_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Creation time |
| `updated_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Last edit time |

**Indexes**: `idx_notes_slug`, `idx_notes_category_id`, `idx_notes_created_at`, `idx_notes_search` (GIN index on `to_tsvector('english', title || ' ' || content)`)

---

#### `bookmarks`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-increment ID |
| `user_id` | `UUID` | `FK → users.id`, `ON DELETE CASCADE` | Bookmark owner |
| `note_id` | `UUID` | `FK → notes.id`, `ON DELETE CASCADE` | Bookmarked note |
| `created_at` | `TIMESTAMP TZ` | `DEFAULT NOW()` | Bookmark time |

**Constraints**: `UNIQUE(user_id, note_id)` — prevents duplicate bookmarks
**Indexes**: `idx_bookmarks_user_id`, `idx_bookmarks_note_id`

---

### 7.3 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   notes     │       │  categories │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ author_id   │   ┌──►│ id (PK)     │
│ username    │       │ category_id │───┘   │ name        │
│ email       │       │ id (PK)     │       │ slug        │
│ ...         │       │ title       │       │ ...         │
└─────────────┘       │ slug        │       └─────────────┘
       ▲              │ content     │
       │              │ ...         │
       │              └─────────────┘
       │                     ▲
       │                     │
       │              ┌──────┴──────┐
       │              │  bookmarks  │
       └──────────────┤ user_id(FK) │
                      │ note_id(FK) │
                      │ ...         │
                      └─────────────┘
```

### 7.4 Future Tables
| Table | Purpose |
|---|---|
| `refresh_tokens` | Secure token rotation & revocation |
| `comments` | Community discussion threads |
| `quizzes` | Interactive assessments |
| `user_progress` | Completion tracking per note |
| `notifications` | User alerts and system messages |
| `ai_conversations` | AI assistant chat history |
| `tags` & `note_tags` | Many-to-many content tagging |

---

## 8. Authentication & Authorization

### 8.1 Authentication Method
**JWT (JSON Web Token)** with OAuth2 Password Bearer flow.

### 8.2 Token Strategy

| Token Type | Storage | TTL | Purpose |
|---|---|---|---|
| **Access Token** | HTTP-only Cookie (`__Host-access_token`) or Memory | 15–30 minutes | API authorization |
| **Refresh Token** | HTTP-only Cookie (`__Host-refresh_token`) | 7 days | Silent re-authentication |

### 8.3 Authentication Flow

```
┌─────────┐                                    ┌─────────────┐
│  Client │─── POST /auth/login ──────────────►│   FastAPI   │
│         │    {email, password}               │   Backend   │
│         │◄─── {access_token, refresh_token}──┤             │
│         │                                    └──────┬──────┘
│         │                                           │
│         │◄──────────── 401 Unauthorized ────────────┤
│         │    (Token expired)                        │
│         │                                           │
│         │─── POST /auth/refresh ───────────────────►│
│         │    {refresh_token}                        │
│         │◄─── {access_token} ───────────────────────┤
│         │                                           │
│         │─── POST /auth/logout ────────────────────►│
│         │    (Blacklist refresh_token)              │
└─────────┘                                           └─────────────┘
```

### 8.4 Password Security
- **Hashing Algorithm**: `bcrypt` with salt rounds ≥ 12
- **Validation Rules**:
  - Minimum 8 characters
  - At least one uppercase, one lowercase, one digit
  - No common passwords (check against breached password list if possible)

### 8.5 JWT Requirements

| Requirement | Specification |
|---|---|
| Algorithm | `HS256` (HMAC with SHA-256) |
| Secret Key | Cryptographically random string, 256-bit minimum |
| Secret Storage | Environment variable only, never committed |
| Issuer (`iss`) | `codewithishant-api` |
| Audience (`aud`) | `codewithishant-web` |
| Claims | `sub` (user_id), `exp`, `iat`, `type` (access/refresh) |

### 8.6 Authorization & Roles
| Role | Permissions |
|---|---|
| `anonymous` | Read published notes only |
| `user` | Read + Bookmarks + Profile + Dashboard |
| `admin` | All user perms + Create/Update/Delete notes + User management |

### 8.7 Protected Resources
- `/dashboard/*` — Requires valid access token
- `/api/v1/users/me/*` — Requires valid access token
- `/api/v1/notes` (POST, PUT, DELETE) — Requires `admin` role
- `/api/v1/admin/*` — Requires `admin` role

---

## 9. API Structure

### 9.1 Base URL
```
https://api.codewithishant.com/api/v1
```

### 9.2 Response Envelope
All JSON responses follow a unified structure:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 150
  },
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": { "email": "Invalid email format" }
  }
}
```

### 9.3 Authentication Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | User registration with email verification (Future) |
| `POST` | `/auth/login` | Public | Authenticate, receive tokens |
| `POST` | `/auth/refresh` | Public (w/ refresh cookie) | Rotate access token |
| `POST` | `/auth/logout` | Required | Revoke refresh token |
| `GET` | `/auth/me` | Required | Current user profile |
| `POST` | `/auth/change-password` | Required | Update password |

### 9.4 Notes Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/notes` | Public | List published notes (paginated, filterable) |
| `GET` | `/notes/{slug}` | Public | Get single note by slug |
| `POST` | `/notes` | Admin | Create new note |
| `PUT` | `/notes/{id}` | Admin | Update note content/metadata |
| `DELETE` | `/notes/{id}` | Admin | Soft-delete note |
| `GET` | `/notes/search` | Public | Full-text search across notes |

**Query Parameters for `GET /notes`**:
- `?page=1&per_page=20` — Pagination
- `?category=python` — Filter by category slug
- `?sort=created_at:desc` — Sorting
- `?q=async+await` — Full-text search

### 9.5 User Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/users/profile` | Required | Get own profile |
| `PATCH` | `/users/profile` | Required | Update profile |
| `GET` | `/users/bookmarks` | Required | List bookmarked notes |
| `POST` | `/users/bookmarks` | Required | Add bookmark |
| `DELETE` | `/users/bookmarks/{note_id}` | Required | Remove bookmark |

### 9.6 Category Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/categories` | Public | List all categories |
| `GET` | `/categories/{slug}` | Public | Get category + notes |

---

## 10. Validation & Schemas

### 10.1 Validation Tool
**Pydantic v2** for all request/response models.

### 10.2 Requirements
- Strict request validation with descriptive error messages
- Response serialization for type safety
- Automatic OpenAPI schema generation
- Custom validators for business logic (e.g., password strength)

### 10.3 Example Schemas

```python
# Request Schema
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(..., min_length=8)
    
    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v

# Response Schema
class UserPublic(BaseModel):
    id: UUID
    username: str
    email: EmailStr
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)
```

---

## 11. Security Requirements

### 11.1 Mandatory Security Controls

#### Backend
- **Input Sanitization**: All user inputs sanitized; HTML content purified (e.g., `bleach` or `nh3`)
- **SQL Injection Prevention**: Parameterized queries exclusively via SQLAlchemy ORM
- **JWT Validation**: Signature, expiration, issuer, and audience verification on every protected route
- **Password Security**: Bcrypt hashing with per-user salt
- **CORS**: Strict whitelist configuration; credentials enabled only for trusted origins
- **Environment Protection**: No secrets in source code; `.env` files excluded from version control
- **Security Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (HSTS)
  - `Content-Security-Policy` (CSP)

#### Frontend
- **XSS Prevention**: React's built-in escaping + DOMPurify for markdown rendering
- **CSRF Protection**: SameSite=Strict cookies, anti-CSRF tokens for state-changing operations if not using JWT Bearer
- **Secure Storage**: Access tokens in `memory` or `httpOnly` cookies; never `localStorage` for sensitive tokens if XSS is a concern

### 11.2 Future Security Enhancements
| Feature | Priority | Description |
|---|---|---|
| Rate Limiting | High | Per-IP and per-user request throttling (e.g., 100 req/min) |
| Refresh Token Rotation | High | Issue new refresh token on every use, detect reuse |
| Email Verification | Medium | Verify email before full account activation |
| 2FA / MFA | Medium | TOTP-based two-factor authentication |
| OAuth2 Providers | Medium | GitHub, Google social login |
| Audit Logging | Medium | Track admin actions and security events |
| Dependency Scanning | High | Automated CVE scanning (Snyk, Dependabot) |

---

## 12. Performance Requirements

### 12.1 Frontend Targets
| Metric | Target | Strategy |
|---|---|---|
| First Contentful Paint (FCP) | < 1.0s | Preload critical assets, font optimization |
| Largest Contentful Paint (LCP) | < 2.5s | Image optimization (WebP/AVIF), SSR |
| Time to Interactive (TTI) | < 3.5s | Code splitting, lazy loading |
| Cumulative Layout Shift (CLS) | < 0.1 | Explicit image dimensions, font-display swap |

**Techniques**:
- Route-based code splitting via Next.js dynamic imports
- Image optimization with `next/image`
- Lazy loading for below-the-fold content
- Service Worker for asset caching (Future PWA)

### 12.2 Backend Targets
| Metric | Target | Strategy |
|---|---|---|
| API Response Time (p95) | < 200ms | Query optimization, DB indexing |
| Database Query Time | < 50ms | Proper indexing, query plan analysis |
| Auth Verification | < 10ms | Stateless JWT validation |

**Techniques**:
- Async database operations with connection pooling
- Database query result caching with Redis (Future)
- Read replicas for heavy read workloads (Future)
- GIN indexes for full-text search
- N+1 query prevention via eager loading (`selectinload`)

---

## 13. SEO Requirements

### 13.1 On-Page SEO
- Dynamic `<title>` and `<meta name="description">` per page
- Canonical URLs to prevent duplicate content
- Open Graph tags (`og:title`, `og:description`, `og:image`) for social sharing
- Twitter Card meta tags
- JSON-LD structured data (Article schema for notes, Organization schema for homepage)

### 13.2 Technical SEO
- XML sitemap auto-generation (`/sitemap.xml`)
- `robots.txt` with clear allow/disallow rules
- SEO-friendly URLs: `/notes/python-async-await` (kebab-case slugs)
- Semantic HTML structure (`<article>`, `<nav>`, `<header>`, `<main>`)
- Proper heading hierarchy (`h1` once per page, logical `h2`–`h6` flow)

### 13.3 Performance SEO
- Core Web Vitals monitoring via Vercel Analytics or Lighthouse CI
- Preconnect to API domain
- DNS prefetch for external resources

---

## 14. Error Handling Standards

### 14.1 HTTP Status Code Usage
| Status | Usage |
|---|---|
| `200 OK` | Successful GET, PUT, PATCH |
| `201 Created` | Successful POST |
| `204 No Content` | Successful DELETE |
| `400 Bad Request` | Validation errors, malformed JSON |
| `401 Unauthorized` | Missing or invalid authentication |
| `403 Forbidden` | Authenticated but insufficient permissions |
| `404 Not Found` | Resource does not exist |
| `409 Conflict` | Resource already exists (duplicate email, slug) |
| `422 Unprocessable Entity` | Semantic validation errors (Pydantic) |
| `429 Too Many Requests` | Rate limit exceeded |
| `500 Internal Server Error` | Unexpected server errors |

### 14.2 Error Logging
- All 5xx errors logged with stack traces and request context
- 4xx errors logged at `WARNING` level with anonymized user info
- Structured JSON logging format for machine parsing

---

## 15. Logging & Monitoring

### 15.1 Logging Strategy
- **Format**: Structured JSON logs
- **Levels**: DEBUG (dev), INFO (production), WARNING, ERROR, CRITICAL
- **Contents**:
  - Timestamp (ISO 8601 UTC)
  - Request ID (correlation ID across services)
  - User ID (if authenticated)
  - HTTP method, path, status code, duration
  - Error stack traces

### 15.2 Future Monitoring Stack
| Tool | Purpose |
|---|---|
| **Sentry** | Real-time error tracking and performance monitoring |
| **Prometheus** | Metrics collection (request latency, DB pool usage) |
| **Grafana** | Visualization and alerting dashboards |
| **UptimeRobot / Better Uptime** | External uptime monitoring |

---

## 16. CI/CD & DevOps

### 16.1 Continuous Integration (GitHub Actions)
**Triggers**: Push to `main`, Pull Requests

**Jobs**:
1. **Lint & Format**: `ruff`, `black`, `mypy` (backend); `ESLint`, `Prettier` (frontend)
2. **Unit Tests**: Pytest with coverage report (target: ≥ 80%)
3. **Build Check**: Docker build verification
4. **Security Scan**: `bandit` (Python), `npm audit` (Node)

### 16.2 Continuous Deployment
| Environment | Branch | Strategy |
|---|---|---|
| Development | `develop` | Auto-deploy to staging |
| Staging | `main` | Manual approval → staging |
| Production | `main` (tagged) | Tagged release → production |

### 16.3 Infrastructure as Code (Future)
- Docker Compose for local development
- Terraform / Pulumi for cloud infrastructure (Future)
- Kubernetes for container orchestration at scale (Future)

---

## 17. Deployment

### 17.1 Frontend Deployment
**Primary**: **Vercel**
- Zero-config Next.js deployment
- Automatic preview deployments per PR
- Edge Network for global static asset delivery
- Serverless Functions for API routes and SSR

### 17.2 Backend Deployment
**Phase 1**: **Render** or **Railway**
- Simple container deployment from GitHub
- Managed PostgreSQL add-on or external Neon DB

**Phase 2**: **VPS / Cloud (AWS/GCP/Azure)**
- Docker containers on EC2 / Compute Engine
- Managed database (RDS / Cloud SQL)

### 17.3 Database Hosting
**Primary**: **Neon PostgreSQL** or **Supabase PostgreSQL**
- Serverless PostgreSQL with auto-scaling
- Branching for preview environments
- Point-in-time recovery (PITR)

### 17.4 Environment Strategy
| Variable | Development | Staging | Production |
|---|---|---|---|
| `DEBUG` | `true` | `false` | `false` |
| `LOG_LEVEL` | `DEBUG` | `INFO` | `INFO` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 60 | 15 | 15 |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | `["https://staging..."]` | `["https://codewithishant.com"]` |

---

## 18. Environment Variables

### 18.1 Frontend (`.env.local`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.codewithishant.com/api/v1

# Analytics (Future)
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_SENTRY_DSN=
```

### 18.2 Backend (`.env`)
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname

# Security
JWT_SECRET_KEY=your-super-secret-random-key-min-32-chars
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
REFRESH_TOKEN_EXPIRE_DAYS=7

# Application
APP_NAME=CodeWithIshant API
DEBUG=false
LOG_LEVEL=INFO
CORS_ORIGINS=["https://codewithishant.com","https://www.codewithishant.com"]

# Optional (Future)
# REDIS_URL=redis://localhost:6379/0
# SENTRY_DSN=
```

---

## 19. Scalability & Data Strategy

### 19.1 Current Scope
- Small to medium traffic (< 10,000 DAU)
- Single-region deployment
- Monolithic architecture

### 19.2 Scaling Roadmap

| Phase | Traffic | Strategy |
|---|---|---|
| **Phase 1** | < 10K DAU | Vertical scaling, DB indexing, query optimization |
| **Phase 2** | 10K–100K DAU | Redis caching layer, CDN for static assets, read replicas |
| **Phase 3** | 100K+ DAU | Microservices extraction (AI service, Search service), Kubernetes, multi-region |

### 19.3 Caching Strategy (Future)
- **Redis** for:
  - Session store (if moving away from JWT)
  - Popular note content (cache TTL: 1 hour)
  - Rate limiting counters
  - Full-text search result caching

### 19.4 Data Backup & Disaster Recovery
- **Automated Backups**: Daily full DB backups with 30-day retention
- **Point-in-Time Recovery**: Enabled via managed DB provider (Neon/Supabase)
- **Cross-Region Replication**: Future requirement for high availability
- **Disaster RTO**: < 1 hour; **RPO**: < 15 minutes

---

## 20. Future Integrations

| Feature | Description | Priority |
|---|---|---|
| **AI Assistant** | RAG-based chatbot trained on notes content | High |
| **Markdown Editor** | Rich MDX editor with live preview for admin | Medium |
| **Code Playground** | Embedded runnable code snippets (WebAssembly or Sandpack) | Medium |
| **Recommendation Engine** | Content suggestions based on reading history | Medium |
| **Community System** | Comments, forums, user-generated content | Low |
| **Newsletter** | Weekly digest of new content | Low |
| **Mobile App** | React Native or Flutter companion app | Low |

---

## 21. Testing Requirements

### 21.1 Testing Pyramid

| Layer | Tool | Target | Coverage |
|---|---|---|---|
| **Unit Tests** | Pytest (backend), Vitest (frontend) | Functions, utilities, hooks | ≥ 80% |
| **Integration Tests** | Pytest + TestClient (backend) | API endpoints, DB transactions | ≥ 70% |
| **E2E Tests** | Playwright | Critical user flows (login → bookmark) | Core flows |
| **Load Tests** | k6 / Locust | Auth and notes endpoints under load | Baseline |

### 21.2 Critical Test Scenarios
- Authentication flow (register → login → access protected → logout)
- CRUD operations with permission boundaries
- Database constraint enforcement (unique emails, duplicate bookmarks)
- XSS payload sanitization in markdown content
- JWT expiration and refresh token rotation

---

## 22. Coding Standards

### 22.1 Frontend Standards
- **Components**: Single responsibility, props interface explicitly typed
- **File Naming**: PascalCase for components (`NoteCard.tsx`), camelCase for utilities
- **Imports**: Absolute imports via path aliases (`@/components/ui`)
- **Accessibility**: All interactive elements keyboard accessible; ARIA labels where needed
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`)

### 22.2 Backend Standards
- **Architecture**: Service-layer pattern — routers thin, logic in `services/`
- **Typing**: Full type hints; `mypy --strict` compliance
- **Async**: All I/O-bound operations must be async
- **Database**: No raw SQL in routers; use ORM with eager loading
- **Error Handling**: Custom exception classes, centralized exception handlers in FastAPI
- **Documentation**: All public endpoints must have docstrings generating OpenAPI descriptions

---

## 23. Risks & Mitigation

| Risk | Impact | Likelihood | Mitigation Strategy |
|---|---|---|---|
| Database performance degradation under growth | High | Medium | Proactive indexing, query analysis (`EXPLAIN ANALYZE`), pagination, read replicas |
| Security vulnerabilities (auth bypass, XSS) | Critical | Low | Security audits, dependency scanning, OWASP Top 10 review, penetration testing |
| Content growth causing slow search | Medium | High | PostgreSQL full-text search + GIN indexes; migrate to Elasticsearch if needed |
| SEO ranking competition | Medium | High | High-quality original content, semantic HTML, fast Core Web Vitals, backlink strategy |
| Vendor lock-in (hosting) | Low | Medium | Containerized deployment; avoid proprietary APIs |
| Technical debt from rapid scaling | Medium | Medium | Modular architecture, comprehensive tests, regular refactoring sprints |

---

## 24. Development Phases

### Phase 1: Foundation (Weeks 1–4)
- [ ] Project scaffolding (Next.js + FastAPI + Docker)
- [ ] Database setup with Alembic migrations
- [ ] User authentication system (register, login, JWT, protected routes)
- [ ] Basic note CRUD (admin-only creation, public reading)
- [ ] CI/CD pipeline (GitHub Actions)

### Phase 2: Core Features (Weeks 5–8)
- [ ] Cheat sheets module
- [ ] Category system with navigation
- [ ] Full-text search implementation
- [ ] User dashboard with bookmarks
- [ ] Responsive UI polish and dark mode

### Phase 3: Enhancement (Weeks 9–12)
- [ ] Admin panel for content management
- [ ] Advanced markdown rendering with syntax highlighting
- [ ] SEO optimization (sitemap, structured data, meta tags)
- [ ] Rate limiting and security hardening
- [ ] Performance optimization (caching, image optimization)

### Phase 4: Intelligence & Community (Future)
- [ ] AI assistant integration (RAG pipeline)
- [ ] Comment system
- [ ] User progress tracking
- [ ] Advanced analytics and recommendation engine
- [ ] Mobile application

---

## 25. Compliance & Legal

### 25.1 Data Privacy
- **GDPR Compliance** (if serving EU users):
  - Explicit consent for data processing
  - Right to data export and deletion
  - Cookie consent banner
  - Privacy Policy and Terms of Service pages
- **Data Retention**: User data retained until account deletion; soft-delete with 30-day grace period

### 25.2 Accessibility
- WCAG 2.1 Level AA compliance mandatory
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratio ≥ 4.5:1

---

## 26. Final Technical Vision

**CodeWithIshant** is architected to evolve into:

- **A Scalable Educational Ecosystem**: Modular design enabling feature expansion without architectural rewrites
- **A High-Performance Learning Platform**: Sub-second page loads, instant search, and fluid interactions
- **A Secure Full-Stack Application**: Defense-in-depth security with proactive vulnerability management
- **A Developer-Focused Knowledge Hub**: Clean APIs, excellent documentation, and a delightful authoring experience

### Guiding Principles
1. **Scalability**: Design for 10x traffic without panic rewrites
2. **Maintainability**: Clean code, comprehensive tests, and clear documentation
3. **Security**: Never trust user input; verify at every layer
4. **Performance**: Every millisecond counts; optimize the critical path
5. **Developer Experience**: Fast feedback loops, type safety, and automated tooling

---

*End of Document*