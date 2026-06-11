require('dotenv').config(); 
const express = require('express');
const http = require('http');           // ← add
const { Server } = require('socket.io'); // ← add
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000;

const { router: authRouter } = require('./routes/login');
const msg = require('./routes/functionality');
const { Message } = require('./db');     // ← add (your message model)
const cors = require('cors');
const cookieParser = require('cookie-parser');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 mins per IP
  message: { error: 'Too many requests, slow down' }
});

const Secret_Key = process.env.SECRET_KEY;             // ← add

const server = http.createServer(app);  // ← wrap express
const io = new Server(server, {         // ← add
  cors: {
    origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],
    credentials: true
  }
});


app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:3000'],
  credentials: true
}));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(authRouter);
app.use(msg);

// socket setup
const connectedUsers = {};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  try {
    const decoded = jwt.verify(token, Secret_Key);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  const email = socket.user.email;
  connectedUsers[email] = socket.id;
  console.log('online users:', connectedUsers);

  socket.on('sendMessage', async ({ to, msg }) => {
    try {
      // save to DB
      const message = new Message({ userName: email, msg, sendTo: to });
      await message.save();

      // push to receiver if online
      const receiverSocketId = connectedUsers[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', { from: email, msg });
      }
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('disconnect', () => {
    delete connectedUsers[email];
    console.log(`${email} disconnected`);
  });
});

// ← change app.listen to server.listen
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});