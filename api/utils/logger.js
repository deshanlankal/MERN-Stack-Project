import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { MongoDB } from 'winston-mongodb';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import events from 'events';

dotenv.config();
events.defaultMaxListeners = 20;

const __dirname = path.resolve(); // Get the current directory

// Ensure the logs directory exists
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Transport for unknown routes logging
const unknownRouteLogTransport = new DailyRotateFile({
  filename: path.join(logDir, 'unknown-routes-%DATE%.log'), // Custom log file name pattern
  datePattern: 'YYYY-MM-DD', // Log file rotation by day
  maxSize: '20m', // Maximum file size before rotating
  maxFiles: '14d', // Keep logs for 14 days
});

// Configure the logger
const logger = createLogger({
  level: 'info', // Default log level to info
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          ({ timestamp, level, message, stack }) =>
            `${timestamp} [${level}]: ${stack || message}`
        )
      ),
    }),
    new transports.File({
      filename: path.join(logDir, 'application.log'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    new transports.File({
      filename: path.join(logDir, 'user-login.log'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(logDir, 'user-signup.log'),
      level: 'info',
    }),
    new transports.File({
      filename: path.join(logDir, 'item-creation.log'),
      level: 'info',
    }),
    new MongoDB({
      db: process.env.MONGO,  
      collection: 'logs', 
      level: 'info', 
      storeHost: true, 
      capped: true, 
      maxSize: 1000000, 
    }),
    new DailyRotateFile({
      filename: path.join(logDir, 'application-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
    unknownRouteLogTransport, // Custom transport for unknown routes
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

export default logger;
