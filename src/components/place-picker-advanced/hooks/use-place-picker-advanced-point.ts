import { useEffect, useRef } from "react";
import OlStyle, { StyleFunction as OlStyleFunction } from "ol/style/Style";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { useMap } from "@/components/map";

import { useComponentContext } from "./use-component-context";
import { PlacePickerAdvancedPoint } from "../utils";

type usePlacePickerPointType = {
  pointStyle: OlStyle | OlStyle[] | OlStyleFunction | undefined;
};

function usePlacePickerPoint({ pointStyle }: usePlacePickerPointType) {
  const { map } = useMap();
  const { value, onChange, disabled } = useComponentContext();

  const pointRef = useRef<PlacePickerAdvancedPoint>();

  // create a point and map center change listener
  useEffect(() => {
    if (!map) return;

    pointRef.current = new PlacePickerAdvancedPoint(map, pointStyle);
    pointRef.current.addPoint(value ?? center);

    return () => {
      pointRef.current?.removeVectorLayer();
    };
  }, [map]);

  function handleGetPoint() {
    const center = pointRef?.current?.getCoordinateAs4326();
    onChange(center as [number, number]);
  }

  return { handleGetPoint };
}

export { usePlacePickerPoint };
