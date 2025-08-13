import { Tool, ToolResult } from "@agent-labs/agent-chat";
import { useState } from "react";
import { Button } from "@/common/components/ui/button";
import { ToolInvocation } from "@ai-sdk/ui-utils";

// 独立的标签创建组件
const TagCreationForm = ({ 
  toolInvocation, 
  onResult 
}: { 
  toolInvocation: ToolInvocation; 
  onResult: (result: ToolResult) => void; 
}) => {
  const [tagName, setTagName] = useState(toolInvocation.args.tagName || '');
  const [tagColor, setTagColor] = useState(toolInvocation.args.tagColor || 'blue');
  
  const handleCreate = () => {
    onResult({
      toolCallId: toolInvocation.toolCallId,
      result: `Successfully created tag: ${tagName}`,
      state: 'result' as const
    });
  };
  
  return (
    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
      <h3 className="font-medium mb-2">Create Channel Tag</h3>
      <input
        value={tagName}
        onChange={(e) => setTagName(e.target.value)}
        placeholder="Enter tag name"
        className="w-full p-2 border rounded mb-2"
      />
      <select
        value={tagColor}
        onChange={(e) => setTagColor(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      >
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="red">Red</option>
        <option value="yellow">Yellow</option>
        <option value="purple">Purple</option>
      </select>
      <Button
        onClick={handleCreate}
        className="w-full"
        size="sm"
      >
        Create Tag
      </Button>
    </div>
  );
};

export const createCreateTagTool = (): Tool => ({
  name: 'createTag',
  description: 'Create a new tag for organizing channel content',
  parameters: {
    type: 'object',
    properties: {
      tagName: { 
        type: 'string', 
        description: 'Name of the tag to create' 
      },
      tagColor: { 
        type: 'string', 
        description: 'Color of the tag' 
      }
    },
    required: ['tagName']
  },
  render: (toolInvocation: ToolInvocation, onResult: (result: ToolResult) => void) => {
    return (
      <TagCreationForm 
        toolInvocation={toolInvocation} 
        onResult={onResult} 
      />
    );
  }
});
