import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName : { type : String, required : true },
  lastName : { type : String, required : true },
  email : { type : String, required : true },
  password : { type : String, required : true },
  verificationCode : { type : String, required : true },
  isVerified : { type : Boolean, default : false }
}, { timestamps : true });

const accountSchema = mongoose.Schema({
  id : { type : mongoose.Types.ObjectId, ref : 'User', required : true },
  balance : { type : Number, default : 0 },
  password : { type : String, required : true }
});

const transactionSchema = mongoose.Schema({
  sender : { type : mongoose.Types.ObjectId, ref : 'User' },
  reciever :{ type : mongoose.Types.ObjectId, ref : 'User' },
  amount : { type : Number, required : true }
}, { timestamps : true })

export const User = mongoose.model('User', userSchema);
export const Account = mongoose.model('Account', accountSchema);
export const Transaction = mongoose.model('Transaction', transactionSchema)

export default { User, Account, Transaction };