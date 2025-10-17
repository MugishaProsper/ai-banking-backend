import mongoose from "mongoose";

const walletSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    address: { type: String },
    balance: { type: Number, default: 0.0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }]
}, { timestamps: true });

const Wallet = mongoose.model("wallets", walletSchema);
export default Wallet;