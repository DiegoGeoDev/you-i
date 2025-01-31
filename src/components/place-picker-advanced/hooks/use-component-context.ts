import { createContext, useContext } from "react";

import { PlacePickerAdvancedValue } from "../place-picker-advanced";

type ComponentContextType = {
  value: PlacePickerAdvancedValue | null;
  onChange: (value: PlacePickerAdvancedValue | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "PlacePickerAdvanced components must be used within a PlacePickerAdvanced"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
