import clsx from "clsx";
import Link from "next/link";
import { ComponentProps, ReactNode, forwardRef } from "react";

// Button component with Tailwind CSS classes
interface Props {
  variant?: "primary" | "secondary" | "subtle" | "destructive";
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ComponentProps<"button"> & Props>(
  ({ variant = "primary", icon, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        className,
        "inline-flex items-center px-4 py-2 rounded-md focus:outline-none transition-colors",
        icon && !children ? "p-2" : "space-x-2", // Adjust spacing if icon is present
        {
          // Primary button style
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          // Secondary button style
          "bg-gray-600 text-white hover:bg-gray-700": variant === "secondary",
          // Subtle button style
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "subtle",
          // Destructive button style
          "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
        }
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children && <span>{children}</span>}
    </button>
  )
);

export function LinkButton({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & Props) {
  return (
    <Link
      className={clsx(
        className,
        "inline-flex items-center px-4 py-2 rounded-md focus:outline-none transition-colors",
        icon && !children ? "p-2" : "space-x-2", // Adjust spacing if icon is present
        {
          // Primary button style
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          // Secondary button style
          "bg-gray-600 text-white hover:bg-gray-700": variant === "secondary",
          // Subtle button style
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "subtle",
          // Destructive button style
          "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
        }
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children && <span>{children}</span>}
    </Link>
  );
}
