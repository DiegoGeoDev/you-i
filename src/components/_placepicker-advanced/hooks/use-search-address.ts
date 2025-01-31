import { useState } from "react";

import { SearchAddressResult } from "@opt/ui";

import { Place } from "../placepicker-advanced";

function useSearchAddress(
  value: Place | undefined,
  setValue: (value: Place | undefined) => void,
  updateMarkerValue: (value: Place | undefined) => void
) {
  const [searchAddress, setSearchAddress] = useState<
    SearchAddressResult | undefined
  >(() => {
    if (value?.label !== undefined) {
      return {
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
        type: "Address",
        x: value.x,
        y: value.y,
      };
    }

    return undefined;
  });

  function handleSearchAddress(location: SearchAddressResult | undefined) {
    if (location) {
      setSearchAddress(location);

      const newValue: Place = {
        placeID: undefined,
        address: {
          district:
            location?.address?.county || location?.address?.municipality,
          city: location?.address?.city || location?.address?.city_district,
          state: location?.address?.state,
          country:
            location?.address?.country || location?.address?.country_code,
          zipCode: location?.address?.postcode,
        },
        label: location.display_name,
        x: location.x,
        y: location.y,
        locationType: "Address",
      };

      updateMarkerValue(newValue);

      setValue(newValue);
    }
  }

  function handleClearSearchAddress() {
    setSearchAddress(undefined);
  }

  return { searchAddress, handleSearchAddress, handleClearSearchAddress };
}

export { useSearchAddress };
