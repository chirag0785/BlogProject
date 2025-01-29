"use client";

import { Editor } from "@tiptap/react";
import { useCallback, useRef } from "react";
import { Button } from "@/primitives/Button";
import { FaComments } from "react-icons/fa";

type Props = {
  editor: Editor;
};

export function ToolbarThread({ editor }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(async () => {
    editor.chain().focus().addPendingComment().run();
  }, [editor]);

  return (
    <div ref={wrapper}>
      <Button
        variant="subtle"
        className="flex items-center p-2 hover:bg-gray-200"
        onClick={handleClick}
        disabled={editor.isActive("lb-comment")}
        data-active={editor.isActive("lb-comment") ? "is-active" : undefined}
        aria-label="Add comment"
      >
        <FaComments style={{ width: "18px", height: "18px" }} />
      </Button>
    </div>
  );
}
