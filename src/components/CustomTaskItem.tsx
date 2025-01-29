import TaskItem from "@tiptap/extension-task-item";
import {
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { Checkbox } from "@/primitives/Checkbox";

export const CustomTaskItem = TaskItem.extend({
  addNodeView: () => {
    return ReactNodeViewRenderer(TiptapCheckbox);
  },
});

function TiptapCheckbox({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="flex items-start space-x-2">
      <label className="flex items-center" contentEditable={false}>
        <Checkbox
          initialValue={false}
          checked={node.attrs.checked}
          onValueChange={(checked: boolean) => updateAttributes({ checked })}
        />
      </label>
      <NodeViewContent className="flex-1 text-sm leading-5" />
    </NodeViewWrapper>
  );
}
