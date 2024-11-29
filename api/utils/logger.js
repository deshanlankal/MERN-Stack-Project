import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve(); // Get the current directory

// Ensure the logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Configure the logger
const logger = createLogger({
  level: 'info', // Default log level
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    // Console transport for immediate visibility during development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} [${level}]: ${stack || message}`
        )
      ),
    }),
    // File transport for general logs
    new transports.File({
      filename: path.join(logDir, 'application.log'),
      level: 'info',
    }),
    // File transport for error logs
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    // Separate log file for user login events
    new transports.File({
      filename: path.join(logDir, 'user-login.log'),
      level: 'info',
    }),
    // Separate log file for user sign up events
    new transports.File({
      filename: path.join(logDir, 'user-signup.log'),
      level: 'info',
    }),
    // Separate log file for item creation (listing) events
    new transports.File({
      filename: path.join(logDir, 'item-creation.log'),
      level: 'info',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

// Daily rotate file transport for logs
new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

// Export the logger
export default logger;
