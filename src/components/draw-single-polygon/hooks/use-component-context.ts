import { createContext, useContext } from "react";

import { DrawSinglePolygonValue } from "../draw-single-polygon";

type ComponentContextType = {
  value: DrawSinglePolygonValue | undefined;
  onChange: (value: DrawSinglePolygonValue | undefined) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

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
