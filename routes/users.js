var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');
const { USER_ROLES } = require('../utils/constants');
var comparePassword = require('../utils/password').comparePassword;
const jwtUtils = require('../utils/jwt');

router.get('/', jwtUtils.authToken, async (req, res, next) => {
  users = await userController.getAll();
  res.send({ users });
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await userController.add({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      role: USER_ROLES.STUDENT,
    });
    const token = jwtUtils.generateToken(user.uuid);
    res.send({ message: 'success', jwt: token });
  } catch (error) {
    res.send({ error });
  }
});

router.post('/signin', async (req, res, next) => {
  try {
    console.log('start');
    const user = await userController.getByEmail(req.body.email);
    console.log({ user });
    if (!user) {
      return res.send({ message: 'User does not exist', authenticated: false });
    }
    const isValid = await comparePassword(req.body.password, user.password);
    if (isValid) {
      const token = jwtUtils.generateToken(user.uuid);
      return res.send({
        message: 'success',
        authenticated: true,
        user: user.toJSON(),
        jwt: token,
      });
    } else {
      return res.send({ message: 'Incorrect password', authenticated: false });
    }
  } catch (error) {
    return res.send({ error });
  }
});

module.exports = router;
