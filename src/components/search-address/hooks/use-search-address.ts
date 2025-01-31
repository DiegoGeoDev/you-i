import { useState, useCallback, useEffect } from "react";

import { useDebounce } from "@/hooks/use-debounce";

import { SearchAddressValue, SearchOptions } from "../search-address";

type UseSearchAddressResult = {
  query: string;
  results: Record<string, SearchAddressValue[]>;
  loading: boolean;
  handleSearch: (value: string) => void;
};

type useSearchAddressType = {
  searchOptions: SearchOptions | undefined;
};

const useSearchAddress = ({
  searchOptions = {
    headers: {
      "Accept-Language": "pt-BR",
    },
  },
}: useSearchAddressType): UseSearchAddressResult => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Record<string, SearchAddressValue[]>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  const groupByType = useCallback(
    (data: any[]): Record<string, SearchAddressValue[]> => {
      return data.reduce((acc, item) => {
        const { osm_id, address, display_name, type, lat, lon } = item;

        console.log(item);

        const currentItem: SearchAddressValue = {
          osm_id,
          address: {
            city: address?.city,
            city_district: address?.city_district,
            country: address?.country,
            country_code: address?.country_code,
            county: address?.county,
            municipality: address?.municipality,
            postcode: address?.postcode,
            road: address?.road,
            state: address?.state,
          },
          display_name,
          type,
          x: Number(lon),
          y: Number(lat),
        };

        if (!acc[type]) {
          acc[type] = [];
        }

        const alreadyExists = acc[type].some(
          (item: SearchAddressValue) => item.display_name === display_name
        );

        if (!alreadyExists) {
          acc[type].push(currentItem);
        }

        return acc;
      }, {} as Record<string, SearchAddressValue[]>);
    },
    []
  );

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length > 2) {
        setLoading(true);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          debouncedQuery
        )}&format=json&addressdetails=1&limit=5`;
        const response = await fetch(url, {
          ...searchOptions,
        });
        const data = await response.json();

        setResults(groupByType(data));

        setLoading(false);
      } else {
        setResults({});
      }
    };

    fetchResults();
  }, [debouncedQuery, groupByType]);

  return {
    query,
    results,
    loading,
    handleSearch,
  };
};

export { useSearchAddress };
