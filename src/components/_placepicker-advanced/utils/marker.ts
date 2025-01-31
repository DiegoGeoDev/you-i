import OlMap from "ol/Map";
import { Vector as OlVector } from "ol/layer";
import { Vector as OlVectorSource } from "ol/source";
import { Point as OlPoint } from "ol/geom";
import OlFeature from "ol/Feature";
import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";
import { Coordinate as OlCoordinate } from "ol/coordinate";
import { buffer, Extent } from "ol/extent";

import { defaultMarkerStyle, defaultMarkerText } from "../config";

class Marker {
  private vectorLayer: OlVector<OlVectorSource>;

  constructor(
    private map: OlMap,
    zIndex: number,
    private style?: OlStyle,
    private text?: OlText,
    private label?: string
  ) {
    this.map = map;
    this.style = style;
    this.text = text;
    this.label = label;

    this.vectorLayer = new OlVector({
      source: new OlVectorSource(),
      zIndex: zIndex,
    });
  }

  private createFeature(coordinate: OlCoordinate) {
    const point = new OlPoint(coordinate).transform("EPSG:4326", "EPSG:3857");

    const feature = new OlFeature({
      geometry: point,
      name: this.label,
    });

    feature.setId(this.label);

    return feature;
  }

  private setStyle() {
    const markerStyle =
      this.style !== undefined
        ? this.style.clone()
        : defaultMarkerStyle.clone();

    const markerText =
      this.text !== undefined ? this.text.clone() : defaultMarkerText.clone();
    markerText.setText(this.label);

    markerStyle.setText(markerText);

    this.vectorLayer.setStyle(markerStyle);
  }

  public addMarker(coordinate: OlCoordinate) {
    this.map.addLayer(this.vectorLayer);

    const feature = this.createFeature(coordinate);

    this.setStyle();

    this.vectorLayer.getSource()!.addFeature(feature);

    this.map
      .getView()
      .fit(buffer(this.vectorLayer.getSource()?.getExtent() as Extent, 25000));
  }

  public removeMarker() {
    this.vectorLayer.getSource()!.clear();
    this.map.removeLayer(this.vectorLayer);
  }
}

export { Marker };
