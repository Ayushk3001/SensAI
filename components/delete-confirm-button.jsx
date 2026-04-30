"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmButton({
  children,
  title = "Are you sure you want to delete?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  buttonProps = {},
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        {...buttonProps}
        onPointerDown={(event) => {
          event.preventDefault();
          event.stopPropagation();
          buttonProps.onPointerDown?.(event);
        }}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
          buttonProps.onClick?.(event);
        }}
      >
        {children}
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="border-border bg-card text-card-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border bg-transparent text-card-foreground hover:bg-muted">
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-primary-foreground hover:bg-red-700"
              onClick={(event) => {
                event.preventDefault();
                setOpen(false);
                onConfirm?.();
              }}
            >
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
