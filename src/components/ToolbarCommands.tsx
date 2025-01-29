import { Editor } from "@tiptap/react";
import { Button } from "@/primitives/Button";
import { RedoIcon, UndoIcon } from "lucide-react";

type Props = {
  editor: Editor;
};

export function ToolbarCommands({ editor }: Props) {
  return (
    <>
      <Button
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
        variant="subtle"
        onClick={() => editor.chain().undo().run()}
        disabled={!editor.can().chain().undo().run()}
        data-active={editor.isActive("bulletList") ? "is-active" : undefined}
        aria-label="Undo"
      >
        <UndoIcon />
      </Button>

      <Button
        className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50"
        variant="subtle"
        onClick={() => editor.chain().redo().run()}
        disabled={!editor.can().chain().redo().run()}
        data-active={editor.isActive("orderedList") ? "is-active" : undefined}
        aria-label="Redo"
      >
        <RedoIcon />
      </Button>
    </>
  );
}
