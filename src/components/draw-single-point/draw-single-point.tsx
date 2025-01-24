import React from "react";
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
type DrawSinglePointOptions = {
  zIndex: number;
  style?: PointStyle;
};
type DrawSinglePointDrawOptions = {
  style?: PointStyle;
};
type DrawSinglePointToastOptions = {
  title?: string;
  description?: string;
  buttonText?: string;
};

type DrawSinglePointHTMLDivElement = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
>;
type DrawSinglePointWrapperProps = DrawSinglePointHTMLDivElement & {
  value: DrawSinglePointValue | null;
  onChange: (value: DrawSinglePointValue | null) => void;
  disabled?: boolean;
  pointOptions: DrawSinglePointOptions;
  drawOptions?: DrawSinglePointDrawOptions;
  toastOptions?: DrawSinglePointToastOptions;
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
    return (
      <ComponentContext.Provider value={{ value, onChange, disabled }}>
        <DrawSinglePointProvider
          pointOptions={pointOptions}
          drawOptions={drawOptions}
          toastOptions={toastOptions}
          isActive={isActive}
          handleActiveChange={handleActiveChange}
        >
          <div
            ref={ref}
            className={cn("flex items-center gap-4", className)}
            {...props}
          >
            {children}
          </div>
        </DrawSinglePointProvider>
      </ComponentContext.Provider>
    );
  }
);
DrawSinglePointWrapper.displayName = "DrawSinglePointWrapper";

type DrawSinglePointProps = React.ComponentPropsWithoutRef<typeof Button> & {
  placeholder?: string;
};

const DrawSinglePoint = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePointProps
>(({ placeholder, className, children, ...props }, ref) => {
  const { disabled } = useComponentContext();
  const { isActive, handleDrawSinglePoint } = useDrawSinglePoint();

  const isDisabled = disabled || isActive;
  const hasPlaceholder = placeholder !== undefined;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleDrawSinglePoint}
      disabled={isDisabled}
      {...props}
    >
      <MapPin
        data-has-placeholder={hasPlaceholder}
        className="data-[has-placeholder=true]:mr-2"
        size="16"
      />
      {hasPlaceholder ? placeholder : undefined}
    </Button>
  );
});
DrawSinglePoint.displayName = "DrawSinglePoint";

type DrawSinglePointResetProps = React.ComponentPropsWithoutRef<typeof Button>;

const DrawSinglePointReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePointResetProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled } = useComponentContext();
  const { isActive, handleClearSinglePoint } = useDrawSinglePoint();

  const isDisabled = disabled || isActive || value === null;

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
  type DrawSinglePointOptions,
  type DrawSinglePointDrawOptions,
  type DrawSinglePointToastOptions,
};
export { DrawSinglePointWrapper, DrawSinglePoint, DrawSinglePointReset };
