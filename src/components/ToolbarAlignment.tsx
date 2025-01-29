import { Editor } from "@tiptap/react";
import { Button } from "@/primitives/Button";
import { AlignCenterIcon, AlignJustifyIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";

type Props = {
  editor: Editor;
};

export function ToolbarAlignment({ editor }: Props) {
  return (
    <>
      <Button
        variant="subtle"
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        disabled={!editor.can().chain().focus().setTextAlign("left").run()}
        data-active={editor.isActive({ textAlign: "left" }) ? "is-active" : undefined}
        aria-label="Align left"
      >
        <AlignLeftIcon />
      </Button>

      <Button
        variant="subtle"
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        disabled={!editor.can().chain().focus().setTextAlign("center").run()}
        data-active={editor.isActive({ textAlign: "center" }) ? "is-active" : undefined}
        aria-label="Align center"
      >
        <AlignCenterIcon />
      </Button>

      <Button
        variant="subtle"
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        disabled={!editor.can().chain().focus().setTextAlign("right").run()}
        data-active={editor.isActive({ textAlign: "right" }) ? "is-active" : undefined}
        aria-label="Align right"
      >
        <AlignRightIcon />
      </Button>

      <Button
        variant="subtle"
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        disabled={!editor.can().chain().focus().setTextAlign("justify").run()}
        data-active={editor.isActive({ textAlign: "justify" }) ? "is-active" : undefined}
        aria-label="Justify"
      >
        <AlignJustifyIcon />
      </Button>
    </>
  );
}
