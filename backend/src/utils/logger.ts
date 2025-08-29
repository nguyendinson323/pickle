interface LogLevel {
  ERROR: 'error';
  WARN: 'warn';
  INFO: 'info';
  DEBUG: 'debug';
}

const LOG_LEVELS: LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (data) {
      return `${logMessage}\n${JSON.stringify(data, null, 2)}`;
    }
    
    return logMessage;
  }

  error(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.ERROR, message, data);
    console.error(formattedMessage);
  }

  warn(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.WARN, message, data);
    console.warn(formattedMessage);
  }

  info(message: string, data?: any): void {
    const formattedMessage = this.formatMessage(LOG_LEVELS.INFO, message, data);
    console.info(formattedMessage);
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(LOG_LEVELS.DEBUG, message, data);
      console.debug(formattedMessage);
    }
  }
}

export default new Logger();