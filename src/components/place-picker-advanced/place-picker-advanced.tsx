import React from "react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListComponent } from "@/components/list-component";

import {
  ComboboxCommand,
  ComboboxContent,
  ComboboxWrapper,
  SearchAddressCommand,
  SearchAddressContent,
  SearchAddressWrapper,
} from "@/components";

import { useMap } from "@/components/map";

import { cn } from "@/lib/utils";

import { ComponentContext, useComponentContext } from "./hooks";
import { PlacePickerAdvancedPoint as PlacePickerAdvancedPointClass } from "./utils";

type NonEmptyArray<T> = [T, ...T[]];

const placeTypeValues = ["MapPoint", "Address", "Place"] as const;
type PlaceType = (typeof placeTypeValues)[number];

type PointStyle = OlStyle | OlStyle[] | OlStyleFunction;
type PlacePickerAdvancedPointOptions = {
  zIndex: number;
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

type PlacePickerAdvancedWrapperProps = Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "value" | "onChange" | "children"
> & {
  value: PlacePickerAdvancedValue | null;
  onChange: (value: PlacePickerAdvancedValue | null) => void;
  children: React.ReactElement | React.ReactElement[];
  disabled?: boolean;
  pointOptions: PlacePickerAdvancedPointOptions;
};

const PlacePickerAdvancedWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  PlacePickerAdvancedWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      pointOptions,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isArray = Array.isArray(children);
    const childArray = isArray ? children : [children];

    const [selectedComponent, setSelectedComponent] =
      React.useState<React.ReactNode>(() => {
        if (value === null) {
          const component = childArray[0];
          return component;
        }

        const component = childArray.find(
          (child) => child.props.placeType === value.placeType
        );
        return component;
      });

    const handleSelectedComponent = (placeType: PlaceType) => {
      const component = childArray.find(
        (child) => child.props.placeType === placeType
      );
      setSelectedComponent(component);
    };

    return (
      <ComponentContext.Provider
        value={{
          value,
          onChange,
          disabled,
        }}
      >
        <div className="flex gap-2 items-center">
          {selectedComponent}

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
              <Button
                ref={ref}
                type="button"
                size={"icon"}
                variant="outline"
                data-is-array={isArray}
                className={cn(
                  "w-8 h-8 p-2 rounded-full data-[is-array=false]:hidden",
                  className
                )}
                {...props}
              >
                <EllipsisVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <ListComponent
                data={childArray}
                renderItem={(item: React.ReactElement) => (
                  <DropdownMenuItem
                    key={item.props.placeType}
                    onClick={() =>
                      handleSelectedComponent(item.props.placeType as PlaceType)
                    }
                  >
                    {item.props.placeholder}
                  </DropdownMenuItem>
                )}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <PlacePickerAdvancedPoint pointOptions={pointOptions} />
      </ComponentContext.Provider>
    );
  }
);
PlacePickerAdvancedWrapper.displayName = "PlacePickerAdvancedWrapper";

type PlacePickerAdvancedMapPointProps = {
  placeType: "MapPoint";
  placeholder?: string;
};

const PlacePickerAdvancedMapPoint = ({
  placeType,
  placeholder = "Adicionar manualmente",
}: PlacePickerAdvancedMapPointProps) => {
  const { value, disabled } = useComponentContext();

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full justify-start font-normal",
        "data-[is-null=true]:text-muted-foreground",
        "data-[is-disabled=true]:text-muted-foreground"
      )}
      onClick={() => {}}
      disabled={disabled}
      data-is-null={value === null}
    >
      {value !== null
        ? `X: ${value.x.toFixed(6)}, Y: ${value.y.toFixed(6)}`
        : placeholder}
    </Button>
  );
};

type PlacePickerAdvancedAddressProps = {
  placeType: "Address";
  placeholder?: string;
};

const PlacePickerAdvancedAddress = ({
  placeType,
  placeholder = "Pesquisar por um endereço",
}: PlacePickerAdvancedAddressProps) => {
  const { value, disabled } = useComponentContext();

  return (
    <SearchAddressWrapper
      value={null}
      onChange={() => {}}
      placeholder={placeholder}
      disabled={disabled}
    >
      <SearchAddressContent>
        <SearchAddressCommand
          placeholder="Pesquisar"
          emptyText="Nenhum resultado encontrado"
        />
      </SearchAddressContent>
    </SearchAddressWrapper>
  );
};

type PlacePickerAdvancedPlaceProps = {
  placeType: "Place";
  placeholder?: string;
};

const PlacePickerAdvancedPlace = ({
  placeType,
  placeholder = "Selecionar um local predefinido",
}: PlacePickerAdvancedPlaceProps) => {
  const { value, disabled } = useComponentContext();

  return (
    <ComboboxWrapper
      value={null}
      onChange={() => {}}
      items={[]}
      placeholder={placeholder}
      disabled={disabled}
    >
      <ComboboxContent>
        <ComboboxCommand
          placeholder="Pesquisar"
          emptyText="Nenhum resultado encontrado"
        />
      </ComboboxContent>
    </ComboboxWrapper>
  );
};

type PlacePickerAdvancedPointProps = {
  pointOptions: PlacePickerAdvancedPointOptions;
};

const PlacePickerAdvancedPoint = ({
  pointOptions,
}: PlacePickerAdvancedPointProps) => {
  const { map } = useMap();
  const { value } = useComponentContext();

  const markerRef = React.useRef<PlacePickerAdvancedPointClass>();

  React.useEffect(() => {
    if (!map) return;

    markerRef.current = new PlacePickerAdvancedPointClass(map, pointOptions);

    if (value !== null) {
      const placeCoordinate = [value.x, value.y];
      markerRef.current?.addPoint(placeCoordinate);
    }

    return () => {
      markerRef.current?.removeVectorLayer();
    };
  }, [map]);

  React.useEffect(() => {
    if (value !== null) {
      const placeCoordinate = [value.x, value.y];
      markerRef.current?.addPoint(placeCoordinate);
    }

    return () => {
      markerRef.current?.removeVectorLayer();
    };
  }, [value]);

  return null;
};

export {
  type NonEmptyArray,
  type PlaceType,
  type PlacePickerAdvancedValue,
  type PlacePickerAdvancedPointOptions,
  type PlacePickerAdvancedToastOptions,
};
export {
  PlacePickerAdvancedWrapper,
  PlacePickerAdvancedMapPoint,
  PlacePickerAdvancedAddress,
  PlacePickerAdvancedPlace,
};
