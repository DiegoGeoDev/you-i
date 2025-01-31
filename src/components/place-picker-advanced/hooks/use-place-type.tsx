import { createContext, useContext, useState } from "react";

import { useComponentContext } from "./use-component-context";

import { NonEmptyArray, PlaceType } from "../place-picker-advanced";

type PlaceTypeProviderProps = {
  children: React.ReactNode;
  placeTypes: NonEmptyArray<PlaceType>;
};

type PlaceTypeProviderState = {
  placeTypes: NonEmptyArray<PlaceType>;
  placeType: PlaceType;
  handlePlaceType: (placeType: PlaceType) => void;
};

const initialState: PlaceTypeProviderState = {
  placeTypes: ["MapPoint", "Address", "Place"],
  placeType: "Place",
  handlePlaceType: () => null,
};

const PlaceTypeProviderContext =
  createContext<PlaceTypeProviderState>(initialState);

function PlaceTypeProvider({
  children,
  placeTypes,
  ...props
}: PlaceTypeProviderProps) {
  const { value } = useComponentContext();

  const [placeType, setPlaceType] = useState<PlaceType>(() => {
    if (value?.placeType !== undefined) return value.placeType;

    return placeTypes[0];
  });

  function handlePlaceType(placeType: PlaceType) {
    setPlaceType(placeType);
  }

  const placeTypeValue = {
    placeTypes,
    placeType,
    handlePlaceType,
  };

  return (
    <PlaceTypeProviderContext.Provider {...props} value={placeTypeValue}>
      {children}
    </PlaceTypeProviderContext.Provider>
  );
}

const usePlaceType = () => {
  const context = useContext(PlaceTypeProviderContext);
  if (context === undefined)
    throw new Error("usePlaceType must be used within a PlaceTypeProvider");
  return context;
};

export { PlaceTypeProvider, usePlaceType };
