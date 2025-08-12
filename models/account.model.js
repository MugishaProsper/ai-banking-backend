import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
    wallet : { type : mongoose.Schema.Types.ObjectId, ref : "User" },
    balance : { type : Number, default : 0.0 }
}, { timestamps : true });

const Account = mongoose.model("accounts", accountSchema);
export default Account