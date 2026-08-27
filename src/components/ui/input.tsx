import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  onFocus,
  onWheel,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "h-11 w-full rounded-sm border border-line bg-bg px-3 font-mono text-sm tabular-nums text-fg outline-none transition-[border-color,box-shadow] duration-150",
        "placeholder:font-sans placeholder:font-normal placeholder:text-subtle",
        "focus:border-accent/40 focus:ring-2 focus:ring-accent/15",
        "disabled:opacity-50",
        className,
      )}
      onFocus={(e) => {
        e.currentTarget.select();
        onFocus?.(e);
      }}
      onWheel={(e) => {
        if (type === "number") e.currentTarget.blur();
        onWheel?.(e);
      }}
      {...props}
    />
  );
}
