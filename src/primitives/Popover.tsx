import * as RadixPopover from "@radix-ui/react-popover";
import { ReactNode } from "react";

interface Props
  extends RadixPopover.PopoverProps,
    Pick<
      RadixPopover.PopoverContentProps,
      "side" | "sideOffset" | "align" | "alignOffset"
    > {
  content: ReactNode;
  aboveOverlay?: boolean;
  children: ReactNode;
}

export function Popover({
  content,
  children,
  side,
  sideOffset,
  align,
  alignOffset,
  aboveOverlay,
  ...props
}: Props) {
  return (
    <RadixPopover.Root {...props}>
      <RadixPopover.Trigger asChild>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
            shadow-lg rounded-md p-4 
            ${aboveOverlay ? 'z-[999]' : ''}
          `}
          collisionPadding={10}
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          {content}
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
}

Popover.displayName = "Popover";