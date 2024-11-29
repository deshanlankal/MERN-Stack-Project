import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { MongoDB } from 'winston-mongodb';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

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
  ],
  exceptionHandlers: [
    new transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

// Export the logger
export default logger;
