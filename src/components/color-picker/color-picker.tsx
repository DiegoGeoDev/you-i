import React from "react";
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

const hexColorPattern = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
const hexColorCharPattern = /^[#0-9A-Fa-f]$/;

const allowedKeys = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
  "Home",
  "End",
  "Enter",
  "Control",
];

type ColorPickerValue = string;

type ColorPickerWrapperProps = React.ComponentPropsWithoutRef<typeof Button> & {
  value: ColorPickerValue | null;
  onChange: (value: ColorPickerValue | null) => void;
  placeholder?: string;
};

const ColorPickerWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  ColorPickerWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = "Pick a color",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const isNull = value === null;

    return (
      <ComponentContext.Provider value={{ value, onChange }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              aria-expanded={open}
              data-is-null={isNull}
              className={cn(
                "w-full font-normal data-[is-null=true]:text-muted-foreground",
                className
              )}
              {...props}
            >
              <div className="w-full flex items-center gap-4">
                <span
                  data-is-null={isNull}
                  className={`
                      w-4 h-4 rounded-full border border-muted-foreground 
                      data-[is-null=false]:border-none
                    `}
                  style={{
                    backgroundColor: value || undefined,
                  }}
                />
                {isNull ? placeholder : value}
              </div>
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

  return (
    <HexColorPicker color={value || undefined} onChange={onChange} {...props} />
  );
};

type ColorPickerInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const ColorPickerInput = React.forwardRef<
  HTMLInputElement,
  ColorPickerInputProps
>(({ className, children, ...props }, ref) => {
  const { value, onChange } = useComponentContext();

  // inputValue is only for visual representation.
  const [inputValue, setInputValue] = React.useState(value);
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);

    if (hexColorPattern.test(value)) {
      onChange(value);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !hexColorCharPattern.test(event.key) &&
      !allowedKeys.includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  return (
    <Input
      ref={ref}
      className={cn(className)}
      maxLength={7}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      value={inputValue || ""}
      placeholder="#000000"
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
