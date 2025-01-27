import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

type RangeSliderValue = number[];

type RangeSliderProps = Omit<
  React.ComponentProps<typeof SliderPrimitive.Root>,
  "value" | "onChange"
> & {
  value: RangeSliderValue;
  labelPosition?: "top" | "bottom" | "left" | "right";
  label?: (value: number | undefined) => React.ReactNode;
};

const RangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  RangeSliderProps
>(({ value, className, label, labelPosition = "top", ...props }, ref) => {
  const initialValue = Array.isArray(value) ? value : [props.min, props.max];

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        "data-[orientation=vertical]:flex-col",
        "data-[orientation=vertical]:w-full",
        "data-[orientation=vertical]:h-full",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        className={cn(
          "relative h-2 w-full grow overflow-hidden rounded-full bg-secondary",
          "data-[orientation=vertical]:w-2"
        )}
      >
        <SliderPrimitive.Range
          className={cn(
            "absolute h-full bg-primary",
            "data-[orientation=vertical]:w-full",
            "data-[orientation=vertical]:h-auto"
          )}
        />
      </SliderPrimitive.Track>
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            {label && (
              <span
                data-label-position={labelPosition}
                className={cn(
                  "absolute flex w-full justify-center -top-7",
                  "data-[label-position=bottom]:top-4",
                  "data-[label-position=left]:-top-1 data-[label-position=left]:right-6",
                  "data-[label-position=right]:-top-1 data-[label-position=right]:left-6"
                )}
              >
                {label(value)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});
RangeSlider.displayName = "RangeSlider";

export { RangeSlider };
