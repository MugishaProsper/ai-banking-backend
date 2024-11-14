import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  destination : { type : mongoose.Types.ObjectId, ref : 'User' },
  message : { type : String, required : true },
  isRead : { type : Boolean, default : false }
}, { timestamps : true });

export const Notification = mongoose.model('Notifications', notificationSchema);

export default Notification;