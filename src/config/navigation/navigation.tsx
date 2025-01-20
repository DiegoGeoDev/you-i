import { HomeIcon } from "lucide-react";

import {
  Home,
  TimePicker,
  OneToOneRelationship,
  PlacePicker,
  DrawSinglePoint,
  DrawSinglePolygon,
  NumberInput,
  PasswordInput,
  Combobox,
  SearchAddress,
  ColorPicker,
} from "@/pages";

const iconSize = 20;

type NavigationConfig = {
  id: string;
  type?: "button" | "dropdown-menu";
  icon?: React.JSX.Element;
  data: {
    id: string;
    path: string;
    title: string;
    page: React.JSX.Element;
    isNavigationItem: boolean;
    pathTest: RegExp;
  }[];
};

const navigationConfig: NavigationConfig[] = [
  {
    id: self.crypto.randomUUID(),
    type: "button",
    icon: <HomeIcon size={iconSize} />,
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/",
        title: "Página Inicial",
        page: <Home />,
        isNavigationItem: true,
        pathTest: /^\/$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/time-picker",
        title: "Time Picker",
        page: <TimePicker />,
        isNavigationItem: false,
        pathTest: /^\/time\-picker$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/one-to-one-relationship",
        title: "One To One Relationship",
        page: <OneToOneRelationship />,
        isNavigationItem: false,
        pathTest: /^\/one\-to\-one\-relationship$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/place-picker",
        title: "Place Picker",
        page: <PlacePicker />,
        isNavigationItem: false,
        pathTest: /^\/place\-picker$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/draw-single-point",
        title: "Draw Single Point",
        page: <DrawSinglePoint />,
        isNavigationItem: false,
        pathTest: /^\/draw\-single\-point$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/draw-single-polygon",
        title: "Draw Single Polygon",
        page: <DrawSinglePolygon />,
        isNavigationItem: false,
        pathTest: /^\/draw\-single\-polygon$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/number-input",
        title: "Number Input",
        page: <NumberInput />,
        isNavigationItem: false,
        pathTest: /^\/number\-input$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/password-input",
        title: "Password Input",
        page: <PasswordInput />,
        isNavigationItem: false,
        pathTest: /^\/password\-input$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/combobox",
        title: "Combobox",
        page: <Combobox />,
        isNavigationItem: false,
        pathTest: /^\/combobox$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/search-address",
        title: "Search Address",
        page: <SearchAddress />,
        isNavigationItem: false,
        pathTest: /^\/search\-address$/,
      },
    ],
  },
  {
    id: self.crypto.randomUUID(),
    data: [
      {
        id: self.crypto.randomUUID(),
        path: "/color-picker",
        title: "Color Picker",
        page: <ColorPicker />,
        isNavigationItem: false,
        pathTest: /^\/color\-picker$/,
      },
    ],
  },
];

export { navigationConfig, type NavigationConfig };
