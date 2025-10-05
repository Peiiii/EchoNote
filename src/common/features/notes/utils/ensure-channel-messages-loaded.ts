// Small helper to ensure channel messages are loaded before executing a tool.
// Centralizes the previously duplicated polling logic.
import { channelMessageService } from '@/core/services/channel-message.service';

/**
 * Ensure channel messages exist and are not in loading state.
 * Will request initial load if needed and await until ready (or timeout).
 *
 * Note: We keep a conservative implementation that mirrors existing behavior
 * (request + poll). If the request workflow is not connected elsewhere,
 * callers should ensure ChannelMessageService workflow is active.
 */
export async function ensureChannelMessagesLoaded(channelId: string, opts?: { timeoutMs?: number; intervalMs?: number }) {
  const timeoutMs = opts?.timeoutMs ?? 10_000; // cap wait to avoid infinite loops
  const intervalMs = opts?.intervalMs ?? 100;

  const state = channelMessageService.dataContainer.get().messageByChannel[channelId];
  if (state && !state.loading) return;

  // Trigger load if missing
  if (!state) {
    channelMessageService.requestLoadInitialMessages$.next({ channelId });
  }

  const started = Date.now();
  await new Promise<void>((resolve, reject) => {
    const check = () => {
      const s = channelMessageService.dataContainer.get().messageByChannel[channelId];
      if (s && !s.loading) return resolve();
      if (Date.now() - started > timeoutMs) return reject(new Error(`Timeout waiting channel ${channelId} messages to load`));
      setTimeout(check, intervalMs);
    };
    check();
  });
}

