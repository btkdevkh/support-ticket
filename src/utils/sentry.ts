import * as Sentry from "@sentry/nextjs";

type LogLevel = "fatal" | "error" | "warning" | "info" | "debug";

const logSentryEvent = (
  message: string,
  category: string = "general",
  data?: Record<string, any>,
  level: LogLevel = "info",
  error?: unknown
) => {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level,
  });

  if (error) {
    Sentry.captureException(error as Error, {
      extra: data,
    });
  } else {
    Sentry.captureMessage(message, level);
  }
};

export { logSentryEvent };
