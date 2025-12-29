import {
  CreateNoteToolRenderer,
  DeleteNoteToolRenderer,
  ReadNoteToolRenderer,
  UpdateNoteToolRenderer,
} from "@/common/features/notes/components/tools/interactive-note-tools.ui";
import { createListNotesTool } from "@/common/features/notes/components/tools/list-notes-tool-factory";
import { createGrepTool } from "@/common/features/notes/components/tools/grep-tool-factory";
import { ReadNoteRenderArgs, ReadNoteRenderResult } from "@/common/features/agent-tools/types";
import { channelMessageService } from "@/core/services/channel-message.service";
import { ensureChannelMessagesLoaded } from "@/common/features/notes/utils/ensure-channel-messages-loaded";
import { Tool } from "@agent-labs/agent-chat";
import * as React from "react"; // for createElement in renderers

export class ChannelToolsManager {
  /**
   * Get channel-specific CRUD tools
   */
  getChannelTools(): Tool[] {
    const tools = [
      this.createNoteTool(),
      this.readNoteTool(),
      this.updateNoteTool(),
      this.deleteNoteTool(),
      this.listNotesTool(),
      this.grepNotesTool(),
    ];
    return tools;
  }

  /**
   * Create a new note/thought
   */
  private createNoteTool(): Tool {
    // Switch to User-Interaction pattern: require explicit user confirmation
    return {
      name: "createNote",
      description:
        "Create a new note/thought in the specified channel (requires user confirmation).",
      parameters: {
        type: "object",
        properties: {
          content: { type: "string", description: "Content of the note/thought" },
          channelId: { type: "string", description: "ID of the channel to create the note in" },
        },
        required: ["content", "channelId"],
      },
      // No execute: we will do actual creation inside the confirm UI
      render: (invocation, onResult) =>
        React.createElement(CreateNoteToolRenderer, { invocation, onResult }),
    };
  }

  /**
   * Read a specific note/thought by ID
   */
  private readNoteTool(): Tool<ReadNoteRenderArgs, ReadNoteRenderResult> {
    return {
      name: "readNote",
      description: "Read a specific note/thought by its ID from the specified channel",
      parameters: {
        type: "object",
        properties: {
          noteId: {
            type: "string",
            description: "ID of the note/thought to read",
          },
          channelId: {
            type: "string",
            description: "ID of the channel to read the note from",
          },
        },
        required: ["noteId", "channelId"],
      },
      execute: async toolCallArgs => {
        const { noteId, channelId } = toolCallArgs;
        try {
          // Ensure messages loaded before searching
          await ensureChannelMessagesLoaded(channelId);

          const channelState =
            channelMessageService.dataContainer.get().messageByChannel[channelId];
          const note = channelState?.messages.find(msg => msg.id === noteId);

          if (!note) {
            throw new Error(`Note with ID ${noteId} not found`);
          }

          return {
            found: true,
            noteId: note.id,
            content: note.content,
            timestamp: note.timestamp,
            timestampReadable: note.timestamp.toLocaleString(),
            contentLength: note.content.length,
          };
        } catch (error) {
          console.error("🔔 [readNoteTool][error]:", error);
          throw new Error(
            `Failed to read note: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
      render: invocation => {
        return React.createElement(ReadNoteToolRenderer, {
          invocation,
        });
      },
    };
  }

  /**
   * Update an existing note/thought
   */
  private updateNoteTool(): Tool {
    // Switch to User-Interaction pattern: require explicit user confirmation
    return {
      name: "updateNote",
      description:
        "Update an existing note/thought by its ID in the specified channel (requires user confirmation).",
      parameters: {
        type: "object",
        properties: {
          noteId: { type: "string", description: "ID of the note/thought to update" },
          content: { type: "string", description: "New content for the note/thought" },
          channelId: { type: "string", description: "ID of the channel containing the note" },
        },
        required: ["noteId", "content", "channelId"],
      },
      // No execute: we will do actual update inside the confirm UI
      render: (invocation, onResult) =>
        React.createElement(UpdateNoteToolRenderer, { invocation, onResult }),
    };
  }

  /**
   * Delete a note/thought by ID
   */
  private deleteNoteTool(): Tool {
    // Switch to User-Interaction pattern: require explicit user confirmation
    return {
      name: "deleteNote",
      description:
        "Delete a note/thought by its ID from the specified channel (requires user confirmation).",
      parameters: {
        type: "object",
        properties: {
          noteId: { type: "string", description: "ID of the note/thought to delete" },
          channelId: { type: "string", description: "ID of the channel containing the note" },
        },
        required: ["noteId", "channelId"],
      },
      // No execute: we will do actual deletion inside the confirm UI
      render: (invocation, onResult) =>
        React.createElement(DeleteNoteToolRenderer, { invocation, onResult }),
    };
  }

  /**
   * List all notes in the channel
   */
  private listNotesTool(): Tool {
    return createListNotesTool();
  }

  /**
   * Grep-like search across notes (local, grep semantics)
   */
  private grepNotesTool(): Tool {
    return createGrepTool();
  }
}

export const channelToolsManager = new ChannelToolsManager();
