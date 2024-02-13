import { app } from './app';

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () => {
  console.info(`App listening on PORT: ${SERVER_PORT}`);
});
