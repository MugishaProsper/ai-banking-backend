import mongoose from "mongoose";

const transactionSchema = mongoose.Schema({
  senderId : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
  receiverId : { type : mongoose.Schema.Types.ObjectId, ref : "User", required : true },
  amount : { type : String, required : true }
}, { timestamps : true });

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;