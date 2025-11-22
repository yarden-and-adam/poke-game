# Pokémon Battle Game - Agent Development Guide

## Build Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Code Style Guidelines

### TypeScript & React
- Use functional components with hooks (no classes)
- Strict typing required - all interfaces and types must be defined
- Import order: React hooks → external libraries → internal modules → types
- Use PascalCase for components, camelCase for variables/functions
- Interface names: PascalCase (e.g., `GameState`, `PokemonState`)

### Styling Rules
- NEVER hardcode colors - use CSS variables: `var(--color-*)`
- Use spacing scale: `var(--spacing-xs|sm|md|lg|xl|2xl|3xl)`
- All components must be responsive with mobile-first approach
- Theme-aware: test in light, dark, and holiday themes

### File Organization
- Components in `src/ui/`, game logic in `src/game/`, types in `src/types.ts`
- CSS files in `src/styles/` with descriptive names
- One component per file, export as default

### Error Handling
- Use try/catch for async operations
- Validate props with TypeScript interfaces
- Handle loading states and edge cases

### Testing
- No test framework configured - manually test functionality
- Verify theme compatibility across all themes
- Test responsive design on mobile/tablet/desktop