const db = require('./models');
const userController = require('./controllers/user');
const postController = require('./controllers/post');
const classroomController = require('./controllers/classroom');

const main = async (add) => {
  // CREATING
  try {
    // const student = await userController.add({
    //   firstName: 'Nour',
    //   lastName: 'Hashem',
    //   email: 'nour@gmail.com',
    //   password: '12345678',
    //   role: 'student',
    // });

    // const student2 = await userController.add({
    //   firstName: 'Ahmad',
    //   lastName: 'Nassar',
    //   email: 'ahmad@gmail.com',
    //   password: '12345678',
    //   role: 'student',
    // });

    // const instructor = await userController.add({
    //   firstName: 'Ibrahim',
    //   lastName: 'Ismail',
    //   email: 'ibrahim@gmail.com',
    //   password: '12345678',
    //   role: 'instructor',
    // });

    // const classroom = await classroomController.add({
    //   code: 'CENG685',
    //   title: 'Information Security',
    //   semester: 'fall 2023-2024',
    //   schedule: 'TTh 4:00-5:00',
    //   section: 'A',
    //   campus: 'Bekaa',
    //   instructorUuid: instructor.uuid,
    // });

    // const classroom2 = await classroomController.add({
    //   code: 'CENG420',
    //   title: 'Web Programming',
    //   semester: 'fall 2023-2024',
    //   schedule: 'TTh 2:00-3:00',
    //   section: 'B',
    //   campus: 'Bekaa',
    //   instructorUuid: instructor.uuid,
    // });

    // const post = await postController.add({
    //   title: 'My title',
    //   body: 'my body',
    //   date: new Date().toISOString(),
    //   ownerUuid: student.uuid,
    //   classroomUuid: classroom.uuid,
    // });

    // // READING

    const students = await userController.getByEmails([
      'ahmad@gmail.com',
      'nour@gmail.com',
      'ibrahim@gmail.com',
    ]);

    console.log('students', students);
    // const myStudent = await db.User.findByPk(student.uuid);
    // const myStudent2 = await db.User.findByPk(student2.uuid);
    // const myInstructor = await db.User.findByPk(instructor.uuid);
    // const myClassroom = await db.Classroom.findByPk(classroom.uuid);
    // const myClassroom2 = await db.Classroom.findByPk(classroom2.uuid);
    // const myPost = await db.Post.findByPk(post.uuid);

    // const studentPosts = await myStudent.getPosts();
    // console.log('studentPosts', studentPosts);

    // const postOwner = await myPost.getOwner();
    // console.log('postOwner', postOwner);

    // const postClassroom = await myPost.getClassroom();
    // console.log('postClassroom', postClassroom);

    // const classroomInstructor = await myClassroom.getInstructor();
    // console.log('classroomInstructor', classroomInstructor);

    // const classroomPosts = await myClassroom.getPosts();
    // console.log('classroomPosts', classroomPosts);

    // const instructorClassrooms = await myInstructor.getInstructorClassrooms();
    // console.log('instructorClassrooms', instructorClassrooms);

    //REGISTRING STUDENT IN CLASSROOM
    // await myClassroom.addStudents([myStudent, myStudent2]);
    // await myClassroom2.addStudents([myStudent, myStudent2]);

    // const studentClassrooms = await myStudent.getStudentClassrooms();
    // console.log('studentClassrooms', studentClassrooms);

    // const classroomStudents = await myClassroom.getStudents();
    // console.log('classroomStudents', classroomStudents);
  } catch (error) {
    console.log('error: ', error);
  }
};

main();

// const secret = require('crypto').randomBytes(64).toString('hex');
// console.log(secret);
