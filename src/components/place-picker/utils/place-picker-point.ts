import OlMap from "ol/Map";
import { Vector as OlVectorLayer } from "ol/layer";
import { Vector as OlVectorSource } from "ol/source";
import { Point as OlPoint } from "ol/geom";
import OlFeature from "ol/Feature";
import { Coordinate as OlCoordinate } from "ol/coordinate";
import OlStyle from "ol/style/Style";
import { transform } from "ol/proj";

class PlacePickerPoint {
  private vectorSource: OlVectorSource;
  private vectorLayer: OlVectorLayer<OlVectorSource>;

  constructor(private map: OlMap, private pointStyle?: OlStyle) {
    this.map = map;
    this.vectorSource = new OlVectorSource({ wrapX: false });
    this.vectorLayer = new OlVectorLayer({
      source: this.vectorSource,
      style: this.pointStyle,
      zIndex: 1,
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

  public updatePoint(coordinate: OlCoordinate) {
    const feature = this.createFeature(coordinate);

    this.vectorSource.getFeatures()[0].setGeometry(feature.getGeometry());
  }

  public removeVectorLayer() {
    this.vectorSource.clear();
    this.map.removeLayer(this.vectorLayer);
  }

  public getCoordinateAs4326() {
    const center_3857 = this.map?.getView().getCenter() as OlCoordinate;
    const center_4326 = transform(center_3857, "EPSG:3857", "EPSG:4326");

    return center_4326;
  }
}

export { PlacePickerPoint };
