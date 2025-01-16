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
    to: "/draw-single-polygon",
    title: "Draw Single Polygon",
  },
  {
    id: self.crypto.randomUUID(),
    to: "/input-number",
    title: "Input Number",
  },
];

export { componentsConfig, type ComponentsConfig };
