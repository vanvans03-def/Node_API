const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1625853',
  key: '24e5570ed709b635a346',
  secret: 'ac22245c9f50acb305b9',
  cluster: 'ap1',
  useTLS: true, // ถ้าใช้ HTTPS
});

const chatModel = require('./models/chat.model');

module.exports = (req, res) => {
  if (req.method === 'POST') {
    const { body } = req;

    const msg = {
      senderId: body.senderId,
      receiverId: body.receiverId,
      message: body.message
    };

    (async () => {
      const chat = new chatModel(msg);
      await chat.save();

      let targetId = msg.receiverId;
      if (clients[targetId]) {
        clients[targetId].emit('message', msg);

        // ส่งข้อมูลไปยัง Pusher
        pusher.trigger('NodeAPI', 'message', {
          message: msg
        });
      }
    })();

    res.end();
  }
};
