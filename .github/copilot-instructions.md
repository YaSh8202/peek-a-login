# Peek-a-Login - AI Coding Instructions

## Project Overview
A creative login screen featuring interactive SVG monster characters that follow the cursor with their eyes/faces. Built with React 19, TypeScript, Vite, Tailwind CSS v4, and Framer Motion.

## Tech Stack
- **Build**: Vite 7 with React compiler plugin (`babel-plugin-react-compiler`)
- **UI**: Tailwind CSS 4 (via `@tailwindcss/vite`), shadcn/ui components
- **Animation**: Framer Motion for eye tracking and smooth spring physics
- **Routing**: React Router DOM v7
- **Package Manager**: Bun (see terminal history)

## Architecture

### Monster System Design
The interactive monsters use a two-layer animation approach:

1. **Face Tracking** (`useFaceTracking` hook): Entire face (eyes + mouth) moves toward cursor
2. **Pupil Tracking**: Independent pupil movement within eyes for natural look

Key files:
- [src/components/monsters/InteractiveMonsters.tsx](src/components/monsters/InteractiveMonsters.tsx) - Container that tracks cursor globally and passes `MotionValue<number>` to monsters
- [src/components/monsters/hooks/useEyeTracking.ts](src/components/monsters/hooks/useEyeTracking.ts) - Provides `useEyeTracking()` and `useFaceTracking()` hooks
- [src/components/monsters/monsters/*.tsx](src/components/monsters/monsters/) - Individual monster components (Violetto, Inky, Gloop, Nugget)

### Monster Implementation Pattern
Each monster component:
1. Receives `cursorX` and `cursorY` as `MotionValue<number>` props
2. Uses `useFaceTracking()` or `useEyeTracking()` to calculate offsets
3. Applies `face.faceOffsetX/Y` to ALL face elements (eyes, mouth)
4. For pupils: combines face offset + pupil offset using `useTransform`
5. Z-index determined by SVG render order in `InteractiveMonsters.tsx`

Example from [Violetto.tsx](src/components/monsters/monsters/Violetto.tsx):
```tsx
const face = useFaceTracking(faceCenterX, faceCenterY, cursorX, cursorY, {
  maxFaceShift: 20,      // How far face moves
  maxPupilDistance: 4,   // How far pupil moves within eye
});

// Combine face movement + independent pupil movement
const leftPupilTotalX = useTransform(
  [face.faceOffsetX, face.pupilOffsetX],
  ([fx, px]) => (fx as number) + (px as number)
);
```

## Development Patterns

### Path Aliases
Use `@/` prefix for all imports (configured in [vite.config.ts](vite.config.ts)):
```tsx
import { InteractiveMonsters } from "@/components/monsters/InteractiveMonsters";
import { cn } from "@/lib/utils";
```

### Framer Motion Conventions
- Use `MotionValue` for cursor tracking (not state) - enables smooth interpolation without re-renders
- Spring physics: `stiffness: 100-180, damping: 12-20` for natural eye movement
- `useTransform()` for coordinate transformations (cursor → angle/distance → offset)
- Apply motion styles via `style={{ x, y, translateX, translateY }}` not `x={}/y={}` props

### Styling Conventions
- Tailwind utility classes preferred over custom CSS
- Use `cn()` helper from `@/lib/utils` to merge class names conditionally
- Custom spacing: `w-300 h-180` for login container (Tailwind arbitrary values)

## Commands
```bash
bun dev          # Start dev server
bun build        # Build for production (TypeScript check + Vite build)
bun lint         # ESLint check
bun preview      # Preview production build
```

## Key Considerations

### React Compiler Impact
The React Compiler is enabled ([vite.config.ts](vite.config.ts)) - expect slower build times. No manual memoization needed for most cases.

### Coordinate Systems
SVG uses `viewBox="0 0 400 400"` coordinate space. Monster positions use absolute SVG coordinates, not percentages:
- [Violetto](src/components/monsters/monsters/Violetto.tsx): bodyX=135, tall rectangle
- [Gloop](src/components/monsters/monsters/Gloop.tsx): center at x=160, large dome
- Eye/face offsets calculated relative to body center

### Adding New Monsters
1. Create component in `src/components/monsters/monsters/YourMonster.tsx`
2. Define body position and calculate face center: `faceCenterX/Y = bodyCenter`
3. Use `useFaceTracking()` for whole-face movement or `useEyeTracking()` per eye
4. Add to render order in `InteractiveMonsters.tsx` (later = on top)
5. Use motion initial/animate for entrance animation

### shadcn/ui Integration
Configured with "new-york" style ([components.json](components.json)). Install components with:
```bash
npx shadcn@latest add button
```
