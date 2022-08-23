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
      include: [
        {
          model: db.Comment,
          as: 'comments',
          include: {
            model: db.User,
            as: 'owner',
          },
        },
      ],
    })
      .then((posts) => resolve(posts))
      .catch((error) => reject(error));
  });

const getByUuid = (postUuid) =>
  new Promise((resolve, reject) => {
    db.Post.findByPk(postUuid, {
      include: [
        {
          model: db.Comment,
          as: 'comments',
          include: {
            model: db.User,
            as: 'owner',
          },
        },
      ],
    })
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

const update = (postObj) =>
  new Promise((resolve, reject) => {
    db.Post.update(
      { title: postObj.title, body: postObj.body },
      {
        where: {
          uuid: postObj.uuid,
        },
      }
    )
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
          reject('Failed to update the post');
        }
      });
  });

const attach = (attachmentObj) =>
  new Promise((resolve, reject) => {
    console.log('I am the attachmentObject', { attachmentObj });
    db.Attachment.create(attachmentObj, {
      include: [
        {
          association: db.Attachment.post,
        },
      ],
    })
      .then((attachments) => resolve(attachments))
      .catch((error) => reject(error));
  });

module.exports = {
  add,
  getAll,
  remove,
  getByUuid,
  update,
  attach,
};
