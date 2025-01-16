import { useEffect, useRef } from "react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { useMap } from "@/components/map";

import { useComponentContext } from "./use-component-context";
import { PlacePickerPoint } from "../utils";

type usePlacePickerPointType = {
  pointStyle: OlStyle | OlStyle[] | OlStyleFunction | undefined;
};

function usePlacePickerPoint({ pointStyle }: usePlacePickerPointType) {
  const { map } = useMap();
  const { value, onChange, disabled } = useComponentContext();

  const pointRef = useRef<PlacePickerPoint>();

  // create a point and map center change listener
  useEffect(() => {
    if (!map) return;

    pointRef.current = new PlacePickerPoint(map, pointStyle);
    const center = pointRef.current.getCoordinateAs4326();
    pointRef.current.addPoint(value ?? center);

    map.getView().addChangeListener("center", onCenterChange);

    return () => {
      pointRef.current?.removeVectorLayer();

      map.getView().removeChangeListener("center", onCenterChange);
    };
  }, [map]);

  function onCenterChange() {
    if (disabled) return;

    const center = pointRef?.current?.getCoordinateAs4326();
    pointRef.current?.updatePoint(center as OlCoordinate);
  }

  function handleGetPoint() {
    const center = pointRef?.current?.getCoordinateAs4326();
    onChange(center as [number, number]);
  }

  return { handleGetPoint };
}

export { usePlacePickerPoint };
