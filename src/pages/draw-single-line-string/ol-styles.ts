import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";
import OlFill from "ol/style/Fill";
import OlStroke from "ol/style/Stroke";
import OlCircle from "ol/style/Circle";
import OlMultiPoint from "ol/geom/MultiPoint";

const lineStringText = new OlText({
  textAlign: "center",
  textBaseline: "middle",
  font: "Arial",
  scale: 1.5,
  fill: new OlFill({ color: "blue" }),
  stroke: new OlStroke({ color: "white", width: 4 }),
  text: "Local",
});

const lineStringStyle = [
  new OlStyle({
    stroke: new OlStroke({
      color: "blue",
      width: 3,
    }),
    text: lineStringText,
  }),
  new OlStyle({
    image: new OlCircle({
      radius: 5,
      fill: new OlFill({
        color: "orange",
      }),
    }),
    geometry: function (feature) {
      // @ts-ignore
      const coordinates = feature.getGeometry().getCoordinates()[0];
      return new OlMultiPoint(coordinates);
    },
  }),
];

const drawStyle = new OlStyle({
  image: new OlCircle({
    radius: 5,
    fill: new OlFill({
      color: "rgba(0, 153, 255, 0.7)",
    }),
    stroke: new OlStroke({
      color: "rgba(0, 153, 255, 1)",
      width: 2,
    }),
  }),
  stroke: new OlStroke({
    color: "rgba(0, 153, 255, 1)",
    width: 2,
  }),
});

export { lineStringStyle, drawStyle };
