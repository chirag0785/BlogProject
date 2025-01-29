'use client';

import { ClientSideSuspense, useThreads } from '@liveblocks/react/suspense';
import {
  FloatingComposer,
  FloatingThreads,
  useLiveblocksExtension,
} from '@liveblocks/react-tiptap';
import Highlight from '@tiptap/extension-highlight';
import { Image } from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import { TextAlign } from '@tiptap/extension-text-align';
import { Typography } from '@tiptap/extension-typography';
import Youtube from '@tiptap/extension-youtube';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CustomTaskItem } from '@/components/CustomTaskItem';
import { SelectionMenu } from '@/components/SelectionMenu';
import { Toolbar } from './Toolbar';
import { Avatars } from '@/components/Avatars';
import { Loader2 } from 'lucide-react';
import { EditorView } from 'prosemirror-view';
import HardBreak from '@tiptap/extension-hard-break';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import Table from '@tiptap/extension-table';
import Strike from '@tiptap/extension-strike';
import Underline from '@tiptap/extension-underline';
import Dropcursor from '@tiptap/extension-dropcursor';

export function TextEditor({initialContent=''}: {initialContent?: string}) {
  return (
    <ClientSideSuspense fallback={<Loader2 className="animate-spin" />}>
      <Editor initialContent={initialContent} />
    </ClientSideSuspense>
  );
}

export function Editor({ initialContent='' }: { initialContent?: string }) {
  const liveblocks = useLiveblocksExtension({
    initialContent:initialContent,
  });

  // Set up editor with plugins, and place user info into Yjs awareness and cursors
  const editor = useEditor({
    immediatelyRender:false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg focus:outline-none', // Tailwind class for styling editor
      },
    },
    extensions: [
      liveblocks,
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: 'tiptap-blockquote',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'tiptap-code',
          },
        },
        codeBlock: {
          languageClassPrefix: 'language-',
          HTMLAttributes: {
            class: 'tiptap-code-block',
            spellcheck: false,
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'tiptap-heading',
          },
        },
        history: false,
        horizontalRule: {
          HTMLAttributes: {
            class: 'tiptap-hr',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: 'tiptap-paragraph',
          },
        },
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'tiptap-highlight',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'tiptap-image',
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'tiptap-link',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing…',
        emptyEditorClass: 'tiptap-empty',
      }),
      CustomTaskItem,
      TaskList.configure({
        HTMLAttributes: {
          class: 'tiptap-task-list',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      Youtube.configure({
        modestBranding: true,
        HTMLAttributes: {
          class: 'tiptap-youtube',
        },
      }),
      HardBreak,  // Keep HardBreak here
      Underline,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
      Dropcursor.configure({
        color: 'blue',
        width: 2,
      }),
    ],
  });
  
  editor?.on('update',()=>{
    
  })
  console.log(editor?.getHTML());

  const { threads } = useThreads();

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        {editor && <Toolbar editor={editor} />}
        <Avatars />
      </div>
      <div className="flex flex-col items-center justify-start flex-1 p-4 space-y-4 w-full">
        {editor && <SelectionMenu editor={editor} />}
        <EditorContent editor={editor} className="w-full h-full" />
        <FloatingComposer editor={editor} style={{ width: '350px' }} />
        <FloatingThreads threads={threads} editor={editor} />
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
