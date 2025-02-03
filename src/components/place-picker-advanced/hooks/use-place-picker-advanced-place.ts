import React from "react";

import { PlaceItem, PlacePickerAdvancedValue } from "../place-picker-advanced";

import { ComboboxValue } from "@/components";

function usePlacePickerAdvancedPlace(
  value: PlacePickerAdvancedValue | null,
  onChange: (value: PlacePickerAdvancedValue | null) => void,
  items: PlaceItem[]
) {
  const [place, setPlace] = React.useState<ComboboxValue | null>(() => {
    if (value?.placeID !== undefined) {
      return value.placeID;
    }

    return null;
  });

  function handlePlace(placeID: string | null) {
    if (placeID === null) {
      setPlace(null);
      return;
    }

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
      placeType: "Place",
    };

    setPlace(placeID);
    onChange(newValue);
  }

  function handleClearPlace() {
    setPlace(null);
  }

  return {
    place,
    handlePlace,
    handleClearPlace,
  };
}

export { usePlacePickerAdvancedPlace };
