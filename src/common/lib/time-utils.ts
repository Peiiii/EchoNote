import { format, isToday, isYesterday, differenceInDays, isThisYear } from "date-fns";

/**
 * Smart time formatting function for social applications
 * Follows top-tier social app best practices (Twitter, Instagram, WhatsApp, etc.)
 * Shows relative time for recent messages, absolute date for older ones
 */
export const formatTimeForSocial = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  // Handle invalid dates
  if (isNaN(targetDate.getTime())) {
    return "Unknown time";
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = differenceInDays(now, targetDate);

  // Just now (within 1 minute) - Twitter style
  if (diffInMinutes < 1) {
    return "Just now";
  }

  // Minutes ago (1-59 minutes) - Twitter style
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Hours ago (1-23 hours) - Twitter style
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Yesterday - Instagram style
  if (isYesterday(targetDate)) {
    return "Yesterday";
  }

  // Within 3 days - show relative time (WhatsApp style)
  if (diffInDays < 3) {
    return `${diffInDays}d ago`;
  }

  // Within this year - show month and day (Instagram style)
  if (isThisYear(targetDate)) {
    return format(targetDate, "MMM d");
  }

  // Last year or earlier - show full date (Instagram style)
  return format(targetDate, "MMM d, yyyy");
};

/**
 * Enhanced social time formatting with more granular control
 * Based on WhatsApp, Telegram, and modern messaging apps
 */
export const formatEnhancedSocialTime = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return "Unknown time";
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = differenceInDays(now, targetDate);

  // Just now
  if (diffInMinutes < 1) {
    return "Just now";
  }

  // Minutes
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  // Hours
  if (diffInHours < 24) {
    return `${diffInHours}h`;
  }

  // Yesterday
  if (isYesterday(targetDate)) {
    return "Yesterday";
  }

  // 2-3 days ago
  if (diffInDays <= 3) {
    return `${diffInDays}d ago`;
  }

  // This week (4-7 days)
  if (diffInDays < 7) {
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekdays[targetDate.getDay()];
  }

  // This year
  if (isThisYear(targetDate)) {
    return format(targetDate, "MMM d");
  }

  // Previous years
  return format(targetDate, "MMM d, yyyy");
};

/**
 * Full time formatting function
 * For scenarios requiring complete time information
 */
export const formatFullTime = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return "Unknown time";
  }

  if (isToday(targetDate)) {
    return `Today ${format(targetDate, "HH:mm")}`;
  }

  if (isYesterday(targetDate)) {
    return `Yesterday ${format(targetDate, "HH:mm")}`;
  }

  if (isThisYear(targetDate)) {
    return format(targetDate, "MMM d HH:mm");
  }

  return format(targetDate, "MMM d, yyyy HH:mm");
};

/**
 * Relative time formatting function
 * For scenarios requiring relative time display
 */
export const formatRelativeTime = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return "Unknown time";
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = differenceInDays(now, targetDate);

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
};

/**
 * Smart time selector
 * Automatically chooses the most appropriate display method based on time difference
 */
export const formatSmartTime = (date: Date | string): string => {
  const targetDate = typeof date === "string" ? new Date(date) : date;

  if (isNaN(targetDate.getTime())) {
    return "Unknown time";
  }

  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = differenceInDays(now, targetDate);

  // Within 1 hour: show relative time
  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) return "Just now";
    return `${diffInMinutes}m ago`;
  }

  // Within 24 hours: show hours
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  // Within 3 days: show days
  if (diffInDays <= 3) {
    return `${diffInDays}d ago`;
  }

  // Within this year: show month and day
  if (isThisYear(targetDate)) {
    return format(targetDate, "MMM d");
  }

  // Earlier: show year, month and day
  return format(targetDate, "MMM d, yyyy");
};
