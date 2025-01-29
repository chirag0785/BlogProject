import { Editor } from "@tiptap/react";
import { Button } from "@/primitives/Button";
import { BoldIcon, ItalicIcon, StrikethroughIcon } from "lucide-react";

type Props = {
  editor: Editor;
};

export function ToolbarInline({ editor }: Props) {
  return (
    <>
      <Button
        variant="subtle"
        className={`flex items-center p-2 hover:bg-gray-200 ${
          editor.isActive("bold") ? "bg-white" : ""}`}
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        
        aria-label="Bold"
      >
        <BoldIcon style={{ width: "18px" }} />
      </Button>

      <Button
        variant="subtle"
        className={`flex items-center p-2 hover:bg-gray-200 ${
            editor.isActive("italic") ? "bg-white" : ""}`}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        
        aria-label="Italic"
      >
        <ItalicIcon style={{ width: "18px" }} />
      </Button>

      <Button
        variant="subtle"
        className={`flex items-center p-2 hover:bg-gray-200 ${
            editor.isActive("strike") ? "bg-white" : ""}`}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        
        aria-label="Strikethrough"
      >
        <StrikethroughIcon style={{ width: "18px" }} />
      </Button>
    </>
  );
}
