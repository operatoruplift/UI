"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ChatBubble, type ChatBubbleProps } from "./ChatBubble";
import { ToolCallCard, type ToolCallCardProps } from "./ToolCallCard";

export type ConversationItem =
  | { type: "message"; props: ChatBubbleProps }
  | { type: "tool_call"; props: ToolCallCardProps };

export interface ConversationThreadProps {
  items: ConversationItem[];
  className?: string;
}

export const ConversationThread: React.FC<ConversationThreadProps> = ({
  items,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => {
        if (item.type === "message") {
          return <ChatBubble key={i} {...item.props} />;
        }
        return <ToolCallCard key={i} {...item.props} />;
      })}
    </div>
  );
};
