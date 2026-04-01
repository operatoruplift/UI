import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, type AvatarProps } from "./Avatar";

export interface AvatarGroupProps {
  avatars: AvatarProps[];
  max?: number;
  size?: AvatarProps["size"];
  className?: string;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 5,
  size = "sm",
  className,
}) => {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visible.map((avatar, i) => (
        <div key={i} className="ring-2 ring-background rounded-full">
          <Avatar {...avatar} size={size} />
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "ring-2 ring-background rounded-full inline-flex items-center justify-center bg-white/10 text-gray-300 font-medium",
            size === "xs" && "h-6 w-6 text-[9px]",
            size === "sm" && "h-8 w-8 text-[10px]",
            size === "md" && "h-10 w-10 text-xs",
            size === "lg" && "h-12 w-12 text-sm",
            size === "xl" && "h-16 w-16 text-base",
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};
