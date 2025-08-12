import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
    sender : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    receiver : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
    amount : { type : Number, required : true }
}, { timestamps : true });

const Transaction = mongoose.model("transactions", transactionSchema);
export default Transaction;