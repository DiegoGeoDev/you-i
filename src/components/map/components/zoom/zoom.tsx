import { useRef } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimationOptions } from "ol/View";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useZoom } from "./hooks";

type ZoomProps = AnimationOptions & {
  className?: string;
  orientation?: "vertical" | "horizontal";
};

function Zoom({ className, orientation = "vertical", ...props }: ZoomProps) {
  const zoomControlRef = useRef(null);

  const { zoomControl, currentZoom, handleZoomIn, handleZoomOut } = useZoom({
    element: zoomControlRef.current ?? undefined,
  });

  const maxZoom = zoomControl?.getMap()?.getView().getMaxZoom();
  const minZoom = zoomControl?.getMap()?.getView().getMinZoom();

  return (
    <div
      ref={zoomControlRef}
      data-orientation={orientation}
      className={cn(
        "absolute inset-auto z-10 flex gap-2 w-fit h-fit data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    >
      <Button
        title="zoom in"
        type="button"
        variant="default"
        className="w-8 h-8 p-2"
        disabled={currentZoom === maxZoom}
        onClick={handleZoomIn}
      >
        <Plus size={16} />
        <span className="sr-only">{"zoom in"}</span>
      </Button>
      <Button
        title="zoom out"
        type="button"
        variant="default"
        className="w-8 h-8 p-2"
        disabled={currentZoom === minZoom}
        onClick={handleZoomOut}
      >
        <Minus size={16} />
        <span className="sr-only">{"zoom out"}</span>
      </Button>
    </div>
  );
}

export { type ZoomProps, Zoom };
