import { createContext, useContext } from "react";

import { PlacePickerValue } from "../place-picker";

type ComponentContextType = {
  value: PlacePickerValue | null;
  onChange: (value: PlacePickerValue | null) => void;
  disabled?: boolean;
  mapId: string;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "PlacePicker components must be used within a PlacePickerWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
