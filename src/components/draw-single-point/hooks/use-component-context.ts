import { createContext, useContext } from "react";

import { DrawSinglePointValue } from "../draw-single-point";

type ComponentContextType = {
  value: DrawSinglePointValue | null;
  onChange: (value: DrawSinglePointValue | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "DrawSinglePoint components must be used within a DrawSinglePointWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
