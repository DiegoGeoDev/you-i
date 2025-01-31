import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";
import OlFill from "ol/style/Fill";
import OlStroke from "ol/style/Stroke";
import OlCircle from "ol/style/Circle";

const pointText = new OlText({
  textAlign: "left",
  textBaseline: "middle",
  offsetX: 16,
  font: "Arial",
  scale: 1.5,
  fill: new OlFill({ color: "rgba(0, 0, 0, 1)" }),
  stroke: new OlStroke({ color: "rgba(255, 255, 255, 1)", width: 4 }),
  text: "Local",
});

const pointStyle = new OlStyle({
  image: new OlCircle({
    radius: 5,
    fill: new OlFill({
      color: "rgba(0, 0, 0, 1)",
    }),
    stroke: new OlStroke({
      color: "rgba(255, 255, 255, 1)",
      width: 4,
    }),
  }),
  text: pointText,
});

export { pointStyle };
