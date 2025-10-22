import Transaction from "../models/transaction.model.js";
import Wallet from "../models/wallet.model.js";
import logger from "../config/logger.js";

export const send = async (req, res) => {
    const { id } = req.user;
    const { amount } = req.body;
    const { receiverWalletAddress } = req.params;
    try {
        const receiverWallet = await Wallet.findOne({ address: receiverWalletAddress });
        if (!receiverWallet) {
            logger.error(`${id} failed to send transaction to ${receiverWalletAddress}`)
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }
        const senderWallet = await Wallet.findOne({ user: id });
        if (senderWallet.address === receiverWalletAddress) {
            logger.error(`${id} failed to send transaction to ${receiverWalletAddress}`)
            return res.status(403).json({
                success: false,
                message: "You can't send to yourself"
            });
        }
        if (!senderWallet) {
            logger.error(`${id} failed to send transaction to ${receiverWalletAddress}`)
            return res.status(404).json({
                success: false,
                message: "What the fuck are u tryna send? You don't even have a wallet"
            });
        }
        if (amount > senderWallet.balance) {
            logger.error(`${id} failed to send transaction to ${receiverWalletAddress}`)
            return res.status(403).json({
                success: false,
                message: "You don't have enough balance"
            });
        }
        const transaction = new Transaction({
            sender: id,
            receiver: receiverWallet.user,
            amount: amount
        });
        Promise.all([senderWallet.balance -= amount, receiverWallet.balance += amount]);
        Promise.all([senderWallet.save(), receiverWallet.save(), transaction.save()]);
        logger.info(`${id} sent ${amount} to ${receiverWalletAddress}`)
        return res.status(200).json({
            success: true,
            message: `You have sent ${amount} to ${receiverWallet.address}`,
            transaction: transaction
        })
    } catch (error) {
        logger.error(`${id} failed to send transaction to ${receiverWalletAddress}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const getMyTransactions = async (req, res) => {
    const { id } = req.user;
    try {
        const transactions = await Transaction.find({ $or: [{ sender: id }, { receiver: id }] });
        logger.info(`${id} got transactions`)
        return res.status(200).json({
            success: true,
            message: "Transactions found",
            transactions: transactions
        });
    } catch (error) {
        logger.error(`${id} failed to get transactions`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
};

export const getTransactionDetails = async (req, res) => {
    const { transactionId } = req.params;
    try {
        const transaction = await Transaction.findById(transactionId);
        if (!transaction) {
            logger.error(`${id} failed to get transaction details`)
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }
        logger.info(`${id} got transaction details`)
        return res.status(200).json({
            success: true,
            message: "Transaction found",
            transaction: transaction
        })
    } catch (error) {
        logger.error(`${id} failed to get transaction details`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}