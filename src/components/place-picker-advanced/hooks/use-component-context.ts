import { createContext, useContext } from "react";

import { PlaceItem, PlacePickerAdvancedValue } from "../place-picker-advanced";

import { SearchAddressValue } from "@/components";

type ComponentContextType = {
  value: PlacePickerAdvancedValue | null;
  onChange: (value: PlacePickerAdvancedValue | null) => void;
  disabled?: boolean;
  // Lifting state up for the parent to have access
  address: SearchAddressValue | null;
  handleAddress: (searchAddress: SearchAddressValue | null) => void;
  items: PlaceItem[];
  place: string | null;
  handlePlace: (placeID: string | null) => void;
  mapPoint: {
    x: number;
    y: number;
  } | null;
  handleMapPoint: () => void;
  isActive: boolean;
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
