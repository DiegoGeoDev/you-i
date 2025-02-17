import OlMap from "ol/Map";
import { Vector as OlVectorLayer } from "ol/layer";
import { Vector as OlVectorSource } from "ol/source";
import {
  Draw as OlDraw,
  Modify as OlModify,
  Snap as OlSnap,
} from "ol/interaction";
import { DrawEvent as OlDrawEvent } from "ol/interaction/Draw";
import { ModifyEvent as OlModifyEvent } from "ol/interaction/Modify";
import { Polygon as OlPolygon } from "ol/geom";
import { Feature as OlFeature } from "ol";
import { buffer, Extent as OlExtent } from "ol/extent";

import {
  DrawSinglePolygonValue,
  DrawSinglePolygonOptions,
  DrawSinglePolygonDrawOptions,
} from "../draw-single-polygon";

class SinglePolygonEditor {
  private vectorSource: OlVectorSource;
  private vectorLayer: OlVectorLayer<OlVectorSource>;
  private modify: OlModify;
  private draw: OlDraw;
  private snap: OlSnap;

  constructor(
    private map: OlMap,
    private polygonOptions: DrawSinglePolygonOptions,
    private drawOptions?: DrawSinglePolygonDrawOptions
  ) {
    this.map = map;

    this.vectorSource = new OlVectorSource({ wrapX: false });
    this.vectorLayer = new OlVectorLayer({
      source: this.vectorSource,
      zIndex: this.polygonOptions.zIndex,
      style: this.polygonOptions.style,
    });

    this.modify = new OlModify({
      source: this.vectorSource,
      style: this.drawOptions?.style,
    });
    this.draw = new OlDraw({
      source: this.vectorSource,
      style: this.drawOptions?.style,
      type: "Polygon",
    });
    this.snap = new OlSnap({ source: this.vectorSource });
  }

  public addVectorLayer() {
    this.map.addLayer(this.vectorLayer);
  }

  public clearVectorSource(
    onChange: (value: DrawSinglePolygonValue | null) => void
  ) {
    this.vectorSource.clear();
    onChange(null);
  }

  public removeVectorLayer() {
    this.vectorSource.clear();
    this.map.removeLayer(this.vectorLayer);
  }

  public enableDrawing(
    isModify: boolean,
    onChange: (value: DrawSinglePolygonValue | null) => void,
    onAbortDrawing: () => void
  ) {
    if (isModify) {
      this.map.addInteraction(this.modify);
      this.map.addInteraction(this.snap);
    } else {
      this.map.addInteraction(this.draw);
    }

    this.draw.on("drawend", (e: OlDrawEvent) => {
      const feature = e.feature;
      // @ts-ignore
      const coords_3857 = feature.getGeometry()?.getCoordinates();

      const polygon = new OlPolygon(coords_3857);
      const polygon_4326 = polygon.transform("EPSG:3857", "EPSG:4326");
      const coords_4326 = polygon_4326.getCoordinates();

      onChange(coords_4326);
      onAbortDrawing();
    });

    this.modify.on("modifyend", (e: OlModifyEvent) => {
      const feature = e.features.getArray()[0];
      // @ts-ignore
      const coords_3857 = feature.getGeometry()?.getCoordinates();

      const polygon = new OlPolygon(coords_3857);
      const polygon_4326 = polygon.transform("EPSG:3857", "EPSG:4326");
      const coords_4326 = polygon_4326.getCoordinates();

      onChange(coords_4326);
    });
  }

  public abortDrawing() {
    this.draw.abortDrawing();
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
  }

  public addPolygon(coords_4326: DrawSinglePolygonValue) {
    const polygon = new OlPolygon(coords_4326);
    const polygon_3857 = polygon.transform("EPSG:4326", "EPSG:3857");

    const feature = new OlFeature({
      geometry: polygon_3857,
    });

    this.vectorSource.addFeature(feature);
  }

  public zoomToVectorLayer() {
    this.map
      .getView()
      .fit(buffer(this.vectorSource.getExtent() as OlExtent, 1000));
  }
}

export { SinglePolygonEditor };
