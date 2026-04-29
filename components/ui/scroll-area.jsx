import * as React from "react";

import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef(({ className, viewportClassName, children, ...props }, ref) => (
  <div ref={ref} className={cn("relative min-h-0 overflow-hidden", className)} {...props}>
    <div className={cn("h-full min-h-0 w-full overflow-y-auto overflow-x-hidden", viewportClassName)}>
      {children}
    </div>
  </div>
));
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
