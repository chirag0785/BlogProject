"use client";

import {
  ClientSideSuspense,
  useRoom,
  useThreads,
} from "@liveblocks/react/suspense";
import { motion } from "framer-motion";
import {
  FloatingComposer,
  FloatingThreads,
  useLiveblocksExtension,
} from "@liveblocks/react-tiptap";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CustomTaskItem } from "@/components/CustomTaskItem";
import { SelectionMenu } from "@/components/SelectionMenu";
import { Toolbar } from "./Toolbar";
import { Avatars } from "@/components/Avatars";
import { Loader2 } from "lucide-react";
import { EditorView } from "prosemirror-view";
import HardBreak from "@tiptap/extension-hard-break";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import Table from "@tiptap/extension-table";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Dropcursor from "@tiptap/extension-dropcursor";
import { useToast } from "@/components/ui/use-toast";
import { ImageExtension } from "@harshtalks/image-tiptap";
import "tiptap-extension-upload-image/dist/upload-image.min.css";

export function TextEditor({
  initialContent = "",
  roomId,
}: {
  initialContent?: string;
  roomId: string;
}) {
  return (
    <ClientSideSuspense fallback={<Loader2 className="animate-spin" />}>
      <Editor initialContent={initialContent} roomId={roomId} />
    </ClientSideSuspense>
  );
}

export function Editor({
  initialContent = "",
  roomId,
}: {
  initialContent?: string;
  roomId: string;
}) {
  const liveblocks = useLiveblocksExtension({
    initialContent: initialContent,
  });
  const room = useRoom();

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      room.getStorage().then((storage) => {
        storage.root.set("content", content);
      });
    },
    editorProps: {
      attributes: {
        class:
          "flex-grow w-full max-h-screen p-4 dark:bg-gray-900 dark:text-white", // Dark mode enabled here
      },
    },
    extensions: [
      liveblocks,
      ImageExtension.configure({
        inline: true,
        HTMLAttributes: {
          class: "tiptap-image dark:border-gray-700", // Dark mode support for images
        },
      }),
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote dark:text-white", // Dark mode support for blockquote
          },
        },
        code: {
          HTMLAttributes: {
            class: "tiptap-code dark:text-white", // Dark mode support for code
          },
        },
        codeBlock: {
          languageClassPrefix: "language-",
          HTMLAttributes: {
            class: "tiptap-code-block dark:text-white", // Dark mode support for code block
            spellcheck: false,
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "tiptap-heading dark:text-white", // Dark mode support for headings
          },
        },
        history: false,
        horizontalRule: {
          HTMLAttributes: {
            class: "tiptap-hr dark:border-gray-700", // Dark mode support for horizontal rule
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item dark:text-white", // Dark mode support for list items
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "tiptap-ordered-list dark:text-white", // Dark mode support for ordered list
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph dark:text-white", // Dark mode support for paragraphs
          },
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: "tiptap-highlight dark:bg-yellow-500", // Dark mode support for highlighted text
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image dark:border-gray-700", // Dark mode support for images
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "tiptap-link dark:text-blue-500", // Dark mode support for links
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "Heading…";
          }
          return "Type something amazing...";
        },
        emptyEditorClass:
          "before:content-[attr(data-placeholder)] before:text-gray-400 before:absolute before:top-0 before:left-0",
      }),
      CustomTaskItem,
      TaskList.configure({
        HTMLAttributes: {
          class: "tiptap-task-list dark:text-white", // Dark mode support for task lists
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Youtube.configure({
        modestBranding: true,
        HTMLAttributes: {
          class: "tiptap-youtube dark:border-gray-700", // Dark mode support for YouTube videos
        },
      }),
      HardBreak, // Keep HardBreak here
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "tiptap-table dark:border-gray-700", // Dark mode support for tables
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Dropcursor.configure({
        color: "blue",
        width: 2,
      }),
    ],
  });

  const { threads } = useThreads();

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-300">
      <div className="mx-auto w-full max-w-5xl flex flex-col flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Toolbar */}
        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 dark:border-gray-800 backdrop-blur">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {editor && <Toolbar editor={editor} />}
          </motion.div>
          <Avatars />
        </div>

        {/* Editor */}
        <div className="flex-1 px-6 py-4 overflow-auto prose dark:prose-invert max-w-none">
          {editor && <SelectionMenu editor={editor} />}
          <EditorContent
            editor={editor}
            className="prose dark:prose-invert max-w-none leading-relaxed focus:outline-none"
          />
          <FloatingComposer editor={editor} style={{ width: "350px" }} />
          <FloatingThreads threads={threads} editor={editor} />
        </div>
      </div>
    </div>
  );
}

EditorView.prototype.updateState = function updateState(state) {
  // @ts-ignore
  if (!this.docView) return;
  // @ts-ignore
  this.updateStateInner(state, this.state.plugins != state.plugins);
};
