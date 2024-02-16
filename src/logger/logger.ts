import winston from 'winston';
import { config } from '../config';

const logger = winston.createLogger({
  // defaultMeta: { service: 'todo-api' },
  level: process.env.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level}: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

export { logger };
