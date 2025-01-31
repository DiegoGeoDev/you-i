import { createContext, useContext } from "react";

import { DrawSinglePolygonValue } from "../draw-single-polygon";

type ComponentContextType = {
  value: DrawSinglePolygonValue | null;
  onChange: (value: DrawSinglePolygonValue | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "DrawSinglePolygon components must be used within a DrawSinglePolygonWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
