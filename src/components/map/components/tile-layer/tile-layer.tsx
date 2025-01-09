import { useEffect } from "react";

import OlTileLayer from "ol/layer/Tile";
import TileSource from "ol/source/Tile";
import { Options } from "ol/layer/BaseTile";

import { useMap } from "@/components/map";

type TileLayerProps = Options<TileSource> & {};

function TileLayer({ ...props }: TileLayerProps) {
  const { map } = useMap();

  const source = props.source;
  const zIndex = props.zIndex;

  useEffect(() => {
    if (!map) return;

    const tileLayerOptions: Options<TileSource> = {
      source,
      zIndex,
      ...props,
    };
    const tileLayerObject = new OlTileLayer(tileLayerOptions);

    map.addLayer(tileLayerObject);

    return () => {
      if (map) {
        map.removeLayer(tileLayerObject);
      }
    };
  }, [map]);

  return null;
}

export { type TileLayerProps, TileLayer };
