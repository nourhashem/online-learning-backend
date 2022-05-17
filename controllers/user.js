const { Op } = require('sequelize');
const db = require('../models');

const add = (userObj) =>
  new Promise((resolve, reject) => {
    db.User.create(userObj)
      .then((users) => {
        resolve(users);
      })
      .catch((error) => {
        if (error && error.errors) {
          const errorMessage = error.errors
            .map((errorObj) => errorObj.message)
            .join();
          reject(errorMessage);
        } else {
          reject('User creation failed');
        }
      });
  });

const getByEmail = (userEmail) =>
  new Promise((resolve, reject) => {
    db.User.findAll({
      where: {
        email: userEmail,
      },
    })
      .then((users) => {
        console.log({ users });
        if (!users.length) resolve(null);
        resolve(users[0]);
      })
      .catch((error) => {
        console.log({ error });
        reject(error);
      });
  });

const getAll = () =>
  new Promise((resolve, reject) => {
    db.User.findAll()
      .then((users) => resolve(users))
      .catch((error) => reject(errors));
  });

const getByUuid = (userUuid) =>
  new Promise((resolve, reject) => {
    db.User.findByPk(userUuid)
      .then((posts) => resolve(posts))
      .catch((error) => reject(error));
  });

const getByEmails = (userEmails) =>
  new Promise((resolve, reject) => {
    db.User.findAll({
      where: {
        email: {
          [Op.or]: userEmails,
        },
      },
    })
      .then((users) => {
        resolve(users);
      })
      .catch((error) => {
        console.log({ error });
        reject(error);
      });
  });

module.exports = {
  getAll,
  add,
  getByEmail,
  getByUuid,
  getByEmails,
};
