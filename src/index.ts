import { app } from './app';
import { log } from './logger/logger';

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () => {
  log.info(`App listening on PORT: ${SERVER_PORT}`);
});
