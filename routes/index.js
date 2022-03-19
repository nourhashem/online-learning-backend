var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  console.log(req, res, next);
  res.send('root');
});

module.exports = router;
