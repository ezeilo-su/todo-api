import { app } from './app';
import { config } from './config';
import { logger } from './logger/logger';
import { connectDB } from './setup/db';

(async () => {
  await connectDB(config.dbConfig);
  app.listen(config.serverPort, () => {
    logger.info(`App listening on PORT: ${config.serverPort}`);
  });
})();
