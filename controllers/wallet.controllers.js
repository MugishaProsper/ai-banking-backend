import Wallet from "../models/wallet.model.js";
import { generateWalletAddress } from "../utils/generate.wallet.address.js"

export const getMyWallet = async (req, res) => {
    const { id } = req.user;
    try {
        const wallet = await Wallet.findOne({ user: id });
        if (!wallet) return  logger.error(`${id} failed to get wallet details`) && res.status(404).json({
            success: false,
            message: "You do not have a wallet yet"
        });
        logger.info(`${id} got wallet details`)
        return res.status(200).json({
            success: true,
            message: "Wallet found",
            wallet: wallet
        })
    } catch (error) {
        logger.error(`${id} failed to get wallet details`, error) 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const createWallet = async (req, res) => {
    const { id } = req.user;
    try {
        const existingWallet = await Wallet.findOne({ user: id });
        if (existingWallet) return  logger.error(`${id} failed to create wallet`) && res.status(403).json({
            success: false,
            message: "Wallet already exists"
        });
        const walletAddress = await generateWalletAddress();
        const wallet = new Wallet({ user: id, address: walletAddress });
        await wallet.save();
        logger.info(`${id} created wallet`)
        return res.status(201).json({
            success: true,
            message: "Wallet created",
            wallet: wallet
        })
    } catch (error) {
        logger.error(`${id} failed to create wallet`, error) 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const updateWallet = async (req, res) => {
    const { name } = req.body;
    const { walletId } = req.params;
    try {
        const wallet = await Wallet.findById(walletId).select("-balance");
        if (!wallet) return  logger.error(`${id} failed to update wallet`) && res.status(404).json({
            success: false,
            message: "Wallet not found"
        });
        wallet.name = name
        wallet.save();
        logger.info(`${id} updated wallet`)
        return res.status(200).json({
            success: true,
            message: "Wallet renamed successfully",
            wallet: wallet
        })
    } catch (error) {
        logger.error(`${id} failed to update wallet`, error) 
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}