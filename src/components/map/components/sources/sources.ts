import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";

const openStreetMap = new OSM();

const cartodbDark = new XYZ({
  url: "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" + "",
});

const cartodbLight = new XYZ({
  url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" + "",
});

const cartodbVoyager = new XYZ({
  url:
    "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" +
    "",
});

export { openStreetMap, cartodbDark, cartodbLight, cartodbVoyager };
