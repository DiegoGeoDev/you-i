import { createContext, useContext } from "react";

import { ColorPickerValue } from "../color-picker";

type ComponentContextType = {
  value: ColorPickerValue | null;
  onChange: (value: ColorPickerValue | null) => void;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "ColorPicker components must be used within a ColorPickerWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
