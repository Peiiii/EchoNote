
import { firebaseConfig } from "@/common/config/firebase.config";
import { logEvent as firebaseLogEvent, setUserProperties as firebaseSetUserProperties } from "firebase/analytics";

export enum AnalyticsEvent {
  APP_START = 'app_start',
  APP_CLOSE = 'app_close',
  CHANNEL_CREATE = 'channel_create',
  CHANNEL_SELECT = 'channel_select',
  CHANNEL_EDIT = 'channel_edit',
  CHANNEL_DELETE = 'channel_delete',
  NOTE_CREATE = 'note_create',
  MESSAGE_EDIT = 'message_edit',
  MESSAGE_DELETE = 'message_delete',
  MESSAGE_REPLY = 'message_reply',
  AI_ASSISTANT_OPEN = 'ai_assistant_open',
  AI_ASSISTANT_CLOSE = 'ai_assistant_close',
  AI_MESSAGE_SEND = 'ai_message_send',
  AI_MESSAGE_RECEIVE = 'ai_message_receive',
  AI_TOOL_USE = 'ai_tool_use',
  THREAD_OPEN = 'thread_open',
  THREAD_CLOSE = 'thread_close',
  THREAD_REPLY = 'thread_reply',
  SEARCH_START = 'search_start',
  SEARCH_RESULT = 'search_result',
  SEARCH_SELECT = 'search_select',
  SIDEBAR_TOGGLE = 'sidebar_toggle',
  INPUT_COLLAPSE = 'input_collapse',
  SCROLL_TO_BOTTOM = 'scroll_to_bottom', // deprecated in timeline v2
  SCROLL_TO_LATEST = 'scroll_to_latest',
  MESSAGE_EXPAND = 'message_expand',
  SETTINGS_OPEN = 'settings_open',
  THEME_CHANGE = 'theme_change',
  CONTEXT_MODE_CHANGE = 'context_mode_change',
  PAGE_LOAD = 'page_load',
  MESSAGE_LOAD = 'message_load',
  VIRTUALIZATION_PERFORMANCE = 'virtualization_performance',
  ERROR_OCCURRED = 'error_occurred',
  AI_FAILURE = 'ai_failure',
  DAILY_ACTIVE = 'daily_active',
  SESSION_METRICS = 'session_metrics',
  FEATURE_USAGE = 'feature_usage',
  EXPORT = 'export',
  TAG_USE = 'tag_use',
  HOTKEY_USE = 'hotkey_use',
  MOBILE_GESTURE = 'mobile_gesture',
  PWA_INSTALL = 'pwa_install',
  PWA_UPDATE = 'pwa_update',
  BATCH_OPERATION = 'batch_operation',
  FEEDBACK = 'feedback'
}

export enum Platform {
  DESKTOP = 'desktop',
  MOBILE = 'mobile'
}

export enum NoteType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file'
}

export enum ChannelEditField {
  NAME = 'name',
  DESCRIPTION = 'description',
  EMOJI = 'emoji'
}

export enum AITrigger {
  BUTTON = 'button',
  HOTKEY = 'hotkey',
  AUTO = 'auto'
}

export enum ContextMode {
  NONE = 'none',
  CHANNEL = 'channel',
  ALL = 'all'
}

export enum SidebarType {
  LEFT = 'left',
  RIGHT = 'right'
}

export enum SidebarAction {
  OPEN = 'open',
  CLOSE = 'close'
}

export enum InputAction {
  COLLAPSE = 'collapse',
  EXPAND = 'expand'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system'
}

export enum ExportFormat {
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  JSON = 'json'
}

export enum TagAction {
  CREATE = 'create',
  APPLY = 'apply',
  REMOVE = 'remove'
}

export enum MobileGesture {
  SWIPE = 'swipe',
  PINCH = 'pinch',
  TAP = 'tap'
}

export enum FeedbackType {
  BUG = 'bug',
  FEATURE = 'feature',
  IMPROVEMENT = 'improvement'
}

export enum SearchScope {
  CHANNEL = 'channel',
  GLOBAL = 'global'
}

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined;
}

export class LogService {
  logEvent = (eventName: string, eventParams?: AnalyticsEventParams) => {
    const analytics = firebaseConfig.getAnalytics();
    if (analytics) {
      try {
        firebaseLogEvent(analytics, eventName, eventParams);
      } catch (e) {
        console.error("[Analytics] Failed to log event", e);
      }
    }
  };

  setUserProperties = (properties: AnalyticsEventParams) => {
    const analytics = firebaseConfig.getAnalytics();
    if (analytics) {
      firebaseSetUserProperties(analytics, properties);
    }
  };

  logAppStart = (platform: Platform, version: string) => {
    this.logEvent(AnalyticsEvent.APP_START, { platform, version });
  };

  logAppClose = (sessionDuration: number) => {
    this.logEvent(AnalyticsEvent.APP_CLOSE, { session_duration: sessionDuration });
  };

  logChannelCreate = (channelId: string, channelName: string, hasDescription: boolean) => {
    this.logEvent(AnalyticsEvent.CHANNEL_CREATE, {
      channel_id: channelId,
      channel_name: channelName,
      has_description: hasDescription
    });
  };

  logChannelSelect = (channelId: string, channelName: string, messageCount: number) => {
    this.logEvent(AnalyticsEvent.CHANNEL_SELECT, {
      channel_id: channelId,
      channel_name: channelName,
      message_count: messageCount
    });
  };

  logChannelEdit = (channelId: string, field: ChannelEditField) => {
    this.logEvent(AnalyticsEvent.CHANNEL_EDIT, {
      channel_id: channelId,
      field: field
    });
  };

  logChannelDelete = (channelId: string, channelName: string, messageCount: number) => {
    this.logEvent(AnalyticsEvent.CHANNEL_DELETE, {
      channel_id: channelId,
      channel_name: channelName,
      message_count: messageCount
    });
  };

  logNoteCreate = (channelId: string, noteType: NoteType, contentLength: number, hasTags: boolean) => {
    this.logEvent(AnalyticsEvent.NOTE_CREATE, {
      channel_id: channelId,
      note_type: noteType,
      content_length: contentLength,
      has_tags: hasTags
    });
  };

  logMessageEdit = (messageId: string, channelId: string, editCount: number) => {
    this.logEvent(AnalyticsEvent.MESSAGE_EDIT, {
      message_id: messageId,
      channel_id: channelId,
      edit_count: editCount
    });
  };

  logMessageDelete = (messageId: string, channelId: string, messageAge: number) => {
    this.logEvent(AnalyticsEvent.MESSAGE_DELETE, {
      message_id: messageId,
      channel_id: channelId,
      message_age: messageAge
    });
  };

  logMessageReply = (messageId: string, channelId: string, threadId: string) => {
    this.logEvent(AnalyticsEvent.MESSAGE_REPLY, {
      message_id: messageId,
      channel_id: channelId,
      thread_id: threadId
    });
  };

  logAIAssistantOpen = (channelId: string, trigger: AITrigger) => {
    this.logEvent(AnalyticsEvent.AI_ASSISTANT_OPEN, {
      channel_id: channelId,
      trigger: trigger
    });
  };

  logAIAssistantClose = (channelId: string, sessionDuration: number, messageCount: number) => {
    this.logEvent(AnalyticsEvent.AI_ASSISTANT_CLOSE, {
      channel_id: channelId,
      session_duration: sessionDuration,
      message_count: messageCount
    });
  };

  logAIMessageSend = (channelId: string, messageLength: number, contextMode: ContextMode) => {
    this.logEvent(AnalyticsEvent.AI_MESSAGE_SEND, {
      channel_id: channelId,
      message_length: messageLength,
      context_mode: contextMode
    });
  };

  logAIMessageReceive = (channelId: string, responseLength: number, responseTime: number, toolUsed: boolean) => {
    this.logEvent(AnalyticsEvent.AI_MESSAGE_RECEIVE, {
      channel_id: channelId,
      response_length: responseLength,
      response_time: responseTime,
      tool_used: toolUsed
    });
  };

  logAIToolUse = (toolName: string, channelId: string, success: boolean) => {
    this.logEvent(AnalyticsEvent.AI_TOOL_USE, {
      tool_name: toolName,
      channel_id: channelId,
      success: success
    });
  };

  logThreadOpen = (messageId: string, channelId: string, threadCount: number) => {
    this.logEvent(AnalyticsEvent.THREAD_OPEN, {
      message_id: messageId,
      channel_id: channelId,
      thread_count: threadCount
    });
  };

  logThreadClose = (messageId: string, channelId: string, sessionDuration: number) => {
    this.logEvent(AnalyticsEvent.THREAD_CLOSE, {
      message_id: messageId,
      channel_id: channelId,
      session_duration: sessionDuration
    });
  };

  logThreadReply = (messageId: string, channelId: string, threadId: string) => {
    this.logEvent(AnalyticsEvent.THREAD_REPLY, {
      message_id: messageId,
      channel_id: channelId,
      thread_id: threadId
    });
  };

  logSearchStart = (query: string, channelId?: string) => {
    this.logEvent(AnalyticsEvent.SEARCH_START, {
      query: query,
      channel_id: channelId,
      search_scope: channelId ? SearchScope.CHANNEL : SearchScope.GLOBAL
    });
  };

  logSearchResult = (query: string, resultCount: number, channelId?: string) => {
    this.logEvent(AnalyticsEvent.SEARCH_RESULT, {
      query: query,
      result_count: resultCount,
      channel_id: channelId,
      search_scope: channelId ? SearchScope.CHANNEL : SearchScope.GLOBAL
    });
  };

  logSearchSelect = (query: string, resultIndex: number, channelId?: string) => {
    this.logEvent(AnalyticsEvent.SEARCH_SELECT, {
      query: query,
      result_index: resultIndex,
      channel_id: channelId,
      search_scope: channelId ? SearchScope.CHANNEL : SearchScope.GLOBAL
    });
  };

  logSidebarToggle = (sidebar: SidebarType, action: SidebarAction) => {
    this.logEvent(AnalyticsEvent.SIDEBAR_TOGGLE, {
      sidebar: sidebar,
      action: action
    });
  };

  logInputCollapse = (action: InputAction) => {
    this.logEvent(AnalyticsEvent.INPUT_COLLAPSE, {
      action: action
    });
  };

  logScrollToBottom = (channelId: string, messageCount: number) => {
    this.logEvent(AnalyticsEvent.SCROLL_TO_BOTTOM, {
      channel_id: channelId,
      message_count: messageCount
    });
  };

  // Timeline v2: latest-at-top
  logScrollToLatest = (channelId: string, messageCount: number) => {
    this.logEvent(AnalyticsEvent.SCROLL_TO_LATEST, {
      channel_id: channelId,
      message_count: messageCount
    });
  };

  logMessageExpand = (messageId: string, channelId: string, contentLength: number) => {
    this.logEvent(AnalyticsEvent.MESSAGE_EXPAND, {
      message_id: messageId,
      channel_id: channelId,
      content_length: contentLength
    });
  };

  logSettingsOpen = (channelId?: string) => {
    this.logEvent(AnalyticsEvent.SETTINGS_OPEN, {
      channel_id: channelId
    });
  };

  logThemeChange = (theme: Theme) => {
    this.logEvent(AnalyticsEvent.THEME_CHANGE, {
      theme: theme
    });
  };

  logContextModeChange = (mode: ContextMode, channelId?: string) => {
    this.logEvent(AnalyticsEvent.CONTEXT_MODE_CHANGE, {
      mode: mode,
      channel_id: channelId
    });
  };

  logPageLoad = (page: string, loadTime: number, platform: Platform) => {
    this.logEvent(AnalyticsEvent.PAGE_LOAD, {
      page: page,
      load_time: loadTime,
      platform: platform
    });
  };

  logMessageLoad = (channelId: string, messageCount: number, loadTime: number) => {
    this.logEvent(AnalyticsEvent.MESSAGE_LOAD, {
      channel_id: channelId,
      message_count: messageCount,
      load_time: loadTime
    });
  };

  logVirtualizationPerformance = (channelId: string, visibleCount: number, totalCount: number, renderTime: number) => {
    this.logEvent(AnalyticsEvent.VIRTUALIZATION_PERFORMANCE, {
      channel_id: channelId,
      visible_count: visibleCount,
      total_count: totalCount,
      render_time: renderTime
    });
  };

  logError = (errorType: string, errorMessage: string, component: string, channelId?: string) => {
    this.logEvent(AnalyticsEvent.ERROR_OCCURRED, {
      error_type: errorType,
      error_message: errorMessage,
      component: component,
      channel_id: channelId
    });
  };

  logAIFailure = (channelId: string, errorType: string, retryCount: number) => {
    this.logEvent(AnalyticsEvent.AI_FAILURE, {
      channel_id: channelId,
      error_type: errorType,
      retry_count: retryCount
    });
  };

  logDailyActive = (messageCount: number, channelCount: number, aiUsageCount: number) => {
    this.logEvent(AnalyticsEvent.DAILY_ACTIVE, {
      message_count: messageCount,
      channel_count: channelCount,
      ai_usage_count: aiUsageCount
    });
  };

  logSessionMetrics = (sessionDuration: number, messageCount: number, aiInteractionCount: number, channelCount: number) => {
    this.logEvent(AnalyticsEvent.SESSION_METRICS, {
      session_duration: sessionDuration,
      message_count: messageCount,
      ai_interaction_count: aiInteractionCount,
      channel_count: channelCount
    });
  };

  logFeatureUsage = (feature: string, action: string, channelId?: string) => {
    this.logEvent(AnalyticsEvent.FEATURE_USAGE, {
      feature: feature,
      action: action,
      channel_id: channelId
    });
  };

  logExport = (format: ExportFormat, channelId: string, messageCount: number) => {
    this.logEvent(AnalyticsEvent.EXPORT, {
      format: format,
      channel_id: channelId,
      message_count: messageCount
    });
  };

  logTagUse = (tag: string, channelId: string, action: TagAction) => {
    this.logEvent(AnalyticsEvent.TAG_USE, {
      tag: tag,
      channel_id: channelId,
      action: action
    });
  };

  logHotkeyUse = (hotkey: string, context: string) => {
    this.logEvent(AnalyticsEvent.HOTKEY_USE, {
      hotkey: hotkey,
      context: context
    });
  };

  logMobileGesture = (gesture: MobileGesture, action: string) => {
    this.logEvent(AnalyticsEvent.MOBILE_GESTURE, {
      gesture: gesture,
      action: action
    });
  };

  logPWAInstall = (platform: string) => {
    this.logEvent(AnalyticsEvent.PWA_INSTALL, {
      platform: platform
    });
  };

  logPWAUpdate = (version: string) => {
    this.logEvent(AnalyticsEvent.PWA_UPDATE, {
      version: version
    });
  };

  logBatchOperation = (operation: string, itemCount: number, channelId: string) => {
    this.logEvent(AnalyticsEvent.BATCH_OPERATION, {
      operation: operation,
      item_count: itemCount,
      channel_id: channelId
    });
  };

  logFeedback = (type: FeedbackType, rating: number, channelId?: string) => {
    this.logEvent(AnalyticsEvent.FEEDBACK, {
      type: type,
      rating: rating,
      channel_id: channelId
    });
  };
}

export const logService = new LogService();
