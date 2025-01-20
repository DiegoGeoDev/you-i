import React, { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { CommandLoading } from "cmdk";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";

import { useSearchAddress } from "./hooks";

import { ComponentContext, useComponentContext } from "./hooks";

type SearchOptions = {
  headers?: {
    "Accept-Language": string;
  };
};

type SearchAddressValue = {
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

type SearchAddressWrapperProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: SearchAddressValue | undefined;
  onChange: (value: SearchAddressValue | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
};

const SearchAddressWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  SearchAddressWrapperProps
>(
  (
    {
      value,
      onChange,
      disabled = false,
      placeholder = "Search for an address",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);

    // innerValue to work with defaultValues (react-hook-form)
    const [innerValue, setInnerValue] = useState(value);

    function _onChange(value: SearchAddressValue | undefined) {
      onChange(value);
      setInnerValue(value);
    }

    return (
      <ComponentContext.Provider
        value={{ value: innerValue, onChange: _onChange }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              aria-expanded={open}
              data-is-undefined={innerValue === undefined}
              className={cn(
                `
                w-full justify-between truncate font-normal 
                data-[is-undefined=true]:text-muted-foreground
                `,
                className
              )}
              {...props}
            >
              <p className="truncate">
                {innerValue ? innerValue.display_name : placeholder}
              </p>
              <ChevronsUpDown className="ml-2" size="16" />
            </Button>
          </PopoverTrigger>
          {children}
        </Popover>
      </ComponentContext.Provider>
    );
  }
);
SearchAddressWrapper.displayName = "SearchAddressWrapper";

type SearchAddressContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverContent
>;

const SearchAddressContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  SearchAddressContentProps
>(({ className, children, ...props }, ref) => {
  return (
    <PopoverContent
      ref={ref}
      className={cn("w-[300px] p-0", className)}
      forceMount={true}
      {...props}
    >
      {children}
    </PopoverContent>
  );
});
SearchAddressContent.displayName = "SearchAddressContent";

type SearchAddressCommandProps = React.ComponentPropsWithoutRef<
  typeof Command
> & {
  placeholder?: string;
  emptyText?: string;
  searchOptions?: SearchOptions;
};

const SearchAddressCommand = React.forwardRef<
  React.ElementRef<typeof Command>,
  SearchAddressCommandProps
>(
  (
    {
      placeholder = "Type to search",
      emptyText = "No results found",
      searchOptions,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { onChange } = useComponentContext();
    const { results, loading, handleSearch } = useSearchAddress({
      searchOptions,
    });

    return (
      <Command ref={ref} {...props}>
        <CommandInput
          placeholder={placeholder}
          onValueChange={(value) => handleSearch(value)}
          className={cn("w-full", className)}
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
                        (item) => item.display_name === currentValue
                      );
                      onChange(item ?? undefined);
                    }}
                  >
                    {item.display_name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))
          ) : (
            <CommandEmpty>{emptyText}</CommandEmpty>
          )}
        </CommandList>
      </Command>
    );
  }
);
SearchAddressCommand.displayName = "SearchAddressCommand";

export { type SearchAddressValue, type SearchOptions };
export { SearchAddressWrapper, SearchAddressContent, SearchAddressCommand };
