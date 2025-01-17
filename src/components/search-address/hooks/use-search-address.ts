import { useState, useCallback, useEffect } from "react";
import { SearchAddressResult } from "../search-address";
import { useDebounce } from "./use-debounce";

type UseSearchAddressResult = {
  query: string;
  results: Record<string, SearchAddressResult[]>;
  loading: boolean;
  handleSearch: (value: string) => void;
  selectedItem: SearchAddressResult | null;
  setSelectedItem: (item: SearchAddressResult | null) => void;
};

const useSearchAddress = (): UseSearchAddressResult => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Record<string, SearchAddressResult[]>>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchAddressResult | null>(
    null,
  );

  const debouncedQuery = useDebounce(query, 500);

  const groupByType = useCallback(
    (data: any[]): Record<string, SearchAddressResult[]> => {
      return data.reduce(
        (acc, item) => {
          const { address, display_name, type, lat, lon } = item;

          const currentItem: SearchAddressResult = {
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
            (item: SearchAddressResult) => item.display_name === display_name,
          );

          if (!alreadyExists) {
            acc[type].push(currentItem);
          }

          return acc;
        },
        {} as Record<string, SearchAddressResult[]>,
      );
    },
    [],
  );

  const handleSearch = (value: string) => {
    setQuery(value);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedQuery.length > 2) {
        setLoading(true);

        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedQuery)}&format=json&addressdetails=1&limit=5`;
        const response = await fetch(url, {
          headers: {
            "Accept-Language": "pt-BR",
          },
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
    selectedItem,
    setSelectedItem,
  };
};

export { useSearchAddress };
