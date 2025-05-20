import express from 'express';
import { authorise } from '../middleware/auth.middleware.js';
import { createAccount, withdrawAmount, depositAmount, transferAmount } from "../controllers/user.controllers.js";

const userRouter = express.Router();

userRouter.post('/create', authorise, createAccount)
userRouter.post('/withdraw', authorise, withdrawAmount)
userRouter.post('/transfer', authorise,transferAmount)
userRouter.post('/deposit', authorise, depositAmount)

export default userRouter