import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String },
    address: { type: String },
    balance: { type: Number, default: 0.0 },
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    type : { String, enum : ["SAVINGS", "CHECKING"], default : "CHECKING"}
}, { timestamps: true });

const Account = mongoose.model("accounts", accountSchema);
export default Account;
