import { app } from './app';
import { config } from './config';
import { logger } from './logger/logger';

const SERVER_PORT = config.serverPort;

app.listen(SERVER_PORT, () => {
  logger.info(`App listening on PORT: ${SERVER_PORT}`);
});
