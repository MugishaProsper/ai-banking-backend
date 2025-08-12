import Wallet from "../models/wallet.model.js";
import { generateWalletAddress } from "../utils/generate.wallet.address.js"

export const getMyWallet = async (req, res) => {
    const { id } = req.user;
    try {
        const wallet = await Wallet.findOne({ user : id });
        if(!wallet) return res.status(404).json({ message : "You do not have a wallet yet" });
        return res.status(200).json({ message : "Wallet found", wallet : wallet })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    } 
};

export const createWallet = async (req, res) => {
    const { id } = req.user;
    try {
        const existingWallet = await Wallet.findOne({ user : id });
        if(existingWallet) return res.status(403).json({ message : "Wallet already exists" });
        const walletAddress = await generateWalletAddress();
        const wallet = new Wallet({ user : id, address : walletAddress });
        await wallet.save();
        return res.status(201).json({ message : "Wallet created" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message : "Internal server error" })
    }
}