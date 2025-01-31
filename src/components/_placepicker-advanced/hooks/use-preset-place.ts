import { useState } from "react";

import { Place, PlaceItem } from "../placepicker-advanced";

function usePresetPlace(
  value: Place | undefined,
  setValue: (value: Place | undefined) => void,
  items: PlaceItem[],
  updateMarkerValue: (value: Place | undefined) => void
) {
  const [presetPlace, setPresetPlace] = useState<string | undefined>(() => {
    if (value?.placeID !== undefined) {
      return value.placeID;
    }

    return undefined;
  });

  function handlePresetPlace(placeID: string | undefined) {
    if (placeID) {
      setPresetPlace(placeID);

      const place = items.find((item) => item.value === placeID);

      const newValue: Place = {
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
        locationType: "Place",
      };

      updateMarkerValue(newValue);

      setValue(newValue);
    }
  }

  function handleClearPresetPlace() {
    setPresetPlace(undefined);
  }

  return {
    presetPlace,
    handlePresetPlace,
    handleClearPresetPlace,
  };
}

export { usePresetPlace };
