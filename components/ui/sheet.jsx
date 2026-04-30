"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const Sheet = Dialog;
const SheetTrigger = DialogTrigger;
const SheetHeader = DialogHeader;
const SheetTitle = DialogTitle;
const SheetDescription = DialogDescription;

const SheetContent = React.forwardRef(({ className, side = "right", ...props }, ref) => (
  <DialogContent
    ref={ref}
    className={cn(
      "fixed max-h-screen gap-4 overflow-y-auto border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl",
      side === "right" && "inset-y-0 right-0 left-auto h-full w-[90vw] max-w-md rounded-none border-l",
      side === "left" && "inset-y-0 left-0 right-auto h-full w-[90vw] max-w-md rounded-none border-r",
      side === "top" && "inset-x-0 top-0 bottom-auto max-w-none rounded-none border-b",
      side === "bottom" && "inset-x-0 bottom-0 top-auto max-w-none rounded-none border-t",
      className
    )}
    {...props}
  />
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription };
