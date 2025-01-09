import { createContext, useContext, useEffect, useState } from "react";
import OlMap, { MapOptions } from "ol/Map";
import View, { ViewOptions } from "ol/View";
import { fromLonLat } from "ol/proj";
import { Coordinate } from "ol/coordinate";
import { defaults as defaultControls } from "ol/control";
import { defaults as defaultInteractions } from "ol/interaction";

import "ol/ol.css";

const defaultViewOptions: ViewOptions = {
  center: [-54, -14],
  zoom: 3,
  minZoom: 3,
  maxZoom: 27,
};

const controls = defaultControls({
  zoom: false,
  rotate: false,
});

const interactions = defaultInteractions({
  altShiftDragRotate: true,
  pinchRotate: true,
});

type MapProviderProps = ViewOptions &
  MapOptions & {
    children: React.ReactNode;
    mapId: string;
  };

type MapProviderState = {
  map?: OlMap;
};

const initialState: MapProviderState = {
  map: undefined,
};

const MapProviderContext = createContext<MapProviderState>(initialState);

function MapProvider({ children, mapId, ...props }: MapProviderProps) {
  const [map, setMap] = useState<OlMap>();

  useEffect(() => {
    const viewOptions: ViewOptions = {
      center: fromLonLat(
        props.center ?? (defaultViewOptions.center as Coordinate)
      ),
      zoom: props.zoom ?? defaultViewOptions.zoom,
      minZoom: props.minZoom ?? defaultViewOptions.minZoom,
      maxZoom: props.maxZoom ?? defaultViewOptions.maxZoom,
    };
    const viewObject = new View(viewOptions);

    const mapOptions: MapOptions = {
      view: viewObject,
      layers: [],
      controls: props.controls ?? controls,
      interactions: props.interactions ?? interactions,
      overlays: [],
      target: mapId,
    };
    const mapObject = new OlMap(mapOptions);

    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  const value = {
    map,
  };

  return (
    <MapProviderContext.Provider {...props} value={value}>
      {children}
    </MapProviderContext.Provider>
  );
}

const useMap = () => {
  const context = useContext(MapProviderContext);

  if (context === undefined)
    throw new Error("useMap must be used within a MapProvider");

  return context;
};

export { MapProvider, useMap };
