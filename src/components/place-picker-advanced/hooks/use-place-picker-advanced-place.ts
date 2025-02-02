import React from "react";

import { useComponentContext } from "./use-component-context";

import {
  PlaceItem,
  PlacePickerAdvancedValue,
  PlaceType,
} from "../place-picker-advanced";

import { ComboboxValue } from "@/components";

function usePlacePickerAdvancedPlace(items: PlaceItem[], placeType: PlaceType) {
  const { value, onChange } = useComponentContext();

  const [place, setPlace] = React.useState<ComboboxValue | null>(() => {
    if (value?.placeID !== undefined) {
      return value.placeID;
    }

    return null;
  });

  // Clear state  on component dismount
  React.useEffect(() => {
    return () => setPlace(null);
  }, []);

  function handlePlace(placeID: string | null) {
    if (placeID === null) return;

    const place = items.find((item) => item.value === placeID);

    const newValue: PlacePickerAdvancedValue = {
      placeID: placeID,
      address: {
        district: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        zipCode: undefined,
      },
      label: undefined,
      x: place?.x as number,
      y: place?.y as number,
      placeType,
    };

    setPlace(placeID);
    onChange(newValue);
  }

  return {
    place,
    handlePlace,
  };
}

export { usePlacePickerAdvancedPlace };
