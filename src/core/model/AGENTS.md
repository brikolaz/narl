# ECS

## Design Decisions

- Entities and components are plain objects
- They are created by factory functions
- Runtime identity is determined by type symbols and component sets, not prototypes
- Classes are intentionally avoided

## API

- Registry is the low-level API and operates on IDs
- Entity helpers are the public API
- Entity helpers resolve IDs, entities, components and component types automatically when possible
