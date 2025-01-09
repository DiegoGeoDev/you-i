import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";

import { ComponentContext, useComponentContext } from "./hooks";

type TimePickerValue = {
  hours: string;
  minutes: string;
  period: "AM" | "PM";
};

type TimePickerWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  value: TimePickerValue | undefined;
  onChange: (value: TimePickerValue | undefined) => void;
  disabled?: boolean;
};

const TimePickerWrapper = React.forwardRef<
  HTMLDivElement,
  TimePickerWrapperProps
>(
  (
    { value, onChange, disabled = false, children, className, ...props },
    ref
  ) => {
    return (
      <ComponentContext.Provider value={{ value, onChange, disabled }}>
        <div ref={ref} className={cn("flex space-x-2", className)} {...props}>
          {children}
        </div>
      </ComponentContext.Provider>
    );
  }
);
TimePickerWrapper.displayName = "TimePickerWrapper";

type TimePickerSelectProps = React.ComponentPropsWithoutRef<
  typeof SelectTrigger
>;

const TimePickerHours = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  TimePickerSelectProps
>(({ className, ...props }, ref) => {
  const { value, onChange, disabled } = useComponentContext();

  return (
    <Select
      value={value?.hours || ""}
      onValueChange={(newHours) =>
        onChange({ ...(value as TimePickerValue), hours: newHours })
      }
      disabled={disabled}
    >
      <SelectTrigger ref={ref} className={cn("w-[80px]", className)} {...props}>
        <SelectValue placeholder="--" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
          <SelectItem key={hour} value={hour.toString().padStart(2, "0")}>
            {hour.toString().padStart(2, "0")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
TimePickerHours.displayName = "TimePickerHours";

const TimePickerMinutes = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  TimePickerSelectProps
>(({ className, ...props }, ref) => {
  const { value, onChange, disabled } = useComponentContext();

  return (
    <Select
      value={value?.minutes || ""}
      onValueChange={(newMinutes) =>
        onChange({ ...(value as TimePickerValue), minutes: newMinutes })
      }
      disabled={disabled}
    >
      <SelectTrigger ref={ref} className={cn("w-[80px]", className)} {...props}>
        <SelectValue placeholder="--" />
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
          <SelectItem key={minute} value={minute.toString().padStart(2, "0")}>
            {minute.toString().padStart(2, "0")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
});
TimePickerMinutes.displayName = "TimePickerMinutes";

const TimePickerPeriod = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  TimePickerSelectProps
>(({ className, ...props }, ref) => {
  const { value, onChange, disabled } = useComponentContext();

  return (
    <Select
      value={value?.period || ""}
      onValueChange={(newPeriod) =>
        onChange({
          ...(value as TimePickerValue),
          period: newPeriod as "AM" | "PM",
        })
      }
      disabled={disabled}
    >
      <SelectTrigger ref={ref} className={cn("w-[80px]", className)} {...props}>
        <SelectValue placeholder="--" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="AM">AM</SelectItem>
        <SelectItem value="PM">PM</SelectItem>
      </SelectContent>
    </Select>
  );
});
TimePickerPeriod.displayName = "TimePickerPeriod";

export { type TimePickerValue };
export {
  TimePickerWrapper,
  TimePickerHours,
  TimePickerMinutes,
  TimePickerPeriod,
};
