import { Editor } from "@tiptap/react";
import { useState } from "react";
import { Button } from "@/primitives/Button";
import { Input } from "@/primitives/Input";
import { Popover } from "@/primitives/Popover";
import { CodeIcon, CrossIcon, HighlighterIcon, LinkIcon } from "lucide-react";

type Props = {
  editor: Editor;
};

export function ToolbarInlineAdvanced({ editor }: Props) {
  function toggleLink(link: string) {
    editor.chain().focus().toggleLink({ href: link }).run();
  }

  return (
    <>
      <Button
        variant="subtle"
        className="flex items-center p-2 hover:bg-gray-200"
        onClick={() => {
            editor.chain().focus().toggleCode().run();
            console.log(editor.getHTML())
        }}
        disabled={!editor.can().chain().focus().toggleCode().run()}
        data-active={editor.isActive("code") ? "is-active" : undefined}
        aria-label="Code"
      >
        <CodeIcon style={{ width: "18px" }} />
      </Button>

      <Button
        variant="subtle"
        className="flex items-center p-2 hover:bg-gray-200"
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        disabled={!editor.can().chain().focus().toggleHighlight().run()}
        data-active={editor.isActive("highlight") ? "is-active" : undefined}
        aria-label="Highlight"
      >
        <HighlighterIcon style={{ width: "18px" }} />
      </Button>

      <Popover
        content={
          <LinkPopover
            onSubmit={toggleLink}
            onRemoveLink={toggleLink}
            showRemove={editor.getAttributes("link").href}
          />
        }
      >
        <Button
          variant="subtle"
          className="flex items-center p-2 hover:bg-gray-200"
          disabled={!editor.can().chain().focus().setLink({ href: "" }).run()}
          data-active={editor.isActive("link") ? "is-active" : undefined}
          aria-label="Link"
        >
          <LinkIcon style={{ width: "17px" }} />
        </Button>
      </Popover>
    </>
  );
}

type LinkPopoverProps = {
  onSubmit: (url: string) => void;
  onRemoveLink: (url: string) => void;
  showRemove: boolean;
};

function LinkPopover({ onSubmit, onRemoveLink, showRemove }: LinkPopoverProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-4 p-4 max-w-xs w-full"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label className="text-sm font-medium text-gray-700" htmlFor="">
        Add link to selected text
      </label>
      <div className="flex items-center space-x-2">
        <Input
          className="flex-1 border border-gray-300 rounded-md p-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {showRemove ? (
          <Button
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveLink(value);
            }}
            aria-label="Remove link"
            className="flex items-center p-2 text-red-500 hover:bg-red-100"
          >
            <CrossIcon />
          </Button>
        ) : null}
        <Button className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md">
          Add link
        </Button>
      </div>
    </form>
  );
}
