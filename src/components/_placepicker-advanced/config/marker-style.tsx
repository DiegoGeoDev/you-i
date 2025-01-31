import { renderToStaticMarkup } from "react-dom/server";
import { MapPin } from "lucide-react";
import OlStyle from "ol/style/Style";
import OlIcon from "ol/style/Icon";
import OlText from "ol/style/Text";
import OlFill from "ol/style/Fill";
import OlStroke from "ol/style/Stroke";

const svgString = renderToStaticMarkup(<MapPin size={20} />);
const base64 = btoa(svgString);

const defaultMarkerStyle = new OlStyle({
  image: new OlIcon({
    src: `data:image/svg+xml;base64,${base64}`,
  }),
});

const defaultMarkerText = new OlText({
  textAlign: "left",
  textBaseline: "middle",
  offsetX: 16,
  font: "Arial",
  scale: 1.5,
  fill: new OlFill({ color: "rgba(0, 0, 0, 1)" }),
  stroke: new OlStroke({ color: "rgba(255, 255, 255, 1)", width: 4 }),
  text: undefined,
});

export { defaultMarkerStyle, defaultMarkerText };
