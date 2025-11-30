/**
 * Logger service
 * Per constitution: Log errors + critical actions, no sensitive data
 * Excludes: tokens, emails, personal info
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

/**
 * Logger class
 * Centralized logging with configurable levels
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = __DEV__;
  }

  /**
   * Sanitize log context to remove sensitive data
   * Per constitution: Never log tokens, emails, or sensitive info
   */
  private sanitizeContext(context?: LogContext): LogContext {
    if (!context) return {};

    const sanitized: LogContext = {};
    const sensitiveKeys = ['token', 'password', 'email', 'authorization', 'auth'];

    for (const [key, value] of Object.entries(context)) {
      // Check if key contains sensitive data markers
      const isSensitive = sensitiveKeys.some((sensitiveKey) =>
        key.toLowerCase().includes(sensitiveKey)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        // Recursively sanitize nested objects
        sanitized[key] = this.sanitizeContext(value as LogContext);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Format log message
   */
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const sanitizedContext = this.sanitizeContext(context);
    const contextStr = Object.keys(sanitizedContext).length
      ? ` ${JSON.stringify(sanitizedContext)}`
      : '';

    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * Log a debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const formatted = this.formatMessage('debug', message, context);
      console.log(formatted);
    }
  }

  /**
   * Log an info message (critical actions only)
   * Examples: User logged in, Profile updated, Domain added
   */
  info(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('info', message, context);
    console.log(formatted);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('warn', message, context);
    console.warn(formatted);
  }

  /**
   * Log an error message
   * Always logged, includes error details (sanitized)
   */
  error(message: string, context?: LogContext): void {
    const formatted = this.formatMessage('error', message, context);
    console.error(formatted);

    // In production, this would send to error tracking service
    // Examples: Sentry, Bugsnag, Firebase Crashlytics
  }

  /**
   * Log a critical action (user-initiated important events)
   * Examples: Login, Logout, Profile creation, Share generation
   */
  critical(action: string, context?: LogContext): void {
    const formatted = this.formatMessage('info', `CRITICAL: ${action}`, context);
    console.log(formatted);

    // In production, this would send to analytics service
    // Examples: Mixpanel, Amplitude, Firebase Analytics
  }
}

/**
 * Singleton instance
 */
export const logger = new Logger();
