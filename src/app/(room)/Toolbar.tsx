import { Editor } from "@tiptap/react";
import { ToolbarInlineAdvanced } from "@/components/TextInlineAdvanced";
import { ToolbarAlignment } from "@/components/ToolbarAlignment";
import { ToolbarBlock } from "@/components/ToolbarBlock";
import { ToolbarCommands } from "@/components/ToolbarCommands";
import { ToolbarHeadings } from "@/components/ToolbarHeadings";
import { ToolbarInline } from "@/components/ToolbarInline";
import { ToolbarMedia } from "@/components/ToolbarMedia";
import { ToolbarThread } from "@/components/ToolbarThread";
import { ThemeToggle } from "@/components/ThemeToggle";

type Props = {
  editor: Editor;
};

export function Toolbar({ editor }: Props) {
  return (
    <div className="flex flex-wrap space-x-4 p-4 bg-gray-300 text-black">
      <div className="flex-none mb-2">
        <ThemeToggle />
      </div>
      <div className="flex-none mb-2">
        <ToolbarCommands editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarHeadings editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarInline editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarInlineAdvanced editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarAlignment editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarBlock editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarMedia editor={editor} />
      </div>
      <div className="flex-none mb-2">
        <ToolbarThread editor={editor} />
      </div>
    </div>
  );
}
