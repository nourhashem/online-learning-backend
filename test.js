const db = require('./models');
const userController = require('./controllers/user');
const postController = require('./controllers/post');
const classroomController = require('./controllers/classroom');

const addPost = (userUuid, classroomUuid) => {
  postController.add({
    title: 'My title',
    body: 'my body',
    date: new Date().toISOString(),
    ownerUuid: userUuid,
    classroomUuid: classroomUuid,
  });
};

const addClassroom = () => {
  classroomController
    .add({
      name: 'CENG685',
      fullName: 'Information Security',
      semester: 'fall 2023-2024',
      time: 'TTh 4:00-5:00',
      section: 'A',
      campus: 'Bekaa',
    })
    .catch((error) => console.log('error', error));
};

const getPost = async () => {
  const post = await postController.getAll();
  return post[0];
};

// addPost(
//   '43e2fbb9-094b-41c5-942a-21a69a54e02e',
//   'd3e290fe-1cce-42c9-b0cb-9f69e04872c9'
// );

// getPost().then((post) => {
//   console.log(post);
//   post.getOwner().then((owner) => {
//     console.log(owner.email);
//   });
// });

// userController.getAll().then((users) => {
//   const user = users[0];
//   user.getPosts().then(console.log);
// });

// addClassroom();

classroomController.getAll().then((classrooms) => {
  const classroom = classrooms[0];
  classroom.getPosts().then(console.log);
});
