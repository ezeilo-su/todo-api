import winston from 'winston';
import { join } from 'path';

const logger = winston.createLogger({
  // defaultMeta: { service: 'todo-api' },
  format: winston.format.combine(winston.format.colorize(), winston.format.json()),
  transports: [
    new winston.transports.File({
      filename: join(__dirname, '../../logs/error.log'),
      level: 'error'
    }),
    new winston.transports.File({ filename: join(__dirname, '../../logs/combined.log') })
  ]
});

if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'staging') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple()
    })
  );
}

export { logger as log };
