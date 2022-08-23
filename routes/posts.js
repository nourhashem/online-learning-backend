var express = require('express');
const multer = require('multer');
var router = express.Router();
var postController = require('../controllers/post');
var commentController = require('../controllers/comment');
const { authToken } = require('../utils/jwt');
const fs = require('fs');

router.get('/', authToken, async (req, res, next) => {
  const classroomUuid = req.query.classroomUuid;
  const posts = await postController.getAll(classroomUuid);
  const response = [];
  for (let i = 0; i < posts.length; i++) {
    console.log('The posts are:' + posts);
    const post = posts[i];
    const owner = await post.getOwner();
    const ownerName = `${owner.firstName} ${owner.lastName}`;
    const jsonPost = post.toJSON();
    jsonPost.owner = ownerName;
    response.push(jsonPost);
  }
  res.send({ posts: response });
});

router.get('/:postUuid', authToken, async (req, res, next) => {
  try {
    const postUuid = req.params.postUuid;
    const post = await postController.getByUuid(postUuid);
    const owner = await post.getOwner();
    const ownerName = `${owner.firstName} ${owner.lastName}`;
    const jsonPost = post.toJSON();
    jsonPost.owner = ownerName;
    res.send({ post: jsonPost });
  } catch (error) {
    console.log(error);
    res.send({ error: 'cant get post' });
  }
});

router.post('/', authToken, async (req, res, next) => {
  try {
    const post = await postController.add({
      title: req.body.title,
      body: req.body.body,
      date: new Date().toISOString(),
      ownerUuid: req.userUuid,
      classroomUuid: req.body.classroomUuid,
    });
    res.send({ message: 'success', post });
  } catch (error) {
    res.send({ error });
  }
});

router.put('/', authToken, async (req, res, next) => {
  try {
    await postController.update({
      title: req.body.title,
      body: req.body.body,
      uuid: req.body.uuid,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

router.post('/comment', authToken, async (req, res, next) => {
  try {
    console.log(req.body);
    await commentController.add({
      comment: req.body.comment,
      date: new Date().toISOString(),
      timestamp: Date.now(),
      ownerUuid: req.userUuid,
      postUuid: req.body.postUuid,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});
const handleReq = async (req, res, next) => {
  const postUuid = req.params.uuid;
  const post = await postController.getByUuid(postUuid);
  if (post) {
    const owner = await post.getOwner();
    const classroom = await post.getClassroom();
    const instructorUuid = classroom.instructorUuid;
    if (req.userUuid === owner.uuid || req.userUuid === instructorUuid) {
      await postController.remove(postUuid);
      res.send({ message: 'success' });
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
};
router.delete('/:uuid', authToken, handleReq);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(`./attachments`)) {
      fs.mkdirSync('./attachments');
    }
    const dest = `./attachments/${req.body.postUuid}`;
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({
  storage: storage,
});

router.post(
  '/attachments',
  authToken,
  upload.array('attachments'),
  async (req, res, next) => {
    try {
      console.log(req.files);
      const files = req.files;
      for (let i = 0; i < files.length; i++) {
        await postController.attach({
          originalName: req.files[i].originalname,
          fileSize: req.files[i].size,
          postUuid: req.body.postUuid,
        });
      }
      console.log;
      res.send({ message: 'success' });
    } catch (error) {
      res.send({ error });
    }
  }
);

module.exports = router;
