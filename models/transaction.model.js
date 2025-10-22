import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet", required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    notes : { type : String }    
}, { timestamps: true });

const Transaction = mongoose.model("transactions", transactionSchema);
export default Transaction;