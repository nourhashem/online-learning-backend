const db = require('../models');

const add = (messageObj) =>
  new Promise((resolve, reject) => {
    db.Message.create(messageObj, {
      include: [
        {
          association: db.Message.owner,
        },
        {
          association: db.Message.classroom,
        },
      ],
    })
      .then((messages) => {
        resolve(messages);
      })
      .catch((error) => {
        if (error && error.errors) {
          const errorMessage = error.errors
            .map((errorObj) => errorObj.message)
            .join();
          reject(errorMessage);
        } else {
          reject('Message creation failed');
        }
      });
  });

const getAll = (classroomUuid, { offset = 0, limit = 20 }) =>
  new Promise((resolve, reject) => {
    db.Message.findAll({
      where: {
        classroomUuid: classroomUuid,
      },
      offset,
      limit,
      order: [['timestamp', 'DESC']],
    })
      .then((messages) => resolve(messages))
      .catch((error) => reject(error));
  });

const getByUuid = (messageUuid) =>
  new Promise((resolve, reject) => {
    db.Message.findByPk(messageUuid)
      .then((message) => resolve(message))
      .catch((error) => reject(error));
  });

const remove = (messageUuid) =>
  new Promise((resolve, reject) => {
    db.Message.destroy({
      where: {
        uuid: messageUuid,
      },
    })
      .then((messages) => resolve(messages))
      .catch((error) => reject(error));
  });

module.exports = {
  add,
  getAll,
  remove,
  getByUuid,
};
