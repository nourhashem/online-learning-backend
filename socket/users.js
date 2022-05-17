const users = {};

const add = (userUuid, socketId) => {
  if (users[userUuid]) {
    const sockets = [...users[userUuid], socketId];
    users[userUuid] = sockets;
    console.log('add', { users });
    return;
  }
  users[userUuid] = [socketId];
  console.log('add', { users });
};

const get = (userUuid) => {
  return users[userUuid];
};

const remove = (userUuid, socketId) => {
  if (!users[userUuid]) return;
  const sockets = users[userUuid].filter((socket) => socket != socketId);
  if (sockets.length) users[userUuid] = sockets;
  else delete users[userUuid];
  console.log('remove', { users });
};

module.exports = {
  add,
  get,
  remove,
};
