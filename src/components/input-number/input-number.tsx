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

type InputNumberProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "onChange"
> & {
  onChange: (value: string | undefined) => void;
};

const InputNumber = React.forwardRef<HTMLInputElement, InputNumberProps>(
  ({ value, onChange, ...props }, ref) => {
    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: string | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value === undefined || value === "") {
        _onChange(undefined);
        return;
      }

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
InputNumber.displayName = "InputNumber";

export { InputNumber };
