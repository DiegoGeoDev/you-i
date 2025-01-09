import React, { useState } from "react";
import { MapPin, X } from "lucide-react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  useComponentContext,
  DrawSinglePointProvider,
  useDrawSinglePoint,
} from "./hooks";

type DrawSinglePointValue = OlCoordinate;
type PointStyle = OlStyle | OlStyle[] | OlStyleFunction;
type PointOptions = {
  zIndex: number;
  style?: PointStyle;
};
type DrawOptions = {
  style?: PointStyle;
};
type ToastOptions = {
  title?: string;
  description?: string;
  buttonText?: string;
};

type DrawSinglePointWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  value: DrawSinglePointValue | undefined;
  onChange: (value: DrawSinglePointValue | undefined) => void;
  disabled?: boolean;
  pointOptions: PointOptions;
  drawOptions?: DrawOptions;
  toastOptions?: ToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

const DrawSinglePointWrapper = React.forwardRef<
  HTMLDivElement,
  DrawSinglePointWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      pointOptions,
      drawOptions,
      toastOptions,
      isActive,
      handleActiveChange,
      children,
      className,
      ...props
    },
    ref
  ) => {
    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: DrawSinglePointValue | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    return (
      <ComponentContext.Provider
        value={{ value: innerValue, onChange: _onChange, disabled }}
      >
        <DrawSinglePointProvider
          pointOptions={pointOptions}
          drawOptions={drawOptions}
          toastOptions={toastOptions}
          isActive={isActive}
          handleActiveChange={handleActiveChange}
        >
          <div ref={ref} className={cn("flex gap-4", className)} {...props}>
            {children}
          </div>
        </DrawSinglePointProvider>
      </ComponentContext.Provider>
    );
  }
);
DrawSinglePointWrapper.displayName = "DrawSinglePointWrapper";

type DrawSinglePointProps = React.HTMLAttributes<HTMLButtonElement> & {
  placeholder?: string;
};

const DrawSinglePoint = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePointProps
>(({ placeholder, className, children, ...props }, ref) => {
  const { disabled } = useComponentContext();
  const { isActive, handleDrawSinglePoint } = useDrawSinglePoint();

  const isDisabled = disabled || isActive;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      data-has-placeholder={placeholder !== undefined}
      className={cn("w-full", className)}
      onClick={handleDrawSinglePoint}
      disabled={isDisabled}
      {...props}
    >
      <MapPin className="data-[has-placeholder=true]:mr-2" size="16" />
      {placeholder !== undefined ? placeholder : null}
    </Button>
  );
});
DrawSinglePoint.displayName = "DrawSinglePoint";

type DrawSinglePointResetProps = React.HTMLAttributes<HTMLButtonElement>;

const DrawSinglePointReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePointResetProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled } = useComponentContext();
  const { isActive, handleClearSinglePoint } = useDrawSinglePoint();

  const isDisabled = disabled || isActive || value === undefined;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-8 h-8 p-2 rounded-full", className)}
      onClick={handleClearSinglePoint}
      disabled={isDisabled}
      {...props}
    >
      <X size={16} />
    </Button>
  );
});
DrawSinglePointReset.displayName = "DrawSinglePointReset";

export {
  type DrawSinglePointValue,
  type PointOptions,
  type DrawOptions,
  type ToastOptions,
};
export { DrawSinglePointWrapper, DrawSinglePoint, DrawSinglePointReset };
