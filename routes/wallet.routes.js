import express from "express";
import { authorise } from "../middleware/auth.middleware.js";
import { createWallet, getMyWallet } from "../controllers/wallet.controllers.js";

const walletRouter = express.Router();

walletRouter.use(authorise);

walletRouter.get("/", getMyWallet);
walletRouter.post("/", createWallet);

export default walletRouter