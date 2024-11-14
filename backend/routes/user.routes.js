import express from 'express';
import { authorise } from '../middleware/auth.middleware';

const userRouter = express.Router();

userRouter.post('/create', authorise, )

