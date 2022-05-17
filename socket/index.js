const users = require('./users');
const userController = require('../controllers/user');
const { USER_ROLES } = require('../utils/constants');

const init = () => {
  io.on('connection', (socket) => {
    io.emit('message', `HELLO ${socket.id}`);
    io.to('d3b38471-2610-4ae5-a32b-14fd020435d9').emit(
      'message',
      'HELLO CLASSROOM'
    );
    const userUuid = socket.handshake.query.userUuid;
    users.add(userUuid, socket.id);
    joinRooms(socket, userUuid);
    socket.on('disconnect', () => {
      console.log('disconnect', socket.id);
      users.remove(userUuid, socket.id);
    });
  });
};

const joinRooms = async (socket, userUuid) => {
  const user = await userController.getByUuid(userUuid);
  let classrooms = [];
  if (user.role === USER_ROLES.STUDENT) {
    classrooms = await user.getStudentClassrooms();
  }
  if (user.role === USER_ROLES.INSTRUCTOR) {
    classrooms = await user.getInstructorClassrooms();
  }
  for (let i = 0; i < classrooms.length; i++) {
    const classroom = classrooms[i];
    console.log(socket.id, 'joining', classroom.uuid);
    socket.join(classroom.uuid);
  }
};

module.exports = { init };
