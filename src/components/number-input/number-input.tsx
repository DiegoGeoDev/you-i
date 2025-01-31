import React from "react";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

const numberCharPattern = /^-?\d*\.?\d*$/;

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

type NumberInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  onChange: (value: string) => void;
};

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, className, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onChange(value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !numberCharPattern.test(event.key) &&
        !allowedKeys.includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    return (
      <Input
        ref={ref}
        className={cn(className)}
        type="text"
        inputMode="numeric"
        pattern="-?[0-9]*\.?[0-9]*"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter a number"
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
