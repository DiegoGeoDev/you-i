import React, { useState } from "react";
import { MapPin, X } from "lucide-react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { MapProvider } from "@/components/map";
import {
  MapContainer,
  openStreetMap,
  TileLayer,
} from "@/components/map/components";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  useComponentContext,
  usePlacePickerPoint,
} from "./hooks";

type PlacePickerValue = [number, number];

type PlacePickerWrapperProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: PlacePickerValue | undefined;
  onChange: (value: PlacePickerValue | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  mapId: string;
};

const PlacePickerWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  PlacePickerWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = "Pick a place",
      mapId,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: PlacePickerValue | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    return (
      <ComponentContext.Provider
        value={{ value: innerValue, onChange: _onChange, disabled, mapId }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              aria-expanded={open}
              data-is-undefined={innerValue === undefined}
              data-is-disabled={disabled}
              className={cn(
                `
                w-full justify-start font-normal 
                data-[is-undefined=true]:text-muted-foreground
                data-[is-disabled=true]:text-muted-foreground
                `,
                className
              )}
              {...props}
            >
              <MapPin className="mr-2" size="16" />
              {innerValue !== undefined
                ? `${innerValue[0].toFixed(6)}, ${innerValue[1].toFixed(6)}`
                : placeholder}
            </Button>
          </PopoverTrigger>
          {children}
        </Popover>
      </ComponentContext.Provider>
    );
  }
);
PlacePickerWrapper.displayName = "PlacePickerWrapper";

type PlacePickerContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverContent
>;

const PlacePickerContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  PlacePickerContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className={cn("w-[300px] h-[300px] p-2", className)}
      forceMount={true}
      {...props}
    >
      {children}
    </PopoverContent>
  );
});
PlacePickerContent.displayName = "PlacePickerContent";

type PlacePickerMapProps = {
  pointStyle: OlStyle | OlStyle[] | OlStyleFunction | undefined;
} & React.ComponentPropsWithoutRef<typeof MapContainer>;

const PlacePickerMap = React.forwardRef<
  React.ElementRef<typeof MapContainer>,
  PlacePickerMapProps
>(({ pointStyle, className, children, ...props }, ref) => {
  const { value, mapId } = useComponentContext();

  const zoom = value !== undefined ? 12 : undefined;

  return (
    <MapProvider mapId={mapId} center={value} zoom={zoom}>
      <MapContainer
        ref={ref}
        id={mapId}
        className={cn("[&>div]:rounded-md", className)}
        {...props}
      >
        <TileLayer source={openStreetMap} zIndex={0} />
        <PlacePickerPoint pointStyle={pointStyle} />
      </MapContainer>
    </MapProvider>
  );
});
PlacePickerMap.displayName = "PlacePickerMap";

type PlacePickerPointProps = {
  pointStyle: OlStyle | OlStyle[] | OlStyleFunction | undefined;
};

const PlacePickerPoint = ({ pointStyle }: PlacePickerPointProps) => {
  const { value, onChange, disabled } = useComponentContext();
  const { handleGetPoint } = usePlacePickerPoint({ pointStyle });

  return (
    <span className="absolute inset-4 z-10 flex flex-col gap-2 w-fit h-fit">
      <Button
        type="button"
        className="w-8 h-8 p-2 rounded-full"
        onClick={handleGetPoint}
        disabled={disabled}
      >
        <MapPin size={16} />
      </Button>
      <Button
        type="button"
        className="w-8 h-8 p-2 rounded-full"
        onClick={() => {
          onChange(undefined);
        }}
        disabled={disabled || value === undefined}
      >
        <X size={16} />
      </Button>
    </span>
  );
};

export { type PlacePickerValue };
export { PlacePickerWrapper, PlacePickerContent, PlacePickerMap };
