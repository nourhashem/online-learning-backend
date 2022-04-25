const db = require('../models');

const getAll = () =>
  new Promise((resolve, reject) => {
    db.User.findAll()
      .then((users) => {
        resolve(users);
      })
      .catch((error) => {
        reject(error);
      });
  });

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

module.exports = {
  getAll,
  add,
  getByEmail,
};
