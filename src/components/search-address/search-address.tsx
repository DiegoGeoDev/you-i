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

type SearchAddressItem = Record<"value" | "label", string>;

type SearchAddressValue = string;

type SearchAddressWrapperProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: SearchAddressValue | undefined;
  onChange: (value: SearchAddressValue | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  items: SearchAddressItem[];
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
      placeholder = "Choose an option",
      items,
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
        value={{ value: innerValue, onChange: _onChange, items }}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-expanded={open}
              data-is-undefined={innerValue === undefined}
              className={cn(
                `
                w-full justify-between font-normal 
                data-[is-undefined=true]:text-muted-foreground
                `,
                className
              )}
              {...props}
            >
              {innerValue
                ? items.find((item) => item.value === innerValue)?.label
                : placeholder}
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

export { type SearchAddressValue, type SearchAddressItem };
export { SearchAddressWrapper };
