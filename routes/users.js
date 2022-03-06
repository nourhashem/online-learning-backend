var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', async (req, res, next) => {
  users = await userController.getAll();
  res.send({ users });
});

router.post('/', async (req, res, next) => {
  try {
    await userController.add({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

module.exports = router;
