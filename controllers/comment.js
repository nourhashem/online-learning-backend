const db = require('../models');

const add = (commentObj) =>
  new Promise((resolve, reject) => {
    db.Comment.create(commentObj, {
      include: [
        {
          association: db.Comment.owner,
        },
        {
          association: db.Comment.post,
        },
      ],
    })
      .then((comment) => {
        resolve(comment);
      })
      .catch((error) => {
        if (error && error.errors) {
          const errorMessage = error.errors
            .map((errorObj) => errorObj.message)
            .join();
          reject(errorMessage);
        } else {
          reject('Comment creation failed');
        }
      });
  });

const getAll = (postUuid) =>
  new Promise((resolve, reject) => {
    db.Comment.findAll({
      where: {
        postUuid: postUuid,
      },
    })
      .then((comments) => resolve(comments))
      .catch((error) => reject(error));
  });

const getByUuid = (commentUuid) =>
  new Promise((resolve, reject) => {
    db.Comment.findByPk(commentUuid)
      .then((comment) => resolve(comment))
      .catch((error) => reject(error));
  });

const remove = (commentUuid) =>
  new Promise((resolve, reject) => {
    db.Comment.destroy({
      where: {
        uuid: commentUuid,
      },
    })
      .then((comment) => resolve(comment))
      .catch((error) => reject(error));
  });

module.exports = {
  add,
  getAll,
  remove,
  getByUuid,
};
