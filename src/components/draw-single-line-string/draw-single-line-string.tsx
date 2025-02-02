import React from "react";
import { Slash, X } from "lucide-react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  useComponentContext,
  DrawSingleLineStringProvider,
  useDrawSingleLineString,
} from "./hooks";

type DrawSingleLineStringValue = OlCoordinate[];
type LineStringStyle = OlStyle | OlStyle[] | OlStyleFunction;
type DrawSingleLineStringOptions = {
  zIndex: number;
  style?: LineStringStyle;
};
type DrawSingleLineStringDrawOptions = {
  style?: LineStringStyle;
};
type DrawSingleLineStringToastOptions = {
  title?: string;
  description?: string;
  buttonText?: string;
};

type DrawSingleLineStringHTMLDivElement = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
>;
type DrawSingleLineStringWrapperProps = DrawSingleLineStringHTMLDivElement & {
  value: DrawSingleLineStringValue | null;
  onChange: (value: DrawSingleLineStringValue | null) => void;
  disabled?: boolean;
  LineStringOptions: DrawSingleLineStringOptions;
  drawOptions?: DrawSingleLineStringDrawOptions;
  toastOptions?: DrawSingleLineStringToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

const DrawSingleLineStringWrapper = React.forwardRef<
  HTMLDivElement,
  DrawSingleLineStringWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      LineStringOptions,
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
        <DrawSingleLineStringProvider
          LineStringOptions={LineStringOptions}
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
        </DrawSingleLineStringProvider>
      </ComponentContext.Provider>
    );
  }
);
DrawSingleLineStringWrapper.displayName = "DrawSingleLineStringWrapper";

type DrawSingleLineStringProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  placeholder?: string;
};

const DrawSingleLineString = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSingleLineStringProps
>(({ placeholder, className, children, ...props }, ref) => {
  const { disabled } = useComponentContext();
  const { isActive, handleDrawSingleLineString } = useDrawSingleLineString();

  const isDisabled = disabled || isActive;
  const hasPlaceholder = placeholder !== undefined;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-full", className)}
      onClick={handleDrawSingleLineString}
      disabled={isDisabled}
      {...props}
    >
      <Slash
        data-has-placeholder={hasPlaceholder}
        className="data-[has-placeholder=true]:mr-2"
        size="16"
      />
      {hasPlaceholder ? placeholder : null}
    </Button>
  );
});
DrawSingleLineString.displayName = "DrawSingleLineString";

type DrawSingleLineStringResetProps = React.ComponentPropsWithoutRef<
  typeof Button
>;

const DrawSingleLineStringReset = React.forwardRef<
  React.ElementRef<typeof Button>,
  DrawSingleLineStringResetProps
>(({ className, children, ...props }, ref) => {
  const { value, disabled } = useComponentContext();
  const { isActive, handleClearSingleLineString } = useDrawSingleLineString();

  const isDisabled = disabled || isActive || value === null;

  return (
    <Button
      ref={ref}
      type="button"
      variant="outline"
      className={cn("w-8 h-8 p-2 rounded-full", className)}
      onClick={handleClearSingleLineString}
      disabled={isDisabled}
      {...props}
    >
      <X size={16} />
    </Button>
  );
});
DrawSingleLineStringReset.displayName = "DrawSingleLineStringReset";

export {
  type DrawSingleLineStringValue,
  type DrawSingleLineStringOptions,
  type DrawSingleLineStringDrawOptions,
  type DrawSingleLineStringToastOptions,
};
export {
  DrawSingleLineStringWrapper,
  DrawSingleLineString,
  DrawSingleLineStringReset,
};
