import OlMap from "ol/Map";
import { Vector as OlVectorLayer } from "ol/layer";
import { Vector as OlVectorSource } from "ol/source";
import { Point as OlPoint } from "ol/geom";
import OlFeature from "ol/Feature";
import { Coordinate as OlCoordinate } from "ol/coordinate";

import { PlacePickerAdvancedPointOptions } from "../place-picker-advanced";

class PlacePickerAdvancedPoint {
  private vectorSource: OlVectorSource;
  private vectorLayer: OlVectorLayer<OlVectorSource>;

  constructor(
    private map: OlMap,
    private pointOptions: PlacePickerAdvancedPointOptions
  ) {
    this.map = map;
    this.vectorSource = new OlVectorSource({ wrapX: false });
    this.vectorLayer = new OlVectorLayer({
      source: this.vectorSource,
      style: this.pointOptions.style,
      zIndex: this.pointOptions.zIndex,
    });
  }

  private createFeature(coordinate: OlCoordinate) {
    const point = new OlPoint(coordinate).transform("EPSG:4326", "EPSG:3857");

    const feature = new OlFeature({
      geometry: point,
    });

    return feature;
  }

  public addPoint(coordinate: OlCoordinate) {
    this.map.addLayer(this.vectorLayer);

    const feature = this.createFeature(coordinate);

    this.vectorSource.addFeature(feature);
  }

  public removeVectorLayer() {
    this.vectorSource.clear();
    this.map.removeLayer(this.vectorLayer);
  }
}

export { PlacePickerAdvancedPoint };
