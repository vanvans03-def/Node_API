
const chatServices = require('../services/chat.service');
exports.loadChatFromDatabase = async (req, res, next) => {
  try {
      const data = req.body;
     
      const chats = await chatServices.loadChatFromDatabase(data);

      return res.status(200).send({
          message: "Success",
          data: chats,
      });
  } catch (error) {
      return next(error);
  }
};
