const chatModel = require('../models/chat.model');

class ChatService {
    constructor(chatModel) {
      this.chatModel = chatModel;
    }
  
    async createMessage(roomId, message) {
      return this.chatModel.createMessage(roomId, message);
    }
  
    async getMessagesByRoomId(roomId) {
      return this.chatModel.getMessagesByRoomId(roomId);
    }
  }
  
  module.exports = ChatService;
  