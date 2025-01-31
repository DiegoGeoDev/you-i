import React from "react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListComponent } from "@/components/list-component";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  PlaceTypeProvider,
  useComponentContext,
  usePlaceType,
} from "./hooks";

type NonEmptyArray<T> = [T, ...T[]];

const placeTypeValues = ["MapPoint", "Address", "Place"] as const;
type PlaceType = (typeof placeTypeValues)[number];
const placeTypeLabels: Record<PlaceType, string> = {
  MapPoint: "Adicionar manualmente",
  Address: "Pesquisar por um endereço",
  Place: "Selecionar um local predefinido",
};

type PointStyle = OlStyle | OlStyle[] | OlStyleFunction;
type PlacePickerAdvancedPointOptions = {
  zIndex: number;
  style?: PointStyle;
};
type PlacePickerAdvancedDrawOptions = {
  style?: PointStyle;
};
type PlacePickerAdvancedToastOptions = {
  title?: string;
  description?: string;
  buttonText?: string;
};

type PlacePickerAdvancedValue = {
  placeID?: string;
  address?: {
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  label?: string;
  x: number;
  y: number;
  placeType: PlaceType;
};

type PlacePickerAdvancedWrapperProps = React.HTMLAttributes<HTMLDivElement> & {
  value: PlacePickerAdvancedValue | null;
  onChange: (value: PlacePickerAdvancedValue | null) => void;
  disabled?: boolean;
  placeTypes: NonEmptyArray<PlaceType>;
  pointOptions: PlacePickerAdvancedPointOptions;
  drawOptions?: PlacePickerAdvancedDrawOptions;
  toastOptions?: PlacePickerAdvancedToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

const PlacePickerAdvanced = React.forwardRef<
  HTMLDivElement,
  PlacePickerAdvancedWrapperProps
>(
  (
    { value, onChange, disabled = false, placeTypes, className, ...props },
    ref
  ) => {
    return (
      <ComponentContext.Provider
        value={{
          value,
          onChange,
          disabled,
        }}
      >
        <PlaceTypeProvider placeTypes={placeTypes}>
          <div
            ref={ref}
            className={cn("flex flex-col gap-2 w-full", className)}
            {...props}
          >
            <PlacePickerAdvancedSelect />
          </div>
        </PlaceTypeProvider>
      </ComponentContext.Provider>
    );
  }
);
PlacePickerAdvanced.displayName = "PlacePickerAdvanced";

type PlacePickerAdvancedSelectProps = React.ComponentPropsWithoutRef<
  typeof Button
>;

const PlacePickerAdvancedSelect = ({
  ...props
}: PlacePickerAdvancedSelectProps) => {
  const { disabled } = useComponentContext();
  const { placeTypes, placeType, handlePlaceType } = usePlaceType();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button variant="outline" className="w-full" {...props}>
          {placeTypeLabels[placeType]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <ListComponent
          data={placeTypes}
          renderItem={(item: PlaceType) => (
            <DropdownMenuItem key={item} onClick={() => handlePlaceType(item)}>
              {placeTypeLabels[item]}
            </DropdownMenuItem>
          )}
        />

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => console.log("clear")}>
          Limpar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export {
  type NonEmptyArray,
  type PlaceType,
  type PlacePickerAdvancedValue,
  type PlacePickerAdvancedPointOptions,
  type PlacePickerAdvancedDrawOptions,
  type PlacePickerAdvancedToastOptions,
};
export { PlacePickerAdvanced };
