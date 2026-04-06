# Contributing to @operatoruplift/ui

## Adding a New Component

### 1. Create the component file

```
src/components/MyComponent.tsx
```

- Use `"use client"` directive if the component has interactivity (state, effects, event handlers)
- Accept a `className` prop and merge with `cn()` from `@/lib/utils`
- Use `React.forwardRef` for DOM-wrapping components
- Export the component and its props type

```tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface MyComponentProps {
  variant?: "default" | "primary";
  className?: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = "default",
  className,
  children,
}) => {
  return (
    <div className={cn("rounded-lg border border-white/5 bg-card p-4", className)}>
      {children}
    </div>
  );
};
```

### 2. Create the Storybook story

```
src/components/MyComponent.stories.tsx
```

- Place in the appropriate category: `Primitives/`, `Layout/`, `Data Display/`, `Agent/`, `Effects/`
- Show all variants, sizes, and states
- Add interactive controls via argTypes

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./MyComponent";

const meta: Meta<typeof MyComponent> = {
  title: "Primitives/MyComponent",
  component: MyComponent,
};
export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: { children: "Hello", variant: "default" },
};
```

### 3. Create the test file

```
src/components/MyComponent.test.tsx
```

- Use Vitest + Testing Library
- Test rendering, variants, interactions, and accessibility

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders children", () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText("Hello")).toBeTruthy();
  });
});
```

### 4. Export from the barrel

Add to `src/index.ts`:

```ts
export { MyComponent } from "./components/MyComponent";
export type { MyComponentProps } from "./components/MyComponent";
```

### 5. Verify

```bash
npx tsc --noEmit          # Type check
npx vitest run             # Run tests
npx vite build             # Build bundles
```

## Design Token Reference

Use these tokens in component styles:

| Token | CSS Variable | Tailwind Class | Hex |
|-------|-------------|----------------|-----|
| Primary | `--ou-primary` | `text-primary`, `bg-primary` | `#E77630` |
| Secondary | `--ou-secondary` | `text-secondary`, `bg-secondary` | `#F59E0B` |
| Background | `--ou-background` | `bg-background` | `#050508` |
| Card | `--ou-card` | `bg-card` | `#0c0c0c` |
| Foreground | `--ou-foreground` | `text-foreground` | `#ffffff` |
| Muted foreground | `--ou-muted-foreground` | `text-muted-foreground` | `#9ca3af` |
| Border | `--ou-border` | `border-border` | `rgba(255,255,255,0.05)` |
| Destructive | `--ou-destructive` | `text-destructive`, `bg-destructive` | `#ef4444` |

### Border conventions

- Default: `border-white/5`
- Hover: `border-white/10`
- Active/focus: `border-primary/30`

### Border radius conventions

- Buttons: `rounded-sm`
- Cards: `rounded-lg`
- Modals: `rounded-xl`

### Typography

- Font stack: Inter, system-ui fallbacks
- Use `text-sm` for most UI text
- Use `text-xs` for secondary/meta text
- Use `text-[10px]` for micro labels

## PR Checklist

Before submitting a pull request:

- [ ] Component file created in `src/components/`
- [ ] `"use client"` directive added if component uses state/effects
- [ ] Props interface exported with `Props` suffix
- [ ] `className` prop accepted and merged with `cn()`
- [ ] Storybook story created showing all variants
- [ ] Test file created with meaningful assertions
- [ ] Component exported from `src/index.ts`
- [ ] `npx tsc --noEmit` passes with no new errors
- [ ] `npx vitest run` passes with no failures
- [ ] `npx vite build` succeeds
- [ ] No API keys, secrets, or environment variables in component code
- [ ] Component works in both SSR (Next.js) and CSR (Tauri) environments
- [ ] Interactive elements are keyboard accessible (focus, Enter/Space)
- [ ] Design tokens used instead of hardcoded colors

## Code Style

- Use `class-variance-authority` (CVA) for variant-heavy components
- Use `lucide-react` for icons
- Use `tailwind-merge` via `cn()` for className merging
- Prefer composition over configuration (slots over complex props)
- Keep components focused — one responsibility per file
