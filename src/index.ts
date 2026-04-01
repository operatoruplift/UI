// Utilities
export { cn } from "./lib/utils";

// Design tokens
export { designTokens, upliftPreset } from "./tailwind-preset";

// Hooks
export { useLocalStorage } from "./hooks/useLocalStorage";
export { useMediaQuery, useIsMobile, useIsTablet, useIsDesktop } from "./hooks/useMediaQuery";
export { useDebounce, useDebouncedCallback } from "./hooks/useDebounce";
export { useClipboard } from "./hooks/useClipboard";
export type { UseClipboardOptions } from "./hooks/useClipboard";
export { useKeyboard, useHotkey } from "./hooks/useKeyboard";
export type { KeyCombo, KeyboardShortcut } from "./hooks/useKeyboard";
export { useOnClickOutside } from "./hooks/useOnClickOutside";
export { useStreamingText } from "./hooks/useStreamingText";
export type { UseStreamingTextOptions } from "./hooks/useStreamingText";
export { useCostTracker } from "./hooks/useCostTracker";
export type { TokenUsage, CostRate, UseCostTrackerOptions } from "./hooks/useCostTracker";

// Memory system hooks
export { useMemory } from "./hooks/memory";
export type { UseMemoryOptions } from "./hooks/memory";
export { useMemoryConsolidation } from "./hooks/memory";
export type { UseMemoryConsolidationOptions } from "./hooks/memory";
export { createLocalStorageAdapter } from "./hooks/memory";
export type {
  MemoryType,
  MemoryEntry,
  MemoryTopicFile,
  MemoryIndex,
  MemorySearchResult,
  ConsolidationAction,
  MemoryStorageAdapter,
} from "./hooks/memory";

// Primitives
export { Button, buttonVariants } from "./components/Button";
export type { ButtonProps } from "./components/Button";

export { Badge, badgeVariants } from "./components/Badge";
export type { BadgeProps } from "./components/Badge";

export { Card, CardHeader, CardTitle, CardContent, CardFooter, cardVariants } from "./components/Card";
export type { CardProps } from "./components/Card";

export { Input } from "./components/Input";
export type { InputProps } from "./components/Input";

export { Textarea } from "./components/Textarea";
export type { TextareaProps } from "./components/Textarea";

export { Toggle } from "./components/Toggle";
export type { ToggleProps } from "./components/Toggle";

export { Select } from "./components/Select";
export type { SelectOption, SelectProps } from "./components/Select";

export { Tooltip } from "./components/Tooltip";
export type { TooltipProps } from "./components/Tooltip";

export { ToastProvider, useToast } from "./components/Toast";
export type { ToastData, ToastVariant } from "./components/Toast";

export { Alert } from "./components/Alert";
export type { AlertProps } from "./components/Alert";

export { Avatar } from "./components/Avatar";
export type { AvatarProps } from "./components/Avatar";

export { AvatarGroup } from "./components/AvatarGroup";
export type { AvatarGroupProps } from "./components/AvatarGroup";

export { Dropdown } from "./components/Dropdown";
export type { DropdownProps, DropdownItem } from "./components/Dropdown";

export { Tabs } from "./components/Tabs";
export type { TabsProps, Tab } from "./components/Tabs";

export { Breadcrumb } from "./components/Breadcrumb";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/Breadcrumb";

export { Kbd, Shortcut } from "./components/Kbd";
export type { KbdProps } from "./components/Kbd";

export { Divider } from "./components/Divider";
export type { DividerProps } from "./components/Divider";

export { LoadingSpinner } from "./components/LoadingSpinner";
export type { LoadingSpinnerProps } from "./components/LoadingSpinner";

export { CopyButton } from "./components/CopyButton";
export type { CopyButtonProps } from "./components/CopyButton";

// Layout
export { Sidebar } from "./components/Sidebar";
export type { SidebarProps, SidebarSection, SidebarNavItem } from "./components/Sidebar";

export { Header } from "./components/Header";
export type { HeaderProps, HeaderNavLink } from "./components/Header";

export { PageWrapper } from "./components/PageWrapper";
export type { PageWrapperProps } from "./components/PageWrapper";

export { Modal } from "./components/Modal";
export type { ModalProps } from "./components/Modal";

export { CommandPalette } from "./components/CommandPalette";
export type { CommandPaletteProps, CommandItem } from "./components/CommandPalette";

// Data Display
export { Table } from "./components/Table";
export type { TableProps, TableColumn } from "./components/Table";

export { StatCard } from "./components/StatCard";
export type { StatCardProps } from "./components/StatCard";

export { ProgressBar } from "./components/ProgressBar";
export type { ProgressBarProps } from "./components/ProgressBar";

export { Skeleton } from "./components/Skeleton";
export type { SkeletonProps } from "./components/Skeleton";

export { EmptyState } from "./components/EmptyState";
export type { EmptyStateProps } from "./components/EmptyState";

export { CodeBlock } from "./components/CodeBlock";
export type { CodeBlockProps } from "./components/CodeBlock";

export { StatusDot } from "./components/StatusDot";
export type { StatusDotProps, StatusDotStatus } from "./components/StatusDot";

export { TokenCounter } from "./components/TokenCounter";
export type { TokenCounterProps } from "./components/TokenCounter";

export { CostDisplay } from "./components/CostDisplay";
export type { CostDisplayProps } from "./components/CostDisplay";

export { StreamingText } from "./components/StreamingText";
export type { StreamingTextProps } from "./components/StreamingText";

// Agent-specific
export { AgentCard } from "./components/AgentCard";
export type { AgentCardProps, AgentStatus } from "./components/AgentCard";

export { RiskBadge } from "./components/RiskBadge";
export type { RiskBadgeProps, RiskGrade } from "./components/RiskBadge";

export { SessionIndicator } from "./components/SessionIndicator";
export type { SessionIndicatorProps } from "./components/SessionIndicator";

export { PermissionChip } from "./components/PermissionChip";
export type { PermissionChipProps } from "./components/PermissionChip";

export { ModelSelector } from "./components/ModelSelector";
export type { ModelSelectorProps, ModelOption } from "./components/ModelSelector";

export { ChatBubble } from "./components/ChatBubble";
export type { ChatBubbleProps } from "./components/ChatBubble";

export { ToolCallCard } from "./components/ToolCallCard";
export type { ToolCallCardProps, ToolCallStatus } from "./components/ToolCallCard";

export { ConversationThread } from "./components/ConversationThread";
export type { ConversationThreadProps, ConversationItem } from "./components/ConversationThread";

export { MemoryCard } from "./components/MemoryCard";
export type { MemoryCardProps } from "./components/MemoryCard";

export { MemoryPanel } from "./components/MemoryPanel";
export type { MemoryPanelProps } from "./components/MemoryPanel";

// Providers
export { ThemeProvider, useTheme } from "./components/ThemeProvider";
export type { Theme, ThemeProviderProps } from "./components/ThemeProvider";

// Effects
export { SpotlightCard } from "./components/SpotlightCard";
export type { SpotlightCardProps } from "./components/SpotlightCard";

export { GlowButton } from "./components/GlowButton";
export type { GlowButtonProps } from "./components/GlowButton";

export { FadeIn } from "./components/FadeIn";
export type { FadeInProps } from "./components/FadeIn";

export { DotGlobe } from "./components/DotGlobe";
export type { DotGlobeProps } from "./components/DotGlobe";
