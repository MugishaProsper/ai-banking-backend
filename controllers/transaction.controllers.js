import Transaction from "../models/transaction.model.js";
import Account from "../models/account.model.js";
import logger from "../config/logger.js";

export const send = async (req, res) => {
    const { id } = req.user;
    const { amount } = req.body;
    const { receiverAccountAddress } = req.params;
    try {
        const receiverAccount = await Account.findOne({ address: receiverAccountAddress });
        if (!receiverAccount) {
            logger.error(`Failed to send transaction to ${receiverAccountAddress}`)
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }
        const senderAccount = await Account.findOne({ user: id });
        if (senderAccount.address === receiverAccountAddress) {
            logger.error(`Failed to send transaction to ${receiverAccountAddress}`)
            return res.status(403).json({
                success: false,
                message: "You can't send to yourself"
            });
        }
        if (!senderAccount) {
            logger.error(`Failed to send transaction to ${receiverAccountAddress}`)
            return res.status(404).json({
                success: false,
                message: "You don't have an account yet"
            });
        }
        if (amount > senderAccount.balance) {
            logger.error(`Failed to send transaction to ${receiverAccountAddress}`)
            return res.status(403).json({
                success: false,
                message: "You don't have enough balance"
            });
        }
        const transaction = new Transaction({
            sender: id,
            receiver: receiverAccount.user,
            amount: amount
        });
        Promise.all([senderAccount.balance -= amount, receiverAccount.balance += amount]);
        Promise.all([senderAccount.save(), receiverAccount.save(), transaction.save()]);
        logger.info(`Sent ${amount} to ${receiverAccountAddress}`)
        return res.status(200).json({
            success: true,
            message: `Sent ${amount} to ${receiverAccount.address}`,
            transaction: transaction
        })
    } catch (error) {
        logger.error(`Failed to send transaction to ${receiverAccountAddress}`, error)
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
        logger.info(`Got transactions of ${id}`)
        return res.status(200).json({
            success: true,
            message: "Transactions found",
            transactions: transactions
        });
    } catch (error) {
        logger.error(`Failed to get transactions of ${id}`, error)
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
            logger.error(`Failed to get details of transaction ${transactionId}`)
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }
        logger.info(`Got details of ${transactionId}`)
        return res.status(200).json({
            success: true,
            message: "Transaction found",
            transaction: transaction
        })
    } catch (error) {
        logger.error(`Failed to get transaction details of ${transactionId}`, error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}