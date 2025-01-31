import { createContext, useContext } from "react";

import { DrawSingleLineStringValue } from "../draw-single-line-string";

type ComponentContextType = {
  value: DrawSingleLineStringValue | null;
  onChange: (value: DrawSingleLineStringValue | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "DrawSingleLineString components must be used within a DrawSingleLineStringWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
