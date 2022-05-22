const users = require('./users');
const userController = require('../controllers/user');
const messageController = require('../controllers/message');
const { USER_ROLES } = require('../utils/constants');
const events = require('./events');

const init = () => {
  io.on(events.CONNECTION, (socket) => {
    const userUuid = socket.handshake.query.userUuid;
    if (userUuid && userUuid !== 'null') {
      joinRooms(socket, userUuid);
      users.add(userUuid, socket.id);
    } else {
      console.log('received null userUuid disconnecting', socket.id);
      socket.disconnect();
    }

    socket.on(events.SEND_MESSAGE, (data) => {
      console.log('received SEND_MESSAGE', data);
      io.to(data.classroomUuid).emit(events.MESSAGE, data);
      messageController.add(data);
    });

    socket.on(events.DISCONNECT, () => {
      console.log('disconnect', socket.id);
      users.remove(userUuid, socket.id);
    });
  });
};

const joinRooms = async (socket, userUuid) => {
  const user = await userController.getByUuid(userUuid);
  if (user) {
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
  }
};

module.exports = { init };
