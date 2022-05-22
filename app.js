const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const socket = require('./socket');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const messagesRouter = require('./routes/messages');
const classroomsRouter = require('./routes/classrooms');

const app = express();

const httpServer = require('http').createServer(app);
const options = {
  serveClient: false,
  path: '/socket',
  cors: {
    origin: 'http://localhost:3000',
  },
  transports: ['websocket'],
};
const io = require('socket.io')(httpServer, options);
global.io = io;
socket.init();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/classrooms', classroomsRouter);
app.use('/messages', messagesRouter);

module.exports = httpServer;
