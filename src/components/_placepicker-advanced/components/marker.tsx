import { useEffect, useRef } from "react";
import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";

import { Place } from "../placepicker-advanced";

import { useMap } from "@opt/ui";

import { Marker as MarkerUtil } from "../utils";

type MarkerProps = {
  coordinate?: Place;
  style?: OlStyle;
  text?: OlText;
  label?: string;
  zIndex: number;
};

function Marker({ coordinate, style, text, label, zIndex }: MarkerProps) {
  const { map } = useMap();
  const markerRef = useRef<MarkerUtil>();

  useEffect(() => {
    if (!map) return;

    markerRef.current = new MarkerUtil(map, zIndex, style, text, label);

    if (coordinate !== undefined) {
      const placeCoordinate = [coordinate.x, coordinate.y];
      markerRef.current?.addMarker(placeCoordinate);
    }

    return () => {
      markerRef.current?.removeMarker();
    };
  }, [map]);

  useEffect(() => {
    if (coordinate !== undefined) {
      const placeCoordinate = [coordinate.x, coordinate.y];
      markerRef.current?.addMarker(placeCoordinate);
    }

    return () => {
      markerRef.current?.removeMarker();
    };
  }, [coordinate]);

  return null;
}

export { Marker };
