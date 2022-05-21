const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/user/register', (req, res, next) => {
  res.send('respond with a resource');
});

router.get('/user/login', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
