var express = require('express');
var router = express.Router();
var postController = require('../controllers/post');
const { authToken } = require('../utils/jwt');

router.get('/', authToken, async (req, res, next) => {
  const classroomUuid = req.query.classroomUuid;
  const posts = await postController.getAll(classroomUuid);
  const response = [];
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const owner = await post.getOwner();
    const ownerName = `${owner.firstName} ${owner.lastName}`;
    const jsonPost = post.toJSON();
    jsonPost.owner = ownerName;
    response.push(jsonPost);
  }
  res.send({ posts: response });
});

router.post('/', authToken, async (req, res, next) => {
  try {
    await postController.add({
      title: req.body.title,
      body: req.body.body,
      date: new Date().toISOString(),
      ownerUuid: req.userUuid,
      classroomUuid: req.body.classroomUuid,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

router.delete('/:uuid', authToken, async (req, res, next) => {
  const postUuid = req.params.uuid;
  const post = await postController.getByUuid(postUuid);
  const owner = await post.getOwner();
  const classroom = await post.getClassroom();
  const instructorUuid = classroom.instructorUuid;
  if (req.userUuid === owner.uuid || req.userUuid === instructorUuid) {
    await postController.remove(postUuid);
    res.send({ message: 'success' });
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
