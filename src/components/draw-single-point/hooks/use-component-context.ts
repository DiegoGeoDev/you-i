import { createContext, useContext } from "react";

import { DrawSinglePointValue } from "../draw-single-point";

type ComponentContextType = {
  value: DrawSinglePointValue | undefined;
  onChange: (value: DrawSinglePointValue | undefined) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

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
