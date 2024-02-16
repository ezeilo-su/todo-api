import { logger } from './logger';

const logStream = {
  write: (message: string) => {
    // Map Morgan log levels to Winston log levels
    if (message.includes('error')) {
      logger.error(message.trim());
    } else if (message.includes('warn')) {
      logger.warn(message.trim());
    } else if (message.includes('info')) {
      logger.info(message.trim());
    } else if (message.includes('debug')) {
      logger.debug(message.trim());
    } else {
      logger.info(message.trim());
    }
  }
};

export { logStream };
