import { createContext, useContext } from "react";

import { PlacePickerValue } from "../place-picker";

type ComponentContextType = {
  value: PlacePickerValue | undefined;
  onChange: (value: PlacePickerValue | undefined) => void;
  disabled?: boolean;
  mapId: string;
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

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
