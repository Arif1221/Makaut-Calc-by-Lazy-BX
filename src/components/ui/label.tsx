import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "block text-micro font-medium uppercase tracking-widest text-subtle",
        className,
      )}
      {...props}
    />
  );
}
