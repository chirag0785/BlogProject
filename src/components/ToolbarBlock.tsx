import { Editor } from "@tiptap/react";
import { Button } from "@/primitives/Button";
import { CheckCheckIcon, ListOrderedIcon } from "lucide-react";
import { FaListUl } from "react-icons/fa";
import { ComponentProps } from "react";

type Props = {
  editor: Editor;
};

function BlockquoteIcon(props: ComponentProps<"svg">) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm5 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm0 3a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1h-6zm-5 3a.5.5 0 0 0 0 1h11a.5.5 0 0 0 0-1h-11zm.79-5.373c.112-.078.26-.17.444-.275L3.524 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282c.024-.203.065-.37.123-.498a1.38 1.38 0 0 1 .252-.37 1.94 1.94 0 0 1 .346-.298zm2.167 0c.113-.078.262-.17.445-.275L5.692 6c-.122.074-.272.17-.452.287-.18.117-.35.26-.51.428a2.425 2.425 0 0 0-.398.562c-.11.207-.164.438-.164.692 0 .36.072.65.217.873.144.219.385.328.72.328.215 0 .383-.07.504-.211a.697.697 0 0 0 .188-.463c0-.23-.07-.404-.211-.521-.137-.121-.326-.182-.568-.182h-.282a1.75 1.75 0 0 1 .118-.492c.058-.13.144-.254.257-.375a1.94 1.94 0 0 1 .346-.3z" />
    </svg>
  );
}

export function ToolbarBlock({ editor }: Props) {
  return (
    <>
      <Button
        className={`px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
          editor.isActive("bulletList") ? "bg-white" : ""}`}
        variant="subtle"
        onClick={() => {
            editor.chain().focus().toggleBulletList().run();
        }}
        disabled={!editor.can().chain().focus().toggleBulletList().run()}
        aria-label="Unordered list"
      >
        <FaListUl />
      </Button>

      <Button
        className={`px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
            editor.isActive("orderedList") ? "bg-white" : ""}`}
        variant="subtle"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
        
        aria-label="Ordered list"
      >
        <ListOrderedIcon />
      </Button>

      <Button
        className={`px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
            editor.isActive("blockquote") ? "bg-white" : ""}`}
        variant="subtle"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
        aria-label="Blockquote"
      >
        <BlockquoteIcon />
      </Button>

      <Button
        className={`px-3 py-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
            editor.isActive("taskList") ? "bg-white" : ""}`}
        variant="subtle"
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={!editor.can().chain().focus().toggleTaskList().run()}
        aria-label="Task list"
      >
        <CheckCheckIcon style={{ width: "16px" }} />
      </Button>
    </>
  );
}
