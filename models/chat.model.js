const mongoose = require('mongoose');
const moment = require('moment-timezone');

const chatSchema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // เก็บวันที่เป็น UTC
  },
});

chatSchema.virtual('localTimestamp').get(function() {
  return moment(this.timestamp).tz('Asia/Bangkok'); // แปลงเวลาไปยังเขตเวลาท้องถิ่น (Asia/Bangkok)
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
