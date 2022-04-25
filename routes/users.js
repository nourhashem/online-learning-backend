var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
const { USER_ROLES } = require('../utils/constants');
var comparePassword = require('../utils/password').comparePassword;

router.get('/', async (req, res, next) => {
  users = await userController.getAll();
  res.send({ users });
});

router.post('/signup', async (req, res, next) => {
  try {
    await userController.add({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: USER_ROLES.STUDENT,
    });
    res.send({ message: 'success' });
  } catch (error) {
    res.send({ error });
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    const user = await userController.getByEmail(req.body.email);
    console.log({ user });
    if (!user) {
      return res.send({ message: 'User does not exist', authenticated: false });
    }
    const isValid = await comparePassword(req.body.password, user.password);
    if (isValid) {
      return res.send({
        message: 'success',
        authenticated: true,
        user: user.toJson(),
      });
    } else {
      return res.send({ message: 'Incorrect password', authenticated: false });
    }
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
