import { createContext, useContext } from "react";

import { SearchAddressValue, SearchAddressItem } from "../search-address";

type ComponentContextType = {
  value: SearchAddressValue | undefined;
  onChange: (value: SearchAddressValue | undefined) => void;
  items: SearchAddressItem[];
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

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
