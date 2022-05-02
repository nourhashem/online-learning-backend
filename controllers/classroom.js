const db = require('../models');

const add = (classroomObj) =>
  new Promise((resolve, reject) => {
    db.Classroom.create(classroomObj, {
      include: [db.Classroom.students],
    })
      .then((classrooms) => {
        resolve(classrooms);
      })
      .catch((error) => {
        if (error && error.errors) {
          const errorMessage = error.errors
            .map((errorObj) => errorObj.message)
            .join();
          reject(errorMessage);
        } else {
          reject('Classroom creation failed');
        }
      });
  });

const getAll = () =>
  new Promise((resolve, reject) => {
    db.Classroom.findAll()
      .then((classrooms) => resolve(classrooms))
      .catch((error) => reject(error));
  });

module.exports = {
  add,
  getAll,
};
