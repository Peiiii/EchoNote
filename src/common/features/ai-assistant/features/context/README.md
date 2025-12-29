Context System Overview

This document explains the context system used by the AI assistant in EchoNote, including how channel data is collected, cached, exposed to the agent, and reflected in the UI.

Goals

- Provide relevant note content to the AI with predictable coverage.
- Scale to many channels with progressive hydration and non‑blocking UX.
- Make readiness status meaningful and consistent with what the AI actually knows.

Terminology

- Channel: A thought space; contains user notes (messages).
- Context: The auxiliary data we pass to the AI before/along with user prompts.
- Hydration: Fetching channel metadata and recent messages so they can be included in context.

Key Components

- ContextDataCache (service)
  - Responsibilities: independent cache for channel metadata and recent messages; full channel index for “all” mode; prefetch orchestration.
  - Key methods:
    - getSnapshot(channelId): returns a sync snapshot; triggers lazy fetch if needed.
    - ensureFetched(channelId): fetch metadata + recent messages (LIMIT=50) and update cache.
    - ensureAllMetas(): fetch all channel metadata for the signed‑in user; decoupled from UI store.
    - getAllMetasSnapshot() / getAllIdsSnapshot(): provide full index snapshots.
    - prefetchAllChannelsMessages(concurrency, limit?): progressively hydrate many channels with simple concurrency control.
  - Code: `src/common/features/ai-assistant/services/context-data-cache.ts:24`

- ChannelContextManager (service)
  - Responsibilities: format a single channel into system instructions + message list for the agent.
  - Code: `src/common/features/ai-assistant/services/channel-context-manager.ts:64`

- SessionContextManager (service)
  - Responsibilities: resolve “conversation contexts” into the final array of context items passed to the agent.
  - Modes: none, channels, all, and auto (auto = follow current channel; represented as no explicit contexts on conversation).
  - “All channels” mode returns a blended context:
    - Global index of all channels (so the AI knows what exists).
    - Detailed context for channels that have completed at least one fetch.
    - Progressive hydration continues in background so later turns include more channels.
  - Code: `src/common/features/ai-assistant/services/session-context-manager.ts:32`

- Context Status Store (zustand)
  - Responsibilities: compute readiness per conversation and per channel for the UI status dot.
  - Rules:
    - A channel is ready when it has been fetched at least once (lastFetched > 0) regardless of message count.
    - In “all” mode, the top status is ready only when every channel in the full index has been fetched at least once.
  - Code: `src/common/features/ai-assistant/stores/context-status.store.ts:41`

- ConversationContextControl (UI)
  - Responsibilities: pick context mode; show status; trigger pre‑fetch after apply.
  - In “all” mode, it calls ensureAllMetas() then hydrates all channels in background.
  - Code: `src/common/features/ai-assistant/components/conversation-context-control.tsx:100`

- AIConversationChat (UI)
  - Responsibilities: wire agent session; call getSessionContexts() to supply live contexts per turn; prefetch contexts on mount/updates.
  - Code: `src/common/features/ai-assistant/components/ai-conversation-chat.tsx:95`

Data Flow (High Level)

1. User selects a context mode in ConversationContextControl.
2. On apply, for “all” mode, ensureAllMetas() loads the full channel index. Then background hydration begins (ensureFetched per channel, concurrency‑limited).
3. When the agent sends/receives messages, AIConversationChat asks SessionContextManager.getSessionContexts() for the latest contexts.
4. SessionContextManager blends a global index with detailed contexts for all channels that are already hydrated at least once.
5. Context status store observes cache changes and updates the UI status dot accordingly.

Context Modes

- Auto (no explicit contexts on the conversation)
  - Follow the current channel; single‑channel context.
- None
  - No external context; agent responds only to the user input.
- Channels (selected list)
  - Explicitly include specific channels; prefetch them after apply.
- All
  - Provide a global index for all channels and detailed context for every channel as it becomes hydrated. Readiness is green when every channel has been fetched at least once.

Progressive Hydration

- Motivation: prevent blocking and keep UX responsive while scaling to many channels.
- Strategy:
  - Preload full channel index first (ensureAllMetas).
  - Hydrate messages per channel in background (ensureFetched) with limited concurrency (default 4).
  - Each turn calls getSessionContexts() again, so newly hydrated channels automatically appear in the agent context.

Fetch Details

- Metadata source: FirebaseNotesService.fetchChannels (decoupled from UI store).
- Message fetch: FirebaseNotesService.fetchInitialMessages (users’ messages only), LIMIT=50 default.
- Throttling:
  - ensureFetched: re‑fetch per channel at most once per 2h by default (simple throttle to limit reads).
  - ensureAllMetas: full index refresh throttled to ~15s.

Status Semantics (Why the dot is green)

- Channels mode: dot is green when all selected channels are fetched.
- All mode: dot is green only when every channel in the full index is fetched once; until then, it remains loading.
- Empty channels (0 messages) count as ready once fetched (they still provide metadata context).

Agent Context Shape

- ChannelContextManager returns two items per channel:
  - System Instructions: tailored to the channel (name, count, rules) so the AI acts consistently.
  - Notes: the latest N (LIMIT) user messages, ascending by timestamp for readability.
- All mode prepends the global index item: `{ total, channels: [{ id, name, messageCount }] }`.

API Quick Reference

- Getting contexts for a turn (inside chat session wiring):
  - `aiAgentFactory.getSessionContexts(conversationId, fallbackChannelId)`
  - Code: `src/common/features/ai-assistant/services/ai-agent-factory.ts:99`

- Prefetching (UI desirable but optional):
  - All mode after apply: `contextDataCache.ensureAllMetas();` then `contextDataCache.ensureFetched(id)` for each id.
  - Channels mode after apply: `ensureFetched` for the selected ids.

Operational Tips

- Token budget: Large accounts may generate substantial context. Consider:
  - Reducing LIMIT (per‑channel message limit) if needed.
  - Down‑sampling channels (e.g., include most active first) or introducing a maximum channel count for a single turn.
- Concurrency: `prefetchAllChannelsMessages(concurrency)` is safe to tune.
- Observability: look for console logs prefixed with "🔔" to trace context fetches and agent tool behavior.

Extensibility Hooks

- Add channel ranking or filtering when constructing the global index.
- Introduce a configuration surface for LIMIT, concurrency, and maximum channels per turn.
- Add per‑channel heuristics (e.g., skip channels with no activity for long periods).

Known Limitations

- Context is fetched on demand and cached with simple throttling; extreme account sizes may still require tighter quotas or pagination strategies.
- The agent cannot “see” messages outside the LIMIT window per channel.
