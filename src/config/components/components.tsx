type ComponentsConfig = {
  id: string;
  to: string;
  title: string;
};

const componentsConfig: ComponentsConfig[] = [
  {
    id: self.crypto.randomUUID(),
    to: "/time-picker",
    title: "Time Picker",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/one-to-one-relationship",
    title: "One To One Relationship",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/place-picker",
    title: "Place Picker",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/draw-single-point",
    title: "Draw Single Point",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/draw-single-line-string",
    title: "Draw Single Line String",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/draw-single-polygon",
    title: "Draw Single Polygon",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/number-input",
    title: "Number Input",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/password-input",
    title: "Password Input",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/combobox",
    title: "Combobox",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/search-address",
    title: "Search Address",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/color-picker",
    title: "Color Picker",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/copy-to-clipboard",
    title: "Copy To Clipboard",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/range-slider",
    title: "Range Slider",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/place-picker-advanced",
    title: "Place Picker Advanced",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/osrm",
    title: "OSRM",
  },
];

export { componentsConfig, type ComponentsConfig };
