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

export const User = mongoose.model('User', userSchema);
export const Account = mongoose.model('Account', accountSchema);

export default { User, Account };