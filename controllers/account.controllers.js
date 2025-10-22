import Account from "../models/account.model.js";
import { generateWalletAddress } from "../utils/generate.wallet.address.js"
import logger from "../config/logger.js";

export const getMyAccount = async (req, res) => {
    const { id } = req.user;
    try {
        const account = await Account.findOne({ user: id });
        if (!account) return  logger.error(`${id} failed to get account details`) && res.status(404).json({
            success: false,
            message: "You do not have an account yet"
        });
        logger.info(`${id} got account details`)    
        return res.status(200).json({
            success: true,
            message: "Account found",
            account: account
        })
    } catch (error) {
        logger.error(`${id} failed to get account details`, error) 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const createAccount = async (req, res) => {
    const { id } = req.user;
    try {
        const existingAccount = await Account.findOne({ user: id });
        if (existingAccount) return  logger.error(`${id} failed to create account`) && res.status(403).json({
            success: false,
            message: "Account already exists"
        });
        const accountAddress = await generateWalletAddress();
        const account = new Account({ user: id, address: accountAddress });
        await account.save();
        logger.info(`${id} created account`)
        return res.status(201).json({
            success: true,
            message: "Account created",
            account: account
        })
    } catch (error) {
        logger.error(`${id} failed to create account`, error)   
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const updateAccount = async (req, res) => {
    const { name } = req.body;
    const { accountId } = req.params;
    try {
        const account = await Account.findById(accountId).select("-balance");
        if (!account) return  logger.error(`Failed to update account ${accountId}`) && res.status(404).json({
            success: false,
            message: "Account not found"
        });
        account.name = name
        account.save();
        logger.info(`updated account ${accountId}`)
        return res.status(200).json({
            success: true,
            message: "Account renamed successfully",
            account: account
        })
    } catch (error) {
        logger.error(`Failed to update account ${accountId}`, error) 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}