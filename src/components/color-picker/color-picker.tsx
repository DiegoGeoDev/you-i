import React, { InputHTMLAttributes, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { ComponentContext, useComponentContext } from "./hooks";

type ColorPickerValue = string;

type ColorPickerWrapperProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: ColorPickerValue | undefined;
  onChange: (value: ColorPickerValue | undefined) => void;
  disabled?: boolean;
};

const ColorPickerWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  ColorPickerWrapperProps
>(
  (
    { value, onChange, disabled = false, className, children, ...props },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: ColorPickerValue | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    return (
      <ComponentContext.Provider
        value={{ value: innerValue, onChange: _onChange }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              type="button"
              size="icon"
              variant="outline"
              aria-expanded={open}
              data-is-undefined={innerValue === undefined}
              className={cn("block", className)}
              style={{
                backgroundColor: innerValue,
              }}
              {...props}
            >
              <div />
            </Button>
          </PopoverTrigger>
          {children}
        </Popover>
      </ComponentContext.Provider>
    );
  }
);
ColorPickerWrapper.displayName = "ColorPickerWrapper";

type ColorPickerContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverContent
>;

const ColorPickerContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  ColorPickerContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className={cn("w-full flex flex-col gap-4", className)}
      forceMount={true}
      {...props}
    >
      {children}
    </PopoverContent>
  );
});
ColorPickerContent.displayName = "ColorPickerContent";

type ColorPickerProps = React.ComponentPropsWithoutRef<typeof HexColorPicker>;

const ColorPicker = ({ className, children, ...props }: ColorPickerProps) => {
  const { value, onChange } = useComponentContext();

  return <HexColorPicker color={value} onChange={onChange} {...props} />;
};

type ColorPickerInputProps = InputHTMLAttributes<HTMLInputElement>;

const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  ColorPickerInputProps
>(({ className, children, ...props }, ref) => {
  const { value, onChange } = useComponentContext();

  return (
    <Input
      ref={ref}
      maxLength={7}
      onChange={(e) => onChange(e?.currentTarget?.value)}
      value={value}
      {...props}
    />
  );
});
ColorPickerInput.displayName = "ColorPickerInput";

export { type ColorPickerValue };
export {
  ColorPickerWrapper,
  ColorPickerContent,
  ColorPicker,
  ColorPickerInput,
};
