import { Transaction, Account } from '../models/user.models.js';
import bcrypt from 'bcryptjs';

export const createAccount = async (req, res) => {
  const userId = req.user._id;
  const { password } = req.body;
  try {
    const existing_account = await Account.findById(userId);
    if(existing_account){
      return res.status(403).json({ message : "Account already exists" });
    };
    const hashedPassword = await bcrypt.hash(password, 19)
    const new_account = new Account({ id : userId, password : hashedPassword });
    await new_account.save();
    return res.status(200).json({ message : "Account created successfully." });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
}

export const withdrawAmount = async (req, res) => {
  const userId = req.user._id;
  const { amount, password } = req.body;
  try {
    const account = await Account.findById(userId);
    if(!account){
      return res.status(404).json({ message : "No account found" });
    }
    const isAccountPasswordValid = await bcrypt.compare(password, account.password);
    if(!isAccountPasswordValid){
      return res.status(401).json({ message : "Incorrect account password" });
    };
    if(!(amount <= account.balance)){
      return res.status(401).json({ message : `Your amount ${amount} is greater than your balance ${account.balance}`})
    }
    account.balance -= amount;
    await account.save();

    return res.status(200).json({ message : `Transaction done successfully. New balance is ${account.balance}`})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};

export const depositAmount = async (req, res) => {
  const userId = req.user._id;
  const { amount, password } = req.body;
  try {
    const account = await Account.findById(userId);
    if(!account){
      return res.status(404).json({ message : "No account found" });
    }
    const isAccountPasswordValid = await bcrypt.compare(password, account.password);
    if(!isAccountPasswordValid){
      return res.status(401).json({ message : "Incorrect account password" });
    }
    // Implementation of core feature
    account.balance += amount;
    await account.save();
    return res.status(200).json({ message : `Transaction done successfully. New balance is ${account.balance}`})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};

export const transferAmount = async (req, res) => {
  const userId = req.user._id;
  const { recipientId, amount, password } = req.body;
  try {
    const account = await Account.findById({owner : userId});
    if(!account){
      return res.status(404).json({ message : "You don't have an account" });
    }
    const recipient_account = await Account.findById(recipientId);
    if(!recipient_account){
      return res.status(404).json({ message : "Destination user does not have an account" });
    }
    const isPasswordAccountValid = await bcrypt.compare(password, account.password);
    if(!isPasswordAccountValid){
      return res.status(401).json({ message : "Incorrect password"});
    }
    // Implementation of main feature
    account.balance -= amount;
    recipient_account.balance += amount;

    await account.save();
    await recipient_account.save();
    await recordTransaction(userId, recipientId, amount);

    return res.status(200).json({ message : `Transfer done successfully. Your new balance is ${account.balance}`})
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ message : "Server error" });
  }
};

export const recordTransaction = async (senderId, recieverId, amount) => {
  try {
    const newTransaction = new Transaction({ sender : senderId, receiver : recieverId, amount : amount });
    await newTransaction.save();
  } catch (error) {
    console.log(error.message);
  }
}

export const makeNotification = async (senderId, receiverId, message) => {
  try {
    const newNotification = new Notification({ source : senderId, destination : receiverId, message : message });
    await newNotification.save();
  } catch (error) {
    console.log(error.message)
  }
}