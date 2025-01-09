import { createContext, useContext } from "react";

import { OneToOneRelationshipValue } from "../one-to-one-relationship";

type ComponentContextType = {
  value: OneToOneRelationshipValue[] | undefined;
  onChange: (value: OneToOneRelationshipValue[] | undefined) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

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
