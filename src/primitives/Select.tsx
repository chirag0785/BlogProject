import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import { CheckCheckIcon, TextSelectIcon } from "lucide-react";

interface Item extends RadixSelect.SelectItemProps {
  value: string;
  title?: string;
  description?: string;
}

interface Props extends Omit<RadixSelect.SelectProps, "onValueChange"> {
  variant?: "regular" | "subtle";
  initialValue?: string;
  value?: string;
  items: Item[];
  onChange?: RadixSelect.SelectProps["onValueChange"];
  placeholder?: RadixSelect.SelectValueProps["placeholder"];
  aboveOverlay?: boolean;
  className?: RadixSelect.SelectTriggerProps["className"];
}

export function Select({
  variant = "regular",
  initialValue,
  value,
  items,
  onChange,
  placeholder,
  aboveOverlay,
  className,
  ...props
}: Props) {
  const [internalValue, setInternalValue] = useState(initialValue);

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (newValue !== undefined) {
        setInternalValue(newValue);
        onChange?.(newValue);
      }
    },
    [onChange]
  );

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <RadixSelect.Root
      value={internalValue}
      onValueChange={handleValueChange}
      defaultValue={initialValue}
      {...props}
    >
      <RadixSelect.Trigger
        className={clsx(className, "flex items-center justify-between p-2 border rounded-md text-sm", {
          "bg-gray-100 hover:bg-gray-200": variant === "subtle",
          "bg-white border-gray-300": variant === "regular",
        })}
      >
        <RadixSelect.Value
          placeholder={placeholder}
          className="text-gray-700"
        />
        <RadixSelect.Icon className="w-5 h-5 text-gray-400">
          <TextSelectIcon />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <RadixSelect.Content
          className="bg-white border border-gray-300 rounded-md shadow-lg mt-2"
          style={
            {
              zIndex: aboveOverlay ? "var(--z-overlay)" : undefined,
            } as CSSProperties
          }
        >
          <RadixSelect.Viewport>
            {items.map(({ value, title, description, ...props }) => (
              <RadixSelect.Item
                key={value}
                value={value}
                className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
                {...props}
              >
                <div className="mr-2">
                  <RadixSelect.ItemIndicator>
                    <CheckCheckIcon className="w-4 h-4 text-blue-500" />
                  </RadixSelect.ItemIndicator>
                </div>
                <div className="flex flex-col">
                  <RadixSelect.ItemText className="font-medium text-gray-800">
                    {title ?? value}
                  </RadixSelect.ItemText>
                  {description && (
                    <span className="text-sm text-gray-500">{description}</span>
                  )}
                </div>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

Select.displayName = "Select";