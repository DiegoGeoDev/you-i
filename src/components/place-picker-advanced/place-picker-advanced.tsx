import React from "react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { EllipsisVertical } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ListComponent } from "@/components/list-component";

import {
  ComboboxCommand,
  ComboboxContent,
  ComboboxItem,
  ComboboxWrapper,
  SearchAddressCommand,
  SearchAddressContent,
  SearchAddressWrapper,
} from "@/components";

import { useMap } from "@/components/map";

import { cn } from "@/lib/utils";

import {
  ComponentContext,
  useComponentContext,
  usePlacePickerAdvancedAddress,
  usePlacePickerAdvancedMapPoint,
  usePlacePickerAdvancedPlace,
} from "./hooks";
import { PlacePickerAdvancedPoint as PlacePickerAdvancedPointClass } from "./utils";

type NonEmptyArray<T> = [T, ...T[]];

const placeTypeValues = ["MapPoint", "Address", "Place"] as const;
type PlaceType = (typeof placeTypeValues)[number];

type PlaceItem = ComboboxItem & {
  x: number;
  y: number;
};

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
  pointOptions: PlacePickerAdvancedPointOptions;
  disabled?: boolean;
  items?: PlaceItem[];
  toastOptions?: PlacePickerAdvancedToastOptions;
  isActive?: boolean;
  handleActiveChange?: (isActive: boolean) => void;
};

const PlacePickerAdvancedWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  PlacePickerAdvancedWrapperProps
>(
  (
    {
      value,
      onChange,
      children,
      pointOptions,
      disabled = false,
      items = [],
      toastOptions,
      isActive,
      handleActiveChange,
      className,
      ...props
    },
    ref
  ) => {
    const isArray = Array.isArray(children);
    const childArray = isArray ? children : [children];

    // Lifting state up for the parent to have access
    const { mapPoint, handleMapPoint, internalIsActive, handleClearMapPoint } =
      usePlacePickerAdvancedMapPoint(
        value,
        onChange,
        toastOptions,
        isActive,
        handleActiveChange
      );

    // Lifting state up for the parent to have access
    const { address, handleAddress, handleClearAddress } =
      usePlacePickerAdvancedAddress(value, onChange);

    // Lifting state up for the parent to have access
    const { place, handlePlace, handleClearPlace } =
      usePlacePickerAdvancedPlace(value, onChange, items);

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

    const handleClear = () => {
      handleClearMapPoint();
      handleClearAddress();
      handleClearPlace();
      onChange(null);
    };

    const handleSelectedComponent = (placeType: PlaceType) => {
      const component = childArray.find(
        (child) => child.props.placeType === placeType
      );

      // @ts-ignore
      if (component?.props.placeType !== selectedComponent?.props.placeType) {
        handleClear();
        setSelectedComponent(component);
      }
    };

    const isDisabled = disabled || internalIsActive;

    return (
      <ComponentContext.Provider
        value={{
          value,
          onChange,
          disabled,
          address,
          handleAddress,
          items,
          place,
          handlePlace,
          mapPoint,
          handleMapPoint,
          isActive: internalIsActive,
        }}
      >
        <div className="flex gap-2 items-center">
          {selectedComponent}

          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isDisabled}>
              <Button
                ref={ref}
                type="button"
                size={"icon"}
                variant="outline"
                className={cn("w-8 h-8 p-2 rounded-full", className)}
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

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleClear}>Limpar</DropdownMenuItem>
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
  placeType: _placeType, // used only on handleSelectedComponent
  placeholder = "Adicionar manualmente",
}: PlacePickerAdvancedMapPointProps) => {
  const { disabled, mapPoint, handleMapPoint, isActive } =
    useComponentContext();

  const isDisabled = disabled || isActive;

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "w-full justify-start font-normal",
        "data-[is-null=true]:text-muted-foreground",
        "data-[is-disabled=true]:text-muted-foreground"
      )}
      onClick={handleMapPoint}
      disabled={isDisabled}
      data-is-null={mapPoint === null}
    >
      {mapPoint !== null
        ? `X: ${mapPoint.x.toFixed(6)}, Y: ${mapPoint.y.toFixed(6)}`
        : placeholder}
    </Button>
  );
};

type PlacePickerAdvancedAddressProps = {
  placeType: "Address";
  placeholder?: string;
};

const PlacePickerAdvancedAddress = ({
  placeType: _placeType, // used only on handleSelectedComponent
  placeholder = "Pesquisar por um endereço",
}: PlacePickerAdvancedAddressProps) => {
  const { disabled, address, handleAddress } = useComponentContext();

  return (
    <SearchAddressWrapper
      value={address}
      onChange={handleAddress}
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
  placeType: _placeType, // used only on handleSelectedComponent
  placeholder = "Selecionar um local predefinido",
}: PlacePickerAdvancedPlaceProps) => {
  const { disabled, place, handlePlace, items } = useComponentContext();

  return (
    <ComboboxWrapper
      value={place}
      onChange={handlePlace}
      items={items}
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

export { placeTypeValues };
export {
  type NonEmptyArray,
  type PlaceType,
  type PlaceItem,
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
