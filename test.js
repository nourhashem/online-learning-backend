const db = require('./models');
const userController = require('./controllers/user');
const postController = require('./controllers/post');

const addPost = (userUuid, classroomUuid) => {
  postController.add({
    title: 'My title',
    body: 'my body',
    date: new Date().toISOString(),
    ownerUuid: userUuid,
    classroomUuid: classroomUuid,
  });
};

const getPost = async () => {
  const post = await postController.getAll();
  return post[0];
};

// addPost('b51482db-1168-4db8-a592-db6b72e74dcc', 'classUuid');
getPost().then((post) => {
  console.log(post);
  post.getOwner().then((owner) => {
    console.log(owner.email);
  });
});
