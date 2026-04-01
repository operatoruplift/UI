Build the Operator Uplift shared UI component library. Check existing repo first.
Design tokens: #E77630 primary, #F59E0B secondary, #050508 bg, white text on dark
Publish as: @operatoruplift/ui (npm package)
Components:
1. PRIMITIVES — Button (primary/outline/ghost/danger), Badge, Card (default/glass), Input, Toggle, Select, Tooltip, Toast
2. LAYOUT — Sidebar, Header, PageWrapper, Modal
3. DATA — Table, StatCard, ProgressBar, Skeleton, EmptyState
4. AGENT — AgentCard, RiskBadge, SessionIndicator, PermissionChip, ModelSelector, ChatBubble
5. EFFECTS — SpotlightCard, GlowButton, FadeIn, DotGlobe
Setup: Storybook 8, Vitest, tsconfig with declaration files, barrel export from src/index.ts
All components must work in Next.js (SSR) and Tauri (CSR). "use client" where needed.
Tech: React, TypeScript, Tailwind CSS 4
After every change, run `npx tsc --noEmit` and `npm run storybook -- --smoke-test`.
