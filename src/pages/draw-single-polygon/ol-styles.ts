import OlStyle from "ol/style/Style";
import OlText from "ol/style/Text";
import OlFill from "ol/style/Fill";
import OlStroke from "ol/style/Stroke";
import OlCircle from "ol/style/Circle";
import OlMultiPoint from "ol/geom/MultiPoint";
import OlLineString from "ol/geom/LineString";

const polygonText = new OlText({
  textAlign: "center",
  textBaseline: "middle",
  font: "Arial",
  scale: 1.5,
  fill: new OlFill({ color: "blue" }),
  stroke: new OlStroke({ color: "white", width: 4 }),
  text: "Local",
});

const polygonStyle = [
  new OlStyle({
    stroke: new OlStroke({
      color: "blue",
      width: 3,
    }),
    fill: new OlFill({
      color: "rgba(0, 0, 255, 0.1)",
    }),
    text: polygonText,
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
  fill: new OlFill({
    color: "rgba(0, 153, 255, 0.2)",
  }),
});

// Style for the complete polygon
const polygonSegmentsStyle = new OlStyle({
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
  fill: new OlFill({
    color: "rgba(0, 153, 255, 0.2)",
  }),
});

// Style for the last segment of the polygon
const lastSegmentStyle = new OlStyle({
  stroke: new OlStroke({
    color: "rgba(255, 255, 255, 1)",
    width: 2,
    lineDash: [10, 10],
  }),
});

// Style function to apply different styles based on the feature state
const drawPolygonStyleFunction = (feature: any) => {
  const styles = [polygonSegmentsStyle];
  const geometry = feature.getGeometry();

  if (geometry.getType() === "Polygon") {
    const coordinates = geometry.getCoordinates()[0];
    if (coordinates.length > 1) {
      const lastSegment = new OlLineString([
        coordinates[coordinates.length - 2],
        coordinates[coordinates.length - 1],
      ]);
      lastSegmentStyle.setGeometry(lastSegment);
      styles.push(lastSegmentStyle);
    }
  }

  return styles;
};

export { polygonStyle, drawStyle, drawPolygonStyleFunction };
