import express from "express";
import { getMyTransactions, getTransactionDetails, send } from "../controllers/transaction.controllers.js";
import { authorise } from "../middleware/auth.middleware.js";

const transactionRouter = express.Router();

transactionRouter.use(authorise);

transactionRouter.post("/:receiverWalletAddress", send);
transactionRouter.get("/", getMyTransactions);
transactionRouter.get("/:transactionId", getTransactionDetails)

export default transactionRouter;