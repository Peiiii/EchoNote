# Quick Start Guide

Get up and running with Agent Chat in minutes.

## Installation

```bash
npm install @agent-labs/agent-chat
# or
yarn add @agent-labs/agent-chat
# or
pnpm add @agent-labs/agent-chat
```

## Basic Setup

### 1. Create an Agent

```tsx
import { HttpAgent } from "@ag-ui/client";

const agent = new HttpAgent({
  url: "http://localhost:8000/openai-agent",
});
```

### 2. Define Tools

Agent Chat supports three different tool patterns. Choose the one that fits your use case:

#### Pattern 1: Frontend-Execution Tools

Tools that execute logic in the browser and return results immediately.

```tsx
import { Tool, ToolCall, ToolResult } from "@agent-labs/agent-chat";

const createCalculatorTool = (): Tool => ({
  name: "calculate",
  description: "Perform mathematical calculations",
  parameters: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Math expression to evaluate" },
    },
    required: ["expression"],
  },
  execute: async (toolCall: ToolCall) => {
    const args = JSON.parse(toolCall.function.arguments);
    const result = eval(args.expression); // Note: Use safer alternatives in production
    return {
      toolCallId: toolCall.id,
      result: `Result: ${args.expression} = ${result}`,
      status: "success",
    };
  },
  render: (toolInvocation, onResult) => (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3>Calculator Tool</h3>
      <p>Expression: {toolInvocation.args.expression}</p>
      <p>Tool executed, result returned to AI assistant</p>
    </div>
  ),
});
```

#### Pattern 2: User-Interaction Tools

Tools that require user input or confirmation.

```tsx
import { Tool, ToolResult } from "@agent-labs/agent-chat";
import { ToolInvocation } from "@ai-sdk/ui-utils";
import React, { useState } from "react";

const createUserConfirmationTool = (): Tool => ({
  name: "userConfirmation",
  description: "Request user confirmation for an action",
  parameters: {
    type: "object",
    properties: {
      action: { type: "string", description: "Action requiring confirmation" },
    },
    required: ["action"],
  },
  // No execute function - logic is in render
  render: (toolInvocation: ToolInvocation, onResult: (result: ToolResult) => void) => {
    const [isConfirmed, setIsConfirmed] = useState<boolean | null>(null);

    const handleConfirm = () => {
      onResult({
        toolCallId: toolInvocation.toolCallId,
        result: `User confirmed: ${toolInvocation.args.action}`,
        status: "success",
      });
      setIsConfirmed(true);
    };

    const handleReject = () => {
      onResult({
        toolCallId: toolInvocation.toolCallId,
        result: `User rejected: ${toolInvocation.args.action}`,
        status: "success",
      });
      setIsConfirmed(false);
    };

    if (isConfirmed !== null) {
      return <div>Action {isConfirmed ? "confirmed" : "rejected"}</div>;
    }

    return (
      <div className="p-4 border rounded-lg bg-orange-50">
        <h3>Confirm Action</h3>
        <p>{toolInvocation.args.action}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 text-white rounded">
            Confirm
          </button>
          <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded">
            Reject
          </button>
        </div>
      </div>
    );
  },
});
```

#### Pattern 3: Backend-Only Tools

Tools that execute on the server, with frontend only displaying information.

```tsx
import { Tool } from "@agent-labs/agent-chat";

const createBackendTool = (): Tool => ({
  name: "backendOperation",
  description: "Perform server-side operation",
  parameters: {
    type: "object",
    properties: {
      operation: { type: "string", description: "Operation to perform" },
    },
    required: ["operation"],
  },
  // No execute function - backend handles execution
  render: toolInvocation => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3>Backend Operation</h3>
      <p>Operation: {toolInvocation.args.operation}</p>
      <p>Processing on server...</p>
    </div>
  ),
});
```

#### Tool Registration

```tsx
const tools = [
  createCalculatorTool(), // Frontend-execution
  createUserConfirmationTool(), // User-interaction
  createBackendTool(), // Backend-only
];
```

**Choose the pattern based on:**

- **Frontend-Execution**: For lightweight operations like calculations, data processing
- **User-Interaction**: When you need user input, confirmation, or decision
- **Backend-Only**: When execution happens on the server, frontend shows status

### 3. Add Context (Optional)

```tsx
const contexts = [
  {
    description: "User Preferences",
    value: JSON.stringify({
      language: "en",
      timezone: "UTC",
    }),
  },
];
```

### 4. Render the Chat

```tsx
import { AgentChatWindow } from "@agent-labs/agent-chat";

function App() {
  return <AgentChatWindow agent={agent} tools={tools} contexts={contexts} />;
}
```

## Complete Example

```tsx
import React, { useMemo } from "react";
import { AgentChatWindow } from "@agent-labs/agent-chat";
import { HttpAgent } from "@ag-ui/client";
import { Tool, ToolCall, ToolResult } from "@agent-labs/agent-chat";
import { ToolInvocation } from "@ai-sdk/ui-utils";

function ChatApp() {
  const agent = useMemo(
    () =>
      new HttpAgent({
        url: "http://localhost:8000/openai-agent",
      }),
    []
  );

  const tools = useMemo(
    () => [
      // Pattern 1: Frontend-Execution Tool
      {
        name: "calculate",
        description: "Perform mathematical calculations",
        parameters: {
          type: "object",
          properties: {
            expression: { type: "string", description: "Math expression to evaluate" },
          },
          required: ["expression"],
        },
        execute: async (toolCall: ToolCall) => {
          const args = JSON.parse(toolCall.function.arguments);
          const result = eval(args.expression); // Note: Use safer alternatives in production
          return {
            toolCallId: toolCall.id,
            result: `Result: ${args.expression} = ${result}`,
            status: "success",
          };
        },
        render: (toolInvocation: ToolInvocation, onResult) => (
          <div className="p-4 border rounded-lg bg-blue-50">
            <h3>Calculator Tool</h3>
            <p>Expression: {toolInvocation.args.expression}</p>
            <p>Tool executed, result returned to AI assistant</p>
          </div>
        ),
      },

      // Pattern 2: User-Interaction Tool
      {
        name: "userConfirmation",
        description: "Request user confirmation for an action",
        parameters: {
          type: "object",
          properties: {
            action: { type: "string", description: "Action requiring confirmation" },
          },
          required: ["action"],
        },
        render: (toolInvocation: ToolInvocation, onResult: (result: ToolResult) => void) => {
          const handleConfirm = () => {
            onResult({
              toolCallId: toolInvocation.toolCallId,
              result: `User confirmed: ${toolInvocation.args.action}`,
              status: "success",
            });
          };

          const handleReject = () => {
            onResult({
              toolCallId: toolInvocation.toolCallId,
              result: `User rejected: ${toolInvocation.args.action}`,
              status: "success",
            });
          };

          return (
            <div className="p-4 border rounded-lg bg-orange-50">
              <h3>Confirm Action</h3>
              <p>{toolInvocation.args.action}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleConfirm}
                  className="px-4 py-2 bg-green-600 text-white rounded"
                >
                  Confirm
                </button>
                <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded">
                  Reject
                </button>
              </div>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Chat Assistant</h1>

        <AgentChatWindow agent={agent} tools={tools} className="z-50" />
      </div>
    </div>
  );
}

export default ChatApp;
```

## Next Steps

- [Tutorial](./tutorial.md) - Comprehensive guide to all features
- [API Reference](./api-reference.md) - Complete API documentation
- [Examples](./examples.md) - More code examples and use cases

## Common Issues

### Tool Not Working?

- Check if tool is properly registered in the tools array
- Verify tool name matches between definition and registration
- Ensure tool parameters match the expected schema

### Agent Connection Failed?

- Verify the agent URL is correct
- Check if the agent service is running
- Ensure proper authentication if required

### Messages Not Displaying?

- Check browser console for errors
- Verify message structure matches expected format
- Ensure the component is properly mounted

## Getting Help

- Check the [GitHub repository](https://github.com/agent-labs/agent-chat) for issues
- Review the [tutorial](./tutorial.md) for detailed explanations
- Create a minimal reproduction case for bug reports
