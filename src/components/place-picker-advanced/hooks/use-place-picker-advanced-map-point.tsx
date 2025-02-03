import React from "react";
import { MapBrowserEvent as OlMapBrowserEvent } from "ol";
import { Point as OlPoint } from "ol/geom";
import { unByKey } from "ol/Observable";
import { toast as sonnerToast } from "sonner";

import { Button } from "@/components/ui/button";

import { useMap } from "@/components/map";

const toastId = self.crypto.randomUUID();

import {
  PlacePickerAdvancedToastOptions,
  PlacePickerAdvancedValue,
} from "../place-picker-advanced";

function usePlacePickerAdvancedMapPoint(
  value: PlacePickerAdvancedValue | null,
  onChange: (value: PlacePickerAdvancedValue | null) => void,
  toastOptions?: PlacePickerAdvancedToastOptions,
  isActive?: boolean,
  handleActiveChange?: (isActive: boolean) => void
) {
  const { map } = useMap();

  const clickOnceListenerKey = React.useRef<any>();

  const [internalIsActive, setInternalIsActive] = React.useState(false);
  const [mapPoint, setMapPoint] = React.useState<{
    x: number;
    y: number;
  } | null>(() => {
    if (value !== null) {
      return { x: value.x, y: value.y };
    }

    return null;
  });

  // Clear state  on component dismount
  // React.useEffect(() => {
  //   return () => setMapPoint(null);
  // }, []);

  function cancelMapPoint() {
    unByKey(clickOnceListenerKey.current);

    if (handleActiveChange) {
      handleActiveChange(false);
    }
    setInternalIsActive(false);

    sonnerToast.dismiss(toastId);
  }

  function addMapPoint(event: OlMapBrowserEvent<any>) {
    const point_4326 = new OlPoint(event.coordinate).transform(
      "EPSG:3857",
      "EPSG:4326"
    );

    const [x, y] = point_4326.getCoordinates();

    const newValue: PlacePickerAdvancedValue = {
      placeID: undefined,
      address: {
        district: undefined,
        city: undefined,
        state: undefined,
        country: undefined,
        zipCode: undefined,
      },
      label: undefined,
      x,
      y,
      placeType: "MapPoint",
    };

    setMapPoint({ x, y });
    onChange(newValue);

    if (handleActiveChange) {
      handleActiveChange(false);
    }
    setInternalIsActive(false);

    sonnerToast.dismiss(toastId);
  }

  function handleMapPoint() {
    if (!map) return;

    clickOnceListenerKey.current = map.once("click", addMapPoint);

    if (handleActiveChange) {
      handleActiveChange(true);
    }
    setInternalIsActive(true);

    sonnerToast(toastOptions?.title || "Single Point", {
      id: toastId,
      description:
        toastOptions?.description ||
        'Click on the map to proceed or "Stop Editing"',
      duration: Infinity,
      cancel: (
        <Button className="ml-2" variant="outline" onClick={cancelMapPoint}>
          {toastOptions?.buttonText || "Stop Editing"}
        </Button>
      ),
    });
  }

  function handleClearMapPoint() {
    setMapPoint(null);
  }

  return {
    mapPoint,
    handleMapPoint,
    internalIsActive: isActive !== undefined ? isActive : internalIsActive,
    handleClearMapPoint,
  };
}

export { usePlacePickerAdvancedMapPoint };
