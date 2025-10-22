import express from "express";
import { authorise } from "../middleware/auth.middleware.js";
import { createAccount, getMyAccount, updateAccount } from "../controllers/account.controllers.js";

const accountRouter = express.Router();

accountRouter.use(authorise);

accountRouter.get("/", getMyAccount);
accountRouter.post("/", createAccount);
accountRouter.put("/:walletId", updateAccount);

export default accountRouter