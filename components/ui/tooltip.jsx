"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function TooltipProvider({ children }) {
  return children;
}

function Tooltip({ children }) {
  return <span className="group/tooltip relative inline-flex">{children}</span>;
}

function TooltipTrigger({ children, asChild = false, ...props }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, props);
  }

  return <span {...props}>{children}</span>;
}

function TooltipContent({ className, side = "top", children, ...props }) {
  return (
    <span
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground opacity-0 shadow-md transition-all duration-150 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100",
        side === "bottom" && "left-1/2 top-full mt-2 -translate-x-1/2",
        side === "top" && "bottom-full left-1/2 mb-2 -translate-x-1/2",
        side === "left" && "right-full top-1/2 mr-2 -translate-y-1/2",
        side === "right" && "left-full top-1/2 ml-2 -translate-y-1/2",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
