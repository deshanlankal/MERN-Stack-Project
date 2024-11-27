import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Well the mongoDB is connecte 👌😊');
  })
  .catch((err) => {
    console.log(err);
    console.log("DB is Fucked check the user name and the password 🖕")
  });

const app = express();

app.listen(3000, () => {
    console.log('Well Well Server is Running in port 3000 can you plz shut up try it 😁');
    }
);