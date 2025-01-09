import * as React from "react";

import { cn } from "@/lib/utils";

type MapContainerProps = React.InputHTMLAttributes<HTMLDivElement> & {};

const MapContainer = React.forwardRef<HTMLDivElement, MapContainerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("relative w-full h-full", className)}
        {...props}
      />
    );
  }
);
MapContainer.displayName = "MapContainer";

export { type MapContainerProps, MapContainer };
