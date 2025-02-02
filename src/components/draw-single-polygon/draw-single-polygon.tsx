import React from "react";
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
type PolygonStyle = OlStyle | OlStyle[] | OlStyleFunction;
type DrawSinglePolygonOptions = {
  zIndex: number;
  style?: PolygonStyle;
};
type DrawSinglePolygonDrawOptions = {
  style?: PolygonStyle;
};
type DrawSinglePolygonToastOptions = {
  title?: string;
  description?: string;
  buttonText?: string;
};

type DrawSinglePolygonHTMLDivElement = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
>;
type DrawSinglePolygonWrapperProps = DrawSinglePolygonHTMLDivElement & {
  value: DrawSinglePolygonValue | null;
  onChange: (value: DrawSinglePolygonValue | null) => void;
  disabled?: boolean;
  polygonOptions: DrawSinglePolygonOptions;
  drawOptions?: DrawSinglePolygonDrawOptions;
  toastOptions?: DrawSinglePolygonToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
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
      polygonOptions,
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
        <DrawSinglePolygonProvider
          polygonOptions={polygonOptions}
          drawOptions={drawOptions}
          toastOptions={toastOptions}
          isActive={isActive}
          handleActiveChange={handleActiveChange}
        >
          <div
            ref={ref}
            className={cn("flex gap-2 items-center", className)}
            {...props}
          >
            {children}
          </div>
        </DrawSinglePolygonProvider>
      </ComponentContext.Provider>
    );
  }
);
DrawSinglePolygonWrapper.displayName = "DrawSinglePolygonWrapper";

type DrawSinglePolygonProps = React.ComponentPropsWithoutRef<typeof Button> & {
  placeholder?: string;
};

const DrawSinglePolygon = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePolygonProps
>(({ placeholder, className, children, ...props }, ref) => {
  const { disabled } = useComponentContext();
  const { isActive, handleDrawSinglePolygon } = useDrawSinglePolygon();

  const isDisabled = disabled || isActive;
  const hasPlaceholder = placeholder !== undefined;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleDrawSinglePolygon}
      disabled={isDisabled}
      {...props}
    >
      <Pentagon
        data-has-placeholder={hasPlaceholder}
        className="data-[has-placeholder=true]:mr-2"
        size="16"
      />
      {hasPlaceholder ? placeholder : null}
    </Button>
  );
});
DrawSinglePolygon.displayName = "DrawSinglePolygon";

type DrawSinglePolygonResetProps = React.ComponentPropsWithoutRef<
  typeof Button
>;

const DrawSinglePolygonReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSinglePolygonResetProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled } = useComponentContext();
  const { isActive, handleClearSinglePolygon } = useDrawSinglePolygon();

  const isDisabled = disabled || isActive || value === null;

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

export {
  type DrawSinglePolygonValue,
  type DrawSinglePolygonOptions,
  type DrawSinglePolygonDrawOptions,
  type DrawSinglePolygonToastOptions,
};
export { DrawSinglePolygonWrapper, DrawSinglePolygon, DrawSinglePolygonReset };
