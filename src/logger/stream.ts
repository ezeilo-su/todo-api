import { log } from './logger';

const logStream = {
  write: (message: string) => {
    log.info(message.trim());
  }
};

export { logStream };
