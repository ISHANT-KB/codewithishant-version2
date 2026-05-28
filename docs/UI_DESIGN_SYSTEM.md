# UI Design System

This guide defines the visual and interaction system for CodeWithIshant v2. It ensures consistency across public pages, admin screens, and the visualizer experience.

## Design Foundations

- **Clarity**: Interfaces should be easy to scan and understand.
- **Focus**: Content should be the primary visual hierarchy.
- **Consistency**: Reuse styles, spacing, and component patterns.
- **Accessibility**: Use readable text, accessible colors, and keyboard-friendly interactions.

## Tokens and Theme

### Colors

- Primary accent for actions and links.
- Neutral palette for backgrounds, cards, and text contrast.
- Error and warning colors for validation and alerts.

### Typography

- Headings: clear hierarchy for page sections.
- Body: legible font size for reading technical content.
- Code / preformatted text: monospaced styles for snippets.

### Spacing

- Use consistent spacing scales for padding and margins.
- Keep layout grids aligned across pages.

## Component Patterns

### Buttons

- Primary action button for main tasks.
- Secondary button for less important actions.
- Ghost/neutral button for cancel actions.

### Cards

- Use cards for grouped content previews, topic entries, note summaries, and admin items.
- Keep card headers distinct from body content.

### Forms

- Label fields clearly and include help text when necessary.
- Show validation states inline, not only on submit.
- Use a consistent form layout for admin create/edit flows.

### Layout

- Public pages should use a clear content column with supportive navigation.
- Admin screens should separate navigation and content management.
- Visualizer pages should dedicate space for controls, canvas, and state information.

## Frontend Structure

- `components/common/`: shared UI primitives, such as buttons, headings, empty states, badges.
- `components/features/`: feature-specific UI patterns for topics, notes, blogs, cheatsheets.
- `layout/`: global frames, header, footer, shell components.

## Behavior and Interaction

- Navigation should be obvious and use descriptive labels.
- Use progressive disclosure for admin settings and publishing actions.
- Keep interaction states consistent: hover, focus, active, disabled.

## Content Presentation

- Use Markdown rendering for note content and cheatsheet entries.
- Keep article headings, lists, and code blocks visually distinct.
- Use rich preview cards for topic and note collections.

## Accessibility

- Ensure all interactive elements have accessible names.
- Maintain sufficient contrast for text and controls.
- Support keyboard navigation in admin and visualizer UI.

## Visualizer UI

- Keep the visualizer canvas prominent.
- Expose step controls clearly: play, pause, next, reset.
- Display algorithm state and values in a sidebar or overlay.
- Use animation sparingly and keep it supportive, not distracting.

## Documentation and Governance

- Document new design patterns in this file when they are added.
- Keep component naming aligned with design intent.
- Prefer reusable components over page-specific duplicates.
