import { logger } from './logger';

const logStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

export { logStream };
