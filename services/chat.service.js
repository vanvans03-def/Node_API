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
  const match = {
    $or: [
      { senderId: new RegExp(uid, "i") },
      { receiverId: new RegExp(uid, "i") },
    ],
  };

  const pipeline = [
    { $match: match },
    {
      $project: {
        senderId: 1,
        receiverId: 1,
        message: 1,
        timestamp: 1,

      },
    },
  ];

  return ChatModel.aggregate(pipeline);
} catch (error) {
  throw new Error('Failed to load chat messages from the database.'+error);
}
}

module.exports = {
  loadChatFromDatabase,
  getChatByUID
};
