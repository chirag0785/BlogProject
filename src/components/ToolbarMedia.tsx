import { Editor } from "@tiptap/react";
import { useState } from "react";
import { Button } from "@/primitives/Button";
import { Input } from "@/primitives/Input";
import { Popover } from "@/primitives/Popover";
import { Code2Icon, ImageIcon } from "lucide-react";
import { FaYoutube } from "react-icons/fa";

type Props = {
  editor: Editor;
};

export function ToolbarMedia({ editor }: Props) {
  function addImage(url: string) {
    if (!url.length) {
      return;
    }

    editor.chain().setImage({ src: url }).run();
  }

  function addYouTube(url: string) {
    if (!url.length) {
      return;
    }

    editor.chain().setYoutubeVideo({ src: url }).run();
  }

  return (
    <>
      <Button
        className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
        variant="subtle"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
        data-active={editor.isActive("codeBlock") ? "is-active" : undefined}
        aria-label="Code block"
      >
        <Code2Icon className="w-5 h-5" />
      </Button>

      <Popover content={<MediaPopover variant="image" onSubmit={addImage} />}>
        <Button
          className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
          variant="subtle"
          disabled={!editor.can().chain().setImage({ src: "" }).run()}
          data-active={editor.isActive("image") ? "is-active" : undefined}
          aria-label="Image"
        >
          <ImageIcon className="w-5 h-5" />
        </Button>
      </Popover>

      <Popover content={<MediaPopover variant="youtube" onSubmit={addYouTube} />}>
        <Button
          className="p-2 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50"
          variant="subtle"
          disabled={!editor.can().chain().setImage({ src: "" }).run()}
          data-active={editor.isActive("youtube") ? "is-active" : undefined}
          aria-label="YouTube"
        >
          <FaYoutube className="w-5 h-5" />
        </Button>
      </Popover>
    </>
  );
}

type MediaPopoverProps = {
  variant: "image" | "youtube";
  onSubmit: (url: string) => void;
};

function MediaPopover({ variant, onSubmit }: MediaPopoverProps) {
  const [value, setValue] = useState("");

  return (
    <form
      className="space-y-3 p-4 max-w-xs w-full bg-white rounded-lg shadow-lg"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
    >
      <label className="block text-sm font-medium text-gray-700" htmlFor="">
        Add {variant === "image" ? "image" : "YouTube"} URL
      </label>
      <div className="flex space-x-2">
        <Input
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Add {variant === "image" ? "image" : "video"}
        </Button>
      </div>
    </form>
  );
}
