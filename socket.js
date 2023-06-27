// socket.js (สำหรับ server Socket.IO)
const http = require("http");
const { Server } = require("socket.io");
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: '1625853',
  key: '24e5570ed709b635a346',
  secret: 'ac22245c9f50acb305b9',
  cluster: 'ap1',
  useTLS: true, // ถ้าใช้ HTTPS
});

const server = http.createServer();
const io = new Server(server);

var clients = {};
const chatModel = require('./models/chat.model');

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log(clients);
  });

  socket.on("message", async (msg) => {
    console.log(msg);
    const chat = new chatModel({
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      message: msg.message
    });
    await chat.save();
    let targetId = msg.receiverId;
    if (clients[targetId]) {
      clients[targetId].emit("message", msg);

      // ส่งข้อมูลไปยัง Pusher
      pusher.trigger('NodeAPI', 'message', {
        message: msg
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const socketPort = process.env.PORT || 3700;

server.listen(socketPort, () => {
  console.log(`Socket.IO server running on port ${socketPort}`);
});
