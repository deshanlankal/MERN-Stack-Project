import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js'
import path from 'path';

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    logger.info('Connected to MongoDB!');
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    logger.error('MongoDB Connection Error:', err);
    console.log(err);
  });

  const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  logger.info({
    message: 'Incoming Request',
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  next();
});


app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);


app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
   // Log the error
   logger.error({
    message: 'Unhandled Error',
    statusCode,
    method: req.method,
    url: req.url,
    ip: req.ip,
    stack: err.stack,
  });
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

