import {
  formatTimeForSocial,
  formatFullTime,
  formatRelativeTime,
  formatSmartTime,
} from "@/common/lib/time-utils";

export function TimeFormatDemo() {
  // Create test dates at different times
  const now = new Date();
  const testDates = [
    { label: "Just now", date: new Date(now.getTime() - 30 * 1000) }, // 30 seconds ago
    { label: "2 minutes ago", date: new Date(now.getTime() - 2 * 60 * 1000) }, // 2 minutes ago
    { label: "1 hour ago", date: new Date(now.getTime() - 60 * 60 * 1000) }, // 1 hour ago
    { label: "3 hours ago", date: new Date(now.getTime() - 3 * 60 * 60 * 1000) }, // 3 hours ago
    { label: "Yesterday", date: new Date(now.getTime() - 25 * 60 * 60 * 1000) }, // Yesterday
    { label: "3 days ago", date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) }, // 3 days ago
    { label: "1 week ago", date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }, // 1 week ago
    { label: "1 month ago", date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }, // 1 month ago
    { label: "6 months ago", date: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000) }, // 6 months ago
    { label: "1 year ago", date: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) }, // 1 year ago
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Time Formatting Demo</h2>
        <p className="text-muted-foreground">
          Demonstrating different time formatting functions for social applications
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* formatTimeForSocial */}
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
              formatTimeForSocial
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
              Smart time formatting for social apps - relative time for recent, absolute for older
            </p>
            <div className="space-y-2">
              {testDates.map(({ label, date }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-blue-600 dark:text-blue-400">{label}:</span>
                  <span className="font-mono text-blue-800 dark:text-blue-200">
                    {formatTimeForSocial(date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* formatFullTime */}
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
              formatFullTime
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-4">
              Complete time information with context
            </p>
            <div className="space-y-2">
              {testDates.map(({ label, date }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-green-600 dark:text-green-400">{label}:</span>
                  <span className="font-mono text-green-800 dark:text-green-200">
                    {formatFullTime(date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* formatRelativeTime */}
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
              formatRelativeTime
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300 mb-4">
              Always shows relative time with appropriate units
            </p>
            <div className="space-y-2">
              {testDates.map(({ label, date }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-purple-600 dark:text-purple-400">{label}:</span>
                  <span className="font-mono text-purple-800 dark:text-purple-200">
                    {formatRelativeTime(date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* formatSmartTime */}
        <div className="space-y-4">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
              formatSmartTime
            </h3>
            <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
              Automatically chooses best display method
            </p>
            <div className="space-y-2">
              {testDates.map(({ label, date }) => (
                <div key={label} className="flex justify-between items-center text-sm">
                  <span className="text-orange-600 dark:text-orange-400">{label}:</span>
                  <span className="font-mono text-orange-800 dark:text-orange-200">
                    {formatSmartTime(date)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 dark:bg-slate-900/20 rounded-lg border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-semibold mb-3">Usage Examples</h3>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong>formatTimeForSocial:</strong> Perfect for message timestamps in chat interfaces
          </p>
          <p>
            <strong>formatFullTime:</strong> Use when you need complete time context
          </p>
          <p>
            <strong>formatRelativeTime:</strong> Always shows relative time, good for activity feeds
          </p>
          <p>
            <strong>formatSmartTime:</strong> Automatically adapts based on time difference
          </p>
        </div>
      </div>
    </div>
  );
}
