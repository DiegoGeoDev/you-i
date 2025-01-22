import { createContext, useContext } from "react";

import { ComboboxValue, ComboboxItem } from "../combobox";

type ComponentContextType = {
  value: ComboboxValue | null;
  onChange: (value: ComboboxValue | null) => void;
  items: ComboboxItem[];
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "Combobox components must be used within a ComboboxWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
