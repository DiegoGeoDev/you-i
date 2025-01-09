import { createContext, useContext } from "react";

import { TimePickerValue } from "../time-picker";

type ComponentContextType = {
  value: TimePickerValue | undefined;
  onChange: (value: TimePickerValue | undefined) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | undefined>(
  undefined
);

function useComponentContext() {
  const context = useContext(ComponentContext);
  if (!context) {
    throw new Error(
      "TimePicker components must be used within a TimePickerWrapper"
    );
  }
  return context;
}

export { ComponentContext, useComponentContext };
