import { useEffect, useRef, useState } from "react";
import { MapBrowserEvent as OlMapBrowserEvent } from "ol";
import { Point as OlPoint } from "ol/geom";
import { unByKey } from "ol/Observable";
import { toast as sonnerToast } from "sonner";

import { Button, useMap } from "@opt/ui";

import { Place } from "../placepicker-advanced";

function useSingleMarker(
  value: Place | undefined,
  setValue: (value: Place | undefined) => void,
  toastID: string,
  mapRef: React.MutableRefObject<null>,
  updateMarkerValue: (value: Place | undefined) => void
) {
  const { map } = useMap();

  const clickOnceListenerKey = useRef<any>();
  const [isActive, setIsActive] = useState(false);

  const [singleMarker, setSingleMarker] = useState<
    { x: number; y: number } | undefined
  >(() => {
    if (value !== undefined) {
      return { x: value.x, y: value.y };
    }

    return undefined;
  });

  // cancel on click outside map => mapRef
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // @ts-ignore
      if (mapRef.current && !mapRef.current.contains(event.target)) {
        cancelSingleMarker();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mapRef]);

  function cancelSingleMarker() {
    unByKey(clickOnceListenerKey.current);

    setIsActive(false);

    sonnerToast.dismiss(toastID);
  }

  function addSingleMarker(event: OlMapBrowserEvent<any>) {
    const point_4326 = new OlPoint(event.coordinate).transform(
      "EPSG:3857",
      "EPSG:4326"
    );

    const [x, y] = point_4326.getCoordinates();

    setSingleMarker({ x, y });

    const newValue: Place = {
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
      locationType: "MapPoint",
    };

    updateMarkerValue(newValue);

    setValue(newValue);

    setIsActive(false);

    sonnerToast.dismiss(toastID);
  }

  function handleSingleMarker() {
    if (!map) return;

    clickOnceListenerKey.current = map.once("click", addSingleMarker);

    setIsActive(true);

    sonnerToast("Marcador Único", {
      id: toastID,
      description: "Clique no mapa ou clique em Cancelar",
      duration: Infinity,

      cancel: (
        <Button className="ml-2" variant="outline" onClick={cancelSingleMarker}>
          Cancelar
        </Button>
      ),
    });
  }

  function handleClearSingleMarker() {
    setSingleMarker(undefined);
  }

  return {
    singleMarker,
    handleSingleMarker,
    handleClearSingleMarker,
    isActive,
  };
}

export { useSingleMarker };
