import express from 'express';
import { connectToDatabase } from './config/db.config.js';
import router from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', router);
app.use('/api/account', userRouter);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
})