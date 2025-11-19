type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, ...args: any[]) {
    // In development: log everything
    if (this.isDevelopment) {
      console[level](...args);
      return;
    }

    // In production: only log warnings and errors to console
    // This ensures critical issues are visible in Vercel logs
    if (level === 'warn' || level === 'error') {
      console.error(`[${level.toUpperCase()}]`, ...args);
    }

    // TODO: Send to external logging service (e.g., Sentry, LogRocket, Datadog)
    // if (process.env.SENTRY_DSN) {
    //   Sentry.captureMessage(...args);
    // }
  }

  debug(...args: any[]) {
    this.log('debug', ...args);
  }

  info(...args: any[]) {
    this.log('info', ...args);
  }

  warn(...args: any[]) {
    this.log('warn', ...args);
  }

  error(...args: any[]) {
    this.log('error', ...args);
  }
}

export const logger = new Logger();
