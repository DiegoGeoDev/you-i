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
import { Point as OlPoint } from "ol/geom";
import { Feature as OlFeature } from "ol";

import {
  DrawSinglePointValue,
  DrawSinglePointStyle,
} from "../draw-single-point";

class SinglePointEditor {
  private vectorSource: OlVectorSource;
  private vectorLayer: OlVectorLayer<OlVectorSource>;
  private modify: OlModify;
  private draw: OlDraw;
  private snap: OlSnap;

  constructor(
    private map: OlMap,
    private zIndex: number,
    private pointStyle?: DrawSinglePointStyle,
    private drawStyle?: DrawSinglePointStyle
  ) {
    this.map = map;

    this.vectorSource = new OlVectorSource({ wrapX: false });
    this.vectorLayer = new OlVectorLayer({
      source: this.vectorSource,
      zIndex: this.zIndex,
      style: this.pointStyle,
    });

    this.modify = new OlModify({
      source: this.vectorSource,
      style: this.drawStyle,
    });
    this.draw = new OlDraw({
      source: this.vectorSource,
      style: this.drawStyle,
      type: "Point",
    });
    this.snap = new OlSnap({ source: this.vectorSource });
  }

  public addVectorLayer() {
    this.map.addLayer(this.vectorLayer);
  }

  public clearVectorSource(
    onChange: (value: DrawSinglePointValue | undefined) => void
  ) {
    this.vectorSource.clear();
    onChange(undefined);
  }

  public removeVectorLayer() {
    this.vectorSource.clear();
    this.map.removeLayer(this.vectorLayer);
  }

  public enableDrawing(
    isModify: boolean,
    onChange: (value: DrawSinglePointValue | undefined) => void,
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

      const point = new OlPoint(coords_3857);
      const point_4326 = point.transform("EPSG:3857", "EPSG:4326");
      const coords_4326 = point_4326.getCoordinates();

      onChange(coords_4326);
      onAbortDrawing();
    });

    this.modify.on("modifyend", (e: OlModifyEvent) => {
      const feature = e.features.getArray()[0];
      // @ts-ignore
      const coords_3857 = feature.getGeometry()?.getCoordinates();

      const point = new OlPoint(coords_3857);
      const point_4326 = point.transform("EPSG:3857", "EPSG:4326");
      const coords_4326 = point_4326.getCoordinates();

      onChange(coords_4326);
    });
  }

  public abortDrawing() {
    this.draw.abortDrawing();
    this.map.removeInteraction(this.modify);
    this.map.removeInteraction(this.draw);
    this.map.removeInteraction(this.snap);
  }

  public addPoint(coords_4326: DrawSinglePointValue) {
    const point = new OlPoint(coords_4326);
    const point_3857 = point.transform("EPSG:4326", "EPSG:3857");

    const feature = new OlFeature({
      geometry: point_3857,
    });

    this.vectorSource.addFeature(feature);
  }
}

export { SinglePointEditor };