import morgan from 'morgan';
import winston from 'winston';

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Request logger middleware
export const requestLogger = (req, res, next) => {
  logger.info({
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
};

// Error logger middleware
export const errorLogger = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next(err);
};

// Configure logger middleware
export const configureLogger = (app) => {
  // Use Morgan for HTTP request logging
  app.use(morgan('dev'));

  // Use Winston for application logging
  app.use(requestLogger);

  // Log errors
  app.use(errorLogger);
}; 