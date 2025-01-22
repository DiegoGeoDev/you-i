import { createContext, useContext } from "react";

import { SearchAddressValue } from "../search-address";

type ComponentContextType = {
  value: SearchAddressValue | null;
  onChange: (value: SearchAddressValue | null) => void;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "SearchAddress components must be used within a SearchAddressWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
