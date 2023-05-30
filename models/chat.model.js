const mongoose = require('mongoose');

// กำหนดโครงสร้างข้อมูลแชท
const chatSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ชื่อโมเดลผู้ใช้งานที่เกี่ยวข้อง
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // ชื่อโมเดลผู้ใช้งานที่เกี่ยวข้อง
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// สร้างโมเดลแชท
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
