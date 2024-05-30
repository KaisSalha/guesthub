import React, { useMemo, useState, useRef, useEffect, forwardRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "../lib";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "./scroll-area";

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  triggerLabel?: string;
  searchLabel?: string;
  emptyLabel?: string;
}

export const Combobox = forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      triggerLabel = "Select an option",
      searchLabel = "Search...",
      emptyLabel = "No options found",
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [buttonWidth, setButtonWidth] = useState(0);

    useEffect(() => {
      if (buttonRef.current) {
        setButtonWidth(buttonRef.current.offsetWidth);
      }
    }, [buttonRef.current?.offsetWidth]);

    const selected = useMemo(
      () => options.find((option) => option.value === value),
      [options, value]
    );

    return (
      <div className="flex flex-row w-full" ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={buttonRef}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="flex flex-row justify-between w-full"
            >
              <div className="flex flex-row justify-between w-full">
                {selected ? selected.label : triggerLabel}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            style={{
              width: buttonWidth,
            }}
            side="bottom"
            avoidCollisions={false}
          >
            <Command>
              <CommandInput placeholder={searchLabel} />
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              <ScrollArea className="max-h-60">
                <CommandList>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={(currentValue) => {
                          onChange(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                        className="hover:cursor-pointer"
                        keywords={[option.label]}
                      >
                        <CheckIcon
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);
