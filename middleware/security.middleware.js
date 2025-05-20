import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import { rateLimit } from 'express-rate-limit';

// Rate limiting configurations
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login attempts per hour
  message: 'Too many login attempts from this IP, please try again after an hour'
});

// Security middleware configuration
export const configureSecurityMiddleware = (app) => {
  // Set security HTTP headers
  app.use(helmet());

  // Rate limiting
  app.use('/api/', apiLimiter);

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Data sanitization against XSS
  app.use(xss());

  // Prevent parameter pollution
  app.use(hpp());

  // Prevent clickjacking
  helmet.frameguard({ action: 'deny' });

  // Enable XSS filter in browsers
  helmet.xssFilter();

  // Disable browser caching
  helmet.noCache();

  // Disable browser auto-sniffing
  helmet.noSniff();

  // Hide powered-by header
  helmet.hidePoweredBy();

  // Set strict transport security
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  });

  // Set content security policy
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  });
};

export { apiLimiter, loginLimiter }; 