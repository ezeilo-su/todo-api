import winston from 'winston';

const logger = winston.createLogger({
  // defaultMeta: { service: 'todo-api' },
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      return `${info.timestamp} - ${info.level}: ${info.message}`;
    })
  ),
  transports: [new winston.transports.Console()]
});

export { logger };
