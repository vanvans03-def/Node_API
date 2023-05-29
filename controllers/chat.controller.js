// controllers/chatController.js
class ChatController {
    constructor(chatService) {
      this.chatService = chatService;
    }
  
    async createMessage(req, res) {
      const { roomId, message } = req.body;
      try {
        const newMessage = await this.chatService.createMessage(roomId, message);
        res.status(201).json(newMessage);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
      }
    }
  
    async getMessagesByRoomId(req, res) {
      const { roomId } = req.params;
      try {
        const messages = await this.chatService.getMessagesByRoomId(roomId);
        res.status(200).json(messages);
      } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
      }
    }
  }
  
  module.exports = ChatController;
  