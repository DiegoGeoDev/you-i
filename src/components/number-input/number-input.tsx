import React, { ChangeEvent, InputHTMLAttributes, useState } from "react";

import { Input } from "@/components/ui/input";

const allowedKeys = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
  "Home",
  "End",
  "Enter",
];

type NumberInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  onChange: (value: string) => void;
};

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, ...props }, ref) => {
    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: string) {
      onChange(value);
      setInnerValue(value);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (/^-?\d*\.?\d*$/.test(value)) {
        _onChange(value);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        !/^-?\d*\.?\d*$/.test(event.key) &&
        !allowedKeys.includes(event.key)
      ) {
        event.preventDefault();
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        pattern="-?[0-9]*\.?[0-9]*"
        value={innerValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);
NumberInput.displayName = "NumberInput";

export { NumberInput };
