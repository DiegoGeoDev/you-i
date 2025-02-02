import React from "react";

import { useComponentContext } from "./use-component-context";

import { PlacePickerAdvancedValue, PlaceType } from "../place-picker-advanced";

import { SearchAddressValue } from "@/components";

function usePlacePickerAdvancedAddress(placeType: PlaceType) {
  const { value, onChange } = useComponentContext();

  const [address, setAddress] = React.useState<SearchAddressValue | null>(
    () => {
      if (value?.label !== undefined) {
        return {
          osm_id: 0,
          address: {
            city: value?.address?.city,
            city_district: value?.address?.city,
            country: value?.address?.country,
            country_code: value?.address?.country,
            county: value?.address?.district,
            municipality: value?.address?.district,
            postcode: value?.address?.zipCode,
            road: undefined,
            state: value?.address?.state,
          },
          display_name: value.label,
          type: undefined,
          x: value.x,
          y: value.y,
        };
      }

      return null;
    }
  );

  // Clear state  on component dismount
  React.useEffect(() => {
    return () => setAddress(null);
  }, []);

  function handleAddress(searchAddress: SearchAddressValue | null) {
    if (searchAddress === null) return;

    const newValue: PlacePickerAdvancedValue = {
      placeID: undefined,
      address: {
        district:
          searchAddress?.address?.county ||
          searchAddress?.address?.municipality,
        city:
          searchAddress?.address?.city || searchAddress?.address?.city_district,
        state: searchAddress?.address?.state,
        country:
          searchAddress?.address?.country ||
          searchAddress?.address?.country_code,
        zipCode: searchAddress?.address?.postcode,
      },
      label: searchAddress.display_name,
      x: searchAddress.x,
      y: searchAddress.y,
      placeType,
    };

    setAddress(searchAddress);
    onChange(newValue);
  }

  return {
    address,
    handleAddress,
  };
}

export { usePlacePickerAdvancedAddress };
