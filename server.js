import express from 'express';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import walletRouter from './routes/wallet.routes.js';
import { connectToDatabase } from './config/db.config.js';
import transactionRouter from './routes/transaction.routes.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(mongoSanitize());

app.use(hpp());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(`/api/${process.env.API_VERSION}/auth`, authRouter);
app.use(`/api/${process.env.API_VERSION}/users`, userRouter);
app.use(`/api/${process.env.API_VERSION}/wallet`, walletRouter);
app.use(`/api/${process.env.API_VERSION}/transaction`, transactionRouter)

app.get('/health', (req, res) => {
  res.status(200).json({
    status: '✅ Success',
    message: 'Service is healthy',
    timestamp: new Date().toISOString()
  });
});

app.all('*', (req, res, next) => {
  return next(res.status(505).json({ message: "API endpoint not found on this server" }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`✅ API Documentation available at http://localhost:${PORT}/api-docs`);
  connectToDatabase();
});