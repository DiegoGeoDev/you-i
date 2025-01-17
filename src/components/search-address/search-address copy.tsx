import React from "react";
import { ChevronsUpDown } from "lucide-react";
import { CommandLoading } from "cmdk";

import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

import { useSearchAddress } from "./hooks";

import { cn } from "../../utils";

type SearchAddressResult = {
  address?: {
    city?: string;
    city_district?: string;
    country?: string;
    country_code?: string;
    county?: string;
    municipality?: string;
    postcode?: string;
    road?: string;
    state?: string;
  };
  display_name: string;
  type?: string;
  x: number;
  y: number;
};

type SearchAddressProps = {
  value: SearchAddressResult | undefined;
  setValue: (value: SearchAddressResult | undefined) => void;
  triggerPlaceholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  triggerClassName?: string;
  popoverContentClassName?: string;
  disabled?: boolean;
};

const SearchAddress: React.FC<SearchAddressProps> = ({
  value,
  setValue,
  triggerPlaceholder = "Pesquisar Lugar",
  searchPlaceholder = "Pesquise por um lugar",
  emptyPlaceholder = "Nenhum lugar encontrado",
  triggerClassName,
  popoverContentClassName,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const [location, setLocation] = React.useState(() => {
    if (value === undefined) return "";

    if (value.display_name === undefined) return `${value.x}, ${value.y}`;

    return value.display_name;
  });

  const { results, loading, handleSearch, selectedItem, setSelectedItem } =
    useSearchAddress();

  React.useEffect(() => {
    setValue(
      selectedItem !== null
        ? {
            address: selectedItem.address,
            display_name: selectedItem.display_name,
            type: selectedItem.type,
            x: selectedItem.x,
            y: selectedItem.y,
          }
        : undefined,
    );
  }, [selectedItem]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-80 justify-between truncate", triggerClassName)}
        >
          <p className="truncate">
            {selectedItem ? selectedItem.display_name : triggerPlaceholder}
          </p>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-80 p-0", popoverContentClassName)}>
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={(value) => handleSearch(value)}
            className="w-full"
          />
          <CommandList>
            {loading ? (
              <CommandLoading>
                <CommandEmpty>Digite para pesquisar</CommandEmpty>
              </CommandLoading>
            ) : Object.keys(results).length > 0 ? (
              Object.entries(results).map(([type, items]) => (
                <CommandGroup
                  key={type}
                  heading={type.charAt(0).toUpperCase() + type.slice(1)}
                >
                  {items.map((item, index) => (
                    <CommandItem
                      key={index}
                      value={item.display_name}
                      onSelect={(currentValue: string) => {
                        const item = results[type]?.find(
                          (item) => item.display_name === currentValue,
                        );
                        setLocation(
                          currentValue === location ? "" : currentValue,
                        );
                        setSelectedItem(item ?? null);
                        setOpen(false);
                      }}
                    >
                      {item.display_name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { type SearchAddressResult, SearchAddress };
