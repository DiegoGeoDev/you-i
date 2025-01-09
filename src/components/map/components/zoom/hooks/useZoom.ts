import { useEffect, useState } from "react";

import { Control } from "ol/control";
import { Options } from "ol/control/Control";
import { AnimationOptions } from "ol/View";

import { useMap } from "@/components/map";

type ZoomOptions = Options & AnimationOptions & {};

function useZoom(options: ZoomOptions) {
  const { map } = useMap();

  const [zoomControl, setZoomControl] = useState<Control>();

  const [currentZoom, setCurrentZoom] = useState<number>();

  useEffect(() => {
    if (!map) return;

    const zoomControlObject = new Control(options);

    map.addControl(zoomControlObject);
    setZoomControl(zoomControlObject);
    setCurrentZoom(map.getView().getZoom());

    return () => {
      if (!map) return;

      map.removeControl(zoomControlObject);
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    map.getView().addChangeListener("resolution", onResolutionChange);

    return () => {
      if (!map) return;

      map.getView().removeChangeListener("resolution", onResolutionChange);
    };
  }, [zoomControl]);

  function onResolutionChange() {
    const zoom = map?.getView().getZoom();

    setCurrentZoom(zoom);
  }

  function handleZoomIn() {
    const zoom = map?.getView().getZoom();
    if (zoom === undefined) return;

    map?.getView().setZoom(zoom + 1);
  }

  function handleZoomOut() {
    const zoom = map?.getView().getZoom();
    if (zoom === undefined) return;

    map?.getView().setZoom(zoom - 1);
  }

  return { zoomControl, currentZoom, handleZoomIn, handleZoomOut };
}

export { type ZoomOptions, useZoom };
