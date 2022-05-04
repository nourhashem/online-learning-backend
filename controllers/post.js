const db = require('../models');

const add = (postObj) =>
  new Promise((resolve, reject) => {
    db.Post.create(postObj, {
      include: [
        {
          association: db.Post.owner,
        },
        {
          association: db.Post.classroom,
        },
      ],
    })
      .then((posts) => {
        resolve(posts);
      })
      .catch((error) => {
        if (error && error.errors) {
          const errorMessage = error.errors
            .map((errorObj) => errorObj.message)
            .join();
          reject(errorMessage);
        } else {
          reject('Post creation failed');
        }
      });
  });

const getAll = (classroomUuid) =>
  new Promise((resolve, reject) => {
    db.Post.findAll({
      where: {
        classroomUuid: classroomUuid,
      },
    })
      .then((posts) => resolve(posts))
      .catch((error) => reject(error));
  });

const getByUuid = (postUuid) =>
  new Promise((resolve, reject) => {
    db.Post.findByPk(postUuid)
      .then((posts) => resolve(posts))
      .catch((error) => reject(error));
  });

const remove = (postUuid) =>
  new Promise((resolve, reject) => {
    db.Post.destroy({
      where: {
        uuid: postUuid,
      },
    })
      .then((posts) => resolve(posts))
      .catch((error) => reject(error));
  });

module.exports = {
  add,
  getAll,
  remove,
  getByUuid,
};
