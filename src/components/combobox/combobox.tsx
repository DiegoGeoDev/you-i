import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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

import { ComponentContext, useComponentContext } from "./hooks";

type ComboboxItem = Record<"value" | "label", string>;

type ComboboxValue = string;

type ComboboxWrapperProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: ComboboxValue | undefined;
  onChange: (value: ComboboxValue | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  items: ComboboxItem[];
};

const ComboboxWrapper = React.forwardRef<
  React.ElementRef<typeof Button>,
  ComboboxWrapperProps
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

    function _onChange(value: ComboboxValue | undefined) {
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
ComboboxWrapper.displayName = "ComboboxWrapper";

type ComboboxContentProps = React.ComponentPropsWithoutRef<
  typeof PopoverContent
>;

const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  ComboboxContentProps
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
ComboboxContent.displayName = "ComboboxContent";

type ComboboxCommandProps = React.ComponentPropsWithoutRef<typeof Command> & {
  placeholder?: string;
  emptyText?: string;
};

const ComboboxCommand = React.forwardRef<
  React.ElementRef<typeof Command>,
  ComboboxCommandProps
>(({ placeholder, emptyText, className, children, ...props }, ref) => {
  const { value, onChange, items } = useComponentContext();

  return (
    <Command ref={ref} {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {items.map((item) => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={(currentValue) => {
                onChange(currentValue === value ? "" : currentValue);
              }}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === item.value ? "opacity-100" : "opacity-0"
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
});
ComboboxCommand.displayName = "ComboboxCommand";

export { type ComboboxValue, type ComboboxItem };
export { ComboboxWrapper, ComboboxContent, ComboboxCommand };
