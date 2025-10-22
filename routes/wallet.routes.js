import express from "express";
import { authorise } from "../middleware/auth.middleware.js";
import { createWallet, getMyWallet, updateWallet } from "../controllers/wallet.controllers.js";

const walletRouter = express.Router();

walletRouter.use(authorise);

walletRouter.get("/", getMyWallet);
walletRouter.post("/", createWallet);
walletRouter.put("/:walletId", updateWallet);

export default walletRouter