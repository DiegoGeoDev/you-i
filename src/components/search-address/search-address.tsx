import React from "react";
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

import { ListComponent } from "@/components/list-component";

import { cn } from "@/lib/utils";

import { useSearchAddress } from "./hooks";

import { ComponentContext, useComponentContext } from "./hooks";

type SearchOptions = {
  headers?: {
    "Accept-Language": string;
  };
};

type SearchAddressValue = {
  osm_id: number;
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

type SearchAddressWrapperProps = React.ComponentPropsWithoutRef<
  typeof Button
> & {
  value: SearchAddressValue | null;
  onChange: (value: SearchAddressValue | null) => void;
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
    const [open, setOpen] = React.useState(false);

    return (
      <ComponentContext.Provider value={{ value, onChange }}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              aria-expanded={open}
              data-is-null={value === null}
              className={cn(
                `
                w-full justify-between truncate font-normal 
                data-[is-null=true]:text-muted-foreground
                `,
                className
              )}
              {...props}
            >
              <p className="truncate">
                {value ? value.display_name : placeholder}
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
                <ListComponent
                  data={items || []}
                  renderItem={(item) => (
                    <CommandItem
                      key={item.osm_id}
                      value={item.display_name}
                      onSelect={(currentValue: string) => {
                        const item = results[type]?.find(
                          (item) => item.display_name === currentValue
                        );
                        onChange(item ?? null);
                      }}
                    >
                      {item.display_name}
                    </CommandItem>
                  )}
                />
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
