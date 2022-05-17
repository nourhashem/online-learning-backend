var express = require('express');
var router = express.Router();
var classroomController = require('../controllers/classroom');
var userController = require('../controllers/user');
const classroom = require('../models/classroom');
const { USER_ROLES } = require('../utils/constants');
const { authToken } = require('../utils/jwt');

router.get('/', authToken, async (req, res, next) => {
  const user = await userController.getByUuid(req.userUuid);
  let classrooms;
  if (user.role === USER_ROLES.STUDENT) {
    classrooms = await user.getStudentClassrooms();
  }
  if (user.role === USER_ROLES.INSTRUCTOR) {
    classrooms = await user.getInstructorClassrooms();
  }
  const response = [];
  for (let i = 0; i < classrooms.length; i++) {
    const classroom = classrooms[i];
    const instructor = await classroom.getInstructor();
    const instructorName = `${instructor.firstName} ${instructor.lastName}`;
    const jsonClassroom = classroom.toJSON();
    jsonClassroom.instructor = instructorName;
    response.push(jsonClassroom);
  }
  res.send({ classrooms: response });
});

router.post('/', authToken, async (req, res, next) => {
  try {
    const myClassroom = await classroomController.add({
      code: req.body.code,
      semester: req.body.semester,
      schedule: req.body.schedule,
      campus: req.body.campus,
      section: req.body.section,
      title: req.body.title,
      instructorUuid: req.body.instructorUuid,
    });
    const studentsObj = await userController.getByEmails(
      req.body.studentsEmailsArray
    );
    myClassroom.addStudents(studentsObj);
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
