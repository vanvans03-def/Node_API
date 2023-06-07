const ChatModel = require('../models/chat.model');

async function loadChatFromDatabase(data) {
  try {
    const { senderId, receiverId} = data;
    const chatMessages = await ChatModel.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    }).sort({ timestamp: -1 });

    return chatMessages;
  } catch (error) {
    throw new Error('Failed to load chat messages from the database.');
  }
}

async function getChatByUID(data){
try {
  const uid = data;
  const chatMessages = await ChatModel.find({uid});
  return chatMessages;
} catch (error) {
  throw new Error('Failed to load chat messages from the database.');
}
}

module.exports = {
  loadChatFromDatabase,
  getChatByUID
};
