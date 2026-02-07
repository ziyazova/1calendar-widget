type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: 'color: #6b7280',
  info: 'color: #3b82f6',
  warn: 'color: #f59e0b',
  error: 'color: #ef4444',
};

function formatTime(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
}

function log(level: LogLevel, module: string, message: string, ...data: unknown[]): void {
  if (!import.meta.env.DEV) return;

  const prefix = `%c[${formatTime()}] [${level.toUpperCase()}] [${module}]`;
  const style = LEVEL_COLORS[level];

  if (data.length > 0) {
    console[level](prefix, style, message, ...data);
  } else {
    console[level](prefix, style, message);
  }
}

export const Logger = {
  debug: (module: string, message: string, ...data: unknown[]) => log('debug', module, message, ...data),
  info: (module: string, message: string, ...data: unknown[]) => log('info', module, message, ...data),
  warn: (module: string, message: string, ...data: unknown[]) => log('warn', module, message, ...data),
  error: (module: string, message: string, ...data: unknown[]) => log('error', module, message, ...data),
};
