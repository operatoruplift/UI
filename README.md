# @operatoruplift/ui

Shared UI component library for Operator Uplift apps (website, desktop app, developer console).

## Installation

```bash
npm install @operatoruplift/ui
```

## Setup

### 1. Import the stylesheet

```tsx
import "@operatoruplift/ui/styles.css";
```

### 2. Extend your Tailwind config

```ts
// tailwind.config.ts
import { upliftPreset } from "@operatoruplift/ui/tailwind-preset";

export default {
  presets: [upliftPreset],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@operatoruplift/ui/dist/**/*.js",
  ],
};
```

## Usage

```tsx
import { Button, Badge, Card, CardContent } from "@operatoruplift/ui";

function App() {
  return (
    <Card>
      <CardContent>
        <Badge variant="success">Active</Badge>
        <Button variant="primary" size="md">
          Get Started
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Components

### Primitives

| Component | Description |
|-----------|-------------|
| `Button` | Primary, outline, ghost, danger variants with loading & icon support |
| `Badge` | Status labels: default, primary, success, warning, danger |
| `Card` | Container: default, glass, glass-dark variants with header/content/footer |
| `Input` | Text, password (show/hide), search with icon & error state |
| `Textarea` | Auto-resizing textarea with label and error state |
| `Toggle` | Animated on/off switch |
| `Select` | Dropdown with search and multi-select |
| `Tooltip` | Hover tooltips with arrow positioning |
| `Toast` | Auto-dismiss notifications: success, error, warning, info |
| `Alert` | Inline alert banners: info, success, warning, error with dismiss |
| `Avatar` | User/agent avatars with image, fallback initials, and status dot |
| `AvatarGroup` | Stacked avatar group with overflow count |
| `Dropdown` | Generic dropdown menu with items, dividers, danger items |
| `Tabs` | Tabbed navigation: default, pills, underline variants |
| `Breadcrumb` | Navigation breadcrumbs with custom separator |
| `Kbd` / `Shortcut` | Keyboard shortcut display |
| `Divider` | Horizontal/vertical dividers with optional label |
| `LoadingSpinner` | Spinner with label, optional fullscreen overlay |
| `CopyButton` | Copy-to-clipboard button with confirmation |

### Layout

| Component | Description |
|-----------|-------------|
| `Sidebar` | Collapsible nav with sections and icons |
| `Header` | Logo, nav links, user menu |
| `PageWrapper` | Standard page layout with max-width |
| `Modal` | Centered overlay with backdrop blur, close on Escape |
| `CommandPalette` | Cmd+K command palette with search, groups, keyboard navigation |

### Data Display

| Component | Description |
|-----------|-------------|
| `Table` | Sortable columns, pagination, row selection |
| `StatCard` | Value + label + change indicator |
| `ProgressBar` | Determinate and indeterminate |
| `Skeleton` | Loading placeholders (text, circular, rectangular) |
| `EmptyState` | Icon + message + action button |
| `CodeBlock` | Code display with filename, line numbers, copy button |
| `StatusDot` | Animated status indicator (online, offline, running, error, etc.) |
| `TokenCounter` | Token usage display with breakdown and progress bar |
| `CostDisplay` | Cost/spend display with change indicator |
| `StreamingText` | Animated text streaming with cursor |

### Agent-Specific

| Component | Description |
|-----------|-------------|
| `AgentCard` | Avatar, name, status dot, model badge, install button |
| `RiskBadge` | A/B/C/D/F grade with color coding |
| `SessionIndicator` | Active session count with animated dot |
| `PermissionChip` | Icon + label for permission types |
| `ModelSelector` | Provider-aware model dropdown |
| `ChatBubble` | User/assistant message bubbles with copy button |
| `ToolCallCard` | Expandable tool call display with status and I/O |
| `ConversationThread` | Mixed message + tool call conversation thread |
| `MemoryCard` | Expandable memory entry with on-demand content fetch |
| `MemoryPanel` | Full memory management panel with search, filter, CRUD |

### Effects

| Component | Description |
|-----------|-------------|
| `SpotlightCard` | Mouse-following gradient highlight |
| `GlowButton` | Animated glow on hover |
| `FadeIn` | Intersection observer fade-in animation |
| `DotGlobe` | Animated rotating dot grid globe |

### Providers

| Component | Description |
|-----------|-------------|
| `ThemeProvider` | Dark/light/system theme with persistence |
| `ToastProvider` | Toast notification context |

## Hooks

| Hook | Description |
|------|-------------|
| `useLocalStorage` | Persistent state synced across tabs |
| `useMediaQuery` | Responsive breakpoint detection |
| `useIsMobile` / `useIsTablet` / `useIsDesktop` | Convenience breakpoint hooks |
| `useDebounce` / `useDebouncedCallback` | Debounced values and callbacks |
| `useClipboard` | Copy to clipboard with auto-reset |
| `useKeyboard` / `useHotkey` | Keyboard shortcut handling |
| `useOnClickOutside` | Click outside detection |
| `useStreamingText` | Animated text streaming for AI responses |
| `useCostTracker` | Token/cost tracking for AI sessions |
| `useMemory` | 3-layer memory system (index/topic/search) |
| `useMemoryConsolidation` | Memory dedup, pruning, and merging (autoDream) |
| `useTheme` | Theme accessor from ThemeProvider |
| `useToast` | Toast notification accessor from ToastProvider |

## Memory System

The library includes a structured memory system inspired by production agentic architectures:

```tsx
import { useMemory, createLocalStorageAdapter } from "@operatoruplift/ui";

const adapter = createLocalStorageAdapter("my-app");
const { entries, addMemory, searchMemories } = useMemory({ adapter });
```

**3-layer architecture**: Index (always loaded, pointers only) -> Topics (on-demand) -> Search (grep-style)

## Design Tokens

| Token | Value |
|-------|-------|
| Primary (Operator Orange) | `#E77630` |
| Secondary (Amber) | `#F59E0B` |
| Background (Void) | `#050508` |
| Card | `#0c0c0c` |
| Text | `#ffffff` |
| Muted text | `#9ca3af` |
| Border | `rgba(255,255,255,0.05)` |
| Border hover | `rgba(255,255,255,0.1)` |
| Border active | `rgba(231,118,48,0.3)` |

Access tokens programmatically:

```ts
import { designTokens } from "@operatoruplift/ui";
console.log(designTokens.primary); // "#E77630"
```

## Storybook

```bash
npm run dev
# or
npm run storybook
```

Open http://localhost:6006 to browse all components with interactive controls.

## Development

```bash
npm install        # Install dependencies
npm run dev        # Start Storybook
npm run build      # Build library
npm run test       # Run tests
npm run lint       # Type check
```

## Compatibility

- React 18+ and React 19+
- Works in both Next.js (SSR) and Tauri (CSR) environments
- All interactive components are keyboard accessible
- Full TypeScript support with exported types

## License

MIT - see [LICENSE](./LICENSE)
