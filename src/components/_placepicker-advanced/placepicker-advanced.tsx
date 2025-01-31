import { useState } from "react";
import { X } from "lucide-react";
import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";

import {
  Button,
  Combobox,
  ComboboxItem,
  SearchAddress,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@opt/ui";

import { LocationPointType, NonEmptyArray } from "@core/utils";

import { Marker } from "./components";

import { usePresetPlace, useSearchAddress, useSingleMarker } from "./hooks";

type Place = {
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
  locationType: LocationPointType;
};

type PlaceItem = ComboboxItem & {
  x: number;
  y: number;
};

type PlacePickerAdvancedProps = {
  value: Place | undefined;
  setValue: (value: Place | undefined) => void;
  items: PlaceItem[];
  mapRef: React.MutableRefObject<null>;
  disabled?: boolean;
  style?: OlStyle;
  text?: OlText;
  label?: string;
  id: string;
  locationTypes: NonEmptyArray<LocationPointType>;
};

function PlacePickerAdvanced({
  value,
  setValue,
  items,
  mapRef,
  disabled = false,
  style,
  text,
  label,
  id,
  locationTypes,
}: PlacePickerAdvancedProps) {
  const [markerValue, setMarkerValue] = useState<Place | undefined>(value);

  function updateMarkerValue(markerValue: Place | undefined) {
    setMarkerValue(markerValue);
  }

  const { searchAddress, handleSearchAddress, handleClearSearchAddress } =
    useSearchAddress(value, setValue, updateMarkerValue);

  const { presetPlace, handlePresetPlace, handleClearPresetPlace } =
    usePresetPlace(value, setValue, items, updateMarkerValue);

  const {
    singleMarker,
    handleSingleMarker,
    handleClearSingleMarker,
    isActive,
  } = useSingleMarker(value, setValue, id, mapRef, updateMarkerValue);

  const [placeType, setPlaceType] = useState<LocationPointType>(() => {
    if (value?.locationType !== undefined) return value.locationType;

    return locationTypes[0];
  });

  function clear() {
    setValue(undefined);
    setMarkerValue(undefined);
    handleClearSearchAddress();
    handleClearSingleMarker();
    handleClearPresetPlace();
  }

  function handlePlaceType(placeType: LocationPointType) {
    setPlaceType(placeType);
    clear();
  }

  function handleReset() {
    setPlaceType(locationTypes[0]);
    clear();
  }

  const comboboxItems = items.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="flex gap-2 items-center">
        <Select
          onValueChange={(e) => handlePlaceType(e as LocationPointType)}
          value={placeType}
          disabled={disabled || locationTypes.length === 1}
        >
          <SelectTrigger className={cn("w-full")}>
            <SelectValue placeholder="Escolha um Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {locationTypes.includes("Address") ? (
                <SelectItem value="Address">
                  Pesquisar por um endereço
                </SelectItem>
              ) : null}
              {locationTypes.includes("MapPoint") ? (
                <SelectItem value="MapPoint">Adicionar manualmente</SelectItem>
              ) : null}
              {locationTypes.includes("Place") ? (
                <SelectItem value="Place">
                  Selecionar um local predefinido
                </SelectItem>
              ) : null}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="destructive"
          className="h-8 w-8 rounded-full p-2"
          onClick={handleReset}
          disabled={value === undefined || disabled}
        >
          <X size={16} />
        </Button>
      </span>

      {placeType === "Address" && locationTypes.includes("Address") ? (
        <SearchAddress
          triggerClassName="max-w-full min-w-full"
          popoverContentClassName="w-80"
          triggerPlaceholder={
            searchAddress
              ? searchAddress.display_name
              : "Clique aqui e pesquise"
          }
          value={searchAddress}
          setValue={handleSearchAddress}
          disabled={disabled}
        />
      ) : null}

      {placeType === "MapPoint" && locationTypes.includes("MapPoint") ? (
        <Button
          type="button"
          variant="outline"
          onClick={handleSingleMarker}
          disabled={disabled || isActive}
        >
          <p className="w-full text-left">
            {singleMarker
              ? `X: ${singleMarker.x.toFixed(6)}, Y: ${singleMarker.y.toFixed(
                  6
                )}`
              : "Clique aqui e adicione o marcador"}
          </p>
        </Button>
      ) : null}

      {placeType === "Place" && locationTypes.includes("Place") ? (
        <Combobox
          triggerClassName="w-full"
          popoverContentClassName="w-80"
          triggerPlaceholder="Clique aqui e selecione"
          items={comboboxItems}
          value={presetPlace}
          setValue={handlePresetPlace}
          disabled={disabled}
        />
      ) : null}

      <Marker
        coordinate={markerValue}
        style={style}
        text={text}
        label={label}
        zIndex={10}
      />
    </div>
  );
}

export { type Place, type PlaceItem, PlacePickerAdvanced };
