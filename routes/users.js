var express = require('express');
var router = express.Router();
var userController = require('../controllers/user');

router.get('/', async (req, res, next) => {
  users = await userController.getAll();
  res.send({ users });
});

// router.post('/', async (req, res, next) => {
//   try {
//     await userController.add({
//       firstName: 'Nour',
//       lastName: 'Ismail',
//       email: 'nour.ismail@gmail.com',
//     });
//     res.send('success');
//   } catch (error) {
//     res.send(error);
//   }
// });

module.exports = router;
