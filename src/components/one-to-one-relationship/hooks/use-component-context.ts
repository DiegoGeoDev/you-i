import { createContext, useContext } from "react";

import { OneToOneRelationshipValue } from "../one-to-one-relationship";

type ComponentContextType = {
  value: OneToOneRelationshipValue[] | null;
  onChange: (value: OneToOneRelationshipValue[] | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "OneToOneRelation components must be used within a OneToOneRelationWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
