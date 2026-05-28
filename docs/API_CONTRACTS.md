# API Contracts

This document defines the public API contracts for CodeWithIshant v2. It describes expected request shapes, response payloads, authentication requirements, and common error formats.

## Common Response Format

Successful responses are typically JSON objects with clearly named fields.

Example:

```json
{
  "success": true,
  "data": {...}
}
```

Error responses include an HTTP status code and message.

Example:

```json
{
  "detail": "Validation error details"
}
```

## Authentication

- Admin API routes require a Bearer JWT token.
- Token creation happens at login.
- Token blacklist is used for logout and token invalidation.

Header example:

```
Authorization: Bearer <token>
```

## Topic Endpoints

### GET `/api/topics`

- Description: Fetch all topics or a filtered list.
- Query params: `search`, `parent_id`, `limit`, `offset`
- Response:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Python Basics",
      "slug": "python-basics",
      "description": "Intro to Python",
      "parent_id": null,
      "created_at": "2026-05-28T12:00:00Z"
    }
  ]
}
```

### POST `/api/topics`

- Auth: Required
- Body:

```json
{
  "title": "New Topic",
  "slug": "new-topic",
  "description": "Topic description",
  "parent_id": 2
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 10,
    "title": "New Topic",
    "slug": "new-topic"
  }
}
```

### GET `/api/topics/{slug}`

- Description: Fetch topic details and associated notes.
- Response: topic metadata plus nested note summaries.

## Note Endpoints

### GET `/api/notes`

- Query params: `topic_id`, `search`, `limit`, `offset`
- Response includes note summaries with title, slug, and excerpt.

### POST `/api/notes`

- Auth: Required
- Body:

```json
{
  "title": "Note Title",
  "slug": "note-title",
  "content": "# Markdown content",
  "topic_id": 3,
  "summary": "Short description"
}
```

- Response:

```json
{
  "success": true,
  "data": {
    "id": 42,
    "title": "Note Title",
    "slug": "note-title"
  }
}
```

## Auth Endpoints

### POST `/api/auth/login`

- Body:

```json
{
  "username": "admin",
  "password": "secret"
}
```

- Response:

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### POST `/api/auth/logout`

- Auth: Required
- Response: success acknowledgement.

## Error Handling

- `400 Bad Request`: validation or malformed payload
- `401 Unauthorized`: missing or invalid authentication
- `403 Forbidden`: authenticated but insufficient permissions
- `404 Not Found`: missing resource
- `500 Internal Server Error`: unexpected server failure

### Error Example

```json
{
  "detail": "Topic not found"
}
```

## Payload Conventions

- Use `snake_case` in backend JSON fields where appropriate.
- Return created resources immediately after POST operations.
- Use pagination fields for list endpoints when needed.

## Versioning

- Start with unversioned `/api/` routes.
- Future compatibility should migrate to `/api/v1/` or similar versioned namespaces.
