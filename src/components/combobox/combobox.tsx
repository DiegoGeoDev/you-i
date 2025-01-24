import React from "react";
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

import { ListComponent } from "@/components/list-component";

import { cn } from "@/lib/utils";

import { ComponentContext, useComponentContext } from "./hooks";

type ComboboxItem = Record<"value" | "label", string>;

type ComboboxValue = string;

type ComboboxWrapperProps = React.ComponentPropsWithoutRef<typeof Button> & {
  value: ComboboxValue | null;
  onChange: (value: ComboboxValue | null) => void;
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
    const [open, setOpen] = React.useState(false);

    return (
      <ComponentContext.Provider value={{ value, onChange, items }}>
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
                {value
                  ? items.find((item) => item.value === value)?.label
                  : placeholder}
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
>(
  (
    {
      placeholder = "Type to search",
      emptyText = "No results found",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { value, onChange, items } = useComponentContext();

    return (
      <Command ref={ref} className={cn(className)} {...props}>
        <CommandInput placeholder={placeholder} />
        <CommandList>
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            <ListComponent
              data={items || []}
              renderItem={(item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? null : currentValue);
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
              )}
            />
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
);
ComboboxCommand.displayName = "ComboboxCommand";

export { type ComboboxValue, type ComboboxItem };
export { ComboboxWrapper, ComboboxContent, ComboboxCommand };
