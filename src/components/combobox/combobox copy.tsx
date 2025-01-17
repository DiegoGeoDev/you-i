import * as React from "react";
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

type ComboboxItem = Record<"value" | "label", string>;

type ComboboxProps = {
  value: string | undefined;
  setValue: (value: string | undefined) => void;
  items: ComboboxItem[];
  triggerPlaceholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  triggerClassName?: string;
  popoverContentClassName?: string;
  disabled?: boolean;
};

function Combobox({
  value,
  setValue,
  items,
  triggerPlaceholder = "Escolha uma opção",
  searchPlaceholder = "Pesquise por uma opção",
  emptyPlaceholder = "Nenhuma opção encontrada",
  triggerClassName,
  popoverContentClassName,
  disabled = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", triggerClassName)}
          disabled={disabled}
        >
          {value
            ? items.find((item) => item.value === value)?.label
            : triggerPlaceholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[200px] p-0", popoverContentClassName)}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
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
      </PopoverContent>
    </Popover>
  );
}

export { type ComboboxItem, Combobox };
