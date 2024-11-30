import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

// Serve the error page for unknown routes
app.get('*', (req, res) => {
  const statusCode = 404;

  // Log the unknown route access to the custom log file
  logger.info({
    message: 'Unknown Route Accessed',
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip,
  });

  if (process.env.NODE_ENV === 'development') {
    logger.info({
      message: 'Serving custom 404 error page',
      statusCode,
      method: req.method,
      url: req.url,
      ip: req.ip,
    });

    res.status(statusCode).sendFile(path.join(__dirname, 'client', 'src', 'errors', '404.html'));
  } else {
    res.status(statusCode).sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
