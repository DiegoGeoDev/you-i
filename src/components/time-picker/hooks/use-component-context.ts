import { createContext, useContext } from "react";

import { TimePickerValue } from "../time-picker";

type ComponentContextType = {
  value: TimePickerValue | null;
  onChange: (value: TimePickerValue | null) => void;
  disabled?: boolean;
};

const ComponentContext = createContext<ComponentContextType | null>(null);

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
