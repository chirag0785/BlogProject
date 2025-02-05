import clsx from "clsx";
import {
  ChangeEvent,
  ComponentProps,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CheckCheckIcon } from "lucide-react";

interface Props extends ComponentProps<"div"> {
  initialValue: boolean;
  onValueChange?: (value: boolean) => void;
  checked: boolean;
  name?: string;
  disabled?: boolean;
}

export function Checkbox({
  initialValue = false,
  onValueChange = () => {},
  checked = false,
  name,
  disabled = false,
  id,
  className,
  ...props
}: Props) {
  const [internalChecked, setInternalChecked] = useState(initialValue);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInternalChecked(event.target.checked);
      onValueChange(event.target.checked);
    },
    [onValueChange]
  );

  useEffect(() => {
    setInternalChecked(checked);
  }, [checked]);

  return (
    <div
      className={clsx(
        "flex items-center justify-center cursor-pointer",
        className
      )}
      {...props}
    >
      <input
        className="hidden"
        type="checkbox"
        name={name}
        id={id}
        checked={internalChecked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span
        className={clsx(
          "flex items-center justify-center w-6 h-6 border rounded-md transition-all",
          internalChecked
            ? "bg-blue-500 border-blue-500"
            : "bg-white border-gray-300",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        {internalChecked && (
          <CheckCheckIcon className="w-4 h-4 text-white" />
        )}
      </span>
    </div>
  );
}
Checkbox.displayName = "Checkbox";