import { app } from './app';
import { config } from './config';
import { logger } from './logger/logger';

app.listen(config.serverPort, () => {
  logger.info(`App listening on PORT: ${config.serverPort}`);
});
