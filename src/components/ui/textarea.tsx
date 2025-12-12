import * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "./scroll-area"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number
  minRows?: number
  direction?: 'top' | 'bottom'
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, maxRows = 10, minRows = 1, direction = 'bottom', ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement | null>(null)

    // Combine refs using callback
    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node
        }
      },
      [ref]
    )

    React.useEffect(() => {
      const textarea = internalRef.current
      if (!textarea) return

      const adjustHeight = () => {
        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = "auto"

        // Let textarea grow to its natural height (no limit)
        const scrollHeight = textarea.scrollHeight
        textarea.style.height = `${scrollHeight}px`
        textarea.style.overflowY = "hidden" // Let ScrollArea handle scrolling
      }

      // Adjust height on mount and when value changes
      adjustHeight()

      // Also adjust on input events
      textarea.addEventListener("input", adjustHeight)
      // Adjust on window resize in case font size changes
      window.addEventListener("resize", adjustHeight)

      return () => {
        textarea.removeEventListener("input", adjustHeight)
        window.removeEventListener("resize", adjustHeight)
      }
    }, [maxRows, props.value, direction])

    // Calculate max height for ScrollArea based on maxRows
    const [maxHeight, setMaxHeight] = React.useState<number>(0)

    React.useEffect(() => {
      const textarea = internalRef.current
      if (!textarea) return

      // Wait for textarea to be rendered
      const calculateMaxHeight = () => {
        const computedStyle = window.getComputedStyle(textarea)
        const lineHeight = parseFloat(computedStyle.lineHeight) || 20
        const paddingTop = parseFloat(computedStyle.paddingTop) || 8
        const paddingBottom = parseFloat(computedStyle.paddingBottom) || 8
        const padding = paddingTop + paddingBottom

        // Calculate max height for maxRows
        setMaxHeight((lineHeight * maxRows) + padding)
      }

      // Calculate after a small delay to ensure styles are applied
      const timeoutId = setTimeout(calculateMaxHeight, 0)
      return () => clearTimeout(timeoutId)
    }, [maxRows])

    return (
      <ScrollArea
        className={cn(
          "w-full  scrollbar-hide",

        )}
        style={{
          maxHeight: maxHeight > 0 ? `${maxHeight}px` : undefined,
          overflow: 'auto',
        }}
      >
        <textarea
          className={cn(
            "flex w-full rounded-md  bg-foreground/5 text-foreground px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
            className
          )}
          ref={setRefs}
          rows={minRows}
          style={{
            ...props.style,
          }}
          {...props}
        />
      </ScrollArea>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }

