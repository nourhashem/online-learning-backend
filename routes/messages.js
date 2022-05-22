const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message');

router.get('/', async (req, res, next) => {
  const { classroomUuid, offset } = req.query;
  const messages = await messageController.getAll(classroomUuid, {
    offset: Number(offset),
  });
  const response = [];
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const ownerObj = await message.getOwner();
    const owner = `${ownerObj.firstName} ${ownerObj.lastName}`;
    response.push({
      ...message.dataValues,
      owner,
    });
  }
  res.send({ messages: response });
});

module.exports = router;
