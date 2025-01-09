import React, { useState } from "react";
import { Pentagon, X } from "lucide-react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  useComponentContext,
  DrawSinglePolygonProvider,
  useDrawSinglePolygon,
} from "./hooks";

type DrawSinglePolygonValue = OlCoordinate[][];
type DrawSinglePolygonStyle = OlStyle | OlStyle[] | OlStyleFunction;

type DrawSinglePolygonWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  value: DrawSinglePolygonValue | undefined;
  onChange: (value: DrawSinglePolygonValue | undefined) => void;
  disabled?: boolean;
  mapRef: React.MutableRefObject<null>;
  polygonStyle?: DrawSinglePolygonStyle;
  zIndex: number;
  drawStyle?: DrawSinglePolygonStyle;
  toastTitle?: string;
  toastDescription?: string;
  toastButtonText?: string;
};

const DrawSinglePolygonWrapper = React.forwardRef<
  HTMLDivElement,
  DrawSinglePolygonWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      mapRef,
      polygonStyle,
      zIndex,
      drawStyle,
      toastTitle,
      toastDescription,
      toastButtonText,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: DrawSinglePolygonValue | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    return (
      <ComponentContext.Provider
        value={{ value: innerValue, onChange: _onChange, disabled }}
      >
        <DrawSinglePolygonProvider
          mapRef={mapRef}
          polygonStyle={polygonStyle}
          zIndex={zIndex}
          drawStyle={drawStyle}
          toastTitle={toastTitle}
          toastDescription={toastDescription}
          toastButtonText={toastButtonText}
        >
          <div ref={ref} className={cn("flex gap-4", className)} {...props}>
            {children}
          </div>
        </DrawSinglePolygonProvider>
      </ComponentContext.Provider>
    );
  }
);
DrawSinglePolygonWrapper.displayName = "DrawSinglePolygonWrapper";

type DrawSinglePolygonProps = React.HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
};

const DrawSinglePolygon = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePolygonProps
>(({ placeholder, className, children, ...props }, ref) => {
  const { disabled } = useComponentContext();
  const { isActive, handleDrawSinglePolygon } = useDrawSinglePolygon();

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      data-has-placeholder={placeholder !== undefined}
      className={cn("w-full", className)}
      onClick={handleDrawSinglePolygon}
      disabled={disabled || isActive}
      {...props}
    >
      <Pentagon className="data-[has-placeholder=true]:mr-2" size="16" />
      {placeholder !== undefined ? placeholder : null}
    </Button>
  );
});
DrawSinglePolygon.displayName = "DrawSinglePolygon";

type DrawSinglePolygonResetProps = React.HTMLAttributes<HTMLButtonElement>;

const DrawSinglePolygonReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePolygonResetProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled } = useComponentContext();
  const { isActive, handleClearSinglePolygon } = useDrawSinglePolygon();

  const isDisabled = disabled || isActive || value === undefined;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-8 h-8 p-2 rounded-full", className)}
      onClick={handleClearSinglePolygon}
      disabled={isDisabled}
      {...props}
    >
      <X size={16} />
    </Button>
  );
});
DrawSinglePolygonReset.displayName = "DrawSinglePolygonReset";

export { type DrawSinglePolygonValue, type DrawSinglePolygonStyle };
export { DrawSinglePolygonWrapper, DrawSinglePolygon, DrawSinglePolygonReset };
